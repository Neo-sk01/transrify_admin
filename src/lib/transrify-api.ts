import { TransrifyAdminState } from './types';

export class TransrifyApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'TransrifyApiError';
  }
}

export class TransrifyApiClient {
  private baseUrl: string;
  private authToken: string | undefined;

  constructor(baseUrl?: string, authToken?: string) {
    // Get base URL from env, default to production API if not set
    const envBaseUrl = process.env.TRANSRIFY_API_BASE_URL || 'https://carboapi.me/v1';
    // If baseUrl is provided, use it; otherwise use env variable
    this.baseUrl = baseUrl || envBaseUrl;
    // Remove trailing /v1 if present (we'll add it per endpoint)
    this.baseUrl = this.baseUrl.replace(/\/v1\/?$/, '');
    
    // Get auth token from parameter, env variable, or undefined
    this.authToken = authToken || process.env.ADMIN_SERVICE_TOKEN || process.env.ADMIN_ACCESS_TOKEN;
    
    console.log('🔧 TransrifyApiClient initialized:', {
      baseUrl: this.baseUrl,
      hasAuthToken: !!this.authToken
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('🌐 Making API request:', {
      method: options.method || 'GET',
      url: url,
      baseUrl: this.baseUrl,
      endpoint: endpoint
    });
    
    try {
      // Build headers with auth token if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };
      
      // Add Authorization header if token is available
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('📡 API Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ API Error response:', errorData);
        
        throw new TransrifyApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      console.log('✅ API Success response:', {
        dataKeys: Object.keys(data),
        sessionsCount: data.sessions?.length,
        incidentsCount: data.incidents?.length,
        eventLogsCount: data.eventLogs?.length
      });
      
      return data;
    } catch (error) {
      console.log('🚫 API Request error:', {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        message: error instanceof Error ? error.message : 'Unknown error',
        isTransrifyApiError: error instanceof TransrifyApiError
      });
      
      if (error instanceof TransrifyApiError) {
        throw error;
      }
      throw new TransrifyApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get admin dashboard state from Transrify API
   */
  async getAdminState(): Promise<TransrifyAdminState> {
    return this.request<TransrifyAdminState>('/v1/admin/state');
  }

  /**
   * Verify a session by ID
   */
  async verifySession(sessionId: string): Promise<{ sessionId: string; result: string }> {
    return this.request<{ sessionId: string; result: string }>(`/v1/sessions/verify/${sessionId}`);
  }

  /**
   * Login with credentials (for testing purposes)
   */
  async login(credentials: {
    tenantKey: string;
    customerRef: string;
    pin: string;
    deviceInfo: { device: string };
    geo: { lat: number; lng: number };
  }): Promise<{
    verdict: string;
    recommendedAction: string;
    sessionId: string;
  }> {
    return this.request('/v1/sessions/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Finalize evidence
   */
  async finalizeEvidence(evidence: {
    incidentId: string;
    kind: string;
    key: string;
    size: number;
    sha256: string;
  }): Promise<{ ok: boolean; id: string }> {
    return this.request('/v1/evidence/finalize', {
      method: 'POST',
      body: JSON.stringify(evidence),
    });
  }
}

// Default client instance
export const transrifyApi = new TransrifyApiClient();

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

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.TRANSRIFY_API_BASE_URL || 'http://localhost:3001';
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
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
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

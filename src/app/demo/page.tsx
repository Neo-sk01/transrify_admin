'use client';
import { useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/components/OfflineBanner';

export default function DemoPage() {
  const [tenantKey, setTenantKey] = useState('DEMO_BANK_KEY');
  const [customerRef, setCustomerRef] = useState('CUST-123');
  const [pin, setPin] = useState('1234');
  const [deviceInfo, setDeviceInfo] = useState('demo-browser');
  const [lat, setLat] = useState(37.7749);
  const [lng, setLng] = useState(-122.4194);
  const [sessionId, setSessionId] = useState('');
  const [out, setOut] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    try {
      const res = await fetch('/api/login', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ 
          tenantKey,
          customerRef, 
          pin,
          deviceInfo: { device: deviceInfo },
          geo: { lat, lng }
        }) 
      });
      const j = await res.json();
      setOut(j);
      if (j.sessionId) setSessionId(j.sessionId);
    } catch (error) {
      setOut({ error: 'Network error', details: error instanceof Error ? error.message : 'Unknown' });
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/verify?sessionId=${sessionId}`);
      const j = await res.json();
      setOut(j);
    } catch (error) {
      setOut({ error: 'Network error', details: error instanceof Error ? error.message : 'Unknown' });
    } finally {
      setLoading(false);
    }
  }

  function useNormalPin() {
    setPin('1234');
  }

  function useDuressPin() {
    setPin('9876');
  }

  function useInvalidCredentials() {
    setTenantKey('INVALID_KEY');
    setCustomerRef('INVALID-REF');
    setPin('0000');
  }

  function resetToDemo() {
    setTenantKey('DEMO_BANK_KEY');
    setCustomerRef('CUST-123');
    setPin('1234');
  }

  return (
    <>
      <OfflineBanner />
      <ErrorBoundary>
        <main className="p-6 space-y-6 max-w-2xl">
          <div>
            <h1 className="text-3xl font-bold">Transrify Demo</h1>
            <p className="text-gray-600 mt-2">Test the duress PIN authentication system</p>
          </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Authentication Details</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Tenant Key</label>
              <input 
                className="border rounded p-2 w-full font-mono text-sm" 
                value={tenantKey} 
                onChange={e => setTenantKey(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Customer Reference</label>
              <input 
                className="border rounded p-2 w-full font-mono text-sm" 
                value={customerRef} 
                onChange={e => setCustomerRef(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">PIN</label>
              <input 
                className="border rounded p-2 w-full font-mono text-sm" 
                value={pin} 
                onChange={e => setPin(e.target.value)} 
                type="password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Device Info</label>
              <input 
                className="border rounded p-2 w-full text-sm" 
                value={deviceInfo} 
                onChange={e => setDeviceInfo(e.target.value)} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input 
                  className="border rounded p-2 w-full text-sm" 
                  type="number" 
                  step="0.0001"
                  value={lat} 
                  onChange={e => setLat(parseFloat(e.target.value))} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input 
                  className="border rounded p-2 w-full text-sm" 
                  type="number" 
                  step="0.0001"
                  value={lng} 
                  onChange={e => setLng(parseFloat(e.target.value))} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Test Scenarios</h2>
          
          <div className="space-y-2">
            <button 
              onClick={useNormalPin} 
              className="w-full px-3 py-2 rounded bg-green-100 text-green-800 hover:bg-green-200 text-sm"
            >
              ✅ Normal Authentication (PIN: 1234)
            </button>
            
            <button 
              onClick={useDuressPin} 
              className="w-full px-3 py-2 rounded bg-red-100 text-red-800 hover:bg-red-200 text-sm"
            >
              🚨 Duress Authentication (PIN: 9876)
            </button>
            
            <button 
              onClick={useInvalidCredentials} 
              className="w-full px-3 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm"
            >
              ❌ Invalid Credentials
            </button>
            
            <button 
              onClick={resetToDemo} 
              className="w-full px-3 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm"
            >
              🔄 Reset to Demo Defaults
            </button>
          </div>

          <div className="flex gap-2 pt-4">
            <button 
              onClick={login} 
              disabled={loading}
              className="flex-1 px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
            <button 
              onClick={verify} 
              disabled={loading || !sessionId}
              className="flex-1 px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Session'}
            </button>
          </div>
        </div>
      </div>

      {out && (
        <div className="space-y-2">
          <h3 className="font-semibold">API Response</h3>
          <pre className="bg-gray-50 border rounded p-3 overflow-auto text-xs">
            {JSON.stringify(out, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How to Test</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Use the quick scenario buttons to test different authentication flows</li>
          <li>Click <strong>Login</strong> to authenticate with the Transrify API</li>
          <li>Open <code className="bg-blue-100 px-1 rounded">/admin</code> in another tab to see real-time updates</li>
          <li>Watch sessions and incidents appear in the admin dashboard</li>
          <li>Use <strong>Verify Session</strong> to check session status</li>
        </ol>
      </div>
        </main>
      </ErrorBoundary>
    </>
  );
}
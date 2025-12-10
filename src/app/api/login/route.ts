import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { transrifyApi, TransrifyApiError } from '@/lib/transrify-api';

const Body = z.object({ 
  tenantKey: z.string().optional().default('DEMO_BANK_KEY'),
  customerRef: z.string().min(1), 
  pin: z.string().min(4).max(12),
  deviceInfo: z.object({
    device: z.string().optional().default('demo-device')
  }).optional().default({ device: 'demo-device' }),
  geo: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional().default({ lat: 37.7749, lng: -122.4194 })
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const loginData = Body.parse(body);

    // Call the actual Transrify API
    const result = await transrifyApi.login(loginData);

    return NextResponse.json({
      ok: true,
      sessionId: result.sessionId,
      verdict: result.verdict,
      recommendedAction: result.recommendedAction,
      status: result.verdict.toLowerCase() // For backward compatibility
    });

  } catch (error) {
    console.error('Demo login failed:', error);
    
    if (error instanceof TransrifyApiError) {
      return NextResponse.json({
        ok: false,
        error: error.message,
        status: error.status
      }, { status: error.status || 500 });
    }

    return NextResponse.json({
      ok: false,
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
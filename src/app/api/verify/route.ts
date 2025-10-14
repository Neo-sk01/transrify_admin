import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { transrifyApi, TransrifyApiError } from '@/lib/transrify-api';

const Q = z.object({ sessionId: z.string() });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { sessionId } = Q.parse({ sessionId: searchParams.get('sessionId') });
    
    console.log('🔄 Demo verify request for session:', sessionId);

    // Call the actual Transrify API
    const result = await transrifyApi.verifySession(sessionId);
    
    console.log('✅ Transrify API verify response:', result);

    return NextResponse.json({
      ok: true,
      sessionId: result.sessionId,
      result: result.result,
      status: result.result.toLowerCase() // For backward compatibility
    });

  } catch (error) {
    console.error('❌ Demo verify failed:', error);
    
    if (error instanceof TransrifyApiError) {
      return NextResponse.json({
        ok: false,
        error: error.message,
        status: error.status
      }, { status: error.status || 500 });
    }

    return NextResponse.json({
      ok: false,
      error: 'Verify failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
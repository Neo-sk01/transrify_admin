import { NextRequest, NextResponse } from 'next/server';
import { transrifyApi, TransrifyApiError } from '@/lib/transrify-api';
import { readAll } from '@/lib/ledger';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (token !== process.env.ADMIN_ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    // Fetch data from Transrify API
    const transrifyData = await transrifyApi.getAdminState();
    
    // Keep local ledger for now (can be removed if not needed)
    const ledger = readAll();
    const last = ledger.slice(Math.max(0, ledger.length - 200));

    return NextResponse.json({ 
      ok: true, 
      sessions: transrifyData.sessions,
      incidents: transrifyData.incidents,
      eventLogs: transrifyData.eventLogs,
      ledger: last // Legacy ledger data
    });
  } catch (error) {
    console.error('Failed to fetch Transrify admin state:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: error instanceof TransrifyApiError ? error.status : undefined
    });
    
    if (error instanceof TransrifyApiError) {
      return NextResponse.json({ 
        ok: false, 
        error: `Transrify API Error: ${error.message}`,
        status: error.status 
      }, { status: error.status || 500 });
    }
    
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch admin state from Transrify API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
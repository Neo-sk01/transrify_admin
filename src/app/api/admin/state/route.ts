import { NextRequest, NextResponse } from 'next/server';
import { transrifyApi, TransrifyApiError } from '@/lib/transrify-api';
import { readAll } from '@/lib/ledger';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (token !== process.env.ADMIN_ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    console.log('🔄 Attempting to fetch data from Transrify API...');
    console.log('🌐 API Base URL:', process.env.TRANSRIFY_API_BASE_URL);
    
    // Fetch data from Transrify API
    const transrifyData = await transrifyApi.getAdminState();
    
    console.log('✅ Successfully received data from Transrify API');
    console.log('📊 Sessions count:', transrifyData.sessions?.length || 0);
    console.log('🚨 Incidents count:', transrifyData.incidents?.length || 0);
    console.log('📝 Event logs count:', transrifyData.eventLogs?.length || 0);
    
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
    console.error('❌ Failed to fetch Transrify admin state:', error);
    console.log('🔍 Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    if (error instanceof TransrifyApiError) {
      console.log('🚫 TransrifyApiError details:', {
        status: error.status,
        response: error.response
      });
      
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
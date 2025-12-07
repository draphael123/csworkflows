import { NextResponse } from 'next/server';
import { fetchGoogleDocContent, setCachedSections } from '@/lib/google-docs';

/**
 * Cron job endpoint for daily document sync
 * Configure in Vercel: https://vercel.com/docs/cron-jobs
 * 
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync-docs",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  // Verify this is a cron request (Vercel adds a header)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const docId = process.env.GOOGLE_DOC_ID;
    
    if (!docId) {
      return NextResponse.json(
        { error: 'GOOGLE_DOC_ID not configured' },
        { status: 500 }
      );
    }

    const sections = await fetchGoogleDocContent(docId);
    
    if (sections.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No sections found. Google Docs integration may need configuration.',
      });
    }

    setCachedSections(sections);

    return NextResponse.json({
      success: true,
      message: 'Document synced successfully',
      sectionsCount: sections.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron sync error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to sync document',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}



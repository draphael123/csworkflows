import { NextRequest, NextResponse } from 'next/server';
import { fetchGoogleDocContent, setCachedSections, parseDocumentSections } from '@/lib/google-docs';

export async function POST(request: NextRequest) {
  try {
    const docId = process.env.GOOGLE_DOC_ID;
    
    if (!docId) {
      return NextResponse.json(
        { error: 'GOOGLE_DOC_ID not configured' },
        { status: 500 }
      );
    }

    // Fetch document content
    const sections = await fetchGoogleDocContent(docId);
    
    // If fetchGoogleDocContent returns empty (not yet implemented),
    // we'll use a placeholder for now
    if (sections.length === 0) {
      // TODO: Implement actual Google Docs API integration
      // For now, return a message indicating sync is needed
      return NextResponse.json({
        success: false,
        message: 'Google Docs integration needs to be configured. Please see documentation.',
        sectionsCount: 0,
      });
    }

    // Cache the sections
    setCachedSections(sections);

    return NextResponse.json({
      success: true,
      message: 'Document synced successfully',
      sectionsCount: sections.length,
    });
  } catch (error) {
    console.error('Sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to sync document', 
        message: errorMessage,
        details: errorMessage.includes('publicly accessible') 
          ? 'The Google Doc must be shared publicly. Go to Share → Change to "Anyone with the link" → Viewer'
          : errorMessage
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET() {
  const { getCachedSections, getLastSyncTime } = await import('@/lib/google-docs');
  const sections = getCachedSections();
  const lastSync = getLastSyncTime();

  return NextResponse.json({
    sectionsCount: sections.length,
    lastSyncTime: lastSync?.toISOString() || null,
    isSynced: sections.length > 0,
  });
}



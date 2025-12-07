import { NextRequest, NextResponse } from 'next/server';
import { queryClaude } from '@/lib/claude';
import { getCachedSections, setCachedSections, fetchGoogleDocContent } from '@/lib/google-docs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get cached document sections
    let sections = getCachedSections();

    // If no cached sections, try to fetch them on-demand
    // This ensures the chat works even if sync hasn't run yet
    if (sections.length === 0) {
      const docId = process.env.GOOGLE_DOC_ID;
      if (docId) {
        try {
          console.log('No cached sections, fetching on-demand...');
          sections = await fetchGoogleDocContent(docId);
          if (sections.length > 0) {
            // Cache for this function execution
            setCachedSections(sections);
          }
        } catch (error) {
          console.error('Failed to fetch doc on-demand:', error);
        }
      }
    }

    if (sections.length === 0) {
      return NextResponse.json(
        {
          answer: 'The knowledge base is currently being synced. Please click "Sync Docs" button to sync the document first.',
          citations: [],
        },
        { status: 200 }
      );
    }

    // Query Claude with document context
    const response = await queryClaude(message, sections);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}



import { NextRequest, NextResponse } from 'next/server';
import { queryClaude } from '@/lib/claude';
import { getCachedSections } from '@/lib/google-docs';

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
    const sections = getCachedSections();

    if (sections.length === 0) {
      return NextResponse.json(
        {
          answer: 'The knowledge base is currently being synced. Please try again in a few moments.',
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



import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface ChatResponse {
  answer: string;
  citations: Citation[];
}

export interface Citation {
  section: string;
  excerpt: string;
  sectionIndex: number;
}

/**
 * Searches document sections for relevant content
 */
function findRelevantSections(
  query: string,
  sections: Array<{ title: string; content: string; sectionIndex: number }>,
  maxSections: number = 3
): Array<{ title: string; content: string; sectionIndex: number }> {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  // Score sections based on keyword matches
  const scoredSections = sections.map(section => {
    const contentLower = (section.title + ' ' + section.content).toLowerCase();
    let score = 0;
    
    for (const word of queryWords) {
      if (word.length > 2) { // Ignore very short words
        const matches = (contentLower.match(new RegExp(word, 'g')) || []).length;
        score += matches;
      }
    }
    
    return { ...section, score };
  });
  
  // Sort by score and return top sections
  return scoredSections
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSections)
    .map(({ score, ...section }) => section);
}

/**
 * Formats context from document sections for Claude
 */
function formatContext(sections: Array<{ title: string; content: string; sectionIndex: number }>): string {
  return sections.map((section, idx) => {
    return `[Section ${section.sectionIndex + 1}: ${section.title}]\n${section.content}\n`;
  }).join('\n---\n\n');
}

/**
 * Extracts citations from Claude's response
 */
function extractCitations(
  response: string,
  sections: Array<{ title: string; content: string; sectionIndex: number }>
): Citation[] {
  const citations: Citation[] = [];
  
  // Look for section references in the response
  sections.forEach(section => {
    const sectionTitleLower = section.title.toLowerCase();
    const responseLower = response.toLowerCase();
    
    // Check if section is mentioned in response
    if (responseLower.includes(sectionTitleLower) || 
        response.includes(`Section ${section.sectionIndex + 1}`)) {
      // Extract a relevant excerpt (first 200 chars of section content)
      const excerpt = section.content.substring(0, 200).trim() + '...';
      
      citations.push({
        section: section.title,
        excerpt,
        sectionIndex: section.sectionIndex,
      });
    }
  });
  
  return citations;
}

/**
 * Sends a query to Claude with document context
 */
export async function queryClaude(
  userQuery: string,
  documentSections: Array<{ title: string; content: string; sectionIndex: number }>
): Promise<ChatResponse> {
  try {
    // Find relevant sections
    const relevantSections = findRelevantSections(userQuery, documentSections);
    
    if (relevantSections.length === 0) {
      return {
        answer: "I couldn't find relevant information in the documentation to answer your question. Please try rephrasing your query or contact support for assistance.",
        citations: [],
      };
    }
    
    // Format context
    const context = formatContext(relevantSections);
    
    // System prompt
    const systemPrompt = `You are a helpful customer service assistant for Fountain TRT, a telemedicine company. Your role is to answer questions based on the provided documentation.

Guidelines:
- Answer questions accurately using only the provided documentation
- Keep responses to a maximum of 2 paragraphs
- Always cite the specific section when referencing information (e.g., "According to Section X: [Title]...")
- If information is not in the documentation, clearly state that
- Use a professional, medical-appropriate tone
- Be concise and helpful`;

    // User message with context
    const userMessage = `Documentation Context:\n\n${context}\n\nUser Question: ${userQuery}`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Extract response text
    const responseText = message.content
      .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // Extract citations
    const citations = extractCitations(responseText, relevantSections);

    return {
      answer: responseText,
      citations,
    };
  } catch (error) {
    console.error('Error querying Claude:', error);
    throw new Error('Failed to get response from AI. Please try again.');
  }
}



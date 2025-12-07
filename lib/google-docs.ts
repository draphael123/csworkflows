import { fetchAndParseGoogleDoc } from './google-docs-simple';

export interface DocumentSection {
  title: string;
  content: string;
  sectionIndex: number;
}

/**
 * Fetches and parses content from a Google Doc
 * Uses public export method for publicly shared documents
 */
export async function fetchGoogleDocContent(docId: string): Promise<DocumentSection[]> {
  try {
    return await fetchAndParseGoogleDoc(docId);
  } catch (error) {
    console.error('Error fetching Google Doc:', error);
    throw error;
  }
}

/**
 * Parses document content into sections
 */
export function parseDocumentSections(content: string): DocumentSection[] {
  // Simple parsing logic - can be enhanced based on actual doc structure
  const sections: DocumentSection[] = [];
  const lines = content.split('\n');
  
  let currentSection: DocumentSection | null = null;
  let sectionIndex = 0;
  
  for (const line of lines) {
    // Detect section headers (lines that are all caps, bold, or have specific formatting)
    if (line.trim().length > 0 && 
        (line.trim().toUpperCase() === line.trim() || 
         line.trim().startsWith('#') ||
         line.trim().length < 100 && line.trim().endsWith(':'))) {
      
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: line.trim(),
        content: '',
        sectionIndex: sectionIndex++,
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }
  
  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

// Re-export storage functions for backward compatibility
export { getCachedSections, setCachedSections, getLastSyncTime } from './storage';


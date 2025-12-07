/**
 * Simplified Google Docs integration using public export
 * This is a fallback approach that works with publicly shared Google Docs
 */

export interface DocumentSection {
  title: string;
  content: string;
  sectionIndex: number;
}

/**
 * Fetches Google Doc content using the public export URL
 * This works for publicly shared documents without authentication
 * 
 * IMPORTANT: The Google Doc must be shared publicly (Anyone with the link can view)
 * for this to work without authentication.
 */
export async function fetchGoogleDocViaExport(docId: string): Promise<string> {
  try {
    // Use the export URL format for Google Docs
    // Format: https://docs.google.com/document/d/{DOC_ID}/export?format=txt
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    
    const response = await fetch(exportUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KnowledgeHub/1.0)',
      },
      // Add cache control to ensure fresh content
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Document is not publicly accessible. Please share it publicly (Anyone with the link can view).');
      }
      throw new Error(`Failed to fetch document: ${response.statusText} (${response.status})`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error fetching Google Doc via export:', error);
    throw error;
  }
}

/**
 * Parses document content into sections based on headings
 */
export function parseDocumentSections(content: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  const lines = content.split('\n');
  
  let currentSection: DocumentSection | null = null;
  let sectionIndex = 0;
  let currentContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
    
    // Detect section headers:
    // 1. Lines that are all caps and short
    // 2. Lines followed by a separator (---, ===, etc.)
    // 3. Lines that are standalone and short (potential titles)
    const isHeader = 
      (line.length > 0 && line.length < 100) &&
      (
        line.toUpperCase() === line && line.length > 3 && line.length < 50 ||
        nextLine.match(/^[-=]{3,}$/) ||
        (line.length < 80 && !line.includes('.') && i > 0 && lines[i - 1].trim() === '')
      );
    
    if (isHeader && line.length > 0) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
      }
      
      // Start new section
      currentSection = {
        title: line,
        content: '',
        sectionIndex: sectionIndex++,
      };
      currentContent = [];
      
      // Skip separator line if present
      if (nextLine.match(/^[-=]{3,}$/)) {
        i++;
      }
    } else if (currentSection && line.length > 0) {
      currentContent.push(lines[i]);
    }
  }
  
  // Add last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }
  }
  
  // If no sections were found, create one section with all content
  if (sections.length === 0 && content.trim().length > 0) {
    sections.push({
      title: 'Document Content',
      content: content.trim(),
      sectionIndex: 0,
    });
  }
  
  return sections;
}

/**
 * Main function to fetch and parse Google Doc
 */
export async function fetchAndParseGoogleDoc(docId: string): Promise<DocumentSection[]> {
  try {
    const content = await fetchGoogleDocViaExport(docId);
    const sections = parseDocumentSections(content);
    return sections;
  } catch (error) {
    console.error('Error in fetchAndParseGoogleDoc:', error);
    throw error;
  }
}


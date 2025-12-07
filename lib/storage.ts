/**
 * Simple persistent storage for Vercel serverless functions
 * Uses a combination of approaches that work on Vercel
 */

import { DocumentSection } from './google-docs';

// For Vercel, we'll use a simple approach: store in a global variable
// that persists for the duration of the function execution
// For production, consider using Vercel KV, Edge Config, or a database

let globalCache: {
  sections: DocumentSection[];
  lastSync: Date | null;
} = {
  sections: [],
  lastSync: null,
};

export function getCachedSections(): DocumentSection[] {
  return globalCache.sections;
}

export function setCachedSections(sections: DocumentSection[]): void {
  globalCache.sections = sections;
  globalCache.lastSync = new Date();
}

export function getLastSyncTime(): Date | null {
  return globalCache.lastSync;
}

// Note: This won't persist across different serverless function invocations
// For true persistence, you'd need:
// - Vercel KV (Redis)
// - Vercel Edge Config
// - A database (PostgreSQL, etc.)
// - Or fetch the doc on every request (less efficient but works)


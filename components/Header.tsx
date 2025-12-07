'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    console.log('Sync button clicked');
    setIsSyncing(true);
    setSyncStatus('idle');
    
    try {
      console.log('Fetching /api/sync...');
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        // Handle error response
        const errorMessage = data.error || data.message || 'Failed to sync document';
        alert(`Sync Error: ${errorMessage}\n\nDetails: ${data.details || 'Unknown error'}\n\nPlease ensure:\n1. Google Doc is publicly shared (Anyone with link can view)\n2. GOOGLE_DOC_ID is set in Vercel environment variables`);
        setSyncStatus('error');
        setIsSyncing(false);
        return;
      }
      
      if (data.success) {
        setSyncStatus('success');
        alert(`Success! Synced ${data.sectionsCount || 0} sections from the document.`);
        // Refresh the page after 1 second to show synced content
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorMessage = data.message || 'Sync failed';
        alert(`Sync Error: ${errorMessage}`);
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert(`Sync Error: ${error instanceof Error ? error.message : 'Network error. Please check your connection and try again.'}`);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Fountain TRT Knowledge Hub
            </h1>
            <p className="text-xs text-gray-500">Customer Service Assistant</p>
          </div>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            syncStatus === 'success'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : syncStatus === 'error'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-primary text-white hover:bg-primary-dark'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Sync knowledge base from Google Doc"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Syncing...
            </>
          ) : syncStatus === 'success' ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Synced!
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Sync Docs
            </>
          )}
        </button>
      </div>
    </header>
  );
}



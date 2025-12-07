'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSyncStatus('success');
        // Refresh the page after 1 second to show synced content
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Sync error:', error);
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



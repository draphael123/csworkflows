'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Message } from './ChatInterface';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [expandedCitations, setExpandedCitations] = useState(false);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-3xl">
          <div className="bg-primary text-white rounded-2xl px-4 py-3 shadow-sm">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown className="text-gray-700">{message.content}</ReactMarkdown>
          </div>

          {message.citations && message.citations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setExpandedCitations(!expandedCitations)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-colors"
              >
                {expandedCitations ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Hide Sources ({message.citations.length})
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show Sources ({message.citations.length})
                  </>
                )}
              </button>

              {expandedCitations && (
                <div className="mt-3 space-y-2">
                  {message.citations.map((citation, idx) => (
                    <div
                      key={idx}
                      className="bg-accent-light rounded-lg p-3 text-sm"
                    >
                      <div className="font-medium text-primary mb-1">
                        {citation.section}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {citation.excerpt}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



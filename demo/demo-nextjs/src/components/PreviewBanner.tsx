'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function PreviewBanner({ isEnabled }: { isEnabled: boolean }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  if (!isEnabled) return null;

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 z-50 w-8 h-8 bg-gray-900 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
        title="Preview Mode Active"
      >
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="font-medium text-sm">Preview Mode</span>
      <a
        href={`/api/preview/exit?path=${encodeURIComponent(pathname)}`}
        className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
      >
        Exit
      </a>
      <button
        onClick={() => setIsExpanded(false)}
        className="ml-1 text-gray-400 hover:text-white transition-colors"
        title="Minimize"
      >
        ×
      </button>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, FileCode, ArrowRight } from 'lucide-react';

interface SymbolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: any) => void;
}

const SAMPLE_SYMBOLS = [
  { name: 'authController.ts', path: 'backend/src/controllers/authController.ts', type: 'File', risk: 'CRITICAL' },
  { name: 'internActivityController.ts', path: 'backend/src/controllers/internActivityController.ts', type: 'File', risk: 'HIGH' },
  { name: 'taskController.ts', path: 'backend/src/controllers/taskController.ts', type: 'File', risk: 'HIGH' },
  { name: 'services/ai.ts', path: 'backend/src/services/ai.ts', type: 'File', risk: 'MEDIUM' },
  { name: 'services/mail.ts', path: 'backend/src/services/mail.ts', type: 'File', risk: 'MEDIUM' },
  { name: 'login/page.tsx', path: 'frontend/src/app/login/page.tsx', type: 'File', risk: 'LOW' },
  { name: 'Sidebar.tsx', path: 'frontend/src/components/Sidebar.tsx', type: 'File', risk: 'LOW' }
];

export default function SymbolSearchModal({
  isOpen,
  onClose,
  onSelectSymbol
}: SymbolSearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SAMPLE_SYMBOLS.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.path.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center px-4 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-4 h-4 text-indigo-600 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search file symbol, function, or route... (Cmd+K)"
            className="w-full py-3.5 bg-transparent text-sm text-slate-900 placeholder-slate-400 font-mono focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs font-mono">
              No matching file symbol found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectSymbol(item);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/60 cursor-pointer group border border-transparent hover:border-indigo-100 transition"
              >
                <div className="flex items-center space-x-3">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 font-mono block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {item.path}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {item.risk}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

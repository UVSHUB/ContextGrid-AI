'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, FileCode, Wand2 } from 'lucide-react';

interface Patch {
  targetFile: string;
  originalSnippet: string;
  patchedCode: string;
  diffSummary: string;
}

interface SelfHealingPatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patches: Patch[];
}

export default function SelfHealingPatchModal({
  isOpen,
  onClose,
  patches
}: SelfHealingPatchModalProps) {
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden space-y-4 p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-mono">
                Gemini 2.0 Flash Self-Healing Refactor Patch
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                1-Click Autonomous Patch Applicator across {patches.length} Downstream Component(s)
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 font-mono text-xs">
          {patches.map((patch, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-900 font-bold flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  <span>{patch.targetFile}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                  AI Diff Patch
                </span>
              </div>

              <p className="text-[11px] text-slate-600 font-sans">{patch.diffSummary}</p>

              {/* Side-by-side / Unified Diff Snippet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-800 space-y-1">
                  <span className="text-[10px] text-rose-700 font-bold uppercase block">Original (Breaking)</span>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono">{patch.originalSnippet}</pre>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Patched (Self-Healed)</span>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono">{patch.patchedCode}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-mono font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setApplied(true);
              setTimeout(() => {
                setApplied(false);
                onClose();
              }, 1200);
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-indigo-100 transition"
          >
            {applied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Applied Refactor Patches!</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Apply 1-Click Refactor Patches</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

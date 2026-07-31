'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, CheckCircle2, FileCode, ArrowRight, Wand2 } from 'lucide-react';

interface PatchItem {
  targetFile: string;
  originalSnippet: string;
  patchedCode: string;
  diffSummary: string;
}

interface SelfHealingPatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patches: PatchItem[];
}

export default function SelfHealingPatchModal({
  isOpen,
  onClose,
  patches
}: SelfHealingPatchModalProps) {
  const [applied, setApplied] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const handleApplyPatch = (index: number) => {
    setApplied((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-card rounded-2xl border border-border p-6 shadow-2xl glass-panel relative space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
              <Wand2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Autonomous Self-Healing Refactor Patches</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30 font-mono">
                  Gemini 2.0 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                1-Click auto-fix refactoring to preserve backward compatibility across dependent files.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
          {patches.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-accent-purple mx-auto mb-2 opacity-50" />
              <p className="text-sm">No auto-fix patches required. Code signatures are backward compatible!</p>
            </div>
          ) : (
            patches.map((patch, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono text-xs text-accent-cyan">
                    <FileCode className="w-4 h-4" />
                    <span>{patch.targetFile}</span>
                  </div>
                  <button
                    onClick={() => handleApplyPatch(idx)}
                    disabled={applied[idx]}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                      applied[idx]
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : 'bg-accent-purple text-white hover:bg-accent-purple/90 shadow-md shadow-accent-purple/20'
                    }`}
                  >
                    {applied[idx] ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Patch Applied</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>1-Click Auto-Fix</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {patch.diffSummary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded bg-red-950/30 border border-red-900/40 text-red-300">
                    <span className="text-[10px] text-red-400 font-bold uppercase block mb-1">
                      Original Line
                    </span>
                    <code>{patch.originalSnippet}</code>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">
                      Refactored Compatible Patch
                    </span>
                    <code>{patch.patchedCode}</code>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

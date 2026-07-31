'use client';

import React from 'react';
import {
  X,
  FileCode,
  Code,
  Layers,
  Sparkles,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GitCommit
} from 'lucide-react';

interface NodeSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: any;
  onTriggerAutoFix: () => void;
}

export default function NodeSlideOver({
  isOpen,
  onClose,
  nodeData,
  onTriggerAutoFix
}: NodeSlideOverProps) {
  if (!isOpen || !nodeData) return null;

  const fileName = nodeData.label || nodeData.path?.split('/').pop() || 'File';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl glass-panel p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono">{fileName}</h2>
            <span className="text-[11px] text-slate-400 font-mono block">Node Symbol Inspector</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* File Metadata */}
      <div className="space-y-3 text-xs">
        <div>
          <label className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            File Path
          </label>
          <p className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-200 break-all text-[11px]">
            {nodeData.path || 'src/schemas/UserSchema.ts'}
          </p>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400 font-semibold">Architectural Hotspot Risk</span>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-bold font-mono border ${
              nodeData.risk === 'CRITICAL'
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : nodeData.risk === 'HIGH'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
            }`}
          >
            {nodeData.risk || 'CRITICAL'} (Score: 88/100)
          </span>
        </div>
      </div>

      {/* Defined AST Symbols / Functions */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Code className="w-3.5 h-3.5 text-accent-purple" />
          <span>Extracted AST Symbols & Functions</span>
        </label>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {(nodeData.functions || ['handleRequest', 'validateInput', 'parseSchema']).map(
            (func: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-200"
              >
                <span>{func}()</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )
          )}
        </div>
      </div>

      {/* Dependent Propagation Tree */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Downstream Propagation Breakdown</span>
        </label>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300">
          <div className="flex items-center space-x-2 text-accent-blue font-bold">
            <GitCommit className="w-3.5 h-3.5" />
            <span>{fileName}</span>
          </div>
          <div className="pl-4 border-l border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-amber-400">
              <ArrowRight className="w-3 h-3 shrink-0" />
              <span>AuthController.ts (Depth 1)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-blue-400 pl-3">
              <ArrowRight className="w-3 h-3 shrink-0" />
              <span>api/users/route.ts (Depth 2)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gemini AI Impact Reasoner Summary */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
        <div className="flex items-center space-x-1.5 text-xs text-accent-purple font-semibold">
          <Sparkles className="w-4 h-4 text-accent-purple" />
          <span>Gemini 2.0 Flash Warning</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Modifying {fileName} impacts downstream modules. Ensure type export signatures remain backward-compatible to avoid breaking JWT authentication in AuthController.ts.
        </p>
      </div>

      {/* 1-Click Auto-Fix Action */}
      <button
        onClick={() => {
          onClose();
          onTriggerAutoFix();
        }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold text-xs flex items-center justify-center space-x-2 hover:opacity-95 transition shadow-lg shadow-accent-purple/20"
      >
        <Wand2 className="w-4 h-4" />
        <span>Generate 1-Click Self-Healing Refactor Patch</span>
      </button>
    </div>
  );
}

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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-mono">{fileName}</h2>
            <span className="text-[11px] text-slate-500 font-mono block">Node Symbol Inspector</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* File Metadata */}
      <div className="space-y-3 text-xs">
        <div>
          <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-1">
            File Path
          </label>
          <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 break-all text-[11px]">
            {nodeData.path || 'src/schemas/UserSchema.ts'}
          </p>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-600 font-semibold">Architectural Hotspot Risk</span>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-bold font-mono border ${
              nodeData.risk === 'CRITICAL'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : nodeData.risk === 'HIGH'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            {nodeData.risk || 'CRITICAL'} (Score: 88/100)
          </span>
        </div>
      </div>

      {/* Defined AST Symbols / Functions */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
          <Code className="w-3.5 h-3.5 text-purple-600" />
          <span>Extracted AST Symbols & Functions</span>
        </label>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {(nodeData.functions || ['handleRequest', 'validateInput', 'parseSchema']).map(
            (func: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800"
              >
                <span>{func}()</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            )
          )}
        </div>
      </div>

      {/* Dependent Propagation Tree */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-600" />
          <span>Downstream Propagation Breakdown</span>
        </label>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1.5 text-slate-800">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold">
            <GitCommit className="w-3.5 h-3.5" />
            <span>{fileName}</span>
          </div>
          <div className="pl-4 border-l border-slate-200 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-amber-700">
              <ArrowRight className="w-3 h-3 shrink-0" />
              <span>AuthController.ts (Depth 1)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-indigo-700 pl-3">
              <ArrowRight className="w-3 h-3 shrink-0" />
              <span>api/users/route.ts (Depth 2)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gemini AI Impact Reasoner Summary */}
      <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
        <div className="flex items-center space-x-1.5 text-xs text-purple-700 font-semibold">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Gemini 2.0 Flash Warning</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Modifying {fileName} impacts downstream modules. Ensure type export signatures remain backward-compatible to avoid breaking JWT authentication in AuthController.ts.
        </p>
      </div>

      {/* 1-Click Auto-Fix Action */}
      <button
        onClick={() => {
          onClose();
          onTriggerAutoFix();
        }}
        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-indigo-100 transition"
      >
        <Wand2 className="w-4 h-4" />
        <span>Generate 1-Click Self-Healing Refactor Patch</span>
      </button>
    </div>
  );
}

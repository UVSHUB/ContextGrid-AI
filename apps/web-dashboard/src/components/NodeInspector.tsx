'use client';

import React from 'react';
import { X, FileCode, Code, Layers, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface NodeInspectorProps {
  nodeData: any;
  onClose: () => void;
}

export default function NodeInspector({ nodeData, onClose }: NodeInspectorProps) {
  if (!nodeData) return null;

  return (
    <div className="w-full bg-card rounded-2xl border border-border p-5 glass-panel">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <FileCode className="w-5 h-5 text-accent-blue" />
          <h3 className="text-base font-bold text-white font-mono">
            {nodeData.label || nodeData.path}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 space-y-4 text-xs">
        <div>
          <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-1">
            File Path
          </label>
          <p className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-slate-200">
            {nodeData.path || 'src/schemas/UserSchema.ts'}
          </p>
        </div>

        <div>
          <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-1">
            Vulnerability Hotspot Risk
          </label>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
              {nodeData.risk || 'CRITICAL'}
            </span>
            <span className="text-slate-400 font-mono">
              Depth Level: 1
            </span>
          </div>
        </div>

        <div>
          <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-2 flex items-center space-x-1">
            <Code className="w-3.5 h-3.5 text-accent-purple" />
            <span>Defined AST Symbols / Functions</span>
          </label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {(nodeData.functions || ['UserSchema', 'validateUser', 'parseJWT']).map(
              (func: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-slate-900/90 border border-slate-800 font-mono"
                >
                  <span className="text-slate-200 text-[11px]">{func}()</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
              )
            )}
          </div>
        </div>

        <div>
          <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-1 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Downstream Dependents (3 Files)</span>
          </label>
          <ul className="space-y-1 font-mono text-slate-300">
            <li className="p-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
              ➜ AuthController.ts
            </li>
            <li className="p-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
              ➜ UserProfileView.tsx
            </li>
            <li className="p-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
              ➜ api/users/route.ts
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

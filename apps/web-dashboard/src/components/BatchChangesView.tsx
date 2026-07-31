'use client';

import React, { useState } from 'react';
import { Layers, GitPullRequest, Wand2, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export default function BatchChangesView() {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-6 bg-card rounded-2xl border border-border glass-panel">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent-purple/20 text-accent-purple rounded-xl border border-accent-purple/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Multi-Repo Batch Changes Manager</h2>
            <p className="text-xs text-slate-400 font-mono">
              Sourcegraph-Class Automation • Synchronized Multi-Repo Refactoring PRs
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsGenerating(true);
            setTimeout(() => setIsGenerating(false), 2000);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-accent-purple/20 hover:opacity-95 transition"
        >
          <Wand2 className="w-4 h-4" />
          <span>{isGenerating ? 'Orchestrating Batch PRs...' : 'Run Multi-Repo Batch Fix'}</span>
        </button>
      </div>

      {/* Active Batch Changes Job */}
      <div className="p-6 rounded-2xl bg-card border border-border glass-panel space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-white font-bold">Batch Job: batch-user-schema-mutation</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
            2 PRs Deployed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PR 1 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-bold flex items-center space-x-1.5">
                <GitPullRequest className="w-4 h-4 text-accent-purple" />
                <span>frontend-web-app</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                BUILT
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Branch: <code className="text-accent-cyan">contextgrid/batch-fix-userschema</code>
            </p>
            <div className="p-2.5 rounded bg-slate-950 text-[10px] text-slate-400">
              Updated authController import and added fallback user role check.
            </div>
          </div>

          {/* PR 2 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-bold flex items-center space-x-1.5">
                <GitPullRequest className="w-4 h-4 text-accent-cyan" />
                <span>mobile-flutter-app</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                PENDING REVIEW
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Branch: <code className="text-accent-cyan">contextgrid/batch-fix-userschema</code>
            </p>
            <div className="p-2.5 rounded bg-slate-950 text-[10px] text-slate-400">
              Updated Dart JSON response mapper for user authentication payload.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

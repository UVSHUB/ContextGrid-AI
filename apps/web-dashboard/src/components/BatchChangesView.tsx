'use client';

import React, { useState } from 'react';
import { Layers, GitPullRequest, Wand2, Sparkles } from 'lucide-react';

export default function BatchChangesView() {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Multi-Repo Batch Changes Manager</h2>
            <p className="text-xs text-slate-500 font-mono">
              Sourcegraph-Class Automation • Synchronized Multi-Repo Refactoring PRs
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsGenerating(true);
            setTimeout(() => setIsGenerating(false), 2000);
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-indigo-100 transition"
        >
          <Wand2 className="w-4 h-4" />
          <span>{isGenerating ? 'Orchestrating Batch PRs...' : 'Run Multi-Repo Batch Fix'}</span>
        </button>
      </div>

      {/* Active Batch Changes Job */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-slate-900 font-bold">Batch Job: batch-user-schema-mutation</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            2 PRs Deployed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PR 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-bold flex items-center space-x-1.5">
                <GitPullRequest className="w-4 h-4 text-purple-600" />
                <span>frontend-web-app</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                BUILT
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-sans">
              Branch: <code className="text-indigo-600 font-semibold">contextgrid/batch-fix-userschema</code>
            </p>
            <div className="p-2.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600">
              Updated authController import and added fallback user role check.
            </div>
          </div>

          {/* PR 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-bold flex items-center space-x-1.5">
                <GitPullRequest className="w-4 h-4 text-cyan-600" />
                <span>mobile-flutter-app</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                PENDING REVIEW
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-sans">
              Branch: <code className="text-indigo-600 font-semibold">contextgrid/batch-fix-userschema</code>
            </p>
            <div className="p-2.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600">
              Updated Dart JSON response mapper for user authentication payload.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { GitPullRequest, GitBranch, Sparkles, CheckCircle2, FileCode, AlertOctagon, Terminal } from 'lucide-react';

export default function PRImpactAuditsView() {
  const [selectedPR, setSelectedPR] = useState('PR-104');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-6 bg-card rounded-2xl border border-border glass-panel">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent-purple/20 text-accent-purple rounded-xl border border-accent-purple/30">
            <GitPullRequest className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Automated PR Visual Impact Audits</h2>
            <p className="text-xs text-slate-400 font-mono">
              GitHub Actions Bot • Visual PR Risk Digest & Blast-Radius Previews
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-accent-purple/20 text-accent-purple border border-accent-purple/30 text-xs font-mono font-bold rounded-full">
          GitHub Bot Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open PRs List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Open Pull Requests (3)
          </h3>

          <div
            onClick={() => setSelectedPR('PR-104')}
            className={`p-4 rounded-xl bg-card border cursor-pointer transition ${
              selectedPR === 'PR-104'
                ? 'border-accent-purple bg-slate-900/90 shadow-lg shadow-accent-purple/10'
                : 'border-border hover:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400 font-mono">#104 feat/auth-refactor</span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold font-mono">
                88/100 CRITICAL
              </span>
            </div>
            <p className="text-xs text-slate-200 font-semibold">Refactor authentication controller & JWT export</p>
            <span className="text-[10px] text-slate-500 font-mono block mt-2">Author: UVSHUB • 4 Files Touched</span>
          </div>

          <div
            onClick={() => setSelectedPR('PR-105')}
            className={`p-4 rounded-xl bg-card border cursor-pointer transition ${
              selectedPR === 'PR-105'
                ? 'border-accent-purple bg-slate-900/90 shadow-lg shadow-accent-purple/10'
                : 'border-border hover:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 font-mono">#105 fix/intern-activity-logs</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold font-mono">
                42/100 MEDIUM
              </span>
            </div>
            <p className="text-xs text-slate-200 font-semibold">Update activity logbook status handler</p>
            <span className="text-[10px] text-slate-500 font-mono block mt-2">Author: alex_dev • 2 Files Touched</span>
          </div>
        </div>

        {/* PR GitHub Bot Comment Preview */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            GitHub Action Bot Comment Preview
          </h3>

          <div className="p-6 rounded-2xl bg-card border border-border glass-panel space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-slate-300 font-bold">
                <GitPullRequest className="w-4 h-4 text-accent-purple" />
                <span>Pull Request #104 Impact Summary Digest</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-bold">
                🔴 CRITICAL RISK (88/100)
              </span>
            </div>

            {/* ASCII PR Dependency Graph */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-accent-cyan">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Visual Propagation Map</span>
              <pre className="text-[11px] leading-relaxed text-slate-200">
{`[authController.ts]
      │
      ├──► [internActivityController.ts]
      │           │
      │           └──► [frontend/src/app/login/page.tsx]
      │
      └──► [services/mail.ts]`}
              </pre>
            </div>

            {/* Gemini AI Risk Audit */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs text-accent-purple font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini 2.0 Flash PR Risk Audit</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                Pull Request #104 modifies JWT token verification exports in <code className="text-accent-cyan">authController.ts</code>. This change affects 3 downstream modules. Ensure type signatures remain backward compatible before merging.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Recommended CI Test Command:</span>
              <code className="text-accent-cyan text-[11px]">npx jest tests/authController.test.ts</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

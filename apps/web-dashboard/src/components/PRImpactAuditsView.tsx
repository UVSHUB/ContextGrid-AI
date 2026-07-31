'use client';

import React, { useState } from 'react';
import { GitPullRequest, Sparkles } from 'lucide-react';

export default function PRImpactAuditsView() {
  const [selectedPR, setSelectedPR] = useState('PR-104');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
            <GitPullRequest className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Automated PR Visual Impact Audits</h2>
            <p className="text-xs text-slate-500 font-mono">
              GitHub Actions Bot • Visual PR Risk Digest & Blast-Radius Previews
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-mono font-semibold rounded-full">
          GitHub Bot Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open PRs List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Open Pull Requests (3)
          </h3>

          <div
            onClick={() => setSelectedPR('PR-104')}
            className={`p-4 rounded-xl bg-white border cursor-pointer transition shadow-sm ${
              selectedPR === 'PR-104'
                ? 'border-indigo-600 ring-2 ring-indigo-500/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-600 font-mono">#104 feat/auth-refactor</span>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold font-mono border border-rose-200">
                88/100 CRITICAL
              </span>
            </div>
            <p className="text-xs text-slate-800 font-semibold">Refactor authentication controller & JWT export</p>
            <span className="text-[10px] text-slate-500 font-mono block mt-2">Author: UVSHUB • 4 Files Touched</span>
          </div>

          <div
            onClick={() => setSelectedPR('PR-105')}
            className={`p-4 rounded-xl bg-white border cursor-pointer transition shadow-sm ${
              selectedPR === 'PR-105'
                ? 'border-indigo-600 ring-2 ring-indigo-500/10'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-600 font-mono">#105 fix/intern-activity-logs</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold font-mono border border-amber-200">
                42/100 MEDIUM
              </span>
            </div>
            <p className="text-xs text-slate-800 font-semibold">Update activity logbook status handler</p>
            <span className="text-[10px] text-slate-500 font-mono block mt-2">Author: alex_dev • 2 Files Touched</span>
          </div>
        </div>

        {/* PR GitHub Bot Comment Preview */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            GitHub Action Bot Comment Preview
          </h3>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2 text-slate-900 font-bold">
                <GitPullRequest className="w-4 h-4 text-purple-600" />
                <span>Pull Request #104 Impact Summary Digest</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                🔴 CRITICAL RISK (88/100)
              </span>
            </div>

            {/* ASCII PR Dependency Graph */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Visual Propagation Map</span>
              <pre className="text-[11px] leading-relaxed text-cyan-400 font-mono">
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
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs text-purple-700 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Gemini 2.0 Flash PR Risk Audit</span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed font-sans">
                Pull Request #104 modifies JWT token verification exports in <code className="text-indigo-600 font-semibold">authController.ts</code>. This change affects 3 downstream modules. Ensure type signatures remain backward compatible before merging.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 text-[11px]">Recommended CI Test Command:</span>
              <code className="text-indigo-600 font-bold text-[11px]">npx jest tests/authController.test.ts</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

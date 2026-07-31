'use client';

import React, { useState } from 'react';
import { GitPullRequest, GitBranch, Sparkles, FileCode } from 'lucide-react';

interface LivePRInspectorProps {
  onTriggerAutoFix: () => void;
}

const PR_BRANCHES = [
  { id: 'pr-104', title: 'feat/auth-refactor-schema', branch: 'feat/auth-refactor', author: 'UVSHUB', score: 88, risk: 'CRITICAL', changedFile: 'backend/src/controllers/authController.ts', affectedCount: 4 },
  { id: 'pr-105', title: 'fix/intern-activity-logs', branch: 'fix/intern-logs', author: 'alex_dev', score: 42, risk: 'MEDIUM', changedFile: 'backend/src/controllers/internActivityController.ts', affectedCount: 2 },
  { id: 'pr-106', title: 'chore/update-mail-service', branch: 'chore/mail-service', author: 'sarah_m', score: 18, risk: 'LOW', changedFile: 'backend/src/services/mail.ts', affectedCount: 1 }
];

export default function LivePRInspector({ onTriggerAutoFix }: LivePRInspectorProps) {
  const [selectedPR, setSelectedPR] = useState(PR_BRANCHES[0]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitPullRequest className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Live Git Activity & PR Inspector
          </h2>
        </div>
        <span className="px-2.5 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 font-mono font-medium">
          Automated Webhook
        </span>
      </div>

      {/* Select Active PR Branch */}
      <div>
        <label className="text-xs font-semibold text-slate-500 block mb-1">
          Select Active Pull Request / Branch:
        </label>
        <select
          value={selectedPR.id}
          onChange={(e) => {
            const match = PR_BRANCHES.find((p) => p.id === e.target.value);
            if (match) setSelectedPR(match);
          }}
          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
        >
          {PR_BRANCHES.map((pr) => (
            <option key={pr.id} value={pr.id}>
              #{pr.id}: {pr.title} ({pr.branch})
            </option>
          ))}
        </select>
      </div>

      {/* Calculated Impact Score Badge */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-800 font-mono">
              {selectedPR.branch}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
              selectedPR.risk === 'CRITICAL'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : selectedPR.risk === 'HIGH'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            {selectedPR.score}/100 {selectedPR.risk} RISK
          </span>
        </div>

        <div className="text-xs space-y-1 font-mono text-slate-700">
          <div className="flex items-center space-x-2">
            <FileCode className="w-3.5 h-3.5 text-cyan-600" />
            <span>Modified: {selectedPR.changedFile}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Affects {selectedPR.affectedCount} downstream file(s) across backend controllers & frontend routes.
          </p>
        </div>

        {/* Gemini AI Risk Audit */}
        <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-200 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-purple-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 2.0 Flash PR Risk Audit</span>
          </div>
          <p className="text-xs text-slate-700">
            Branch {selectedPR.branch} modifies export signatures in {selectedPR.changedFile.split('/').pop()}. Verify backward compatibility to prevent breaking downstream authentication handlers.
          </p>
        </div>

        <button
          onClick={onTriggerAutoFix}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-indigo-100"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Preview Self-Healing Patch for {selectedPR.branch}</span>
        </button>
      </div>
    </div>
  );
}

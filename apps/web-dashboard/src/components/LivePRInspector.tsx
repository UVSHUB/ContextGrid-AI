'use client';

import React, { useState } from 'react';
import { GitPullRequest, GitBranch, Sparkles, ShieldAlert, CheckCircle2, FileCode, ArrowRight } from 'lucide-react';

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
    <div className="w-full bg-card rounded-2xl border border-border p-5 glass-panel space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitPullRequest className="w-5 h-5 text-accent-purple" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Live Git Activity & PR Inspector
          </h2>
        </div>
        <span className="px-2.5 py-0.5 text-xs bg-accent-purple/20 text-accent-purple rounded-full border border-accent-purple/30 font-mono">
          Automated Webhook
        </span>
      </div>

      {/* Select Active PR Branch */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1">
          Select Active Pull Request / Branch:
        </label>
        <select
          value={selectedPR.id}
          onChange={(e) => {
            const match = PR_BRANCHES.find((p) => p.id === e.target.value);
            if (match) setSelectedPR(match);
          }}
          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-accent-purple cursor-pointer"
        >
          {PR_BRANCHES.map((pr) => (
            <option key={pr.id} value={pr.id}>
              #{pr.id}: {pr.title} ({pr.branch})
            </option>
          ))}
        </select>
      </div>

      {/* Calculated Impact Score Badge */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-accent-blue" />
            <span className="text-xs font-semibold text-slate-200 font-mono">
              {selectedPR.branch}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
              selectedPR.risk === 'CRITICAL'
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : selectedPR.risk === 'HIGH'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
            }`}
          >
            {selectedPR.score}/100 {selectedPR.risk} RISK
          </span>
        </div>

        <div className="text-xs space-y-1 font-mono text-slate-300">
          <div className="flex items-center space-x-2">
            <FileCode className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Modified: {selectedPR.changedFile}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Affects {selectedPR.affectedCount} downstream file(s) across backend controllers & frontend routes.
          </p>
        </div>

        {/* Gemini AI Risk Audit */}
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-accent-purple font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 2.0 Flash PR Risk Audit</span>
          </div>
          <p className="text-xs text-slate-300">
            Branch {selectedPR.branch} modifies export signatures in {selectedPR.changedFile.split('/').pop()}. Verify backward compatibility to prevent breaking downstream authentication handlers.
          </p>
        </div>

        <button
          onClick={onTriggerAutoFix}
          className="w-full py-2.5 rounded-xl bg-accent-purple text-white font-bold text-xs flex items-center justify-center space-x-2 hover:opacity-90 transition shadow-lg shadow-accent-purple/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Preview Self-Healing Patch for {selectedPR.branch}</span>
        </button>
      </div>
    </div>
  );
}

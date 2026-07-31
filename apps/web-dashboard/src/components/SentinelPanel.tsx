'use client';

import React from 'react';
import { ShieldCheck, AlertOctagon, Terminal, FastForward, CheckCircle2 } from 'lucide-react';

interface SentinelPanelProps {
  violations?: any[];
  ciInfo?: any;
}

export default function SentinelPanel({ violations = [], ciInfo }: SentinelPanelProps) {
  return (
    <div className="w-full bg-card rounded-2xl border border-border p-5 glass-panel space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-accent-cyan" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Architecture Drift Sentinel & CI Optimizer
          </h2>
        </div>
        <span className="px-2.5 py-0.5 text-xs bg-accent-cyan/20 text-accent-cyan rounded-full border border-accent-cyan/30 font-mono">
          Enterprise Sentinel
        </span>
      </div>

      {/* Architectural Governance Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Architectural Boundary Rules
        </h3>

        {violations.length === 0 ? (
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>0 Architectural Boundary Violations Detected. Design patterns intact!</span>
          </div>
        ) : (
          violations.map((v, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs space-y-1"
            >
              <div className="flex items-center justify-between text-red-400 font-bold">
                <span className="flex items-center space-x-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>{v.ruleName}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-[10px] uppercase font-mono">
                  {v.severity}
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">{v.message}</p>
              <p className="text-slate-400 text-[10px] font-mono italic">
                💡 Recommendation: {v.recommendation}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Blast-Radius CI/CD Test Optimizer Section */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <FastForward className="w-3.5 h-3.5 text-accent-warning" />
            <span>Blast-Radius CI/CD Test Optimizer</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            93% Faster CI Build
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Total Test Suite: 45 Tests</span>
            <span className="text-accent-cyan">Targeted Tests: 3 Tests</span>
          </div>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-accent-cyan overflow-x-auto flex items-center space-x-2">
            <Terminal className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <code>{ciInfo?.recommendedCommand || 'npx jest tests/UserSchema.test.ts tests/AuthController.test.ts'}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

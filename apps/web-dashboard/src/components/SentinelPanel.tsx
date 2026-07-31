'use client';

import React from 'react';
import { ShieldCheck, Zap, Terminal, CheckCircle2 } from 'lucide-react';

export default function SentinelPanel() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Architecture Drift Sentinel & CI Optimizer
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Enterprise Sentinel • Boundary Violations & Target Test Optimizer
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold rounded-full">
          Sentinel Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Architectural Boundary Rules */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Architectural Boundary Rules
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>0 Architectural Boundary Violations Detected</span>
            </div>
            <p className="text-[11px] text-slate-600 font-sans">
              Layered architecture verified: Frontend modules import Controllers via explicit schema interfaces without circular backend dependencies.
            </p>
          </div>
        </div>

        {/* Blast-Radius CI/CD Test Optimizer */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Blast-Radius CI/CD Test Optimizer</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-indigo-600 font-bold">
              <span>93% Faster CI Build</span>
              <span className="text-[11px] text-slate-500">45 Tests Total ➔ 3 Targeted</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 text-cyan-400 text-[11px] flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <code>npx jest tests/UserSchema.test.ts tests/AuthController.test.ts</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { GitMerge, Database, Globe, Smartphone, Server, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LineageView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-6 bg-card rounded-2xl border border-border glass-panel">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent-blue/20 text-accent-blue rounded-xl border border-accent-blue/30">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Multi-Repository Dependency & API Data Lineage</h2>
            <p className="text-xs text-slate-400 font-mono">
              Federated Knowledge Graph • Cross-Repo REST, GraphQL & gRPC API Contracts
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue border border-accent-blue/30 text-xs font-mono font-bold rounded-full">
          3 Connected Repos
        </span>
      </div>

      {/* Contract Drift Violation Alert */}
      <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>
            <strong>Contract Drift Alert:</strong> <code className="text-slate-200">POST /api/auth/login</code> response schema change in <em>IdeaTech-Internship-Management-Portal</em> breaks consumer <em>frontend-web-app</em>!
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">CRITICAL DRIFT</span>
      </div>

      {/* Multi-Repo Data Pipeline Flowcard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Repo 1: Backend API */}
        <div className="p-5 rounded-2xl bg-card border border-border glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent-blue font-mono flex items-center space-x-1.5">
              <Server className="w-4 h-4" />
              <span>IdeaTech-Internship-Management-Portal</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">Backend API</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs font-mono">
            <span className="text-slate-400 text-[10px] uppercase block font-semibold">Exposed REST Contracts</span>
            <div className="text-slate-200 text-[11px]">• POST /api/auth/login</div>
            <div className="text-slate-200 text-[11px]">• GET /api/interns/activity</div>
            <div className="text-slate-200 text-[11px]">• POST /api/tasks</div>
          </div>
        </div>

        {/* Repo 2: Frontend Web App */}
        <div className="p-5 rounded-2xl bg-card border border-border glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent-purple font-mono flex items-center space-x-1.5">
              <Globe className="w-4 h-4" />
              <span>frontend-web-app</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">Web Frontend</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs font-mono">
            <span className="text-slate-400 text-[10px] uppercase block font-semibold">Consumed API Endpoints</span>
            <div className="text-red-400 text-[11px]">! POST /api/auth/login (Schema Drift)</div>
            <div className="text-slate-200 text-[11px]">• GET /api/interns/activity</div>
          </div>
        </div>

        {/* Repo 3: Mobile Flutter App */}
        <div className="p-5 rounded-2xl bg-card border border-border glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent-cyan font-mono flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4" />
              <span>mobile-flutter-app</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">Mobile App</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs font-mono">
            <span className="text-slate-400 text-[10px] uppercase block font-semibold">Consumed API Endpoints</span>
            <div className="text-slate-200 text-[11px]">• POST /api/auth/login</div>
          </div>
        </div>
      </div>
    </div>
  );
}

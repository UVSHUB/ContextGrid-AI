'use client';

import React from 'react';
import { GitMerge, Globe, Smartphone, Server, AlertOctagon } from 'lucide-react';

export default function LineageView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Multi-Repository Dependency & API Data Lineage</h2>
            <p className="text-xs text-slate-500 font-mono">
              Federated Knowledge Graph • Cross-Repo REST, GraphQL & gRPC API Contracts
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-semibold rounded-full">
          3 Connected Repos
        </span>
      </div>

      {/* Contract Drift Violation Alert */}
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-rose-800">
          <AlertOctagon className="w-4 h-4 shrink-0 text-rose-600" />
          <span>
            <strong>Contract Drift Alert:</strong> <code className="text-slate-900 font-bold">POST /api/auth/login</code> response schema change in <em>IdeaTech-Internship-Management-Portal</em> breaks consumer <em>frontend-web-app</em>!
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-rose-200 text-rose-800 font-bold">CRITICAL DRIFT</span>
      </div>

      {/* Multi-Repo Data Pipeline Flowcard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Repo 1: Backend API */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 font-mono flex items-center space-x-1.5">
              <Server className="w-4 h-4" />
              <span>IdeaTech-Internship-Management-Portal</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-mono border border-slate-200">Backend API</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
            <span className="text-slate-500 text-[10px] uppercase block font-semibold">Exposed REST Contracts</span>
            <div className="text-slate-800 text-[11px]">• POST /api/auth/login</div>
            <div className="text-slate-800 text-[11px]">• GET /api/interns/activity</div>
            <div className="text-slate-800 text-[11px]">• POST /api/tasks</div>
          </div>
        </div>

        {/* Repo 2: Frontend Web App */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 font-mono flex items-center space-x-1.5">
              <Globe className="w-4 h-4" />
              <span>frontend-web-app</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-mono border border-slate-200">Web Frontend</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
            <span className="text-slate-500 text-[10px] uppercase block font-semibold">Consumed API Endpoints</span>
            <div className="text-rose-600 text-[11px] font-semibold">! POST /api/auth/login (Schema Drift)</div>
            <div className="text-slate-800 text-[11px]">• GET /api/interns/activity</div>
          </div>
        </div>

        {/* Repo 3: Mobile Flutter App */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-600 font-mono flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4" />
              <span>mobile-flutter-app</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-mono border border-slate-200">Mobile App</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
            <span className="text-slate-500 text-[10px] uppercase block font-semibold">Consumed API Endpoints</span>
            <div className="text-slate-800 text-[11px]">• POST /api/auth/login</div>
          </div>
        </div>
      </div>
    </div>
  );
}

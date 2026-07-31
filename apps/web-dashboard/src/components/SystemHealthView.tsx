'use client';

import React from 'react';
import { ShieldCheck, Activity, Cpu, Layers, AlertOctagon, TrendingUp, FileCode } from 'lucide-react';

interface SystemHealthViewProps {
  totalNodes: number;
}

export default function SystemHealthView({ totalNodes }: SystemHealthViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Codebase Health Index
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 font-mono mt-2">94%</p>
          <span className="text-[11px] text-slate-500 font-mono">0 Architectural Violations</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ingested AST Nodes
            </span>
            <Layers className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-mono mt-2">{totalNodes}</p>
          <span className="text-[11px] text-slate-500 font-mono">Tree-sitter Indexed</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              High-Risk Hotspots
            </span>
            <AlertOctagon className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-3xl font-extrabold text-rose-600 font-mono mt-2">3 Modules</p>
          <span className="text-[11px] text-slate-500 font-mono">authController, taskController</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Reasoning Latency
            </span>
            <Cpu className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-purple-600 font-mono mt-2">&lt; 42ms</p>
          <span className="text-[11px] text-slate-500 font-mono">Gemini 2.0 Flash Agent</span>
        </div>
      </div>

      {/* Main Health Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotspot Vulnerability Risk Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Architectural Risk Distribution</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Live Audit</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-700">CRITICAL RISK (0–75 Score)</span>
                <span className="text-rose-600 font-bold">12%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-700">HIGH RISK (50–75 Score)</span>
                <span className="text-amber-600 font-bold">28%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-700">MEDIUM RISK (25–50 Score)</span>
                <span className="text-indigo-600 font-bold">35%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-700">SAFE / LOW RISK (0–25 Score)</span>
                <span className="text-emerald-600 font-bold">25%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* High-Risk Hotspot Modules */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-rose-600" />
            <span>Top Codebase Hotspots</span>
          </h3>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-900 font-bold block">backend/src/controllers/authController.ts</span>
                <span className="text-[10px] text-slate-500">4 Downstream File Dependencies</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                CRITICAL (88/100)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-900 font-bold block">backend/src/controllers/taskController.ts</span>
                <span className="text-[10px] text-slate-500">2 Downstream File Dependencies</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                HIGH (62/100)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-900 font-bold block">backend/src/services/ai.ts</span>
                <span className="text-[10px] text-slate-500">3 Downstream File Dependencies</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                MEDIUM (38/100)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

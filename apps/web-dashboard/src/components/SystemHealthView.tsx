'use client';

import React from 'react';
import { ShieldCheck, Activity, Cpu, Layers, AlertOctagon, TrendingUp, CheckCircle2, FileCode } from 'lucide-react';

interface SystemHealthViewProps {
  totalNodes: number;
}

export default function SystemHealthView({ totalNodes }: SystemHealthViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Codebase Health Index
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-2">94%</p>
          <span className="text-[11px] text-slate-500 font-mono">0 Architectural Violations</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ingested AST Nodes
            </span>
            <Layers className="w-5 h-5 text-accent-blue" />
          </div>
          <p className="text-3xl font-black text-white font-mono mt-2">{totalNodes}</p>
          <span className="text-[11px] text-slate-500 font-mono">Tree-sitter Indexed</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              High-Risk Hotspots
            </span>
            <AlertOctagon className="w-5 h-5 text-accent-danger" />
          </div>
          <p className="text-3xl font-black text-red-400 font-mono mt-2">3 Modules</p>
          <span className="text-[11px] text-slate-500 font-mono">authController, taskController</span>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg Reasoning Latency
            </span>
            <Cpu className="w-5 h-5 text-accent-purple" />
          </div>
          <p className="text-3xl font-black text-purple-400 font-mono mt-2">&lt; 42ms</p>
          <span className="text-[11px] text-slate-500 font-mono">Gemini 2.0 Flash Agent</span>
        </div>
      </div>

      {/* Main Health Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotspot Vulnerability Risk Breakdown */}
        <div className="p-6 rounded-2xl bg-card border border-border glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-accent-blue" />
              <span>Architectural Risk Distribution</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Audit</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">CRITICAL RISK (0–75 Score)</span>
                <span className="text-red-400 font-bold">12%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">HIGH RISK (50–75 Score)</span>
                <span className="text-amber-400 font-bold">28%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">MEDIUM RISK (25–50 Score)</span>
                <span className="text-blue-400 font-bold">35%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">SAFE / LOW RISK (0–25 Score)</span>
                <span className="text-emerald-400 font-bold">25%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* High-Risk Hotspot Modules */}
        <div className="p-6 rounded-2xl bg-card border border-border glass-panel space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-accent-danger" />
            <span>Top Codebase Hotspots</span>
          </h3>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-100 font-bold block">backend/src/controllers/authController.ts</span>
                <span className="text-[10px] text-slate-400">4 Downstream File Dependencies</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/40">
                CRITICAL (88/100)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-100 font-bold block">backend/src/controllers/taskController.ts</span>
                <span className="text-[10px] text-slate-400">2 Downstream File Dependencies</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40">
                HIGH (62/100)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-100 font-bold block">backend/src/services/ai.ts</span>
                <span className="text-[10px] text-slate-400">3 Downstream File Dependencies</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/40">
                MEDIUM (38/100)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

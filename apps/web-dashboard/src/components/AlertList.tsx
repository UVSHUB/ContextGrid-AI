'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Sparkles, Clock, FileCode } from 'lucide-react';

export interface AlertItem {
  id: string;
  changedFile: string;
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedCount: number;
  aiSummary: string;
  timestamp: string;
}

interface AlertListProps {
  alerts: AlertItem[];
  onSelectAlert?: (alert: AlertItem) => void;
}

export default function AlertList({ alerts, onSelectAlert }: AlertListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const formatTimestamp = (ts: string) => {
    if (!mounted) return 'Just now';
    try {
      return new Date(ts).toLocaleTimeString();
    } catch (e) {
      return 'Just now';
    }
  };

  return (
    <div className="w-full bg-card rounded-2xl border border-border p-5 glass-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-accent-warning" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Architectural Impact Alerts
          </h2>
        </div>
        <span className="px-2.5 py-1 text-xs bg-slate-800 text-slate-300 rounded-full font-mono border border-slate-700">
          {alerts.length} Active
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <Sparkles className="w-8 h-8 text-accent-blue mx-auto mb-2 opacity-50" />
          <p className="text-sm">No architectural warnings detected.</p>
          <p className="text-xs text-slate-500">Edit code in VS Code to trigger Gemini impact reasoning.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onSelectAlert && onSelectAlert(alert)}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 glass-panel-hover cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-accent-cyan" />
                  <span className="text-sm font-semibold text-slate-100 font-mono">
                    {alert.changedFile.split('/').pop()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getRiskBadge(alert.riskLevel)}`}>
                    {alert.riskLevel} ({alert.score}/100)
                  </span>
                </div>
              </div>

              {/* Gemini AI Architectural Impact Summary */}
              <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-xs text-accent-purple font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini 2.5 Flash Summary</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {alert.aiSummary}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Affects {alert.affectedCount} downstream file(s)</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-500" suppressHydrationWarning>
                  <Clock className="w-3 h-3" />
                  <span suppressHydrationWarning>{formatTimestamp(alert.timestamp)}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

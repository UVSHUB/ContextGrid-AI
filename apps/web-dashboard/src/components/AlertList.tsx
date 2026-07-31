'use client';

import React, { useState, useEffect } from 'react';
import { AlertOctagon, Sparkles, FileCode, Clock } from 'lucide-react';

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
}

export default function AlertList({ alerts }: AlertListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (ts: string) => {
    if (!mounted) return 'Just now';
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Live Architectural Impact Feed
          </h2>
        </div>
        <span className="px-2.5 py-0.5 text-xs bg-slate-100 text-slate-700 rounded-full border border-slate-200 font-mono font-medium">
          {alerts.length} Events
        </span>
      </div>

      <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-2 font-mono text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-bold flex items-center space-x-1.5 truncate max-w-[200px]">
                <FileCode className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{alert.changedFile.split('/').pop()}</span>
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  alert.riskLevel === 'CRITICAL'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : alert.riskLevel === 'HIGH'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                {alert.score}/100 {alert.riskLevel}
              </span>
            </div>

            <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
              {alert.aiSummary}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
              <span>Affects {alert.affectedCount} file(s)</span>
              <span className="flex items-center space-x-1" suppressHydrationWarning>
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatTime(alert.timestamp)}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

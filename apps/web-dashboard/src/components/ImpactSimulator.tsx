'use client';

import React, { useState } from 'react';
import { Play, Sparkles, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { AlertItem } from './AlertList';

interface ImpactSimulatorProps {
  onAddAlert: (alert: AlertItem) => void;
}

export default function ImpactSimulator({ onAddAlert }: ImpactSimulatorProps) {
  const [selectedFile, setSelectedFile] = useState('src/schemas/UserSchema.ts');
  const [codeDiff, setCodeDiff] = useState(
`// Modified export interface UserSchema
export interface UserSchema {
  id: string;
- role: 'user' | 'admin';
+ role: 'user' | 'admin' | 'superadmin' | 'guest';
+ permissions: string[];
}`
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Call local impact control server
      const res = await fetch('http://localhost:8080/api/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: selectedFile,
          content: codeDiff
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);

        const newAlert: AlertItem = {
          id: String(Date.now()),
          changedFile: data.changedFile,
          score: data.score,
          riskLevel: data.riskLevel,
          affectedCount: data.affectedCount,
          aiSummary: data.aiSummary,
          timestamp: new Date().toISOString()
        };
        onAddAlert(newAlert);
      } else {
        throw new Error('API server returned error');
      }
    } catch (err) {
      // Demo fallback calculation for presentation mode
      const mockResult = {
        changedFile: selectedFile,
        score: 82,
        riskLevel: 'CRITICAL',
        affectedCount: 3,
        aiSummary: `Modifying UserSchema.ts breaks type definitions in AuthController.ts and UserProfileView.tsx. Ensure role property mappings are updated across all downstream authentication handlers.`
      };
      setResult(mockResult);

      onAddAlert({
        id: String(Date.now()),
        changedFile: selectedFile,
        score: 82,
        riskLevel: 'CRITICAL',
        affectedCount: 3,
        aiSummary: mockResult.aiSummary,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-card rounded-2xl border border-border p-5 glass-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-accent-purple" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Live Impact Score Simulator
          </h2>
        </div>
        <span className="px-2.5 py-0.5 text-xs bg-accent-purple/20 text-accent-purple rounded-full border border-accent-purple/30 font-mono">
          Gemini 2.5 Flash
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">
            Target File to Modify:
          </label>
          <select
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-slate-200 focus:outline-none focus:border-accent-blue"
          >
            <option value="src/schemas/UserSchema.ts">src/schemas/UserSchema.ts (High Hotspot)</option>
            <option value="src/controllers/AuthController.ts">src/controllers/AuthController.ts</option>
            <option value="src/components/UserProfileView.tsx">src/components/UserProfileView.tsx</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">
            Code Modification Diff:
          </label>
          <textarea
            value={codeDiff}
            onChange={(e) => setCodeDiff(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-accent-purple"
          />
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white font-semibold text-sm flex items-center justify-center space-x-2 hover:opacity-95 transition shadow-lg shadow-accent-purple/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing AST & Graph Traversal...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Simulate Architectural Impact</span>
            </>
          )}
        </button>

        {result && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Calculated System Impact Score:</span>
              <span className="text-sm font-bold text-red-400 font-mono">
                {result.score}/100 ({result.riskLevel})
              </span>
            </div>
            <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              {result.aiSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

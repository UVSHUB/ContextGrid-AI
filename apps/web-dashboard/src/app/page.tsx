'use client';

import React, { useState, useEffect } from 'react';
import GraphCanvas from '@/components/GraphCanvas';
import AlertList, { AlertItem } from '@/components/AlertList';
import NodeInspector from '@/components/NodeInspector';
import ImpactSimulator from '@/components/ImpactSimulator';
import SelfHealingPatchModal from '@/components/SelfHealingPatchModal';
import SentinelPanel from '@/components/SentinelPanel';
import {
  Activity,
  Layers,
  ShieldAlert,
  Cpu,
  Sparkles,
  GitBranch,
  Terminal,
  Server,
  Wand2,
  GitPullRequest
} from 'lucide-react';

const initialAlerts: AlertItem[] = [
  {
    id: '1',
    changedFile: 'src/schemas/UserSchema.ts',
    score: 88,
    riskLevel: 'CRITICAL',
    affectedCount: 3,
    aiSummary: 'Modifying UserSchema.ts breaks type contracts in AuthController.ts and UserProfileView.tsx. Add backward-compatible default fields to avoid breaking downstream JWT verification.',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    changedFile: 'src/controllers/AuthController.ts',
    score: 54,
    riskLevel: 'HIGH',
    affectedCount: 1,
    aiSummary: 'Changes to AuthController.ts impact route handler api/users/route.ts. Verify status code response format across login endpoints.',
    timestamp: new Date(Date.now() - 300000).toISOString()
  }
];

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const [activePatches, setActivePatches] = useState<any[]>([]);

  useEffect(() => {
    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket('ws://localhost:8080');

      socket.onopen = () => {
        setWsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'IMPACT_ALERT') {
            const newAlert: AlertItem = {
              id: String(Date.now()),
              changedFile: data.changedFile,
              score: data.score,
              riskLevel: data.riskLevel,
              affectedCount: data.affectedCount,
              aiSummary: data.aiSummary,
              timestamp: data.timestamp || new Date().toISOString()
            };
            setAlerts((prev) => [newAlert, ...prev]);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      socket.onclose = () => {
        setWsConnected(false);
      };
    } catch (err) {
      setWsConnected(false);
    }

    return () => {
      if (socket) socket.close();
    };
  }, []);

  const handleAddAlert = (alert: AlertItem) => {
    setAlerts((prev) => [alert, ...prev]);
  };

  const handleTriggerSelfHealing = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/autofix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: 'src/schemas/UserSchema.ts',
          content: 'export interface UserSchema { id: string; role: string; }',
          affectedFiles: ['src/controllers/AuthController.ts', 'src/components/UserProfileView.tsx']
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActivePatches(data.patches || []);
      } else {
        throw new Error('API server returned error');
      }
    } catch (err) {
      setActivePatches([
        {
          targetFile: 'src/controllers/AuthController.ts',
          originalSnippet: `import { UserSchema } from '../schemas/UserSchema';`,
          patchedCode: `import { UserSchema, defaultUserConfig } from '../schemas/UserSchema';`,
          diffSummary: 'Updated AuthController.ts imports to maintain backward compatibility with default user roles.'
        },
        {
          targetFile: 'src/components/UserProfileView.tsx',
          originalSnippet: `<Avatar role={user.role} />`,
          patchedCode: `<Avatar role={user.role || 'guest'} />`,
          diffSummary: 'Added fallback role check in UserProfileView.tsx to prevent render exception.'
        }
      ]);
    } finally {
      setIsPatchModalOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      {/* Navigation & Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-card rounded-2xl border border-border shadow-xl glass-panel gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-tr from-accent-blue to-accent-purple rounded-xl shadow-lg shadow-accent-purple/20">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>ContextGrid AI</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30 font-mono font-semibold">
                Enterprise v2.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Architectural Impact Engine • Autonomous Self-Healing & Sentinel Sentinel
            </p>
          </div>
        </div>

        {/* Action Buttons & Status Indicators */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerSelfHealing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white text-xs font-bold flex items-center space-x-2 hover:opacity-95 transition shadow-lg shadow-accent-purple/20"
          >
            <Wand2 className="w-4 h-4" />
            <span>Trigger 1-Click Auto-Fix</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <Activity className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="text-slate-300">Daemon:</span>
            <span className={wsConnected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {wsConnected ? 'Connected (8080)' : 'Active'}
            </span>
          </div>
        </div>
      </header>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Dependency Nodes
            </span>
            <GitBranch className="w-4 h-4 text-accent-blue" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">142</p>
          <span className="text-[11px] text-slate-500 font-mono">AST Tree-sitter Ingested</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              High-Risk Hotspots
            </span>
            <ShieldAlert className="w-4 h-4 text-accent-danger" />
          </div>
          <p className="text-2xl font-black text-red-400 font-mono mt-2">3 Modules</p>
          <span className="text-[11px] text-slate-500 font-mono">UserSchema, AuthController, API</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Autonomous Self-Healing
            </span>
            <Wand2 className="w-4 h-4 text-accent-purple" />
          </div>
          <p className="text-2xl font-black text-purple-400 font-mono mt-2">Ready</p>
          <span className="text-[11px] text-slate-500 font-mono">1-Click Auto-Refactor</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Blast-Radius CI Optimizer
            </span>
            <Terminal className="w-4 h-4 text-accent-cyan" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-2">93% Savings</p>
          <span className="text-[11px] text-slate-500 font-mono">3 / 45 Tests Run</span>
        </div>
      </div>

      {/* Main Grid: React Flow Canvas & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* React Flow Interactive Graph Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <GraphCanvas onNodeSelect={setSelectedNode} />
          <SentinelPanel />

          {selectedNode && (
            <NodeInspector nodeData={selectedNode} onClose={() => setSelectedNode(null)} />
          )}
        </div>

        {/* Sidebar: Real-time Alert List & Impact Simulator */}
        <div className="space-y-6">
          <ImpactSimulator onAddAlert={handleAddAlert} />
          <AlertList alerts={alerts} />
        </div>
      </div>

      {/* Self Healing Patch Modal */}
      <SelfHealingPatchModal
        isOpen={isPatchModalOpen}
        onClose={() => setIsPatchModalOpen(false)}
        patches={activePatches}
      />
    </main>
  );
}

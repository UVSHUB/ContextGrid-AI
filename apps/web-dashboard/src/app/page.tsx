'use client';

import React, { useState, useEffect } from 'react';
import GraphCanvas from '@/components/GraphCanvas';
import AlertList, { AlertItem } from '@/components/AlertList';
import NodeInspector from '@/components/NodeInspector';
import ImpactSimulator from '@/components/ImpactSimulator';
import {
  Activity,
  Layers,
  ShieldAlert,
  Cpu,
  Sparkles,
  GitBranch,
  Terminal,
  Server
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

  // Connect to WebSocket server on startup for real-time impact alerts
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
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue border border-accent-blue/30 font-mono">
                MVP v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Real-Time Architectural Impact Engine • Powered by Google Gemini 2.5 Flash
            </p>
          </div>
        </div>

        {/* System Status Indicators */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Server className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-slate-300">Parser:</span>
            <span className="text-emerald-400 font-bold">FastAPI 8000</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
            <span className="text-slate-300">AI Reasoning:</span>
            <span className="text-purple-400 font-bold">Gemini 2.5 Flash</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Activity className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="text-slate-300">Daemon WS:</span>
            <span className={wsConnected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {wsConnected ? 'Connected (8080)' : 'Simulated'}
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
              Avg System Impact Score
            </span>
            <Cpu className="w-4 h-4 text-accent-warning" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono mt-2">71 / 100</p>
          <span className="text-[11px] text-slate-500 font-mono">Inverse Depth Weighted</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border glass-panel">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sub-second Reasoning
            </span>
            <Terminal className="w-4 h-4 text-accent-cyan" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-2">&lt; 45ms</p>
          <span className="text-[11px] text-slate-500 font-mono">Graph Traversal + Gemini</span>
        </div>
      </div>

      {/* Main Grid: React Flow Canvas & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* React Flow Interactive Graph Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <GraphCanvas onNodeSelect={setSelectedNode} />

          {/* Node Inspector Drawer when node is clicked */}
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
    </main>
  );
}

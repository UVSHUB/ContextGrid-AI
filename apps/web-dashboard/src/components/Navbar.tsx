'use client';

import React from 'react';
import {
  Layers,
  Activity,
  Search,
  Wand2,
  GitBranch,
  Globe,
  BarChart3,
  GitPullRequest,
  ShieldCheck,
  Zap,
  ChevronDown
} from 'lucide-react';

export type TabType = 'topology' | 'health' | 'pr-audits' | 'sentinel' | 'ci-optimizer';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedRepo: string;
  setSelectedRepo: (repo: string) => void;
  wsConnected: boolean;
  totalNodes: number;
  onOpenSearch: () => void;
  onTriggerAutoFix: () => void;
}

const REPOS = [
  'IdeaTech-Internship-Management-Portal',
  'main-backend-api',
  'frontend-web-app',
  'auth-microservice'
];

export default function Navbar({
  activeTab,
  setActiveTab,
  selectedRepo,
  setSelectedRepo,
  wsConnected,
  totalNodes,
  onOpenSearch,
  onTriggerAutoFix
}: NavbarProps) {
  return (
    <header className="w-full bg-card/90 border-b border-border sticky top-0 z-40 backdrop-blur-xl glass-panel px-6 py-3 space-y-3">
      {/* Top Main Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo & Environment Selector */}
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('topology')}>
            <div className="p-2.5 bg-gradient-to-tr from-accent-blue to-accent-purple rounded-xl shadow-lg shadow-accent-purple/20">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold text-white tracking-tight">ContextGrid AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30 font-mono font-bold">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Real-Time Architectural Impact Control</p>
            </div>
          </div>

          <div className="hidden lg:block h-7 w-px bg-slate-800" />

          {/* Environment/Repo Dropdown */}
          <div className="relative group hidden sm:block">
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="appearance-none pl-9 pr-8 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-accent-blue cursor-pointer"
            >
              {REPOS.map((repo) => (
                <option key={repo} value={repo}>
                  {repo}
                </option>
              ))}
            </select>
            <GitBranch className="w-3.5 h-3.5 text-accent-blue absolute left-3 top-2.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div className="flex items-center space-x-3">
          {/* Cmd+K Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
          >
            <Search className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="font-mono text-[11px]">Search Symbol...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* 1-Click Auto-Fix Action */}
          <button
            onClick={onTriggerAutoFix}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white text-xs font-bold flex items-center space-x-2 hover:opacity-95 transition shadow-lg shadow-accent-purple/20"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>1-Click Auto-Fix</span>
          </button>

          {/* Live WS Status Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <Activity className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="text-slate-300 hidden md:inline">Live Status:</span>
            <span className={wsConnected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {wsConnected ? `Connected (${totalNodes} Nodes)` : 'Daemon Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabbed Navigation Row */}
      <div className="flex items-center space-x-1 border-t border-slate-800/80 pt-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('topology')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition ${
            activeTab === 'topology'
              ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-md shadow-accent-blue/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>🌐 Live Topology</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition ${
            activeTab === 'health'
              ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-md shadow-accent-blue/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 System Health</span>
        </button>

        <button
          onClick={() => setActiveTab('pr-audits')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition ${
            activeTab === 'pr-audits'
              ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-md shadow-accent-blue/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>🔀 PR Impact Audits</span>
        </button>

        <button
          onClick={() => setActiveTab('sentinel')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition ${
            activeTab === 'sentinel'
              ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-md shadow-accent-blue/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>🛡️ Architecture Sentinel</span>
        </button>

        <button
          onClick={() => setActiveTab('ci-optimizer')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition ${
            activeTab === 'ci-optimizer'
              ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-md shadow-accent-blue/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>⚡ CI Optimizer</span>
        </button>
      </div>
    </header>
  );
}

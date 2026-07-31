'use client';

import React from 'react';
import {
  Globe,
  Activity,
  GitPullRequest,
  ShieldCheck,
  Zap,
  Search,
  Wand2,
  ChevronDown,
  GitMerge,
  Layers,
  Sparkles
} from 'lucide-react';

export type TabType = 'topology' | 'health' | 'pr-audits' | 'sentinel' | 'ci-optimizer' | 'lineage' | 'batch-changes';

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
    <header className="sticky top-0 z-40 w-full bg-card/90 backdrop-blur-xl border-b border-border shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Repo Selector */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('topology')}>
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-accent-purple to-accent-blue shadow-lg shadow-accent-purple/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-extrabold tracking-tight text-white font-mono">
                  ContextGrid
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-purple/20 text-accent-purple border border-accent-purple/30 font-mono">
                  ENTERPRISE
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono block">
                Code Intelligence & Multi-Repo Search Engine
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-800 hidden md:block" />

          {/* Repo Selector Dropdown */}
          <div className="relative hidden md:flex items-center">
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:border-accent-purple cursor-pointer"
            >
              <option value="IdeaTech-Internship-Management-Portal">
                IdeaTech-Internship-Management-Portal
              </option>
              <option value="main-backend-api">main-backend-api</option>
              <option value="frontend-web-app">frontend-web-app</option>
              <option value="mobile-flutter-app">mobile-flutter-app</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Global Structural Search & Auto-Fix Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition text-xs font-mono"
          >
            <Search className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="hidden sm:inline">Search Symbol / Structural...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">⌘K</kbd>
          </button>

          <button
            onClick={onTriggerAutoFix}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold text-xs shadow-lg shadow-accent-purple/20 hover:opacity-95 transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1-Click Auto-Fix</span>
          </button>

          {/* Live WS Status Pill */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-300 hidden lg:inline">
              {wsConnected ? `Connected • ${totalNodes} Symbols Indexing` : 'Daemon Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 flex items-center space-x-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('topology')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'topology'
              ? 'border-accent-purple text-accent-purple bg-accent-purple/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Live Topology</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'health'
              ? 'border-accent-purple text-accent-purple bg-accent-purple/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Health</span>
        </button>

        <button
          onClick={() => setActiveTab('lineage')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'lineage'
              ? 'border-accent-purple text-accent-purple bg-accent-purple/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitMerge className="w-4 h-4 text-accent-cyan" />
          <span>Multi-Repo Lineage</span>
        </button>

        <button
          onClick={() => setActiveTab('batch-changes')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'batch-changes'
              ? 'border-accent-purple text-accent-purple bg-accent-purple/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-accent-purple" />
          <span>Batch Changes</span>
        </button>

        <button
          onClick={() => setActiveTab('pr-audits')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'pr-audits'
              ? 'border-accent-purple text-accent-purple bg-accent-purple/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>PR Impact Audits</span>
        </button>

        <button
          onClick={() => setActiveTab('sentinel')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'sentinel'
              ? 'border-accent-purple text-accent-purple bg-accent-purple/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sentinel Governance</span>
        </button>

        <button
          onClick={() => setActiveTab('ci-optimizer')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'ci-optimizer'
              ? 'border-accent-purple text-accent-purple bg-accent-purple/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>CI Optimizer</span>
        </button>
      </div>
    </header>
  );
}

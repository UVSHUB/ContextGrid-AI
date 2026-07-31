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
  Sparkles,
  FolderPlus
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
  onOpenAgenticChat: () => void;
  onOpenConnectModal: () => void;
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
  onOpenAgenticChat,
  onOpenConnectModal,
  onTriggerAutoFix
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand Logo, Repo Selector & Connect Button */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('topology')}>
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-slate-900 font-mono">
                  ContextGrid
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                  ENTERPRISE
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono block">
                Code Intelligence & Multi-Repo Engine
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

          {/* Repo Selector & Connect Codebase Trigger */}
          <div className="relative hidden md:flex items-center space-x-2">
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="appearance-none bg-slate-100/80 border border-slate-200 text-xs font-mono font-medium text-slate-700 py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-xs"
            >
              <option value="IdeaTech-Internship-Management-Portal">
                IdeaTech-Internship-Management-Portal
              </option>
              <option value="main-backend-api">main-backend-api</option>
              <option value="frontend-web-app">frontend-web-app</option>
              <option value="mobile-flutter-app">mobile-flutter-app</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 pointer-events-none" />

            <button
              onClick={onOpenConnectModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold transition shadow-xs"
              title="Connect any local code repository"
            >
              <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Connect Codebase</span>
            </button>
          </div>
        </div>

        {/* Agentic Chat, Structural Search & Auto-Fix */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAgenticChat}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 transition text-xs font-mono font-bold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Ask Codebase AI</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition text-xs font-mono shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Search Symbol...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-semibold text-slate-500 border border-slate-200 shadow-xs">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onTriggerAutoFix}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-100 transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1-Click Auto-Fix</span>
          </button>

          {/* Live WS Status Pill */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-slate-700 font-medium hidden lg:inline">
              {wsConnected ? `Connected • ${totalNodes} AST Symbols` : 'Daemon Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 flex items-center space-x-1 border-t border-slate-100 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('topology')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'topology'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Live Topology</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'health'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Health</span>
        </button>

        <button
          onClick={() => setActiveTab('lineage')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'lineage'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GitMerge className="w-4 h-4 text-cyan-600" />
          <span>Multi-Repo Lineage</span>
        </button>

        <button
          onClick={() => setActiveTab('batch-changes')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'batch-changes'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Batch Changes</span>
        </button>

        <button
          onClick={() => setActiveTab('pr-audits')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'pr-audits'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>PR Impact Audits</span>
        </button>

        <button
          onClick={() => setActiveTab('sentinel')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'sentinel'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sentinel Governance</span>
        </button>

        <button
          onClick={() => setActiveTab('ci-optimizer')}
          className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold font-mono border-b-2 transition shrink-0 ${
            activeTab === 'ci-optimizer'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>CI Optimizer</span>
        </button>
      </div>
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant
} from '@xyflow/react';
import { RefreshCw, FileCode, Layers } from 'lucide-react';

interface GraphCanvasProps {
  onNodeSelect: (nodeData: any) => void;
}

const initialNodes: Node[] = [
  {
    id: 'authController',
    data: {
      label: 'authController.ts',
      path: 'backend/src/controllers/authController.ts',
      risk: 'CRITICAL',
      score: 92,
      functions: ['loginUser', 'verifyToken', 'logout']
    },
    position: { x: 80, y: 120 },
    style: {
      background: '#FFFFFF',
      color: '#0F172A',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      padding: '16px',
      width: '260px',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
    }
  },
  {
    id: 'internActivityController',
    data: {
      label: 'internActivityController.ts',
      path: 'backend/src/controllers/internActivityController.ts',
      risk: 'HIGH',
      score: 68,
      functions: ['logActivity', 'getStats']
    },
    position: { x: 420, y: 60 },
    style: {
      background: '#FFFFFF',
      color: '#0F172A',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      padding: '16px',
      width: '260px',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
    }
  },
  {
    id: 'taskController',
    data: {
      label: 'taskController.ts',
      path: 'backend/src/controllers/taskController.ts',
      risk: 'HIGH',
      score: 54,
      functions: ['createTask', 'updateTaskStatus']
    },
    position: { x: 420, y: 220 },
    style: {
      background: '#FFFFFF',
      color: '#0F172A',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      padding: '16px',
      width: '260px',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
    }
  },
  {
    id: 'aiService',
    data: {
      label: 'services/ai.ts',
      path: 'backend/src/services/ai.ts',
      risk: 'MEDIUM',
      score: 38,
      functions: ['generateImpactAnalysis']
    },
    position: { x: 760, y: 140 },
    style: {
      background: '#FFFFFF',
      color: '#0F172A',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      padding: '16px',
      width: '240px',
      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
    }
  }
];

const initialEdges: Edge[] = [
  { id: 'e-1', source: 'authController', target: 'internActivityController', animated: true, style: { stroke: '#4F46E5', strokeWidth: 2 } },
  { id: 'e-2', source: 'authController', target: 'taskController', animated: true, style: { stroke: '#4F46E5', strokeWidth: 2 } },
  { id: 'e-3', source: 'internActivityController', target: 'aiService', animated: true, style: { stroke: '#0891B2', strokeWidth: 2 } }
];

export default function GraphCanvas({ onNodeSelect }: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [totalParsed, setTotalParsed] = useState(67);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchGraph = () => {
    setIsRefreshing(true);
    fetch('http://localhost:8000/graph')
      .then((res) => res.json())
      .then((data) => {
        if (data.nodes && data.nodes.length > 0) {
          setTotalParsed(data.nodes.length);
          const mappedNodes: Node[] = data.nodes.map((n: any, idx: number) => {
            const dynamicScore = Math.max(25, 95 - idx * 14);
            const risk = dynamicScore >= 75 ? 'CRITICAL' : dynamicScore >= 50 ? 'HIGH' : 'MEDIUM';
            return {
              id: n.id || `node-${idx}`,
              data: {
                label: n.name || n.id,
                path: n.path || n.id,
                risk,
                score: dynamicScore,
                functions: n.functions || ['handleRequest']
              },
              position: { x: (idx % 3) * 320 + 80, y: Math.floor(idx / 3) * 160 + 80 },
              style: {
                background: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px',
                width: '260px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
              }
            };
          });

          const mappedEdges: Edge[] = (data.edges || []).map((e: any, idx: number) => ({
            id: `e-${idx}`,
            source: e.source,
            target: e.target,
            animated: true,
            style: { stroke: '#4F46E5', strokeWidth: 2 }
          }));

          setNodes(mappedNodes);
          setEdges(mappedEdges);
        }
      })
      .catch(() => {})
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  return (
    <div className="w-full h-[540px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 font-mono">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Live Topology Canvas</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-mono font-medium text-slate-600 border border-slate-200">
          {totalParsed} Ingested AST Symbols
        </span>
        <button
          onClick={fetchGraph}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
          title="Refresh Neo4j Graph"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      <ReactFlow
        nodes={nodes.map((node) => {
          const nodeData = node.data as any;
          return {
            ...node,
            data: {
              ...nodeData,
              label: (
                <div
                  onClick={() => onNodeSelect(nodeData)}
                  className="cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900 font-mono truncate max-w-[140px]">
                        {String(nodeData.label || '')}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                        nodeData.risk === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : nodeData.risk === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {nodeData.score}/100 {String(nodeData.risk || '')}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono truncate">
                    {String(nodeData.path || '')}
                  </p>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{(nodeData.functions || []).length} AST Functions</span>
                    <span className="text-indigo-600 font-semibold group-hover:underline">Inspect →</span>
                  </div>
                </div>
              )
            }
          };
        })}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1.5} color="#CBD5E1" />
        <Controls className="bg-white border-slate-200 shadow-sm text-slate-700 fill-slate-700" />
      </ReactFlow>
    </div>
  );
}

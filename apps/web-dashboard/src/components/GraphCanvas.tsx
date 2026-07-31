'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Activity, ShieldAlert, Cpu, RefreshCw } from 'lucide-react';

interface GraphCanvasProps {
  onNodeSelect?: (nodeData: any) => void;
  selectedNodeId?: string | null;
}

const initialNodes: Node[] = [
  {
    id: 'UserSchema.ts',
    position: { x: 100, y: 180 },
    data: {
      label: 'UserSchema.ts',
      path: 'src/schemas/UserSchema.ts',
      risk: 'CRITICAL',
      functions: ['UserSchema', 'validateUser', 'parseJWT'],
      importsCount: 4
    },
    style: {
      background: '#1F2937',
      color: '#EF4444',
      border: '2px solid #EF4444',
      padding: '12px 16px',
      borderRadius: '12px',
      fontWeight: '600',
      boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
    }
  },
  {
    id: 'AuthController.ts',
    position: { x: 420, y: 80 },
    data: {
      label: 'AuthController.ts',
      path: 'src/controllers/AuthController.ts',
      risk: 'HIGH',
      functions: ['login', 'register', 'refreshToken'],
      importsCount: 2
    },
    style: {
      background: '#1F2937',
      color: '#F59E0B',
      border: '2px solid #F59E0B',
      padding: '12px 16px',
      borderRadius: '12px',
      fontWeight: '600',
      boxShadow: '0 0 15px rgba(245, 158, 11, 0.25)'
    }
  },
  {
    id: 'UserProfileView.tsx',
    position: { x: 420, y: 280 },
    data: {
      label: 'UserProfileView.tsx',
      path: 'src/components/UserProfileView.tsx',
      risk: 'MEDIUM',
      functions: ['UserProfileView', 'AvatarCard'],
      importsCount: 3
    },
    style: {
      background: '#1F2937',
      color: '#3B82F6',
      border: '2px solid #3B82F6',
      padding: '12px 16px',
      borderRadius: '12px',
      fontWeight: '600',
      boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
    }
  },
  {
    id: 'api/users/route.ts',
    position: { x: 740, y: 180 },
    data: {
      label: 'api/users/route.ts',
      path: 'src/app/api/users/route.ts',
      risk: 'LOW',
      functions: ['GET', 'POST', 'PATCH'],
      importsCount: 1
    },
    style: {
      background: '#1F2937',
      color: '#10B981',
      border: '2px solid #10B981',
      padding: '12px 16px',
      borderRadius: '12px',
      fontWeight: '600',
      boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'UserSchema.ts',
    target: 'AuthController.ts',
    animated: true,
    label: 'IMPORTS',
    style: { stroke: '#EF4444', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' }
  },
  {
    id: 'e1-3',
    source: 'UserSchema.ts',
    target: 'UserProfileView.tsx',
    animated: true,
    label: 'IMPORTS',
    style: { stroke: '#F59E0B', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' }
  },
  {
    id: 'e2-4',
    source: 'AuthController.ts',
    target: 'api/users/route.ts',
    animated: true,
    label: 'IMPORTS',
    style: { stroke: '#3B82F6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' }
  }
];

export default function GraphCanvas({ onNodeSelect, selectedNodeId }: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [loading, setLoading] = useState(false);
  const [nodeCount, setNodeCount] = useState(4);

  const fetchGraphData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch dynamic graph topology from Python Parser Engine (port 8000) or Impact Server (port 8080)
      let res = await fetch('http://localhost:8000/graph');
      if (!res.ok) {
        res = await fetch('http://localhost:8080/api/graph');
      }

      if (res.ok) {
        const data = await res.json();

        if (data.nodes && data.nodes.length > 0) {
          const cols = 5;
          const formattedNodes: Node[] = data.nodes.map((n: any, idx: number) => {
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            const label = n.label || n.id?.split('/').pop() || n.path?.split('/').pop() || n.id;
            
            // Risk color coding
            let color = '#3B82F6';
            let risk = 'MEDIUM';
            if (label.includes('auth') || label.includes('schema') || label.includes('db')) {
              color = '#EF4444';
              risk = 'CRITICAL';
            } else if (label.includes('controller') || label.includes('service')) {
              color = '#F59E0B';
              risk = 'HIGH';
            } else if (label.includes('route') || label.includes('api')) {
              color = '#10B981';
              risk = 'LOW';
            }

            return {
              id: n.id || n.path,
              position: { x: col * 260 + 60, y: row * 150 + 90 },
              data: {
                label,
                path: n.path || n.id,
                risk,
                functions: n.functions || ['handleRequest', 'executeLogic'],
                importsCount: n.imports?.length || 2
              },
              style: {
                background: '#1F2937',
                color,
                border: `2px solid ${color}`,
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: '600',
                boxShadow: `0 0 15px ${color}40`,
                fontSize: '12px',
                fontFamily: 'monospace'
              }
            };
          });

          const formattedEdges: Edge[] = (data.edges || []).map((e: any, idx: number) => ({
            id: e.id || `e-${idx}`,
            source: e.source,
            target: e.target,
            animated: true,
            label: e.label || 'IMPORTS',
            style: { stroke: '#8B5CF6', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' }
          }));

          setNodes(formattedNodes);
          setEdges(formattedEdges);
          setNodeCount(formattedNodes.length);
        }
      }
    } catch (err) {
      console.warn('[GraphCanvas] Failed to fetch dynamic graph data:', err);
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges]);

  // Fetch on mount and setup polling interval
  useEffect(() => {
    fetchGraphData();
    const interval = setInterval(fetchGraphData, 5000);
    return () => clearInterval(interval);
  }, [fetchGraphData]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (onNodeSelect) {
        onNodeSelect(node.data);
      }
    },
    [onNodeSelect]
  );

  return (
    <div className="relative w-full h-[620px] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden glass-panel">
      {/* Top Overlay Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-3 px-4 py-2 bg-slate-900/90 rounded-xl border border-slate-800 backdrop-blur-md">
        <Cpu className="w-5 h-5 text-accent-blue animate-pulse" />
        <span className="text-sm font-semibold text-slate-200">
          ContextGrid AI Graph Topology
        </span>
        <span className="px-2.5 py-0.5 text-xs bg-accent-blue/20 text-accent-blue rounded-full border border-accent-blue/30 font-mono">
          {nodeCount} Nodes Ingested
        </span>
        <button
          onClick={fetchGraphData}
          disabled={loading}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Refresh Graph"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls className="bg-slate-900 border-slate-800 text-white rounded-lg p-1" />
        <MiniMap
          nodeColor={(node) => {
            const risk = (node.data as any)?.risk;
            if (risk === 'CRITICAL') return '#EF4444';
            if (risk === 'HIGH') return '#F59E0B';
            if (risk === 'MEDIUM') return '#3B82F6';
            return '#10B981';
          }}
          className="bg-slate-900/90 border-slate-800 rounded-xl"
        />
      </ReactFlow>
    </div>
  );
}

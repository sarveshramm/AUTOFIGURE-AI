"use client";

import React, { useCallback, useImperativeHandle, forwardRef } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  Connection,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import { DiagramNode, DiagramEdge, DiagramThemeConfig } from "@/lib/types";
import { getTheme } from "@/lib/diagramThemes";

interface DiagramCanvasProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  theme: string;
  onNodesChange?: (changes: any) => void;
  onEdgesChange?: (changes: any) => void;
  onConnect?: (connection: Connection) => void;
}

// Custom Node Component with proper shapes
const CustomNode = ({ data, selected }: any) => {
  const { label, shape, color, backgroundColor, width = 150, height = 80 } = data;
  
  const nodeStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    border: `2px solid ${color || "#4A90E2"}`,
    backgroundColor: backgroundColor || `${color || "#4A90E2"}20`,
    borderRadius: shape === "rounded" ? "10px" : shape === "circle" || shape === "oval" ? "50%" : "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "500",
    color: color || "#4A90E2",
    boxShadow: selected ? `0 0 0 3px ${color || "#4A90E2"}40` : "none",
  };

  // Handle diamond shape
  if (shape === "diamond") {
    const points = `${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`;
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="react-flow__node-default"
      >
        <svg width={width} height={height} style={{ position: "absolute" }}>
          <polygon
            points={points}
            fill={backgroundColor || `${color || "#4A90E2"}20`}
            stroke={color || "#4A90E2"}
            strokeWidth="2"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color || "#4A90E2",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          {label}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={nodeStyle}
      className="react-flow__node-default"
    >
      {label}
    </motion.div>
  );
};

const nodeTypes = {
  default: CustomNode,
};

// Internal component that uses React Flow hooks
const DiagramCanvasInternal = forwardRef<
  { getReactFlowInstance: () => any; fitView: () => void },
  DiagramCanvasProps
>(({ nodes, edges, theme, onNodesChange, onEdgesChange, onConnect }, ref) => {
  const reactFlowInstance = useReactFlow();
  const themeConfig = getTheme(theme as any);

  // Convert DiagramNode[] to ReactFlow Node[]
  const reactFlowNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    type: "default",
    position: node.position,
    data: {
      label: node.label,
      shape: node.shape || "rectangle",
      color: node.color || themeConfig.nodeColors[node.type || "process"],
      backgroundColor: node.backgroundColor || `${node.color || themeConfig.nodeColors[node.type || "process"]}20`,
      width: node.width || 150,
      height: node.height || 80,
      ...node.data,
    },
  }));

  // Convert DiagramEdge[] to ReactFlow Edge[]
  const reactFlowEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: edge.animated,
    style: {
      stroke: edge.style?.stroke || themeConfig.edgeColor,
      strokeWidth: edge.style?.strokeWidth || themeConfig.edgeWidth,
      strokeDasharray: edge.style?.strokeDasharray,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  }));

  const onConnectInternal = useCallback(
    (params: Connection) => {
      if (onConnect) {
        onConnect(params);
      }
    },
    [onConnect]
  );

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getReactFlowInstance: () => reactFlowInstance,
    fitView: () => reactFlowInstance.fitView(),
  }));

  return (
    <div className="w-full h-full" style={{ background: themeConfig.backgroundColor }}>
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectInternal}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Background color={themeConfig.gridColor} gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node: any) => node.data?.color || themeConfig.nodeColors.process}
          maskColor={themeConfig.backgroundColor + "80"}
        />
      </ReactFlow>
    </div>
  );
});

DiagramCanvasInternal.displayName = "DiagramCanvasInternal";

// Wrapper component with ReactFlowProvider
export const DiagramCanvas = forwardRef<
  { getReactFlowInstance: () => any; fitView: () => void },
  DiagramCanvasProps
>((props, ref) => {
  return (
    <ReactFlowProvider>
      <DiagramCanvasInternal {...props} ref={ref} />
    </ReactFlowProvider>
  );
});

DiagramCanvas.displayName = "DiagramCanvas";


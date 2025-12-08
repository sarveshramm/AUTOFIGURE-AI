// Type definitions for diagram nodes, edges, and API responses

export type NodeType = "start" | "process" | "decision" | "end" | "root" | "child" | "category";

export type NodeShape = "rectangle" | "rounded" | "circle" | "diamond" | "ellipse";

export type DiagramNode = {
  id: string;
  label: string;
  position: { x: number; y: number };
  type?: NodeType;
  shape?: NodeShape;
  color?: string;
  backgroundColor?: string;
};

export type DiagramEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: { stroke?: string; strokeWidth?: number };
};

export type DiagramResponse = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  diagramType?: "flow" | "hierarchy" | "cluster";
};

export type DiagramMode = "auto" | "flow" | "hierarchy";

export type GenerateDiagramRequest = {
  text: string;
  mode: DiagramMode;
};

// Saved diagram structure for localStorage
export type SavedDiagram = {
  id: string;
  name: string;
  createdAt: string;
  diagram: DiagramResponse;
};



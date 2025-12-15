// Type definitions for diagram nodes, edges, and API responses

export type NodeType = 
  | "start" | "process" | "decision" | "end" | "root" | "child" | "category"
  | "entity" | "attribute" | "relationship" | "class" | "actor" | "usecase"
  | "router" | "switch" | "server" | "host" | "datastore" | "external"
  | "state" | "initial_state" | "final_state" | "lifeline" | "message"
  | "activation" | "touchpoint" | "stage" | "milestone" | "block" | "input_output"
  | "document" | "manual_input" | "data_storage" | "predefined_process" | "delay"
  | "loop_limit" | "connector" | "weak_entity" | "multivalued_attr" | "derived_attr";

export type NodeShape = 
  | "rectangle" | "rounded" | "circle" | "diamond" | "ellipse" | "oval"
  | "hexagon" | "parallelogram" | "cylinder" | "pentagon" | "trapezoid";

export type DiagramType =
  | "flowchart" | "sequence" | "class" | "state" | "er" | "user_journey"
  | "pie_chart" | "quadrant" | "timeline" | "sankey" | "xy_chart" | "block";

export type DiagramThemeName =
  | "minimal" | "neon" | "cyberpunk" | "pastel" | "blueprint" | "techwire" | "professional_office";

export type DiagramNode = {
  id: string;
  label: string;
  position: { x: number; y: number };
  type?: NodeType;
  shape?: NodeShape;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
  data?: {
    attributes?: string[];
    methods?: string[];
    visibility?: string;
    cardinality?: string;
    value?: number;
    percentage?: number;
    category?: string;
    [key: string]: any;
  };
};

export type DiagramEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: { 
    stroke?: string; 
    strokeWidth?: number;
    strokeDasharray?: string;
  };
  type?: "default" | "smoothstep" | "step" | "straight" | "bezier";
};

export type DiagramResponse = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  diagramType?: DiagramType | "flow" | "hierarchy" | "cluster";
};

export type DiagramMode = "auto" | "flow" | "hierarchy";

export type GenerateDiagramRequest = {
  text: string;
  mode?: DiagramMode;
  diagramType?: DiagramType;
};

export type SavedDiagram = {
  id: string;
  name: string;
  createdAt: string;
  diagram: DiagramResponse;
};

export type DiagramThemeConfig = {
  name: string;
  nodeColors: {
    start: string;
    process: string;
    decision: string;
    end: string;
    root: string;
    child: string;
    [key: string]: string;
  };
  edgeColor: string;
  edgeWidth: number;
  backgroundColor: string;
  gridColor: string;
  glowEffect?: boolean;
  borderStyle?: "solid" | "dashed" | "dotted";
};

export type DiagramChatRequest = {
  message: string;
  diagram?: DiagramResponse | null;
  diagramType?: DiagramType;
};

export type DiagramChatResponse = {
  reply: string;
  updatedDiagram?: DiagramResponse;
};


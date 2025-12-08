/**
 * Core logic for converting text into diagram structures
 * This is rule-based logic that can be replaced with AI later
 */

import { DiagramResponse, DiagramNode, DiagramEdge, NodeType, NodeShape } from "./types";
import {
  splitIntoSentences,
  extractListAfterKeyword,
  extractMainConcept,
  extractMinimalLabel,
  hasDecisionKeywords,
} from "./textUtils";

// Color schemes for different node types
const NODE_COLORS = {
  start: { bg: "#10b981", text: "#ffffff" }, // green
  process: { bg: "#3b82f6", text: "#ffffff" }, // blue
  decision: { bg: "#f59e0b", text: "#ffffff" }, // amber
  end: { bg: "#ef4444", text: "#ffffff" }, // red
  root: { bg: "#8b5cf6", text: "#ffffff" }, // purple
  child: { bg: "#a855f7", text: "#ffffff" }, // violet
  category: { bg: "#ec4899", text: "#ffffff" }, // pink
};

/**
 * Build a linear flow diagram (nodes connected in sequence)
 * For processes, steps, or sequential information
 */
export function buildLinearFlowFromText(text: string): DiagramResponse {
  const sentences = splitIntoSentences(text);
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];

  // Create nodes from sentences
  sentences.forEach((sentence, index) => {
    // Use minimal label extraction for cleaner node labels
    const label = extractMinimalLabel(sentence, 4);
    const isDecision = hasDecisionKeywords(sentence);
    const isFirst = index === 0;
    const isLast = index === sentences.length - 1;
    
    let nodeType: NodeType = "process";
    let shape: NodeShape = "rounded";
    let colors = NODE_COLORS.process;

    if (isFirst) {
      nodeType = "start";
      shape = "circle";
      colors = NODE_COLORS.start;
    } else if (isLast) {
      nodeType = "end";
      shape = "circle";
      colors = NODE_COLORS.end;
    } else if (isDecision) {
      nodeType = "decision";
      shape = "diamond";
      colors = NODE_COLORS.decision;
    }
    
    nodes.push({
      id: `node-${index}`,
      label,
      position: { x: index * 250, y: 100 }, // Horizontal layout
      type: nodeType,
      shape,
      backgroundColor: colors.bg,
      color: colors.text,
    });

    // Connect each node to the next one
    if (index > 0) {
      edges.push({
        id: `edge-${index - 1}-${index}`,
        source: `node-${index - 1}`,
        target: `node-${index}`,
        style: { stroke: "#6b7280", strokeWidth: 2 },
      });
    }
  });

  // If no nodes created, create at least one
  if (nodes.length === 0) {
    nodes.push({
      id: "node-0",
      label: extractMinimalLabel(text, 4) || "Empty",
      position: { x: 100, y: 100 },
      type: "process",
      shape: "rounded",
      backgroundColor: NODE_COLORS.process.bg,
      color: NODE_COLORS.process.text,
    });
  }

  return { nodes, edges, diagramType: "flow" };
}

/**
 * Build a hierarchy diagram (root node with children)
 * For categories, types, layers, components
 */
export function buildHierarchyFromText(text: string): DiagramResponse {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];

  // Try to extract a list after keywords
  const listData = extractListAfterKeyword(text);
  const mainConcept = extractMainConcept(text);

  if (listData && listData.items.length > 0) {
    // Root node (main concept) - use minimal label
    const rootLabel = extractMinimalLabel(mainConcept, 5);
    nodes.push({
      id: "root",
      label: rootLabel,
      position: { x: 400, y: 50 },
      type: "root",
      shape: "ellipse",
      backgroundColor: NODE_COLORS.root.bg,
      color: NODE_COLORS.root.text,
    });

    // Child nodes (list items) - use minimal labels
    const itemsPerRow = 3;
    const rowHeight = 150;
    const colWidth = 250;

    listData.items.forEach((item, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      
      const nodeId = `child-${index}`;
      const childLabel = extractMinimalLabel(item, 3);
      
      nodes.push({
        id: nodeId,
        label: childLabel,
        position: {
          x: col * colWidth + 50,
          y: row * rowHeight + 200,
        },
        type: "child",
        shape: "rounded",
        backgroundColor: NODE_COLORS.child.bg,
        color: NODE_COLORS.child.text,
      });

      // Connect root to child
      edges.push({
        id: `edge-root-${index}`,
        source: "root",
        target: nodeId,
        style: { stroke: "#8b5cf6", strokeWidth: 2 },
      });
    });
  } else {
    // Fallback: treat as linear flow if no list found
    return buildLinearFlowFromText(text);
  }

  return { nodes, edges, diagramType: "hierarchy" };
}

/**
 * Auto-detect diagram type based on text content
 * Uses simple heuristics to determine if text is a process or hierarchy
 */
export function autoDetectDiagram(text: string): DiagramResponse {
  const lowerText = text.toLowerCase();

  // Keywords that suggest a hierarchy/structure
  const hierarchyKeywords = [
    "layers",
    "types of",
    "components of",
    "categories",
    "consists of",
    "includes",
    "contains",
  ];

  // Keywords that suggest a process/flow
  const flowKeywords = [
    "steps",
    "process",
    "first",
    "next",
    "then",
    "after",
    "finally",
    "sequence",
  ];

  // Check for hierarchy keywords
  const hasHierarchyKeyword = hierarchyKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  // Check for flow keywords
  const hasFlowKeyword = flowKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  // If hierarchy keywords found, use hierarchy
  if (hasHierarchyKeyword) {
    return buildHierarchyFromText(text);
  }

  // If flow keywords found, use linear flow
  if (hasFlowKeyword) {
    return buildLinearFlowFromText(text);
  }

  // Default: try hierarchy first (common for educational content)
  // If it fails to extract list, fallback to linear flow
  const hierarchyResult = buildHierarchyFromText(text);
  if (hierarchyResult.nodes.length > 1) {
    return hierarchyResult;
  }

  return buildLinearFlowFromText(text);
}



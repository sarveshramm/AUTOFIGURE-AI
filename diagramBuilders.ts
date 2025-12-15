/**
 * Diagram Builders for all 12 diagram types
 * Converts text input into structured diagram data with proper shapes
 */

import { DiagramNode, DiagramEdge, DiagramType, DiagramResponse } from "./types";
import { 
  splitIntoSentences, 
  extractListAfterKeyword, 
  extractMainConcept, 
  extractMinimalLabel,
  hasDecisionKeywords 
} from "./textUtils";

// ==================== FLOWCHART ====================
export function buildFlowchartDiagram(text: string): DiagramResponse {
  const sentences = splitIntoSentences(text);
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Start node
  nodes.push({
    id: "start",
    label: "Start",
    position: { x: 250, y: 50 },
    type: "start",
    shape: "rounded",
    width: 120,
    height: 60,
  });

  let yPos = 150;
  let prevId = "start";

  sentences.forEach((sentence, index) => {
    const isDecision = hasDecisionKeywords(sentence);
    const nodeId = `node-${index}`;
    const label = extractMinimalLabel(sentence, 5);
    
    nodes.push({
      id: nodeId,
      label,
      position: { x: 250, y: yPos },
      type: isDecision ? "decision" : "process",
      shape: isDecision ? "diamond" : "rectangle",
      width: isDecision ? 140 : 150,
      height: isDecision ? 100 : 60,
    });

    edges.push({
      id: `edge-${prevId}-${nodeId}`,
      source: prevId,
      target: nodeId,
    });

    prevId = nodeId;
    yPos += 120;
  });

  // End node
  nodes.push({
    id: "end",
    label: "End",
    position: { x: 250, y: yPos },
    type: "end",
    shape: "rounded",
    width: 120,
    height: 60,
  });

  edges.push({
    id: `edge-${prevId}-end`,
    source: prevId,
    target: "end",
  });

  return { nodes, edges, diagramType: "flowchart" };
}

// ==================== SEQUENCE DIAGRAM ====================
export function buildSequenceDiagram(text: string): DiagramResponse {
  const sentences = splitIntoSentences(text);
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract actors/participants
  const actors: string[] = [];
  const listResult = extractListAfterKeyword(text);
  if (listResult && listResult.items.length > 0) {
    actors.push(...listResult.items.slice(0, 5));
  } else {
    // Extract from sentences
    sentences.slice(0, 3).forEach(s => {
      const words = s.split(/\s+/);
      if (words.length > 0) {
        const actor = extractMinimalLabel(words[0], 1);
        if (actor && !actors.includes(actor)) actors.push(actor);
      }
    });
  }

  if (actors.length === 0) actors.push("User", "System", "Database");

  const actorSpacing = 200;
  const startX = 100;
  const startY = 50;
  const messageSpacing = 100;

  // Create lifelines (vertical lines with actor nodes at top)
  actors.forEach((actor, index) => {
    const x = startX + index * actorSpacing;
    nodes.push({
      id: `actor-${index}`,
      label: actor,
      position: { x, y: startY },
      type: "lifeline",
      shape: "rectangle",
      width: 100,
      height: 50,
    });
  });

  // Create messages between actors
  let messageY = startY + 100;
  sentences.slice(0, 8).forEach((sentence, index) => {
    const fromIndex = index % actors.length;
    const toIndex = (index + 1) % actors.length;
    
    const messageId = `message-${index}`;
    edges.push({
      id: messageId,
      source: `actor-${fromIndex}`,
      target: `actor-${toIndex}`,
      label: extractMinimalLabel(sentence, 4),
      animated: true,
    });

    messageY += messageSpacing;
  });

  return { nodes, edges, diagramType: "sequence" };
}

// ==================== CLASS DIAGRAM ====================
export function buildClassDiagram(text: string): DiagramResponse {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract classes
  const classPattern = /(?:class|interface|type)\s+(\w+)/gi;
  const classMatches = [...text.matchAll(classPattern)];
  const classes: Array<{ name: string; attributes?: string[]; methods?: string[] }> = [];

  if (classMatches.length > 0) {
    classMatches.forEach(match => {
      classes.push({ name: match[1] });
    });
  } else {
    // Extract from list
    const listResult = extractListAfterKeyword(text);
    if (listResult) {
      listResult.items.forEach(item => {
        classes.push({ name: extractMinimalLabel(item, 1) });
      });
    } else {
      classes.push({ name: "Class1" }, { name: "Class2" }, { name: "Class3" });
    }
  }

  const cols = Math.ceil(Math.sqrt(classes.length));
  const spacing = 300;
  const startX = 100;
  const startY = 100;

  classes.forEach((cls, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + col * spacing;
    const y = startY + row * spacing;

    nodes.push({
      id: `class-${index}`,
      label: cls.name,
      position: { x, y },
      type: "class",
      shape: "rectangle",
      width: 180,
      height: 120,
      data: {
        attributes: cls.attributes || [`+attribute${index + 1}: string`],
        methods: cls.methods || [`+method${index + 1}()`],
        visibility: "public",
      },
    });
  });

  // Create relationships
  for (let i = 0; i < classes.length - 1; i++) {
    edges.push({
      id: `rel-${i}-${i + 1}`,
      source: `class-${i}`,
      target: `class-${i + 1}`,
      label: "uses",
    });
  }

  return { nodes, edges, diagramType: "class" };
}

// ==================== STATE DIAGRAM ====================
export function buildStateDiagram(text: string): DiagramResponse {
  const sentences = splitIntoSentences(text);
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Initial state
  nodes.push({
    id: "initial",
    label: "",
    position: { x: 100, y: 200 },
    type: "initial_state",
    shape: "circle",
    width: 30,
    height: 30,
  });

  // Extract states
  const states: string[] = [];
  const statePattern = /(?:state|status|stage)\s+(\w+)/gi;
  const stateMatches = [...text.matchAll(statePattern)];
  
  if (stateMatches.length > 0) {
    stateMatches.forEach(match => states.push(match[1]));
  } else {
    sentences.slice(0, 5).forEach(s => {
      const state = extractMinimalLabel(s, 2);
      if (state && !states.includes(state)) states.push(state);
    });
  }

  if (states.length === 0) states.push("Idle", "Active", "Completed");

  const spacing = 250;
  const startX = 200;
  const startY = 150;

  states.forEach((state, index) => {
    const x = startX + (index % 3) * spacing;
    const y = startY + Math.floor(index / 3) * spacing;
    
    nodes.push({
      id: `state-${index}`,
      label: state,
      position: { x, y },
      type: "state",
      shape: "rounded",
      width: 150,
      height: 80,
    });
  });

  // Connect initial to first state
  if (states.length > 0) {
    edges.push({
      id: "edge-initial-0",
      source: "initial",
      target: "state-0",
    });
  }

  // Connect states
  for (let i = 0; i < states.length - 1; i++) {
    edges.push({
      id: `edge-${i}-${i + 1}`,
      source: `state-${i}`,
      target: `state-${i + 1}`,
      label: "transition",
    });
  }

  // Final state
  if (states.length > 0) {
    nodes.push({
      id: "final",
      label: "",
      position: { x: startX + (states.length % 3) * spacing, y: startY + Math.floor(states.length / 3) * spacing + 100 },
      type: "final_state",
      shape: "circle",
      width: 30,
      height: 30,
    });
    edges.push({
      id: "edge-final",
      source: `state-${states.length - 1}`,
      target: "final",
    });
  }

  return { nodes, edges, diagramType: "state" };
}

// ==================== ER DIAGRAM ====================
export function buildERDiagram(text: string): DiagramResponse {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract entities
  const entities: string[] = [];
  const listResult = extractListAfterKeyword(text);
  if (listResult && listResult.keyword.toLowerCase().includes("entit")) {
    entities.push(...listResult.items.slice(0, 6));
  } else {
    // Extract capitalized words as potential entities
    const words = text.match(/\b[A-Z][a-z]+\b/g) || [];
    entities.push(...Array.from(new Set(words)).slice(0, 6));
  }

  if (entities.length === 0) entities.push("Customer", "Order", "Product");

  const cols = Math.ceil(Math.sqrt(entities.length));
  const spacing = 250;
  const startX = 100;
  const startY = 100;

  entities.forEach((entity, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + col * spacing;
    const y = startY + row * spacing;

    nodes.push({
      id: `entity-${index}`,
      label: entity,
      position: { x, y },
      type: "entity",
      shape: "rectangle",
      width: 150,
      height: 100,
      data: {
        attributes: [`id`, `name`, `created_at`],
      },
    });
  });

  // Create relationships
  for (let i = 0; i < entities.length - 1; i++) {
    edges.push({
      id: `rel-${i}-${i + 1}`,
      source: `entity-${i}`,
      target: `entity-${i + 1}`,
      label: "has",
      type: "straight",
    });
  }

  return { nodes, edges, diagramType: "er" };
}

// ==================== USER JOURNEY DIAGRAM ====================
export function buildUserJourneyDiagram(text: string): DiagramResponse {
  const sentences = splitIntoSentences(text);
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract journey stages
  const stages: Array<{ stage: string; action?: string }> = [];
  
  sentences.forEach((sentence, index) => {
    const stageMatch = sentence.match(/(?:stage|step|phase)\s+(\d+)[:\.]?\s*(.+)/i);
    if (stageMatch) {
      stages.push({ stage: stageMatch[1], action: stageMatch[2] });
    } else if (index < 6) {
      stages.push({ stage: String(index + 1), action: extractMinimalLabel(sentence, 5) });
    }
  });

  if (stages.length === 0) {
    stages.push(
      { stage: "1", action: "Discover" },
      { stage: "2", action: "Research" },
      { stage: "3", action: "Purchase" },
      { stage: "4", action: "Use" }
    );
  }

  const spacing = 200;
  const startX = 100;
  const startY = 200;

  stages.forEach((stage, index) => {
    const x = startX + index * spacing;
    
    nodes.push({
      id: `stage-${index}`,
      label: stage.action || `Stage ${stage.stage}`,
      position: { x, y: startY },
      type: "stage",
      shape: "rounded",
      width: 150,
      height: 80,
      data: {
        stage: stage.stage,
      },
    });
  });

  // Connect stages
  for (let i = 0; i < stages.length - 1; i++) {
    edges.push({
      id: `edge-${i}-${i + 1}`,
      source: `stage-${i}`,
      target: `stage-${i + 1}`,
      animated: true,
    });
  }

  return { nodes, edges, diagramType: "user_journey" };
}

// ==================== PIE CHART ====================
export function buildPieChartDiagram(text: string): DiagramResponse {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract categories and values
  const categories: Array<{ name: string; value: number }> = [];
  const listResult = extractListAfterKeyword(text);
  
  if (listResult) {
    listResult.items.forEach((item, index) => {
      const valueMatch = item.match(/(\d+)/);
      const value = valueMatch ? parseInt(valueMatch[1]) : (index + 1) * 20;
      categories.push({
        name: extractMinimalLabel(item.replace(/\d+/g, ""), 2),
        value,
      });
    });
  } else {
    // Default categories
    categories.push(
      { name: "Category A", value: 30 },
      { name: "Category B", value: 25 },
      { name: "Category C", value: 20 },
      { name: "Category D", value: 15 },
      { name: "Category E", value: 10 }
    );
  }

  const total = categories.reduce((sum, cat) => sum + cat.value, 0);
  const centerX = 400;
  const centerY = 300;
  const radius = 150;

  // Create center node
  nodes.push({
    id: "center",
    label: "Total",
    position: { x: centerX, y: centerY },
    type: "category",
    shape: "circle",
    width: 100,
    height: 100,
  });

  // Create category nodes in a circle
  let currentAngle = 0;
  categories.forEach((category, index) => {
    const percentage = (category.value / total) * 100;
    const angle = (currentAngle + (percentage / 100) * Math.PI) / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    nodes.push({
      id: `category-${index}`,
      label: `${category.name}\n${percentage.toFixed(1)}%`,
      position: { x, y },
      type: "category",
      shape: "circle",
      width: 120,
      height: 120,
      data: {
        value: category.value,
        percentage,
      },
    });

    edges.push({
      id: `edge-${index}`,
      source: "center",
      target: `category-${index}`,
      label: `${category.value}`,
    });

    currentAngle += (percentage / 100) * Math.PI * 2;
  });

  return { nodes, edges, diagramType: "pie_chart" };
}

// ==================== QUADRANT CHART ====================
export function buildQuadrantChartDiagram(text: string): DiagramResponse {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract items for quadrants
  const items: Array<{ name: string; x: number; y: number }> = [];
  const listResult = extractListAfterKeyword(text);
  
  if (listResult) {
    listResult.items.forEach((item, index) => {
      items.push({
        name: extractMinimalLabel(item, 2),
        x: (index % 2) * 200 + 100,
        y: Math.floor(index / 2) * 150 + 100,
      });
    });
  } else {
    items.push(
      { name: "High Impact, Low Effort", x: 300, y: 100 },
      { name: "High Impact, High Effort", x: 500, y: 100 },
      { name: "Low Impact, Low Effort", x: 300, y: 250 },
      { name: "Low Impact, High Effort", x: 500, y: 250 }
    );
  }

  const centerX = 400;
  const centerY = 200;

  // Create quadrant labels
  nodes.push(
    {
      id: "q1",
      label: "High Impact\nLow Effort",
      position: { x: centerX - 150, y: centerY - 100 },
      type: "category",
      shape: "rectangle",
      width: 120,
      height: 80,
    },
    {
      id: "q2",
      label: "High Impact\nHigh Effort",
      position: { x: centerX + 50, y: centerY - 100 },
      type: "category",
      shape: "rectangle",
      width: 120,
      height: 80,
    },
    {
      id: "q3",
      label: "Low Impact\nLow Effort",
      position: { x: centerX - 150, y: centerY + 50 },
      type: "category",
      shape: "rectangle",
      width: 120,
      height: 80,
    },
    {
      id: "q4",
      label: "Low Impact\nHigh Effort",
      position: { x: centerX + 50, y: centerY + 50 },
      type: "category",
      shape: "rectangle",
      width: 120,
      height: 80,
    }
  );

  // Create item nodes
  items.forEach((item, index) => {
    nodes.push({
      id: `item-${index}`,
      label: item.name,
      position: { x: item.x, y: item.y },
      type: "category",
      shape: "circle",
      width: 100,
      height: 100,
      data: {
        x: item.x,
        y: item.y,
      },
    });
  });

  return { nodes, edges, diagramType: "quadrant" };
}

// ==================== TIMELINE DIAGRAM ====================
export function buildTimelineDiagram(text: string): DiagramResponse {
  const sentences = splitIntoSentences(text);
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract timeline events
  const events: Array<{ date: string; event: string }> = [];
  
  sentences.forEach((sentence) => {
    const dateMatch = sentence.match(/(\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4}|\w+\s+\d{4})/i);
    if (dateMatch) {
      events.push({
        date: dateMatch[1],
        event: extractMinimalLabel(sentence.replace(dateMatch[1], ""), 5),
      });
    }
  });

  if (events.length === 0) {
    sentences.slice(0, 6).forEach((sentence, index) => {
      events.push({
        date: `202${index}`,
        event: extractMinimalLabel(sentence, 5),
      });
    });
  }

  const startX = 100;
  const startY = 200;
  const spacing = 250;

  // Create timeline line (represented as nodes)
  events.forEach((event, index) => {
    const x = startX + index * spacing;
    
    // Milestone node
    nodes.push({
      id: `milestone-${index}`,
      label: event.date,
      position: { x, y: startY },
      type: "milestone",
      shape: "diamond",
      width: 120,
      height: 120,
    });

    // Event node
    nodes.push({
      id: `event-${index}`,
      label: event.event,
      position: { x, y: startY + 150 },
      type: "stage",
      shape: "rounded",
      width: 150,
      height: 80,
    });

    edges.push({
      id: `edge-${index}`,
      source: `milestone-${index}`,
      target: `event-${index}`,
    });
  });

  // Connect milestones
  for (let i = 0; i < events.length - 1; i++) {
    edges.push({
      id: `timeline-${i}`,
      source: `milestone-${i}`,
      target: `milestone-${i + 1}`,
      style: { strokeDasharray: "5,5" },
    });
  }

  return { nodes, edges, diagramType: "timeline" };
}

// ==================== SANKEY DIAGRAM ====================
export function buildSankeyDiagram(text: string): DiagramResponse {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract source and target nodes
  const sources: string[] = [];
  const targets: string[] = [];
  const listResult = extractListAfterKeyword(text);
  
  if (listResult) {
    const midPoint = Math.ceil(listResult.items.length / 2);
    sources.push(...listResult.items.slice(0, midPoint));
    targets.push(...listResult.items.slice(midPoint));
  } else {
    sources.push("Source A", "Source B", "Source C");
    targets.push("Target X", "Target Y");
  }

  const sourceSpacing = 150;
  const targetSpacing = 150;
  const startX = 100;
  const startY = 150;
  const targetX = 500;

  // Create source nodes
  sources.forEach((source, index) => {
    nodes.push({
      id: `source-${index}`,
      label: source,
      position: { x: startX, y: startY + index * sourceSpacing },
      type: "category",
      shape: "rectangle",
      width: 120,
      height: 80,
    });
  });

  // Create target nodes
  targets.forEach((target, index) => {
    nodes.push({
      id: `target-${index}`,
      label: target,
      position: { x: targetX, y: startY + index * targetSpacing },
      type: "category",
      shape: "rectangle",
      width: 120,
      height: 80,
    });
  });

  // Create flow edges
  sources.forEach((source, sIndex) => {
    targets.forEach((target, tIndex) => {
      edges.push({
        id: `flow-${sIndex}-${tIndex}`,
        source: `source-${sIndex}`,
        target: `target-${tIndex}`,
        label: `${(sIndex + tIndex + 1) * 10}`,
        animated: true,
        style: { strokeWidth: (sIndex + tIndex + 1) * 2 },
      });
    });
  });

  return { nodes, edges, diagramType: "sankey" };
}

// ==================== XY CHART ====================
export function buildXYChartDiagram(text: string): DiagramResponse {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract data points
  const points: Array<{ name: string; x: number; y: number }> = [];
  const listResult = extractListAfterKeyword(text);
  
  if (listResult) {
    listResult.items.forEach((item, index) => {
      const coords = item.match(/(\d+)[,:\s]+(\d+)/);
      if (coords) {
        points.push({
          name: extractMinimalLabel(item, 1),
          x: parseInt(coords[1]),
          y: parseInt(coords[2]),
        });
      } else {
        points.push({
          name: extractMinimalLabel(item, 1),
          x: index * 10,
          y: index * 5,
        });
      }
    });
  } else {
    // Default points
    for (let i = 0; i < 8; i++) {
      points.push({
        name: `Point ${i + 1}`,
        x: i * 20 + 50,
        y: Math.random() * 100 + 50,
      });
    }
  }

  const baseX = 200;
  const baseY = 300;
  const scale = 2;

  // Create axis labels
  nodes.push(
    {
      id: "x-axis",
      label: "X Axis",
      position: { x: baseX + 200, y: baseY + 150 },
      type: "category",
      shape: "rectangle",
      width: 80,
      height: 40,
    },
    {
      id: "y-axis",
      label: "Y Axis",
      position: { x: baseX - 100, y: baseY - 100 },
      type: "category",
      shape: "rectangle",
      width: 80,
      height: 40,
    }
  );

  // Create data point nodes
  points.forEach((point, index) => {
    nodes.push({
      id: `point-${index}`,
      label: `${point.name}\n(${point.x}, ${point.y})`,
      position: { x: baseX + point.x * scale, y: baseY - point.y * scale },
      type: "category",
      shape: "circle",
      width: 80,
      height: 80,
      data: {
        x: point.x,
        y: point.y,
      },
    });
  });

  // Connect points in sequence
  for (let i = 0; i < points.length - 1; i++) {
    edges.push({
      id: `line-${i}`,
      source: `point-${i}`,
      target: `point-${i + 1}`,
      style: { strokeDasharray: "3,3" },
    });
  }

  return { nodes, edges, diagramType: "xy_chart" };
}

// ==================== BLOCK DIAGRAM ====================
export function buildBlockDiagram(text: string): DiagramResponse {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  
  // Extract blocks/components
  const blocks: string[] = [];
  const listResult = extractListAfterKeyword(text);
  
  if (listResult) {
    blocks.push(...listResult.items.slice(0, 8));
  } else {
    // Extract from text
    const words = text.match(/\b[A-Z][a-z]+\b/g) || [];
    blocks.push(...Array.from(new Set(words)).slice(0, 8));
  }

  if (blocks.length === 0) blocks.push("Input", "Process", "Output", "Storage");

  const cols = Math.ceil(Math.sqrt(blocks.length));
  const spacing = 200;
  const startX = 100;
  const startY = 100;

  blocks.forEach((block, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + col * spacing;
    const y = startY + row * spacing;

    nodes.push({
      id: `block-${index}`,
      label: block,
      position: { x, y },
      type: "block",
      shape: "rectangle",
      width: 150,
      height: 100,
    });
  });

  // Create hierarchical connections
  for (let i = 0; i < blocks.length - 1; i++) {
    const nextIndex = i + 1;
    if (nextIndex < blocks.length) {
      edges.push({
        id: `conn-${i}-${nextIndex}`,
        source: `block-${i}`,
        target: `block-${nextIndex}`,
      });
    }
  }

  return { nodes, edges, diagramType: "block" };
}

// ==================== AUTO DETECT DIAGRAM TYPE ====================
export function autoDetectDiagramType(text: string): DiagramType {
  const lowerText = text.toLowerCase();
  
  // Check for explicit mentions
  if (lowerText.includes("flowchart") || lowerText.includes("flow chart") || hasDecisionKeywords(text)) {
    return "flowchart";
  }
  if (lowerText.includes("sequence") || lowerText.includes("interaction") || lowerText.includes("message")) {
    return "sequence";
  }
  if (lowerText.includes("class") || lowerText.includes("uml class") || lowerText.includes("object")) {
    return "class";
  }
  if (lowerText.includes("state") || lowerText.includes("state machine") || lowerText.includes("state diagram")) {
    return "state";
  }
  if (lowerText.includes("er diagram") || lowerText.includes("entity relationship") || lowerText.includes("database")) {
    return "er";
  }
  if (lowerText.includes("user journey") || lowerText.includes("customer journey") || lowerText.includes("journey map")) {
    return "user_journey";
  }
  if (lowerText.includes("pie chart") || lowerText.includes("pie") || lowerText.includes("percentage")) {
    return "pie_chart";
  }
  if (lowerText.includes("quadrant") || lowerText.includes("matrix") || lowerText.includes("priority")) {
    return "quadrant";
  }
  if (lowerText.includes("timeline") || lowerText.includes("time line") || lowerText.match(/\d{4}/)) {
    return "timeline";
  }
  if (lowerText.includes("sankey") || lowerText.includes("flow") && lowerText.includes("source") && lowerText.includes("target")) {
    return "sankey";
  }
  if (lowerText.includes("xy chart") || lowerText.includes("scatter") || lowerText.includes("coordinate")) {
    return "xy_chart";
  }
  if (lowerText.includes("block") || lowerText.includes("component") || lowerText.includes("system architecture")) {
    return "block";
  }
  
  // Default to flowchart
  return "flowchart";
}

// ==================== MAIN BUILDER FUNCTION ====================
export function buildDiagram(text: string, diagramType?: DiagramType): DiagramResponse {
  const type = diagramType || autoDetectDiagramType(text);
  
  switch (type) {
    case "flowchart":
      return buildFlowchartDiagram(text);
    case "sequence":
      return buildSequenceDiagram(text);
    case "class":
      return buildClassDiagram(text);
    case "state":
      return buildStateDiagram(text);
    case "er":
      return buildERDiagram(text);
    case "user_journey":
      return buildUserJourneyDiagram(text);
    case "pie_chart":
      return buildPieChartDiagram(text);
    case "quadrant":
      return buildQuadrantChartDiagram(text);
    case "timeline":
      return buildTimelineDiagram(text);
    case "sankey":
      return buildSankeyDiagram(text);
    case "xy_chart":
      return buildXYChartDiagram(text);
    case "block":
      return buildBlockDiagram(text);
    default:
      return buildFlowchartDiagram(text);
  }
}


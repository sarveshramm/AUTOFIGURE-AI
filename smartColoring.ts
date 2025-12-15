/**
 * Smart Coloring System
 * Automatically assigns colors to nodes based on context and theme
 */

import { DiagramNode, DiagramThemeConfig, DiagramType } from "./types";
import { getTheme } from "./diagramThemes";

export function applySmartColoring(
  nodes: DiagramNode[],
  themeName: string,
  diagramType: DiagramType
): DiagramNode[] {
  const theme = getTheme(themeName as any);
  
  return nodes.map((node) => {
    const nodeType = node.type || "process";
    let color = theme.nodeColors[nodeType] || theme.nodeColors.process;
    let backgroundColor = color + "20"; // 20% opacity
    
    // Apply diagram-specific coloring
    switch (diagramType) {
      case "flowchart":
        if (nodeType === "start") color = theme.nodeColors.start;
        else if (nodeType === "decision") color = theme.nodeColors.decision;
        else if (nodeType === "end") color = theme.nodeColors.end;
        else color = theme.nodeColors.process;
        break;
        
      case "sequence":
        // Alternate colors for different actors
        const actorIndex = parseInt(node.id.split("-")[1] || "0");
        const colors = [
          theme.nodeColors.start,
          theme.nodeColors.process,
          theme.nodeColors.decision,
          theme.nodeColors.end,
        ];
        color = colors[actorIndex % colors.length];
        break;
        
      case "class":
        color = theme.nodeColors.class;
        break;
        
      case "state":
        if (nodeType === "initial_state" || nodeType === "final_state") {
          color = theme.nodeColors.start;
        } else {
          color = theme.nodeColors.state;
        }
        break;
        
      case "er":
        color = theme.nodeColors.entity;
        break;
        
      case "user_journey":
        // Gradient based on stage index
        const stageIndex = parseInt(node.id.split("-")[1] || "0");
        const journeyColors = [
          theme.nodeColors.start,
          theme.nodeColors.process,
          theme.nodeColors.decision,
          theme.nodeColors.end,
        ];
        color = journeyColors[stageIndex % journeyColors.length];
        break;
        
      case "pie_chart":
      case "quadrant":
        // Use category colors
        const catIndex = parseInt(node.id.split("-")[1] || "0");
        const catColors = [
          theme.nodeColors.start,
          theme.nodeColors.process,
          theme.nodeColors.decision,
          theme.nodeColors.end,
          theme.nodeColors.root,
        ];
        color = catColors[catIndex % catColors.length];
        break;
        
      case "timeline":
        if (nodeType === "milestone") {
          color = theme.nodeColors.decision;
        } else {
          color = theme.nodeColors.process;
        }
        break;
        
      case "sankey":
        if (node.id.startsWith("source")) {
          color = theme.nodeColors.start;
        } else {
          color = theme.nodeColors.end;
        }
        break;
        
      case "xy_chart":
        color = theme.nodeColors.process;
        break;
        
      case "block":
        // Hierarchical coloring
        const blockIndex = parseInt(node.id.split("-")[1] || "0");
        const blockColors = [
          theme.nodeColors.start,
          theme.nodeColors.process,
          theme.nodeColors.decision,
          theme.nodeColors.end,
        ];
        color = blockColors[blockIndex % blockColors.length];
        break;
    }
    
    backgroundColor = color + "20";
    
    return {
      ...node,
      color,
      backgroundColor,
    };
  });
}


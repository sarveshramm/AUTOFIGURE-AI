/**
 * Diagram Export Functions
 * Exports diagrams in various formats (PNG, SVG, PDF, JSON)
 * Fixed to capture full diagram with correct aspect ratio
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DiagramResponse } from "./types";

/**
 * Export diagram as PNG
 * Captures the full diagram viewport with correct aspect ratio
 */
export async function exportAsPNG(
  reactFlowInstance: any,
  filename: string = "diagram.png"
): Promise<void> {
  try {
    // Get the react-flow container
    const reactFlowElement = document.querySelector(".react-flow") as HTMLElement;
    if (!reactFlowElement) {
      alert("Could not find diagram. Please make sure a diagram is displayed.");
      return;
    }

    // Check if there are nodes visible
    const nodes = reactFlowElement.querySelectorAll(".react-flow__node");
    if (nodes.length === 0) {
      alert("No diagram to export. Please generate a diagram first.");
      return;
    }

    // Try to fit view if instance is available
    if (reactFlowInstance && typeof reactFlowInstance.fitView === 'function') {
      try {
        reactFlowInstance.fitView({ padding: 0.1, duration: 0 });
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.log("Could not fit view, continuing anyway", err);
      }
    }

    // Use html2canvas to capture the diagram
    const canvas = await html2canvas(reactFlowElement, {
      backgroundColor: "#ffffff",
      scale: 3,
      useCORS: true,
      logging: false,
      allowTaint: true,
      width: Math.max(reactFlowElement.scrollWidth, reactFlowElement.clientWidth),
      height: Math.max(reactFlowElement.scrollHeight, reactFlowElement.clientHeight),
    });

    // Convert to blob and download
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) {
        alert("Failed to create image. Please try again.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }, "image/png");
  } catch (error) {
    console.error("Error exporting PNG:", error);
    alert("Failed to export PNG: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}

/**
 * Export diagram as PDF
 * Captures the full diagram with correct aspect ratio
 */
export async function exportAsPDF(
  reactFlowInstance: any,
  filename: string = "diagram.pdf"
): Promise<void> {
  try {
    // Get the react-flow container
    const reactFlowElement = document.querySelector(".react-flow") as HTMLElement;
    if (!reactFlowElement) {
      alert("Could not find diagram. Please make sure a diagram is displayed.");
      return;
    }

    // Check if there are nodes visible
    const nodes = reactFlowElement.querySelectorAll(".react-flow__node");
    if (nodes.length === 0) {
      alert("No diagram to export. Please generate a diagram first.");
      return;
    }

    // Try to fit view if instance is available
    if (reactFlowInstance && typeof reactFlowInstance.fitView === 'function') {
      try {
        reactFlowInstance.fitView({ padding: 0.1, duration: 0 });
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.log("Could not fit view, continuing anyway", err);
      }
    }

    // Get image data using html2canvas
    const canvas = await html2canvas(reactFlowElement, {
      backgroundColor: "#ffffff",
      scale: 3,
      useCORS: true,
      logging: false,
      allowTaint: true,
      width: Math.max(reactFlowElement.scrollWidth, reactFlowElement.clientWidth),
      height: Math.max(reactFlowElement.scrollHeight, reactFlowElement.clientHeight),
    });
    const imgData = canvas.toDataURL("image/png");

    // Get image dimensions
    const img = new Image();
    img.src = imgData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const imgWidth = img.width;
    const imgHeight = img.height;

    // Create PDF with proper dimensions (convert pixels to mm)
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? "landscape" : "portrait",
      unit: "mm",
    });

    // Calculate dimensions in mm (96 DPI = 3.779527559 pixels per mm)
    const widthMM = imgWidth / 3.779527559;
    const heightMM = imgHeight / 3.779527559;

    // Add image to PDF
    pdf.addImage(imgData, "PNG", 0, 0, widthMM, heightMM);
    pdf.save(filename);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert("Failed to export PDF. Please try again.");
  }
}

/**
 * Export diagram as SVG
 * Generates SVG representation of the diagram
 */
export function exportAsSVG(
  diagram: DiagramResponse,
  filename: string = "diagram.svg"
): void {
  try {
    if (!diagram || !diagram.nodes || diagram.nodes.length === 0) {
      alert("No diagram to export");
      return;
    }

    // Calculate bounds
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    diagram.nodes.forEach((node) => {
      const x = node.position.x;
      const y = node.position.y;
      const width = node.width || 150;
      const height = node.height || 80;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });

    const padding = 50;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    // Create SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX - padding} ${minY - padding} ${width} ${height}">\n`;
    svg += `<rect width="100%" height="100%" fill="white"/>\n`;

    // Add edges
    diagram.edges.forEach((edge) => {
      const sourceNode = diagram.nodes.find((n) => n.id === edge.source);
      const targetNode = diagram.nodes.find((n) => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const x1 = sourceNode.position.x + (sourceNode.width || 150) / 2;
        const y1 = sourceNode.position.y + (sourceNode.height || 80) / 2;
        const x2 = targetNode.position.x + (targetNode.width || 150) / 2;
        const y2 = targetNode.position.y + (targetNode.height || 80) / 2;
        
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${edge.style?.stroke || "#000"}" stroke-width="${edge.style?.strokeWidth || 2}"/>\n`;
        
        if (edge.label) {
          svg += `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2}" text-anchor="middle" font-size="12">${edge.label}</text>\n`;
        }
      }
    });

    // Add nodes
    diagram.nodes.forEach((node) => {
      const x = node.position.x;
      const y = node.position.y;
      const w = node.width || 150;
      const h = node.height || 80;
      const color = node.color || "#4A90E2";
      const bgColor = node.backgroundColor || color + "20";

      let shapeElement = "";
      if (node.shape === "circle" || node.shape === "oval") {
        const radius = Math.min(w, h) / 2;
        shapeElement = `<circle cx="${x + w / 2}" cy="${y + h / 2}" r="${radius}" fill="${bgColor}" stroke="${color}" stroke-width="2"/>\n`;
      } else if (node.shape === "diamond") {
        const points = `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`;
        shapeElement = `<polygon points="${points}" fill="${bgColor}" stroke="${color}" stroke-width="2"/>\n`;
      } else {
        const rx = node.shape === "rounded" ? 10 : 0;
        shapeElement = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${bgColor}" stroke="${color}" stroke-width="2"/>\n`;
      }

      svg += shapeElement;
      svg += `<text x="${x + w / 2}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="${color}">${node.label}</text>\n`;
    });

    svg += `</svg>`;

    // Download
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error("Error exporting SVG:", error);
    alert("Failed to export SVG. Please try again.");
  }
}

/**
 * Export diagram as JSON
 */
export function exportAsJSON(
  diagram: DiagramResponse,
  filename: string = "diagram.json"
): void {
  try {
    if (!diagram) {
      alert("No diagram to export");
      return;
    }
    const json = JSON.stringify(diagram, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error("Error exporting JSON:", error);
    alert("Failed to export JSON. Please try again.");
  }
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiagramType, DiagramThemeName, DiagramResponse } from "@/lib/types";
import { DiagramTypeSelector } from "./DiagramTypeSelector";
import { DiagramThemeSelector } from "./DiagramThemeSelector";
import { exportAsPNG, exportAsPDF, exportAsSVG, exportAsJSON } from "@/lib/diagramExport";
import { saveDiagram } from "@/lib/diagramStorage";

interface EnhancedDiagramToolbarProps {
  diagramType: DiagramType;
  diagramTheme: DiagramThemeName;
  smartColoringEnabled: boolean;
  isAnimating: boolean;
  diagram: DiagramResponse | null;
  reactFlowInstance: any;
  onDiagramTypeChange: (type: DiagramType) => void;
  onThemeChange: (theme: DiagramThemeName) => void;
  onSmartColoringToggle: () => void;
  onPlayAnimation: () => void;
  onFitView: () => void;
  onSaveDiagram: () => void;
  onLoadDiagram: () => void;
}

export function EnhancedDiagramToolbar({
  diagramType,
  diagramTheme,
  smartColoringEnabled,
  isAnimating,
  diagram,
  reactFlowInstance,
  onDiagramTypeChange,
  onThemeChange,
  onSmartColoringToggle,
  onPlayAnimation,
  onFitView,
  onSaveDiagram,
  onLoadDiagram,
}: EnhancedDiagramToolbarProps) {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const handleExport = async (format: "png" | "svg" | "pdf" | "json") => {
    if (!diagram) {
      alert("No diagram to export. Please generate a diagram first.");
      return;
    }

    const filename = `diagram-${Date.now()}.${format}`;

    try {
      // Try to get ReactFlow instance dynamically if not provided
      let instance = reactFlowInstance;
      if (!instance) {
        // Try to get it from the DOM or ref
        const reactFlowElement = document.querySelector(".react-flow");
        if (reactFlowElement) {
          // The instance might be available through the element
          instance = null; // We'll work without it
        }
      }

      switch (format) {
        case "png":
          await exportAsPNG(instance, filename);
          break;
        case "svg":
          exportAsSVG(diagram, filename);
          break;
        case "pdf":
          await exportAsPDF(instance, filename);
          break;
        case "json":
          exportAsJSON(diagram, filename);
          break;
      }
    } catch (error) {
      console.error("Export error:", error);
      alert(`Failed to export ${format.toUpperCase()}. Please try again.`);
    }

    setIsDownloadOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-background/80 backdrop-blur-md border border-foreground/10 rounded-xl shadow-lg">
      {/* Diagram Type Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground/70">Type:</span>
        <DiagramTypeSelector value={diagramType} onChange={onDiagramTypeChange} />
      </div>

      {/* Theme Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground/70">Theme:</span>
        <DiagramThemeSelector value={diagramTheme} onChange={onThemeChange} />
      </div>

      {/* Smart Coloring Toggle */}
      <motion.button
        onClick={onSmartColoringToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
          smartColoringEnabled
            ? "bg-purple-600 text-white"
            : "bg-foreground/10 text-foreground"
        } transition-colors`}
      >
        Smart Colors
      </motion.button>

      {/* Play Animation */}
      <motion.button
        onClick={onPlayAnimation}
        disabled={isAnimating}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
      >
        {isAnimating ? "Animating..." : "Play Animation"}
      </motion.button>

      {/* Save Diagram */}
      <motion.button
        onClick={onSaveDiagram}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold"
      >
        Save
      </motion.button>

      {/* Load Diagram */}
      <motion.button
        onClick={onLoadDiagram}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
      >
        Load
      </motion.button>

      {/* Download Dropdown */}
      <div className="relative">
        <motion.button
          onClick={() => setIsDownloadOpen(!isDownloadOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-foreground/10 text-foreground rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          Download
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        <AnimatePresence>
          {isDownloadOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 w-48 bg-background border border-foreground/10 rounded-lg shadow-lg overflow-hidden z-50"
            >
              <button
                onClick={() => handleExport("png")}
                className="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors"
              >
                PNG
              </button>
              <button
                onClick={() => handleExport("svg")}
                className="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors"
              >
                SVG
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors"
              >
                PDF
              </button>
              <button
                onClick={() => handleExport("json")}
                className="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors"
              >
                JSON
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fit View */}
      <motion.button
        onClick={onFitView}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-foreground/10 text-foreground rounded-lg text-sm font-semibold"
      >
        Fit View
      </motion.button>
    </div>
  );
}


"use client";

import { useState, useRef } from "react";
import { DiagramType, DiagramThemeName, DiagramResponse } from "@/lib/types";
import { DiagramCanvas } from "@/components/diagram/DiagramCanvas";
import { TextInputPanel } from "@/components/diagram/TextInputPanel";
import { ImageUploadPanel } from "@/components/diagram/ImageUploadPanel";
import { EnhancedDiagramToolbar } from "@/components/diagram/EnhancedDiagramToolbar";
import { SavedDiagramsPanel } from "@/components/diagram/SavedDiagramsPanel";
import { AIDiagramChat } from "@/components/diagram/AIDiagramChat";
import { applySmartColoring } from "@/lib/smartColoring";
import { saveDiagram } from "@/lib/diagramStorage";
import { motion } from "framer-motion";

export default function DiagramPage() {
  const [diagram, setDiagram] = useState<DiagramResponse | null>(null);
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");
  const [diagramTheme, setDiagramTheme] = useState<DiagramThemeName>("minimal");
  const [smartColoringEnabled, setSmartColoringEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSavedDiagramsOpen, setIsSavedDiagramsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMode, setInputMode] = useState<"text" | "image">("text");
  const canvasRef = useRef<{ getReactFlowInstance: () => any; fitView: () => void }>(null);

  const handleGenerate = async (text: string, type: DiagramType) => {
    try {
      const response = await fetch("/api/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, diagramType: type }),
      });

      if (!response.ok) throw new Error("Failed to generate diagram");

      let generatedDiagram: DiagramResponse = await response.json();

      // Apply smart coloring if enabled
      if (smartColoringEnabled) {
        generatedDiagram = {
          ...generatedDiagram,
          nodes: applySmartColoring(generatedDiagram.nodes, diagramTheme, type),
        };
      }

      setDiagram(generatedDiagram);
    } catch (error) {
      console.error("Error generating diagram:", error);
      alert("Failed to generate diagram. Please try again.");
    }
  };

  const handleSave = () => {
    if (!diagram) {
      alert("No diagram to save");
      return;
    }

    const name = prompt("Enter a name for this diagram:");
    if (name) {
      saveDiagram(name, diagram);
      alert("Diagram saved!");
    }
  };

  const handleLoad = (loadedDiagram: DiagramResponse) => {
    setDiagram(loadedDiagram);
  };

  const handlePlayAnimation = () => {
    setIsAnimating(true);
    // Animate edges
    if (diagram) {
      const animatedDiagram = {
        ...diagram,
        edges: diagram.edges.map((edge) => ({ ...edge, animated: true })),
      };
      setDiagram(animatedDiagram);
      setTimeout(() => setIsAnimating(false), 3000);
    }
  };

  const handleFitView = () => {
    canvasRef.current?.fitView();
  };

  // Get ReactFlow instance dynamically
  const getReactFlowInstance = () => {
    try {
      return canvasRef.current?.getReactFlowInstance();
    } catch (error) {
      console.error("Error getting ReactFlow instance:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="mb-6">
          <EnhancedDiagramToolbar
            diagramType={diagramType}
            diagramTheme={diagramTheme}
            smartColoringEnabled={smartColoringEnabled}
            isAnimating={isAnimating}
            diagram={diagram}
            reactFlowInstance={getReactFlowInstance()}
            onDiagramTypeChange={setDiagramType}
            onThemeChange={setDiagramTheme}
            onSmartColoringToggle={() => setSmartColoringEnabled(!smartColoringEnabled)}
            onPlayAnimation={handlePlayAnimation}
            onFitView={handleFitView}
            onSaveDiagram={handleSave}
            onLoadDiagram={() => setIsSavedDiagramsOpen(true)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panels */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-foreground/10 rounded-lg">
              <button
                onClick={() => setInputMode("text")}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  inputMode === "text"
                    ? "bg-purple-600 text-white"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setInputMode("image")}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  inputMode === "image"
                    ? "bg-purple-600 text-white"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Image
              </button>
            </div>

            {inputMode === "text" ? (
              <TextInputPanel onGenerate={handleGenerate} diagramType={diagramType} />
            ) : (
              <ImageUploadPanel onGenerate={handleGenerate} diagramType={diagramType} />
            )}

            {/* AI Chat Toggle */}
            <motion.button
              onClick={() => setIsChatOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
            >
              Open AI Chat
            </motion.button>
          </div>

          {/* Diagram Canvas */}
          <div className="lg:col-span-2">
            <div className="h-[600px] bg-background border border-foreground/10 rounded-xl overflow-hidden">
              {diagram ? (
                <DiagramCanvas
                  ref={canvasRef}
                  nodes={diagram.nodes}
                  edges={diagram.edges}
                  theme={diagramTheme}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-foreground/40">
                  <p>Generate a diagram to see it here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Diagrams Panel */}
      <SavedDiagramsPanel
        isOpen={isSavedDiagramsOpen}
        onClose={() => setIsSavedDiagramsOpen(false)}
        onLoad={handleLoad}
      />

      {/* AI Chat Panel */}
      <AIDiagramChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        diagram={diagram}
        diagramType={diagramType}
        onDiagramUpdate={(updated) => {
          setDiagram(updated);
          if (smartColoringEnabled) {
            setDiagram({
              ...updated,
              nodes: applySmartColoring(updated.nodes, diagramTheme, diagramType),
            });
          }
        }}
      />
    </div>
  );
}


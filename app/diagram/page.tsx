"use client";

import { useState } from "react";
import { Node, Edge } from "reactflow";
import { DiagramResponse } from "@/lib/types";
import TextInputPanel from "@/components/diagram/TextInputPanel";
import ImageUploadPanel from "@/components/diagram/ImageUploadPanel";
import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import DiagramToolbar from "@/components/diagram/DiagramToolbar";

type InputMode = "text" | "image";

export default function DiagramPage() {
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [error, setError] = useState<string>("");

  // Convert DiagramResponse to ReactFlow format
  const convertToReactFlow = (diagram: DiagramResponse) => {
    const reactFlowNodes: Node[] = diagram.nodes.map((node) => ({
      id: node.id,
      data: { label: node.label },
      position: node.position,
    }));

    const reactFlowEdges: Edge[] = diagram.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
  };

  const handleGenerate = (diagram: DiagramResponse) => {
    setError("");
    convertToReactFlow(diagram);
  };

  const handleError = (message: string) => {
    setError(message);
  };

  const handleReset = () => {
    setNodes([]);
    setEdges([]);
    setError("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Generate Diagram</h1>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left side: Input panels */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setInputMode("text")}
              className={`px-4 py-2 font-medium ${
                inputMode === "text"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Text Input
            </button>
            <button
              onClick={() => setInputMode("image")}
              className={`px-4 py-2 font-medium ${
                inputMode === "image"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Image Upload
            </button>
          </div>

          {/* Panel content */}
          {inputMode === "text" ? (
            <TextInputPanel onGenerate={handleGenerate} onError={handleError} />
          ) : (
            <ImageUploadPanel onGenerate={handleGenerate} onError={handleError} />
          )}
        </div>

        {/* Right side: Diagram canvas */}
        <div>
          <DiagramToolbar onReset={handleReset} />
          {nodes.length > 0 ? (
            <DiagramCanvas initialNodes={nodes} initialEdges={edges} />
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-[600px] flex items-center justify-center text-gray-400">
              <p>Your diagram will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


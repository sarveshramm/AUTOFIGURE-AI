"use client";

import { useState } from "react";
import { DiagramMode, DiagramResponse } from "@/lib/types";

interface TextInputPanelProps {
  onGenerate: (diagram: DiagramResponse) => void;
  onError: (message: string) => void;
}

export default function TextInputPanel({
  onGenerate,
  onError,
}: TextInputPanelProps) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<DiagramMode>("auto");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      onError("Please enter some text first");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate-diagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, mode }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate diagram");
      }

      const diagram: DiagramResponse = await response.json();
      onGenerate(diagram);
    } catch (error) {
      console.error("Error generating diagram:", error);
      onError("Something went wrong while generating the diagram.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter or paste your text:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Example: "OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. Each layer has its own function."'
          className="w-full h-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Diagram Type:
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="auto"
              checked={mode === "auto"}
              onChange={(e) => setMode(e.target.value as DiagramMode)}
              disabled={loading}
              className="mr-2"
            />
            Auto Detect (default)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="flow"
              checked={mode === "flow"}
              onChange={(e) => setMode(e.target.value as DiagramMode)}
              disabled={loading}
              className="mr-2"
            />
            Linear Flow
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="hierarchy"
              checked={mode === "hierarchy"}
              onChange={(e) => setMode(e.target.value as DiagramMode)}
              disabled={loading}
              className="mr-2"
            />
            Hierarchy
          </label>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </>
        ) : (
          "Generate Diagram"
        )}
      </button>
    </div>
  );
}


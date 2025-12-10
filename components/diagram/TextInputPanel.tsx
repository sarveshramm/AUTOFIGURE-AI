"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DiagramType, DiagramResponse } from "@/lib/types";

interface TextInputPanelProps {
  onGenerate: (text: string, diagramType: DiagramType) => Promise<void>;
  diagramType: DiagramType;
}

export function TextInputPanel({ onGenerate, diagramType }: TextInputPanelProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [quickNotes, setQuickNotes] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      await onGenerate(text, diagramType);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickNotes = async () => {
    if (!text.trim()) return;

    setIsGeneratingNotes(true);
    try {
      const response = await fetch("/api/quick-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setQuickNotes(data.notes);
    } catch (error) {
      console.error("Error generating quick notes:", error);
      alert("Failed to generate quick notes. Please try again.");
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-background border border-foreground/10 rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-4">Text to Diagram</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here... For example: 'Start the process, then check if condition is met. If yes, proceed to next step. Otherwise, return to start.'"
          className="w-full h-32 p-4 bg-background border border-foreground/20 rounded-lg focus:outline-none focus:border-primary resize-none"
          disabled={isLoading}
        />
        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={handleQuickNotes}
            disabled={isGeneratingNotes || !text.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingNotes ? "Generating..." : "Get Quick Notes"}
          </motion.button>
          <motion.button
            type="submit"
            disabled={isLoading || !text.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating..." : "Generate Diagram"}
          </motion.button>
        </div>
      </form>

      {quickNotes && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20"
        >
          <p className="text-sm font-semibold mb-2">Quick Notes:</p>
          <pre className="text-sm text-foreground/70 whitespace-pre-wrap">{quickNotes}</pre>
        </motion.div>
      )}
    </motion.div>
  );
}


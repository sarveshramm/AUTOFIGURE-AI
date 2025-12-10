"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiagramType, DiagramResponse } from "@/lib/types";

interface AIDiagramChatProps {
  isOpen: boolean;
  onClose: () => void;
  diagram: DiagramResponse | null;
  diagramType: DiagramType;
  onDiagramUpdate: (diagram: DiagramResponse) => void;
}

export function AIDiagramChat({
  isOpen,
  onClose,
  diagram,
  diagramType,
  onDiagramUpdate,
}: AIDiagramChatProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !diagram) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/diagram-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          diagram,
          diagramType,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);

      if (data.updatedDiagram) {
        onDiagramUpdate(data.updatedDiagram);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 h-full w-96 bg-background border-l border-foreground/10 shadow-xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-foreground/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">AI Diagram Chat</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <p className="text-foreground/60 text-center py-8">
                  Ask me anything about your diagram! Try: "Explain this diagram" or "Add a new node"
                </p>
              )}
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-foreground/10 text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-foreground/10 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-foreground/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your diagram..."
                  className="flex-1 px-4 py-2 bg-foreground/10 border border-foreground/20 rounded-lg focus:outline-none focus:border-primary"
                  disabled={isLoading || !diagram}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || !diagram}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


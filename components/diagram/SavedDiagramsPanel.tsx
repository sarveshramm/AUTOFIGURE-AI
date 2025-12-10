"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SavedDiagram, DiagramResponse } from "@/lib/types";
import { loadDiagrams, deleteDiagram } from "@/lib/diagramStorage";

interface SavedDiagramsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (diagram: DiagramResponse) => void;
}

export function SavedDiagramsPanel({ isOpen, onClose, onLoad }: SavedDiagramsPanelProps) {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDiagrams(loadDiagrams());
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this diagram?")) {
      deleteDiagram(id);
      setDiagrams(loadDiagrams());
    }
  };

  const handleLoad = (diagram: DiagramResponse) => {
    onLoad(diagram);
    onClose();
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
            className="fixed right-0 top-0 h-full w-96 bg-background border-l border-foreground/10 shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Saved Diagrams</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {diagrams.length === 0 ? (
                <p className="text-foreground/60 text-center py-8">No saved diagrams</p>
              ) : (
                <div className="space-y-3">
                  {diagrams.map((diagram) => (
                    <motion.div
                      key={diagram.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg"
                    >
                      <h3 className="font-semibold mb-1">{diagram.name}</h3>
                      <p className="text-sm text-foreground/60 mb-3">
                        {new Date(diagram.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleLoad(diagram.diagram)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold"
                        >
                          Load
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(diagram.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


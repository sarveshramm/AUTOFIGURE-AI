"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SavedDiagram, DiagramResponse } from "@/lib/types";
import { loadDiagrams, deleteDiagram } from "@/lib/diagramStorage";
import Link from "next/link";

export default function MyDiagramsPage() {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);

  useEffect(() => {
    setDiagrams(loadDiagrams());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this diagram?")) {
      deleteDiagram(id);
      setDiagrams(loadDiagrams());
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Diagrams
          </h1>
          <p className="text-foreground/70">Manage your saved diagrams</p>
        </motion.div>

        {diagrams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-foreground/60 mb-4">No saved diagrams yet</p>
            <Link href="/diagram">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
              >
                Create Your First Diagram
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagrams.map((diagram, index) => (
              <motion.div
                key={diagram.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-6 bg-background border border-foreground/10 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{diagram.name}</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Created: {new Date(diagram.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-foreground/60 mb-4">
                  Nodes: {diagram.diagram.nodes.length} | Edges: {diagram.diagram.edges.length}
                </p>
                <div className="flex gap-2">
                  <Link href="/diagram" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold"
                    >
                      Load
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={() => handleDelete(diagram.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


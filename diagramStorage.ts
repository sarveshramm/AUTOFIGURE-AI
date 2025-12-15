/**
 * Diagram Storage Utilities
 * Handles saving, loading, and deleting diagrams from localStorage
 */

import { DiagramResponse, SavedDiagram } from "./types";

const STORAGE_KEY = "autofigure_saved_diagrams";

export function saveDiagram(name: string, diagram: DiagramResponse): string {
  const diagrams = loadDiagrams();
  const newDiagram: SavedDiagram = {
    id: Date.now().toString(),
    name,
    createdAt: new Date().toISOString(),
    diagram,
  };
  
  diagrams.push(newDiagram);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
  
  return newDiagram.id;
}

export function loadDiagrams(): SavedDiagram[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading diagrams:", error);
    return [];
  }
}

export function loadDiagram(id: string): SavedDiagram | null {
  const diagrams = loadDiagrams();
  return diagrams.find((d) => d.id === id) || null;
}

export function deleteDiagram(id: string): boolean {
  const diagrams = loadDiagrams();
  const filtered = diagrams.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length < diagrams.length;
}


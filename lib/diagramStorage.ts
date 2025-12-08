/**
 * Utility functions for saving and loading diagrams from localStorage
 */

import { SavedDiagram, DiagramResponse } from "./types";

const STORAGE_KEY = "autofigure-saved-diagrams";

/**
 * Get all saved diagrams from localStorage
 */
export function getSavedDiagrams(): SavedDiagram[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading saved diagrams:", error);
    return [];
  }
}

/**
 * Save a diagram to localStorage
 */
export function saveDiagram(name: string, diagram: DiagramResponse): string {
  const diagrams = getSavedDiagrams();
  const newDiagram: SavedDiagram = {
    id: `diagram-${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    diagram,
  };
  
  diagrams.push(newDiagram);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
  return newDiagram.id;
}

/**
 * Delete a diagram by ID
 */
export function deleteDiagram(id: string): void {
  const diagrams = getSavedDiagrams();
  const filtered = diagrams.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Get a diagram by ID
 */
export function getDiagramById(id: string): SavedDiagram | null {
  const diagrams = getSavedDiagrams();
  return diagrams.find((d) => d.id === id) || null;
}


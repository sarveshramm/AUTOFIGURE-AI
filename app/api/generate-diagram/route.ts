/**
 * API endpoint: POST /api/generate-diagram
 * Converts text into a diagram structure based on selected mode
 */
import { NextRequest, NextResponse } from "next/server";
import { GenerateDiagramRequest, DiagramMode } from "@/lib/types";
import {
  buildLinearFlowFromText,
  buildHierarchyFromText,
  autoDetectDiagram,
} from "@/lib/diagramBuilder";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDiagramRequest = await request.json();
    const { text, mode } = body;

    // Validate input
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required and cannot be empty" },
        { status: 400 }
      );
    }

    let diagram;

    // Build diagram based on mode
    switch (mode) {
      case "flow":
        diagram = buildLinearFlowFromText(text);
        break;
      case "hierarchy":
        diagram = buildHierarchyFromText(text);
        break;
      case "auto":
      default:
        diagram = autoDetectDiagram(text);
        break;
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error("Error generating diagram:", error);
    return NextResponse.json(
      { error: "Failed to generate diagram" },
      { status: 500 }
    );
  }
}


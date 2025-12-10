import { NextRequest, NextResponse } from "next/server";
import { buildDiagram, autoDetectDiagramType } from "@/lib/diagramBuilders";
import { GenerateDiagramRequest, DiagramType } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDiagramRequest = await request.json();
    const { text, diagramType } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    // Use provided diagramType or auto-detect
    const type: DiagramType = diagramType || autoDetectDiagramType(text);
    
    // Build the diagram
    const diagram = buildDiagram(text, type);

    return NextResponse.json(diagram);
  } catch (error) {
    console.error("Error generating diagram:", error);
    return NextResponse.json(
      { error: "Failed to generate diagram" },
      { status: 500 }
    );
  }
}


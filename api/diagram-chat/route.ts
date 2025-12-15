import { NextRequest, NextResponse } from "next/server";
import { DiagramChatRequest, DiagramChatResponse, DiagramNode } from "@/lib/types";
import { extractMinimalLabel } from "@/lib/textUtils";

async function searchWeb(query: string): Promise<string | null> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "AUTOFIGURE-AI/1.0",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const abstract: string | undefined = data.Abstract;
    const related: Array<{ Text?: string }> | undefined = data.RelatedTopics;

    if (abstract && abstract.trim().length > 0) {
      return abstract.trim();
    }

    if (related && related.length > 0) {
      const first = related.find((r) => typeof r?.Text === "string");
      if (first?.Text) return first.Text;
    }
  } catch (error) {
    console.error("Web search failed:", error);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body: DiagramChatRequest = await request.json();
    const { message, diagram, diagramType } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lowerMessage = message.toLowerCase();
    let reply = "";
    let updatedDiagram: typeof diagram | undefined = undefined;

    // If there's no diagram, try to answer from web search
    if (!diagram) {
      const webAnswer = await searchWeb(message);
      reply =
        webAnswer ||
        "I couldn't find an online answer right now. Please check your connection or provide a diagram so I can assist with it.";

      const response: DiagramChatResponse = { reply };
      return NextResponse.json(response);
    }

    // Mock AI responses
    if (lowerMessage.includes("explain") || lowerMessage.includes("what")) {
      reply = `This ${diagramType} diagram contains ${diagram.nodes.length} nodes and ${diagram.edges.length} connections. `;
      reply += `The main components are: ${diagram.nodes.slice(0, 3).map(n => n.label).join(", ")}.`;
    } else if (lowerMessage.includes("add") || lowerMessage.includes("create")) {
      // Extract what to add
      const addMatch = message.match(/add\s+(.+)/i);
      const newLabel = addMatch ? extractMinimalLabel(addMatch[1], 4) : "New Node";
      
      const newNode: DiagramNode = {
        id: `node-${Date.now()}`,
        label: newLabel,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        type: "process",
        shape: "rectangle",
        width: 150,
        height: 80,
      };

      updatedDiagram = {
        ...diagram,
        nodes: [...diagram.nodes, newNode],
      };

      reply = `Added new node: ${newLabel}`;
    } else if (lowerMessage.includes("simplify") || lowerMessage.includes("shorter")) {
      // Simplify labels
      updatedDiagram = {
        ...diagram,
        nodes: diagram.nodes.map(node => ({
          ...node,
          label: extractMinimalLabel(node.label, 3),
        })),
      };

      reply = "Simplified all node labels.";
    } else if (lowerMessage.includes("color") || lowerMessage.includes("theme")) {
      reply = "You can change the theme using the theme selector in the toolbar.";
    } else {
      reply = `I understand you're asking about: "${message}". `;
      reply += `This is a ${diagramType} diagram with ${diagram.nodes.length} nodes. `;
      reply += `You can ask me to explain the diagram, add nodes, or simplify labels.`;
    }

    const response: DiagramChatResponse = {
      reply,
      updatedDiagram,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in diagram chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}


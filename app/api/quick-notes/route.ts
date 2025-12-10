import { NextRequest, NextResponse } from "next/server";
import { generateQuickNotes } from "@/lib/quickNotes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text input is required" },
        { status: 400 }
      );
    }

    const notes = generateQuickNotes(text);

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error generating quick notes:", error);
    return NextResponse.json(
      { error: "Failed to generate quick notes" },
      { status: 500 }
    );
  }
}


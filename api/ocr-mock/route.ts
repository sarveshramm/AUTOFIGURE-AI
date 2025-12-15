import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Mock OCR - returns sample text
    const mockText = `This is a sample flowchart process.
    First, we start with initialization.
    Then we check if the condition is met.
    If yes, we proceed to the next step.
    Otherwise, we return to the beginning.
    Finally, we complete the process.`;

    return NextResponse.json({ text: mockText });
  } catch (error) {
    console.error("Error in OCR mock:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}


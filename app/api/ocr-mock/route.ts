/**
 * API endpoint: POST /api/ocr-mock
 * Mock OCR endpoint that returns hardcoded text for MVP
 * Later, this can be replaced with real OCR service (e.g., Tesseract, Google Vision API)
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // For MVP: Ignore the actual file and return mock text
    // In production, you would process the image with OCR here
    const mockExtractedText =
      "OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. Each layer has its own function.";

    return NextResponse.json({
      extractedText: mockExtractedText,
    });
  } catch (error) {
    console.error("Error in OCR mock:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}


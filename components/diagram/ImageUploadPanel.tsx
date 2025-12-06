"use client";

import { useState } from "react";
import { DiagramResponse } from "@/lib/types";

interface ImageUploadPanelProps {
  onGenerate: (diagram: DiagramResponse) => void;
  onError: (message: string) => void;
}

export default function ImageUploadPanel({
  onGenerate,
  onError,
}: ImageUploadPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        onError("Please upload an image file (JPG, PNG)");
        return;
      }
      setFile(selectedFile);
      setExtractedText(""); // Clear previous extracted text
    }
  };

  const handleExtractAndGenerate = async () => {
    if (!file) {
      onError("Please select an image file first");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Extract text from image (mock OCR)
      const formData = new FormData();
      formData.append("image", file);

      const ocrResponse = await fetch("/api/ocr-mock", {
        method: "POST",
        body: formData,
      });

      if (!ocrResponse.ok) {
        throw new Error("Failed to extract text from image");
      }

      const ocrData = await ocrResponse.json();
      const text = ocrData.extractedText;
      setExtractedText(text);

      // Step 2: Generate diagram from extracted text
      const diagramResponse = await fetch("/api/generate-diagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, mode: "auto" }),
      });

      if (!diagramResponse.ok) {
        throw new Error("Failed to generate diagram");
      }

      const diagram: DiagramResponse = await diagramResponse.json();
      onGenerate(diagram);
    } catch (error) {
      console.error("Error processing image:", error);
      onError("Something went wrong while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image (JPG, PNG):
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileChange}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name}
          </p>
        )}
      </div>

      {extractedText && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extracted Text:
          </label>
          <textarea
            value={extractedText}
            readOnly
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
          />
        </div>
      )}

      <button
        onClick={handleExtractAndGenerate}
        disabled={loading || !file}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          "Extract & Generate Diagram"
        )}
      </button>
    </div>
  );
}


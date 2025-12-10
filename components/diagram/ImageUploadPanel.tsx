"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { DiagramType } from "@/lib/types";

interface ImageUploadPanelProps {
  onGenerate: (text: string, diagramType: DiagramType) => Promise<void>;
  diagramType: DiagramType;
}

export function ImageUploadPanel({ onGenerate, diagramType }: ImageUploadPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Mock OCR - in real app, this would call actual OCR API
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/ocr-mock", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setExtractedText(data.text);
      await onGenerate(data.text, diagramType);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-background border border-foreground/10 rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-4">Image to Diagram</h3>
      
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Upload Image"}
        </motion.button>

        {extractedText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 bg-primary/10 rounded-lg border border-primary/20"
          >
            <p className="text-sm font-semibold mb-2">Extracted Text:</p>
            <p className="text-sm text-foreground/70">{extractedText}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}


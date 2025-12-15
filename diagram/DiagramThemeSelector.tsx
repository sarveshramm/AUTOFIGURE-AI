"use client";

import { DiagramThemeName } from "@/lib/types";
import { motion } from "framer-motion";

const themes: { value: DiagramThemeName; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "neon", label: "Neon" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "pastel", label: "Pastel" },
  { value: "blueprint", label: "Blueprint" },
  { value: "techwire", label: "Techwire" },
  { value: "professional_office", label: "Professional Office" },
];

interface DiagramThemeSelectorProps {
  value: DiagramThemeName;
  onChange: (theme: DiagramThemeName) => void;
}

export function DiagramThemeSelector({ value, onChange }: DiagramThemeSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DiagramThemeName)}
        className="appearance-none bg-background border border-foreground/20 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:border-primary cursor-pointer"
      >
        {themes.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}


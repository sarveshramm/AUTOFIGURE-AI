"use client";

import { DiagramType } from "@/lib/types";
import { motion } from "framer-motion";

const diagramTypes: { value: DiagramType; label: string }[] = [
  { value: "flowchart", label: "Flowchart" },
  { value: "sequence", label: "Sequence Diagram" },
  { value: "class", label: "Class Diagram" },
  { value: "state", label: "State Diagram" },
  { value: "er", label: "ER Diagram" },
  { value: "user_journey", label: "User Journey" },
  { value: "pie_chart", label: "Pie Chart" },
  { value: "quadrant", label: "Quadrant Chart" },
  { value: "timeline", label: "Timeline" },
  { value: "sankey", label: "Sankey Diagram" },
  { value: "xy_chart", label: "XY Chart" },
  { value: "block", label: "Block Diagram" },
];

interface DiagramTypeSelectorProps {
  value: DiagramType;
  onChange: (type: DiagramType) => void;
}

export function DiagramTypeSelector({ value, onChange }: DiagramTypeSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DiagramType)}
        className="appearance-none bg-background border border-foreground/20 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:border-primary cursor-pointer"
      >
        {diagramTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
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


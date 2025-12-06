"use client";

interface DiagramToolbarProps {
  onReset: () => void;
}

export default function DiagramToolbar({ onReset }: DiagramToolbarProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-900">Diagram Preview</h2>
      <div className="space-x-2">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
        >
          Reset Diagram
        </button>
      </div>
    </div>
  );
}


"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "12 Diagram Types",
    description: "Flowcharts, Sequence, Class, State, ER, User Journey, Pie Charts, Quadrants, Timelines, Sankey, XY Charts, and Block Diagrams",
    icon: "📊",
  },
  {
    title: "Smart AI Detection",
    description: "Automatically detects the best diagram type from your text input",
    icon: "🤖",
  },
  {
    title: "7 Beautiful Themes",
    description: "Choose from Minimal, Neon, Cyberpunk, Pastel, Blueprint, Techwire, and Professional themes",
    icon: "🎨",
  },
  {
    title: "Export Anywhere",
    description: "Download your diagrams as PNG, SVG, PDF, or JSON",
    icon: "💾",
  },
  {
    title: "Smart Coloring",
    description: "Automatic color assignment based on node types and hierarchy",
    icon: "🌈",
  },
  {
    title: "Interactive Chat",
    description: "Chat with AI to modify and enhance your diagrams",
    icon: "💬",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Powerful Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 bg-background border border-foreground/10 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


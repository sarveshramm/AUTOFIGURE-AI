"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Enter Text or Upload Image",
    description: "Type your text or upload an image containing text",
  },
  {
    number: "2",
    title: "AI Processes Your Input",
    description: "Our AI analyzes and converts your input into a structured diagram",
  },
  {
    number: "3",
    title: "Customize & Export",
    description: "Customize colors, themes, and export in your preferred format",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              >
                {step.number}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-foreground/60">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


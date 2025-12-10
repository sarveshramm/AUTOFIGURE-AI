"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    features: [
      "5 diagrams per month",
      "Basic diagram types",
      "PNG export",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "month",
    features: [
      "Unlimited diagrams",
      "All 12 diagram types",
      "All export formats (PNG, SVG, PDF, JSON)",
      "AI Diagram Chat",
      "Smart Coloring",
      "7 Beautiful Themes",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom themes",
      "API access",
      "White-label options",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-foreground/70">
            Select the perfect plan for your diagram needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-8 rounded-xl border-2 ${
                plan.popular
                  ? "border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-xl"
                  : "border-foreground/10 bg-background shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-foreground/60 ml-2">/{plan.period}</span>}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-foreground/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/diagram">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-foreground/10 hover:bg-foreground/20"
                  } transition-colors`}
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["5 diagrams/month", "Basic diagram types", "PNG export"],
  },
  {
    name: "Pro",
    price: "$9.99",
    features: ["Unlimited diagrams", "All diagram types", "All export formats", "AI Chat", "Priority support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Everything in Pro", "Team collaboration", "Custom themes", "API access", "Dedicated support"],
  },
];

export function SubscriptionsPreview() {
  return (
    <section className="py-20 bg-background/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Choose Your Plan
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-8 rounded-xl border-2 ${
                plan.popular
                  ? "border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                  : "border-foreground/10 bg-background"
              } shadow-lg`}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg">/month</span></div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-foreground/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/subscriptions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-foreground/10 hover:bg-foreground/20"
                  } transition-colors`}
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


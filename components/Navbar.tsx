"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              AUTOFIGURE-AI
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/#features"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/subscriptions"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Subscriptions
            </Link>
            <ThemeToggle />
            
            {/* Account Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Account</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              <AnimatePresence>
                {isAccountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-background border border-foreground/10 rounded-lg shadow-lg overflow-hidden"
                  >
                    <Link
                      href="/account/diagrams"
                      className="block px-4 py-2 hover:bg-primary/10 transition-colors"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      My Diagrams
                    </Link>
                    <Link
                      href="/account/profile"
                      className="block px-4 py-2 hover:bg-primary/10 transition-colors"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/account/settings"
                      className="block px-4 py-2 hover:bg-primary/10 transition-colors"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-foreground/10">
                      <div className="px-4 py-2 text-sm text-foreground/60">
                        Developed by Sarveshram A
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-foreground/10 bg-background/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/#features"
                className="block text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/subscriptions"
                className="block text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Subscriptions
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-foreground/70">Theme</span>
                <ThemeToggle />
              </div>
              <Link
                href="/account/diagrams"
                className="block text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Diagrams
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


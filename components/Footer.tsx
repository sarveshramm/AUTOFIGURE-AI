"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-foreground/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              AUTOFIGURE-AI
            </h3>
            <p className="text-foreground/60 text-sm">
              Transform text and images into beautiful diagrams with AI-powered intelligence.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/diagram" className="hover:text-foreground transition-colors">
                  Create Diagram
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="hover:text-foreground transition-colors">
                  Subscriptions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <p className="text-sm text-foreground/60">
              Developed by <span className="font-semibold">Sarveshram A</span>
            </p>
            <p className="text-xs text-foreground/40 mt-2">
              © 2024 AUTOFIGURE-AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


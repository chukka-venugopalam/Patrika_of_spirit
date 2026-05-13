"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Github, Twitter, Linkedin, Heart } from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { label: "Explore", href: "/explore" },
    { label: "Categories", href: "/categories" },
    { label: "Impact", href: "/impact" },
    { label: "Network", href: "/network" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Twitter, href: "https://twitter.com/awarenet", label: "Twitter" },
  { icon: Github, href: "https://github.com/awarenet", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/awarenet", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-void-950/90 backdrop-blur-xl">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center glow-cyan">
                <Zap className="w-4 h-4 text-void-950" fill="currentColor" />
              </div>
              <span className="font-display font-bold text-xl gradient-text-cyan">AwareNet</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              An interactive awareness ecosystem. Spread consciousness through chain-reaction sharing
              and community participation.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-display font-semibold text-sm text-white/80 tracking-wide uppercase">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-neon-cyan transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm font-mono">
            © {new Date().getFullYear()} AwareNet. All rights reserved.
          </p>
          <p className="text-white/30 text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for global awareness
          </p>
        </div>
      </div>
    </footer>
  );
}

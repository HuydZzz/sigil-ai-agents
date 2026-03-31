// src/app/layout.tsx
// ═══════════════════════════════════════════════════════════
// Root layout with InterwovenKit Provider
// This wraps the entire app with Initia wallet connectivity
// ═══════════════════════════════════════════════════════════

"use client";

import { InterwovenKitProvider } from "@initia/interwovenkit-react";
import { ReactNode } from "react";
import "./globals.css";

// Configure the InterwovenKit provider for SIGIL appchain
const interwovenKitConfig = {
  // Your SIGIL appchain ID — replace with actual chain ID after deployment
  defaultChainId: process.env.NEXT_PUBLIC_CHAIN_ID || "sigil-testnet-1",

  // Wallet connection options
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "",
  },

  // Enable social login (Google, Twitter) for web2-like onboarding
  socialLogin: true,

  // Auto-signing configuration
  autoSign: {
    // Default session duration: 24 hours
    defaultDuration: 86400,
    // Allow users to choose: 1h, 24h, 7d
    durationOptions: [3600, 86400, 604800],
  },

  // Theming to match SIGIL's dark aesthetic
  theme: {
    mode: "dark",
    primaryColor: "#7BDDBB",
    borderRadius: "12px",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>SIGIL — AI Agent Hub on Initia</title>
        <meta
          name="description"
          content="Deploy, rent, and compose autonomous AI agents on Initia. Every transaction is revenue you keep."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <InterwovenKitProvider {...interwovenKitConfig}>
          {children}
        </InterwovenKitProvider>
      </body>
    </html>
  );
}

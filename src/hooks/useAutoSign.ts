// src/hooks/useAutoSign.ts
// ═══════════════════════════════════════════════════════════
// Auto-Signing Session Hook
// Wraps Initia's auto-sign API for agent execution
//
// WHY THIS MATTERS FOR SIGIL:
// AI agents need to execute transactions continuously without
// user approval on each one. Initia's auto-signing sessions
// solve this perfectly — the user approves once, and the agent
// can execute within the session scope.
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useCallback, useEffect } from "react";
import { useInterwovenKit } from "@initia/interwovenkit-react";

export interface AutoSignSession {
  isActive: boolean;
  isLoading: boolean;
  expiresAt: Date | null;
  remainingTime: string;
  enable: (durationSeconds?: number) => Promise<void>;
  disable: () => Promise<void>;
  isExpired: boolean;
}

// Duration presets for the UI
export const SESSION_DURATIONS = [
  { label: "1 hour", value: 3600, description: "Quick trading session" },
  { label: "24 hours", value: 86400, description: "Full day of agent activity" },
  { label: "7 days", value: 604800, description: "Set it and forget it" },
];

export function useAutoSignSession(): AutoSignSession {
  const { autoSign } = useInterwovenKit();
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState("—");

  // Enable auto-signing session
  const enable = useCallback(
    async (durationSeconds: number = 86400) => {
      try {
        // This opens the Initia drawer where user confirms permissions
        await autoSign.enable();

        // Track expiration locally
        const expiry = new Date(Date.now() + durationSeconds * 1000);
        setExpiresAt(expiry);

        console.log(
          `[SIGIL] Auto-sign session enabled until ${expiry.toISOString()}`
        );
      } catch (error) {
        console.error("[SIGIL] Failed to enable auto-sign:", error);
        throw error;
      }
    },
    [autoSign]
  );

  // Disable auto-signing session
  const disable = useCallback(async () => {
    try {
      await autoSign.disable();
      setExpiresAt(null);
      console.log("[SIGIL] Auto-sign session disabled");
    } catch (error) {
      console.error("[SIGIL] Failed to disable auto-sign:", error);
      throw error;
    }
  }, [autoSign]);

  // Update remaining time display
  useEffect(() => {
    if (!expiresAt) {
      setRemainingTime("—");
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = expiresAt.getTime() - now;

      if (remaining <= 0) {
        setRemainingTime("Expired");
        setExpiresAt(null);
        return;
      }

      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setRemainingTime(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setRemainingTime(`${hours}h ${minutes}m`);
      } else {
        setRemainingTime(`${minutes}m`);
      }
    }, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [expiresAt]);

  return {
    isActive: !!expiresAt && expiresAt.getTime() > Date.now(),
    isLoading: autoSign.isLoading,
    expiresAt,
    remainingTime,
    enable,
    disable,
    isExpired: !!expiresAt && expiresAt.getTime() <= Date.now(),
  };
}

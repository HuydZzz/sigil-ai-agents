// src/hooks/useAgents.ts
// ═══════════════════════════════════════════════════════════
// Agent Subscription & Execution Hook
// Manages agent lifecycle: subscribe → execute → monitor
//
// FLOW:
// 1. User browses marketplace, picks an agent
// 2. User subscribes (requires auto-sign session)
// 3. Agent begins executing on-chain based on its strategy
// 4. User monitors performance on dashboard
// 5. Every txn = gas fee revenue for SIGIL appchain
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useCallback } from "react";
import { useInterwovenKit } from "@initia/interwovenkit-react";

// Agent types correspond to the 4 logos
export type AgentType = "architect" | "oracle" | "sentinel";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  creator: string; // .init username
  description: string;
  fee: number; // percentage of AUM
  subscribers: number;
  totalTxns: number;
  performance: {
    apy: number | null;
    pnl30d: number;
    winRate: number;
    maxDrawdown: number;
  };
  status: "live" | "beta" | "paused";
}

export interface AgentSubscription {
  agentId: string;
  subscribedAt: Date;
  allocatedAmount: string;
  isActive: boolean;
}

export interface UseAgentsReturn {
  agents: Agent[];
  mySubscriptions: AgentSubscription[];
  isLoading: boolean;
  subscribe: (agentId: string, amount: string) => Promise<void>;
  unsubscribe: (agentId: string) => Promise<void>;
  getAgentPerformance: (agentId: string) => Agent["performance"] | null;
}

export function useAgents(): UseAgentsReturn {
  const { address, autoSign } = useInterwovenKit();
  const [mySubscriptions, setMySubscriptions] = useState<AgentSubscription[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to an agent
  // This creates an on-chain subscription record and allocates funds
  const subscribe = useCallback(
    async (agentId: string, amount: string) => {
      if (!address) throw new Error("Wallet not connected");

      // Check if auto-sign is enabled — required for agent execution
      // Without auto-sign, agents cannot execute transactions
      if (!autoSign) {
        throw new Error(
          "Auto-sign session required. Enable it so agents can execute transactions."
        );
      }

      setIsLoading(true);

      try {
        // In production, this calls the SubscriptionManager smart contract:
        //
        // const msg = new MsgExecuteContract(
        //   address,
        //   SUBSCRIPTION_CONTRACT_ADDRESS,
        //   {
        //     subscribe: {
        //       agent_id: agentId,
        //       amount: amount,
        //     }
        //   },
        //   [{ denom: "uinit", amount: parseUnits(amount, 6) }]
        // );
        //
        // const tx = await client.signAndBroadcast(address, [msg], "auto");

        console.log(
          `[SIGIL] Subscribing to agent ${agentId} with ${amount} INIT`
        );

        const newSub: AgentSubscription = {
          agentId,
          subscribedAt: new Date(),
          allocatedAmount: amount,
          isActive: true,
        };

        setMySubscriptions((prev) => [...prev, newSub]);
        console.log(`[SIGIL] Subscription active. Agent will begin executing.`);
      } catch (err) {
        console.error("[SIGIL] Subscription failed:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [address, autoSign]
  );

  // Unsubscribe from an agent
  const unsubscribe = useCallback(
    async (agentId: string) => {
      if (!address) throw new Error("Wallet not connected");

      setIsLoading(true);

      try {
        // In production: call SubscriptionManager.unsubscribe(agent_id)
        // This stops the agent and returns remaining allocated funds

        setMySubscriptions((prev) =>
          prev.map((s) =>
            s.agentId === agentId ? { ...s, isActive: false } : s
          )
        );

        console.log(
          `[SIGIL] Unsubscribed from agent ${agentId}. Funds returned.`
        );
      } catch (err) {
        console.error("[SIGIL] Unsubscribe failed:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [address]
  );

  // Get performance data for an agent
  const getAgentPerformance = useCallback(
    (agentId: string): Agent["performance"] | null => {
      // In production: query on-chain performance data from AgentRegistry
      // This includes historical PnL, transaction count, and win rate
      return null;
    },
    []
  );

  // Mock agents for demo — in production these come from AgentRegistry contract
  const agents: Agent[] = [
    {
      id: "agent-001",
      name: "Yield Weaver",
      type: "architect",
      creator: "satoshi.init",
      description:
        "Auto-compounds yield across Initia DeFi pools. Rebalances every 4h based on APY shifts.",
      fee: 0.5,
      subscribers: 847,
      totalTxns: 12300,
      performance: {
        apy: 18.4,
        pnl30d: 8.1,
        winRate: 0.72,
        maxDrawdown: -4.2,
      },
      status: "live",
    },
    {
      id: "agent-002",
      name: "Trend Prophet",
      type: "oracle",
      creator: "alice.init",
      description:
        "Analyzes on-chain + social sentiment to predict price movements with 72% accuracy.",
      fee: 1.0,
      subscribers: 1203,
      totalTxns: 8700,
      performance: {
        apy: null,
        pnl30d: 5.6,
        winRate: 0.72,
        maxDrawdown: -2.1,
      },
      status: "live",
    },
    {
      id: "agent-003",
      name: "Shield Protocol",
      type: "sentinel",
      creator: "vitalik.init",
      description:
        "Monitors your portfolio 24/7. Auto-hedges on whale movements and liquidation risks.",
      fee: 0.8,
      subscribers: 634,
      totalTxns: 5100,
      performance: {
        apy: null,
        pnl30d: 2.9,
        winRate: 0.89,
        maxDrawdown: -0.8,
      },
      status: "live",
    },
  ];

  return {
    agents,
    mySubscriptions,
    isLoading,
    subscribe,
    unsubscribe,
    getAgentPerformance,
  };
}

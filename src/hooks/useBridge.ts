// src/hooks/useBridge.ts
// ═══════════════════════════════════════════════════════════
// Interwoven Bridge Hook
// Enables cross-chain deposits from any ecosystem into SIGIL
//
// WHY THIS MATTERS FOR SIGIL:
// Users shouldn't need to leave the app or manually bridge
// assets before they can use AI agents. This hook integrates
// Initia's native bridge so users deposit in one click.
// ═══════════════════════════════════════════════════════════

"use client";

import { useState, useCallback } from "react";
import { useInterwovenKit } from "@initia/interwovenkit-react";

export interface BridgeState {
  isLoading: boolean;
  error: string | null;
  lastTxHash: string | null;
  deposit: (params: DepositParams) => Promise<string>;
  supportedChains: ChainInfo[];
  supportedAssets: AssetInfo[];
}

interface DepositParams {
  fromChainId: string;
  asset: string;
  amount: string;
}

interface ChainInfo {
  id: string;
  name: string;
  icon: string;
  type: "evm" | "cosmos" | "initia";
}

interface AssetInfo {
  symbol: string;
  name: string;
  decimals: number;
  minDeposit: string;
}

// Supported source chains for bridging into SIGIL
const SUPPORTED_CHAINS: ChainInfo[] = [
  { id: "ethereum-1", name: "Ethereum Mainnet", icon: "🔷", type: "evm" },
  { id: "cosmoshub-4", name: "Cosmos Hub", icon: "⚛️", type: "cosmos" },
  { id: "arbitrum-1", name: "Arbitrum", icon: "🔵", type: "evm" },
  { id: "interwoven-1", name: "Initia L1", icon: "🌐", type: "initia" },
  { id: "osmosis-1", name: "Osmosis", icon: "🧪", type: "cosmos" },
];

// Supported assets for deposit
const SUPPORTED_ASSETS: AssetInfo[] = [
  { symbol: "USDC", name: "USD Coin", decimals: 6, minDeposit: "1" },
  { symbol: "INIT", name: "Initia", decimals: 6, minDeposit: "0.1" },
  { symbol: "ETH", name: "Ethereum", decimals: 18, minDeposit: "0.001" },
  { symbol: "ATOM", name: "Cosmos Hub", decimals: 6, minDeposit: "0.01" },
];

export function useBridge(): BridgeState {
  const { address } = useInterwovenKit();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const deposit = useCallback(
    async (params: DepositParams): Promise<string> => {
      if (!address) throw new Error("Wallet not connected");

      setIsLoading(true);
      setError(null);

      try {
        // In production, this calls the Initia Bridge API via Skip Go
        // Route: Source chain → IBC/LayerZero → Initia L1 → SIGIL rollup
        //
        // The Interwoven Bridge handles routing automatically:
        // - EVM chains: LayerZero bridge → Initia L1 → IBC to SIGIL
        // - Cosmos chains: IBC direct → Initia L1 → IBC to SIGIL
        // - Initia L1: Direct IBC transfer to SIGIL rollup
        // - Other Initia rollups: L1 relay via OPinit bridge

        console.log(
          `[SIGIL Bridge] Depositing ${params.amount} ${params.asset} from ${params.fromChainId}`
        );

        // Simulated bridge transaction for demo
        // Replace with actual bridge.initia.xyz integration
        const txHash = `0x${Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")}`;

        // In production:
        // const route = await skipGoClient.route({
        //   sourceAsset: params.asset,
        //   sourceChainId: params.fromChainId,
        //   destChainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        //   destAddress: address,
        //   amount: params.amount,
        // });
        // const txHash = await skipGoClient.executeRoute(route);

        setLastTxHash(txHash);
        console.log(`[SIGIL Bridge] Deposit TX: ${txHash}`);
        return txHash;
      } catch (err: any) {
        const message = err.message || "Bridge deposit failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [address]
  );

  return {
    isLoading,
    error,
    lastTxHash,
    deposit,
    supportedChains: SUPPORTED_CHAINS,
    supportedAssets: SUPPORTED_ASSETS,
  };
}

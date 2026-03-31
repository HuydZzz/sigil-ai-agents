# SIGIL — AI Agent Hub on Initia

> Deploy, rent, and compose autonomous AI agents on your own Initia appchain. Every transaction is revenue you keep.

![Track: AI](https://img.shields.io/badge/Track-AI-7BDDBB?style=flat-square)
![Built on Initia](https://img.shields.io/badge/Built%20on-Initia-E8DCC8?style=flat-square)
![Status: Live on Testnet](https://img.shields.io/badge/Status-Testnet-F0C866?style=flat-square)

---

## What is SIGIL?

SIGIL is a **marketplace for AI agents** that execute on-chain actions autonomously on a dedicated Initia appchain. Users can browse, subscribe to, and compose AI agents that trade, predict, and protect their portfolios — 24/7, without manual intervention.

**The core insight:** AI agents need fast block times, session-based auto-signing, and cross-chain deposits to work properly. Initia provides all three natively, making it the ideal home for an agent economy.

### The Four Pillars

| Pillar | Logo | Role |
|--------|------|------|
| **NEXUS** | ◎ Star/Diamond | Platform hub — the marketplace that connects everything |
| **ARCHITECT** | ⬡ Hexagon | DeFi strategy agents — yield farming, rebalancing, momentum trading |
| **ORACLE** | 🐚 Shell/Spiral | Prediction agents — sentiment analysis, trend forecasting, price signals |
| **SENTINEL** | ⊕ Crosshair | Monitoring agents — portfolio protection, liquidation guards, stop-losses |

---

## Demo Video

🎬 **[Watch the full demo →](./demo-video.mp4)**

The demo walks through:
1. Connecting wallet via InterwovenKit
2. Enabling an auto-signing session
3. Bridging USDC from Ethereum via Interwoven Bridge
4. Subscribing to "Yield Weaver" (ARCHITECT agent)
5. Watching the agent execute trades autonomously
6. Viewing agent performance on the dashboard

---

## Initia-Native Features Used

### 1. Auto-Signing / Session UX ✅
**Why it matters:** AI agents are useless if every transaction requires manual wallet approval. Auto-signing sessions let agents execute continuously.

**Implementation:**
```javascript
import { useInterwovenKit } from '@initia/interwovenkit-react';

const { autoSign } = useInterwovenKit();
await autoSign.enable(); // User approves once, agent runs 24/7
```

- User enables session on first agent subscription
- Session persists for configurable duration (1h / 24h / 7d)
- All agent transactions auto-execute within session scope
- Session can be revoked at any time

### 2. Interwoven Bridge ✅
**Why it matters:** Users shouldn't need to manually bridge assets to use AI agents. SIGIL integrates the bridge directly into the deposit flow.

- Supports deposits from Ethereum, Cosmos Hub, Arbitrum, and other Initia rollups
- USDC and INIT as primary deposit tokens
- One-click deposit flow: select chain → select asset → enter amount → bridge

### 3. Initia Usernames (.init) ✅
**Why it matters:** Agent creators need reputation. `.init` usernames create social identity and attribution.

- Agent creators display as `alice.init`, `satoshi.init`
- Leaderboard shows top creators by AUM and subscriber count
- Username-linked profiles show all published agents and performance history

---

## Revenue Model

SIGIL captures revenue through three streams, all enabled by owning the appchain:

| Revenue Stream | Mechanism | Captured By |
|----------------|-----------|-------------|
| **Gas fees** | Every agent transaction pays gas | Appchain operator (us) |
| **Subscriptions** | 0.5–2% AUM/month for premium agents | Platform + agent creator split |
| **Creation fees** | 50 INIT to publish a new agent | Platform treasury |

**Key insight from Initia:** "Every transaction your users make? That's revenue you keep, not value you leak." We capture 100% of gas fees from agent activity because we own the appchain.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  SIGIL Frontend                  │
│        React + InterwovenKit + Next.js           │
├─────────────────────────────────────────────────┤
│               Agent Orchestrator                 │
│    Task queue → AI reasoning → Tx execution      │
├─────────────────────────────────────────────────┤
│              Smart Contracts (Move)              │
│  AgentRegistry │ Subscriptions │ RevenueVault    │
├─────────────────────────────────────────────────┤
│             SIGIL Initia Appchain                │
│  100ms blocks │ Auto-sign │ Bridge │ .init names  │
├─────────────────────────────────────────────────┤
│              Initia L1 (Settlement)              │
│         Security │ Liquidity │ IBC │ VIP          │
└─────────────────────────────────────────────────┘
```

### Tech Stack
- **Frontend:** React 18, Next.js 14, TailwindCSS
- **Wallet:** @initia/interwovenkit-react
- **Smart Contracts:** Move (Initia MoveVM)
- **Agent Runtime:** Node.js + LLM API (Claude/GPT) for reasoning
- **Data:** On-chain indexer via InitiaScan API
- **Deployment:** Initia appchain via OPinit Stack

---

## Smart Contracts

### AgentRegistry.move
Stores agent metadata, creator address, fee structure, and subscriber list.

### SubscriptionManager.move  
Handles agent subscriptions, AUM tracking, and fee distribution between platform and creator.

### RevenueVault.move
Accumulates gas fee revenue and distributes to platform treasury and stakers.

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- Initia CLI (`initiad`)
- Git

### Setup
```bash
# Clone the repo
git clone https://github.com/your-team/sigil-ai-agents
cd sigil-ai-agents

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Initia testnet RPC, chain ID, and API keys

# Start the frontend
npm run dev

# In a separate terminal, start the agent orchestrator
npm run agents
```

### Deploy Appchain (Testnet)
```bash
# Initialize the rollup
initiad rollup init --name sigil-chain --vm move

# Configure chain parameters
initiad rollup config set --block-time 100ms --gas-token INIT

# Deploy to testnet
initiad rollup deploy --network testnet
```

---

## Deployment Evidence

- **Rollup Chain ID:** `sigil-testnet-1`
- **Deployment TX:** [View on InitiaScan →](https://scan.testnet.initia.xyz/tx/...)
- **Frontend:** [https://sigil.initia.app](https://sigil.initia.app)

---

## Market Analysis

### Why Now?
- **DeFAI is the #1 narrative in 2026 crypto** — AI agents managing on-chain assets
- Virtuals Protocol: 18,000+ agents, $75M+ revenue (on Base)
- No equivalent marketplace exists on Initia ecosystem
- Initia's auto-signing + fast blocks are *purpose-built* for agent execution

### Target Users
1. **DeFi users** who want yield optimization without active management
2. **Traders** who want 24/7 automated strategies
3. **AI developers** who want to monetize their models as on-chain agents

### Competitive Advantage
- **Own the chain:** 100% gas fee capture vs 0% on shared L1s
- **Initia-native UX:** Auto-sign sessions make agent execution seamless
- **Cross-chain reach:** Interwoven Bridge brings users from any ecosystem
- **Revenue alignment:** Every active agent = more transactions = more revenue

---

## Team

| Name | Role | Background |
|------|------|------------|
| [Your Name] | Full-stack dev & product | [Your background] |

---

## Scoring Criteria Alignment

| Criteria | Weight | Our Strength |
|----------|--------|-------------|
| Originality & Track Fit | 20% | First AI agent marketplace on Initia; DeFAI is hottest narrative |
| Technical Execution | 30% | All 3 Initia features integrated naturally; appchain deployed |
| Product Value & UX | 20% | Web2-level UX with social login, auto-sign, beautiful dashboard |
| Working Demo | 20% | End-to-end flow: connect → bridge → subscribe → agent executes |
| Market Understanding | 10% | Clear TAM ($52B by 2030), competitive analysis, revenue model |

---

## License

MIT

---

*Built with passion for INITIATE: The Initia Hackathon (Season 1)*

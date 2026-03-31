#!/bin/bash
# ═══════════════════════════════════════════════════════════
# SIGIL — Project Setup Script
# Run this to scaffold the entire project
# ═══════════════════════════════════════════════════════════

echo "🔮 Setting up SIGIL — AI Agent Hub on Initia"
echo "============================================="

# 1. Create Next.js project
npx create-next-app@latest sigil-ai-agents \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbo

cd sigil-ai-agents

# 2. Install Initia dependencies
echo "📦 Installing Initia packages..."
npm install @initia/interwovenkit-react @initia/initia.js

# 3. Install additional dependencies
echo "📦 Installing additional dependencies..."
npm install framer-motion lucide-react zustand

# 4. Create folder structure
echo "📁 Creating project structure..."
mkdir -p src/components/{agents,layout,bridge,shared}
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/store
mkdir -p src/contracts
mkdir -p src/agents/{architect,oracle,sentinel}
mkdir -p .initia
mkdir -p public/logos

# 5. Create environment file
cat > .env.example << 'EOF'
# Initia Configuration
NEXT_PUBLIC_CHAIN_ID=sigil-testnet-1
NEXT_PUBLIC_INITIA_RPC=https://rpc.testnet.initia.xyz
NEXT_PUBLIC_INITIA_LCD=https://lcd.testnet.initia.xyz

# Agent Configuration
ANTHROPIC_API_KEY=your_api_key_here
OPENAI_API_KEY=your_api_key_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

cp .env.example .env.local

echo ""
echo "✅ SIGIL project scaffolded successfully!"
echo ""
echo "Next steps:"
echo "  1. cd sigil-ai-agents"
echo "  2. Copy the component files from the hackathon kit"
echo "  3. npm run dev"
echo "  4. Deploy appchain: initiad rollup deploy --network testnet"
echo ""
echo "File structure:"
echo "  src/"
echo "  ├── app/"
echo "  │   ├── layout.tsx          # Root layout with InterwovenKit provider"
echo "  │   ├── page.tsx            # Homepage (marketplace)"
echo "  │   ├── agent/[id]/page.tsx # Agent detail page"
echo "  │   └── create/page.tsx     # Create new agent page"
echo "  ├── components/"
echo "  │   ├── agents/             # AgentCard, AgentGrid, AgentDetail"
echo "  │   ├── layout/             # Navbar, Footer, Hero"
echo "  │   ├── bridge/             # BridgeModal, DepositWidget"
echo "  │   └── shared/             # Logos, Sparkline, Toast"
echo "  ├── hooks/"
echo "  │   ├── useAutoSign.ts      # Auto-signing session hook"
echo "  │   ├── useBridge.ts        # Interwoven Bridge hook"
echo "  │   └── useAgents.ts        # Agent subscription hook"
echo "  ├── lib/"
echo "  │   └── initia.ts           # Initia client configuration"
echo "  ├── store/"
echo "  │   └── useStore.ts         # Zustand global state"
echo "  ├── contracts/              # Move smart contract source"
echo "  │   ├── AgentRegistry.move"
echo "  │   ├── SubscriptionManager.move"
echo "  │   └── RevenueVault.move"
echo "  └── agents/                 # Agent runtime logic"
echo "      ├── architect/          # DeFi strategy agents"
echo "      ├── oracle/             # Prediction agents"
echo "      └── sentinel/           # Monitoring agents"
echo ""

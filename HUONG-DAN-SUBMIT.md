# HƯỚNG DẪN SUBMIT SIGIL LÊN DORAHACKS — TỪNG BƯỚC

> Deadline: 15 tháng 4, 2026 — 22:00 UTC (tức 5:00 sáng ngày 16/4 giờ VN)
> Còn khoảng 15 ngày. Đừng để đến phút cuối!

---

## GIAI ĐOẠN 1: CHUẨN BỊ MÁY (Ngày 1)

### Bước 1.1 — Cài đặt phần mềm cần thiết

```bash
# 1. Cài Docker Desktop (BẮT BUỘC — chạy bridge bots)
# Tải từ: https://www.docker.com/products/docker-desktop/
# Sau khi cài xong, MỞ Docker Desktop lên

# 2. Cài Go 1.22+ (BẮT BUỘC — build appchain binary)
# Tải từ: https://go.dev/doc/install

# 3. Cài Node.js 18+ (cho frontend)
# Tải từ: https://nodejs.org/

# 4. Cài Git
# Tải từ: https://git-scm.com/
```

### Bước 1.2 — Tạo thư mục project

```bash
mkdir sigil-ai-agents
cd sigil-ai-agents
```

### Bước 1.3 — Cài Initia AI Skill (giúp AI agent setup chain)

```bash
npx skills add initia-labs/agent-skills
```

---

## GIAI ĐOẠN 2: DEPLOY APPCHAIN (Ngày 1-2)

### Bước 2.1 — Cài Initia tools

Mở Claude Code hoặc Cursor, paste prompt này:

```
Using the `initia-appchain-dev` skill, please set up my environment for the Move track.
```

Sau đó verify:

```
Using the `initia-appchain-dev` skill, please verify that `initiad`, `weave`, and `minitiad` are properly installed and accessible in my PATH.
```

### Bước 2.2 — Khởi tạo Appchain với `weave init`

```bash
weave init
```

**Trả lời từng câu hỏi như sau:**

| Câu hỏi | Trả lời |
|----------|---------|
| Gas Station account? | `Generate new account (recommended)` |
| (Copy address, vào https://app.testnet.initia.xyz/faucet paste để lấy token) | |
| Type continue | `continue` |
| What do you want to do? | `Launch a new rollup` |
| Select L1 network | `Testnet (initiation-2)` |
| Select VM | `Move` |
| Rollup chain ID | **`sigil-1`** ← GHI NHỚ CÁI NÀY |
| Rollup gas denom | Nhấn `Tab` (dùng default `umin`) |
| Node moniker | Nhấn `Tab` (default `operator`) |
| Submission Interval | Nhấn `Tab` (default `1m`) |
| Finalization Period | Nhấn `Tab` (default `168h`) |
| Data Availability | `Initia L1` |
| Enable oracle price feed | `Enable` |
| System keys | `Generate new system keys` |
| System accounts funding | `Use the default preset` |
| Fee whitelist addresses | Nhấn `Enter` (bỏ trống) |
| Add Gas Station to genesis? | `Yes` |
| Genesis balance | `10000000000000000000` (10^19 cho Move) |
| Add more genesis accounts? | `No` |
| Type continue | `continue` |
| Confirm transactions? | `y` |

**→ Appchain bắt đầu chạy và tạo blocks!**

### Bước 2.3 — Setup bridge bots

```bash
# OPinit Executor
weave opinit init executor
# Trả lời: Yes use detected keys → Generate new → Yes prefill → Tab cho defaults

weave opinit start executor -d

# IBC Relayer
weave relayer init
# Trả lời: Local Rollup (sigil-1) → Tab Tab → minimal setup → Select all → Yes challenger

weave relayer start -d
```

### Bước 2.4 — Import keys

```bash
MNEMONIC=$(jq -r '.common.gas_station.mnemonic' ~/.weave/config.json)

# Import vào L1
initiad keys add gas-station --recover --keyring-backend test \
  --coin-type 60 --key-type eth_secp256k1 \
  --source <(echo -n "$MNEMONIC")

# Import vào L2 
minitiad keys add gas-station --recover --keyring-backend test \
  --coin-type 60 --key-type eth_secp256k1 \
  --source <(echo -n "$MNEMONIC")

# Verify
initiad keys list --keyring-backend test
minitiad keys list --keyring-backend test
```

### Bước 2.5 — Verify appchain healthy

Paste prompt vào AI agent:

```
Using the `initia-appchain-dev` skill, please verify that my appchain, executor bot, and relayer are running and that my Gas Station account has a balance.
```

**→ Ghi lại: Chain ID = `sigil-1`, deployed address sẽ có sau khi deploy contract**

---

## GIAI ĐOẠN 3: BUILD APP (Ngày 2-10)

### Bước 3.1 — Copy code SIGIL vào project

Copy tất cả files mà tôi đã tạo cho bạn vào thư mục project:
- `src/` — frontend code
- `contracts/` — Move smart contracts
- `src/hooks/` — Initia integration hooks
- `src/agents/` — AI agent runtime

### Bước 3.2 — Deploy smart contract

Paste prompt vào AI agent:

```
Using the `initia-appchain-dev` skill, deploy the Move module at contracts/sources/agent_registry.move to my local appchain. Use the gas-station key.
```

**→ Ghi lại deployed address (module address) — cần cho submission.json**

### Bước 3.3 — Chạy frontend

```bash
npm install
npm run dev
```

Mở http://localhost:3000 — kiểm tra marketplace hoạt động.

### Bước 3.4 — Test end-to-end flow

Kiểm tra 4 flow quan trọng:
1. Connect wallet (InterwovenKit)
2. Enable auto-sign session
3. Bridge modal mở và submit
4. Subscribe to agent → agent "executes"

---

## GIAI ĐOẠN 4: QUAY DEMO VIDEO (Ngày 11-12)

### Bước 4.1 — Chuẩn bị quay

- Dùng **Loom** (miễn phí, dễ nhất) hoặc **OBS** 
- Video dài **1-3 phút** (Initia yêu cầu cụ thể)
- Quay screen + giọng nói (tiếng Anh)

### Bước 4.2 — Script quay video

```
[0:00-0:15] Intro
"Hi, this is SIGIL — an AI agent marketplace built on Initia.
Users can deploy, rent, and compose autonomous AI agents 
that trade, predict, and protect their portfolios."

[0:15-0:30] Connect Wallet
- Click "Connect wallet" → show InterwovenKit drawer
- Wallet connected, show .init username

[0:30-0:50] Enable Auto-Sign
- Click "Auto-sign" button → show session drawer
- "Auto-signing lets agents execute transactions 
  without per-txn approval — this is critical for 24/7 agents"

[0:50-1:15] Bridge
- Click "Bridge" → select Ethereum → USDC → 100
- Click "Bridge to SIGIL chain"
- "Interwoven Bridge brings users from any chain 
  without manual bridging"

[1:15-2:00] Browse & Subscribe Agent
- Scroll through agent marketplace
- Click "Yield Weaver" (ARCHITECT agent)
- Show sparkline, APY, users
- Click "Activate agent"
- Show toast: "Agent active, executing transactions"

[2:00-2:30] Revenue Model
- Scroll to revenue section
- "Every agent transaction generates gas fees 
  that we capture because we own the appchain.
  Plus subscription fees and creation fees."

[2:30-2:50] Architecture + Closing
- "SIGIL is deployed as its own Initia appchain 
  with 100ms block times. Smart contracts in Move,
  frontend with InterwovenKit, AI reasoning via LLM API."
- "Thanks for watching!"
```

### Bước 4.3 — Upload video

Upload lên **YouTube** (unlisted OK) hoặc **Loom**.
Copy link → paste vào `submission.json`.

---

## GIAI ĐOẠN 5: CHUẨN BỊ SUBMISSION FILES (Ngày 12-13)

### Bước 5.1 — Cập nhật .initia/submission.json

Mở file `.initia/submission.json` và điền ĐÚNG format:

```json
{
  "project_name": "SIGIL — AI Agent Hub",
  "repo_url": "https://github.com/YOUR_GITHUB/sigil-ai-agents",
  "commit_sha": "abc123...",
  "rollup_chain_id": "sigil-1",
  "deployed_address": "0xYOUR_MODULE_ADDRESS",
  "vm": "move",
  "native_feature": "auto-signing",
  "core_logic_path": "contracts/sources/agent_registry.move",
  "native_feature_frontend_path": "src/hooks/useAutoSign.ts",
  "demo_video_url": "https://youtu.be/YOUR_VIDEO_ID"
}
```

**Cách lấy commit_sha:**
```bash
git log --oneline -1
# Copy chuỗi 40 ký tự hex (dùng git log không có --oneline)
git rev-parse HEAD
```

### Bước 5.2 — Cập nhật README.md

Đảm bảo README.md có section này ở đầu (Initia yêu cầu):

```markdown
## Initia Hackathon Submission

- **Project Name**: SIGIL — AI Agent Hub

### Project Overview

SIGIL is a marketplace for AI agents that execute on-chain actions 
autonomously on a dedicated Initia appchain. Users browse, subscribe to, 
and compose AI agents that trade, predict, and protect their portfolios.
Every agent transaction generates gas revenue captured by the appchain.

### Implementation Detail

- **The Custom Implementation**: AI agent marketplace with three agent 
  types (Architect, Oracle, Sentinel), each with unique strategy logic. 
  Agent runtime connects LLM reasoning to on-chain execution via Move 
  smart contracts (AgentRegistry, SubscriptionManager).
  
- **The Native Feature**: Auto-signing sessions enable agents to execute 
  transactions 24/7 without per-txn wallet approval. Users enable once, 
  agents run continuously. Without auto-sign, AI agents would be useless.

### How to Run Locally

1. Clone repo and run `npm install`
2. Start appchain: `weave init` then `weave rollup start -d`
3. Deploy contracts: Use AI agent with initia-appchain-dev skill
4. Start frontend: `npm run dev` → open http://localhost:3000
```

### Bước 5.3 — Push code lên GitHub

```bash
# Tạo repo mới trên github.com (public)
# Tên: sigil-ai-agents

git init
git add .
git commit -m "SIGIL — AI Agent Hub | INITIATE Hackathon Submission"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB/sigil-ai-agents.git
git push -u origin main

# Lấy commit SHA
git rev-parse HEAD
# → Paste vào submission.json field "commit_sha"
```

---

## GIAI ĐOẠN 6: SUBMIT TRÊN DORAHACKS (Ngày 13-14)

### Bước 6.1 — Tạo tài khoản DoraHacks

1. Vào **https://dorahacks.io**
2. Click **"Log in"** (góc phải trên)
3. Đăng nhập bằng **GitHub** (khuyến khích) hoặc Email/Wallet
4. Nếu hỏi mobile verification → có thể **Skip**

### Bước 6.2 — Vào trang hackathon

1. Vào **https://dorahacks.io/hackathon/initiate**
2. Click **"Register as Hacker"** (nếu chưa register)

### Bước 6.3 — Submit BUIDL

1. Click nút **"Submit BUIDL"** (màu xanh, nổi bật)
2. Chọn **"Create a new BUIDL"**
3. Điền form theo hướng dẫn dưới đây:

### Bước 6.4 — Điền form BUIDL

| Field | Điền gì |
|-------|---------|
| **Project Name** | `SIGIL — AI Agent Hub` |
| **Project Logo** | Upload logo Star/Diamond (logo NEXUS) |
| **Short Description** | `AI agent marketplace on Initia. Deploy, rent, and compose autonomous agents that trade, predict & protect. Every txn = revenue you keep.` |
| **Long Description** | Copy phần đầu README.md |
| **Track** | Chọn **AI** |
| **GitHub Link** | `https://github.com/YOUR_GITHUB/sigil-ai-agents` ← BẮT BUỘC |
| **Demo Video** | Paste YouTube/Loom link ← BẮT BUỘC |
| **Team Members** | Thêm tên + role |
| **Technologies** | `React, Move, InterwovenKit, Initia, AI/LLM` |

### Bước 6.5 — Review & Submit

1. Kiểm tra tất cả field đã điền đầy đủ
2. Click **"Submit for review"**
3. Bạn sẽ thấy notification xác nhận submission thành công
4. **Bạn vẫn có thể EDIT** sau khi submit cho đến deadline

### Bước 6.6 — Sau khi submit

- Vào **Discord Initia** (https://discord.gg/initia) giới thiệu project
- Check lại BUIDL page để đảm bảo hiển thị đúng
- Có thể tiếp tục edit/cải thiện code và video cho đến 15/4

---

## CHECKLIST CUỐI CÙNG

Trước khi submit, kiểm tra TẤT CẢ items này:

### Repo GitHub
- [ ] Repo public trên GitHub
- [ ] File `.initia/submission.json` đúng format (10 fields)
- [ ] File `README.md` có section "Initia Hackathon Submission"
- [ ] `commit_sha` trong submission.json khớp với commit cuối
- [ ] `core_logic_path` trỏ đúng file (file tồn tại trong repo)
- [ ] `native_feature_frontend_path` trỏ đúng file

### Appchain
- [ ] Appchain deployed trên testnet (có chain ID)
- [ ] Smart contract deployed (có deployed address)
- [ ] `rollup_chain_id` trong submission.json đúng

### Frontend
- [ ] Dùng InterwovenKit (@initia/interwovenkit-react)
- [ ] Có ít nhất 1 Initia-native feature (auto-signing)
- [ ] App chạy end-to-end (connect → interact → result)

### Demo Video
- [ ] Video 1-3 phút
- [ ] Upload YouTube (unlisted OK) hoặc Loom
- [ ] Link video public (judges xem được)
- [ ] Demo đủ flow: connect → auto-sign → bridge → use agent

### DoraHacks
- [ ] Đã register hackathon
- [ ] Đã submit BUIDL
- [ ] GitHub link và Demo Video link đã điền
- [ ] Chọn đúng track: AI

---

## TIMELINE GỢI Ý (15 ngày còn lại)

| Ngày | Việc cần làm |
|------|-------------|
| 1-2 | Cài tools + Deploy appchain trên testnet |
| 3-5 | Copy code SIGIL, customize, deploy smart contract |
| 6-8 | Build frontend, test InterwovenKit integration |
| 9-10 | Test end-to-end, fix bugs |
| 11-12 | Quay demo video, upload YouTube |
| 13 | Cập nhật submission.json + README, push GitHub |
| 14 | Submit trên DoraHacks |
| 15 | Buffer — sửa lỗi cuối, polish, double-check |

---

## LINKS QUAN TRỌNG

- DoraHacks hackathon: https://dorahacks.io/hackathon/initiate
- Initia Hackathon docs: https://docs.initia.xyz/hackathon/get-started
- Submission requirements: https://docs.initia.xyz/hackathon/submission-requirements
- Builder guide: https://docs.initia.xyz/hackathon/builder-guide
- AI track guidance: https://docs.initia.xyz/hackathon/ai-track-guidance
- Testnet faucet: https://app.testnet.initia.xyz/faucet
- InterwovenKit docs: https://docs.initia.xyz/interwovenkit/introduction
- Initia Discord: https://discord.gg/initia

---

*Chúc bạn thắng giải nhất! 🏆*

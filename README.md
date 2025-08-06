# 🚀 Soroscan – Composable DeFi Intelligence

> **Real-time analytics for liquidity providers on Soroswap, powered by DeFindex insights and smart Telegram alerts — all in one dashboard.**

<p align="center">
  <img src="https://img.freepik.com/free-photo/abstract-futuristic-digital-circuit-board-ai-technology-background_53876-128859.jpg?w=1380" alt="Soroscan Hero" width="100%" style="border-radius: 12px;" />
</p>

---

## 🔍 What Is Soroscan?

**Soroscan** is a **composable DeFi dashboard** that empowers liquidity providers on **Soroswap** with **real-time analytics**, **risk intelligence**, and **smart alerts** — all powered by **DeFindex-style insights**.

No more guessing. No more missed harvests.  
Just **smarter LP decisions**, in one click.

---

## 🎯 Project Goal

To **enhance composability** between:
- 💹 **Soroswap** (AMM DEX)
- 📊 **DeFindex** (DeFi analytics)

By building a **user-centric dashboard** that helps LPs:
- Track their positions
- Analyze risk vs. reward
- Optimize yields
- Get **smart alerts** when action is needed

### ✅ Why It Matters
- LPs lose money due to **impermanent loss**, **low fees**, or **missed harvests**
- No tool currently **combines Soroswap + DeFindex** data
- **Soroscan fills the gap** — it’s **composable, actionable, and intelligent**

---

## 🏆 Hackathon Fit: "Build on Soroswap and DeFindex"

> **Theme: Composability**  
> We don’t just integrate — we **orchestrate**.

| Track | How We Deliver |
|------|----------------|
| **Analytics & UX** | Real-time dashboards, APR, TVL, volume, and risk scores |
| **Smart Alerts** | Telegram bot notifies users when fees are claimable |
| **Improved UX** | One-click rebalance, mobile-responsive, clean design |
| **Composability (Core)** | Combines **Soroswap API + DeFindex logic + Telegram** |

### 🏁 Why We Win
- ✅ **No smart contracts** — pure frontend + API integration
- ✅ **Real data** from Soroswap staging API
- ✅ **Actionable insights**, not just display
- ✅ **User-first design** with automation
- ✅ **Telegram alerts** for real-time engagement

---

## 🧠 Strategy: Observe → Analyze → Act

We follow a **three-phase intelligence engine** to turn data into action.

| Phase | What Happens |
|------|-------------|
| **1. Observe** | Fetch LP data from **Soroswap API** |
| **2. Analyze** | Enrich with **DeFindex-style risk scoring** (volatility, IL, APY) |
| **3. Act** | Suggest or trigger **rebalancing** or **harvesting** |

---

## 🔁 One-Click Rebalancing (Yes, It’s Possible!)

Even **without deploying a contract**, we enable **one-click LP migration** using **Soroswap’s existing contracts**.

### ✅ How It Works
1. You’re in `ETH-USDC` (High Risk, Low APY)
2. Soroscan analyzes:  
   → “Move to `USDC-USDT`: +12% safer, 8.4% APY”
3. You click **“Rebalance”**
4. Frontend:
   - Calls Soroswap Router to **remove liquidity**
   - Swaps tokens if needed
   - Adds liquidity to target pool
5. All via **signed transactions in Freighter**

🔐 **No contract needed** — uses **existing Soroswap contracts** via API + XDR signing

---

## 📲 Smart Telegram Alerts

Get **real-time notifications** when it’s time to act.

### ✅ How It Works
1. Connect wallet → app tracks your positions
2. A **cron job** (or frontend poll) checks:
   - Are fees > $10?
   - Has risk increased?
3. If yes → send alert via **Telegram Bot API**

📱 Example Alert:
```
🔔 Soroscan Alert

Fees in ETH-USDC: $42
Harvest now & rebalance for safer yield!

Powered by Soroswap + DeFindex
```

### 🛠 Tools Used
- 🤖 **Telegram Bot** (`@BotFather`)
- 🌐 `fetch()` to `https://api.telegram.org/bot<TOKEN>/sendMessage`
- ⏱ Runs every 5 minutes (backendless or serverless)

---

## 🖼️ Demo

| Connect Wallet | Dashboard |
|---------------|-----------|
| ![Connect](https://via.placeholder.com/400x200?text=Connect+Wallet+to+Soroscan) | ![Dashboard](https://via.placeholder.com/400x200?text=Real-time+LP+Dashboard) |

| Risk Analysis | Telegram Alert |
|--------------|----------------|
| ![Risk](https://via.placeholder.com/400x200?text=DeFindex+Risk+Scoring) | ![Alert](https://via.placeholder.com/400x200?text=Telegram+Smart+Alert) |

> 🔗 **Live Demo**: [https://soroscan.vercel.app](https://soroscan.vercel.app)

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| **Frontend** | Next.js 14 (App Router), React, Tailwind CSS |
| **Wallet** | Freighter (Stellar), `@stellar/freighter-api` |
| **APIs** | Soroswap Staging API, DeFindex-style risk engine |
| **Alerts** | Telegram Bot API |
| **Hosting** | Vercel |
| **Data** | Real-time pools, risk scoring, rebalance logic |

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/holyaustin/soroscan.git
cd soroscan

# 2. Install dependencies
npm install

# 3. Create .env.local
cp .env.example .env.local
# Add your API keys (see below)

# 4. Run dev server
npm run dev
```

### 🔐 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SOROSWAP_API_URL=https://soroswap-api-staging-436722401508.us-central1.run.app
NEXT_PUBLIC_SOROSWAP_API_KEY=sk_your_api_key_here

NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
NEXT_PUBLIC_TELEGRAM_CHAT_ID=123456789   
```

> 💡 Get Telegram token from [@BotFather](https://t.me/BotFather)  
> 💡 Use your real `CHAT_ID` (from `getUpdates` API)

---

## 📄 License

MIT License — feel free to use, fork, and build on this.

---


## 🙌 Let’s Win This

Soroscan isn’t just a dashboard —  
it’s **DeFi intelligence in action**.

👉 **Connect. Optimize. Earn.**  
👉 **Submit. Demo. Win.**

---

## 📬 Feedback? Ideas?

Open an issue or ping me on X: [@yourhandle](https://x.com/holyaustin)

---

> 🔗 **GitHub**: [github.com/your-username/soroscan](https://github.com/holyaustin/soroscan)  
> 🌐 **Deployed on Vercel** — lightning fast, always up

---

✨ **Soroscan** — Where **data meets action**.  
🚀 **Built for the future of composable DeFi.**

---




t.me/soroscan_bot. 
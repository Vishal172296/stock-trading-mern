# Zerodha Kite MERN Clone with Groq AI Intelligence

A full-stack Zerodha Kite trading platform clone built with the **MERN Stack** (MongoDB, Express, React, Node.js) and supercharged with **Groq AI (Llama 3.3 70B)** for real-time stock insights, technical pivots, and an AI Trading Copilot.

---

## 🚀 What's New & Upgraded

### 1. 🤖 Groq AI Intelligence (`llama-3.3-70b-versatile`)
- **Stock Sentiment & Technical Analysis Modal**: Instant AI analysis on any stock in your watchlist or portfolio.
  - Sentiment Score (Bullish / Bearish / Neutral)
  - Key Technical Pivots (Support, Resistance, Recommended Stop-Loss)
  - Catalysts & Growth Drivers
  - Trade Recommendation (BUY / ACCUMULATE / HOLD / SELL)
- **Kite AI Copilot Widget**: Interactive trading assistant for instant market concepts, risk management, and trading strategy Q&A.

### 2. ⚡ Real Trading Engine (Buy & Sell)
- **Full Buy & Sell Execution**: Selling now verifies holdings and deducts shares, crediting virtual funds back to the user wallet.
- **Dynamic Holdings & Average Calculation**: Buying more shares automatically re-calculates the weighted average price.
- **Order Execution Book**: Live records of every BUY and SELL order with timestamps and values.

### 3. 💼 Dynamic Paper Trading Funds & Margin
- **₹1,00,000 Virtual Margin**: Each user gets a demo paper trading balance upon signup.
- **Interactive Funds Deposit**: Add virtual funds (+₹25k, +₹50k, +₹100k) to test larger trades without real capital risk.
- **Live Margin Tracking**: Used margin and available margin update on every order.

### 4. 📈 Interactive Charts & Live Market Simulation
- **Multi-Timeframe Chart Modal (1D, 1W, 1M, 1Y)**: High/Low stats, area gradients, and tick data.
- **Live WatchList Ticker**: Simulated price fluctuations with visual up/down ticks.
- **Instant Search Filter**: Find any stock in the watchlist in real time.

### 5. 🛡️ Dynamic Multi-Environment Configuration
- Replaced all hardcoded remote URLs with `.env` configurations (`REACT_APP_API_URL`).
- JWT-based authentication with user-specific holdings and portfolio isolation.

---

## 🛠️ Tech Stack
- **Frontend & Dashboard**: React.js, Chart.js, React-Chartjs-2, Material UI (MUI), Axios
- **Backend**: Node.js, Express.js, Mongoose (MongoDB), JWT, Bcrypt.js
- **AI Engine**: Groq SDK (`llama-3.3-70b-versatile`)

---

## ⚙️ Quick Start Guide

### 1. Backend Setup
```bash
cd backend
npm install
```
Edit `backend/.env`:
```env
PORT=3002
MONGO_URL=mongodb://127.0.0.1:27017/stock-trading
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=gsk_your_groq_api_key_here
```
> **Note**: Get your free Groq API key from [https://console.groq.com/keys](https://console.groq.com/keys).

Run the backend:
```bash
npm run dev
# or: node index.js
```

### 2. Dashboard Setup (Kite Trading Terminal)
```bash
cd ../dashboard
npm install
npm start
```
Runs at `http://localhost:3000` (or `http://localhost:3001`).

### 3. Frontend Setup (Landing Page)
```bash
cd ../frontend
npm install
npm start
```
Runs at `http://localhost:3000`.

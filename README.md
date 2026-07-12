# Vortex AI — AI Investment Research Terminal

Vortex AI is a full-stack, professional-grade investment research platform. It acts as an automated financial analyst: users can enter any company name, and the application instantly pulls 100% real live market data and news from official APIs, analyzes it via the Gemini API, and outputs a structured investment report with a clear **Buy, Hold, or Sell** verdict.

---

## 📋 Table of Contents
1. [Overview](#-overview)
2. [How to Run It](#-how-to-run-it)
3. [How It Works (Approach & Architecture)](#-how-it-works-approach--architecture)
4. [Key Decisions & Technical Trade-offs](#-key-decisions--technical-trade-offs)
5. [Example Runs](#-example-runs)
6. [LLM Chat Transcripts](#-llm-chat-transcripts)
7. [Future Improvements](#-future-improvements)

---

## 🔍 Overview

Vortex AI solves a common problem in financial research: the manual overhead of gathering metrics, news headlines, and competitor values across multiple financial platforms.

Unlike typical AI agents that query generic search engines and hallucinate financial metrics, Vortex AI separates **factual data retrieval** from **qualitative analysis**:
1. It queries official, live financial APIs (Yahoo Finance and Finnhub) to retrieve stock prices, historical financial statements, consensus targets, competitor benchmarks, and news headlines.
2. It passes this validated data to the Gemini API (`gemini-1.5-pro`) to perform SWOT analysis, risk grading, and write a structured, objective investment thesis.
3. If any field is missing from the APIs, the system displays `"Not Available"` (or `"N/A"`) instead of generating fake facts.

---

## 💻 How to Run It

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)
- A **Gemini API Key** (configured as `GEMINI_API_KEY` in `.env`)
- Optional: **Finnhub API Key** (`FINNHUB_API_KEY`), **NewsAPI Key** (`NEWS_API_KEY`) for premium data fallbacks.

### Project Structure
```
├── backend/            # Express.js REST API & Financial Data Services
├── frontend/           # React 19 / TanStack Start UI (Vite)
├── LLM_CHAT_TRANSCRIPT.md # Complete parsed transcripts of build dialogue
└── README.md
```

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables:
   - Create a `.env` file in the `backend/` directory:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/investment-agent
     GEMINI_API_KEY=your_gemini_api_key_here
     
     # Optional Premium Keys (otherwise falls back to public Yahoo Finance modules)
     FINNHUB_API_KEY=your_finnhub_key_here
     NEWS_API_KEY=your_newsapi_key_here
     
     # Optional SMTP Configurations (for newsletter subscriber notifications)
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_google_app_password
     ```
4. Start the backend:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3000` (or `http://localhost:5173`).

---

## ⚙️ How It Works (Approach & Architecture)

### System Architecture Flow

```mermaid
graph TD
    User([User Browser]) -->|Request /api/analyze| Express[Express Server]
    Express -->|Check 5-Min Cache| MongoDB[(MongoDB Cache)]
    Express -->|On Cache Miss| DataPipeline[financialDataService.js]
    DataPipeline -->|Fetch Stock Price & Charts| YahooFinance[Yahoo Finance API]
    DataPipeline -->|Fetch Peer Tickers & Sentiment| Finnhub[Finnhub API]
    DataPipeline -->|Consolidate Real Data| Express
    Express -->|Pass Factual Data Context| Gemini[Gemini API gemini-1.5-pro]
    Gemini -->|Generate SWOT, Risks & Thesis JSON| Express
    Express -->|Save to DB Cache (5m TTL)| MongoDB
    Express -->|Return Report Payload| User
```

### Core Architecture Components:
- **`financialDataService.js`:** Resolves target tickers and queries live APIs (`yahoo-finance2` modules: `price`, `summaryProfile`, `financialData`, `defaultKeyStatistics`, `summaryDetail`, `recommendationTrend`, `earnings`) to assemble a 100% factual profile.
- **`langchainService.js`:** Wraps the official Google Generative AI SDK, enforcing JSON schema mode. Gemini parses the live data and computes the SWOT points, risk scoring vector, sentiment, and the markdown investment thesis.
- **5-Minute TTL Cache:** Express stores completed analyses in MongoDB with a `300` seconds TTL. If the database is disconnected, it transparently falls back to an in-memory cache with matching 5-minute expirations.

---

## ⚖️ Key Decisions & Technical Trade-offs

### 1. No Hallucinations / Strict API Primacy
* **Decision:** We completely replaced web search parsing (Tavily/Google searches) with official, structured Yahoo Finance & Finnhub APIs for data fields. Gemini is restricted to evaluating this structured context.
* **Trade-off:** If a field is missing from Yahoo Finance or Finnhub, we display `"Not Available"` rather than forcing Gemini to guess. This preserves institutional accuracy.

### 2. Google Generative AI SDK & JSON Mode
* **Decision:** We migrated from `@langchain/groq` to `@google/generative-ai` with structured JSON output configurations.
* **Trade-off:** This removes the overhead of complex LangChain model chain wrappers, resulting in faster latency and guaranteed JSON formatting that conforms to our Zod schema.

### 3. 5-Minute TTL Cache
* **Decision:** Replaced the previous 7-day database cache with a strict 5-minute TTL.
* **Trade-off:** Ensures financial price quotes and analyst targets are never stale while preventing database load under high-volume parallel requests.

---

## 📊 Example Runs

### Case 1: Apple Inc. (AAPL)
- **Verdict:** BUY (Confidence: 88%, Score: 85)
- **Current Price:** $240.25
- **Analyst Consensus:** Buy (Consensus Price Target: $252.00)
- **Key Analysis:** Apple's services division growth offset minor hardware fluctuation. High liquidity and strong operating margin (30.7%) support a bullish thesis.

### Case 2: Tesla, Inc. (TSLA)
- **Verdict:** HOLD (Confidence: 72%, Score: 62)
- **Current Price:** $195.80
- **Analyst Consensus:** Hold (Consensus Price Target: $190.00)
- **Key Analysis:** Leading EV market share and high cash position, but offset by high P/E ratio (~60x) and margin pressure due to price cuts.

---

## 📄 LLM Chat Transcripts
As part of the project requirement, the complete log of the conversations held with the AI assistant during development is parsed and formatted inside the root repository as [LLM_CHAT_TRANSCRIPT.md](file:///c:/Users/hp/Desktop/AIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII/LLM_CHAT_TRANSCRIPT.md).

---

## 📈 Future Improvements
1. **Real-time SEC Filings Fetcher:** Integrate an RSS engine to scan Edgar filings in real-time.
2. **Advanced Portfolio Simulator:** Allow users to simulate adding the target stock directly into a virtual paper trading account.

# EquityEye – AI Investment Research Agent

EquityEye is a production-quality, full-stack AI Investment Research Agent that researches any publicly traded company and generates a professional investment recommendation ("Invest" or "Pass") with detailed, multi-paragraph qualitative reasoning and financial charts.

The application leverages live APIs to aggregate company summaries, financial statements, market headlines, and real-time search trends. It uses LangChain.js to orchestrate these APIs as modular tools and processes the consolidated context through Google Gemini to produce structured, schema-validated investment analyses.

---

## Architecture Diagram

Below is an overview of the system architecture and the flow of data:

```text
       +---------------------------------------------+
       |                  React UI                   |
       |  (Dashboard, Recharts Area, Print PDF/JSON) |
       +----------------------+----------------------+
                              |
                     POST /api/analyze
                     GET /api/history
                              |
                              v
       +----------------------+----------------------+
       |                Express.js                   |
       |  (Port 5000, Request Logger, Error Handler) |
       +----------------------+----------------------+
                              |
                      Orchestrates Tools
                              |
                              v
       +----------------------+----------------------+
       |             LangChain.js Agent              |
       +-------+--------+---------+--------+---------+
               |        |         |        |
    +----------v-+  +---v----+ +--v---+ +--v---+
    |  Yahoo     |  | Wiki   | | News | |Tavily|
    |  Finance   |  |  API   | | API  | |Search|
    | (Financials|  | (Intro | |(News | |(Trend |
    | & Charts)  |  |Summary)| |Articles) Research)
    +----------+-+  +---+----+ +--+---+ +--+---+
               |        |         |        |
               +--------+----+----+--------+
                             |
                     Aggregated Context
                             |
                             v
       +----------------------+----------------------+
       |            Google Gemini API                |
       |        (Structured JSON Response Mode)      |
       +----------------------+----------------------+
                              |
                      Structured JSON
                              |
                              v
             +----------------+----------------+
             |                                 |
             v                                 v
     +-------+--------+                +-------+--------+
     | MongoDB Atlas  |                | Local Fallback |
     |  (Production)  | -- Failover -> |   JSON Store   |
     +----------------+                +----------------+
```

---

## Tech Stack

### Frontend
*   **React.js (Vite)**: Scaffolded for high-performance builds.
*   **React Router**: Manages application routing and state preservation.
*   **Axios**: Triggers backend research requests and polls database history.
*   **Tailwind CSS v3**: Delivers a custom-designed fintech dark theme with neon blue glow aesthetics and a dedicated print stylesheet.
*   **Recharts**: Visualizes 12 months of historical closing prices in a responsive area curve.
*   **Framer Motion**: Controls layout transitions and progressive loading checkmarks.
*   **Lucide React**: Provides icons for metrics, risks, and moats.

### Backend
*   **Node.js & Express.js**: Handles API endpoints, request logging (`morgan`), CORS policies, and global error middleware.
*   **Mongoose & MongoDB**: Stores historical reports persistently. Includes a local JSON-file database failover.
*   **LangChain.js**: Defines dynamic research tools and coordinates the execution loop.
*   **Google Gemini API**: Uses `gemini-1.5-flash` with structured JSON mode.
*   **yahoo-finance2**: Handles stock ticker lookups, quotes, financial statements, and historical coordinates.

---

## Folder Structure

```text
F:\InsideIIMAssignment/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & fallback configurations
│   ├── controllers/
│   │   └── analysisController.js # Router controllers for analysis & history
│   ├── data/
│   │   └── history.json          # Failover file database (auto-generated)
│   ├── middleware/
│   │   └── errorHandler.js       # Express global error handler
│   ├── prompts/
│   │   └── analystPrompt.js      # Equity analyst system instructions & prompts
│   ├── routes/
│   │   └── analysisRoutes.js     # Express routes
│   ├── schemas/
│   │   └── analysis.js           # Mongoose report schema
│   ├── services/
│   │   ├── newsApi.js            # NewsAPI.org with Yahoo news failover
│   │   ├── tavily.js             # Tavily web search service
│   │   ├── wikipedia.js          # Wikipedia REST summary crawler
│   │   └── yahooFinance.js       # Yahoo Finance aggregator & search
│   ├── tools/
│   │   ├── newsTool.js           # LangChain dynamic news tool
│   │   ├── profileTool.js        # LangChain company profile tool
│   │   ├── tavilyTool.js         # LangChain search tool
│   │   ├── wikipediaTool.js      # LangChain Wikipedia context tool
│   │   └── yahooFinanceTool.js   # LangChain financial metrics tool
│   ├── agents/
│   │   └── researchAgent.js      # LangChain LLM orchestrator agent
│   ├── utils/
│   │   └── logger.js             # Formatted terminal log utility
│   ├── server.js                 # Main server file
│   ├── .env                      # Local server secrets
│   └── package.json              # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Branding header and connectivity indicators
│   │   │   ├── SearchBar.jsx     # Input form and popular company quick pills
│   │   │   ├── LoadingScreen.jsx # Animated step progress indicator
│   │   │   ├── Dashboard.jsx     # Layout rendering charts, moats, and export triggers
│   │   │   └── HistorySidebar.jsx# Sidebar listing past analysis cards
│   │   ├── App.jsx               # App routing and page coordinator
│   │   ├── main.jsx              # React entrypoint
│   │   └── index.css             # Tailwind imports & print layout directives
│   ├── tailwind.config.js        # Custom fintech color palettes
│   ├── postcss.config.js         # PostCSS config
│   ├── package.json              # Frontend dependencies
│   └── index.html                # Main template with SEO meta description
└── README.md                     # System documentation
```

---

## Installation & Setup

1.  **Clone the Repository** and navigate to the project directory:
    ```bash
    cd InsideIIMAssignment
    ```

2.  **Install Backend Dependencies**:
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```

---

## Environment Variables

Create a file named `.env` in the `backend/` directory:

```env
# Server Port
PORT=5000

# Google Gemini API Key (Obtain from Google AI Studio: https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Tavily Search API Key (Obtain from https://tavily.com/)
TAVILY_API_KEY=your_tavily_api_key_here

# News API Key (Obtain from https://newsapi.org/)
NEWS_API_KEY=your_news_api_key_here

# MongoDB Connection String (Optional: e.g. MongoDB Atlas / Local Connection)
# If left empty, EquityEye automatically falls back to backend/data/history.json
MONGODB_URI=
```

---

## Running the Application

### Start the Backend Server:
From the `backend/` directory:
```bash
# Starts the server in development mode (using nodemon)
npm run dev
```
The server will run on `http://localhost:5000`. You can inspect the health check at `http://localhost:5000/api/status`.

### Start the Frontend Server:
From the `frontend/` directory:
```bash
# Starts the Vite development server
npm run dev
```
Open your browser and navigate to the local address displayed in the terminal (typically `http://localhost:5173`).

---

## LangChain Workflow & Tool Orchestration

1.  **Lookup & Identification**: The user inputs a company name (e.g. "Apple" or "Tesla"). The pipeline queries `yahooFinanceService.searchTicker` to resolve the string to an official stock symbol (e.g., `AAPL`, `TSLA`).
2.  **Tool Harvesting**: Using `Promise.all`, the agent calls the following modular LangChain tools concurrently:
    *   `company_profile_tool`: Resolves business sectors, industries, and description.
    *   `financial_metrics_tool`: Collects current pricing, market caps, P/E ratios, revenue growth, profitability margins, debt ratios, and free cash flows.
    *   `wikipedia_tool`: Extracts Wikipedia summary texts for general company background.
    *   `latest_news_tool`: Polls recent articles to evaluate market sentiment.
    *   `tavily_search_tool`: Conducts deep web search queries to locate industry trends and competitor actions.
3.  **Synthesis**: The pipeline compiles the outputs from all tools into a single text-based context block.
4.  **Generative AI Evaluation**: The agent invokes Gemini with the `SYSTEM_PROMPT` containing instructions to act as a "Senior Equity Analyst" and outputs structured, schema-compliant JSON.
5.  **Persistence**: The resulting report is saved to MongoDB (if configured) or the local `backend/data/history.json` store and returned to the React frontend.

---

## AI Prompt Design

The agent is driven by a highly constrained prompt located in `backend/prompts/analystPrompt.js`. Key constraints include:
*   **JSON Enforcement**: Instructs Gemini to return pure JSON matches for the schema fields. It uses Gemini's native `responseMimeType: "application/json"` config, eliminating unparseable markdown code blocks.
*   **Persona Mapping**: Directs the LLM to think like an institutional investor, forcing it to judge qualitative factors (moats) alongside financial numbers (growth, profitability, leverage, cash flow).
*   **Strict Enums**: Restricts recommendation outputs to either `"Invest"` or `"Pass"`.

---

## Architectural Decisions & Trade-Offs

*   **Resilient Fallback Storage**: Using a local JSON store fallback (`backend/data/history.json`) when MongoDB is missing allows developers and assessors to test the app without setting up database instances first.
*   **Parallel Tool Execution**: Running the Yahoo Finance, Wikipedia, News, and Tavily APIs in parallel (`Promise.all`) cuts request overhead times in half, speeding up the AI report generation.
*   **Print Stylesheet for PDFs**: Instead of using heavy, un-stylable client libraries like `jspdf`, the application utilizes native `@media print` CSS configurations. This allows the user's browser to print the layout directly as a clean, vector-rendered, page-broken white paper.
*   **API-Key Resiliency**: If any API key (Tavily or NewsAPI) is missing, the corresponding service catches the error, logs a warning, and falls back to Yahoo news feed searches or mock placeholders instead of crashing.

---

## Example Input & Output

### Example Input
`Tesla`

### Example Output JSON
```json
{
  "company": "Tesla, Inc.",
  "sector": "Consumer Cyclical",
  "industry": "Auto Manufacturers",
  "marketCap": "$580.45B",
  "stockPrice": "$182.50",
  "businessSummary": "Tesla, Inc. designs, develops, manufactures, sells, and leases fully electric vehicles, energy generation, and storage systems.",
  "financialHealth": {
    "revenueGrowth": "8.50% YoY, indicating moderate deceleration in automotive deliveries.",
    "profitability": "Operating margin of 5.50% and profit margin of 14.10%, impacted by competitive price matching.",
    "debt": "Debt-to-equity ratio of 0.08x, highlighting a stellar balance sheet with minimal leverage.",
    "cashFlow": "$1.5B free cash flow, representing a tight capital profile but stable liquidity."
  },
  "growthPotential": "Tesla remains uniquely positioned due to its Full Self-Driving (FSD) licensing potential, robotaxi ambitions, and energy storage division expansion.",
  "competitiveAdvantages": [
    "Vertical integration from battery chemical sourcing to proprietary supercharging network",
    "Pioneering brand premium and high scale manufacturing advantages in electric vehicles"
  ],
  "risks": [
    "Intense price competition from Chinese automakers like BYD and Geely",
    "Execution delays in next-generation vehicle launches and autonomy licensing"
  ],
  "latestNewsSummary": [
    "Announced autonomous driving updates for European regulatory approvals.",
    "Reported delivery numbers indicating solid growth in energy storage installations."
  ],
  "recommendation": "Invest",
  "confidence": 80,
  "reasoning": "Tesla presents a strong long-term buy proposition. While automotive margins are compressed, its low debt leverage (0.08x D/E) and massive cash reserve provide a strong safety net. High conviction resides in autonomous driving licensing and utility-scale battery deployments."
}
```

---

## Future Improvements
1.  **Caching Layer**: Integrate Redis to cache Yahoo Finance financial responses for 24 hours, reducing API call counts and speeding up repeat searches.
2.  **Advanced Stock Charts**: Integrate lightweight charts (TradingView charts) to support candlestick formats and technical indicator overlays (RSI, moving averages).
3.  **Authentication**: Add user accounts so analysts can save private watchlists and share reports with other members.
4.  **Streaming Socket Updates**: Stream agent tool logs to the client using WebSockets, allowing users to watch the agent execute tasks in real time.

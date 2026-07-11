import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { searchWithTavily } from "./tavilyService.js";

// Helper to pre-process and sanitize numeric fields that the LLM may accidentally output as formatted strings
const robustNumber = z.union([
  z.number(),
  z.string()
]).transform((val) => {
  if (typeof val === "number") return val;
  
  // Remove formatting: $, commas, % signs, spaces
  let clean = val.replace(/[$,%\s]/g, "");
  
  // Convert 'B' or 'b' suffixes (e.g., 394.3B -> 394.3)
  if (clean.toLowerCase().endsWith("b")) {
    clean = clean.slice(0, -1);
  }
  
  // Convert 'M' or 'm' suffixes to billions (e.g., 500M -> 0.5)
  if (clean.toLowerCase().endsWith("m")) {
    return parseFloat(clean.slice(0, -1)) / 1000;
  }
  
  let num = parseFloat(clean);
  
  // If the parsed number is a full representation (e.g. 124E9 or 124000000000), 
  // scale it down to billions if it is clearly in the millions/billions range.
  if (num >= 1000000) {
    num = num / 1000000000;
  }
  
  return isNaN(num) ? 0 : num;
});

// Zod Schema representing the exact investment report model expected by the frontend
const CompanyReportSchema = z.object({
  overview: z.object({
    name: z.string().describe("Company full name"),
    ticker: z.string().describe("Stock ticker symbol"),
    sector: z.string().describe("Industry sector"),
    industry: z.string().describe("Specific industry name"),
    marketCap: z.string().describe("Current market capitalization (e.g., $3.42T)"),
    headquarters: z.string().describe("Headquarters location"),
    founded: z.string().describe("Founding year"),
    ceo: z.string().describe("Current CEO"),
    employees: z.string().describe("Total number of employees (e.g., 164,000)"),
    website: z.string().describe("Company website URL (e.g. www.apple.com)"),
    summary: z.string().describe("Concise executive summary of the company"),
    logo: z.string().describe("A single character representing the logo (usually first letter of name)"),
  }),
  decision: z.object({
    verdict: z.enum(["BUY", "HOLD", "SELL"]).describe("Overall investment recommendation"),
    confidence: robustNumber.describe("Confidence score as percentage (0-100)"),
    score: robustNumber.describe("Financial health score (0-100)"),
  }),
  reasoning: z.array(
    z.object({
      step: z.string().describe("Action step name (e.g., Research Company, Financial Analysis)"),
      detail: z.string().describe("Details of the analysis performed in this step"),
      status: z.enum(["done", "pending"]).default("done"),
    })
  ).describe("Steps performed during the research process"),
  metrics: z.array(
    z.object({
      label: z.string().describe("Metric label (e.g., Revenue, Net Profit, EPS, P/E Ratio, ROE, Op. Margin)"),
      value: z.string().describe("Current value (e.g., $394.3B, 31.2, 156.1%)"),
      delta: z.string().describe("Change comparison (e.g., +8.2%, -1.2%)"),
      positive: z.boolean().describe("Whether the change is positive/favorable"),
    })
  ).describe("Key financial and valuation metrics"),
  revenue: z.array(
    z.object({
      year: z.string().describe("Calendar year"),
      revenue: robustNumber.describe("Total revenue in billions (number)"),
      profit: robustNumber.describe("Net profit in billions (number)"),
    })
  ).describe("Historical revenue and profit data (last 4-6 years)"),
  stock: z.array(
    z.object({
      month: z.string().describe("Month abbreviation (e.g., Jan, Feb)"),
      price: robustNumber.describe("Average stock price for that month"),
    })
  ).describe("Historical monthly stock price trend for the last 12 months"),
  health: z.array(
    z.object({
      label: z.string().describe("Financial category (e.g., Liquidity, Profitability, Debt Management, Cash Position, Margins, Efficiency)"),
      value: robustNumber.describe("Score out of 100"),
    })
  ).describe("Financial health scores across key categories"),
  swot: z.object({
    strengths: z.array(z.string()).describe("List of core strengths"),
    weaknesses: z.array(z.string()).describe("List of core weaknesses"),
    opportunities: z.array(z.string()).describe("List of key opportunities"),
    threats: z.array(z.string()).describe("List of potential threats"),
  }),
  risk: z.object({
    score: robustNumber.describe("Overall risk score (0-100, where higher is riskier)"),
    factors: z.array(
      z.object({
        name: z.string().describe("Risk factor name (e.g., Political, Economic, Competition, Supply Chain, Regulatory, Currency, Technology, ESG)"),
        level: z.enum(["low", "medium", "high"]).describe("Assessed risk level"),
      })
    ),
  }),
  news: z.array(
    z.object({
      headline: z.string().describe("Headline of a recent relevant news item"),
      source: z.string().describe("News publisher (e.g., Bloomberg, Reuters)"),
      time: z.string().describe("Time passed (e.g., 2h ago, 1d ago)"),
      summary: z.string().describe("Brief news summary"),
      sentiment: z.enum(["positive", "neutral", "negative"]).describe("Sentiment impact of this news"),
    })
  ).describe("Recent news analysis impacting the company"),
  sentiment: z.object({
    positive: robustNumber.describe("Percentage of positive news/market sentiment"),
    neutral: robustNumber.describe("Percentage of neutral sentiment"),
    negative: robustNumber.describe("Percentage of negative sentiment"),
  }),
  analyst: z.object({
    buy: robustNumber.describe("Number of analysts recommending BUY"),
    hold: robustNumber.describe("Number of analysts recommending HOLD"),
    sell: robustNumber.describe("Number of analysts recommending SELL"),
    consensus: z.string().describe("Consensus rating (e.g., Strong Buy, Moderate Buy, Hold)"),
    priceTarget: z.string().describe("Average price target (e.g., $258.40)"),
  }),
  competitors: z.array(
    z.object({
      name: z.string().describe("Competitor name"),
      revenue: z.string().describe("Annual revenue (e.g., $245B)"),
      growth: z.string().describe("Revenue growth rate (e.g., 15.7%)"),
      marketCap: z.string().describe("Market Cap (e.g., $3.1T)"),
      pe: z.string().describe("P/E ratio (e.g., 35.8)"),
      margins: z.string().describe("Operating margin (e.g., 42.0%)"),
    })
  ).describe("Comparison metrics with top 4 competitors, and the company itself as the first entry"),
  pros: z.array(z.string()).describe("List of top 4-5 investment pros (reasons to buy)"),
  cons: z.array(z.string()).describe("List of top 3-4 investment cons (reasons to avoid or risk factors)"),
  thesis: z.string().describe("Detailed investment thesis written in Markdown. Include headers, bullet points, and a target price summary block."),
  sources: z.array(
    z.object({
      name: z.string().describe("Source citation name (e.g., SEC 10-K Filing, Annual Report, Bloomberg, Alpha Vantage)"),
      url: z.string().default("#").describe("Citation link (default to #)"),
      type: z.string().describe("Source type (e.g., Filing, Market Data, News, Company)"),
    })
  ).describe("Sources and references used to compile this report"),
});

/**
 * Generate a comprehensive investment report using LangChain & Groq LLM.
 * Uses Tavily for real-time web search data. Never reads from cache.
 */
export async function generateInvestmentReport({ company, apiKey, tavilyApiKey, model, temperature }) {
  // Use user-provided Groq API key first, fall back to server environment variable
  const activeApiKey = apiKey || process.env.GROQ_API_KEY;

  if (!activeApiKey) {
    throw new Error(
      "Groq API Key is missing. Please configure your API key in the Settings Panel (gear icon in top-right) or define GROQ_API_KEY in the server .env file."
    );
  }

  // 1. Fetch real-time research data via Tavily web search
  let researchContext = "";
  try {
    const tavilyData = await searchWithTavily(company, tavilyApiKey);
    if (tavilyData) {
      researchContext = `
## REAL-TIME WEB RESEARCH DATA (fetched live from the web for: "${company}")

${tavilyData}

## INSTRUCTIONS FOR REPORT GENERATION:
1. Use the real-time web research data above as your PRIMARY source for all analysis.
2. Extract the latest stock price, revenue, profits, CEO, employee count, analyst ratings, news, and all other facts directly from the data provided above.
3. For the 'news' array, use the real article headlines and summaries from the search results above, assigning accurate sentiment (positive/neutral/negative) based on the content.
4. For any financial metrics NOT found in the above data (e.g., historical revenue years, SWOT analysis), use your accurate pretrained knowledge.
5. Do NOT hallucinate or invent financial data. If a metric is truly unavailable, note it explicitly.
6. Today's date is ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} — ensure all analysis reflects the most current available information.
`;
    } else {
      researchContext = `
No live web research data was available for "${company}" (Tavily API key not configured or search failed).
Please proceed using your most recent pretrained knowledge, but explicitly note that live research data could not be retrieved.
Today's date is ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
`;
    }
  } catch (err) {
    console.error(`[LangChain] Tavily research lookup failed for "${company}":`, err.message);
    researchContext = `Live web research failed. Please proceed using your pretrained knowledge.`;
  }

  // 2. Initialize LangChain ChatGroq model
  const chatModel = new ChatGroq({
    apiKey: activeApiKey,
    modelName: model,
    temperature: temperature,
  });

  // 3. Wrap LLM to enforce Zod structured output (auto-forces JSON Mode & parses results)
  const structuredLlm = chatModel.withStructuredOutput(CompanyReportSchema);

  // 4. Define the LLM Prompt Template
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are an elite Wall Street equity research analyst and investment strategist.
Your task is to analyze the requested company and generate a comprehensive, data-driven investment research report.
Your output must strictly adhere to the requested schema structure.
For the requested company:
- Use the real-time web research data provided as the PRIMARY source of truth for all facts.
- Fetch realistic or highly plausible financial metrics, competitor names, revenue, margins, ROE, etc.
- Make competitor analysis entries comparative (include the target company as the first entry).
- Formulate a clear verdict (BUY, SELL, or HOLD) with confidence percentages.
- Write a professional Investment Thesis in standard Markdown (include headers, bullet points, and a target price recommendation).
- List realistic source citations.
- IMPORTANT: For all number/numeric fields (e.g. 'confidence', 'score', 'revenue', 'profit', 'price', 'value', 'positive', 'neutral', 'negative', 'buy', 'hold', 'sell'), you MUST output raw numeric values (integers or decimals) without any currency symbols (e.g., '$'), percentage signs (e.g., '%'), letter suffixes (e.g., 'B' or 'M'), or formatting commas. For example, output 394.3 instead of "$394.3B", and 182 instead of "$182".`,
    ],
    ["human", "Perform a comprehensive investment analysis on the following company: {company}\n\nLive Research Context:\n{context}"],
  ]);

  // 5. Create and execute the Runnable Chain
  const chain = prompt.pipe(structuredLlm);

  console.log(`[LangChain] Sending real-time analysis request for "${company}" to Groq API...`);
  
  // Call Groq API and automatically parse the structured JSON response
  const reportData = await chain.invoke({ company, context: researchContext });

  console.log(`[LangChain] Report generated successfully for "${company}".`);

  return reportData;
}

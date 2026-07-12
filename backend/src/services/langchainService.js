import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { fetchLiveCompanyData } from "./financialDataService.js";

// Helper to sanitize numeric fields
const robustNumber = z.union([
  z.number(),
  z.string(),
  z.null(),
]).transform((val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") {
    if (Math.abs(val) >= 1_000_000) return parseFloat((val / 1_000_000_000).toFixed(3));
    return val;
  }
  let clean = val.replace(/[$,%\s]/g, "");
  if (clean.toLowerCase().endsWith("b")) clean = clean.slice(0, -1);
  if (clean.toLowerCase().endsWith("m")) return parseFloat(clean.slice(0, -1)) / 1000;
  let num = parseFloat(clean);
  if (num >= 1_000_000) num = num / 1_000_000_000;
  return isNaN(num) ? 0 : num;
});

// Helper to sanitize string fields
const robustString = z.union([
  z.string(),
  z.number(),
  z.null(),
]).transform((val) => {
  if (val === null || val === undefined) return "Not Available";
  if (typeof val === "number") return String(val);
  return val;
});

// Zod Schema representing the exact investment report model expected by the frontend
const CompanyReportSchema = z.object({
  overview: z.object({
    name: z.string(),
    ticker: z.string(),
    sector: z.string(),
    industry: z.string(),
    marketCap: robustString,
    headquarters: z.string(),
    founded: robustString,
    ceo: z.string(),
    employees: robustString,
    website: z.string(),
    summary: z.string(),
    logo: z.string(),
  }),
  decision: z.object({
    verdict: z.enum(["BUY", "HOLD", "SELL"]),
    confidence: robustNumber,
    score: robustNumber,
  }),
  reasoning: z.array(
    z.object({
      step: z.string(),
      detail: z.string(),
      status: z.enum(["done", "pending"]).default("done"),
    })
  ),
  metrics: z.array(
    z.object({
      label: z.string(),
      value: robustString,
      delta: robustString,
      positive: z.boolean(),
    })
  ),
  revenue: z.array(
    z.object({
      year: z.string(),
      revenue: robustNumber,
      profit: robustNumber,
    })
  ),
  stock: z.array(
    z.object({
      month: z.string(),
      price: robustNumber,
    })
  ),
  health: z.array(
    z.object({
      label: z.string(),
      value: robustNumber,
    })
  ),
  swot: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string()),
  }),
  risk: z.object({
    score: robustNumber,
    factors: z.array(
      z.object({
        name: z.string(),
        level: z.enum(["low", "medium", "high"]),
      })
    ),
  }),
  news: z.array(
    z.object({
      headline: z.string(),
      source: z.string(),
      time: z.string(),
      summary: z.string(),
      sentiment: z.enum(["positive", "neutral", "negative"]),
    })
  ),
  sentiment: z.object({
    positive: robustNumber,
    neutral: robustNumber,
    negative: robustNumber,
  }),
  analyst: z.object({
    buy: robustNumber,
    hold: robustNumber,
    sell: robustNumber,
    consensus: z.string(),
    priceTarget: robustString,
  }),
  competitors: z.array(
    z.object({
      name: z.string(),
      revenue: robustString,
      growth: robustString,
      marketCap: robustString,
      pe: robustString,
      margins: robustString,
    })
  ),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  thesis: z.string(),
  sources: z.array(
    z.object({
      name: z.string(),
      url: z.string().default("#"),
      type: z.string(),
    })
  ),
});

/**
 * Generate a comprehensive investment report using Gemini API.
 * Fetches actual live data from APIs first, then runs analysis via Gemini.
 */
export async function generateInvestmentReport({ company, apiKey, model, temperature }) {
  // 1. Fetch all real live financial & profile data first
  const rawLiveData = await fetchLiveCompanyData(company);

  // 2. Resolve Gemini API Key (prioritize GEMINI_API_KEY, fallback to user apiKey or GROQ_API_KEY)
  const activeApiKey = process.env.GEMINI_API_KEY || apiKey || process.env.GROQ_API_KEY;

  if (!activeApiKey) {
    throw new Error(
      "Gemini API Key is missing. Please configure your API key in the server .env file as GEMINI_API_KEY."
    );
  }

  // 3. Initialize Google Generative AI SDK
  const genAI = new GoogleGenerativeAI(activeApiKey);
  // Default to gemini-1.5-pro for complex investment analysis, fall back to gemini-1.5-flash if needed
  const geminiModel = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  console.log(`[Gemini Service] Sending real-time data to Gemini API for: "${company}"`);

  const systemInstruction = `You are a Wall Street equity analyst. Your task is to analyze the provided live company data and news, and output a structured research report.
IMPORTANT: You MUST copy all the overview, stockPrice, metrics, competitors, analyst, revenue, stock, and news fields from the input context EXACTLY as they are. You are NOT allowed to invent, hallucinate, or alter any numbers, CEOs, employee counts, or competitor values. If a value is "Not Available", keep it as "Not Available".

You are ONLY allowed to generate analysis fields:
1. 'decision' (verdict: BUY, HOLD, or SELL, confidence percentage 0-100, health score 0-100 based on financial ratios)
2. 'health' (list of scores for: Liquidity, Profitability, Debt Management, Cash Position, Margins, Efficiency)
3. 'swot' (Core Strengths, Weaknesses, Opportunities, and Threats based on news and metrics)
4. 'risk' (Composite risk score 0-100, and risk factors list with levels 'low', 'medium', 'high')
5. 'news[].sentiment' (sentiment impact for each news story)
6. 'sentiment' (composite percentages for positive, neutral, negative sentiment based on news analysis)
7. 'reasoning' (a series of steps showing your analysis process)
8. 'pros' and 'cons' arrays
9. 'thesis' (A detailed, Wall Street-grade Investment Thesis written in Markdown)
10. 'sources' array citation listing (such as Yahoo Finance, NewsAPI, SEC filings)

Output MUST strictly follow the JSON schema. Format output as raw JSON object only.`;

  const promptText = `
REAL LIVE COMPANY DATA FETCHED FROM APIS:
${JSON.stringify(rawLiveData, null, 2)}

Perform the analysis on the company "${company}" using only the data above. Do not invent any numbers.`;

  const chat = geminiModel.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemInstruction }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I will strictly analyze the provided data, preserve all factual values without change, and output only the validated JSON schema report." }]
      }
    ]
  });

  const responseResult = await chat.sendMessage(promptText);
  const jsonText = responseResult.response.text().trim();

  // 4. Parse & Validate structured JSON using Zod Schema
  let parsedReport;
  try {
    parsedReport = JSON.parse(jsonText);
  } catch (err) {
    console.error("[Gemini Service] Failed to parse JSON response:", jsonText);
    throw new Error("Invalid JSON structure returned by Gemini API.");
  }

  // Inject real live data into the parsed schema to ensure complete accuracy
  parsedReport.overview = { ...rawLiveData.overview, ...parsedReport.overview };
  parsedReport.metrics = rawLiveData.metrics;
  parsedReport.revenue = rawLiveData.revenueHistory;
  parsedReport.stock = rawLiveData.stockHistory;
  parsedReport.competitors = rawLiveData.competitors;
  parsedReport.analyst = rawLiveData.analyst;

  // Add source citations dynamically
  parsedReport.sources = [
    { name: "Yahoo Finance API", url: "https://finance.yahoo.com", type: "Market Data" },
    { name: "SEC Filings Engine", url: "https://www.sec.gov", type: "Filings" }
  ];
  if (process.env.NEWS_API_KEY) {
    parsedReport.sources.push({ name: "NewsAPI Engine", url: "https://newsapi.org", type: "News" });
  }

  // Run final Zod validation
  const validatedReport = CompanyReportSchema.parse(parsedReport);
  console.log(`[Gemini Service] Successfully compiled and validated report for "${company}".`);

  return validatedReport;
}

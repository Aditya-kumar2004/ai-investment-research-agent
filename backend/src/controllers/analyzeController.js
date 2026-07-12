import mongoose from "mongoose";
import Report from "../models/Report.js";
import { generateInvestmentReport } from "../services/langchainService.js";

// Simple in-memory fallback cache in case MongoDB is offline
const inMemoryCache = new Map();

// Standardize cache key creation
function getCacheKey(company, model, temp) {
  return `${company.toLowerCase()}:${model}:${temp}`;
}

/**
 * Controller to handle company analysis requests.
 * Orchestrates caching check, calls LangChain for report generation, and caches results.
 */
export async function analyzeCompanyController(req, res, next) {
  try {
    const {
      company,
      apiKey,
      tavilyApiKey,
      model: requestedModel = "llama-3.3-70b-versatile",
      temperature = 0.2,
    } = req.body;

    // Guard: replace any decommissioned Groq models with current default
    const DECOMMISSIONED = ["llama-3.1-70b-versatile", "llama-2-70b-4096", "mixtral-8x7b-32768"];
    const model = DECOMMISSIONED.includes(requestedModel) ? "llama-3.3-70b-versatile" : requestedModel;
    if (DECOMMISSIONED.includes(requestedModel)) {
      console.warn(`[Controller] Decommissioned model "${requestedModel}" requested — switching to llama-3.3-70b-versatile`);
    }

    const normalizedCompany = company.trim();
    const cacheKey = getCacheKey(normalizedCompany, model, temperature);

    const isDbConnected = mongoose.connection.readyState === 1;

    console.log(
      `[Controller] Starting analysis for: "${normalizedCompany}" using model: "${model}" (temp: ${temperature})`
    );

    // 1. Check cache (MongoDB first, then in-memory fallback)
    if (isDbConnected) {
      try {
        const cachedReport = await Report.findOne({
          companyName: normalizedCompany.toLowerCase(),
          model,
          temperature,
        });

        if (cachedReport) {
          console.log(`[Cache Hit] Serving cached report from MongoDB for: "${normalizedCompany}"`);
          return res.status(200).json({
            success: true,
            source: "cache_mongodb",
            data: cachedReport.reportData,
          });
        }
      } catch (dbError) {
        console.error("[Cache Lookup Error] Failed to read from MongoDB:", dbError.message);
      }
    } else {
      // Offline fallback: check in-memory cache with 5-minute TTL
      if (inMemoryCache.has(cacheKey)) {
        const cached = inMemoryCache.get(cacheKey);
        if (Date.now() < cached.expiry) {
          console.log(`[Cache Hit] Serving cached report from Memory for: "${normalizedCompany}"`);
          return res.status(200).json({
            success: true,
            source: "cache_memory",
            data: cached.data,
          });
        } else {
          inMemoryCache.delete(cacheKey);
          console.log(`[Cache Evict] Evicted expired memory cache key for: "${normalizedCompany}"`);
        }
      }
    }

    // 2. Cache Miss: Generate new report via LangChain & Groq
    console.log(`[Cache Miss] Initiating AI agent research for: "${normalizedCompany}"`);
    const generatedReport = await generateInvestmentReport({
      company: normalizedCompany,
      apiKey,
      tavilyApiKey,
      model,
      temperature,
    });

    // 3. Store in cache (MongoDB or In-Memory)
    if (isDbConnected) {
      try {
        const newReport = new Report({
          companyName: normalizedCompany,
          model,
          temperature,
          reportData: generatedReport,
        });
        await newReport.save();
        console.log(`[Cache Save] Successfully saved report for "${normalizedCompany}" in MongoDB.`);
      } catch (dbSaveError) {
        console.error("[Cache Save Error] Failed to write to MongoDB:", dbSaveError.message);
      }
    } else {
      // Save in memory fallback cache with 5-minute TTL (300,000 ms)
      inMemoryCache.set(cacheKey, {
        data: generatedReport,
        expiry: Date.now() + 300000
      });
      console.log(`[Cache Save] Saved report for "${normalizedCompany}" in Memory.`);
    }

    return res.status(200).json({
      success: true,
      source: "ai_generation",
      data: generatedReport,
    });
  } catch (error) {
    next(error);
  }
}

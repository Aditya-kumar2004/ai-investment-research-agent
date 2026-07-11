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
    const { company, apiKey, model = "llama-3.3-70b-versatile", temperature = 0.2 } = req.body;
    const normalizedCompany = company.trim();
    const cacheKey = getCacheKey(normalizedCompany, model, temperature);

    const isDbConnected = mongoose.connection.readyState === 1;

    console.log(`[Controller] Starting analysis for: "${normalizedCompany}" using model: "${model}" (temp: ${temperature})`);

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
      // Offline fallback: check in-memory cache
      if (inMemoryCache.has(cacheKey)) {
        console.log(`[Cache Hit] Serving cached report from Memory for: "${normalizedCompany}"`);
        const cachedData = inMemoryCache.get(cacheKey);
        return res.status(200).json({
          success: true,
          source: "cache_memory",
          data: cachedData,
        });
      }
    }

    // 2. Cache Miss: Generate new report via LangChain & Groq
    console.log(`[Cache Miss] Initiating AI agent research for: "${normalizedCompany}"`);
    const generatedReport = await generateInvestmentReport({
      company: normalizedCompany,
      apiKey,
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
      // Save in memory fallback cache
      inMemoryCache.set(cacheKey, generatedReport);
      console.log(`[Cache Save] Saved report for "${normalizedCompany}" in Memory.`);
    }

    // 4. Return response
    return res.status(200).json({
      success: true,
      source: "ai_generation",
      data: generatedReport,
    });
  } catch (error) {
    // Pass any errors to our global error handling middleware
    next(error);
  }
}

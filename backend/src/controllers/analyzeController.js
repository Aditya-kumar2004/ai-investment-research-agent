import { generateInvestmentReport } from "../services/langchainService.js";

/**
 * Controller to handle company analysis requests.
 * Always fetches fresh real-time data — no caching.
 * Only subscribers are stored in the database.
 */
export async function analyzeCompanyController(req, res, next) {
  try {
    const {
      company,
      apiKey,
      tavilyApiKey,
      model = "llama-3.3-70b-versatile",
      temperature = 0.2,
    } = req.body;

    const normalizedCompany = company.trim();

    console.log(
      `[Controller] Starting real-time analysis for: "${normalizedCompany}" using model: "${model}" (temp: ${temperature})`
    );

    // Always generate a fresh report — no cache read, no cache write
    const generatedReport = await generateInvestmentReport({
      company: normalizedCompany,
      apiKey,
      tavilyApiKey,
      model,
      temperature,
    });

    return res.status(200).json({
      success: true,
      source: "ai_realtime",
      data: generatedReport,
    });
  } catch (error) {
    next(error);
  }
}

import express from "express";
import { z } from "zod";
import validate from "../middleware/validate.js";
import { analyzeCompanyController } from "../controllers/analyzeController.js";

const router = express.Router();

// Define validation schema for the analysis request
const analyzeSchema = z.object({
  company: z.string({
    required_error: "Company name is required",
  }).trim().min(1, "Company name cannot be empty"),
  apiKey: z.string().trim().optional(),
  tavilyApiKey: z.string().trim().optional(),
  model: z.string().trim().optional(),
  temperature: z.number().min(0).max(1).optional(),
});

/**
 * Route: POST /api/analyze
 * Desc:  Analyze a company and generate an AI investment report
 * Access: Public
 */
router.post("/analyze", validate(analyzeSchema), analyzeCompanyController);

export default router;

import axios from "axios";
import { toast } from "sonner";
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 120000, // 2 minutes — Tavily search + Groq LLM can take 15-30s
});
function normalizeError(err) {
  if (axios.isAxiosError(err)) {
    const ax = err;
    const status = ax.response?.status;
    const serverMsg = ax.response?.data?.message;
    if (ax.code === "ECONNABORTED") {
      return {
        message: "Analysis is taking longer than expected. This is normal for real-time searches — please try again.",
        code: ax.code,
        retryable: true,
      };
    }
    if (!ax.response) {
      return {
        message: "We couldn't reach the AI service. Check your connection and try again.",
        code: ax.code,
        retryable: true,
      };
    }
    if (status === 429) {
      return {
        message: serverMsg || "⚠️ Rate limit reached. Please wait 30 seconds and try again, or switch to Llama 3.1 8B (Instant) model in Settings for higher limits.",
        status,
        retryable: true,
      };
    }
    if (status && status >= 500) {
      return {
        message: serverMsg || "Our AI service is temporarily unavailable.",
        status,
        retryable: true,
      };
    }
    if (status === 404) {
      return {
        message: serverMsg || "We couldn't find data for this company.",
        status,
        retryable: false,
      };
    }
    if (status && status >= 400) {
      return {
        message: serverMsg || "That request wasn't accepted. Try a different company name.",
        status,
        retryable: false,
      };
    }
  }
  if (err instanceof Error) {
    return { message: err.message || "Something unexpected happened.", retryable: true };
  }
  return { message: "Something unexpected happened.", retryable: true };
}
// Global response interceptor — logs + surfaces silent server errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const norm = normalizeError(err);
    console.error("[api]", norm);
    return Promise.reject(norm);
  },
);
export async function analyzeCompany(company, signal) {
  const apiKey = localStorage.getItem("groq_api_key");
  const tavilyApiKey = localStorage.getItem("tavily_api_key");
  const model = localStorage.getItem("groq_model");
  const temperature = localStorage.getItem("groq_temperature");

  const payload = { company };
  if (apiKey) payload.apiKey = apiKey;
  if (tavilyApiKey) payload.tavilyApiKey = tavilyApiKey;
  if (model) payload.model = model;
  if (temperature !== null && temperature !== undefined) {
    payload.temperature = parseFloat(temperature);
  }

  const { data } = await api.post("/analyze", payload, { signal });
  return data;
}
export async function getAnalysis(company) {
  const { data } = await api.get("/analyze", { params: { company } });
  return data;
}
export async function subscribeToNewsletter(email) {
  const { data } = await api.post("/subscribe", { email });
  return data;
}
export { normalizeError, toast };
export default api;

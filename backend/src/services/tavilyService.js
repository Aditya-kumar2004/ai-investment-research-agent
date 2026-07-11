import fetch from "node-fetch";

const TAVILY_API_URL = "https://api.tavily.com/search";

/**
 * Search for real-time company data using the Tavily Search API.
 * Returns a consolidated research context string for the LLM.
 * @param {string} company - Company name to research
 * @param {string} tavilyApiKey - User-provided or server Tavily API key
 */
export async function searchWithTavily(company, tavilyApiKey) {
  const activeKey = tavilyApiKey || process.env.TAVILY_API_KEY;

  if (!activeKey) {
    console.warn("[Tavily] No Tavily API key provided. Skipping real-time search.");
    return null;
  }

  // Run 3 targeted searches in parallel for speed
  const queries = [
    `${company} latest stock price financial results revenue profit analyst rating 2025`,
    `${company} latest news CEO market cap industry overview`,
  ];

  console.log(`[Tavily] Running ${queries.length} real-time searches for "${company}"...`);

  const searchPromises = queries.map((query) =>
    fetch(TAVILY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeKey}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        include_answer: true,
        max_results: 5,
      }),
    })
      .then((r) => r.json())
      .catch((err) => {
        console.error(`[Tavily] Search failed for query "${query}":`, err.message);
        return null;
      })
  );

  const results = await Promise.all(searchPromises);

  // Consolidate results into a concise context (trim to stay within LLM token limits)
  const sections = [];

  results.forEach((result, idx) => {
    if (!result) return;

    // Include AI summary (trimmed to 600 chars)
    if (result.answer) {
      sections.push(`### Web Search ${idx + 1} Summary:\n${result.answer.slice(0, 600)}`);
    }

    // Include top 3 articles with content trimmed to 400 chars each
    const articles = (result.results || []).slice(0, 3);
    articles.forEach((article) => {
      const content = (article.content || "").slice(0, 400);
      sections.push(
        `**Source:** ${article.url || "N/A"}\n**Title:** ${article.title || "N/A"}\n**Content:** ${content}`
      );
    });
  });

  if (sections.length === 0) {
    console.warn(`[Tavily] No usable results returned for "${company}".`);
    return null;
  }

  console.log(`[Tavily] Successfully retrieved real-time data for "${company}".`);
  return sections.join("\n\n---\n\n");
}

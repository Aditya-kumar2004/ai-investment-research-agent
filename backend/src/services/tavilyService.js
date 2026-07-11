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
    `${company} stock price latest financial results revenue profit 2024 2025`,
    `${company} latest news analyst rating price target forecast`,
    `${company} company overview CEO employees sector market capitalization`,
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

  // Consolidate all results into a single rich context string
  const sections = [];

  results.forEach((result, idx) => {
    if (!result) return;

    // Include AI answer summary if available
    if (result.answer) {
      sections.push(`### Web Search ${idx + 1} — AI Summary:\n${result.answer}`);
    }

    // Include top articles
    const articles = (result.results || []).slice(0, 4);
    articles.forEach((article) => {
      sections.push(
        `**Source:** ${article.url || "N/A"}\n**Title:** ${article.title || "N/A"}\n**Content:** ${article.content || "N/A"}`
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

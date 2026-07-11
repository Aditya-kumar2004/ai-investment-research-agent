// Using native global fetch

// Allow self-signed certificates for proxies
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * Fetch company search data, including ticker, sector, industry, and news.
 */
export async function searchCompany(companyName) {
  const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(companyName)}`;
  try {
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": USER_AGENT }
    });
    if (!res.ok) throw new Error(`Search request failed with status: ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`[Yahoo Finance] Search failed for "${companyName}":`, err.message);
    return null;
  }
}

/**
 * Fetch stock price metadata and 12-month price history.
 */
export async function getStockChart(ticker) {
  const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1mo&range=1y`;
  try {
    const res = await fetch(chartUrl, {
      headers: { "User-Agent": USER_AGENT }
    });
    if (!res.ok) throw new Error(`Chart request failed with status: ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`[Yahoo Finance] Chart failed for "${ticker}":`, err.message);
    return null;
  }
}

/**
 * Gather company data into a consolidated context block.
 */
export async function retrieveCompanyResearch(companyName) {
  console.log(`[Research Pipeline] Commencing external lookup for "${companyName}"...`);
  
  const searchResult = await searchCompany(companyName);
  if (!searchResult) {
    console.log(`[Research Pipeline] No lookup results returned for "${companyName}".`);
    return { error: "Search data unavailable." };
  }

  const quotes = searchResult.quotes || [];
  const quote = quotes.find(q => q.quoteType === "EQUITY") || quotes[0];
  if (!quote) {
    console.log(`[Research Pipeline] No equity quote resolved for "${companyName}".`);
    return { error: "No matching stock symbol resolved." };
  }

  const ticker = quote.symbol;
  const name = quote.longname || quote.shortname || companyName;
  const sector = quote.sector || quote.sectorDisp || "N/A";
  const industry = quote.industry || quote.industryDisp || "N/A";

  console.log(`[Research Pipeline] Resolved symbol: "${ticker}" (${name})`);

  // Fetch chart details
  const chartResult = await getStockChart(ticker);
  let chartMeta = {};
  let stockHistory = [];

  if (chartResult) {
    const chartRes = chartResult.chart?.result?.[0] || {};
    chartMeta = chartRes.meta || {};
    
    const timestamps = chartRes.timestamp || [];
    const closes = chartRes.indicators?.quote?.[0]?.close || [];
    
    stockHistory = timestamps.map((ts, idx) => {
      const date = new Date(ts * 1000);
      const monthStr = date.toLocaleString("en-US", { month: "short" });
      const price = closes[idx] ? parseFloat(closes[idx].toFixed(2)) : null;
      return { month: monthStr, price };
    }).filter(h => h.price !== null);
  }

  // Parse News Headlines
  const newsItems = (searchResult.news || []).slice(0, 5).map(n => ({
    headline: n.title,
    source: n.publisher || "News Provider",
    time: n.providerPublishTime ? new Date(n.providerPublishTime * 1000).toLocaleDateString() : "Recent",
    summary: n.title
  }));

  return {
    ticker,
    name,
    sector,
    industry,
    currentPrice: chartMeta.regularMarketPrice || null,
    fiftyTwoWeekHigh: chartMeta.fiftyTwoWeekHigh || null,
    fiftyTwoWeekLow: chartMeta.fiftyTwoWeekLow || null,
    volume: chartMeta.regularMarketVolume || null,
    currency: chartMeta.currency || "USD",
    exchange: chartMeta.exchangeName || "N/A",
    stockHistory,
    news: newsItems
  };
}

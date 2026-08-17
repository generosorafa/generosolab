import { EDITORIAL_REFERENCES } from "../../lib/editorial-radar.js";

const TICKERS = EDITORIAL_REFERENCES.map(({ symbol }) => symbol);

type BrapiQuote = {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: string;
  logourl?: string;
};

const COMPANY_NAMES: Record<string, string> = {
  PETR4: "Petrobras PN",
  VALE3: "Vale ON",
  ITUB4: "Itaú Unibanco PN",
  BBAS3: "Banco do Brasil ON",
};

async function fetchFromBrapi(ticker: string, token?: string) {
  const request = (authorization?: string) => fetch(`https://brapi.dev/api/quote/${ticker}?fundamental=false`, {
    headers: authorization ? { Accept: "application/json", Authorization: `Bearer ${authorization}` } : { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  let response = await request(token);
  if (token && (response.status === 401 || response.status === 403)) response = await request();
  if (!response.ok) throw new Error(`Falha ${response.status} ao consultar ${ticker}`);
  const payload = await response.json() as { results?: BrapiQuote[] };
  const quote = payload.results?.[0];
  if (!quote || typeof quote.regularMarketPrice !== "number") throw new Error(`Cotação indisponível para ${ticker}`);
  return {
    symbol: quote.symbol,
    name: quote.shortName && quote.shortName !== quote.symbol ? quote.shortName : COMPANY_NAMES[ticker] ?? quote.symbol,
    price: quote.regularMarketPrice,
    change: quote.regularMarketChangePercent ?? 0,
    marketTime: quote.regularMarketTime ?? null,
    logoUrl: quote.logourl ?? `https://icons.brapi.dev/icons/${ticker}.svg`,
  };
}

async function fetchFromYahoo(ticker: string) {
  const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.SA?interval=1d&range=1d`, {
    headers: { Accept: "application/json", "User-Agent": "Generoso-Lab/1.0" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Contingência indisponível para ${ticker}`);
  const payload = await response.json() as { chart?: { result?: Array<{ meta?: { regularMarketPrice?: number; chartPreviousClose?: number; previousClose?: number; regularMarketTime?: number } }> } };
  const meta = payload.chart?.result?.[0]?.meta;
  if (!meta || typeof meta.regularMarketPrice !== "number") throw new Error(`Cotação de contingência indisponível para ${ticker}`);
  const previous = meta.chartPreviousClose ?? meta.previousClose;
  return {
    symbol: ticker,
    name: COMPANY_NAMES[ticker] ?? ticker,
    price: meta.regularMarketPrice,
    change: typeof previous === "number" && previous !== 0 ? ((meta.regularMarketPrice - previous) / previous) * 100 : 0,
    marketTime: typeof meta.regularMarketTime === "number" ? new Date(meta.regularMarketTime * 1000).toISOString() : null,
    logoUrl: `https://icons.brapi.dev/icons/${ticker}.svg`,
  };
}

export async function GET() {
  try {
    const token = process.env.BRAPI_API_TOKEN?.trim();
    const results = await Promise.allSettled(TICKERS.map(async (ticker) => {
      try {
        return await fetchFromBrapi(ticker, token);
      } catch {
        return fetchFromYahoo(ticker);
      }
    }));
    const quotes = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
    if (!quotes.length) throw new Error("Cotações temporariamente indisponíveis");

    return Response.json({
      source: "brapi.dev com contingência de mercado",
      delayed: true,
      fetchedAt: new Date().toISOString(),
      quotes,
    }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (error) {
    return Response.json({
      source: "brapi.dev",
      fetchedAt: new Date().toISOString(),
      quotes: [],
      error: error instanceof Error ? error.message : "Dados temporariamente indisponíveis",
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

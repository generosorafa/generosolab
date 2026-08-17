const TICKERS = ["PETR4", "VALE3", "ITUB4", "MGLU3"];

type BrapiQuote = {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: string;
};

export async function GET() {
  try {
    const quotes = await Promise.all(TICKERS.map(async (ticker) => {
      const response = await fetch(`https://brapi.dev/api/quote/${ticker}?fundamental=false`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      });
      if (!response.ok) throw new Error(`Falha ${response.status} ao consultar ${ticker}`);
      const payload = await response.json() as { results?: BrapiQuote[] };
      const quote = payload.results?.[0];
      if (!quote || typeof quote.regularMarketPrice !== "number") throw new Error(`Cotação indisponível para ${ticker}`);
      return {
        symbol: quote.symbol,
        name: quote.shortName ?? quote.symbol,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChangePercent ?? 0,
        marketTime: quote.regularMarketTime ?? null,
      };
    }));

    return Response.json({
      source: "brapi.dev",
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

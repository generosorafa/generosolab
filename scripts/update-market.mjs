import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const symbols = ["PETR4", "VALE3", "ITUB4", "BBAS3"];
const destination = resolve("public", "market.json");
const token = process.env.BRAPI_API_TOKEN?.trim();
const fallbackSymbols = [];

const companyNames = {
  PETR4: "Petrobras PN",
  VALE3: "Vale ON",
  ITUB4: "Itaú Unibanco PN",
  BBAS3: "Banco do Brasil ON",
};

async function fetchFromBrapi(symbol) {
  const request = async (authorization) => {
    const headers = { Accept: "application/json" };
    if (authorization) headers.Authorization = `Bearer ${authorization}`;
    return fetch(`https://brapi.dev/api/quote/${symbol}?fundamental=false`, { headers });
  };

  let response = await request(token);
  if (token && (response.status === 401 || response.status === 403)) response = await request();
  if (!response.ok) throw new Error(`Falha ${response.status} em ${symbol}`);

  const payload = await response.json();
  const quote = payload.results?.[0];
  if (!quote || typeof quote.regularMarketPrice !== "number") throw new Error(`Sem cotação para ${symbol}`);
  return {
    symbol: quote.symbol,
    name: quote.shortName && quote.shortName !== quote.symbol ? quote.shortName : companyNames[symbol] ?? quote.symbol,
    price: quote.regularMarketPrice,
    change: quote.regularMarketChangePercent ?? 0,
    marketTime: quote.regularMarketTime ?? null,
    logoUrl: quote.logourl ?? `https://icons.brapi.dev/icons/${symbol}.svg`,
  };
}

async function fetchFromYahoo(symbol) {
  const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.SA?interval=1d&range=1d`, {
    headers: { Accept: "application/json", "User-Agent": "Generoso-Lab/1.0" },
  });
  if (!response.ok) throw new Error(`Contingência indisponível para ${symbol}`);
  const meta = (await response.json()).chart?.result?.[0]?.meta;
  if (!meta || typeof meta.regularMarketPrice !== "number") throw new Error(`Sem cotação de contingência para ${symbol}`);
  const previous = meta.chartPreviousClose ?? meta.previousClose;
  const change = typeof previous === "number" && previous !== 0
    ? ((meta.regularMarketPrice - previous) / previous) * 100
    : 0;
  return {
    symbol,
    name: companyNames[symbol] ?? symbol,
    price: meta.regularMarketPrice,
    change,
    marketTime: typeof meta.regularMarketTime === "number" ? new Date(meta.regularMarketTime * 1000).toISOString() : null,
    logoUrl: `https://icons.brapi.dev/icons/${symbol}.svg`,
  };
}

const results = await Promise.allSettled(symbols.map(async (symbol) => {
  try {
    return await fetchFromBrapi(symbol);
  } catch {
    fallbackSymbols.push(symbol);
    return fetchFromYahoo(symbol);
  }
}));

const quotes = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);

if (!quotes.length) {
  const previous = JSON.parse(await readFile(destination, "utf8"));
  if (!previous.quotes?.length) throw new Error("Nenhuma cotação pôde ser atualizada");
  console.warn("A fonte não respondeu; mantendo o último arquivo válido.");
} else {
  await writeFile(destination, `${JSON.stringify({
    source: fallbackSymbols.length ? "brapi.dev com contingência de mercado" : "brapi.dev",
    delayed: true,
    fetchedAt: new Date().toISOString(),
    quotes,
  }, null, 2)}\n`);
  console.log(`${quotes.length} cotações atualizadas. ${fallbackSymbols.length ? `Contingência usada em: ${fallbackSymbols.join(", ")}.` : "Brapi respondeu por todos os ativos."}`);
}

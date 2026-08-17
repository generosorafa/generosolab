export const EDITORIAL_REFERENCES = Object.freeze([
  { symbol: "PETR4", company: "Petrobras", ceiling: 48.54, effectiveFrom: "2026-08-17" },
  { symbol: "VALE3", company: "Vale", ceiling: 79.37, effectiveFrom: "2026-08-17" },
  { symbol: "ITUB4", company: "Itaú Unibanco", ceiling: 43.04, effectiveFrom: "2026-08-17" },
  { symbol: "BBAS3", company: "Banco do Brasil", ceiling: 24.26, effectiveFrom: "2026-08-17" },
]);

/** Distância assinada da cotação em relação à referência editorial. */
export function referenceDistance(currentPrice, ceilingPrice) {
  if (!Number.isFinite(currentPrice) || !Number.isFinite(ceilingPrice) || ceilingPrice <= 0) return null;
  return ((currentPrice / ceilingPrice) - 1) * 100;
}

/** Faixas neutras com zona de proximidade de cinco pontos percentuais. */
export function referenceStatus(distance) {
  if (!Number.isFinite(distance)) return "unavailable";
  if (distance < -5) return "below";
  if (distance > 5) return "above";
  return "near";
}

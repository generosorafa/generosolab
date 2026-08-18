export const EDITORIAL_REFERENCES = Object.freeze([
  { symbol: "PETR4", company: "Petrobras", ceiling: 48.54, effectiveFrom: "2026-05-18" },
  { symbol: "VALE3", company: "Vale", ceiling: 79.37, effectiveFrom: "2026-05-18" },
  { symbol: "ITUB4", company: "Itaú Unibanco", ceiling: 43.04, effectiveFrom: "2026-05-18" },
  { symbol: "BBAS3", company: "Banco do Brasil", ceiling: 24.26, effectiveFrom: "2026-05-18" },
  { symbol: "ABCB4", company: "Banco ABC Brasil", ceiling: 28.80, effectiveFrom: "2026-05-18" },
  { symbol: "BBDC3", company: "Bradesco", ceiling: 17.07, effectiveFrom: "2026-05-18" },
  { symbol: "BBSE3", company: "BB Seguridade", ceiling: 43.23, effectiveFrom: "2026-05-18" },
  { symbol: "CMIG4", company: "Cemig", ceiling: 12.70, effectiveFrom: "2026-05-18" },
  { symbol: "ITSA4", company: "Itaúsa", ceiling: 14.74, effectiveFrom: "2026-05-18" },
  { symbol: "ITUB3", company: "Itaú Unibanco", ceiling: 41.99, effectiveFrom: "2026-05-18" },
  { symbol: "KLBN4", company: "Klabin", ceiling: 3.71, effectiveFrom: "2026-05-18" },
  { symbol: "SAPR4", company: "Sanepar", ceiling: 9.43, effectiveFrom: "2026-05-18" },
  { symbol: "WIZC3", company: "Wiz Co", ceiling: 9.80, effectiveFrom: "2026-05-18" },
]);

export const FEATURED_EDITORIAL_REFERENCES = Object.freeze(EDITORIAL_REFERENCES.slice(0, 4));

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

export const EDITORIAL_REFERENCES = Object.freeze([
  { symbol: "PETR4", company: "Petrobras", ceiling: 48.54, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "VALE3", company: "Vale", ceiling: 79.37, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "ITUB4", company: "Itaú Unibanco", ceiling: 43.04, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "BBAS3", company: "Banco do Brasil", ceiling: 24.26, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "ABCB4", company: "Banco ABC Brasil", ceiling: 28.80, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "BBDC3", company: "Bradesco", ceiling: 17.07, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "BBSE3", company: "BB Seguridade", ceiling: 43.23, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "CMIG4", company: "Cemig", ceiling: 10.81, effectiveFrom: "2026-08-25", kind: "stock" },
  { symbol: "ITSA4", company: "Itaúsa", ceiling: 14.74, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "ITUB3", company: "Itaú Unibanco", ceiling: 41.99, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "KLBN4", company: "Klabin", ceiling: 3.71, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "SAPR4", company: "Sanepar", ceiling: 9.43, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "WIZC3", company: "Wiz Co", ceiling: 9.80, effectiveFrom: "2026-05-18", kind: "stock" },
  { symbol: "CSUD3", company: "CSU Digital", ceiling: 17.61, effectiveFrom: "2026-07-01", kind: "stock" },
  { symbol: "CPFE3", company: "CPFL Energia", ceiling: 51.96, effectiveFrom: "2026-08-25", kind: "stock" },
  { symbol: "TIMS3", company: "TIM", ceiling: 27.74, effectiveFrom: "2026-08-01", kind: "stock" },
  { symbol: "GGRC11", company: "GGR Covepi Renda", ceiling: 10.69, effectiveFrom: "2026-08-01", effectivePrecision: "month", kind: "fii" },
  { symbol: "GARE11", company: "Guardian Real Estate", ceiling: 8.91, effectiveFrom: "2026-08-01", effectivePrecision: "month", kind: "fii" },
  { symbol: "PORD11", company: "Polo Crédito Imobiliário", ceiling: 9.33, effectiveFrom: "2026-08-01", effectivePrecision: "month", kind: "fii" },
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

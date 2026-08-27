import test from "node:test";
import assert from "node:assert/strict";
import { EDITORIAL_REFERENCES, orderReferencesByDistance, referenceDistance, referenceStatus } from "../app/lib/editorial-radar.js";

test("preserva as dezenove referências editoriais informadas", () => {
  assert.deepEqual(EDITORIAL_REFERENCES.map(({ symbol, ceiling, effectiveFrom, kind }) => [symbol, ceiling, effectiveFrom, kind]), [
    ["PETR4", 48.54, "2026-05-18", "stock"],
    ["VALE3", 79.37, "2026-05-18", "stock"],
    ["ITUB4", 43.04, "2026-05-18", "stock"],
    ["BBAS3", 24.26, "2026-05-18", "stock"],
    ["ABCB4", 28.80, "2026-05-18", "stock"],
    ["BBDC3", 17.07, "2026-05-18", "stock"],
    ["BBSE3", 43.23, "2026-05-18", "stock"],
    ["CMIG4", 10.81, "2026-08-25", "stock"],
    ["ITSA4", 14.74, "2026-05-18", "stock"],
    ["ITUB3", 41.99, "2026-05-18", "stock"],
    ["KLBN4", 3.71, "2026-05-18", "stock"],
    ["SAPR4", 9.43, "2026-05-18", "stock"],
    ["WIZC3", 9.80, "2026-05-18", "stock"],
    ["CSUD3", 17.61, "2026-07-01", "stock"],
    ["CPFE3", 51.96, "2026-08-25", "stock"],
    ["TIMS3", 27.74, "2026-08-01", "stock"],
    ["GGRC11", 10.69, "2026-08-01", "fii"],
    ["GARE11", 8.91, "2026-08-01", "fii"],
    ["PORD11", 9.33, "2026-08-01", "fii"],
  ]);
  assert.equal(EDITORIAL_REFERENCES.filter(({ kind }) => kind === "stock").length, 16);
  assert.equal(EDITORIAL_REFERENCES.filter(({ kind }) => kind === "fii").length, 3);
});

test("calcula a distância em relação ao preço-teto sem sugerir potencial", () => {
  assert.ok(Math.abs(referenceDistance(90, 100) + 10) < 1e-12);
  assert.ok(Math.abs(referenceDistance(110, 100) - 10) < 1e-12);
  assert.equal(referenceDistance(10, 0), null);
});

test("classifica as faixas editoriais neutras", () => {
  assert.equal(referenceStatus(-5.01), "below");
  assert.equal(referenceStatus(-5), "near");
  assert.equal(referenceStatus(5), "near");
  assert.equal(referenceStatus(5.01), "above");
  assert.equal(referenceStatus(null), "unavailable");
});

test("ordena da maior margem abaixo do teto até os ativos acima", () => {
  const references = [
    { symbol: "NEAR3", ceiling: 100 },
    { symbol: "ABOVE3", ceiling: 100 },
    { symbol: "LOW3", ceiling: 100 },
    { symbol: "MISSING3", ceiling: 100 },
  ];
  const quotes = [
    { symbol: "NEAR3", price: 92 },
    { symbol: "ABOVE3", price: 118 },
    { symbol: "LOW3", price: 82 },
  ];

  assert.deepEqual(orderReferencesByDistance(references, quotes).map(({ symbol }) => symbol), [
    "LOW3",
    "NEAR3",
    "ABOVE3",
    "MISSING3",
  ]);
  assert.deepEqual(references.map(({ symbol }) => symbol), ["NEAR3", "ABOVE3", "LOW3", "MISSING3"]);
});

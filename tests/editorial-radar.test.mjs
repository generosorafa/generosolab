import test from "node:test";
import assert from "node:assert/strict";
import { EDITORIAL_REFERENCES, referenceDistance, referenceStatus } from "../app/lib/editorial-radar.js";

test("preserva as treze referências editoriais informadas", () => {
  assert.deepEqual(EDITORIAL_REFERENCES.map(({ symbol, ceiling }) => [symbol, ceiling]), [
    ["PETR4", 48.54],
    ["VALE3", 79.37],
    ["ITUB4", 43.04],
    ["BBAS3", 24.26],
    ["ABCB4", 28.80],
    ["BBDC3", 17.07],
    ["BBSE3", 43.23],
    ["CMIG4", 12.70],
    ["ITSA4", 14.74],
    ["ITUB3", 41.99],
    ["KLBN4", 3.71],
    ["SAPR4", 9.43],
    ["WIZC3", 9.80],
  ]);
  assert.ok(EDITORIAL_REFERENCES.every(({ effectiveFrom }) => effectiveFrom === "2026-05-18"));
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

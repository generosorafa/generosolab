import test from "node:test";
import assert from "node:assert/strict";
import { EDITORIAL_REFERENCES, referenceDistance, referenceStatus } from "../app/lib/editorial-radar.js";

test("preserva as quatro referências editoriais informadas", () => {
  assert.deepEqual(EDITORIAL_REFERENCES.map(({ symbol, ceiling }) => [symbol, ceiling]), [
    ["PETR4", 48.54],
    ["VALE3", 79.37],
    ["ITUB4", 43.04],
    ["BBAS3", 24.26],
  ]);
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

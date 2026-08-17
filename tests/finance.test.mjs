import test from "node:test";
import assert from "node:assert/strict";
import {
  amountForWeek,
  CHALLENGE_52_TOTAL,
  equivalentMonthlyRate,
  GRID_500_TOTAL,
  monthlyContributionForGoal,
  PLAN_125_TOTAL,
  simulateCompoundInterest,
} from "../app/lib/finance.js";

test("converte 10% efetivos ao ano para a taxa mensal equivalente", () => {
  const monthly = equivalentMonthlyRate(10);
  assert.ok(Math.abs(monthly - 0.0079741404289) < 1e-12);
  assert.ok(Math.abs(Math.pow(1 + monthly, 12) - 1.10) < 1e-12);
});

test("capitaliza o valor inicial em exatamente 10% no primeiro ano", () => {
  const result = simulateCompoundInterest({ initial: 1000, monthly: 0, years: 1, annualRate: 10 });
  assert.ok(Math.abs(result.balance - 1100) < 1e-8);
});

test("corrige o cenário que a calculadora antiga superestimava", () => {
  const result = simulateCompoundInterest({ initial: 10000, monthly: 500, years: 10, annualRate: 10 });
  assert.ok(Math.abs(result.balance - 125869.3529580171) < 0.001);
  assert.equal(result.contributed, 70000);
});

test("calcula aporte mensal para meta sem juros", () => {
  const monthly = monthlyContributionForGoal({ goal: 12000, initial: 0, years: 1, annualRate: 0 });
  assert.equal(monthly, 1000);
});

test("mantém os totais exatos dos dois desafios", () => {
  const total52 = Array.from({ length: 52 }, (_, index) => amountForWeek(index + 1)).reduce((sum, value) => sum + value, 0);
  const total500 = Array.from({ length: 500 }, (_, index) => index + 1).reduce((sum, value) => sum + value, 0);
  assert.equal(total52, CHALLENGE_52_TOTAL);
  assert.equal(total52, 6890);
  assert.equal(total500, GRID_500_TOTAL);
  assert.equal(PLAN_125_TOTAL, 125250);
});

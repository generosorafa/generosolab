/**
 * Converte uma taxa efetiva anual para a taxa mensal equivalente.
 * @param {number} annualPercent taxa em percentual ao ano
 */
export function equivalentMonthlyRate(annualPercent) {
  if (!Number.isFinite(annualPercent) || annualPercent <= -100) return 0;
  return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
}

/**
 * Simula capitalização mensal com aporte no fim de cada mês.
 * @param {{initial:number, monthly:number, years:number, annualRate:number, inflation?:number}} input
 */
export function simulateCompoundInterest({ initial, monthly, years, annualRate, inflation = 0 }) {
  const safeInitial = Math.max(0, Number(initial) || 0);
  const safeMonthly = Math.max(0, Number(monthly) || 0);
  const safeYears = Math.min(80, Math.max(0, Number(years) || 0));
  const months = Math.round(safeYears * 12);
  const monthlyRate = equivalentMonthlyRate(Number(annualRate) || 0);
  let balance = safeInitial;
  const points = [{ year: 0, balance, contributed: safeInitial }];

  for (let month = 1; month <= months; month += 1) {
    balance = balance * (1 + monthlyRate) + safeMonthly;
    if (month % 12 === 0 || month === months) {
      points.push({
        year: month / 12,
        balance,
        contributed: safeInitial + safeMonthly * month,
      });
    }
  }

  const contributed = safeInitial + safeMonthly * months;
  const realBalance = inflation > -100
    ? balance / Math.pow(1 + Math.max(0, inflation) / 100, safeYears)
    : balance;

  return {
    balance,
    contributed,
    earnings: balance - contributed,
    realBalance,
    monthlyRate,
    points,
  };
}

/**
 * Calcula o aporte mensal necessário para uma meta nominal.
 * Aportes são considerados no fim do mês.
 * @param {{goal:number, initial:number, years:number, annualRate:number}} input
 */
export function monthlyContributionForGoal({ goal, initial, years, annualRate }) {
  const safeGoal = Math.max(0, Number(goal) || 0);
  const safeInitial = Math.max(0, Number(initial) || 0);
  const months = Math.max(1, Math.round(Math.max(0, Number(years) || 0) * 12));
  const rate = equivalentMonthlyRate(Number(annualRate) || 0);
  const futureInitial = safeInitial * Math.pow(1 + rate, months);
  const remaining = Math.max(0, safeGoal - futureInitial);
  if (rate === 0) return remaining / months;
  return remaining * rate / (Math.pow(1 + rate, months) - 1);
}

/** @param {number} week */
export function amountForWeek(week) {
  return Math.max(1, Math.min(52, Math.round(week))) * 5;
}

export const CHALLENGE_52_TOTAL = 6890;
export const GRID_500_TOTAL = 125250;
export const PLAN_125_TOTAL = GRID_500_TOTAL;

"use client";

import { AnimatePresence, motion } from "motion/react";
import { Calculator, Check, Flag, PiggyBank, RotateCcw, Shield, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  amountForWeek,
  CHALLENGE_52_TOTAL,
  GRID_500_TOTAL,
  monthlyContributionForGoal,
  PLAN_125_TOTAL,
  simulateCompoundInterest,
} from "../lib/finance.js";

type ToolId = "juros" | "meta" | "reserva" | "52" | "125";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const moneyPrecise = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

const tools: { id: ToolId; label: string; icon: typeof Calculator }[] = [
  { id: "juros", label: "Juros compostos", icon: Calculator },
  { id: "meta", label: "Planejar uma meta", icon: Target },
  { id: "reserva", label: "Reserva", icon: Shield },
  { id: "52", label: "52 semanas", icon: Flag },
  { id: "125", label: "Plano 125 mil", icon: PiggyBank },
];

function NumericField({ label, value, onChange, suffix, min = 0, max, step = 1 }: {
  label: string; value: number; onChange: (value: number) => void; suffix?: string; min?: number; max?: number; step?: number;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        <input type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
        {suffix && <b>{suffix}</b>}
      </div>
    </label>
  );
}

function GrowthChart({ points }: { points: { year: number; balance: number; contributed: number }[] }) {
  const width = 720;
  const height = 250;
  const pad = 18;
  const max = Math.max(1, ...points.map((point) => point.balance));
  const x = (index: number) => pad + index * ((width - pad * 2) / Math.max(1, points.length - 1));
  const y = (value: number) => height - pad - (value / max) * (height - pad * 2);
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(point.balance)}`).join(" ");
  const contributed = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(point.contributed)}`).join(" ");
  const area = `${line} L${x(points.length - 1)},${height - pad} L${x(0)},${height - pad} Z`;
  const [selectedIndex, setSelectedIndex] = useState(Math.max(0, points.length - 1));
  const [pinned, setPinned] = useState(false);
  const activeIndex = Math.max(0, Math.min(points.length - 1, selectedIndex));
  const selected = points[activeIndex] ?? points.at(-1) ?? { year: 0, balance: 0, contributed: 0 };
  const earnings = selected.balance - selected.contributed;

  const selectFromClientX = (clientX: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / Math.max(1, rect.width)) * width;
    const index = Math.round(((relativeX - pad) / (width - pad * 2)) * Math.max(1, points.length - 1));
    setSelectedIndex(Math.max(0, Math.min(points.length - 1, index)));
  };

  return (
    <figure className="growth-chart">
      <div className="chart-plot">
        <button
          type="button"
          className="chart-interaction"
          aria-label="Gráfico interativo. Mova o cursor, toque ou use as setas para inspecionar cada período."
          onPointerMove={(event) => selectFromClientX(event.clientX, event.currentTarget)}
          onPointerDown={(event) => { selectFromClientX(event.clientX, event.currentTarget); setPinned(true); }}
          onPointerLeave={() => { if (!pinned) setSelectedIndex(points.length - 1); }}
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            if (event.key === "Home") setSelectedIndex(0);
            if (event.key === "End") setSelectedIndex(points.length - 1);
            if (event.key === "ArrowLeft") setSelectedIndex((current) => Math.max(0, Math.min(points.length - 1, current) - 1));
            if (event.key === "ArrowRight") setSelectedIndex((current) => Math.min(points.length - 1, current + 1));
            setPinned(true);
          }}
        >
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Evolução estimada do patrimônio e do valor aportado ao longo do tempo">
            <defs>
              <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--accent-bright)" stopOpacity=".38" /><stop offset="1" stopColor="var(--accent-bright)" stopOpacity="0" /></linearGradient>
            </defs>
            {[.25,.5,.75].map((level) => <line key={level} x1="18" x2="702" y1={height * level} y2={height * level} className="chart-gridline" />)}
            <path d={area} fill="url(#growth-fill)" />
            <path d={contributed} className="chart-contributed" />
            <path d={line} className="chart-balance" />
            <line x1={x(activeIndex)} x2={x(activeIndex)} y1={pad} y2={height - pad} className="chart-guide" />
            <circle cx={x(activeIndex)} cy={y(selected.contributed)} r="4" className="chart-dot-contributed" />
            <circle cx={x(activeIndex)} cy={y(selected.balance)} r="6" className="chart-dot" />
          </svg>
        </button>
        <figcaption><span className="legend-total" /> Patrimônio estimado <span className="legend-contributed" /> Total aportado</figcaption>
      </div>
      <aside className="chart-inspector" aria-live="polite">
        <span>{selected.year === 0 ? "Ponto de partida" : `Até o ano ${selected.year}`}</span>
        <div><small>Valor aportado</small><b>{moneyPrecise.format(selected.contributed)}</b></div>
        <div><small>Juros estimados</small><b>{moneyPrecise.format(earnings)}</b></div>
        <div className="chart-inspector-total"><small>Somatória</small><strong>{moneyPrecise.format(selected.balance)}</strong></div>
        <button type="button" onClick={() => { setPinned(false); setSelectedIndex(points.length - 1); }}>{pinned ? "Voltar ao resultado final" : "Passe pela linha ou toque"}</button>
      </aside>
    </figure>
  );
}

function CompoundTool() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(10);
  const [inflation, setInflation] = useState(4.5);
  const result = useMemo(() => simulateCompoundInterest({ initial, monthly, years, annualRate: rate, inflation }), [initial, monthly, years, rate, inflation]);

  return (
    <div className="tool-layout">
      <div className="tool-controls">
        <div className="tool-title"><span className="tool-icon"><Calculator size={19} /></span><div><h3>Juros compostos, sem truques</h3><p>Taxa anual convertida para a mensal equivalente. Aporte considerado no fim do mês.</p></div></div>
        <div className="fields-grid">
          <NumericField label="Valor inicial" value={initial} onChange={setInitial} suffix="R$" step={100} />
          <NumericField label="Aporte mensal" value={monthly} onChange={setMonthly} suffix="R$" step={50} />
          <NumericField label="Prazo" value={years} onChange={setYears} suffix="anos" min={1} max={60} />
          <NumericField label="Retorno efetivo" value={rate} onChange={setRate} suffix="% a.a." min={-99} max={100} step={0.1} />
          <NumericField label="Inflação estimada" value={inflation} onChange={setInflation} suffix="% a.a." max={50} step={0.1} />
        </div>
        <details className="formula-note"><summary>Ver premissas e fórmula</summary><p>O saldo rende mensalmente e recebe o aporte no fim de cada mês. A taxa mensal é (1 + taxa anual)<sup>1/12</sup> − 1. Valores não descontam impostos, taxas nem volatilidade.</p></details>
      </div>
      <div className="tool-result">
        <span className="result-label">Patrimônio nominal estimado</span>
        <strong>{moneyPrecise.format(result.balance)}</strong>
        <div className="result-stats">
          <div><span>Total aportado</span><b>{money.format(result.contributed)}</b></div>
          <div><span>Juros estimados</span><b>{money.format(result.earnings)}</b></div>
          <div><span>Valor real de hoje</span><b>{money.format(result.realBalance)}</b></div>
        </div>
        <GrowthChart points={result.points} />
        <p className="simulation-warning">Simulação educacional. Retornos reais variam e não acontecem em linha reta.</p>
      </div>
    </div>
  );
}

function GoalTool() {
  const [goal, setGoal] = useState(100000);
  const [initial, setInitial] = useState(5000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(8);
  const monthly = useMemo(() => monthlyContributionForGoal({ goal, initial, years, annualRate: rate }), [goal, initial, years, rate]);
  const scenarios = [Math.max(-99, rate - 3), rate, rate + 3].map((scenarioRate) => ({
    rate: scenarioRate,
    monthly: monthlyContributionForGoal({ goal, initial, years, annualRate: scenarioRate }),
  }));

  return (
    <div className="tool-layout">
      <div className="tool-controls">
        <div className="tool-title"><span className="tool-icon"><Target size={19} /></span><div><h3>Transforme uma vontade em meta</h3><p>Descubra o aporte mensal necessário e compare cenários.</p></div></div>
        <div className="fields-grid">
          <NumericField label="Valor da meta" value={goal} onChange={setGoal} suffix="R$" step={1000} />
          <NumericField label="Já tenho" value={initial} onChange={setInitial} suffix="R$" step={500} />
          <NumericField label="Prazo" value={years} onChange={setYears} suffix="anos" min={1} max={60} />
          <NumericField label="Retorno efetivo" value={rate} onChange={setRate} suffix="% a.a." min={-99} max={100} step={0.1} />
        </div>
      </div>
      <div className="tool-result goal-result">
        <span className="result-label">Aporte mensal estimado</span>
        <strong>{moneyPrecise.format(monthly)}</strong>
        <p>para buscar {money.format(goal)} em {years} {years === 1 ? "ano" : "anos"}</p>
        <div className="scenario-list">
          {scenarios.map((scenario, index) => <div key={scenario.rate}><span>{["Conservador", "Base", "Favorável"][index]} · {scenario.rate.toFixed(1)}% a.a.</span><b>{money.format(scenario.monthly)}/mês</b></div>)}
        </div>
        <p className="simulation-warning">O cenário favorável não é promessa; ele existe para revelar a sensibilidade da meta à taxa escolhida.</p>
      </div>
    </div>
  );
}

function ReserveTool() {
  const [expenses, setExpenses] = useState(3500);
  const [profile, setProfile] = useState<"stable" | "dependents" | "variable">("stable");
  const ranges = { stable: [3, 6], dependents: [6, 9], variable: [9, 12] } as const;
  const [low, high] = ranges[profile];

  return (
    <div className="tool-layout">
      <div className="tool-controls">
        <div className="tool-title"><span className="tool-icon"><Shield size={19} /></span><div><h3>Dimensione sua margem de segurança</h3><p>Uma faixa educacional baseada em despesas essenciais e estabilidade — não um número universal.</p></div></div>
        <NumericField label="Despesas essenciais por mês" value={expenses} onChange={setExpenses} suffix="R$" step={100} />
        <fieldset className="choice-group"><legend>Qual cenário mais se aproxima?</legend>
          <button className={profile === "stable" ? "active" : ""} onClick={() => setProfile("stable")}><b>Renda estável</b><span>Boa previsibilidade e poucos dependentes</span></button>
          <button className={profile === "dependents" ? "active" : ""} onClick={() => setProfile("dependents")}><b>Com dependentes</b><span>Mais responsabilidades ou proteção limitada</span></button>
          <button className={profile === "variable" ? "active" : ""} onClick={() => setProfile("variable")}><b>Renda variável</b><span>Autônomo, negócio próprio ou alta sazonalidade</span></button>
        </fieldset>
      </div>
      <div className="tool-result reserve-result">
        <span className="result-label">Faixa inicial para reflexão</span>
        <strong>{money.format(expenses * low)} <small>a</small> {money.format(expenses * high)}</strong>
        <p>equivalente a {low}–{high} meses de despesas essenciais</p>
        <div className="reserve-bars" aria-label={`Faixa de ${low} a ${high} meses`}>
          {Array.from({ length: 12 }, (_, index) => <i key={index} className={index < high ? (index < low ? "strong" : "range") : ""} />)}
        </div>
        <ul className="plain-list"><li>Separe despesas previsíveis da reserva de emergência.</li><li>Priorize liquidez, segurança e simplicidade.</li><li>Reavalie após mudanças de renda, família ou saúde.</li></ul>
      </div>
    </div>
  );
}

function useSavedSet(key: string, legacyKey?: string) {
  const [set, setSet] = useState<Set<number>>(new Set());
  useEffect(() => {
    try {
      const current = localStorage.getItem(key);
      const raw = current ?? (legacyKey ? localStorage.getItem(legacyKey) : null) ?? "[]";
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) {
        const migrated = saved.filter((value) => Number.isInteger(value));
        if (current === null && legacyKey) localStorage.setItem(key, JSON.stringify(migrated));
        queueMicrotask(() => setSet(new Set(migrated)));
      }
    } catch { /* dado inválido é ignorado */ }
  }, [key, legacyKey]);
  const update = (next: Set<number>) => {
    setSet(new Set(next));
    localStorage.setItem(key, JSON.stringify([...next].sort((a, b) => a - b)));
  };
  const toggle = (value: number) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value); else next.add(value);
    update(next);
  };
  const reset = () => update(new Set());
  return { set, toggle, reset };
}

function Challenge52() {
  const { set, toggle, reset } = useSavedSet("generoso-lab.challenge52");
  const saved = [...set].reduce((total, week) => total + amountForWeek(week), 0);
  const nextWeek = Array.from({ length: 52 }, (_, index) => index + 1).find((week) => !set.has(week));
  return (
    <div className="challenge-layout">
      <div className="challenge-summary">
        <span className="tool-icon"><Flag size={19} /></span><span className="track-eyebrow">Hábito em 52 passos</span>
        <h3>De R$ 5 a R$ 260,<br />uma semana por vez.</h3>
        <p>Na semana 1, guarde R$ 5. Some R$ 5 a cada nova semana. Ao completar as 52, o total será exatamente <b>{money.format(CHALLENGE_52_TOTAL)}</b>.</p>
        <div className="progress-number"><strong>{money.format(saved)}</strong><span>de {money.format(CHALLENGE_52_TOTAL)}</span></div>
        <div className="progress-line"><i style={{ width: `${saved / CHALLENGE_52_TOTAL * 100}%` }} /></div>
        <div className="challenge-actions">{nextWeek && <button className="button primary small" onClick={() => toggle(nextWeek)}>Concluir semana {nextWeek}</button>}<button className="text-button" onClick={reset}><RotateCcw size={14} />Recomeçar</button></div>
        <small>Seu progresso fica somente neste dispositivo.</small>
      </div>
      <div className="week-grid" aria-label="Semanas do desafio">
        {Array.from({ length: 52 }, (_, index) => index + 1).map((week) => <button key={week} className={set.has(week) ? "done" : ""} onClick={() => toggle(week)} aria-pressed={set.has(week)} aria-label={`Semana ${week}, ${money.format(amountForWeek(week))}${set.has(week) ? ", concluída" : ""}`}><span>{week}</span><b>{money.format(amountForWeek(week))}</b>{set.has(week) && <Check size={13} />}</button>)}
      </div>
    </div>
  );
}

function Plan125() {
  const { set, toggle, reset } = useSavedSet("generoso-lab.challenge125", "generoso-lab.challenge135");
  const [range, setRange] = useState(0);
  const gridSaved = [...set].reduce((total, value) => total + value, 0);
  const values = Array.from({ length: 100 }, (_, index) => range * 100 + index + 1);
  return (
    <div className="challenge-layout plan-layout">
      <div className="challenge-summary">
        <span className="tool-icon"><PiggyBank size={19} /></span><span className="track-eyebrow">Plano 125 mil</span>
        <h3>Escolha um valor.<br />Risque. Repita.</h3>
        <p>Marque cada valor de R$ 1 a R$ 500 uma vez. A grade completa soma exatamente <b>{money.format(GRID_500_TOTAL)}</b>, sem valor inicial obrigatório.</p>
        <div className="progress-number"><strong>{money.format(gridSaved)}</strong><span>de {money.format(PLAN_125_TOTAL)}</span></div>
        <div className="progress-line"><i style={{ width: `${gridSaved / PLAN_125_TOTAL * 100}%` }} /></div>
        <div className="challenge-actions"><button className="text-button" onClick={reset}><RotateCcw size={14} />Limpar grade</button></div>
        <small>Não é preciso seguir a ordem. Marque o valor que couber no dia.</small>
      </div>
      <div className="plan-grid-wrap">
        <div className="range-tabs" role="tablist" aria-label="Faixa de valores">{[0,1,2,3,4].map((group) => <button key={group} role="tab" aria-selected={range === group} className={range === group ? "active" : ""} onClick={() => setRange(group)}>{group * 100 + 1}–{group * 100 + 100}</button>)}</div>
        <div className="number-grid" aria-label={`Valores de ${values[0]} a ${values.at(-1)}`}>{values.map((value) => <button key={value} className={set.has(value) ? "done" : ""} onClick={() => toggle(value)} aria-pressed={set.has(value)}><span>{value}</span>{set.has(value) && <Check size={12} />}</button>)}</div>
        <div className="grid-footer"><span>{set.size} de 500 valores concluídos</span><b>{money.format(gridSaved)} na grade</b></div>
      </div>
    </div>
  );
}

export function ToolsLab() {
  const [active, setActive] = useState<ToolId>("juros");
  return (
    <div className="tools-shell">
      <div className="tool-tabs" role="tablist" aria-label="Ferramentas do Generoso Lab">
        {tools.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={active === id} className={active === id ? "active" : ""} onClick={() => setActive(id)}><Icon size={15} />{label}</button>)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} className="tool-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .28 }}>
          {active === "juros" && <CompoundTool />}
          {active === "meta" && <GoalTool />}
          {active === "reserva" && <ReserveTool />}
          {active === "52" && <Challenge52 />}
          {active === "125" && <Plan125 />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

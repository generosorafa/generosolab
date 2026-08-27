"use client";
/* eslint-disable @next/next/no-img-element -- logotipos pequenos e dinâmicos fornecidos pela API */

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownWideNarrow, CalendarDays, Clock3, Gauge, RefreshCw, ShieldCheck } from "lucide-react";
import { EDITORIAL_REFERENCES, orderReferencesByDistance, referenceDistance, referenceStatus } from "../lib/editorial-radar.js";
import type { MarketState, Quote } from "./use-market-data";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
const effectiveDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const effectiveMonth = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const quoteDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

const statusCopy = {
  below: { label: "Abaixo", fullLabel: "Abaixo da referência", explanation: "Mais de 5% abaixo do teto editorial." },
  near: { label: "Na faixa", fullLabel: "Próximo da referência", explanation: "Dentro da faixa de ±5% do teto editorial." },
  above: { label: "Acima", fullLabel: "Acima da referência", explanation: "Mais de 5% acima do teto editorial." },
  unavailable: { label: "Sem cotação", fullLabel: "Cotação indisponível", explanation: "Referência visível sem inventar preço atual." },
} as const;

type EditorialFilter = "all" | "stock" | "fii";

const filters: Array<{ value: EditorialFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "stock", label: "Ações" },
  { value: "fii", label: "FIIs" },
];

function CompanyLogo({ quote, symbol }: { quote?: Quote; symbol: string }) {
  return <span className="editorial-logo" aria-hidden="true"><b>{symbol.slice(0, 2)}</b>{quote?.logoUrl && <img src={quote.logoUrl} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />}</span>;
}

function formatQuoteTime(value?: string | null) {
  if (!value) return "Horário indisponível";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Horário indisponível" : quoteDate.format(parsed);
}

function formatEffectiveDate(reference: { effectiveFrom: string; effectivePrecision?: string }) {
  const date = new Date(`${reference.effectiveFrom}T12:00:00-03:00`);
  return reference.effectivePrecision === "month" ? effectiveMonth.format(date) : effectiveDate.format(date);
}

export function EditorialRadar({ market }: { market: MarketState }) {
  const { data, loading, stale, load } = market;
  const [filter, setFilter] = useState<EditorialFilter>("all");
  const [sortByDistance, setSortByDistance] = useState(true);
  const reducedMotion = useReducedMotion();
  const filteredReferences = EDITORIAL_REFERENCES.filter((reference) => filter === "all" || reference.kind === filter);
  const visibleReferences = sortByDistance ? orderReferencesByDistance(filteredReferences, data?.quotes ?? []) : filteredReferences;
  const stockCount = EDITORIAL_REFERENCES.filter(({ kind }) => kind === "stock").length;
  const fiiCount = EDITORIAL_REFERENCES.length - stockCount;

  return (
    <section className="editorial-radar-section" id="radar-editorial">
      <div className="section-shell">
        <div className="section-heading editorial-heading">
          <div><span className="kicker">Radar editorial</span><h2>Referências visíveis.<br />Decisões continuam pessoais.</h2></div>
          <div className="editorial-heading-side"><p>Compare a cotação com uma referência editorial fixa, sabendo quando cada dado foi publicado e atualizado.</p><button type="button" onClick={() => void load()} disabled={loading}><RefreshCw size={14} className={loading ? "spin" : ""} />{loading ? "Atualizando" : "Atualizar cotações"}</button></div>
        </div>

        <div className="editorial-live" aria-live="polite"><span className={`live-dot ${stale ? "stale" : ""}`} /><b>{stale ? "Exibindo o último dado válido" : "Cotações conectadas à Brapi"}</b><small>Atualização automática a cada hora enquanto o site estiver aberto</small></div>

        <div className="editorial-toolbar">
          <div className="editorial-controls">
            <div className="editorial-filters" role="group" aria-label="Filtrar o Radar Editorial">
              {filters.map(({ value, label }) => {
                const count = value === "all" ? EDITORIAL_REFERENCES.length : value === "stock" ? stockCount : fiiCount;
                return <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}><span>{label}</span><b>{count}</b></button>;
              })}
            </div>
            <button
              className="editorial-distance-sort"
              type="button"
              aria-pressed={sortByDistance}
              onClick={() => setSortByDistance((active) => !active)}
              title="Ordena do maior percentual abaixo do teto para o maior percentual acima"
            ><ArrowDownWideNarrow size={13} /><span>Mais abaixo do teto</span></button>
          </div>
          <span className="editorial-visible-count" aria-live="polite">{visibleReferences.length} {visibleReferences.length === 1 ? "ativo visível" : "ativos visíveis"}{sortByDistance ? " · maior margem primeiro" : ""}</span>
        </div>

        <div className="editorial-grid">
          {visibleReferences.map((reference, index) => {
            const quote = data?.quotes.find((item) => item.symbol === reference.symbol);
            const distance = quote ? referenceDistance(quote.price, reference.ceiling) : null;
            const status = referenceStatus(distance) as keyof typeof statusCopy;
            const statusText = statusCopy[status];
            const marker = distance === null ? 50 : ((Math.max(-20, Math.min(20, distance)) + 20) / 40) * 100;
            const distanceLabel = distance === null ? "—" : `${Math.abs(distance).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}% ${distance <= 0 ? "abaixo" : "acima"}`;
            const quotationTime = quote?.marketTime ?? data?.fetchedAt;

            return <motion.article
              id={`editorial-${reference.symbol}`}
              className={`editorial-card status-${status}`}
              key={reference.symbol}
              initial={reducedMotion ? false : { opacity: 0, y: 12, filter: "blur(3px)" }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              whileHover={reducedMotion ? undefined : { y: -3 }}
              viewport={{ once: true, amount: .18 }}
              transition={{ type: "spring", duration: .28, bounce: 0, delay: Math.min(index, 4) * .025 }}
            >
              <div className="editorial-card-top"><CompanyLogo quote={quote} symbol={reference.symbol} /><div><span>{reference.kind === "fii" ? "FII" : "Ação"} · {reference.symbol}</span><h3>{quote?.name ?? reference.company}</h3></div><b className="reference-status" title={statusText.fullLabel}>{statusText.label}</b></div>

              <div className="editorial-prices">
                <div><span>Cotação atual</span><strong>{quote ? money.format(quote.price) : "—"}</strong><small>{quote ? `${quote.change > 0 ? "+" : ""}${quote.change.toFixed(2)}% no dia` : "Aguardando API"}</small></div>
                <div><span>Preço-teto editorial</span><strong>{money.format(reference.ceiling)}</strong><small>Referência manual</small></div>
              </div>

              <div className="distance-panel">
                <div><span><Gauge size={13} />Distância até o teto</span><strong>{distanceLabel}</strong></div>
                <div className="distance-track" aria-label={distance === null ? "Distância indisponível" : `${distanceLabel} da referência editorial`}><i /><b style={{ left: `${marker}%` }} /><span className="distance-center" /></div>
                <div className="distance-scale"><span>−20%</span><span>teto</span><span>+20%</span></div>
              </div>

              <div className="editorial-dates">
                <div><Clock3 size={13} /><span>Cotação<b>{formatQuoteTime(quotationTime)}</b></span></div>
                <div><CalendarDays size={13} /><span>Vigência<b>{formatEffectiveDate(reference)}</b></span></div>
              </div>

              <div className="editorial-card-footer"><span>{statusText.explanation}</span><b>Sem sinal de compra ou venda</b></div>
            </motion.article>;
          })}
        </div>

        <div className="editorial-method"><ShieldCheck size={19} /><div><b>Como este radar deve ser lido</b><p>O preço-teto é uma referência editorial informada manualmente e não muda junto com a cotação. A API atualiza somente o preço de mercado. Ordenar pela distância mostra apenas essa diferença matemática: não classifica qualidade, risco ou atratividade e não é recomendação de compra. Uma alteração futura ganhará nova data e histórico — nunca será reescrita silenciosamente.</p></div></div>
      </div>
    </section>
  );
}

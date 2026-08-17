"use client";
/* eslint-disable @next/next/no-img-element -- logotipos pequenos e dinâmicos fornecidos pela API */

import { ArrowDown, RefreshCw, WifiOff } from "lucide-react";
import { EDITORIAL_REFERENCES } from "../lib/editorial-radar.js";
import type { MarketState, Quote } from "./use-market-data";

const price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

function QuoteLogo({ quote, symbol }: { quote?: Quote; symbol: string }) {
  return <span className="quote-logo" aria-hidden="true"><b>{symbol.slice(0, 2)}</b>{quote?.logoUrl && <img src={quote.logoUrl} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />}</span>;
}

export function MarketBoard({ market }: { market: MarketState }) {
  const { data, loading, stale, load } = market;

  return (
    <div className="market-board">
      <div className="market-label">
        <span className={`live-dot ${stale ? "stale" : ""}`} />
        <div><b>Radar de mercado</b><small>{stale ? "Último dado válido salvo" : "Cotações indicativas com atraso"}</small></div>
      </div>
      <div className="quotes-row">
        {loading && !data && Array.from({ length: 4 }, (_, index) => <div className="quote skeleton" key={index}><i /><i /></div>)}
        {!loading && !data && <div className="market-empty"><WifiOff size={15} /><span>Dados indisponíveis agora. Nenhum preço foi substituído por zero.</span></div>}
        {data && EDITORIAL_REFERENCES.map((reference) => {
          const quote = data.quotes.find((item) => item.symbol === reference.symbol);
          return <a className={`quote ${quote ? "" : "unavailable"}`} key={reference.symbol} href={`#editorial-${reference.symbol}`} aria-label={`Ver referência editorial de ${reference.symbol}`}>
            <QuoteLogo quote={quote} symbol={reference.symbol} />
            <div className="quote-company"><b>{reference.symbol}</b><small>{quote?.name ?? reference.company}</small></div>
            <div className="quote-price">{quote ? <><strong>{price.format(quote.price)}</strong><span className={quote.change > 0 ? "up" : quote.change < 0 ? "down" : ""}>{quote.change > 0 ? "+" : ""}{quote.change.toFixed(2)}%</span></> : <><strong>—</strong><span>indisponível</span></>}</div>
            <ArrowDown className="quote-jump" size={12} />
          </a>;
        })}
      </div>
      <div className="market-meta"><span>Fonte: {data?.source ?? "brapi.dev"}</span><span>cache de 1 hora</span>{data && <time dateTime={data.fetchedAt}>{new Date(data.fetchedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</time>}<button onClick={() => void load()} disabled={loading} aria-label="Atualizar cotações"><RefreshCw size={13} className={loading ? "spin" : ""} /></button></div>
    </div>
  );
}

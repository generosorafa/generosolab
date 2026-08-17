"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Quote = { symbol: string; name: string; price: number; change: number; marketTime: string | null };
type MarketPayload = { source: string; delayed?: boolean; fetchedAt: string; quotes: Quote[]; error?: string };

const price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

export function MarketBoard() {
  const [data, setData] = useState<MarketPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/market", { headers: { Accept: "application/json" } });
      const payload = await response.json() as MarketPayload;
      if (!response.ok || !payload.quotes?.length) throw new Error(payload.error ?? "Sem cotações disponíveis");
      setData(payload);
      setStale(false);
      localStorage.setItem("generoso-lab.market-cache", JSON.stringify(payload));
    } catch {
      try {
        const cached = JSON.parse(localStorage.getItem("generoso-lab.market-cache") ?? "null") as MarketPayload | null;
        if (cached?.quotes?.length) { setData(cached); setStale(true); }
      } catch { /* cache inválido é ignorado */ }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void load());
    return () => cancelAnimationFrame(frame);
  }, [load]);

  return (
    <div className="market-board">
      <div className="market-label">
        <span className={`live-dot ${stale ? "stale" : ""}`} />
        <div><b>Radar de mercado</b><small>{stale ? "Último dado válido salvo" : "Cotações indicativas com atraso"}</small></div>
      </div>
      <div className="quotes-row">
        {loading && !data && Array.from({ length: 4 }, (_, index) => <div className="quote skeleton" key={index}><i /><i /></div>)}
        {!loading && !data && <div className="market-empty"><WifiOff size={15} /><span>Dados indisponíveis agora. Nenhum preço foi substituído por zero.</span></div>}
        {data?.quotes.map((quote) => <div className="quote" key={quote.symbol}><div><b>{quote.symbol}</b><small>{quote.name}</small></div><div><strong>{price.format(quote.price)}</strong><span className={quote.change > 0 ? "up" : quote.change < 0 ? "down" : ""}>{quote.change > 0 ? "+" : ""}{quote.change.toFixed(2)}%</span></div></div>)}
      </div>
      <div className="market-meta"><span>Fonte: {data?.source ?? "brapi.dev"}</span><span>cache de 1 hora</span>{data && <time dateTime={data.fetchedAt}>{new Date(data.fetchedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</time>}<button onClick={() => void load()} disabled={loading} aria-label="Atualizar cotações"><RefreshCw size={13} className={loading ? "spin" : ""} /></button></div>
    </div>
  );
}

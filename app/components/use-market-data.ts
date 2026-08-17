"use client";

import { useCallback, useEffect, useState } from "react";

export type Quote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketTime: string | null;
  logoUrl: string | null;
};

export type MarketPayload = {
  source: string;
  delayed?: boolean;
  fetchedAt: string;
  quotes: Quote[];
  error?: string;
};

export type MarketState = {
  data: MarketPayload | null;
  loading: boolean;
  stale: boolean;
  load: () => Promise<void>;
};

declare global {
  interface Window {
    __GENEROSO_MARKET_URL__?: string;
  }
}

const CACHE_KEY = "generoso-lab.market-cache.v2";
const REFRESH_INTERVAL = 60 * 60 * 1000;

export function useMarketData(): MarketState {
  const [data, setData] = useState<MarketPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = window.__GENEROSO_MARKET_URL__ ?? "/api/market";
      const separator = endpoint.includes("?") ? "&" : "?";
      const response = await fetch(`${endpoint}${separator}v=${Date.now()}`, { headers: { Accept: "application/json" } });
      const payload = await response.json() as MarketPayload;
      if (!response.ok || !payload.quotes?.length) throw new Error(payload.error ?? "Sem cotações disponíveis");
      setData(payload);
      setStale(false);
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null") as MarketPayload | null;
        if (cached?.quotes?.length) { setData(cached); setStale(true); }
      } catch { /* cache inválido é ignorado */ }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => void load());
    const interval = window.setInterval(() => void load(), REFRESH_INTERVAL);
    return () => { cancelAnimationFrame(frame); window.clearInterval(interval); };
  }, [load]);

  return { data, loading, stale, load };
}

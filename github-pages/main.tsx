/// <reference types="vite/client" />

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LandingPreview } from "../app/components/landing-preview";
import MethodologyPage from "../app/metodologia/page";
import PrivacyPage from "../app/privacidade/page";
import TermsPage from "../app/termos/page";
import "../app/globals.css";
import "./pages.css";

window.__GENEROSO_MARKET_URL__ = `${import.meta.env.BASE_URL}market.json`;

const relativePath = window.location.pathname
  .replace(import.meta.env.BASE_URL.replace(/\/$/, ""), "")
  .replace(/^\/+|\/+$/g, "");

function CurrentPage() {
  if (relativePath === "metodologia") return <MethodologyPage />;
  if (relativePath === "privacidade") return <PrivacyPage />;
  if (relativePath === "termos") return <TermsPage />;
  return <LandingPreview />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CurrentPage />
  </StrictMode>,
);

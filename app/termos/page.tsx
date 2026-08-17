import type { Metadata } from "next";
import { LegalShell } from "../components/legal-shell";

export const metadata: Metadata = { title: "Termos de uso — Generoso Lab", description: "Limites e condições de uso do conteúdo educacional do Generoso Lab." };

export default function TermsPage() {
  return <LegalShell eyebrow="Termos de uso" title="Educação, não recomendação individual." intro="Ao usar o site, considere estes limites essenciais para interpretar ferramentas, dados e opiniões editoriais.">
    <section><h2>Natureza do conteúdo</h2><p>O Generoso Lab oferece educação financeira, simulações e opiniões editoriais gerais. Não presta consultoria, análise profissional registrada, gestão de recursos, intermediação ou recomendação individualizada de compra, venda ou manutenção de ativos.</p></section>
    <section><h2>Simulações e dados</h2><p>Resultados dependem das premissas informadas, não representam garantia e podem divergir da realidade por inflação, impostos, custos, volatilidade, atrasos de mercado e mudanças regulatórias. Cotações são indicativas, podem ter atraso e devem ser confirmadas na fonte antes de qualquer decisão.</p></section>
    <section><h2>Responsabilidade de quem usa</h2><p>Você continua responsável por verificar fontes, riscos, liquidez, custos, tributação e adequação à sua situação. Para decisões relevantes, procure profissionais habilitados quando necessário.</p></section>
    <section><h2>Conteúdo e links de terceiros</h2><p>A presença de uma fonte, empresa, influenciador ou vídeo não equivale a endosso integral. Publicidade, patrocínio ou afiliação serão identificados se existirem no futuro.</p></section>
    <p className="legal-date">Versão inicial · 17 de agosto de 2026</p>
  </LegalShell>;
}

import type { Metadata } from "next";
import { LegalShell } from "../components/legal-shell";

export const metadata: Metadata = { title: "Metodologia — Generoso Lab", description: "Critérios editoriais, cálculos, fontes e atualizações do Generoso Lab." };

export default function MethodologyPage() {
  return <LegalShell eyebrow="Metodologia" title="O raciocínio fica à vista." intro="A confiabilidade do Generoso Lab depende mais do processo verificável do que de parecer certeiro.">
    <section><h2>Camadas de informação</h2><p>Cada dossiê deverá identificar separadamente fato confirmado, fonte e data, cálculo, estimativa, cenário, hipótese, Minha leitura e risco. Mudanças relevantes ganham histórico de revisão.</p></section>
    <section><h2>Hierarquia de fontes</h2><p>Priorizamos reguladores e órgãos oficiais, documentos de Relações com Investidores, demonstrações financeiras, comunicados e dados de mercado identificados. Imprensa e conteúdo educacional entram como contexto secundário, nunca como única prova de um fato material.</p></section>
    <section><h2>Ferramentas financeiras</h2><p>Fórmulas, frequência de capitalização, momento dos aportes e limitações ficam visíveis. A calculadora converte taxa efetiva anual para a mensal equivalente por (1 + taxa anual)<sup>1/12</sup> − 1 e considera aportes no fim do mês.</p></section>
    <section><h2>Curadoria de influenciadores</h2><p>Avaliamos didática, profundidade, transparência sobre conflitos, separação entre fato e opinião, correções públicas e ausência de promessas. “Minha leitura” é opinião editorial do Generoso Lab e não substitui a análise das fontes citadas.</p></section>
    <p className="legal-date">Versão inicial · 17 de agosto de 2026</p>
  </LegalShell>;
}

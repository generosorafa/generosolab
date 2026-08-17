import type { Metadata } from "next";
import { LegalShell } from "../components/legal-shell";

export const metadata: Metadata = { title: "Privacidade — Generoso Lab", description: "Como o Generoso Lab trata dados e preferências locais." };

export default function PrivacyPage() {
  return <LegalShell eyebrow="Privacidade" title="Poucos dados. Finalidade clara." intro="A primeira versão foi desenhada para funcionar sem conta e sem enviar seus valores financeiros ao nosso servidor.">
    <section><h2>O que fica no seu dispositivo</h2><p>Tema visual, semanas concluídas, valores marcados no Plano 125 mil e o último dado de mercado válido são armazenados no localStorage do navegador. Esses registros não são sincronizados entre aparelhos e podem ser apagados ao limpar os dados do site.</p></section>
    <section><h2>O que não coletamos nesta versão</h2><p>Não há cadastro, formulário de perfil, integração bancária, publicidade personalizada ou analytics comportamental. Os valores digitados nas calculadoras são processados no navegador e não são salvos pelo Generoso Lab.</p></section>
    <section><h2>Infraestrutura e links externos</h2><p>O provedor de hospedagem pode processar endereço IP e registros técnicos mínimos para entrega, segurança e prevenção de abuso. Links para fontes, empresas ou YouTube levam a serviços com políticas próprias.</p></section>
    <section><h2>Quando isso mudar</h2><p>Qualquer futura conta, newsletter, analytics ou monetização exigirá uma revisão desta política, minimização dos dados e avisos proporcionais antes da coleta.</p></section>
    <p className="legal-date">Versão inicial · 17 de agosto de 2026</p>
  </LegalShell>;
}

"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import {
  ArrowRight, BookOpen, ChartNoAxesCombined, CheckCircle2, ChevronRight, CircleDollarSign,
  Eye, FileSearch, FlaskConical, GraduationCap, Lightbulb, Menu, Moon, Play, Scale,
  ShieldCheck, Sparkles, Sun, Telescope, WalletCards, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MarketBoard } from "./market-board";
import { ToolsLab } from "./tools-lab";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

const tracks = [
  { eyebrow: "Começar", title: "Organize antes de investir", text: "Metas, reserva, orçamento e desafios que transformam intenção em hábito.", icon: BookOpen, number: "01", href: "#jornada" },
  { eyebrow: "Analisar", title: "Entenda o que os números dizem", text: "Indicadores, empresas, riscos e contexto explicados sem sinal de compra ou venda.", icon: ChartNoAxesCombined, number: "02", href: "#dossies" },
  { eyebrow: "Aprofundar", title: "Teste hipóteses, não promessas", text: "Valuation, cenários e sensibilidade com premissas visíveis e linguagem clara.", icon: FlaskConical, number: "03", href: "#metodo" },
];

const journey = [
  { label: "Proteger", text: "Segurança e acesso", icon: ShieldCheck },
  { label: "Organizar", text: "Fluxo e dívidas", icon: WalletCards },
  { label: "Construir", text: "Reserva e metas", icon: CircleDollarSign },
  { label: "Investir", text: "Política e aportes", icon: ChartNoAxesCombined },
  { label: "Revisar", text: "Aprender e ajustar", icon: Telescope },
];

const learning = [
  { tag: "Fundamentos", title: "O dinheiro precisa de função antes de produto", text: "Separe reserva, metas de curto prazo e patrimônio de longo prazo. Misturar os três costuma gerar decisões ruins.", icon: WalletCards },
  { tag: "Risco", title: "Diversificar é reduzir dependências", text: "Quantidade de ativos não basta. Observe emissores, setores, moedas, liquidez e como cada posição reage ao mesmo choque.", icon: Scale },
  { tag: "Ações", title: "Dividendos são parte do retorno, não dinheiro grátis", text: "Distribuição, reinvestimento, dívida, qualidade do negócio e preço precisam ser lidos em conjunto.", icon: ChartNoAxesCombined },
  { tag: "Valuation", title: "Um valor justo é uma faixa de hipóteses", text: "Cenários, taxa de desconto, crescimento e margem de segurança importam mais que um número com duas casas decimais.", icon: FlaskConical },
];

const dossiers = [
  { ticker: "PETR4", name: "Petrobras", type: "Empresa cíclica", note: "Em revisão editorial" },
  { ticker: "VALE3", name: "Vale", type: "Commodities", note: "Em revisão editorial" },
  { ticker: "ITUB4", name: "Itaú Unibanco", type: "Serviços financeiros", note: "Em revisão editorial" },
];

function Brand() {
  return <a className="brand" href="#inicio" aria-label="Generoso Lab, início"><span className="brand-mark" aria-hidden="true"><i>G</i><i>L</i></span><span>Generoso <b>Lab</b></span></a>;
}

function SectionTitle({ kicker, title, text, dark = false }: { kicker: string; title: string; text: string; dark?: boolean }) {
  return <div className={`section-heading ${dark ? "on-dark" : ""}`}><div><span className="kicker">{kicker}</span><h2>{title}</h2></div><p>{text}</p></div>;
}

export function LandingPreview() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("generoso-lab.theme") as "light" | "dark" | null;
    const initial = saved ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = initial;
    queueMicrotask(() => setTheme(initial));
  }, []);

  useEffect(() => {
    let revert: (() => void) | undefined;
    void import("gsap").then(({ gsap }) => {
      const context = gsap.context(() => {
        gsap.from(".hero-animate", { opacity: 0, y: 28, duration: .9, stagger: .1, ease: "power3.out" });
        gsap.from(".hero-visual", { opacity: 0, scale: .88, duration: 1.2, delay: .22, ease: "power3.out" });
      }, rootRef);
      revert = () => context.revert();
    });
    return () => revert?.();
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("generoso-lab.theme", next);
  }

  return (
    <main ref={rootRef}>
      <header className="site-header">
        <Brand />
        <nav className={menuOpen ? "open" : ""} aria-label="Navegação principal">
          <a href="#jornada" onClick={() => setMenuOpen(false)}>Aprender</a>
          <a href="#ferramentas" onClick={() => setMenuOpen(false)}>Ferramentas</a>
          <a href="#dossies" onClick={() => setMenuOpen(false)}>Dossiês</a>
          <a href="#radar" onClick={() => setMenuOpen(false)}>Radar</a>
          <a href="#metodo" onClick={() => setMenuOpen(false)}>Método</a>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Ativar tema ${theme === "dark" ? "claro" : "escuro"}`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-noise" />
        <div className="hero-copy">
          <div className="eyebrow hero-animate"><Sparkles size={14} /> Educação financeira independente</div>
          <h1 className="hero-animate">Dinheiro com <em>método.</em><br />Investimentos com <em>contexto.</em></h1>
          <p className="hero-animate">Um laboratório gratuito para organizar sua vida financeira, estudar empresas e construir decisões mais conscientes — sem atalhos, promessas ou recomendações disfarçadas.</p>
          <div className="hero-actions hero-animate"><a className="button primary" href="#jornada">Escolha seu caminho <ArrowRight size={17} /></a><a className="button ghost" href="#ferramentas">Explorar ferramentas</a></div>
          <ul className="trust-list hero-animate" aria-label="Compromissos do Generoso Lab"><li><span />100% gratuito</li><li><span />Progresso salvo no dispositivo</li><li><span />Premissas sempre visíveis</li></ul>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <HeroScene />
          <div className="fallback-orbits"><div className="orbital orbital-a" /><div className="orbital orbital-b" /><div className="orbital orbital-c" /></div>
          <div className="core"><span>GL</span><small>LAB</small></div>
          <div className="metric metric-a"><b>52</b><span>semanas</span></div>
          <div className="metric metric-b"><b>R$ 135 mil</b><span>plano de acúmulo</span></div>
          <div className="metric metric-c"><ShieldCheck size={15} /><span>sem indicação</span></div>
        </div>
      </section>

      <div className="market-wrap"><MarketBoard /></div>

      <section className="journey-section" id="jornada">
        <SectionTitle kicker="A ordem importa" title="Antes do ativo, vem a base." text="Uma jornada pensada para reduzir ansiedade e colocar cada decisão no momento certo." />
        <div className="journey-line">
          {journey.map(({ label, text, icon: Icon }, index) => <motion.div className="journey-step" key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ delay: index * .08 }}><div className="journey-icon"><Icon size={19} /></div><span>0{index + 1}</span><b>{label}</b><small>{text}</small></motion.div>)}
        </div>
        <div className="tracks-grid">
          {tracks.map(({ eyebrow, title, text, icon: Icon, number, href }, index) => <motion.article className="track-card" key={eyebrow} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .09 }}><div className="track-top"><span>{number}</span><Icon size={22} /></div><span className="track-eyebrow">{eyebrow}</span><h3>{title}</h3><p>{text}</p><a href={href}>Explorar trilha <ArrowRight size={16} /></a></motion.article>)}
        </div>
      </section>

      <section className="tools-section" id="ferramentas"><div className="section-shell"><SectionTitle kicker="Ferramentas práticas" title="Faça o plano caber na vida real." text="Simule, compare e avance no seu ritmo. Os dados dos desafios ficam apenas no navegador deste dispositivo." dark /><ToolsLab /></div></section>

      <section className="learning-section">
        <SectionTitle kicker="Biblioteca essencial" title="Conceitos que sustentam boas decisões." text="Conteúdo original inspirado em princípios de planejamento, análise de empresas e valuation — sempre com fonte e contexto nas versões completas." />
        <div className="learning-grid">{learning.map(({ tag, title, text, icon: Icon }, index) => <motion.article key={title} className="learning-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}><div><Icon size={20} /><span>{tag}</span></div><h3>{title}</h3><p>{text}</p><button type="button" disabled>Artigo em preparação <ChevronRight size={15} /></button></motion.article>)}</div>
      </section>

      <section className="dossiers-section" id="dossies"><div className="section-shell">
        <SectionTitle kicker="Raio-X de empresas" title="Dossiês, não vereditos." text="Cada leitura separará fatos, indicadores, riscos, hipóteses e opinião editorial. Nada será apresentado como ordem de compra ou venda." />
        <div className="dossiers-grid">{dossiers.map((item, index) => <motion.article className="dossier-card" key={item.ticker} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}><div className="dossier-top"><span>{item.ticker}</span><b>Rascunho</b></div><h3>{item.name}</h3><p>{item.type}</p><div className="dossier-checks"><span><CheckCircle2 size={14} /> Fatos e fontes</span><span><CheckCircle2 size={14} /> Pontos de atenção</span><span><Eye size={14} /> Minha leitura</span></div><div className="dossier-footer"><span>{item.note}</span><button disabled aria-label={`Dossiê de ${item.name} em preparação`}><FileSearch size={17} /></button></div></motion.article>)}</div>
        <div className="editorial-rule"><Lightbulb size={19} /><div><b>Regra editorial do Lab</b><p>Preço, qualidade e risco são dimensões diferentes. O site mostrará o raciocínio e as premissas; a decisão continua sendo de quem lê.</p></div></div>
      </div></section>

      <section className="radar-section" id="radar">
        <SectionTitle kicker="Radar de conteúdo" title="Boas fontes merecem contexto." text="Vídeos e influenciadores só entram depois de uma curadoria clara: profundidade, transparência comercial, histórico de correções e separação entre educação e recomendação." />
        <div className="radar-grid">
          <article className="video-card empty-card"><div className="video-frame"><div className="play-orbit"><Play size={22} fill="currentColor" /></div><span>Vídeo da semana</span></div><div className="video-copy"><span className="track-eyebrow">Curadoria em preparação</span><h3>O primeiro vídeo será escolhido a partir dos links enviados.</h3><p>Antes de publicar, registraremos por que vale o tempo, o que é fato, o que é opinião e possíveis conflitos comerciais.</p></div></article>
          <article className="influencer-card"><div className="influencer-heading"><GraduationCap size={22} /><div><span className="track-eyebrow">Principais influenciadores</span><h3>Recomendados com critério</h3></div></div><p>Nenhum nome foi inventado. Os canais aparecerão aqui após você enviar os links do YouTube.</p><div className="influencer-slots">{["Didática e profundidade", "Transparência e conflitos", "Minha leitura do canal"].map((label, index) => <div key={label}><span>0{index + 1}</span><b>{label}</b><small>Em avaliação</small></div>)}</div><div className="my-read"><Eye size={17} /><p><b>Minha leitura</b> será a opinião editorial do Generoso Lab — sem exibir nome pessoal e sempre separada dos fatos verificáveis.</p></div></article>
        </div>
      </section>

      <section className="method-section" id="metodo">
        <div className="method-copy"><span className="kicker">Método e transparência</span><h2>Confiança não vem de parecer certeiro.<br /><em>Vem de mostrar como chegamos lá.</em></h2></div>
        <div className="method-grid"><div><span>01</span><h3>Fato</h3><p>Dado verificável, com fonte primária e data.</p></div><div><span>02</span><h3>Cálculo</h3><p>Fórmula, premissa e arredondamento visíveis.</p></div><div><span>03</span><h3>Cenário</h3><p>Hipótese educacional, nunca promessa de retorno.</p></div><div><span>04</span><h3>Minha leitura</h3><p>Opinião editorial identificada e aberta a revisão.</p></div><div><span>05</span><h3>Risco</h3><p>O que pode invalidar a tese ou mudar o resultado.</p></div></div>
      </section>

      <footer className="site-footer">
        <div className="footer-main"><Brand /><p>Educação financeira independente, ferramentas transparentes e curiosidade disciplinada.</p><a href="#inicio">Voltar ao topo ↑</a></div>
        <div className="footer-disclosure"><ShieldCheck size={18} /><p><b>Aviso importante:</b> o Generoso Lab produz conteúdo educacional e opiniões editoriais. Não presta consultoria, análise profissional registrada, gestão ou recomendação individualizada de investimentos. Rentabilidade passada não garante resultados futuros. Verifique fontes, riscos, custos e adequação à sua realidade antes de decidir.</p></div>
        <div className="footer-bottom"><span>© 2026 Generoso Lab</span><span className="footer-links"><a href="/metodologia">Metodologia</a><a href="/privacidade">Privacidade</a><a href="/termos">Termos</a></span><span>Sem anúncios · sem afiliados · sem cadastro</span></div>
      </footer>
    </main>
  );
}

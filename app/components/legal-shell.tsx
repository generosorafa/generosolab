import Link from "next/link";

export function LegalShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true"><i>G</i><i>L</i></span><span>Generoso <b>Lab</b></span></Link>
        <Link href="/">← Voltar ao site</Link>
      </header>
      <article>
        <span className="kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="legal-intro">{intro}</p>
        <div className="legal-content">{children}</div>
      </article>
    </main>
  );
}

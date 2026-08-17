import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Generoso Lab — Dinheiro com método",
  description: "Educação financeira, ferramentas e leituras independentes para decisões mais conscientes.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Generoso Lab — Dinheiro com método",
    description: "Ferramentas, educação financeira e leituras independentes para decisões mais conscientes.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/og-generoso-lab.png", width: 1743, height: 909, alt: "Generoso Lab — Dinheiro com método. Investimentos com contexto." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generoso Lab",
    description: "Dinheiro com método. Investimentos com contexto.",
    images: ["/og-generoso-lab.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3eb" },
    { media: "(prefers-color-scheme: dark)", color: "#061319" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('generoso-lab.theme');if(t)document.documentElement.dataset.theme=t}catch{}` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}

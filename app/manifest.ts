import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Generoso Lab",
    short_name: "Generoso Lab",
    description: "Educação financeira, ferramentas e leituras independentes.",
    start_url: "/",
    display: "standalone",
    background_color: "#061216",
    theme_color: "#07191d",
    lang: "pt-BR",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}

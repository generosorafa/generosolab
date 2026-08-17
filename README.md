# Generoso Lab

Portal gratuito de educação financeira, ferramentas e leituras editoriais independentes. A experiência foi redesenhada para separar fatos, cálculos, cenários, riscos e “Minha leitura” — sem sinais de compra ou venda.

## O que já existe

- home responsiva com modo claro/escuro;
- trilhas para iniciantes, intermediários e avançados;
- calculadora de juros compostos com taxa anual equivalente e valor real;
- planejador de metas com três cenários;
- estimador educacional de reserva;
- desafio de 52 semanas, de R$ 5 a R$ 260, totalizando R$ 6.890;
- Plano 135 mil: base de R$ 10.000 + grade de R$ 1 a R$ 500 = R$ 135.250;
- progresso dos desafios salvo apenas no dispositivo;
- API server-side de cotações sandbox com cache de uma hora e fallback para o último dado válido;
- estrutura de dossiês, Radar, vídeo da semana e curadoria de influenciadores;
- metodologia, termos e privacidade;
- animações leves com Motion e GSAP, além de cena Three.js carregada sob demanda em telas maiores.

## Desenvolvimento

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Validações:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm audit
```

## Arquitetura e segurança

- React 19 + vinext/Vite, preparado para Cloudflare Workers/Sites.
- Nenhum token de API é enviado ao navegador.
- A rota `/api/market` consulta apenas uma lista fixa de tickers sandbox e aplica cache de servidor.
- Falhas externas nunca viram preço zero; a interface usa o último dado válido salvo ou um estado indisponível.
- Não existe painel administrativo público nem autenticação simulada por parâmetro de URL.
- Entradas das calculadoras são processadas no cliente e não são persistidas pelo servidor.

Antes de integrar uma conta Brapi paga ou ampliar a cobertura de ativos, use segredo de ambiente no backend e rotacione qualquer token antigo que já tenha aparecido no histórico do repositório.

## Limites editoriais

O Generoso Lab é educacional. Não presta consultoria, análise profissional registrada, gestão ou recomendação individualizada. Dossiês futuros devem citar fontes primárias, datas e versões, além de identificar claramente opiniões e conflitos comerciais.

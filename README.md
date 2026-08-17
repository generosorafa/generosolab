# Generoso Lab

Portal gratuito de educação financeira, ferramentas e leituras editoriais independentes. A experiência foi redesenhada para separar fatos, cálculos, cenários, riscos e “Minha leitura” — sem sinais de compra ou venda.

## O que já existe

- home responsiva com modo claro/escuro;
- trilhas para iniciantes, intermediários e avançados;
- calculadora de juros compostos com taxa anual equivalente, valor real e inspeção do gráfico por período;
- planejador de metas com três cenários;
- estimador educacional de reserva;
- desafio de 52 semanas, de R$ 5 a R$ 260, totalizando R$ 6.890;
- Plano 125 mil: grade de R$ 1 a R$ 500 = R$ 125.250, sem valor inicial obrigatório;
- progresso dos desafios salvo apenas no dispositivo;
- API server-side de cotações sandbox com cache de uma hora e fallback para o último dado válido;
- Radar compacto com PETR4, VALE3, ITUB4 e BBAS3, logotipos e atalhos para a leitura completa;
- Radar Editorial com preços-teto datados, distância percentual e estados neutros, sem sinais de compra ou venda;
- estrutura de dossiês, Radar, vídeo da semana, curadoria de três canais e guia de uso do Investidor10;
- metodologia, termos e privacidade;
- animações leves com Motion e GSAP, além de cena Three.js carregada sob demanda em telas maiores.

## Desenvolvimento

Requer Node.js 22.13 ou superior.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Defina `BRAPI_API_TOKEN` somente no ambiente do servidor. O prefixo `NEXT_PUBLIC_` não deve ser usado porque tornaria o valor acessível ao navegador.

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
- A rota `/api/market` consulta apenas uma lista fixa de tickers, autentica a Brapi no servidor e aplica cache de uma hora.
- Falhas externas nunca viram preço zero; a interface usa o último dado válido salvo ou um estado indisponível.
- Não existe painel administrativo público nem autenticação simulada por parâmetro de URL.
- Entradas das calculadoras são processadas no cliente e não são persistidas pelo servidor.

Antes de integrar uma conta Brapi paga ou ampliar a cobertura de ativos, use segredo de ambiente no backend e rotacione qualquer token antigo que já tenha aparecido no histórico do repositório.

## Limites editoriais

O Generoso Lab é educacional. Não presta consultoria, análise profissional registrada, gestão ou recomendação individualizada. Dossiês futuros devem citar fontes primárias, datas e versões, além de identificar claramente opiniões e conflitos comerciais.

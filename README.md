# Moving — Qual é o seu ritmo de hoje?

Experiência de marca, catálogo e conversão da Moving, com abertura fornecida pelo usuário (Google Flow), fontes e imagens oficiais. Layout original; nenhum código de Moving ou Slosh foi copiado.

## Executar

Requisitos: Node.js 22.13+ e pnpm conforme `packageManager` em `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

A aplicação usa Next.js 16.3.4 App Router, React 19, TypeScript, Tailwind CSS 4, GSAP 3.15 e Lenis. O build de hospedagem usa Vinext e Cloudflare Workers. A arquitetura App Router permanece no diretório `app/`.

```sh
pnpm build
pnpm start
```

No ambiente Sites, usar os scripts e a prévia supervisionada da plataforma. Para um ambiente Next.js Node tradicional, os componentes e rotas podem ser executados com `pnpm exec next dev`; validar o build nativo com `pnpm exec next build` antes de mudar o destino de publicação.

## Organização

- `app/`: home, catálogo, 24 produtos, páginas institucionais, blog, quatro artigos, legais, 404 e APIs.
- `components/moving/`: identidade, navegação, cenas, catálogo, formulários e páginas de produto.
- `components/ui/`: primitivas acessíveis fornecidas pelo starter, utilizadas por composição.
- `data/products.ts`: modelo tipado, linhas, atributos e normalização dos registros oficiais.
- `data/products-source.json`: catálogo e destinos de compra publicados no site de origem, preservados para revisão.
- `data/assets.json`: inventário de 61 assets oficiais, URL de origem e caminho local.
- `data/articles.json`: quatro conteúdos oficiais com autoria, data e fonte.
- `data/site.ts`: identidade, origem, canais, contatos e links externos.
- `public/assets/moving/`: imagens organizadas por linha, fontes, vídeo, fotografias, banners e conteúdo social.
- `docs/`: verificações e pendências de aprovação.

## Abertura e movimento

A home foi recomposta com base na gravação de tela fornecida em 13/09/2026. Os componentes estão em `components/moving/reference-home.tsx`, com estilos próprios em `app/reference-home.css`.

1. `CinematicOpening`: filme original em tela cheia, barra completa de navegação com menu visual das seis linhas, pausa/replay e entrada na narrativa. Ao terminar, revela o primeiro capítulo se o visitante ainda estiver no início; nunca retorna um visitante que já avançou. Com movimento reduzido não há autoplay nem avanço automático.
2. `RhythmChapters`: seis cenas com fundos por sabor, título em duas escalas, embalagem oficial, frutas decorativas e informações curtas. A composição alterna esquerda/direita. Desktop ocupa 700svh; celular 720svh. Os pontos permitem navegar entre capítulos. Movimento é vinculado à rolagem e reversível; cenas inativas usam `inert` e `aria-hidden`.
3. `FlowManifesto`: tipografia “Do seu jeito. No seu tempo.” e três fotografias oficiais em composição editorial.
4. `RhythmStudio`: seletor unificado por linha e sabor, controles por teclado e swipe, embalagem com entrada/saída, atributos oficiais e links de produto/compra estáveis.
5. Catálogo, marca, comunidade, compra, conteúdo, newsletter e FAQ permanecem disponíveis abaixo; todas as páginas internas foram preservadas.

Não foram recriados rótulos ou embalagens. Um sprite de frutas foi gerado apenas como ilustração dos sabores e convertido para WebP com transparência. Ver `docs/asset-provenance.md`. Sabores da gravação sem correspondência validada no catálogo oficial não foram adicionados.

A sequência usa cenas verticais legíveis quando `prefers-reduced-motion` está ativo ou a altura da tela é menor que 620px. Abas e acordeões usam Radix; o menu usa dialog com foco contido e Escape. O vídeo possui controles de pausa/replay e botões de avanço explícitos.

## Integrações

Sem serviço conectado, as APIs retornam indisponibilidade explícita, nunca sucesso simulado. Nenhum dado é enviado a terceiros enquanto os endpoints não estiverem configurados.

Variáveis do servidor:

- `NEWSLETTER_ENDPOINT`: endpoint HTTPS que recebe POST `{email, consent}`.
- `CONTACT_ENDPOINT`: endpoint HTTPS que recebe POST `{name, email, message, consent}`.
- `FORMS_API_KEY`: token opcional de autorização dos dois formulários.
- `STORE_LOCATOR_ENDPOINT`: endpoint HTTPS consultado por GET com `cep`; resposta `{stores: [{name, address, url?}]}`.

Os formulários esperam HTTP 2xx do serviço para confirmar sucesso. O localizador distingue resultado, nenhum resultado, entrada inválida e erro. As rotas limitam os tamanhos das entradas e usam timeout. Configure o provedor de envio e as proteções operacionais adequadas ao volume real antes de ativar a captação.

Não há carrinho nem checkout próprios: os CTAs abrem os anúncios oficiais verificados por correspondência de linha. Não há preços, estoque, depoimentos, certificações ou benefícios inventados.

## Conteúdo a aprovar

Veja `docs/brand-review.md`. Ingredientes, tabela nutricional completa, conservação detalhada e avisos obrigatórios dependem de fichas técnicas por SKU. A interface indica essa ausência e oferece o canal da marca. Políticas estão marcadas para revisão. Açaí e dois vínculos inconsistentes do site de origem foram isolados, não presumidos.

## Verificação

```sh
pnpm exec tsc --noEmit
node scripts/verify-routes.mjs
node scripts/verify-handlers.mjs
```

`verify-routes` executa o Worker construído dentro do Miniflare e verifica respostas, H1, main, títulos, 404, metadados e respostas das APIs; não é um teste de navegador. `verify-handlers` testa contratos e estados de sucesso/erro com transporte simulado, sem submissões externas.

O ambiente de prévia supervisionada estava indisponível na entrega. Por isso não há alegação de teste visual desktop/mobile, console do navegador, 60fps ou nota Lighthouse. A execução do Worker, compilação, tipos e integridade de assets foram verificados. A lista de QA visual pendente está em `docs/validation.md`.

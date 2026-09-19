# Origem dos assets — revisão por gravação

## Embalagens e filme

Packshots, fontes, logo e fotografias permanecem os assets oficiais documentados em `data/assets.json`. O filme de abertura é o MP4 fornecido pelo usuário, já disponível em MP4 e WebM. A gravação de tela recebida em 13/09/2026 foi usada apenas como referência de composição e movimento; não é servida no site.

## Frutas ilustrativas

- Destino publicado: `public/assets/moving/flavors/fruit-sprite.webp`.
- Geração: ferramenta integrada image_gen; uma solicitação, sem variantes ou repetição.
- Original: 1536 × 1024 px, RGBA, seis células de 512 × 512 px. PNG original preservado no espaço de trabalho.
- Conversão para WebP: qualidade 88, dimensões e canal alfa mantidos; 294.636 bytes.
- Ordem: tangerina, limão, uva; pêssego, morangos, abacaxi.
- Uso: apenas decoração de sabores correspondentes. Não é fotografia de ingredientes efetivamente usados na formulação nem alegação nutricional. Nenhum rótulo ou recipiente foi gerado.
- Inspeção: grupos separados dentro de suas células, transparência real. Os frutos ocupam área maior que os 320 px pedidos, mas ficam dentro dos recortes de 512 px. CSS usa cada célula sem alterar a imagem do produto.

Prompt enviado à ferramenta:

> Use case: product-mockup. Asset type: decorative fruit sprite sheet for a Moving beverage website. Create ONE 1536x1024 PNG with genuine alpha transparency, no painted background. Exactly six photorealistic studio cutout fruit groups arranged in an even 3 columns by 2 rows grid. Each cell is 512x512 pixels, with its fruit group completely contained within the central 320x320 pixels of that cell, leaving at least 96 pixels of transparent margin on each side. Cell centers are (256,256), (768,256), (1280,256), (256,768), (768,768), (1280,768). Top left: one tangerine wedge with tiny green leaf. Top middle: a cut lime half with tiny green leaf. Top right: a small bunch of purple grapes. Bottom left: a peach half showing its pit. Bottom middle: a pair of strawberries. Bottom right: a pineapple wedge. Crisp juicy natural fruit textures, photorealistic studio photography, same soft top-left lighting for all six isolated objects. Keep each fruit group centered and similarly sized. No objects overlap another cell, no ground plane, no background, no drop shadows outside objects, no text, labels, grids, borders, product packaging, or watermarks. True transparent pixels surrounding each fruit are essential.

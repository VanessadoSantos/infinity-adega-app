# Infinity Adega

Aplicativo web completo para adegas aumentarem vendas com catálogo digital de cervejas, whiskies, vodkas e combos premium, pedido rápido pelo WhatsApp e suporte PWA.

## Recursos implementados
- Catálogo dinâmico de bebidas premium com produtos reais e descrições detalhadas
- Botões de pedido pelo WhatsApp com resumo de compra
- Seção de benefícios, promoções e galeria para experiência visual de alto padrão
- Service worker atualizado com cache e página offline (`offline.html`)
- Manifesto PWA completo com `scope`, `orientation` e ícones
- Painel administrativo com métricas, pedido, estoque e exclusão de itens
- Página de cliente com login, assinatura e logout
- Validação de formulários e tratamento de erros

## Como usar
1. Abra `index.html` no navegador.
2. Use o botão `Peça Agora` ou o botão verde do WhatsApp para iniciar um pedido.
3. O app funciona como PWA e mantém o conteúdo em cache.
4. No admin, acesse `admin/index.html` para gerenciar pedidos e estoque.
5. Em `admin/cliente.html`, o cliente faz login e envia interesse para assinatura.

## Estrutura do projeto
- `index.html`, `style.css`, `app.js`, `manifest.json`, `service-worker.js`, `offline.html`
- Pasta `admin/` com `index.html`, `app.js`, `cliente.html`, `cliente.js` e `style.css`
- Pasta `icons/` com ícones do PWA

## Notas técnicas
- Dados do painel são salvos em `localStorage`.
- O service worker usa estratégia de navegação com fallback para offline.
- O app é otimizado para performance e responsividade em mobile.

const WHATSAPP_NUMBER = '5511964995899';

const produtos = [
  {
    nome: 'Vinho Tinto Reserva',
    preco: 149.9,
    descricao: 'Notas de frutas vermelhas, taninos suaves e final persistente.',
    teor: '13,5%',
    safra: '2019'
  },
  {
    nome: 'Vinho Branco Chardonnay',
    preco: 109.9,
    descricao: 'Aromas frescos de maçã verde e toque amanteigado.',
    teor: '12,0%',
    safra: '2021'
  },
  {
    nome: 'Espumante Brut',
    preco: 159.9,
    descricao: 'Perlage fino e a combinação perfeita para celebrações.',
    teor: '11,5%',
    safra: '2022'
  },
  {
    nome: 'Rosé Seco',
    preco: 119.9,
    descricao: 'Delicado e frutado para momentos leves.',
    teor: '12,2%',
    safra: '2022'
  },
  {
    nome: 'Vinho do Porto',
    preco: 189.9,
    descricao: 'Doce, encorpado e ideal para sobremesas.',
    teor: '19,0%',
    safra: '2015'
  },
  {
    nome: 'Demi-Sec',
    preco: 134.9,
    descricao: 'Equilíbrio suave entre doçura e acidez.',
    teor: '12,8%',
    safra: '2020'
  }
];

const beneficios = [
  { titulo: 'Pedido rápido', detalhe: 'Faça seu pedido direto pelo WhatsApp em segundos.' },
  { titulo: 'Catálogo premium', detalhe: 'Produtos selecionados para qualidade e experiência gostosa.' },
  { titulo: 'Offline disponível', detalhe: 'O app funciona como PWA, mantendo conteúdo em cache.' }
];

function formatarPreco(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

function montarUrlWhatsApp(mensagem) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

function abrirWhatsApp(mensagem) {
  window.open(montarUrlWhatsApp(mensagem), '_blank');
}

function renderizarBeneficios() {
  const container = document.querySelector('.beneficios-grid');
  container.innerHTML = beneficios.map(item => {
    return `
      <article class="beneficio">
        <strong>${item.titulo}</strong>
        <p>${item.detalhe}</p>
      </article>
    `;
  }).join('');
}

function renderizarProdutos() {
  const container = document.querySelector('.produtos-grid');
  container.innerHTML = produtos.map(produto => {
    return `
      <article class="produto">
        <div class="produto-topo">
          <h3>${produto.nome}</h3>
          <span>${formatarPreco(produto.preco)}</span>
        </div>
        <p>${produto.descricao}</p>
        <small>Safra ${produto.safra} · ${produto.teor}</small>
        <div class="acoes">
          <button type="button" data-action="comprar" data-produto="${produto.nome}" data-preco="${produto.preco}">Comprar</button>
          <button type="button" data-action="pix" data-produto="${produto.nome}" data-preco="${produto.preco}">PIX</button>
        </div>
      </article>
    `;
  }).join('');
}

function tratarCliqueProduto(event) {
  const botao = event.target.closest('button[data-action]');
  if (!botao) return;

  const produto = botao.dataset.produto;
  const preco = Number(botao.dataset.preco);
  const acao = botao.dataset.action;

  if (acao === 'comprar') {
    abrirWhatsApp(`Quero comprar ${produto} - ${formatarPreco(preco)}`);
    return;
  }

  if (acao === 'pix') {
    abrirWhatsApp(`PIX\n${produto}\n${formatarPreco(preco)}`);
  }
}

function ativarServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => {
      console.warn('Falha ao registrar service worker:', err);
    });
  }
}

function inicializar() {
  renderizarBeneficios();
  renderizarProdutos();

  document.querySelector('.produtos').addEventListener('click', tratarCliqueProduto);
  document.getElementById('ctaBtn').addEventListener('click', () => {
    document.querySelector('.produtos').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('ctaBtnDuplicate').addEventListener('click', () => {
    document.querySelector('.produtos').scrollIntoView({ behavior: 'smooth' });
  });
  document.querySelector('.whatsapp-btn').addEventListener('click', event => {
    event.preventDefault();
    abrirWhatsApp('Olá! Quero conhecer os vinhos disponíveis.');
  });

  ativarServiceWorker();
}

document.addEventListener('DOMContentLoaded', inicializar);

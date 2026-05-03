const WHATSAPP_NUMBER = '5511964995899';

const produtos = [
  {
    nome: 'Lager Suprema',
    preco: 39.9,
    descricao: 'Cerveja leve e refrescante, perfeita para encontros e celebrações.',
    teor: '5,0%',
    safra: 'Edição Limitada'
  },
  {
    nome: 'Dark Ale Artesanal',
    preco: 44.9,
    descricao: 'Notas torradas e corpo aveludado para um sabor marcante.',
    teor: '6,8%',
    safra: 'Edição Especial'
  },
  {
    nome: 'Single Malt Highland',
    preco: 289.9,
    descricao: 'Elegância defumada com final persistente e sofisticado.',
    teor: '43,0%',
    safra: '2020'
  },
  {
    nome: 'Bourbon Legacy',
    preco: 249.9,
    descricao: 'Carvalho, mel e baunilha para uma experiência premium.',
    teor: '45,0%',
    safra: 'Reserva'
  },
  {
    nome: 'Vodka Crystal',
    preco: 129.9,
    descricao: 'Pureza cristalina ideal para coquetéis e celebrações.',
    teor: '40,0%',
    safra: 'Premium'
  },
  {
    nome: 'Vodka Limão Premium',
    preco: 139.9,
    descricao: 'Frescor cítrico com acabamento suave e elegante.',
    teor: '38,0%',
    safra: 'Edição Especial'
  }
];

const beneficios = [
  { titulo: 'Pedido rápido', detalhe: 'Faça seu pedido direto pelo WhatsApp em segundos.' },
  { titulo: 'Catálogo premium', detalhe: 'Seleção de cervejas, whiskies e vodkas premium.' },
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
    abrirWhatsApp('Olá! Quero conhecer as bebidas premium disponíveis.');
  });

  ativarServiceWorker();
}

document.addEventListener('DOMContentLoaded', inicializar);

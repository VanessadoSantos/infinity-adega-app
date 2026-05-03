const whatsappNumber = '5511964995899';

const orderForm = document.getElementById('order-form');
const produtoSelect = document.getElementById('produtoSelect');
const quantidadeInput = document.getElementById('quantidade');
const summaryEmpty = document.querySelector('.summary-empty');
const summaryDetails = document.querySelector('.summary-details');
const summaryProduct = document.getElementById('summary-product');
const summaryQuantity = document.getElementById('summary-quantity');
const summaryPrice = document.getElementById('summary-price');
const summaryTotal = document.getElementById('summary-total');
const heroButton = document.querySelector('.button-primary');
const whatsappFloat = document.getElementById('whatsappFloat');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalMessage = document.getElementById('modalMessage');
const modalWhatsappLink = document.getElementById('modalWhatsappLink');
const modalCalendarLink = document.getElementById('modalCalendarLink');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const categoriaFilter = document.getElementById('categoriaFilter');

let selectedProduct = null;

const beneficios = [
  { titulo: 'Pedido rápido', detalhe: 'Encomende suas bebidas premium em poucos passos e receba atendimento imediato no WhatsApp.' },
  { titulo: 'Seleção exclusiva', detalhe: 'Bebidas selecionadas com sofisticação para eventos, presentes e confraternizações.' },
  { titulo: 'Entrega agendada', detalhe: 'Defina data e hora para receber sua encomenda com total comodidade.' }
];

const galeriaImages = [
  'https://images.unsplash.com/photo-1510626176961-4b127d3d5f7c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1464965911861-746a04b4bca5?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80'
];

function formatarPreco(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

function renderBeneficios() {
  const container = document.querySelector('.beneficios-grid');
  container.innerHTML = beneficios.map(item => `
    <article class="beneficio card">
      <strong>${item.titulo}</strong>
      <p>${item.detalhe}</p>
    </article>
  `).join('');
}

function getProdutosFiltrados() {
  const categoria = categoriaFilter.value;
  if (!categoria) {
    return produtos;
  }
  return produtos.filter(produto => produto.categoria === categoria);
}

function renderPromocoes() {
  const container = document.querySelector('.promocoes-grid');
  const combos = produtos.filter(produto => produto.categoria === 'Combo');
  container.innerHTML = combos.map(produto => `
    <article class="product-card card">
      <div class="product-image" style="background-image:url('${produto.imagem}')"></div>
      <div class="product-content">
        <span class="product-tag">${produto.categoria}</span>
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <div class="product-price">
          <span>${formatarPreco(produto.preco)}</span>
          <button type="button" class="btn-card" data-action="select" data-id="${produto.id}">Selecionar</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderGaleria() {
  const gallery = document.querySelector('.gallery-grid');
  gallery.innerHTML = galeriaImages.map(src => `
    <div class="gallery-item" style="background-image:url('${src}')"></div>
  `).join('');
}

function renderProdutos() {
  const container = document.querySelector('.produtos-grid');
  const produtosFiltrados = getProdutosFiltrados();
  if (!produtosFiltrados.length) {
    container.innerHTML = '<div class="card">Nenhum produto encontrado.</div>';
    return;
  }
  container.innerHTML = produtosFiltrados.map(produto => `
    <article class="product-card card" data-id="${produto.id}">
      <div class="product-image" style="background-image:url('${produto.imagem}')"></div>
      <div class="product-content">
        <span class="product-tag">${produto.categoria}</span>
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <div class="product-price">
          <span>${formatarPreco(produto.preco)}</span>
          <button type="button" class="btn-card" data-action="select" data-id="${produto.id}">Selecionar</button>
        </div>
      </div>
    </article>
  `).join('');
}

function popularProdutoSelect() {
  produtoSelect.innerHTML = '<option value="">Selecione um produto</option>' + produtos.map(produto => `
    <option value="${produto.id}">${produto.nome} - ${formatarPreco(produto.preco)}</option>
  `).join('');
}

function popularCategoriaFilter() {
  const categorias = [...new Set(produtos.map(produto => produto.categoria))];
  categoriaFilter.innerHTML = '<option value="">Todas</option>' + categorias.map(categoria => `
    <option value="${categoria}">${categoria}</option>
  `).join('');
}

function atualizarResumo() {
  if (!selectedProduct) {
    summaryEmpty.classList.remove('hidden');
    summaryDetails.classList.add('hidden');
    return;
  }

  summaryEmpty.classList.add('hidden');
  summaryDetails.classList.remove('hidden');
  summaryProduct.textContent = selectedProduct.nome;
  summaryQuantity.textContent = quantidadeInput.value;
  summaryPrice.textContent = formatarPreco(selectedProduct.preco);
  summaryTotal.textContent = formatarPreco(selectedProduct.preco * Number(quantidadeInput.value));
}

function selecionarProduto(produtoId) {
  selectedProduct = produtos.find(item => item.id === produtoId) || null;
  produtoSelect.value = produtoId;
  atualizarResumo();
}

function abrirWhatsApp(mensagem) {
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

function montarMensagemPedido(dados) {
  return `Pedido Infinity Adega:\n\nCliente: ${dados.nome}\nEmail: ${dados.email}\nWhatsApp: ${dados.whatsapp}\nCEP: ${dados.cep}\nEndereço: ${dados.endereco}\nProduto: ${dados.produto.nome}\nQuantidade: ${dados.quantidade}\nTipo de entrega: ${dados.tipoEntrega}\nData de entrega: ${dados.dataEntrega}\nTotal: ${formatarPreco(dados.total)}`;
}

function gerarLinkCalendario(dados) {
  const inicio = new Date(dados.dataEntrega);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1000);
  const formatar = date => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const titulo = encodeURIComponent('Entrega Infinity Adega');
  const descricao = encodeURIComponent(`Entrega de ${dados.produto.nome} para ${dados.nome}.`);
  const local = encodeURIComponent(dados.endereco);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${formatar(inicio)}/${formatar(fim)}&details=${descricao}&location=${local}&sf=true&output=xml`;
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarWhatsApp(whatsapp) {
  return /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(whatsapp.replace(/\s/g, ''));
}

function validarCep(cep) {
  return /^\d{5}-?\d{3}$/.test(cep.replace(/\s/g, ''));
}

function validarDataEntrega(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date > new Date();
}

function abrirModal(mensagem, whatsappUrl, calendarUrl) {
  modalMessage.textContent = mensagem;
  modalWhatsappLink.href = whatsappUrl;
  modalCalendarLink.href = calendarUrl;
  modalOverlay.classList.remove('hidden');
}

function fecharModal() {
  modalOverlay.classList.add('hidden');
}

function handleOrderSubmit(event) {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const dados = {
    nome: formData.get('clienteNome').trim(),
    email: formData.get('clienteEmail').trim(),
    whatsapp: formData.get('clienteWhatsApp').trim(),
    cep: formData.get('clienteCep').trim(),
    endereco: formData.get('clienteEndereco').trim(),
    produtoId: formData.get('produtoSelect'),
    quantidade: Number(formData.get('quantidade')),
    tipoEntrega: formData.get('tipoEntrega'),
    dataEntrega: formData.get('dataEntrega')
  };

  if (!dados.nome || !dados.email || !dados.whatsapp || !dados.cep || !dados.endereco || !dados.produtoId || !dados.quantidade || !dados.tipoEntrega || !dados.dataEntrega) {
    return alert('Por favor, preencha todos os campos do formulário.');
  }

  if (!validarEmail(dados.email)) {
    return alert('Informe um email válido.');
  }

  if (!validarWhatsApp(dados.whatsapp)) {
    return alert('Informe um número de WhatsApp válido.');
  }

  if (!validarCep(dados.cep)) {
    return alert('Informe um CEP válido.');
  }

  if (!validarDataEntrega(dados.dataEntrega)) {
    return alert('Selecione uma data de entrega futura.');
  }

  const produto = produtos.find(item => item.id === dados.produtoId);
  if (!produto) {
    return alert('Selecione um produto válido.');
  }

  dados.produto = produto;
  dados.total = produto.preco * dados.quantidade;

  const mensagemPedido = montarMensagemPedido(dados);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagemPedido)}`;
  const calendarUrl = gerarLinkCalendario(dados);

  abrirModal('Seu pedido foi gerado com sucesso. Finalize no WhatsApp e adicione o evento ao seu calendário.', whatsappUrl, calendarUrl);
}

function handleProductButton(event) {
  const button = event.target.closest('[data-action="select"]');
  if (!button) return;
  const produtoId = button.dataset.id;
  selecionarProduto(produtoId);
}

function toggleMobileMenu() {
  siteNav.classList.toggle('open');
}

function fecharMenuMobile() {
  siteNav.classList.remove('open');
}

function iniciarSite() {
  renderBeneficios();
  renderGaleria();
  renderPromocoes();
  popularProdutoSelect();
  popularCategoriaFilter();
  renderProdutos();
  atualizarResumo();

  document.querySelector('.produtos-grid').addEventListener('click', handleProductButton);
  document.querySelector('.promocoes-grid').addEventListener('click', handleProductButton);
  produtoSelect.addEventListener('change', event => selecionarProduto(event.target.value));
  quantidadeInput.addEventListener('input', atualizarResumo);
  categoriaFilter.addEventListener('change', renderProdutos);
  orderForm.addEventListener('submit', handleOrderSubmit);
  heroButton.addEventListener('click', event => { event.preventDefault(); document.getElementById('encomenda').scrollIntoView({ behavior: 'smooth' }); });
  whatsappFloat.addEventListener('click', () => abrirWhatsApp('Olá! Quero fazer um pedido premium na Infinity Adega.'));
  modalClose.addEventListener('click', fecharModal);
  modalOverlay.addEventListener('click', event => { if (event.target === modalOverlay) fecharModal(); });
  navToggle.addEventListener('click', toggleMobileMenu);
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', fecharMenuMobile));

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', iniciarSite);

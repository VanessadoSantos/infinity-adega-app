let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
let estoque = JSON.parse(localStorage.getItem('estoque')) || [];

function salvarDados() {
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  localStorage.setItem('estoque', JSON.stringify(estoque));
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

function criarLinhaPedido(pedido, index) {
  return `
    <tr>
      <td>${pedido.cliente}</td>
      <td>${pedido.produto}</td>
      <td>${formatarMoeda(pedido.valor)}</td>
      <td><button type="button" class="remover-btn" data-tipo="pedido" data-index="${index}">Remover</button></td>
    </tr>
  `;
}

function criarLinhaEstoque(item, index) {
  return `
    <tr>
      <td>${item.produto}</td>
      <td>${item.qtd}</td>
      <td>${formatarMoeda(item.custo)}</td>
      <td><button type="button" class="remover-btn" data-tipo="estoque" data-index="${index}">Remover</button></td>
    </tr>
  `;
}

function atualizarResumo() {
  document.getElementById('totalPedidos').textContent = pedidos.length;
  document.getElementById('totalProdutos').textContent = estoque.reduce((total, item) => total + item.qtd, 0);
  document.getElementById('valorTotal').textContent = formatarMoeda(pedidos.reduce((total, pedido) => total + pedido.valor, 0));
}

function renderizar() {
  const listaPedidos = document.getElementById('listaPedidos');
  const listaEstoque = document.getElementById('listaEstoque');

  if (pedidos.length === 0) {
    listaPedidos.innerHTML = '<tr><td colspan="4">Nenhum pedido registrado.</td></tr>';
  } else {
    listaPedidos.innerHTML = pedidos.map(criarLinhaPedido).join('');
  }

  if (estoque.length === 0) {
    listaEstoque.innerHTML = '<tr><td colspan="4">Sem produtos em estoque.</td></tr>';
  } else {
    listaEstoque.innerHTML = estoque.map(criarLinhaEstoque).join('');
  }

  atualizarResumo();
}

function limparFormulario(form) {
  form.reset();
  form.querySelector('input')?.focus();
}

function atualizarEstoque(produto, quantidade, custo) {
  const item = estoque.find(record => record.produto.toLowerCase() === produto.toLowerCase());

  if (item) {
    item.qtd += quantidade;
    item.custo = custo;
  } else {
    estoque.push({ produto, qtd: quantidade, custo });
  }
}

function removerItem(tipo, index) {
  if (tipo === 'pedido') {
    pedidos.splice(index, 1);
  }

  if (tipo === 'estoque') {
    estoque.splice(index, 1);
  }

  salvarDados();
  renderizar();
}

function limparTodosDados() {
  if (!confirm('Deseja realmente apagar todos os pedidos e o estoque?')) {
    return;
  }

  pedidos = [];
  estoque = [];
  salvarDados();
  renderizar();
}

function handlePedidoSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const cliente = form.querySelector('[name="cliente"]').value.trim();
  const produto = form.querySelector('[name="produto"]').value.trim();
  const valor = parseFloat(form.querySelector('[name="valor"]').value);

  if (!cliente || !produto || Number.isNaN(valor) || valor <= 0) {
    return alert('Preencha todos os campos do pedido corretamente.');
  }

  const itemEstoque = estoque.find(item => item.produto.toLowerCase() === produto.toLowerCase());
  if (!itemEstoque || itemEstoque.qtd <= 0) {
    return alert('Produto sem estoque disponível.');
  }

  itemEstoque.qtd -= 1;
  pedidos.push({ cliente, produto, valor });
  salvarDados();
  renderizar();
  limparFormulario(form);
}

function handleEstoqueSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const produto = form.querySelector('[name="produtoEstoque"]').value.trim();
  const qtd = parseInt(form.querySelector('[name="qtd"]').value, 10);
  const custo = parseFloat(form.querySelector('[name="custo"]').value);

  if (!produto || Number.isNaN(qtd) || qtd <= 0 || Number.isNaN(custo) || custo < 0) {
    return alert('Preencha todos os campos de estoque corretamente.');
  }

  atualizarEstoque(produto, qtd, custo);
  salvarDados();
  renderizar();
  limparFormulario(form);
}

function handleListaClick(event) {
  const botao = event.target.closest('[data-tipo]');
  if (!botao) return;

  const tipo = botao.dataset.tipo;
  const index = Number(botao.dataset.index);

  removerItem(tipo, index);
}

function inicializarAdmin() {
  document.getElementById('formPedido').addEventListener('submit', handlePedidoSubmit);
  document.getElementById('formEstoque').addEventListener('submit', handleEstoqueSubmit);
  document.getElementById('listaPedidos').addEventListener('click', handleListaClick);
  document.getElementById('listaEstoque').addEventListener('click', handleListaClick);
  document.getElementById('limparDadosBtn').addEventListener('click', limparTodosDados);
  renderizar();
}

document.addEventListener('DOMContentLoaded', inicializarAdmin);
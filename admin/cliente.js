function atualizarUsuario(nome) {
  const userElement = document.getElementById('user');
  const statusElement = document.getElementById('status');
  const assinarBtn = document.getElementById('assinarBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (nome) {
    userElement.innerText = `Olá, ${nome}`;
    statusElement.innerText = 'Você está pronto para assinar e enviar interesse pelo WhatsApp.';
    assinarBtn.disabled = false;
    logoutBtn.disabled = false;
    return;
  }

  userElement.innerText = '';
  statusElement.innerText = 'Faça login para assinar ou enviar seu interesse.';
  assinarBtn.disabled = true;
  logoutBtn.disabled = true;
}

function login(event) {
  event.preventDefault();

  const input = document.getElementById('nome');
  const nome = input.value.trim();

  if (!nome) {
    return alert('Por favor, informe seu nome.');
  }

  localStorage.setItem('cliente', nome);
  atualizarUsuario(nome);
  input.value = '';
}

function logout() {
  localStorage.removeItem('cliente');
  atualizarUsuario(null);
}

function assinar() {
  const nome = localStorage.getItem('cliente');
  if (!nome) {
    return alert('Faça login com seu nome antes de assinar.');
  }

  const msg = `Quero assinar\n${nome}`;
  window.open(`https://wa.me/5511964995899?text=${encodeURIComponent(msg)}`, '_blank');
}

function inicializarCliente() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', login);
  document.getElementById('assinarBtn').addEventListener('click', assinar);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  atualizarUsuario(localStorage.getItem('cliente'));
}

document.addEventListener('DOMContentLoaded', inicializarCliente);
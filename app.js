// Funções de distância e frete
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calcularFrete(distancia, tipoEntrega) {
  let valorBase = 0;
  let adicionalPorKm = 0;

  if (tipoEntrega === "a_pe") { valorBase = 5; adicionalPorKm = 1; }
  if (tipoEntrega === "motoboy") { valorBase = 10; adicionalPorKm = 2; }
  if (tipoEntrega === "carro") { valorBase = 20; adicionalPorKm = 3; }

  return valorBase + (distancia * adicionalPorKm);
}

// Coordenadas da adega (exemplo: São Paulo)
const latAdega = -23.5505;
const lonAdega = -46.6333;

// Função para obter coordenadas reais via Google Maps API
async function obterCoordenadas(endereco) {
  const apiKey = "SUA_CHAVE_API_AQUI"; // substitua pela sua chave da Google Maps API
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK") {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lon: location.lng };
  } else {
    throw new Error("Endereço não encontrado");
  }
}

// Evento do formulário
document.getElementById("pedidoForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const produto = document.getElementById("produto").value;
  const tipoEntrega = document.getElementById("tipoEntrega").value;
  const endereco = document.getElementById("endereco").value;

  try {
    const coordsCliente = await obterCoordenadas(endereco);
    const distancia = calcularDistancia(latAdega, lonAdega, coordsCliente.lat, coordsCliente.lon);
    const frete = calcularFrete(distancia, tipoEntrega);

    let precoProduto = 0;
    if (produto === "vinho") precoProduto = 250;
    if (produto === "champagne") precoProduto = 450;
    if (produto === "whisky") precoProduto = 600;

    const total = precoProduto + frete;

    document.getElementById("resultadoPedido").innerHTML = `
      <h3>Resumo do Pedido</h3>
      <p>Produto: ${produto}</p>
      <p>Preço: R$ ${precoProduto.toFixed(2)}</p>
      <p>Frete (${tipoEntrega}): R$ ${frete.toFixed(2)}</p>
      <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
      <button onclick="finalizarPagamento(${total})">Finalizar Pagamento</button>
    `;
  } catch (error) {
    document.getElementById("resultadoPedido").innerHTML = `<p style="color:red;">Erro: ${error.message}</p>`;
  }
});

// Simulação de pagamento (Pix/Cartão)
function finalizarPagamento(valor) {
  document.getElementById("resultadoPedido").innerHTML += `
    <h3>Pagamento</h3>
    <p>Escolha a forma de pagamento:</p>
    <button onclick="pagarPix(${valor})">Pix</button>
    <button onclick="pagarCartao(${valor})">Cartão</button>
  `;
}

function pagarPix(valor) {
  alert("Gerando QR Code Pix para R$ " + valor.toFixed(2));
  // Aqui você pode integrar com API de pagamentos reais
}

function pagarCartao(valor) {
  alert("Abrindo checkout de cartão para R$ " + valor.toFixed(2));
  // Aqui você pode integrar com Stripe, Mercado Pago, etc.
}

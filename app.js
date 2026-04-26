function comprar(btn){
  const produto = btn.parentElement.querySelector("h3").innerText;
  const preco = btn.parentElement.querySelector("span").innerText;

  const msg = `Quero comprar ${produto} - R$ ${preco}`;
  window.open(`https://wa.me/5511964995899?text=${encodeURIComponent(msg)}`);
}

function pagarPix(produto,valor){
  const msg = `PIX\n${produto}\nR$ ${valor}`;
  window.open(`https://wa.me/5511964995899?text=${encodeURIComponent(msg)}`);
}

// SERVICE WORKER
if ('serviceWorker' in navigator){
 navigator.serviceWorker.register('service-worker.js');
}
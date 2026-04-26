let pedidos = JSON.parse(localStorage.getItem("pedidos"))||[];
let estoque = JSON.parse(localStorage.getItem("estoque"))||[];

function salvar(){
 localStorage.setItem("pedidos",JSON.stringify(pedidos));
 localStorage.setItem("estoque",JSON.stringify(estoque));
}

function render(){
 const lp = document.getElementById("listaPedidos");
 const le = document.getElementById("listaEstoque");

 lp.innerHTML="";
 le.innerHTML="";

 pedidos.forEach(p=>{
  lp.innerHTML+=`<tr><td>${p.cliente}</td><td>${p.produto}</td><td>${p.valor}</td></tr>`;
 });

 estoque.forEach(e=>{
  le.innerHTML+=`<tr><td>${e.produto}</td><td>${e.qtd}</td></tr>`;
 });
}

document.getElementById("formPedido").onsubmit=e=>{
 e.preventDefault();

 const cliente=e.target[0].value;
 const produto=e.target[1].value;
 const valor=e.target[2].value;

 const item=estoque.find(p=>p.produto===produto);

 if(!item||item.qtd<=0)return alert("Sem estoque");

 item.qtd--;

 pedidos.push({cliente,produto,valor});

 salvar();
 render();
};

document.getElementById("formEstoque").onsubmit=e=>{
 e.preventDefault();

 const produto=e.target[0].value;
 const qtd=parseInt(e.target[1].value);
 const custo=e.target[2].value;

 const item=estoque.find(p=>p.produto===produto);

 if(item) item.qtd+=qtd;
 else estoque.push({produto,qtd,custo});

 salvar();
 render();
};

render();
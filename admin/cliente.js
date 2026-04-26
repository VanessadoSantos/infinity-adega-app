function login(){
 const nome=document.getElementById("nome").value;
 localStorage.setItem("cliente",nome);
 document.getElementById("user").innerText=nome;
}

function assinar(){
 const nome=localStorage.getItem("cliente");

 const msg=`Quero assinar\n${nome}`;
 window.open(`https://wa.me/5511964995899?text=${encodeURIComponent(msg)}`);
}
const token = localStorage.getItem("token");
const usuario = JSON.parse(localStorage.getItem("usuario"));
const usuarioId = usuario.id;
const msg_user = document.querySelector(".msg_user");

msg_user.innerText = `Bem vindo, ${usuario.nome}`;
fetch(`http://localhost:3000/contas/${usuarioId}`, 
    {
        headers: 
        {
           Authorization: `Bearer ${token}`
        }
    })

.then(response => response.json())
.then(data => 
    {

        saldoReal = Number(data.conta.saldo).toLocaleString
        ('pt-BR', 
            {
            style: 'currency',
            currency: 'BRL'
            }
        );

        saldo.innerText = saldoReal;
    })

.catch(error => 
    {

        console.error("Erro:", error);

    });

const saldo = document.getElementById("saldo");
const mostrarSaldo = document.getElementById("mostrarSaldo");

let saldoReal = "";
let saldoVisivel = true;

mostrarSaldo.addEventListener("click", () => 
    {

        if(saldoVisivel)
        {
            saldo.innerText = "R$ ••••••";
            mostrarSaldo.src = "img/icone_olho_fechado.png";
            saldoVisivel = false;
        }

        else 
        {
            saldo.innerText = saldoReal;
            mostrarSaldo.src = "img/icone_olho_aberto.png";
            saldoVisivel = true;
        }
    });


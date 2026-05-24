//=================================Validação e Máscara de Formatação Valor==========================//
const inputValor = document.getElementById("valor");
const valorLimpo = document.getElementById("valorLimpo");

// Máscara de moeda + valor limpo
inputValor.addEventListener("input", () => {
    let valor = inputValor.value.replace(/\D/g, ""); //Aceita somente números
    if (valor === "") {
        inputValor.value = "";
        valorLimpo.value = "";
        return;
    }

    //Formata para moeda
    let formatado = (valor / 100).toFixed(2); 
    formatado = formatado.replace(".", ","); 
    formatado = formatado.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    inputValor.value = "R$ " + formatado;

    //Salva valor limpo sem formatação em reais
    valorLimpo.value = (valor / 100).toFixed(2);
});

// Validação extra para valor > 0
function validarValor() {
    const valor = parseFloat(valorLimpo.value);
    if (isNaN(valor) || valor <= 0) {
        alert("O valor da transferência deve ser maior que zero.");
        return false;
    }
    return true;
}
//===================================================================================================//

//=================================Validação Código de Barras========================================//
const campoCodigo = document.getElementById("codigoBarras");

campoCodigo.addEventListener("input", function() {
    // Remove qualquer caractere que não seja número
    this.value = this.value.replace(/\D/g, "");
});

document.getElementById("formulario").addEventListener("submit", function(event) {
    const codigo = campoCodigo.value;

    // Verifica se contém apenas números (já garantido pelo replace, mas reforçamos)
    const apenasNumeros = /^\d+$/.test(codigo);

    // Verifica se todos os dígitos são iguais
    const todosIguais = /^(\d)\1+$/.test(codigo);

    if (!apenasNumeros) {
        alert("O código de barras deve conter apenas números.");
        event.preventDefault();
    } else if (todosIguais) {
        alert("O código de barras não pode ter todos os números iguais.");
        event.preventDefault();
    }
});

//===================================================================================================//

//==========================Validação de Campos Vazios e Abertura de Tela Popup Senha===============//
const formulario = document.getElementById("formulario");
const popupSenha = document.getElementById("popupSenha");

formulario.addEventListener("submit", (e) => {
    e.preventDefault(); //Evita envio imediato

    // Pega os campos
    const codigo = document.getElementById("codigoBarras").value.trim();
    const valor = document.getElementById("valor").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    // Função para validar código de barras
    function validarCodigoBarras(codigo) {
        const apenasNumeros = /^\d+$/.test(codigo);
        const todosIguais = /^(\d)\1+$/.test(codigo);
        const tamanhoValido = (codigo.length === 44 || codigo.length === 48);
        return apenasNumeros && !todosIguais && tamanhoValido;
    }

    //Verifica se estão preenchidos
    if (codigo && valor && descricao) {
        const valorValido = validarValor(); // sua função já existente
        const codigoValido = validarCodigoBarras(codigo);

        if (valorValido && codigoValido) {
            popupSenha.showModal(); //Abre o popup
        } else {
            alert("O código de barras precisa ter 44 ou 48 digítos númericos");
        }
    } else {
        alert("Preencha todos os campos antes de continuar.");
    }
});

//===================================================================================================//

//========================Requisisão MySql Workbench e Backend para efetuar transferência============//
confirmarTransferencia.addEventListener("click", async () => {
    const valor = parseFloat(document.getElementById("valorLimpo").value.trim());
    const descricao = document.getElementById("descricao").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!valor || !descricao || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/transacoes/pagamento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ valor, descricao, senha })
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert(resultado.mensagem); // "Pagamento processado com sucesso!"
            popupSenha.close();
            //Redireciona para tela de extrato
            window.location.href ='../extrato/index.html'; 
        } else {
            alert("Erro: " + resultado.erro);
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Erro de conexão com o servidor.");
    }
});
//===================================================================================================//
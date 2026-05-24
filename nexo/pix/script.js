//=================================Validação e Máscara de Formatação CPF, CNPJ e E-mail===============//
const tipoChave = document.getElementById("listatipochavePix");
const inputChave = document.querySelector("input[type='text']");

tipoChave.addEventListener("change", () => {
    inputChave.value = "";
    inputChave.removeAttribute("maxlength");
    inputChave.type = "text";

    inputChave.removeEventListener("input", formatarCPF);
    inputChave.removeEventListener("input", formatarCNPJ);

    if (tipoChave.value === "cpf") {
        inputChave.setAttribute("maxlength", "14"); 
        inputChave.addEventListener("input", formatarCPF);
    } else if (tipoChave.value === "cnpj") {
        inputChave.setAttribute("maxlength", "18"); 
        inputChave.addEventListener("input", formatarCNPJ);
    } else if (tipoChave.value === "email") {
        inputChave.type = "email"; 
    }
});

// Máscara CPF
function formatarCPF(e) {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = valor;
}

// Máscara CNPJ
function formatarCNPJ(e) {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    e.target.value = valor;
}

// Validação extra para CPF/CNPJ
function validarChave() {
    const valor = inputChave.value.replace(/\D/g, "");
    if (tipoChave.value === "cpf" && valor.length === 11) {
        if (/^(\d)\1+$/.test(valor)) {
            alert("CPF inválido: todos os dígitos iguais.");
            return false;
        }
    }
    if (tipoChave.value === "cnpj" && valor.length === 14) {
        if (/^(\d)\1+$/.test(valor)) {
            alert("CNPJ inválido: todos os dígitos iguais.");
            return false;
        }
    }
    return true;
}

// Exemplo de uso na submissão do formulário
document.getElementById("formulario").addEventListener("submit", (e) => {
    if (!validarChave()) {
        e.preventDefault(); //Evita envio do formulário se for inválido
    }
});

//===================================================================================================//

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

//==========================Validação de Campos Vazios e Abertura de Tela Popup Senha===============//
const formulario = document.getElementById("formulario");
const popupSenha = document.getElementById("popupSenha");

formulario.addEventListener("submit", (e) => {
    e.preventDefault(); //Evita envio imediato

    // Pega os campos
    const tipoChave = document.getElementById("listatipochavePix").value;
    const chave = document.getElementById("insiraChave").value.trim();
    const valor = document.getElementById("valor").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    //Verifica se estão preenchidos
    if (tipoChave && chave && valor && descricao) {
        const chaveValida = validarChave();  
        const valorValido = validarValor();

        if (chaveValida && valorValido) {
            popupSenha.showModal(); //Abre o popup
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
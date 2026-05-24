//Valida Nome Completo
const nomeInput = document.getElementById("nomeCompleto"); // Seleciona o input pelo ID "nomeCompleto"
const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; //Expressão regular que aceita apenas letras acentos e espaços

// Adiciona um "ouvinte" de evento, sempre que o usuário digitar algo no campo esta função será executada
nomeInput.addEventListener("input", function () {
    
    // Verifica se o valor digitado corresponde à expressão regular e se tem pelo menos 10 caracteres
    if (regexNome.test(nomeInput.value) && nomeInput.value.trim().length >= 10) {
        
        // Se for válido, remove a classe "invalido" e adiciona a classe "valido"
        nomeInput.classList.remove("invalido");
        nomeInput.classList.add("valido");
    } else {
        // Caso contrário, remove a classe "valido" e adiciona a classe "invalido"
        nomeInput.classList.remove("valido");
        nomeInput.classList.add("invalido");
    }
});

//Função para validar Data de Nascimento
const dataInput = document.getElementById("dataNascimento"); //Seleciona o input de data

dataInput.addEventListener("input", function () {
    // Pega o valor digitado e transforma em objeto Date
    const dataValor = new Date(dataInput.value);
    const hoje = new Date();

    // Calcula idade aproximada
    let idade = hoje.getFullYear() - dataValor.getFullYear();
    const mes = hoje.getMonth() - dataValor.getMonth();

    // Ajusta idade se o mês/dia ainda não chegou
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataValor.getDate())) {
        idade--;
    }

    // Valida que a data não pode ser futura e idade >= 18
    if (dataValor <= hoje && idade >= 18) {
        dataInput.classList.remove("invalido");
        dataInput.classList.add("valido");
    } else {
        dataInput.classList.remove("valido");
        dataInput.classList.add("invalido");
    }
});

//Valida CPF
const cpfInput = document.getElementById("cpf"); //Seleciona o input de CPF

//Função para aplicar máscara automática
function aplicarMascaraCPF(valor) {
    valor = valor.replace(/\D/g, ""); //Remove tudo que não for número
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2"); //Ponto após 3 dígitos
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2"); //Outro ponto após 6 dígitos
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); //Traço antes dos 2 últimos
    return valor;
}

//Função validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove pontos e traço

    //Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    //Verifica se todos os dígitos são iguais (regex)
    if (/^(\d)\1+$/.test(cpf)) return false;

    //Se passou nas regras acima, considera válido
    return true;
}

//Evento disparado sempre que o usuário digitar
cpfInput.addEventListener("input", function () {
    //Aplica máscara automática
    cpfInput.value = aplicarMascaraCPF(cpfInput.value);

    //Valida CPF e aplica classes CSS
    if (validarCPF(cpfInput.value)) {
        cpfInput.classList.remove("invalido"); //Remove borda vermelha
        cpfInput.classList.add("valido");      //Aplica borda verde
    } else {
        cpfInput.classList.remove("valido");  //Remove borda verde
        cpfInput.classList.add("invalido");   //Aplica borda vermelha
    }
});

//Validar E-mail
const emailInput = document.getElementById("email"); //Seleciona o input de e-mail

//Expressão regular simples para validar formato de e-mail
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//Evento disparado sempre que o usuário digita no campo e-mail
emailInput.addEventListener("input", function () {
    // Testa se o valor digitado corresponde ao padrão de e-mail
    if (regexEmail.test(emailInput.value)) {
        emailInput.classList.remove("invalido"); //Remove borda vermelha
        emailInput.classList.add("valido"); //Aplica borda verde
    } else {
        emailInput.classList.remove("valido"); // Remove borda verde
        emailInput.classList.add("invalido"); //Aplica borda vermelha
    }
});

//Valida Celular
const celularInput = document.getElementById("numeroCelular"); //Seleciona o input de celular

//Função para aplicar máscara automática
function aplicarMascaraCelular(valor) {
    valor = valor.replace(/\D/g, ""); //Remove tudo que não for número

    if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else {
        valor = valor.replace(/^(\d{0,2})$/, "($1");
    }

    return valor;
}

//Função para validar celular
function validarCelular(celular) {
    celular = celular.replace(/\D/g, ""); //Só números

    //Verifica se tem 10 ou 11 dígitos
    if (celular.length < 10 || celular.length > 11) return false;

    //Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(celular)) return false;

    return true;
}

//Evento disparado sempre que o usuário digita
celularInput.addEventListener("input", function () {
    celularInput.value = aplicarMascaraCelular(celularInput.value);

    if (validarCelular(celularInput.value)) {
        celularInput.classList.remove("invalido");
        celularInput.classList.add("valido");
    } else {
        celularInput.classList.remove("valido");
        celularInput.classList.add("invalido");
    }
});

//Valida Endereço
const enderecoInput = document.getElementById("endereco"); //Seleciona o input de endereço

//Função para validar endereço
function validarEndereco(endereco) {
    // Remove espaços extras
    endereco = endereco.trim();

    //Exige pelo menos 10 caracteres e pelo menos 2 palavras
    const palavras = endereco.split(" ");
    return endereco.length >= 10 && palavras.length >= 2;
}

//Evento disparado sempre que o usuário digita
enderecoInput.addEventListener("input", function () {
    if (validarEndereco(enderecoInput.value)) {
        enderecoInput.classList.remove("invalido");
        enderecoInput.classList.add("valido");
    } else {
        enderecoInput.classList.remove("valido");
        enderecoInput.classList.add("invalido");
    }
});

//Valida Senha
const senhaInput = document.getElementById("senha"); //Seleciona o input de senha

//Função para validar senha (somente números e exatamente 6 dígitos)
function validarSenha(senha) {
    const regexSenha = /^\d{6}$/; //Apenas números, exatamente 6 dígitos
    return regexSenha.test(senha);
}

//Evento disparado sempre que o usuário digita
senhaInput.addEventListener("input", function () {
    if (validarSenha(senhaInput.value)) {
        senhaInput.classList.remove("invalido");
        senhaInput.classList.add("valido");
    } else {
        senhaInput.classList.remove("valido");
        senhaInput.classList.add("invalido");
    }
});

// Valida Confirma Senha 
document.addEventListener("DOMContentLoaded", () => {
    
    // Seleciona os campos de senha e confirma senha pelo ID
    const senha = document.getElementById("senha");
    const confirmaSenha = document.getElementById("confirmaSenha");

    // Adiciona um "ouvinte" de evento ao campo de confirmação de senha
    // O evento 'input' dispara sempre que o usuário digita ou altera algo no campo
    confirmaSenha.addEventListener("input", () => {
        
        // Verifica se o valor digitado em confirmaSenha é igual ao de senha
        // Também garante que o campo de senha não esteja vazio
        if (confirmaSenha.value === senha.value && senha.value !== "") {
            
            // Remove a classe 'invalido' caso exista
            confirmaSenha.classList.remove("invalido");
            
            // Adiciona a classe 'valido' para aplicar a formatação verde
            confirmaSenha.classList.add("valido");
        } else {
            // Caso as senhas não sejam iguais ou a senha esteja vazia:
            
            // Remove a classe 'valido' caso exista
            confirmaSenha.classList.remove("valido");
            
            // Adiciona a classe 'invalido' para aplicar a formatação vermelha
            confirmaSenha.classList.add("invalido");
        }
    });
});

//Valida Botão Avançar
const botaoAvancar = document.getElementById("botaoAvancar");
const parte1 = document.getElementById("cadastroParte1");
const parte2 = document.getElementById("cadastroParte2");

botaoAvancar.addEventListener("click", function(event) {
    event.preventDefault(); //Evita envio automático

    //Seleciona todos os inputs da primeira parte
    const inputsParte1 = parte1.querySelectorAll("input");

    //Verifica se todos os inputs possuem a classe 'valido'
    const todosValidos = Array.from(inputsParte1).every(input =>
        input.classList.contains("valido")
    );

    if (todosValidos) {
        //Se todos estiverem válidos, avança para a segunda parte
        parte1.hidden = true;
        parte2.hidden = false;
    } else {
        //Caso contrário, mantém as validações individuais e só alerta
        alert("Preencha corretamente todos os campos antes de avançar.");
    }
});

//================================== Enviar dados ao MySql Workbench ==============================================//
const formParte2 = document.getElementById("formParte2");

formParte2.addEventListener("submit", async function(event) {
    event.preventDefault(); //Evita reload da página

    //Junta os dados das duas páginas
    const dados = {
        nome: document.getElementById("nomeCompleto").value,
        dataNascimento: document.getElementById("dataNascimento").value,
        cpf: document.getElementById("cpf").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("numeroCelular").value,
        endereco: document.getElementById("endereco").value,
        senha: document.getElementById("senha").value
    };

    try {
        const resposta = await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            const resultado = await resposta.json();
            alert("✅ Cadastro realizado com sucesso!");
        
            //Redireciona para tela de login
            window.location.href ='../login/index.html'; 
        } else {
            alert("❌ Erro ao cadastrar usuário.");
        }
    } catch (erro) {
        console.error("Erro de conexão:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
});
//===============================================================================================================//

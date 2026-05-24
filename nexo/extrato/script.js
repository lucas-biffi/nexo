const API_URL = "http://localhost:3000";

async function carregarDadosContas() {
    // Captura os elementos do DOM
    const elementoSaldo = document.getElementById('saldo');
    const elementoDescricao = document.getElementById('descricao');
    const elementoData = document.getElementById('data');
    const elementoValor = document.getElementById('valor');
    const containerExtrato = document.querySelector('.boxExtrato');

    // 1. Procura a chave usuario que o formulário de login gravou
    const usuarioLocalStorage = localStorage.getItem("usuario");

    if (!usuarioLocalStorage) {
        if (elementoSaldo) elementoSaldo.textContent = "Não conectado";
        alert("Sessão não encontrada. Por favor, faça login novamente.");
        return;
    }

    try {
        // Converte o texto para objeto e extrai o ID
        const usuarioObjeto = JSON.parse(usuarioLocalStorage);
        const usuarioId = usuarioObjeto.id;

        if (!usuarioId) {
            throw new Error("ID do utilizador não encontrado no objeto de login.");
        }

        // 2. Faz a requisição exata para a rota
        const resposta = await fetch(`${API_URL}/contas/${usuarioId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            throw new Error("Erro ao comunicar com o servidor da Base de Dados.");
        }

        const dados = await resposta.json(); 

        // 3. Renderiza o Saldo recebido do controlador
        if (dados.conta && dados.conta.saldo !== undefined) {
            elementoSaldo.textContent = `R$ ${parseFloat(dados.conta.saldo).toFixed(2).replace('.', ',')}`;
        }

        // 4. Renderiza a lista de movimentações
        if (dados.extrato && dados.extrato.length > 0) {
            
            // Preenche o primeiro template fixo do HTML
            const primeiraTransacao = dados.extrato[0];
            if (elementoDescricao) elementoDescricao.textContent = primeiraTransacao.descricao;
            if (elementoData) elementoData.textContent = new Date(primeiraTransacao.data_transacao).toLocaleDateString('pt-BR');
            
            if (elementoValor) {
                const sinalPrimeiro = primeiraTransacao.tipo === "DEPOSITO" ? "+" : "-";
                elementoValor.textContent = `${sinalPrimeiro} R$ ${parseFloat(primeiraTransacao.valor).toFixed(2).replace('.', ',')}`;
            }
            
            const itemListaOriginal = document.querySelector('.listaExtrato');
            
            // Remove duplicado residuais se a página atualizar
            const clonesAntigos = document.querySelectorAll('.listaExtrato-clone');
            clonesAntigos.forEach(clone => clone.remove());

            // Loop para adicionar as transações retornadas pelo MySQL (a partir do índice 1)
            for (let i = 1; i < dados.extrato.length; i++) {
                const transacao = dados.extrato[i];
                
                // Clona a estrutura exata da li do HTML
                const novoItem = itemListaOriginal.cloneNode(true);
                novoItem.classList.add('listaExtrato-clone'); // Classe de controle
                
                // Altera o conteúdo dos nós internos do clone de forma isolada
                novoItem.querySelector('h2').textContent = transacao.descricao;
                novoItem.querySelector('p').textContent = new Date(transacao.data_transacao).toLocaleDateString('pt-BR');
                
                const sinalAtual = transacao.tipo === "DEPOSITO" ? "+" : "-";
                novoItem.querySelector('h3').textContent = `${sinalAtual} R$ ${parseFloat(transacao.valor).toFixed(2).replace('.', ',')}`;
                
                // Insere dentro do boxExtrato
                containerExtrato.appendChild(novoItem);
            }

        } else {
            // Caso não exista nenhuma movimentação na tabela
            if (elementoDescricao) elementoDescricao.textContent = "Nenhuma movimentação recente";
            if (elementoData) elementoData.textContent = "-";
            if (elementoValor) elementoValor.textContent = "R$ 0,00";
        }

    } catch (erro) {
        console.error("Detalhes do erro:", erro);
        if (elementoSaldo) elementoSaldo.textContent = "Erro de ligação";
        alert("Não foi possível carregar o extrato. Verifique se o seu servidor Node.js está a rodar.");
    }
}

// Inicializa a execução assim que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", carregarDadosContas);
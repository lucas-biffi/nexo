let currentScreen = "inicio";
let showBalance = true;
let isEditing = false;
let userData = { ...appData.usuario };
let cotacoes = { ...appData.cotacoes };
let selectedLoan = null;
let cotacoesLoading = true;
let cotacoesError = false;

// Buscar cotações reais da API
async function fetchCotacoes() {
  try {
    cotacoesLoading = true;
    cotacoesError = false;

    // Buscar Dólar
    const responseDolar = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL",
    );
    const dataDolar = await responseDolar.json();

    // Buscar Euro
    const responseEuro = await fetch(
      "https://economia.awesomeapi.com.br/json/last/EUR-BRL",
    );
    const dataEuro = await responseEuro.json();

    // Atualizar cotações
    if (dataDolar.USDBRL) {
      cotacoes.dolar.compra = parseFloat(dataDolar.USDBRL.bid);
      cotacoes.dolar.venda = parseFloat(dataDolar.USDBRL.ask);
      cotacoes.dolar.variacao = parseFloat(dataDolar.USDBRL.pctChange);
    }

    if (dataEuro.EURBRL) {
      cotacoes.euro.compra = parseFloat(dataEuro.EURBRL.bid);
      cotacoes.euro.venda = parseFloat(dataEuro.EURBRL.ask);
      cotacoes.euro.variacao = parseFloat(dataEuro.EURBRL.pctChange);
    }

    cotacoesLoading = false;

    // Atualizar tela se estiver em cotações
    if (currentScreen === "cotacoes") {
      render();
    }
  } catch (error) {
    console.error("Erro ao buscar cotações:", error);
    cotacoesLoading = false;
    cotacoesError = true;

    if (currentScreen === "cotacoes") {
      render();
    }
  }
}

// Buscar cotações ao iniciar
fetchCotacoes();

// Atualizar cotações a cada 30 segundos
setInterval(() => {
  fetchCotacoes();
}, 30000);

function navigate(screen) {
  currentScreen = screen;
  render();
}

function toggleBalance() {
  showBalance = !showBalance;
  renderCotacoes();
}

function toggleEdit() {
  isEditing = !isEditing;
  renderCotacoes();
}

function renderCotacoes() {
  const now = new Date();
  const horaAtual = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <div class="screen">
      <div class="header-gradient">
        <div class="header-top">
          <button class="header-back" onclick="navigate('cotacoes')">🔄</button>
          <h1 class="header-title">Cotações</h1>
          <button class="header-action" onclick="fetchCotacoes()" ${cotacoesLoading }>
          </button>
        </div>

        <p class="updated-text">Atualizado às ${horaAtual}</p>
      </div>

      <div class="profile-section">
        ${
          cotacoesError
            ? `
          <div class="info-box" style="background: #fee2e2; border-color: #fca5a5;">
            <p style="color: #991b1b;">❌ Erro ao carregar cotações. Verifique sua conexão com a internet.</p>
          </div>
        `
            : ""
        }
        
        ${
          cotacoesLoading
            ? `
          <div class="info-box">
            <p style="text-align: center;">⏳ Carregando cotações em tempo real...</p>
          </div>
        `
            : ""
        }
        
        <div class="cotacao-card">
          <div class="cotacao-header">
            <div class="cotacao-info">
              <div class="cotacao-icon dolar">💵</div>
              <div>
                <h3 class="cotacao-name">Dólar Americano</h3>
                <p class="cotacao-symbol">USD/BRL</p>
              </div>
            </div>
            <div class="cotacao-variacao ${cotacoes.dolar.variacao >= 0 ? "positive" : "negative"}">
              <span>${cotacoes.dolar.variacao >= 0 ? "📈" : "📉"}</span>
              <span>${Math.abs(cotacoes.dolar.variacao).toFixed(2)}%</span>
            </div>
          </div>
          <div class="cotacao-values">
            <div class="cotacao-value-box">
              <p class="cotacao-value-label">Compra</p>
              <p class="cotacao-value-amount">R$ ${cotacoes.dolar.compra.toFixed(2)}</p>
            </div>
            <div class="cotacao-value-box">
              <p class="cotacao-value-label">Venda</p>
              <p class="cotacao-value-amount">R$ ${cotacoes.dolar.venda.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div class="cotacao-card">
          <div class="cotacao-header">
            <div class="cotacao-info">
              <div class="cotacao-icon euro">💶</div>
              <div>
                <h3 class="cotacao-name">Euro</h3>
                <p class="cotacao-symbol">EUR/BRL</p>
              </div>
            </div>
            <div class="cotacao-variacao ${cotacoes.euro.variacao >= 0 ? "positive" : "negative"}">
              <span>${cotacoes.euro.variacao >= 0 ? "📈" : "📉"}</span>
              <span>${Math.abs(cotacoes.euro.variacao).toFixed(2)}%</span>
            </div>
          </div>
          <div class="cotacao-values">
            <div class="cotacao-value-box">
              <p class="cotacao-value-label">Compra</p>
              <p class="cotacao-value-amount">R$ ${cotacoes.euro.compra.toFixed(2)}</p>
            </div>
            <div class="cotacao-value-box">
              <p class="cotacao-value-label">Venda</p>
              <p class="cotacao-value-amount">R$ ${cotacoes.euro.venda.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div class="info-box">
          <p>💡 As cotações são atualizadas em tempo real e podem variar conforme o mercado.</p>
        </div>

        <br>

      <button class="btn-telaInicial" onclick="window.location.href='../telaInicial/index.html'">Voltar a tela inicial</button>

    </div>
  `;
}

function render() {
  const app = document.getElementById("app");
  let content = renderCotacoes();

  app.innerHTML = content;
}

// Inicializar app
document.addEventListener("DOMContentLoaded", () => {
  render();
});

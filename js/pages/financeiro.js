import { layoutShell } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

export function renderFinanceiro() {
  layoutShell(`
    <h2 class="section-title">Financeiro</h2>

    <!-- CARDS DE RESUMO -->
    <div class="fin-cards">
      <div class="fin-card">
        <span class="fin-title">Saldo Geral</span>
        <span id="finSaldo" class="fin-value">R$ 0,00</span>
      </div>

      <div class="fin-card green">
        <span class="fin-title">Receitas</span>
        <span id="finReceitas" class="fin-value">R$ 0,00</span>
      </div>

      <div class="fin-card red">
        <span class="fin-title">Despesas</span>
        <span id="finDespesas" class="fin-value">R$ 0,00</span>
      </div>
    </div>

    <!-- GRÁFICO -->
    <div class="fin-box">
      <canvas id="graficoFinanceiro"></canvas>
    </div>

    <!-- LISTA DE MOVIMENTOS -->
    <h3 class="section-title">Transações do mês</h3>
    <div id="finLista">Carregando...</div>

    <!-- BOTÃO FLUTUANTE -->
    <button class="fab" onclick="abrirModalFinanceiro()">+</button>

    <!-- MODAL -->
    <div id="finModal" class="fin-modal hidden">
      <div class="fin-modal-content">
        <h3>Nova Transação</h3>

        <label>Descrição</label>
        <input id="finDesc" class="form-input">

        <label>Valor</label>
        <input id="finValor" class="form-input" type="number" step="0.01">

        <label>Tipo</label>
        <select id="finTipo" class="form-input">
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <button class="btn btn-primary" onclick="salvarTransacao()">Salvar</button>
        <button class="btn btn-secondary" onclick="fecharModalFinanceiro()">Cancelar</button>

        <div id="finMsg" class="list-item-sub"></div>
      </div>
    </div>
  `, "financeiro");

  carregarDadosFinanceiros();

  // Expor funções
  window.abrirModalFinanceiro = abrirModalFinanceiro;
  window.fecharModalFinanceiro = fecharModalFinanceiro;
  window.salvarTransacao = salvarTransacao;
}

function abrirModalFinanceiro() {
  document.getElementById("finModal").classList.remove("hidden");
}

function fecharModalFinanceiro() {
  document.getElementById("finModal").classList.add("hidden");
}

async function carregarDadosFinanceiros() {
  const listaDiv = document.getElementById("finLista");

  try {
    // ====== IMPORTANTÍSSIMO ======
    // Estes endpoints você ainda vai criar no backend.
    // Posso gerar tudo depois.
    const resumo = await authFetch("/finance/summary");
    const lista = await authFetch("/finance/list");

    document.getElementById("finSaldo").innerText = formatar(resumo.saldo);
    document.getElementById("finReceitas").innerText = formatar(resumo.receitas);
    document.getElementById("finDespesas").innerText = formatar(resumo.despesas);

    // LISTAGEM
    if (!lista.length) {
      listaDiv.innerHTML = `<p class="list-item-sub">Nenhuma transação.</p>`;
    } else {
      listaDiv.innerHTML = lista
        .map(
          (t) => `
            <div class="list-item">
              <span class="list-item-title">${t.descricao}</span>
              <span class="list-item-sub ${t.tipo}">${formatar(t.valor)}</span>
            </div>
          `
        )
        .join("");
    }

    montarGrafico(resumo);

  } catch (e) {
    listaDiv.innerHTML = `<p class="list-item-sub">Erro ao carregar dados.</p>`;
  }
}

function formatar(v) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function montarGrafico(resumo) {
  const ctx = document.getElementById("graficoFinanceiro");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [
        {
          data: [resumo.receitas, resumo.despesas],
          backgroundColor: ["#1abc9c", "#e74c3c"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "65%",
      plugins: {
        legend: { display: true },
      },
    },
  });
}

async function salvarTransacao() {
  const desc = document.getElementById("finDesc").value.trim();
  const valor = Number(document.getElementById("finValor").value);
  const tipo = document.getElementById("finTipo").value;
  const msg = document.getElementById("finMsg");

  if (!desc || !valor) {
    msg.innerText = "Preencha todos os campos.";
    return;
  }

  try {
    await authFetch("/finance", {
      method: "POST",
      body: JSON.stringify({
        descricao: desc,
        valor: valor,
        tipo,
      }),
    });

    msg.innerText = "Salvo!";
    fecharModalFinanceiro();
    renderFinanceiro(); // recarrega a tela

  } catch (e) {
    msg.innerText = "Erro ao salvar.";
  }
}


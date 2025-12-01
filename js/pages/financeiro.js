import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";

export async function renderFinanceiro() {
  const html = `
    <div class="container">
      <h2>💰 Controle Financeiro</h2>

      <div class="dashboard-grid" style="margin-top: 20px;">
        <div class="card" style="border-left: 5px solid #28a745;">
          <h3>Entradas</h3>
          <div class="big-number" id="fin-entradas" style="color: #28a745">R$ 0,00</div>
        </div>
        <div class="card" style="border-left: 5px solid #dc3545;">
          <h3>Saídas</h3>
          <div class="big-number" id="fin-saidas" style="color: #dc3545">R$ 0,00</div>
        </div>
        <div class="card" style="border-left: 5px solid #007bff;">
          <h3>Saldo</h3>
          <div class="big-number" id="fin-saldo">R$ 0,00</div>
        </div>
      </div>

      <div class="card" style="margin-top: 20px;">
        <h4>Novo Lançamento</h4>
        <form id="form-financeiro" style="display: flex; gap: 15px; flex-wrap: wrap; align-items: flex-end;">
            <div style="flex: 2; min-width: 200px;">
                <label>Descrição</label>
                <input type="text" id="desc" placeholder="Ex: Consulta Maria ou Conta Luz" required style="width: 100%;">
            </div>
            <div style="flex: 1; min-width: 120px;">
                <label>Valor (R$)</label>
                <input type="number" id="valor" step="0.01" placeholder="0.00" required style="width: 100%;">
            </div>
            <div style="flex: 1; min-width: 120px;">
                <label>Tipo</label>
                <select id="tipo" style="width: 100%;">
                    <option value="entrada">Entrada (+)</option>
                    <option value="saida">Saída (-)</option>
                </select>
            </div>
            <button type="submit" class="btn-primary" style="height: 42px;">Lançar</button>
        </form>
      </div>

      <div style="margin-top: 30px;">
        <h3>Extrato</h3>
        <div style="overflow-x: auto;">
            <table width="100%">
            <thead>
                <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th style="text-align: center;">Ações</th>
                </tr>
            </thead>
            <tbody id="listaFin">
                <tr><td colspan="5" style="text-align:center; padding: 15px;">Carregando...</td></tr>
            </tbody>
            </table>
        </div>
      </div>
    </div>
  `;

  renderLayout(html);
  document.getElementById("form-financeiro").addEventListener("submit", salvarTransacao);
  await carregarExtrato();
}

async function carregarExtrato() {
    const tbody = document.getElementById("listaFin");
    try {
        const transacoes = await authFetch("/finance/");
        
        // Cálculos
        let entradas = 0;
        let saidas = 0;

        const linhas = transacoes.map(t => {
            const valorNum = parseFloat(t.amount);
            if (t.type === 'entrada') entradas += valorNum;
            else saidas += valorNum;

            const cor = t.type === 'entrada' ? 'green' : 'red';
            const sinal = t.type === 'entrada' ? '+' : '-';
            const dataFormatada = new Date(t.date).toLocaleDateString('pt-BR');

            return `
                <tr>
                    <td>${dataFormatada}</td>
                    <td>${t.description}</td>
                    <td style="color: ${cor}; font-weight: bold; text-transform: capitalize;">${t.type}</td>
                    <td style="color: ${cor};">R$ ${valorNum.toFixed(2)}</td>
                    <td style="text-align: center;">
                        <button onclick="window.deletarFin(${t.id})" style="background: none; border: none; cursor: pointer; color: #dc3545;">🗑️</button>
                    </td>
                </tr>
            `;
        }).join("");

        tbody.innerHTML = linhas.length ? linhas : '<tr><td colspan="5" style="text-align:center;">Nenhum lançamento.</td></tr>';

        // Atualiza Cards
        document.getElementById("fin-entradas").innerText = `R$ ${entradas.toFixed(2)}`;
        document.getElementById("fin-saidas").innerText = `R$ ${saidas.toFixed(2)}`;
        const saldo = entradas - saidas;
        const elSaldo = document.getElementById("fin-saldo");
        elSaldo.innerText = `R$ ${saldo.toFixed(2)}`;
        elSaldo.style.color = saldo >= 0 ? '#28a745' : '#dc3545';

    } catch (e) {
        showToast("Erro ao carregar financeiro", "error");
    }
}

async function salvarTransacao(e) {
    e.preventDefault();
    const desc = document.getElementById("desc").value;
    const valor = document.getElementById("valor").value;
    const tipo = document.getElementById("tipo").value;

    try {
        await authFetch("/finance/", {
            method: "POST",
            body: JSON.stringify({
                description: desc,
                amount: parseFloat(valor),
                type: tipo
            })
        });
        showToast("Lançamento salvo!", "success");
        document.getElementById("form-financeiro").reset();
        carregarExtrato();
    } catch (e) {
        showToast("Erro ao salvar.", "error");
    }
}

window.deletarFin = async (id) => {
    if(!confirm("Excluir lançamento?")) return;
    try {
        await authFetch(`/finance/${id}`, { method: "DELETE" });
        showToast("Excluído.", "info");
        carregarExtrato();
    } catch (e) {
        showToast("Erro ao excluir.", "error");
    }
};


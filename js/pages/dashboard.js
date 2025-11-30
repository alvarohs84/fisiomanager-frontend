import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

export async function renderDashboard() {
  renderLayout(`
    <h2 class="section-title">Dashboard</h2>

    <div class="dash-cards">
      <div class="dash-card"><span class="dash-label">Pacientes</span><span id="cardPacientes" class="dash-value">--</span></div>
      <div class="dash-card"><span class="dash-label">Evoluções</span><span id="cardEvolucoes" class="dash-value">--</span></div>
      <div class="dash-card"><span class="dash-label">Hoje</span><span id="cardAtendimentos" class="dash-value">--</span></div>
    </div>

    <div class="card">
      <h3 class="chart-title">Atendimentos na Semana</h3>
      <canvas id="grafSemanal"></canvas>
    </div>

    <div class="card">
      <h3 class="chart-title">Distribuição de Planos</h3>
      <canvas id="grafPlanos"></canvas>
    </div>
  `);

  carregarMetricas();
  carregarGraficoSemanal();
  carregarGraficoPlanos();
}

async function carregarMetricas() {
  try {
    const [p, e, h] = await Promise.all([
      authFetch("/patients"),
      authFetch("/evolutions"),
      authFetch("/appointments/today"),
    ]);

    document.getElementById("cardPacientes").innerText = p.length;
    document.getElementById("cardEvolucoes").innerText = e.length;
    document.getElementById("cardAtendimentos").innerText = h.length;

  } catch (err) {
    console.log("Erro métricas", err);
  }
}



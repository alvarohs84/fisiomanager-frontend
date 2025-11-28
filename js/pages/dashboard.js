import { layoutShell } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

export async function renderDashboard() {
  layoutShell(`
    <h2 class="section-title">Dashboard</h2>

    <!-- CARDS DE MÉTRICAS -->
    <div class="dash-cards">
      <div class="dash-card">
        <span class="dash-label">Pacientes</span>
        <span id="cardPacientes" class="dash-value">--</span>
      </div>
      <div class="dash-card">
        <span class="dash-label">Evoluções</span>
        <span id="cardEvolucoes" class="dash-value">--</span>
      </div>
      <div class="dash-card">
        <span class="dash-label">Hoje</span>
        <span id="cardAtendimentos" class="dash-value">--</span>
      </div>
    </div>

    <!-- GRÁFICOS -->
    <div class="card">
      <h3 class="chart-title">Atendimentos na Semana</h3>
      <canvas id="grafSemanal"></canvas>
    </div>

    <div class="card">
      <h3 class="chart-title">Distribuição de Planos</h3>
      <canvas id="grafPlanos"></canvas>
    </div>
  `, "dashboard");

  carregarMetricas();
  carregarGraficoSemanal();
  carregarGraficoPlanos();
}

/* =======================
   CARREGAR MÉTRICAS
======================= */
async function carregarMetricas() {
  try {
    const [pac, evo, hoje] = await Promise.all([
      authFetch("/patients"),
      authFetch("/evolutions"),
      authFetch("/appointments/today")
    ]);

    document.getElementById("cardPacientes").innerText = pac.length;
    document.getElementById("cardEvolucoes").innerText = evo.length;
    document.getElementById("cardAtendimentos").innerText = hoje.length;

  } catch (e) {
    console.log("Erro ao carregar métricas", e);
  }
}

/* =======================
   GRÁFICO DE ATENDIMENTOS
======================= */
async function carregarGraficoSemanal() {
  const ctx = document.getElementById("grafSemanal");

  // Exemplo (substitua quando tiver endpoint da semana)
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
  const valores = [3, 2, 4, 5, 6, 1, 0];

  new Chart(ctx, {
    type: "line",
    data: {
      labels: dias,
      datasets: [{
        label: "Atendimentos",
        data: valores,
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13,110,253,0.2)",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#0d6efd"
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

/* =======================
   GRÁFICO DE PLANOS
======================= */
async function carregarGraficoPlanos() {
  const ctx = document.getElementById("grafPlanos");

  try {
    const pacientes = await authFetch("/patients");

    const planos = {};
    pacientes.forEach(p => {
      planos[p.plan] = (planos[p.plan] || 0) + 1;
    });

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(planos),
        datasets: [{
          data: Object.values(planos),
          backgroundColor: ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6f42c1"]
        }]
      },
      options: { responsive: true }
    });

  } catch (e) {
    console.log("Erro gráfico de planos", e);
  }
}


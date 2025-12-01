import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

export async function renderDashboard() {
  // 1. ESTRUTURA HTML (Usando as classes do CSS novo)
  const html = `
    <div class="container">
      <h2 style="margin-bottom: 25px; color: #333;">📊 Visão Geral</h2>
      
      <div class="dashboard-grid">
        
        <div class="card">
          <h3>Pacientes Totais</h3>
          <div class="big-number" id="dash-pacientes">...</div>
        </div>

        <div class="card">
          <h3>Agendamentos Hoje</h3>
          <div class="big-number" id="dash-hoje">...</div>
        </div>

        <div class="card">
          <h3>Próximos (Futuros)</h3>
          <div class="big-number" id="dash-futuros" style="color: #007bff">...</div>
        </div>

        <div class="card">
          <h3>Faturamento (Est.)</h3>
          <div class="big-number" style="color: #28a745">R$ 0,00</div>
        </div>

      </div>

      <div class="card" style="height: 400px; position: relative;">
        <h3 style="margin-bottom: 20px;">Performance Semanal</h3>
        <div style="height: 300px; width: 100%;">
            <canvas id="graficoSemanal"></canvas>
        </div>
      </div>
    </div>
  `;
  
  // Renderiza o Layout Base
  renderLayout(html);

  // 2. BUSCAR DADOS E ATUALIZAR TELA
  await carregarMetricas();
  renderizarGrafico();
}

// --- FUNÇÃO: BUSCAR DADOS REAIS DO BACKEND ---
async function carregarMetricas() {
  try {
    // 1. Busca Pacientes
    const pacientes = await authFetch("/patients/");
    document.getElementById("dash-pacientes").innerText = pacientes.length;

    // 2. Busca Agendamentos
    const agenda = await authFetch("/appointments/");
    
    // Calcula HOJE
    const hojeData = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const agendamentosHoje = agenda.filter(appt => appt.start_time.startsWith(hojeData));
    
    // Calcula FUTUROS
    const agora = new Date();
    const futuros = agenda.filter(appt => new Date(appt.start_time) > agora);

    // Atualiza Tela
    document.getElementById("dash-hoje").innerText = agendamentosHoje.length;
    document.getElementById("dash-futuros").innerText = futuros.length;

    // (Opcional) Cálculo simples de faturamento fictício (ex: R$ 100 por consulta realizada)
    const realizados = agenda.filter(a => a.status === 'Realizado').length;
    document.getElementById("dash-futuros").parentElement.nextElementSibling.querySelector('.big-number').innerText = 
        `R$ ${realizados * 100},00`;

  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    document.getElementById("dash-pacientes").innerText = "-";
    document.getElementById("dash-hoje").innerText = "-";
  }
}

// --- FUNÇÃO: DESENHAR GRÁFICO (Chart.js) ---
function renderizarGrafico() {
  const ctx = document.getElementById('graficoSemanal');
  if (!ctx) return;

  // Destruir gráfico anterior se existir (para evitar bugs de sobreposição)
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  // Cria novo gráfico
  window.chartInstance = new Chart(ctx, {
    type: 'bar', // Tipo barra
    data: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      datasets: [{
        label: 'Atendimentos',
        data: [5, 8, 3, 10, 6, 4], // Dados fictícios (pode conectar com backend depois)
        backgroundColor: '#0056b3',
        borderRadius: 5,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false } // Esconde legenda para ficar limpo
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { borderDash: [5, 5], color: '#eee' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}


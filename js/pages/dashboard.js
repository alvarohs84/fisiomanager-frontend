import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

export async function renderDashboard() {
  const html = `
    <div class="container">
      <h2 style="margin-bottom: 25px; color: #333;">📊 Visão Geral</h2>
      
      <div class="dashboard-grid">
        <div class="card" style="border-left: 5px solid #6c757d;">
          <h3>Pacientes Totais</h3>
          <div class="big-number" id="dash-pacientes">...</div>
        </div>

        <div class="card" style="border-left: 5px solid #ffc107;">
          <h3>Agendamentos Hoje</h3>
          <div class="big-number" id="dash-hoje">...</div>
        </div>

        <div class="card" style="border-left: 5px solid #007bff;">
          <h3>Próximos (Futuros)</h3>
          <div class="big-number" id="dash-futuros">...</div>
        </div>

        <div class="card" style="border-left: 5px solid #28a745;">
          <h3>Faturamento (Est.)</h3>
          <div class="big-number" style="color: #28a745" id="dash-faturamento">R$ 0,00</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 20px;" class="split-view">
        
        <div class="card" style="min-height: 400px; padding: 20px;">
          <h3 style="margin-bottom: 20px;">Performance Semanal</h3>
          <div style="position: relative; height: 300px; width: 100%;">
              <canvas id="graficoSemanal"></canvas>
          </div>
        </div>

        <div class="card" style="min-height: 400px; padding: 20px; display: flex; flex-direction: column;">
          <h3 style="margin-bottom: 15px;">📋 Atendimentos do Mês</h3>
          <small style="color: #666; display: block; margin-bottom: 10px;">(Exclui cancelados)</small>
          
          <div style="flex: 1; overflow-y: auto;">
            <table width="100%" style="font-size: 0.9rem;">
                <tbody id="lista-top-pacientes">
                    <tr><td style="color:#777;">Calculando...</td></tr>
                </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
    
    <style>
      @media (max-width: 768px) {
        .split-view { grid-template-columns: 1fr !important; }
      }
    </style>
  `;
  
  renderLayout(html);

  await carregarMetricas();
  renderizarGrafico();
}

// --- FUNÇÃO PRINCIPAL: LÓGICA DE NEGÓCIO ---
async function carregarMetricas() {
  try {
    const pacientes = await authFetch("/patients/");
    const agenda = await authFetch("/appointments/");
    
    const agora = new Date();
    const hojeString = agora.toISOString().split('T')[0];
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    // --- CARDS DO TOPO ---
    document.getElementById("dash-pacientes").innerText = pacientes.length;

    // Apenas não cancelados contam para a operação do dia a dia
    const agendamentosValidos = agenda.filter(a => a.status !== 'Cancelado');

    const agendamentosHoje = agendamentosValidos.filter(appt => appt.start_time.startsWith(hojeString));
    document.getElementById("dash-hoje").innerText = agendamentosHoje.length;

    const futuros = agendamentosValidos.filter(appt => new Date(appt.start_time) > agora);
    document.getElementById("dash-futuros").innerText = futuros.length;

    // Faturamento Estimado (Apenas REALIZADOS contam dinheiro)
    const realizados = agenda.filter(a => a.status === 'Realizado').length;
    document.getElementById("dash-faturamento").innerText = `R$ ${realizados * 100},00`;


    // --- LISTA INTELIGENTE (PARA MENSALISTAS) ---
    
    // 1. Filtra agendamentos deste mês QUE NÃO FORAM CANCELADOS
    const atendimentosDoMes = agenda.filter(appt => {
        const dataAppt = new Date(appt.start_time);
        return dataAppt.getMonth() === mesAtual && 
               dataAppt.getFullYear() === anoAtual && 
               appt.status !== 'Cancelado'; // <--- O PULO DO GATO PARA COBRANÇA
    });

    // 2. Conta quantas vezes cada paciente aparece
    const contagem = {};
    atendimentosDoMes.forEach(appt => {
        const nome = appt.patient_name || "Desconhecido";
        contagem[nome] = (contagem[nome] || 0) + 1;
    });

    // 3. Ordena (Quem veio mais vezes fica no topo)
    const ranking = Object.entries(contagem)
        .map(([nome, qtd]) => ({ nome, qtd }))
        .sort((a, b) => b.qtd - a.qtd);

    // 4. Renderiza
    const tbodyPacientes = document.getElementById("lista-top-pacientes");
    
    if (ranking.length === 0) {
        tbodyPacientes.innerHTML = "<tr><td style='padding:10px; color:#999; text-align:center;'>Nenhum atendimento válido este mês.</td></tr>";
    } else {
        tbodyPacientes.innerHTML = ranking.map((item, index) => `
            <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 10px 0;">
                    <div style="font-weight: 600; color: #333;">${index + 1}. ${item.nome}</div>
                </td>
                <td style="text-align: right; padding: 10px 0;">
                    <span style="background: #e7f1ff; color: #0056b3; padding: 4px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: bold;">
                        ${item.qtd}
                    </span>
                </td>
            </tr>
        `).join("");
    }

  } catch (error) {
    console.error("Erro dashboard:", error);
  }
}

function renderizarGrafico() {
  const ctx = document.getElementById('graficoSemanal');
  if (!ctx) return;

  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  window.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      datasets: [{
        label: 'Atendimentos',
        data: [5, 8, 4, 10, 6, 9], // Dados de exemplo
        backgroundColor: '#0056b3',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
        x: { grid: { display: false } }
      }
    }
  });
}


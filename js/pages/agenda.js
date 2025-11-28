import { layoutShell } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

export function renderAgenda() {
  layoutShell(`
    <h2 class="section-title">Agenda</h2>

    <!-- CALENDÁRIO PREMIUM -->
    <div id="calendario" class="calendario"></div>

    <!-- LISTA DO DIA -->
    <h3 class="section-title">Atendimentos do dia</h3>
    <div id="listaDia" class="list">Carregando...</div>

    <!-- BOTÃO FLUTUANTE -->
    <button class="fab" onclick="abrirModalAgenda()">+</button>

    <!-- MODAL PARA CADASTRAR -->
    <div id="agendaModal" class="agenda-modal hidden">
      <div class="agenda-modal-content">

        <h3>Novo Atendimento</h3>

        <label>Paciente</label>
        <input id="agdNome" class="form-input" placeholder="Nome do paciente">

        <label>Horário</label>
        <input id="agdHora" class="form-input" placeholder="Ex: 14:00">

        <button class="btn btn-primary" onclick="salvarAtendimento()">Salvar</button>
        <button class="btn btn-secondary" onclick="fecharModalAgenda()">Cancelar</button>

        <div id="agdMsg" class="list-item-sub"></div>
      </div>
    </div>
  `, "agenda");

  // Variável global do dia selecionado
  window.dataSelecionada = new Date().toISOString().split("T")[0];

  montarCalendario();
  carregarAtendimentosDoDia();

  // Expor funções globais
  window.abrirModalAgenda = abrirModalAgenda;
  window.fecharModalAgenda = fecharModalAgenda;
  window.salvarAtendimento = salvarAtendimento;
}

function montarCalendario() {
  const div = document.getElementById("calendario");
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  let html = `
    <div class="cal-header">
      <span>${mesNome(mes)} ${ano}</span>
    </div>
    <div class="cal-grid">
      <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
  `;

  for (let i = 0; i < primeiroDia; i++) html += `<span></span>`;

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const data = `${ano}-${pad(mes + 1)}-${pad(dia)}`;
    const ativo = data === window.dataSelecionada ? "ativo" : "";

    html += `
      <button class="cal-dia ${ativo}" onclick="selecionarDia('${data}')">
        ${dia}
      </button>
    `;
  }

  html += "</div>";
  div.innerHTML = html;

  window.selecionarDia = (data) => {
    window.dataSelecionada = data;
    montarCalendario();
    carregarAtendimentosDoDia();
  };
}

function mesNome(m) {
  return ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][m];
}

function pad(n) { return n < 10 ? "0" + n : n; }

async function carregarAtendimentosDoDia() {
  const div = document.getElementById("listaDia");
  div.innerHTML = "Carregando...";

  try {
    const lista = await authFetch(`/appointments/by-date/${window.dataSelecionada}`);

    if (!lista.length) {
      div.innerHTML = `<p class="list-item-sub">Nenhum atendimento neste dia.</p>`;
      return;
    }

    div.innerHTML = lista.map(a => `
      <div class="list-item">
        <span class="list-item-title">${a.time} — ${a.patient_name}</span>
        <span class="list-item-sub">${a.type || "Sessão"}</span>
      </div>
    `).join("");

  } catch {
    div.innerHTML = `<p class="list-item-sub">Erro ao carregar.</p>`;
  }
}

function abrirModalAgenda() {
  document.getElementById("agendaModal").classList.remove("hidden");
}

function fecharModalAgenda() {
  document.getElementById("agendaModal").classList.add("hidden");
}

async function salvarAtendimento() {
  const nome = document.getElementById("agdNome").value.trim();
  const hora = document.getElementById("agdHora").value.trim();
  const msg = document.getElementById("agdMsg");

  if (!nome || !hora) {
    msg.textContent = "Preencha os campos.";
    return;
  }

  try {
    await authFetch("/appointments", {
      method: "POST",
      body: JSON.stringify({
        patient_name: nome,
        time: hora,
        date: window.dataSelecionada,
        type: "Sessão"
      })
    });

    msg.textContent = "Salvo!";
    fecharModalAgenda();
    carregarAtendimentosDoDia();

  } catch {
    msg.textContent = "Erro ao salvar.";
  }
}



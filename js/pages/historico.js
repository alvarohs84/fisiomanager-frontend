import { layoutShell } from "../core/layout.js";
import { authFetch, getToken } from "../core/auth.js";

// ============================
//  HISTÓRICO POR PACIENTE
// ============================

export async function renderHistorico() {
  layoutShell(`
    <h2>Histórico do Paciente</h2>

    <select id="pacienteSelect"></select>

    <button class="btn btn-primary" id="btnVer">Ver Histórico</button>

    <div id="hist-area">
      <div class="list-item-sub">Selecione um paciente...</div>
    </div>
  `, "dashboard");

  carregarPacientes();

  document.getElementById("btnVer").onclick = () => {
    const nome = document.getElementById("pacienteSelect").value;
    if (!nome) return;

    renderHistoricoPaciente(nome);
  };
}

// ============================
//  CARREGAR LISTA DE PACIENTES
// ============================

async function carregarPacientes() {
  const sel = document.getElementById("pacienteSelect");

  try {
    const pacientes = await authFetch("/patients");

    sel.innerHTML = pacientes
      .map(p => `<option value="${p.name}">${p.name}</option>`)
      .join("");

  } catch {
    sel.innerHTML = `<option>Erro ao carregar</option>`;
  }
}

// ============================
//  HISTÓRICO DO PACIENTE ESPECÍFICO
// ============================

export async function renderHistoricoPaciente(nome) {
  layoutShell(`
    <h2>Histórico de ${nome}</h2>

    <button class="btn btn-primary" id="btnPDF">📄 Baixar PDF</button>

    <h3>Evoluções</h3>
    <ul id="hist-evo" class="list">
      <li class="list-item-sub">Carregando...</li>
    </ul>

    <h3>Atendimentos</h3>
    <ul id="hist-atd" class="list">
      <li class="list-item-sub">Carregando...</li>
    </ul>

    <button class="btn btn-secondary" onclick="navigate('dashboard')">← Voltar</button>
  `, "dashboard");

  // Eventos
  document.getElementById("btnPDF").onclick = () => baixarPDF(nome);

  carregarEvolucoes(nome);
  carregarAtendimentos(nome);
}

// ============================
//  EVOLUÇÕES DO PACIENTE
// ============================

async function carregarEvolucoes(nome) {
  const ul = document.getElementById("hist-evo");

  try {
    const evolucoes = await authFetch(`/evolutions/by-patient/${nome}`);

    if (!evolucoes.length) {
      ul.innerHTML = `<li class="list-item-sub">Nenhuma evolução registrada.</li>`;
      return;
    }

    ul.innerHTML = evolucoes
      .map(
        e => `
        <li class="list-item">
          <span class="list-item-title">${e.date}</span>
          <span class="list-item-sub">${e.text}</span>
        </li>
      `
      )
      .join("");

  } catch {
    ul.innerHTML = `<li class="list-item-sub">Erro ao carregar.</li>`;
  }
}

// ============================
//  ATENDIMENTOS DO PACIENTE
// ============================

async function carregarAtendimentos(nome) {
  const ul = document.getElementById("hist-atd");

  try {
    const atendimentos = await authFetch(`/appointments/by-patient/${nome}`);

    if (!atendimentos.length) {
      ul.innerHTML = `<li class="list-item-sub">Nenhum atendimento registrado.</li>`;
      return;
    }

    ul.innerHTML = atendimentos
      .map(
        a => `
        <li class="list-item">
          <span class="list-item-title">${a.date} — ${a.time}</span>
          <span class="list-item-sub">${a.type || "Sessão"}</span>
        </li>
      `
      )
      .join("");

  } catch {
    ul.innerHTML = `<li class="list-item-sub">Erro ao carregar.</li>`;
  }
}

// ============================
//  DOWNLOAD DE PDF
// ============================

async function baixarPDF(nome) {
  try {
    const token = getToken();

    const res = await fetch(
      window.API_URL + `/pdf/historico/${nome}`,
      {
        headers: { Authorization: "Bearer " + token }
      }
    );

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `historico_${nome}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  } catch {
    alert("Erro ao gerar PDF.");
  }
}

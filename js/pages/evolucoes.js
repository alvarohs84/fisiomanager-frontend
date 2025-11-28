import { layoutShell } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

export function renderEvolucoes() {
  layoutShell(`
    <h2 class="section-title">Evoluções</h2>

    <div id="evoList" class="evo-list">Carregando...</div>

    <!-- BOTÃO FLUTUANTE PARA NOVA EVOLUÇÃO -->
    <button class="fab" onclick="abrirModalEvo()">+</button>

    <!-- MODAL PREMIUM -->
    <div id="evoModal" class="evo-modal hidden">
      <div class="evo-modal-content">

        <h3>Nova Evolução</h3>

        <label>Paciente</label>
        <select id="evoPaciente" class="form-input"></select>

        <label>Evolução</label>
        <textarea id="evoTexto" class="form-input" rows="6" placeholder="Descreva a evolução..."></textarea>

        <div id="evoContador" class="contador">0 caracteres</div>

        <button class="btn btn-primary" onclick="salvarEvo()">Salvar</button>
        <button class="btn btn-secondary" onclick="fecharModalEvo()">Cancelar</button>

        <div id="evoMsg" class="list-item-sub"></div>
      </div>
    </div>
  `, "evolucoes");

  carregarEvolucoes();
  carregarPacientes();

  window.abrirModalEvo = abrirModalEvo;
  window.fecharModalEvo = fecharModalEvo;
  window.salvarEvo = salvarEvo;
}

async function carregarEvolucoes() {
  const div = document.getElementById("evoList");
  try {
    const lista = await authFetch("/evolutions");

    if (!lista.length) {
      div.innerHTML = `<p class="list-item-sub">Nenhuma evolução registrada.</p>`;
      return;
    }

    div.innerHTML = lista.map(e => `
      <div class="evo-item">
        <div class="evo-left">
          <div class="evo-icon">📝</div>
        </div>

        <div class="evo-right">
          <div class="evo-title">
            <span>${e.patient_name}</span>
            <span class="evo-date">${e.date}</span>
          </div>
          <div class="evo-text">${e.text}</div>
        </div>
      </div>
    `).join("");

  } catch (err) {
    div.innerHTML = `<p class="list-item-sub">Erro ao carregar evoluções.</p>`;
  }
}

async function carregarPacientes() {
  const select = document.getElementById("evoPaciente");
  try {
    const lista = await authFetch("/patients");

    select.innerHTML = lista
      .map(p => `<option value="${p.name}">${p.name}</option>`)
      .join("");

  } catch (err) {
    select.innerHTML = `<option>Erro ao carregar</option>`;
  }
}

function abrirModalEvo() {
  document.getElementById("evoModal").classList.remove("hidden");
  document.getElementById("evoTexto").oninput = atualizarContador;
}

function fecharModalEvo() {
  document.getElementById("evoModal").classList.add("hidden");
}

function atualizarContador() {
  const txt = document.getElementById("evoTexto").value;
  document.getElementById("evoContador").textContent = txt.length + " caracteres";
}

async function salvarEvo() {
  const paciente = document.getElementById("evoPaciente").value;
  const texto = document.getElementById("evoTexto").value.trim();
  const msg = document.getElementById("evoMsg");

  if (!texto) {
    msg.textContent = "Digite a evolução.";
    return;
  }

  try {
    await authFetch("/evolutions", {
      method: "POST",
      body: JSON.stringify({
        patient_name: paciente,
        text: texto,
        date: new Date().toISOString().split("T")[0]
      })
    });

    msg.textContent = "Evolução salva!";
    fecharModalEvo();
    renderEvolucoes();

  } catch (err) {
    msg.textContent = "Erro ao salvar.";
  }
}


import { layoutShell } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { navigate } from "../core/router.js";

// ============================
//  TELA PRINCIPAL — LISTA
// ============================

export async function renderPacientes() {
  layoutShell(`
    <h2>Pacientes</h2>

    <button class="btn btn-primary" id="btnNew">+ Novo Paciente</button>

    <input id="search" placeholder="Buscar paciente..." />

    <div id="list-area">
      <div class="list-item-sub">Carregando...</div>
    </div>
  `, "pacientes");

  document.getElementById("btnNew").onclick = () => renderNovoPaciente();

  carregarLista();
}

async function carregarLista() {
  const area = document.getElementById("list-area");
  const search = document.getElementById("search");

  try {
    const pacientes = await authFetch("/patients");

    function montarLista(filtro = "") {
      const termo = filtro.toLowerCase();
      const lista = pacientes.filter(p =>
        p.name.toLowerCase().includes(termo)
      );

      if (!lista.length) {
        area.innerHTML = `<div class="list-item-sub">Nenhum paciente encontrado.</div>`;
        return;
      }

      area.innerHTML = `
        <ul class="list">
          ${lista
            .map(
              p => `
            <li class="list-item">
              <span class="list-item-title">${p.name}</span>
              <span class="list-item-sub">${p.plan || "Sem plano"}</span>

              <button class="btn btn-secondary" onclick="navigate('editarPaciente_${p.id}')">Editar</button>
              <button class="btn btn-danger" onclick="excluirPaciente(${p.id}, '${p.name}')">Excluir</button>
            </li>
          `
            )
            .join("")}
        </ul>
      `;
    }

    montarLista();

    search.oninput = () => montarLista(search.value);

  } catch (e) {
    area.innerHTML = `<div class="list-item-sub">Erro ao carregar pacientes.</div>`;
  }
}

// ============================
//  NOVO PACIENTE
// ============================

export function renderNovoPaciente() {
  layoutShell(`
    <h2>Novo Paciente</h2>

    <div class="card">
      <input id="nome" placeholder="Nome" />
      <input id="plano" placeholder="Plano" />

      <select id="status">
        <option value="Ativo">Ativo</option>
        <option value="Inativo">Inativo</option>
      </select>

      <button class="btn btn-primary" id="salvar">Salvar</button>
      <div id="msg" class="list-item-sub"></div>
    </div>

    <button class="btn btn-secondary" onclick="navigate('pacientes')">← Voltar</button>
  `, "pacientes");

  document.getElementById("salvar").onclick = salvarNovoPaciente;
}

async function salvarNovoPaciente() {
  const nome = document.getElementById("nome").value.trim();
  const plano = document.getElementById("plano").value.trim();
  const status = document.getElementById("status").value;
  const msg = document.getElementById("msg");

  if (!nome) {
    msg.textContent = "Nome é obrigatório.";
    return;
  }

  try {
    msg.textContent = "Salvando...";

    await authFetch("/patients", {
      method: "POST",
      body: JSON.stringify({ name: nome, plan: plano, status })
    });

    msg.textContent = "Paciente cadastrado!";
    setTimeout(() => navigate("pacientes"), 800);

  } catch (e) {
    msg.textContent = "Erro ao cadastrar.";
  }
}

// ============================
//  EDITAR PACIENTE
// ============================

export async function renderEditarPaciente(id) {
  try {
    const p = await authFetch(`/patients/${id}`);

    layoutShell(`
      <h2>Editar Paciente</h2>

      <div class="card">
        <input id="nome" value="${p.name}" />
        <input id="plano" value="${p.plan}" />

        <select id="status">
          <option value="Ativo" ${p.status === "Ativo" ? "selected" : ""}>Ativo</option>
          <option value="Inativo" ${p.status === "Inativo" ? "selected" : ""}>Inativo</option>
        </select>

        <button class="btn btn-primary" id="salvar">Salvar Alterações</button>
        <div id="msg" class="list-item-sub"></div>
      </div>

      <button class="btn btn-secondary" onclick="navigate('pacientes')">← Voltar</button>
    `, "pacientes");

    document.getElementById("salvar").onclick = () => salvarEdicao(id);

  } catch (e) {
    alert("Erro ao carregar paciente.");
    navigate("pacientes");
  }
}

async function salvarEdicao(id) {
  const nome = document.getElementById("nome").value.trim();
  const plano = document.getElementById("plano").value.trim();
  const status = document.getElementById("status").value;
  const msg = document.getElementById("msg");

  if (!nome) {
    msg.textContent = "Nome é obrigatório.";
    return;
  }

  try {
    msg.textContent = "Atualizando...";

    await authFetch(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name: nome, plan: plano, status })
    });

    msg.textContent = "Alterações salvas!";
    setTimeout(() => navigate("pacientes"), 800);

  } catch (e) {
    msg.textContent = "Erro ao atualizar.";
  }
}

// ============================
//  EXCLUIR
// ============================

window.excluirPaciente = async function (id, nome) {
  if (!confirm(`Excluir o paciente:\n\n${nome}?`)) return;

  try {
    await authFetch(`/patients/${id}`, { method: "DELETE" });
    alert("Paciente excluído.");
    navigate("pacientes");
  } catch (e) {
    alert("Erro ao excluir.");
  }
};

// ============================
// REGISTRO DE ROTAS NO ROUTER
// (IMPORTANTE!)
// ============================

window.addEventListener("load", () => {
  window["editarPaciente_"] = renderEditarPaciente;
});

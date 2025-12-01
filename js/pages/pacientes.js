import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js"; // <--- IMPORTAMOS O NOVO ARQUIVO

export async function renderPacientes() {
  const html = `
    <div class="container">
      <h2>📂 Gestão de Pacientes</h2>
      
      <div class="card">
        <h4 style="margin-bottom: 15px;">Novo Paciente</h4>
        <form id="form-paciente">
          <div class="row">
            <div class="col">
              <label>Nome Completo</label>
              <input type="text" id="nome" required placeholder="Ex: João Silva" style="width: 100%;">
            </div>
            <div class="col">
              <label>Data de Nascimento</label>
              <input type="date" id="data_nascimento" required style="width: 100%;">
            </div>
          </div>

          <div class="row">
            <div class="col">
              <label>Sexo</label>
              <select id="sexo" style="width: 100%;">
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </div>
            <div class="col">
              <label>Telefone</label>
              <input type="text" id="telefone" placeholder="(00) 90000-0000" style="width: 100%;">
            </div>
            <div class="col">
              <label>Convênio</label>
              <input type="text" id="convenio" placeholder="Ex: Particular" style="width: 100%;">
            </div>
          </div>

          <button type="submit" class="btn-primary" style="margin-top: 10px; width: 100%;">
            + Salvar Paciente
          </button>
        </form>
      </div>

      <div style="margin-top: 30px;">
        <h3>Lista de Pacientes</h3>
        <div style="overflow-x: auto;">
            <table width="100%">
            <thead>
                <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Idade</th>
                <th>Convênio</th>
                <th>Telefone</th>
                <th style="text-align: center;">Ações</th>
                </tr>
            </thead>
            <tbody id="listaPac">
                <tr><td colspan="6" style="text-align:center; padding: 15px;">Carregando...</td></tr>
            </tbody>
            </table>
        </div>
      </div>
    </div>
  `;

  renderLayout(html);
  document.getElementById("form-paciente").addEventListener("submit", salvarPaciente);
  await carregarLista();
}

async function carregarLista() {
  const tbody = document.getElementById("listaPac");
  try {
    const lista = await authFetch("/patients/"); 
    tbody.innerHTML = "";

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Nenhum paciente.</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map(p => `
      <tr>
        <td>${p.id}</td>
        <td><strong>${p.name}</strong></td>
        <td>${p.idade} anos</td>
        <td>${p.insurance || '-'}</td>
        <td>${p.phone || '-'}</td>
        <td style="text-align: center;">
           <button onclick="window.deletarPaciente(${p.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">🗑️</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    console.error(error);
    showToast("Erro ao carregar lista.", "error"); // <--- TOAST DE ERRO
  }
}

async function salvarPaciente(e) {
  e.preventDefault();
  
  const payload = {
    name: document.getElementById("nome").value,
    birth_date: document.getElementById("data_nascimento").value,
    sex: document.getElementById("sexo").value,
    phone: document.getElementById("telefone").value,
    insurance: document.getElementById("convenio").value
  };

  try {
    await authFetch("/patients/", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    showToast("Paciente cadastrado com sucesso!", "success"); // <--- TOAST BONITO
    document.getElementById("form-paciente").reset();
    carregarLista();

  } catch (error) {
    console.error(error);
    showToast("Erro ao salvar. Verifique os dados.", "error");
  }
}

window.deletarPaciente = async function(id) {
  if (confirm("Tem certeza que deseja excluir?")) {
    try {
      await authFetch(`/patients/${id}`, { method: "DELETE" });
      showToast("Paciente removido!", "success");
      carregarLista();
    } catch (error) {
      showToast("Erro ao deletar.", "error");
    }
  }
};

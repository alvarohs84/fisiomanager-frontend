import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";

let pacienteEmEdicaoId = null; // Variável para controlar se estamos criando ou editando

export async function renderPacientes() {
  const html = `
    <div class="container">
      <h2>📂 Gestão de Pacientes</h2>
      
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h4 id="tituloForm">Novo Paciente</h4>
            <button id="btnCancelarEdicao" style="display: none; background: #6c757d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Cancelar Edição</button>
        </div>

        <form id="form-paciente">
          <div class="row">
            <div class="col">
              <label>Nome Completo *</label>
              <input type="text" id="nome" required placeholder="Obrigatório" style="width: 100%;">
            </div>
            <div class="col">
              <label>Data de Nascimento</label>
              <input type="date" id="data_nascimento" style="width: 100%;">
            </div>
          </div>

          <div class="row">
            <div class="col">
              <label>Sexo</label>
              <select id="sexo" style="width: 100%;">
                <option value="">Selecione...</option>
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

          <button type="submit" id="btnSalvar" class="btn-primary" style="margin-top: 10px; width: 100%;">
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
                <th>Nome</th>
                <th>Idade</th>
                <th>Convênio</th>
                <th>Telefone</th>
                <th style="text-align: center;">Ações</th>
                </tr>
            </thead>
            <tbody id="listaPac">
                <tr><td colspan="5" style="text-align:center; padding: 15px;">Carregando...</td></tr>
            </tbody>
            </table>
        </div>
      </div>
    </div>
  `;

  renderLayout(html);
  
  document.getElementById("form-paciente").addEventListener("submit", salvarPaciente);
  document.getElementById("btnCancelarEdicao").addEventListener("click", resetarFormulario);
  
  await carregarLista();
}

async function carregarLista() {
  const tbody = document.getElementById("listaPac");
  try {
    const lista = await authFetch("/patients/"); 
    tbody.innerHTML = "";

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhum paciente.</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.idade > 0 ? p.idade + ' anos' : '-'}</td>
        <td>${p.insurance || '-'}</td>
        <td>${p.phone || '-'}</td>
        <td style="text-align: center;">
           <button onclick="window.prepararEdicao(${p.id})" style="background: #ffc107; color: #333; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️</button>
           <button onclick="window.deletarPaciente(${p.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">🗑️</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    console.error(error);
    showToast("Erro ao carregar lista.", "error");
  }
}

async function salvarPaciente(e) {
  e.preventDefault();
  
  const payload = {
    name: document.getElementById("nome").value,
    birth_date: document.getElementById("data_nascimento").value || null, // Envia null se vazio
    sex: document.getElementById("sexo").value || null,
    phone: document.getElementById("telefone").value || null,
    insurance: document.getElementById("convenio").value || null
  };

  try {
    if (pacienteEmEdicaoId) {
        // --- MODO EDIÇÃO (PATCH) ---
        await authFetch(`/patients/${pacienteEmEdicaoId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        });
        showToast("Paciente atualizado!", "success");
    } else {
        // --- MODO CRIAÇÃO (POST) ---
        await authFetch("/patients/", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        showToast("Paciente cadastrado!", "success");
    }

    resetarFormulario();
    carregarLista();

  } catch (error) {
    console.error(error);
    showToast("Erro ao salvar.", "error");
  }
}

// Preenche o formulário com os dados do paciente para editar
window.prepararEdicao = async function(id) {
    try {
        const paciente = await authFetch(`/patients/${id}`);
        
        document.getElementById("nome").value = paciente.name;
        document.getElementById("data_nascimento").value = paciente.birth_date || "";
        document.getElementById("sexo").value = paciente.sex || "";
        document.getElementById("telefone").value = paciente.phone || "";
        document.getElementById("convenio").value = paciente.insurance || "";

        // Muda estado visual para Edição
        pacienteEmEdicaoId = id;
        document.getElementById("tituloForm").innerText = "Editando: " + paciente.name;
        document.getElementById("btnSalvar").innerText = "Atualizar Paciente";
        document.getElementById("btnSalvar").style.backgroundColor = "#007bff"; // Azul
        document.getElementById("btnCancelarEdicao").style.display = "block";
        
        // Rola a tela para cima (para ver o formulário)
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (e) {
        showToast("Erro ao carregar dados.", "error");
    }
};

function resetarFormulario(e) {
    if(e) e.preventDefault();
    document.getElementById("form-paciente").reset();
    
    // Volta para o estado de "Novo"
    pacienteEmEdicaoId = null;
    document.getElementById("tituloForm").innerText = "Novo Paciente";
    document.getElementById("btnSalvar").innerText = "+ Salvar Paciente";
    document.getElementById("btnSalvar").style.backgroundColor = "#28a745"; // Verde
    document.getElementById("btnCancelarEdicao").style.display = "none";
}

window.deletarPaciente = async function(id) {
  if (confirm("Tem certeza que deseja excluir?")) {
    try {
      await authFetch(`/patients/${id}`, { method: "DELETE" });
      showToast("Paciente removido!", "info");
      carregarLista();
    } catch (error) {
      showToast("Erro ao deletar.", "error");
    }
  }
};

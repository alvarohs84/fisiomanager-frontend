import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";
import { ativarVoz } from "../core/voice.js"; // <--- Importe o módulo de voz

let pacienteEmEdicaoId = null;

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
              <div style="display:flex; align-items:center;">
                  <input type="text" id="nome" required placeholder="Ex: João da Silva" style="width: 100%;">
              </div>
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
              <input type="text" id="telefone" placeholder="Ex: 11999998888" style="width: 100%;">
            </div>
            <div class="col">
              <label>Convênio</label>
              <div style="display:flex; align-items:center;">
                  <input type="text" id="convenio" placeholder="Ex: Particular" style="width: 100%;">
              </div>
            </div>
          </div>
          
           <div class="row">
            <div class="col">
              <label>Diag. Médico</label>
              <div style="display:flex; align-items:center;">
                 <input type="text" id="diagMed" style="width: 100%;">
              </div>
            </div>
            <div class="col">
              <label>Diag. Funcional</label>
              <div style="display:flex; align-items:center;">
                  <input type="text" id="diagFunc" style="width: 100%;">
              </div>
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
                <th>Telefone</th>
                <th style="text-align: center;">Ações</th>
                </tr>
            </thead>
            <tbody id="listaPac">
                <tr><td colspan="4" style="text-align:center; padding: 15px;">Carregando...</td></tr>
            </tbody>
            </table>
        </div>
      </div>
    </div>
  `;

  renderLayout(html);
  
  document.getElementById("form-paciente").addEventListener("submit", salvarPaciente);
  document.getElementById("btnCancelarEdicao").addEventListener("click", resetarFormulario);
  
  // --- ATIVA O COMANDO DE VOZ ---
  ativarVoz("nome");
  ativarVoz("convenio");
  ativarVoz("diagMed");
  ativarVoz("diagFunc");

  await carregarLista();
}

async function carregarLista() {
  const tbody = document.getElementById("listaPac");
  try {
    const lista = await authFetch("/patients/"); 
    tbody.innerHTML = "";

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">Nenhum paciente.</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map(p => {
        let btnWhats = "";
        if (p.phone && p.phone.length >= 10) {
            const numLimpo = p.phone.replace(/\D/g, '');
            const mensagem = encodeURIComponent(`Olá ${p.name}, aqui é da Fisioterapia. Tudo bem?`);
            const link = `https://wa.me/55${numLimpo}?text=${mensagem}`;
            btnWhats = `<a href="${link}" target="_blank" style="text-decoration:none; margin-right:5px; font-size:1.2rem;" title="Chamar no Zap">📱</a>`;
        }

        return `
          <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.idade > 0 ? p.idade + ' anos' : '-'}</td>
            <td>${btnWhats} ${p.phone || '-'}</td>
            <td style="text-align: center;">
               <button onclick="window.prepararEdicao(${p.id})" style="background: #ffc107; color: #333; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️</button>
               <button onclick="window.deletarPaciente(${p.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">🗑️</button>
            </td>
          </tr>
        `;
    }).join("");
  } catch (error) {
    showToast("Erro ao carregar lista.", "error");
  }
}

async function salvarPaciente(e) {
  e.preventDefault();
  
  const payload = {
    name: document.getElementById("nome").value,
    birth_date: document.getElementById("data_nascimento").value || null,
    sex: document.getElementById("sexo").value || null,
    phone: document.getElementById("telefone").value || null,
    insurance: document.getElementById("convenio").value || null,
    medical_diagnosis: document.getElementById("diagMed").value || null,
    functional_diagnosis: document.getElementById("diagFunc").value || null
  };

  try {
    if (pacienteEmEdicaoId) {
        await authFetch(`/patients/${pacienteEmEdicaoId}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        });
        showToast("Atualizado!", "success");
    } else {
        await authFetch("/patients/", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        showToast("Cadastrado!", "success");
    }
    resetarFormulario();
    carregarLista();
  } catch (error) {
    showToast("Erro ao salvar.", "error");
  }
}

window.prepararEdicao = async function(id) {
    try {
        const paciente = await authFetch(`/patients/${id}`);
        document.getElementById("nome").value = paciente.name;
        document.getElementById("data_nascimento").value = paciente.birth_date || "";
        document.getElementById("sexo").value = paciente.sex || "";
        document.getElementById("telefone").value = paciente.phone || "";
        document.getElementById("convenio").value = paciente.insurance || "";
        document.getElementById("diagMed").value = paciente.medical_diagnosis || "";
        document.getElementById("diagFunc").value = paciente.functional_diagnosis || "";

        pacienteEmEdicaoId = id;
        document.getElementById("tituloForm").innerText = "Editando: " + paciente.name;
        document.getElementById("btnSalvar").innerText = "Atualizar Paciente";
        document.getElementById("btnSalvar").style.backgroundColor = "#007bff";
        document.getElementById("btnCancelarEdicao").style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (e) { showToast("Erro ao carregar dados.", "error"); }
};

function resetarFormulario(e) {
    if(e) e.preventDefault();
    document.getElementById("form-paciente").reset();
    pacienteEmEdicaoId = null;
    document.getElementById("tituloForm").innerText = "Novo Paciente";
    document.getElementById("btnSalvar").innerText = "+ Salvar Paciente";
    document.getElementById("btnSalvar").style.backgroundColor = "#28a745";
    document.getElementById("btnCancelarEdicao").style.display = "none";
}

window.deletarPaciente = async function(id) {
  if (confirm("Excluir paciente?")) {
    try {
      await authFetch(`/patients/${id}`, { method: "DELETE" });
      showToast("Removido!", "info");
      carregarLista();
    } catch (error) { showToast("Erro ao deletar.", "error"); }
  }
};

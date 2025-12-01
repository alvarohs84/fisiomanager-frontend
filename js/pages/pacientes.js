import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

// =================================================================
// FUNÇÃO PRINCIPAL (Exportada para o Router)
// =================================================================
export async function renderPacientes() {
  // 1. Monta o HTML da tela (Formulário + Tabela)
  const html = `
    <div class="container" style="padding: 20px;">
      <h2>📂 Gestão de Pacientes</h2>
      
      <div class="card" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h4>Novo Paciente</h4>
        <form id="form-paciente">
          <div class="row">
            <div class="col">
              <label>Nome Completo</label>
              <input type="text" id="nome" class="u-full-width" required placeholder="Ex: João Silva" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            </div>
            <div class="col">
              <label>Data de Nascimento</label>
              <input type="date" id="data_nascimento" class="u-full-width" required style="width: 100%; padding: 8px; margin-bottom: 10px;">
            </div>
          </div>

          <div class="row">
            <div class="col">
              <label>Sexo</label>
              <select id="sexo" style="width: 100%; padding: 8px; margin-bottom: 10px;">
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div class="col">
              <label>Telefone</label>
              <input type="text" id="telefone" placeholder="(00) 90000-0000" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            </div>
            <div class="col">
              <label>Convênio</label>
              <input type="text" id="convenio" placeholder="Ex: Particular, Unimed" style="width: 100%; padding: 8px; margin-bottom: 10px;">
            </div>
          </div>

          <button type="submit" style="background-color: #28a745; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; font-weight: bold;">
            + Salvar Paciente
          </button>
        </form>
      </div>

      <hr>

      <h3>Lista de Pacientes</h3>
      <div style="overflow-x: auto;">
        <table width="100%" style="border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background: #333; color: #fff; text-align: left;">
              <th style="padding: 10px;">ID</th>
              <th style="padding: 10px;">Nome</th>
              <th style="padding: 10px;">Idade</th> <th style="padding: 10px;">Convênio</th>
              <th style="padding: 10px;">Telefone</th>
              <th style="padding: 10px; text-align: center;">Ações</th>
            </tr>
          </thead>
          <tbody id="listaPac">
            <tr><td colspan="6" style="text-align:center; padding: 15px;">Carregando...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  renderLayout(html);

  // 2. Ativa o formulário
  document.getElementById("form-paciente").addEventListener("submit", salvarPaciente);

  // 3. Carrega a lista inicial
  await carregarLista();
}

// =================================================================
// LÓGICA DO SISTEMA
// =================================================================

// --- CARREGAR LISTA ---
async function carregarLista() {
  const tbody = document.getElementById("listaPac");
  
  try {
    // IMPORTANTE: A barra no final "/" evita redirecionamento e erro de CORS
    const lista = await authFetch("/patients/"); 
    
    tbody.innerHTML = "";

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Nenhum paciente cadastrado.</td></tr>`;
      return;
    }

    // Preenche a tabela
    tbody.innerHTML = lista.map(p => `
      <tr style="border-bottom: 1px solid #ccc;">
        <td style="padding: 10px;">${p.id}</td>
        <td style="padding: 10px;"><strong>${p.name}</strong></td>
        <td style="padding: 10px;">${p.idade} anos</td>
        <td style="padding: 10px;">${p.insurance || '-'}</td>
        <td style="padding: 10px;">${p.phone || '-'}</td>
        <td style="padding: 10px; text-align: center;">
           <button onclick="window.deletarPaciente(${p.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;" title="Excluir">🗑️</button>
        </td>
      </tr>
    `).join("");

  } catch (error) {
    console.error(error);
    tbody.innerHTML = `<tr><td colspan="6" style="color: red; text-align:center;">Erro ao carregar pacientes. Verifique o console.</td></tr>`;
  }
}

// --- SALVAR PACIENTE ---
async function salvarPaciente(e) {
  e.preventDefault(); // Impede a página de recarregar

  // Monta o objeto com os dados do formulário
  const payload = {
    name: document.getElementById("nome").value,
    birth_date: document.getElementById("data_nascimento").value, // YYYY-MM-DD
    sex: document.getElementById("sexo").value,
    phone: document.getElementById("telefone").value,
    insurance: document.getElementById("convenio").value
  };

  try {
    // IMPORTANTE: POST com barra no final "/"
    await authFetch("/patients/", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    alert("Paciente cadastrado com sucesso!");
    document.getElementById("form-paciente").reset(); // Limpa os campos
    carregarLista(); // Atualiza a tabela imediatamente

  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao salvar o paciente. Verifique os dados.");
  }
}

// --- DELETAR PACIENTE ---
// Colocamos no "window" para o HTML conseguir chamar no onclick
window.deletarPaciente = async function(id) {
  if (confirm("Tem certeza que deseja excluir este paciente?")) {
    try {
      await authFetch(`/patients/${id}`, { method: "DELETE" });
      carregarLista(); // Atualiza a tabela
    } catch (error) {
      alert("Erro ao deletar.");
    }
  }
};

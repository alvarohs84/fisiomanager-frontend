import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";
// Importante: O arquivo de templates tem que estar na mesma pasta (js/pages)
import { templates } from "./avaliacoes_templates.js";

export async function renderAvaliacoes() {
  const html = `
    <div class="container">
      <h2>📋 Avaliações Especializadas</h2>
      
      <div style="display: grid; grid-template-columns: 300px 1fr; gap: 20px; margin-top: 20px;" class="grid-mobile">
        
        <div class="card" style="height: fit-content;">
          <h3>Nova Avaliação</h3>
          
          <label>1. Selecione o Paciente</label>
          <select id="selPaciente" style="width: 100%; margin-bottom: 15px; padding: 10px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="">Carregando...</option>
          </select>

          <label>2. Escolha a Especialidade</label>
          <select id="selEspecialidade" style="width: 100%; margin-bottom: 20px; padding: 10px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="">-- Selecione --</option>
            <option value="Ortopedica">Ortopédica / Traumatológica</option>
            <option value="NeuroAdulto">Neurofuncional (Adulto)</option>
            <option value="NeuroPediatrica">Neurofuncional (Pediátrica)</option>
            <option value="Respiratoria">Respiratória</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Uroginecologica">Uroginecológica</option>
            <option value="Dermatofuncional">Dermatofuncional</option>
            <option value="Esportiva">Esportiva</option>
            <option value="Geriatrica">Geriátrica</option>
            <option value="Ergonomia">Ergonomia / Trabalho</option>
          </select>

          <button id="btnCriarFicha" class="btn-primary" style="width: 100%;">Abrir Ficha</button>
          
          <hr style="margin: 20px 0;">
          
          <h4>Histórico</h4>
          <div id="listaHistorico" style="max-height: 400px; overflow-y: auto; font-size: 0.9rem;">
            <p style="color:#777;">Selecione um paciente para ver o histórico.</p>
          </div>
        </div>

        <div class="card" id="areaFormulario" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 id="tituloFicha" style="margin: 0; color: #007bff;">Ficha de Avaliação</h3>
                <button id="btnFecharFicha" style="border:none; background:none; cursor:pointer; font-size: 1.2rem; color: #dc3545;">❌</button>
            </div>
            <hr>
            
            <form id="formAvaliacao">
                <div id="conteudoDinamico"></div>
                
                <hr style="margin-top: 20px;">
                <div style="text-align: right; margin-top: 15px;">
                    <button type="submit" class="btn-primary" style="padding: 10px 30px;">💾 Salvar Avaliação</button>
                </div>
            </form>
        </div>

      </div>
    </div>
    <style>
      @media(max-width:768px){ .grid-mobile{ grid-template-columns:1fr !important; } }
    </style>
  `;

  renderLayout(html);
  
  // Carrega a lista de pacientes
  await carregarPacientes();

  // Eventos dos Botões
  document.getElementById("btnCriarFicha").onclick = abrirFicha;
  document.getElementById("formAvaliacao").onsubmit = salvarAvaliacao;
  document.getElementById("selPaciente").onchange = carregarHistorico;
  document.getElementById("btnFecharFicha").onclick = () => {
      document.getElementById('areaFormulario').style.display = 'none';
  };
}

// --- LÓGICA ---

async function carregarPacientes() {
    try {
        const lista = await authFetch("/patients/");
        const select = document.getElementById("selPaciente");
        
        if (lista.length === 0) {
            select.innerHTML = '<option value="">Nenhum paciente cadastrado</option>';
        } else {
            select.innerHTML = `<option value="">-- Selecione o Paciente --</option>` + 
                lista.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
        }
    } catch(e) { 
        showToast("Erro ao carregar pacientes", "error"); 
    }
}

function abrirFicha() {
    const pacienteId = document.getElementById("selPaciente").value;
    const tipo = document.getElementById("selEspecialidade").value;

    if (!pacienteId) {
        showToast("Selecione um Paciente primeiro!", "info");
        return;
    }
    if (!tipo) {
        showToast("Escolha a Especialidade!", "info");
        return;
    }

    // Busca o HTML no arquivo de templates
    const templateHTML = templates[tipo];
    
    if (!templateHTML) {
        showToast("Erro: Formulário não encontrado para esta especialidade.", "error");
        console.error("Template não achado para:", tipo);
        return;
    }

    // Injeta o HTML e mostra a div
    document.getElementById("conteudoDinamico").innerHTML = templateHTML;
    document.getElementById("tituloFicha").innerText = "Ficha: " + tipo;
    document.getElementById("areaFormulario").style.display = "block";
    
    // Rola suavemente até o formulário
    document.getElementById("areaFormulario").scrollIntoView({ behavior: 'smooth' });
}

async function salvarAvaliacao(e) {
    e.preventDefault();
    const pacienteId = document.getElementById("selPaciente").value;
    const tipo = document.getElementById("selEspecialidade").value;
    const form = document.getElementById("formAvaliacao");

    // Transforma todos os inputs do formulário em um objeto JSON
    const formData = new FormData(form);
    const conteudoJSON = Object.fromEntries(formData.entries());

    try {
        await authFetch("/assessments/", {
            method: "POST",
            body: JSON.stringify({
                patient_id: pacienteId,
                specialty: tipo,
                content: conteudoJSON
            })
        });

        showToast("Avaliação salva com sucesso!", "success");
        document.getElementById("areaFormulario").style.display = "none";
        carregarHistorico(); // Atualiza a lista lateral

    } catch (e) {
        console.error(e);
        showToast("Erro ao salvar avaliação.", "error");
    }
}

async function carregarHistorico() {
    const pacienteId = document.getElementById("selPaciente").value;
    const divLista = document.getElementById("listaHistorico");
    
    if (!pacienteId) {
        divLista.innerHTML = "<p style='color:#777;'>Selecione um paciente.</p>";
        return;
    }

    divLista.innerHTML = "Carregando...";

    try {
        const avaliacoes = await authFetch(`/assessments/?patient_id=${pacienteId}`);
        
        if (avaliacoes.length === 0) {
            divLista.innerHTML = "<p style='color:#777; text-align:center; padding:10px;'>Nenhuma avaliação encontrada.</p>";
            return;
        }

        divLista.innerHTML = avaliacoes.map(av => {
            const data = new Date(av.date).toLocaleDateString('pt-BR');
            // Stringify seguro para passar no onclick
            const dadosString = encodeURIComponent(JSON.stringify(av));
            
            return `
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #007bff; cursor: pointer; transition: 0.2s;" 
                     onclick="window.verDetalhes('${dadosString}')"
                     onmouseover="this.style.background='#e9ecef'" 
                     onmouseout="this.style.background='#f8f9fa'">
                    
                    <div style="display:flex; justify-content:space-between;">
                        <strong style="color:#007bff; font-size:0.9rem;">${av.specialty}</strong>
                        <button onclick="event.stopPropagation(); window.deletarAvaliacao(${av.id})" style="border:none; background:none; color:#dc3545; cursor:pointer;" title="Excluir">🗑️</button>
                    </div>
                    <small style="color:#555;">📅 ${data}</small>
                </div>
            `;
        }).join("");

    } catch(e) {
        console.error(e);
        divLista.innerHTML = "Erro ao buscar histórico.";
    }
}

// Funções globais (window) para funcionar no HTML injetado
window.verDetalhes = (jsonString) => {
    try {
        const av = JSON.parse(decodeURIComponent(jsonString));
        const templateHTML = templates[av.specialty] || "Erro no template";
        
        document.getElementById("conteudoDinamico").innerHTML = templateHTML;
        document.getElementById("tituloFicha").innerText = `Visualizando: ${av.specialty}`;
        document.getElementById("areaFormulario").style.display = "block";

        // Preenche os campos automaticamente
        setTimeout(() => {
            for (const [key, value] of Object.entries(av.content)) {
                const el = document.getElementsByName(key)[0];
                if (el) el.value = value;
            }
        }, 50); // Pequeno delay para garantir que o HTML renderizou

        document.getElementById("areaFormulario").scrollIntoView({ behavior: 'smooth' });
    } catch(e) {
        showToast("Erro ao abrir detalhes.", "error");
    }
};

window.deletarAvaliacao = async (id) => {
    if(!confirm("Tem certeza que deseja apagar esta avaliação?")) return;
    try {
        await authFetch(`/assessments/${id}`, { method: "DELETE" });
        showToast("Avaliação apagada.", "info");
        carregarHistorico();
    } catch(e) {
        showToast("Erro ao apagar.", "error");
    }
};
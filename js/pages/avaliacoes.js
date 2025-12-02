import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";
import { templates } from "./avaliacoes_templates.js";

export async function renderAvaliacoes() {
  const html = `
    <div class="container">
      <h2>📋 Avaliações Especializadas</h2>
      
      <div style="display: grid; grid-template-columns: 300px 1fr; gap: 20px; margin-top: 20px;" class="grid-mobile">
        
        <div class="card" style="height: fit-content;">
          <h3>Nova Avaliação</h3>
          
          <label>1. Paciente</label>
          <select id="selPaciente" style="width: 100%; margin-bottom: 15px; padding: 10px;">
            <option value="">Carregando...</option>
          </select>

          <label>2. Especialidade</label>
          <select id="selEspecialidade" style="width: 100%; margin-bottom: 20px; padding: 10px;">
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
            <p style="color:#777;">Selecione um paciente.</p>
          </div>
        </div>

        <div class="card" id="areaFormulario" style="display: none;">
            <div style="display: flex; justify-content: space-between;">
                <h3 id="tituloFicha">Ficha</h3>
                <button id="btnFecharFicha" style="border:none; background:none; cursor:pointer; font-size: 1.2rem;">❌</button>
            </div>
            <hr>
            
            <form id="formAvaliacao">
                <div id="conteudoDinamico"></div>
                <hr>
                <div style="text-align: right; margin-top: 20px;">
                    <button type="submit" class="btn-primary" style="padding: 10px 30px;">💾 Salvar Avaliação</button>
                </div>
            </form>
        </div>

      </div>
    </div>
    <style>@media(max-width:768px){.grid-mobile{grid-template-columns:1fr !important;}}</style>
  `;

  renderLayout(html);
  await carregarPacientes();

  document.getElementById("btnCriarFicha").onclick = abrirFicha;
  document.getElementById("formAvaliacao").onsubmit = salvarAvaliacao;
  document.getElementById("selPaciente").onchange = carregarHistorico;
  document.getElementById("btnFecharFicha").onclick = () => document.getElementById('areaFormulario').style.display='none';
}

async function carregarPacientes() {
    try {
        const lista = await authFetch("/patients/");
        const select = document.getElementById("selPaciente");
        if(lista.length === 0) {
             select.innerHTML = '<option value="">Sem pacientes</option>';
        } else {
             select.innerHTML = `<option value="">-- Selecione --</option>` + 
                lista.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
        }
    } catch(e) { showToast("Erro ao carregar pacientes", "error"); }
}

function abrirFicha() {
    const pacienteId = document.getElementById("selPaciente").value;
    const tipo = document.getElementById("selEspecialidade").value;

    if (!pacienteId || !tipo) {
        showToast("Selecione Paciente e Especialidade!", "info");
        return;
    }

    const templateHTML = templates[tipo];
    if (!templateHTML) {
        showToast("Template não encontrado.", "error");
        return;
    }

    document.getElementById("conteudoDinamico").innerHTML = templateHTML;
    document.getElementById("tituloFicha").innerText = "Ficha: " + tipo;
    document.getElementById("areaFormulario").style.display = "block";
    document.getElementById("areaFormulario").scrollIntoView({ behavior: 'smooth' });
}

async function salvarAvaliacao(e) {
    e.preventDefault();
    const pacienteId = document.getElementById("selPaciente").value;
    const tipo = document.getElementById("selEspecialidade").value;
    const form = document.getElementById("formAvaliacao");

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

        showToast("Avaliação salva!", "success");
        document.getElementById("areaFormulario").style.display = "none";
        carregarHistorico();

    } catch (e) {
        showToast("Erro ao salvar.", "error");
    }
}

async function carregarHistorico() {
    const pacienteId = document.getElementById("selPaciente").value;
    const divLista = document.getElementById("listaHistorico");
    
    if (!pacienteId) {
        divLista.innerHTML = "";
        return;
    }

    divLista.innerHTML = "Carregando...";

    try {
        const avaliacoes = await authFetch(`/assessments/?patient_id=${pacienteId}`);
        
        if (avaliacoes.length === 0) {
            divLista.innerHTML = "<p style='color:#777'>Nenhuma avaliação encontrada.</p>";
            return;
        }

        divLista.innerHTML = avaliacoes.map(av => {
            const data = new Date(av.date).toLocaleDateString('pt-BR');
            return `
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #007bff; cursor: pointer;" onclick="verDetalhes('${encodeURIComponent(JSON.stringify(av))}')">
                    <strong style="color:#007bff">${av.specialty}</strong><br>
                    <small>${data}</small>
                    <button onclick="event.stopPropagation(); deletarAvaliacao(${av.id})" style="float: right; border:none; background:none; color:#dc3545; cursor:pointer;">🗑️</button>
                </div>
            `;
        }).join("");

    } catch(e) {
        divLista.innerHTML = "Erro ao buscar.";
    }
}

window.verDetalhes = (jsonString) => {
    const av = JSON.parse(decodeURIComponent(jsonString));
    const templateHTML = templates[av.specialty] || "Erro no template";
    document.getElementById("conteudoDinamico").innerHTML = templateHTML;
    document.getElementById("tituloFicha").innerText = `Visualizando: ${av.specialty}`;
    document.getElementById("areaFormulario").style.display = "block";

    // Preenche campos
    setTimeout(() => {
        for (const [key, value] of Object.entries(av.content)) {
            const el = document.getElementsByName(key)[0];
            if (el) el.value = value;
        }
    }, 100);
    document.getElementById("areaFormulario").scrollIntoView({ behavior: 'smooth' });
};

window.deletarAvaliacao = async (id) => {
    if(!confirm("Apagar?")) return;
    try {
        await authFetch(`/assessments/${id}`, { method: "DELETE" });
        showToast("Apagado.", "info");
        carregarHistorico();
    } catch(e) { showToast("Erro ao apagar.", "error"); }
};
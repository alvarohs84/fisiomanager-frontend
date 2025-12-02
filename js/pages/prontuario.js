import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";
// Certifique-se que o arquivo de templates existe nessa pasta
import { templates } from "./avaliacoes_templates.js"; 

export async function renderProntuario() {
  const html = `
    <div class="container">
      <h2>🗂️ Prontuário Eletrônico</h2>
      
      <div style="display: grid; grid-template-columns: 300px 1fr; gap: 20px; margin-top: 20px;" class="grid-mobile">
        
        <div class="card" style="height: fit-content;">
          <h3>Paciente</h3>
          <select id="selPaciente" style="width: 100%; margin-bottom: 20px; padding: 10px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="">Carregando...</option>
          </select>

          <hr style="margin-bottom: 20px;">

          <h4>Novo Registro</h4>
          <label>Tipo:</label>
          <select id="selTipoRegistro" style="width: 100%; margin-bottom: 10px; padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="Evolucao">📝 Evolução Diária</option>
            <option value="Ortopedica">🦴 Ficha Ortopédica</option>
            <option value="NeuroAdulto">🧠 Ficha Neuro Adulto</option>
            <option value="NeuroPediatrica">👶 Ficha Neuro Pediátrica</option>
            <option value="Respiratoria">🫁 Ficha Respiratória</option>
            <option value="Cardiovascular">❤️ Ficha Cardiovascular</option>
            <option value="Uroginecologica">🚺 Ficha Uroginecológica</option>
            <option value="Dermatofuncional">💆‍♀️ Ficha Dermatofuncional</option>
            <option value="Esportiva">🏅 Ficha Esportiva</option>
            <option value="Geriatrica">👴 Ficha Geriátrica</option>
            <option value="Ergonomia">🪑 Ficha Ergonomia</option>
          </select>

          <button id="btnNovoRegistro" class="btn-primary" style="width: 100%;">+ Criar</button>
        </div>

        <div>
            <div class="card" id="areaCriacao" style="display: none; margin-bottom: 20px; border: 2px solid #007bff;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 id="tituloCriacao" style="margin:0; color:#007bff;">Novo Registro</h3>
                    <button id="btnFecharCriacao" style="border:none; background:none; cursor:pointer; color:#dc3545; font-weight:bold;">FECHAR X</button>
                </div>
                <hr>
                <form id="formProntuario">
                    <div id="conteudoFormulario"></div>
                    <div style="text-align: right; margin-top: 15px;">
                        <button type="submit" class="btn-primary" style="padding: 10px 30px;">Salvar Registro</button>
                    </div>
                </form>
            </div>

            <h3 style="margin-bottom: 15px;">Histórico do Paciente</h3>
            <div id="timeline" style="min-height: 200px;">
                <p style="color:#777;">Selecione um paciente para ver o prontuário.</p>
            </div>
        </div>

      </div>
    </div>
    <style>@media(max-width:768px){.grid-mobile{grid-template-columns:1fr !important;}}</style>
  `;

  renderLayout(html);
  await carregarPacientes();

  // Eventos
  document.getElementById("selPaciente").onchange = carregarTimeline;
  document.getElementById("btnNovoRegistro").onclick = abrirFormulario;
  document.getElementById("btnFecharCriacao").onclick = () => document.getElementById("areaCriacao").style.display = "none";
  document.getElementById("formProntuario").onsubmit = salvarRegistro;
}

// --- LÓGICA ---

async function carregarPacientes() {
    try {
        const lista = await authFetch("/patients/");
        const select = document.getElementById("selPaciente");
        if (lista.length === 0) {
            select.innerHTML = '<option value="">Sem pacientes</option>';
        } else {
            select.innerHTML = `<option value="">-- Selecione --</option>` + 
                lista.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
        }
    } catch(e) { showToast("Erro ao carregar pacientes", "error"); }
}

async function carregarTimeline() {
    const pacienteId = document.getElementById("selPaciente").value;
    const timeline = document.getElementById("timeline");
    
    if (!pacienteId) {
        timeline.innerHTML = "";
        return;
    }

    timeline.innerHTML = "Carregando histórico...";

    try {
        // Busca Evoluções e Avaliações em paralelo
        const [evolucoes, avaliacoes] = await Promise.all([
            authFetch(`/evolutions/?patient_id=${pacienteId}`),
            authFetch(`/assessments/?patient_id=${pacienteId}`)
        ]);

        // Unifica tudo em uma lista só
        const historico = [
            ...evolucoes.map(e => ({ ...e, tipo: 'Evolução', dataReal: new Date(e.date) })),
            ...avaliacoes.map(a => ({ ...a, tipo: 'Ficha: ' + a.specialty, dataReal: new Date(a.date) }))
        ];

        // Ordena por data (mais recente em cima)
        historico.sort((a, b) => b.dataReal - a.dataReal);

        if (historico.length === 0) {
            timeline.innerHTML = "<p style='padding:20px; text-align:center; color:#777;'>Nenhum registro encontrado para este paciente.</p>";
            return;
        }

        timeline.innerHTML = historico.map(item => {
            const dataFormatada = item.dataReal.toLocaleString('pt-BR');
            const ehEvolucao = item.tipo === 'Evolução';
            
            // Conteúdo: Texto se for evolução, Botão "Ver Detalhes" se for ficha
            let conteudo = "";
            if (ehEvolucao) {
                conteudo = `<p style="white-space: pre-wrap; color: #333;">${item.description}</p>`;
            } else {
                const dadosFicha = encodeURIComponent(JSON.stringify(item));
                conteudo = `<button type="button" onclick="window.verFicha('${dadosFicha}')" style="background:#e7f1ff; color:#0056b3; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">📄 Ver Ficha Completa</button>`;
            }

            // Define endpoint de deletar
            const endpointDelete = ehEvolucao ? 'evolutions' : 'assessments';

            return `
                <div class="card" style="margin-bottom: 15px; padding: 15px; border-left: 5px solid ${ehEvolucao ? '#28a745' : '#007bff'}; position:relative;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <strong style="color:${ehEvolucao ? '#28a745' : '#007bff'}; text-transform:uppercase; font-size:0.85rem;">${item.tipo}</strong>
                        <small style="color:#888;">${dataFormatada}</small>
                    </div>
                    ${conteudo}
                    
                    <button onclick="window.deletarItemProntuario('${endpointDelete}', ${item.id})" style="position:absolute; bottom:10px; right:10px; background:none; border:none; color:#dc3545; cursor:pointer;" title="Excluir">🗑️</button>
                </div>
            `;
        }).join("");

    } catch(e) {
        console.error(e);
        timeline.innerHTML = "Erro ao carregar histórico.";
    }
}

function abrirFormulario() {
    const pacienteId = document.getElementById("selPaciente").value;
    if (!pacienteId) { showToast("Selecione um Paciente!", "info"); return; }

    const tipo = document.getElementById("selTipoRegistro").value;
    const container = document.getElementById("conteudoFormulario");
    
    document.getElementById("areaCriacao").style.display = "block";
    document.getElementById("tituloCriacao").innerText = tipo === 'Evolucao' ? "Nova Evolução" : "Ficha: " + tipo;

    if (tipo === 'Evolucao') {
        container.innerHTML = `
            <label>Descrição:</label>
            <textarea name="descricao" rows="6" class="u-full-width" placeholder="Descreva o atendimento, queixas e progressos..." style="padding:10px; border-radius:6px; border:1px solid #ddd;"></textarea>
        `;
    } else {
        // Carrega do arquivo de templates
        container.innerHTML = templates[tipo] || "<p>Erro: Template não encontrado.</p>";
    }
    
    document.getElementById("areaCriacao").scrollIntoView({ behavior: 'smooth' });
}

async function salvarRegistro(e) {
    e.preventDefault();
    const pacienteId = document.getElementById("selPaciente").value;
    const tipo = document.getElementById("selTipoRegistro").value;
    const form = document.getElementById("formProntuario");
    const formData = new FormData(form);

    try {
        if (tipo === 'Evolucao') {
            // Salva Evolução Simples
            const desc = formData.get("descricao");
            if(!desc) return showToast("Escreva algo!", "error");

            await authFetch("/evolutions/", {
                method: "POST",
                body: JSON.stringify({ patient_id: pacienteId, description: desc })
            });
        } else {
            // Salva Ficha Completa (JSON)
            const conteudoJSON = Object.fromEntries(formData.entries());
            await authFetch("/assessments/", {
                method: "POST",
                body: JSON.stringify({
                    patient_id: pacienteId,
                    specialty: tipo,
                    content: conteudoJSON
                })
            });
        }

        showToast("Registro salvo com sucesso!", "success");
        document.getElementById("areaCriacao").style.display = "none";
        carregarTimeline(); // Atualiza a lista na hora

    } catch (e) {
        showToast("Erro ao salvar.", "error");
    }
}

// --- FUNÇÕES GLOBAIS ---

window.verFicha = (jsonString) => {
    // Reusa a lógica de abrir formulário, mas preenche os dados (modo leitura)
    const item = JSON.parse(decodeURIComponent(jsonString));
    const container = document.getElementById("conteudoFormulario");
    
    document.getElementById("areaCriacao").style.display = "block";
    document.getElementById("tituloCriacao").innerText = `Visualizando: ${item.specialty}`;
    
    container.innerHTML = templates[item.specialty] || "Erro template";

    // Preenche campos
    setTimeout(() => {
        for (const [key, value] of Object.entries(item.content)) {
            const el = document.getElementsByName(key)[0];
            if (el) el.value = value;
        }
    }, 50);
    
    document.getElementById("areaCriacao").scrollIntoView({ behavior: 'smooth' });
};

window.deletarItemProntuario = async (endpoint, id) => {
    if(!confirm("Apagar este registro permanentemente?")) return;
    try {
        await authFetch(`/${endpoint}/${id}`, { method: "DELETE" });
        showToast("Registro apagado.", "info");
        carregarTimeline();
    } catch(e) {
        showToast("Erro ao apagar.", "error");
    }
};
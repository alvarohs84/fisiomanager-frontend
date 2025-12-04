import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";
import { templates } from "./avaliacoes_templates.js";

export async function renderProntuario() {
  const html = `
    <div class="container">
      <h2>🗂️ Prontuário Eletrônico</h2>
      
      <div style="display: grid; grid-template-columns: 300px 1fr; gap: 20px; margin-top: 20px;" class="grid-mobile">
        
        <div class="card" style="height: fit-content;">
          <h3>Paciente</h3>
          <select id="selPaciente" style="width: 100%; margin-bottom: 15px; padding: 10px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="">Carregando...</option>
          </select>

          <div id="areaDiagnosticos" style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 20px; display:none; border: 1px solid #e9ecef;">
            <label style="font-size:0.8rem; font-weight:bold; color:#0056b3;">Diagnóstico Médico:</label>
            <textarea id="diagMedico" rows="2" class="u-full-width" style="font-size:0.85rem; border:1px solid #ccc;"></textarea>
            
            <label style="font-size:0.8rem; font-weight:bold; color:#0056b3; margin-top:5px;">Diag. Cinético-Funcional:</label>
            <textarea id="diagFuncional" rows="3" class="u-full-width" style="font-size:0.85rem; border:1px solid #ccc;"></textarea>
            
            <button id="btnSalvarDiagnosticos" style="width:100%; margin-top:5px; background:#6c757d; color:white; border:none; border-radius:4px; cursor:pointer; padding:5px; font-size:0.8rem;">Atualizar Diagnósticos</button>
          </div>

          <hr style="margin-bottom: 20px;">

          <h4>Novo Registro</h4>
          <label>Tipo:</label>
          <select id="selTipoRegistro" style="width: 100%; margin-bottom: 10px; padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="Evolucao">📝 Evolução Diária (Sessão)</option>
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
  document.getElementById("selPaciente").onchange = aoMudarPaciente; // <--- Função correta aqui
  document.getElementById("btnNovoRegistro").onclick = abrirFormulario;
  document.getElementById("btnFecharCriacao").onclick = () => document.getElementById("areaCriacao").style.display = "none";
  document.getElementById("formProntuario").onsubmit = salvarRegistro;
  document.getElementById("btnSalvarDiagnosticos").onclick = salvarDiagnosticosPaciente;
}

// --- FUNÇÕES DE LÓGICA ---

async function carregarPacientes() {
    try {
        const lista = await authFetch("/patients/");
        const select = document.getElementById("selPaciente");
        if (lista.length === 0) select.innerHTML = '<option value="">Sem pacientes</option>';
        else select.innerHTML = `<option value="">-- Selecione --</option>` + lista.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    } catch(e) { showToast("Erro ao carregar pacientes", "error"); }
}

// Função chamada ao selecionar um paciente
async function aoMudarPaciente() {
    const id = document.getElementById("selPaciente").value;
    
    if(!id) {
        document.getElementById("areaDiagnosticos").style.display = "none";
        document.getElementById("timeline").innerHTML = "";
        return;
    }

    // 1. Carregar Diagnósticos e preencher a caixinha lateral
    try {
        const paciente = await authFetch(`/patients/${id}`);
        document.getElementById("diagMedico").value = paciente.medical_diagnosis || "";
        document.getElementById("diagFuncional").value = paciente.functional_diagnosis || "";
        document.getElementById("areaDiagnosticos").style.display = "block"; // <--- MOSTRA A CAIXINHA
    } catch(e) { console.error(e); }

    // 2. Carregar Histórico
    carregarTimeline();
}

async function salvarDiagnosticosPaciente() {
    const id = document.getElementById("selPaciente").value;
    const med = document.getElementById("diagMedico").value;
    const func = document.getElementById("diagFuncional").value;

    try {
        await authFetch(`/patients/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ medical_diagnosis: med, functional_diagnosis: func })
        });
        showToast("Diagnósticos atualizados!", "success");
    } catch(e) { showToast("Erro ao atualizar", "error"); }
}

async function carregarTimeline() {
    const pacienteId = document.getElementById("selPaciente").value;
    const timeline = document.getElementById("timeline");
    if (!pacienteId) return;

    timeline.innerHTML = "Carregando histórico...";

    try {
        const [evolucoes, avaliacoes] = await Promise.all([
            authFetch(`/evolutions/?patient_id=${pacienteId}`),
            authFetch(`/assessments/?patient_id=${pacienteId}`)
        ]);

        const historico = [
            ...evolucoes.map(e => ({ ...e, tipo: 'Evolução', dataReal: new Date(e.date) })),
            ...avaliacoes.map(a => ({ ...a, tipo: 'Ficha: ' + a.specialty, dataReal: new Date(a.date) }))
        ];

        historico.sort((a, b) => b.dataReal - a.dataReal);

        if (historico.length === 0) {
            timeline.innerHTML = "<p style='padding:20px; text-align:center; color:#777;'>Nenhum registro encontrado.</p>";
            return;
        }

        timeline.innerHTML = historico.map(item => {
            const dataFormatada = item.dataReal.toLocaleString('pt-BR');
            const itemString = encodeURIComponent(JSON.stringify(item));
            
            if (item.tipo === 'Evolução') {
                let conteudo = `<p style="white-space: pre-wrap; color: #333; margin-bottom:10px;">${item.description}</p>`;
                if (item.content) {
                    const c = item.content;
                    const renderBloco = (titulo, dados) => {
                        if (!dados) return "";
                        let html = `<div style="flex:1; background:white; padding:8px; border-radius:4px; border:1px solid #eee; font-size:0.85rem;">
                            <strong style="color:#555;">${titulo}</strong><hr style="margin:5px 0;">`;
                        if(dados.eva) html += `<div>Dor: <span style="font-weight:bold; color:${dados.eva > 5 ? 'red':'green'}">${dados.eva}</span> <small>(${dados.eva_local || ''})</small></div>`;
                        if(dados.mrc && dados.mrc.length) html += `<div>Força: ${dados.mrc.map(m=>`${m.m} G${m.g}`).join(', ')}</div>`;
                        if(dados.adm && dados.adm.length) html += `<div>ADM: ${dados.adm.map(a=>`${a.a} ${a.g}`).join(', ')}</div>`;
                        return html + "</div>";
                    };
                    conteudo += `<div style="display:flex; gap:10px; background:#f8f9fa; padding:10px; border-radius:6px; flex-wrap:wrap;">${renderBloco("PRÉ", c.pre)}${renderBloco("PÓS", c.pos)}</div>`;
                }

                return `
                    <div class="card" style="margin-bottom:15px; padding:15px; border-left:5px solid #28a745; position:relative;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <strong style="color:#28a745;">EVOLUÇÃO DIÁRIA</strong>
                            <div>
                                <button onclick="window.imprimirRegistro('${itemString}')" style="background:none; border:none; cursor:pointer; font-size:1.2rem; margin-right:10px;">🖨️</button>
                                <button onclick="window.deletarItemProntuario('evolutions', ${item.id})" style="background:none; border:none; color:#dc3545; cursor:pointer;">🗑️</button>
                            </div>
                        </div>
                        <small style="color:#888; display:block; margin-bottom:10px;">${dataFormatada}</small>
                        ${conteudo}
                    </div>`;
            } else {
                return `
                    <div class="card" style="margin-bottom:15px; padding:15px; border-left:5px solid #007bff; position:relative;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <strong style="color:#007bff;">FICHA: ${item.specialty}</strong>
                            <div>
                                <button onclick="window.imprimirRegistro('${itemString}')" style="background:none; border:none; cursor:pointer; font-size:1.2rem; margin-right:10px;">🖨️</button>
                                <button onclick="window.deletarItemProntuario('assessments', ${item.id})" style="background:none; border:none; color:#dc3545; cursor:pointer;">🗑️</button>
                            </div>
                        </div>
                        <small style="color:#888; display:block; margin-bottom:10px;">${dataFormatada}</small>
                        <button onclick="window.verFicha('${itemString}')" style="background:#e7f1ff; color:#0056b3; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">📄 Ver Ficha Completa</button>
                    </div>`;
            }
        }).join("");

    } catch(e) { console.error(e); timeline.innerHTML = "Erro ao carregar."; }
}

function abrirFormulario() {
    const pacienteId = document.getElementById("selPaciente").value;
    if (!pacienteId) { showToast("Selecione um Paciente!", "info"); return; }

    const tipo = document.getElementById("selTipoRegistro").value;
    const container = document.getElementById("conteudoFormulario");
    
    document.getElementById("areaCriacao").style.display = "block";
    document.getElementById("tituloCriacao").innerText = tipo === 'Evolucao' ? "Nova Evolução" : "Ficha: " + tipo;

    if (tipo === 'Evolucao') {
        // FORMULÁRIO EVOLUÇÃO
        const renderSecao = (titulo, prefixo) => `
            <div style="flex:1; border:1px solid #ddd; padding:10px; border-radius:6px; min-width:250px;">
                <h5 style="color:#007bff; border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:10px;">${titulo}</h5>
                <label>Dor (EVA 0-10):</label>
                <div style="display:flex; gap:5px; margin-bottom:10px;">
                    <input type="number" name="${prefixo}_eva" min="0" max="10" style="width:60px; padding:5px;" placeholder="0">
                    <input type="text" name="${prefixo}_eva_local" placeholder="Local da dor" style="flex:1; padding:5px;">
                </div>
                <label style="font-weight:bold; font-size:0.8rem;">Força (MRC): <button type="button" onclick="window.addLinhaMRC('${prefixo}')" style="background:#e7f1ff; color:#007bff; border:none;">+ Add</button></label>
                <div id="container-mrc-${prefixo}"></div>
                <label style="font-weight:bold; font-size:0.8rem; margin-top:10px;">ADM (Goniometria): <button type="button" onclick="window.addLinhaADM('${prefixo}')" style="background:#e7f1ff; color:#007bff; border:none;">+ Add</button></label>
                <div id="container-adm-${prefixo}"></div>
            </div>`;
        
        container.innerHTML = `
            <label>Descrição Geral:</label>
            <textarea name="descricao" rows="3" class="u-full-width" required></textarea>
            <div style="display:flex; gap:15px; margin-top:15px; flex-wrap:wrap;">${renderSecao("ANTES (Pré)", "pre")}${renderSecao("DEPOIS (Pós)", "pos")}</div>
        `;
    } else {
        // FORMULÁRIO FICHAS (TEMPLATES)
        const template = templates[tipo];
        if (template) {
            container.innerHTML = template;
            // Ativa aba 1 se existir
            setTimeout(() => { if(window.mudarAba) window.mudarAba(1); }, 100);
        } else {
            container.innerHTML = "<p style='color:red'>Erro: Template não encontrado. Verifique o arquivo templates.js</p>";
        }
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
            const desc = formData.get("descricao");
            const getListas = (prefixo) => {
                const musculos = formData.getAll(`${prefixo}_mrc_musculo[]`);
                const ladosMrc = formData.getAll(`${prefixo}_mrc_lado[]`);
                const grausMrc = formData.getAll(`${prefixo}_mrc_grau[]`);
                const arts = formData.getAll(`${prefixo}_adm_art[]`);
                const ladosAdm = formData.getAll(`${prefixo}_adm_lado[]`);
                const grausAdm = formData.getAll(`${prefixo}_adm_grau[]`);
                const mrc = musculos.map((m, i) => ({ m, l: ladosMrc[i], g: grausMrc[i] })).filter(x => x.m);
                const adm = arts.map((a, i) => ({ a, l: ladosAdm[i], g: grausAdm[i] })).filter(x => x.a);
                return { eva: formData.get(`${prefixo}_eva`), eva_local: formData.get(`${prefixo}_eva_local`), mrc, adm };
            };
            const dadosExtras = { pre: getListas("pre"), pos: getListas("pos") };

            await authFetch("/evolutions/", {
                method: "POST",
                body: JSON.stringify({ patient_id: pacienteId, description: desc, content: dadosExtras })
            });
        } else {
            // Lógica para tratar os dados complexos das fichas (checkboxes, etc)
            const conteudoJSON = {};
            formData.forEach((value, key) => {
                if(conteudoJSON[key]) {
                    if(!Array.isArray(conteudoJSON[key])) conteudoJSON[key] = [conteudoJSON[key]];
                    conteudoJSON[key].push(value);
                } else {
                    conteudoJSON[key] = value;
                }
            });

            await authFetch("/assessments/", {
                method: "POST",
                body: JSON.stringify({ patient_id: pacienteId, specialty: tipo, content: conteudoJSON })
            });
        }
        showToast("Salvo com sucesso!", "success");
        document.getElementById("areaCriacao").style.display = "none";
        carregarTimeline(); 
    } catch (e) { showToast("Erro ao salvar.", "error"); }
}

// --- FUNÇÕES GLOBAIS NECESSÁRIAS ---
window.addLinhaMRC = (prefixo) => {
    const div = document.createElement('div');
    div.style.cssText = "display:flex; gap:5px; margin-bottom:5px;";
    div.innerHTML = `<input type="text" name="${prefixo}_mrc_musculo[]" placeholder="Músculo" style="flex:2;"><select name="${prefixo}_mrc_lado[]" style="flex:1;"><option value="D">D</option><option value="E">E</option></select><select name="${prefixo}_mrc_grau[]" style="flex:1;"><option value="5">5</option><option value="4">4</option></select><button type="button" onclick="this.parentElement.remove()" style="color:red;">X</button>`;
    document.getElementById(`container-mrc-${prefixo}`).appendChild(div);
};
window.addLinhaADM = (prefixo) => {
    const div = document.createElement('div');
    div.style.cssText = "display:flex; gap:5px; margin-bottom:5px;";
    div.innerHTML = `<input type="text" name="${prefixo}_adm_art[]" placeholder="Articulação" style="flex:2;"><select name="${prefixo}_adm_lado[]" style="flex:1;"><option value="D">D</option><option value="E">E</option></select><input type="text" name="${prefixo}_adm_grau[]" placeholder="Grau" style="flex:1;"><button type="button" onclick="this.parentElement.remove()" style="color:red;">X</button>`;
    document.getElementById(`container-adm-${prefixo}`).appendChild(div);
};
// (Mantenha imprimirRegistro, verFicha e deletarItemProntuario iguais ao anterior)
window.imprimirRegistro = (jsonString) => { /* ... código do PDF ... */ };
window.verFicha = (jsonString) => { /* ... código ver ficha ... */ };
window.deletarItemProntuario = async (endpoint, id) => { /* ... código deletar ... */ };
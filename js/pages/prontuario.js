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

  document.getElementById("selPaciente").onchange = carregarTimeline;
  document.getElementById("btnNovoRegistro").onclick = abrirFormulario;
  document.getElementById("btnFecharCriacao").onclick = () => document.getElementById("areaCriacao").style.display = "none";
  document.getElementById("formProntuario").onsubmit = salvarRegistro;
}

// LÓGICA
async function carregarPacientes() {
    try {
        const lista = await authFetch("/patients/");
        const select = document.getElementById("selPaciente");
        if (lista.length === 0) select.innerHTML = '<option value="">Sem pacientes</option>';
        else select.innerHTML = `<option value="">-- Selecione --</option>` + lista.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    } catch(e) { showToast("Erro ao carregar pacientes", "error"); }
}

async function carregarTimeline() {
    const pacienteId = document.getElementById("selPaciente").value;
    const timeline = document.getElementById("timeline");
    if (!pacienteId) { timeline.innerHTML = ""; return; }

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
            const ehEvolucao = item.tipo === 'Evolução';
            const itemString = encodeURIComponent(JSON.stringify(item)); // Para passar para o PDF
            
            let conteudo = "";
            if (ehEvolucao) {
                conteudo = `<p style="white-space: pre-wrap; color: #333; margin-bottom:10px;">${item.description}</p>`;
                if (item.content) {
                    const c = item.content;
                    conteudo += `<div style="background:#f8f9fa; padding:10px; border-radius:6px; font-size:0.9rem; border:1px solid #eee;">`;
                    
                    const renderLinha = (t, dados) => {
                        let txt = `<strong>${t}</strong>: `;
                        if(dados.eva) txt += `Dor ${dados.eva}/10 (${dados.eva_local || ''}) `;
                        if(dados.mrc && dados.mrc.length) txt += `| Força: ${dados.mrc.map(m=>`${m.m} G${m.g}`).join(', ')} `;
                        if(dados.adm && dados.adm.length) txt += `| ADM: ${dados.adm.map(a=>`${a.a} ${a.g}`).join(', ')}`;
                        return txt + "<br>";
                    };
                    
                    if(c.pre) conteudo += renderLinha("Pré", c.pre);
                    if(c.pos) conteudo += renderLinha("Pós", c.pos);
                    conteudo += `</div>`;
                }
            } else {
                conteudo = `<button type="button" onclick="window.verFicha('${itemString}')" style="background:#e7f1ff; color:#0056b3; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">📄 Ver Ficha Completa</button>`;
            }

            const endpointDelete = ehEvolucao ? 'evolutions' : 'assessments';

            return `
                <div class="card" style="margin-bottom: 15px; padding: 15px; border-left: 5px solid ${ehEvolucao ? '#28a745' : '#007bff'}; position:relative;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <strong style="color:${ehEvolucao ? '#28a745' : '#007bff'}; text-transform:uppercase; font-size:0.85rem;">${item.tipo}</strong>
                        <div>
                            <button onclick="window.imprimirRegistro('${itemString}')" style="background:none; border:none; cursor:pointer; font-size:1.2rem; margin-right:10px;" title="Imprimir PDF">🖨️</button>
                            <button onclick="window.deletarItemProntuario('${endpointDelete}', ${item.id})" style="background:none; border:none; color:#dc3545; cursor:pointer;" title="Excluir">🗑️</button>
                        </div>
                    </div>
                    <small style="color:#888; display:block; margin-bottom:10px;">${dataFormatada}</small>
                    ${conteudo}
                </div>
            `;
        }).join("");

    } catch(e) {
        console.error(e);
        timeline.innerHTML = "Erro ao carregar histórico.";
    }
}

// ... (abrirFormulario e salvarRegistro MANTIDOS IGUAIS - Omitidos para economizar espaço, mas você deve manter o código anterior aqui) ...
function abrirFormulario() {
    const pacienteId = document.getElementById("selPaciente").value;
    if (!pacienteId) { showToast("Selecione um Paciente!", "info"); return; }

    const tipo = document.getElementById("selTipoRegistro").value;
    const container = document.getElementById("conteudoFormulario");
    
    document.getElementById("areaCriacao").style.display = "block";
    document.getElementById("tituloCriacao").innerText = tipo === 'Evolucao' ? "Nova Evolução" : "Ficha: " + tipo;

    if (tipo === 'Evolucao') {
        const renderSecao = (titulo, prefixo) => `
            <div style="flex:1; border:1px solid #ddd; padding:10px; border-radius:6px; min-width:250px;">
                <h5 style="color:#007bff; border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:10px;">${titulo}</h5>
                <label>Dor (EVA 0-10):</label>
                <div style="display:flex; gap:5px; margin-bottom:10px;">
                    <input type="number" name="${prefixo}_eva" min="0" max="10" style="width:60px; padding:5px;" placeholder="0">
                    <input type="text" name="${prefixo}_eva_local" placeholder="Local da dor" style="flex:1; padding:5px;">
                </div>
                <label style="font-weight:bold; font-size:0.8rem;">Força (MRC): 
                    <button type="button" onclick="window.addLinhaMRC('${prefixo}')" style="background:#e7f1ff; color:#007bff; border:none; border-radius:4px; cursor:pointer;">+ Add</button>
                </label>
                <div id="container-mrc-${prefixo}"></div>
                <label style="font-weight:bold; font-size:0.8rem; margin-top:10px;">ADM (Goniometria): 
                    <button type="button" onclick="window.addLinhaADM('${prefixo}')" style="background:#e7f1ff; color:#007bff; border:none; border-radius:4px; cursor:pointer;">+ Add</button>
                </label>
                <div id="container-adm-${prefixo}"></div>
            </div>
        `;
        container.innerHTML = `
            <label>Descrição Geral:</label>
            <textarea name="descricao" rows="3" class="u-full-width" placeholder="Relato e conduta..." required style="padding:10px; border:1px solid #ddd; border-radius:6px;"></textarea>
            <div style="display:flex; gap:15px; margin-top:15px; flex-wrap:wrap;">
                ${renderSecao("ANTES (Pré)", "pre")}
                ${renderSecao("DEPOIS (Pós)", "pos")}
            </div>
        `;
    } else {
        container.innerHTML = templates[tipo] || "<p>Template não encontrado.</p>";
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
            const conteudoJSON = Object.fromEntries(formData.entries());
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

// --- FUNÇÃO DE IMPRESSÃO PDF (A MÁGICA) ---
window.imprimirRegistro = (jsonString) => {
    const item = JSON.parse(decodeURIComponent(jsonString));
    const selPaciente = document.getElementById("selPaciente");
    const nomePaciente = selPaciente.options[selPaciente.selectedIndex].text;
    
    // Busca dados da clínica salvos
    const conf = JSON.parse(localStorage.getItem("fisio_config_clinica") || "{}");
    const clinicaNome = conf.nome || "FisioManager";
    const clinicaEnd = conf.endereco || "";

    // Monta o HTML do Relatório
    let corpoRelatorio = "";
    
    if (item.tipo === 'Evolução') {
        corpoRelatorio = `<p><strong>Descrição:</strong><br>${item.description.replace(/\n/g, '<br>')}</p>`;
        if (item.content) {
            const renderBloco = (t, d) => {
                if(!d) return "";
                let h = `<div style="margin-top:10px; padding:5px; border:1px solid #ccc;"><strong>${t}</strong><br>`;
                if(d.eva) h+= `EVA: ${d.eva} (${d.eva_local})<br>`;
                if(d.mrc && d.mrc.length) h+= `Força: ${d.mrc.map(m=>`${m.m} ${m.g}`).join(', ')}<br>`;
                if(d.adm && d.adm.length) h+= `ADM: ${d.adm.map(a=>`${a.a} ${a.g}`).join(', ')}`;
                return h + "</div>";
            };
            corpoRelatorio += `<div style="display:flex; gap:10px;">${renderBloco("PRÉ", item.content.pre)}${renderBloco("PÓS", item.content.pos)}</div>`;
        }
    } else {
        // Ficha
        corpoRelatorio += "<ul>";
        for (const [key, val] of Object.entries(item.content)) {
            if(val) corpoRelatorio += `<li><strong>${key}:</strong> ${val}</li>`;
        }
        corpoRelatorio += "</ul>";
    }

    // Elemento invisível para gerar o PDF
    const elemento = document.createElement('div');
    elemento.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="margin:0;">${clinicaNome}</h1>
                <small>${clinicaEnd}</small>
            </div>
            <h3>Relatório: ${item.tipo || item.specialty}</h3>
            <p><strong>Paciente:</strong> ${nomePaciente}</p>
            <p><strong>Data:</strong> ${new Date(item.date || item.dataReal).toLocaleString('pt-BR')}</p>
            <hr>
            <div style="font-size: 14px; line-height: 1.5;">
                ${corpoRelatorio}
            </div>
            <div style="margin-top: 50px; text-align: center; border-top: 1px solid #000; width: 200px; margin-left: auto; margin-right: auto; padding-top: 5px;">
                Assinatura
            </div>
        </div>
    `;

    // Gera o PDF
    html2pdf().from(elemento).save(`Relatorio_${nomePaciente}.pdf`);
};

window.verFicha = (jsonString) => {
    const item = JSON.parse(decodeURIComponent(jsonString));
    const container = document.getElementById("conteudoFormulario");
    document.getElementById("areaCriacao").style.display = "block";
    document.getElementById("tituloCriacao").innerText = `Visualizando: ${item.specialty}`;
    container.innerHTML = templates[item.specialty] || "Erro template";
    setTimeout(() => {
        for (const [key, value] of Object.entries(item.content)) {
            const el = document.getElementsByName(key)[0];
            if (el) el.value = value;
        }
    }, 50);
    document.getElementById("areaCriacao").scrollIntoView({ behavior: 'smooth' });
};

window.deletarItemProntuario = async (endpoint, id) => {
    if(!confirm("Apagar este registro?")) return;
    try {
        await authFetch(`/${endpoint}/${id}`, { method: "DELETE" });
        showToast("Apagado.", "info");
        carregarTimeline();
    } catch(e) {
        showToast("Erro ao apagar.", "error");
    }
};
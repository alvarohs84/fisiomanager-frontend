import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";
import { templates } from "./avaliacoes_templates.js";
import { ativarVoz } from "../core/voice.js";

let chartInstance = null;

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
            <div style="display:flex; align-items:center;">
                <textarea id="diagMedico" rows="2" class="u-full-width" style="font-size:0.85rem; border:1px solid #ccc;"></textarea>
            </div>
            
            <label style="font-size:0.8rem; font-weight:bold; color:#0056b3; margin-top:5px;">Diag. Cinético-Funcional:</label>
            <div style="display:flex; align-items:center;">
                <textarea id="diagFuncional" rows="3" class="u-full-width" style="font-size:0.85rem; border:1px solid #ccc;"></textarea>
            </div>
            
            <button id="btnSalvarDiagnosticos" style="width:100%; margin-top:5px; background:#6c757d; color:white; border:none; border-radius:4px; cursor:pointer; padding:5px; font-size:0.8rem;">Atualizar Diagnósticos</button>
          </div>

          <div id="areaGraficos" style="display:none; margin-bottom: 20px;">
              <button id="btnVerGrafico" style="width: 100%; margin-bottom: 10px; background: #6610f2; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                📈 Evolução da Dor (EVA)
              </button>
              <button id="btnVerGraficoTC6" style="width: 100%; background: #17a2b8; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                🚶 Evolução TC6 (Caminhada)
              </button>
          </div>

          <hr style="margin-bottom: 20px;">

          <h4>Novo Registro</h4>
          <label>Tipo:</label>
          <select id="selTipoRegistro" style="width: 100%; margin-bottom: 10px; padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="Evolucao">📝 Evolução Diária (Sessão)</option>
            <option value="Ortopedica">🦴 Ficha Ortopédica</option>
            <option value="NeuroAdulto">🧠 Ficha Neuro Adulto</option>
            <option value="NeuroPediatrica">👶 Ficha Neuro Pediátrica</option>
            <option value="Respiratoria e Reabilitação Cardiopulmonar">🫁 Ficha Respiratória</option>
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

    <div id="modalGrafico" style="display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7);">
      <div style="background-color: #fff; margin: 5% auto; padding: 20px; border-radius: 10px; width: 90%; max-width: 800px; position: relative;">
        <button id="btnFecharGrafico" style="position: absolute; right: 15px; top: 10px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #555;">&times;</button>
        <h3 id="tituloModalGrafico" style="margin-bottom: 20px;">Gráfico</h3>
        <div style="height: 400px;">
            <canvas id="chartCanvas"></canvas>
        </div>
      </div>
    </div>

    <style>@media(max-width:768px){.grid-mobile{grid-template-columns:1fr !important;}}</style>
  `;

  renderLayout(html);
  await carregarPacientes();

  // Eventos Principais
  document.getElementById("selPaciente").onchange = aoMudarPaciente;
  document.getElementById("btnNovoRegistro").onclick = abrirFormulario;
  document.getElementById("btnFecharCriacao").onclick = () => document.getElementById("areaCriacao").style.display = "none";
  document.getElementById("formProntuario").onsubmit = salvarRegistro;
  document.getElementById("btnSalvarDiagnosticos").onclick = salvarDiagnosticosPaciente;
  
  // Eventos Gráficos
  document.getElementById("btnVerGrafico").onclick = () => abrirModalGrafico("EVA");
  document.getElementById("btnVerGraficoTC6").onclick = () => abrirModalGrafico("TC6");
  document.getElementById("btnFecharGrafico").onclick = () => document.getElementById("modalGrafico").style.display = "none";

  // Ativa voz nos diagnósticos
  ativarVoz("diagMedico");
  ativarVoz("diagFuncional");
}

// --- LÓGICA ---

async function carregarPacientes() {
    try {
        const lista = await authFetch("/patients/");
        const select = document.getElementById("selPaciente");
        if (lista.length === 0) select.innerHTML = '<option value="">Sem pacientes</option>';
        else select.innerHTML = `<option value="">-- Selecione --</option>` + lista.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    } catch(e) { showToast("Erro ao carregar pacientes", "error"); }
}

async function aoMudarPaciente() {
    const id = document.getElementById("selPaciente").value;
    
    if(!id) {
        document.getElementById("areaDiagnosticos").style.display = "none";
        document.getElementById("areaGraficos").style.display = "none";
        document.getElementById("timeline").innerHTML = "";
        return;
    }

    try {
        const paciente = await authFetch(`/patients/${id}`);
        document.getElementById("diagMedico").value = paciente.medical_diagnosis || "";
        document.getElementById("diagFuncional").value = paciente.functional_diagnosis || "";
        document.getElementById("areaDiagnosticos").style.display = "block";
        document.getElementById("areaGraficos").style.display = "block";
    } catch(e) { console.error(e); }

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
                            <strong style="color:#555; text-transform:uppercase;">${titulo}</strong><hr style="margin:5px 0;">`;
                        if(dados.eva) html += `<div>Dor: <span style="font-weight:bold; color:${dados.eva > 5 ? 'red':'green'}">${dados.eva}</span> <small>(${dados.eva_local || ''})</small></div>`;
                        if(dados.mrc && dados.mrc.length) html += `<div>Força: ${dados.mrc.map(m=>`${m.m} G${m.g}`).join(', ')}</div>`;
                        if(dados.adm && dados.adm.length) html += `<div>ADM: ${dados.adm.map(a=>`${a.a} ${a.g}`).join(', ')}</div>`;
                        return html + "</div>";
                    };
                    conteudo += `<div style="display:flex; gap:10px; background:#f8f9fa; padding:10px; border-radius:6px; flex-wrap:wrap;">${renderBloco("PRÉ SESSÃO", c.pre)}${renderBloco("PÓS SESSÃO", c.pos)}</div>`;
                }

                return `
                    <div class="card" style="margin-bottom:15px; padding:15px; border-left:5px solid #28a745; position:relative;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <strong style="color:#28a745;">EVOLUÇÃO DIÁRIA</strong>
                            <div>
                                <button onclick="window.imprimirRegistro('${itemString}')" style="background:none; border:none; cursor:pointer; font-size:1.2rem; margin-right:10px;" title="Imprimir PDF">🖨️</button>
                                <button onclick="window.deletarItemProntuario('evolutions', ${item.id})" style="background:none; border:none; color:#dc3545; cursor:pointer;" title="Excluir">🗑️</button>
                            </div>
                        </div>
                        <small style="color:#888; display:block; margin-bottom:10px;">${dataFormatada}</small>
                        ${conteudo}
                    </div>`;
            } else {
                // FICHA
                return `
                    <div class="card" style="margin-bottom:15px; padding:15px; border-left:5px solid #007bff; position:relative;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <strong style="color:#007bff;">FICHA: ${item.specialty}</strong>
                            <div>
                                <button onclick="window.imprimirRegistro('${itemString}')" style="background:none; border:none; cursor:pointer; font-size:1.2rem; margin-right:10px;" title="Imprimir PDF">🖨️</button>
                                <button onclick="window.deletarItemProntuario('assessments', ${item.id})" style="background:none; border:none; color:#dc3545; cursor:pointer;">🗑️</button>
                            </div>
                        </div>
                        <small style="color:#888; display:block; margin-bottom:10px;">${dataFormatada}</small>
                        <button onclick="window.verFicha('${itemString}')" style="background:#e7f1ff; color:#0056b3; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">📄 Ver Ficha Completa</button>
                    </div>`;
            }
        }).join("");

    } catch(e) { console.error(e); timeline.innerHTML = "Erro ao carregar histórico."; }
}

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
                <label style="font-weight:bold; font-size:0.8rem;">Força (MRC): <button type="button" onclick="window.addLinhaMRC('${prefixo}')" style="background:#e7f1ff; color:#007bff; border:none;">+ Add</button></label>
                <div id="container-mrc-${prefixo}"></div>
                <label style="font-weight:bold; font-size:0.8rem; margin-top:10px;">ADM (Goniometria): <button type="button" onclick="window.addLinhaADM('${prefixo}')" style="background:#e7f1ff; color:#007bff; border:none;">+ Add</button></label>
                <div id="container-adm-${prefixo}"></div>
            </div>`;
        container.innerHTML = `
            <label>Descrição Geral:</label>
            <div style="display:flex; align-items:center;">
                <textarea id="evoDescricao" name="descricao" rows="3" class="u-full-width" placeholder="Relato e conduta..." required style="padding:10px; border:1px solid #ddd; border-radius:6px;"></textarea>
            </div>
            <div style="display:flex; gap:15px; margin-top:15px; flex-wrap:wrap;">${renderSecao("ANTES (Pré)", "pre")}${renderSecao("DEPOIS (Pós)", "pos")}</div>
        `;
        ativarVoz("evoDescricao");
    } else {
        container.innerHTML = templates[tipo] || "<p>Template não encontrado.</p>";
        // Ativa calculo automatico se for TC6
        if(tipo === 'Cardiovascular' && window.calcularTC6) setTimeout(window.calcularTC6, 500);
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
        showToast("Salvo!", "success");
        document.getElementById("areaCriacao").style.display = "none";
        carregarTimeline(); 
    } catch (e) { showToast("Erro ao salvar.", "error"); }
}

// --- FUNÇÃO: GERAR GRÁFICOS (DOR E TC6) ---
async function abrirModalGrafico(tipo) {
    const pacienteId = document.getElementById("selPaciente").value;
    if(!pacienteId) return;

    const modal = document.getElementById("modalGrafico");
    const titulo = document.getElementById("tituloModalGrafico");
    modal.style.display = "block";
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    try {
        if (tipo === 'EVA') {
            // GRÁFICO DE DOR
            titulo.innerText = "Evolução da Dor (EVA)";
            const evolucoes = await authFetch(`/evolutions/?patient_id=${pacienteId}`);
            evolucoes.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            const labels = []; const dataPre = []; const dataPos = [];
            evolucoes.forEach(ev => {
                if(ev.content && (ev.content.pre?.eva || ev.content.pos?.eva)) {
                    labels.push(new Date(ev.date).toLocaleDateString('pt-BR'));
                    dataPre.push(ev.content.pre?.eva || 0);
                    dataPos.push(ev.content.pos?.eva || 0);
                }
            });

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'Dor Pré', data: dataPre, borderColor: '#dc3545', borderWidth: 2 },
                        { label: 'Dor Pós', data: dataPos, borderColor: '#28a745', borderWidth: 2 }
                    ]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true, max: 10 } } }
            });

        } else if (tipo === 'TC6') {
            // GRÁFICO DE TC6
            titulo.innerText = "Evolução TC6 (Caminhada)";
            const avaliacoes = await authFetch(`/assessments/?patient_id=${pacienteId}`);
            
            // Filtra fichas Cardio/Respiratória com TC6
            const testesTC6 = avaliacoes.filter(av => 
                (av.specialty === 'Cardiovascular' || av.specialty === 'Respiratoria') && 
                av.content && av.content.tc6_distancia
            );
            testesTC6.sort((a, b) => new Date(a.date) - new Date(b.date));

            const labels = testesTC6.map(t => new Date(t.date).toLocaleDateString('pt-BR'));
            const dadosDist = testesTC6.map(t => parseFloat(t.content.tc6_distancia));
            const dadosPrev = testesTC6.map(t => parseFloat(t.content.tc6_previsto) || 0);

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'Percorrido (m)', data: dadosDist, borderColor: '#007bff', backgroundColor: 'rgba(0,123,255,0.1)', fill: true },
                        { label: 'Previsto', data: dadosPrev, borderColor: '#6c757d', borderDash: [5,5], fill: false }
                    ]
                },
                options: { responsive: true }
            });
        }

    } catch(e) {
        console.error(e);
        showToast("Erro ao gerar gráfico", "error");
    }
}

// Funções Globais Auxiliares
window.addLinhaMRC = (prefixo) => {
    const div = document.createElement('div');
    div.style.cssText = "display:flex; gap:5px; margin-bottom:5px;";
    div.innerHTML = `<input type="text" name="${prefixo}_mrc_musculo[]" placeholder="Músculo" style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;"><select name="${prefixo}_mrc_lado[]" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;"><option value="D">D</option><option value="E">E</option></select><select name="${prefixo}_mrc_grau[]" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;"><option value="5">5</option><option value="4">4</option></select><button type="button" onclick="this.parentElement.remove()" style="color:red; border:none;">X</button>`;
    document.getElementById(`container-mrc-${prefixo}`).appendChild(div);
};
window.addLinhaADM = (prefixo) => {
    const div = document.createElement('div');
    div.style.cssText = "display:flex; gap:5px; margin-bottom:5px;";
    div.innerHTML = `<input type="text" name="${prefixo}_adm_art[]" placeholder="Articulação" style="flex:2; padding:5px; border:1px solid #ddd; border-radius:4px;"><select name="${prefixo}_adm_lado[]" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;"><option value="D">D</option><option value="E">E</option></select><input type="text" name="${prefixo}_adm_grau[]" placeholder="Grau" style="flex:1; padding:5px; border:1px solid #ddd; border-radius:4px;"><button type="button" onclick="this.parentElement.remove()" style="color:red; border:none;">X</button>`;
    document.getElementById(`container-adm-${prefixo}`).appendChild(div);
};
window.imprimirRegistro = (jsonString) => {
    const item = JSON.parse(decodeURIComponent(jsonString));
    const selPaciente = document.getElementById("selPaciente");
    const nomePaciente = selPaciente.options[selPaciente.selectedIndex].text;
    const conf = JSON.parse(localStorage.getItem("fisio_config_clinica") || "{}");
    let corpo = "";
    if (item.tipo === 'Evolução') {
        corpo = `<p><strong>Descrição:</strong><br>${item.description.replace(/\n/g, '<br>')}</p>`;
        if(item.content) corpo += `<hr><p><i>(Dados detalhados salvos no sistema)</i></p>`;
    } else {
        corpo += "<ul>";
        for (const [k, v] of Object.entries(item.content)) if(v) corpo += `<li><strong>${k}:</strong> ${v}</li>`;
        corpo += "</ul>";
    }
    const el = document.createElement('div');
    el.innerHTML = `<div style="padding:20px; font-family:Arial;"><div style="text-align:center; border-bottom:1px solid #333; margin-bottom:20px;"><h1>${conf.nome||"FisioManager"}</h1></div><h3>${item.tipo||item.specialty}</h3><p><strong>Paciente:</strong> ${nomePaciente}</p><p><strong>Data:</strong> ${new Date(item.date||item.dataReal).toLocaleString('pt-BR')}</p><hr>${corpo}</div>`;
    html2pdf().from(el).save(`Relatorio.pdf`);
};
window.verFicha = (jsonString) => {
    const item = JSON.parse(decodeURIComponent(jsonString));
    document.getElementById("areaCriacao").style.display = "block";
    document.getElementById("tituloCriacao").innerText = `Visualizando: ${item.specialty}`;
    document.getElementById("conteudoFormulario").innerHTML = templates[item.specialty] || "Erro";
    setTimeout(() => {
        for (const [k, v] of Object.entries(item.content)) {
            const el = document.getElementsByName(k)[0];
            if(el) {
                if(el.type!=='checkbox' && el.type!=='radio') el.value = v;
                else if(Array.isArray(v)) v.forEach(val=>{ if(document.querySelector(`input[name="${k}"][value="${val}"]`)) document.querySelector(`input[name="${k}"][value="${val}"]`).checked=true; });
            }
        }
        if(window.mudarAba) window.mudarAba(1);
    }, 100);
    document.getElementById("areaCriacao").scrollIntoView({ behavior: 'smooth' });
};
window.deletarItemProntuario = async (endpoint, id) => {
    if(!confirm("Apagar?")) return;
    try { await authFetch(`/${endpoint}/${id}`, { method: "DELETE" }); showToast("Apagado.", "info"); carregarTimeline(); } catch(e) { showToast("Erro.", "error"); }
};
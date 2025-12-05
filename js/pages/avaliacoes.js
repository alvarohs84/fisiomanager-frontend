import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";
import { templates } from "./avaliacoes_templates.js";

export async function renderAvaliacoes() {
  const html = `
    <div class="container">
      <h2>📋 Avaliações e Prontuário</h2>
      
      <div style="display: grid; grid-template-columns: 300px 1fr; gap: 20px; margin-top: 20px;" class="grid-mobile">
        
        <div class="card" style="height: fit-content;">
          <h3>Nova Avaliação</h3>
          
          <label>Paciente</label>
          <select id="selPaciente" style="width: 100%; margin-bottom: 15px; padding: 10px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="">Carregando...</option>
          </select>

          <label>Modelo de Ficha</label>
          <select id="selEspecialidade" style="width: 100%; margin-bottom: 20px; padding: 10px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="Ortopedica">Ortopédica / Traumatológica</option>
            <option value="NeuroAdulto">Neurofuncional (Adulto)</option>
            <option value="NeuroPediatrica">Neurofuncional (Pediátrica)</option>
            <option value="Respiratoria">Respiratória / TC6</option>
            <option value="Cardiovascular">Cardiovascular / Metabólica</option>
            <option value="Uroginecologica">Uroginecológica</option>
            <option value="Dermatofuncional">Dermatofuncional</option>
            <option value="Esportiva">Esportiva</option>
            <option value="Geriatrica">Geriátrica</option>
            <option value="Ergonomia">Ergonomia</option>
          </select>

          <button id="btnCriarFicha" class="btn-primary" style="width: 100%;">Abrir Ficha</button>
          
          <hr style="margin: 20px 0;">
          
          <h4>Histórico</h4>
          <div id="listaHistorico" style="max-height: 400px; overflow-y: auto; font-size: 0.9rem;">
            <p style="color:#777;">Selecione um paciente.</p>
          </div>
        </div>

        <div class="card" id="areaFormulario" style="display: none; min-height: 600px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 id="tituloFicha" style="margin: 0; color: #007bff;">Ficha</h3>
                <button id="btnFecharFicha" style="border:none; background:none; cursor:pointer; font-size: 1.2rem; color: #dc3545;">❌</button>
            </div>
            <hr>
            
            <form id="formAvaliacao">
                <div id="conteudoDinamico"></div>
                
                <hr style="margin-top: 20px;">
                <div style="text-align: right; margin-top: 15px;">
                    <button type="submit" class="btn-primary" style="padding: 10px 30px;">💾 Salvar Prontuário</button>
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

// --- FUNÇÕES GLOBAIS AUXILIARES ---

// 1. Navegação de Abas
window.mudarAba = (n) => {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const content = document.getElementById(`tab-${n}`);
    if (content) content.style.display = 'block';
    
    const btns = document.querySelectorAll('.tab-btn');
    if(btns[n-1]) btns[n-1].classList.add('active');
};

// 2. Calculadora IMC (Para fichas que usam)
window.calcIMC = () => {
    const p = parseFloat(document.getElementById('peso').value);
    const a = parseFloat(document.getElementById('altura').value);
    if (p > 0 && a > 0) {
        const imc = p / (a * a);
        const el = document.getElementById('imc');
        if(el) el.value = imc.toFixed(2);
    }
};

// 3. CALCULADORA AUTOMÁTICA TC6 (NOVO!)
window.calcularTC6 = () => {
    const sexo = document.getElementById("tc6_sexo").value;
    const idade = parseFloat(document.getElementById("tc6_idade").value);
    const alturaCm = parseFloat(document.getElementById("tc6_altura").value);
    const peso = parseFloat(document.getElementById("tc6_peso").value);
    const distanciaPercorrida = parseFloat(document.getElementById("tc6_distancia").value);

    const campoPrevisto = document.getElementById("tc6_previsto");
    const campoPorcentagem = document.getElementById("tc6_porcentagem");

    if (sexo && idade && alturaCm && peso) {
        let distanciaPrevista = 0;

        // Fórmulas de Enright & Sherrill (1998)
        if (sexo === "M") {
            distanciaPrevista = (7.57 * alturaCm) - (5.02 * idade) - (1.76 * peso) - 309;
        } else {
            distanciaPrevista = (2.11 * alturaCm) - (2.29 * peso) - (5.78 * idade) + 667;
        }

        distanciaPrevista = Math.round(distanciaPrevista);
        
        if(campoPrevisto) campoPrevisto.value = distanciaPrevista;

        if (distanciaPercorrida && campoPorcentagem) {
            const porcentagem = (distanciaPercorrida / distanciaPrevista) * 100;
            campoPorcentagem.value = porcentagem.toFixed(1) + "%";
        } else if(campoPorcentagem) {
            campoPorcentagem.value = "";
        }
    }
};


// --- LÓGICA PRINCIPAL ---

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

    if (!pacienteId) {
        showToast("Selecione um Paciente!", "info");
        return;
    }

    const templateHTML = templates[tipo];
    
    if (!templateHTML) {
        showToast("Template não encontrado para: " + tipo, "error");
        return;
    }

    document.getElementById("conteudoDinamico").innerHTML = templateHTML;
    document.getElementById("tituloFicha").innerText = "Ficha: " + tipo;
    document.getElementById("areaFormulario").style.display = "block";
    
    // Inicia na aba 1 se existirem abas
    if(document.getElementById('tab-1')) window.mudarAba(1);
    
    document.getElementById("areaFormulario").scrollIntoView({ behavior: 'smooth' });
}

async function salvarAvaliacao(e) {
    e.preventDefault();
    const pacienteId = document.getElementById("selPaciente").value;
    const tipo = document.getElementById("selEspecialidade").value;
    const form = document.getElementById("formAvaliacao");

    // Coleta dados de inputs, textareas e checkboxes
    const formData = new FormData(form);
    const conteudoJSON = {};
    
    formData.forEach((value, key) => {
        if(conteudoJSON[key]) {
            if(!Array.isArray(conteudoJSON[key])) {
                conteudoJSON[key] = [conteudoJSON[key]];
            }
            conteudoJSON[key].push(value);
        } else {
            conteudoJSON[key] = value;
        }
    });

    try {
        await authFetch("/assessments/", {
            method: "POST",
            body: JSON.stringify({
                patient_id: pacienteId,
                specialty: tipo,
                content: conteudoJSON
            })
        });

        showToast("Salvo com sucesso!", "success");
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
            divLista.innerHTML = "<p style='color:#777; padding:10px;'>Nenhuma ficha encontrada.</p>";
            return;
        }

        divLista.innerHTML = avaliacoes.map(av => {
            const data = new Date(av.date).toLocaleDateString('pt-BR');
            const dadosString = encodeURIComponent(JSON.stringify(av));
            return `
                <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #007bff; cursor: pointer;" onclick="window.verDetalhes('${dadosString}')">
                    <strong style="color:#007bff">${av.specialty}</strong><br>
                    <small>${data}</small>
                    <button onclick="event.stopPropagation(); window.deletarAvaliacao(${av.id})" style="float: right; border:none; background:none; color:#dc3545;">🗑️</button>
                </div>
            `;
        }).join("");
    } catch(e) { divLista.innerHTML = "Erro ao buscar."; }
}

window.verDetalhes = (jsonString) => {
    const av = JSON.parse(decodeURIComponent(jsonString));
    const templateHTML = templates[av.specialty] || "Erro";
    document.getElementById("conteudoDinamico").innerHTML = templateHTML;
    document.getElementById("tituloFicha").innerText = `Visualizando: ${av.specialty}`;
    document.getElementById("areaFormulario").style.display = "block";

    setTimeout(() => {
        // Preenche campos
        for (const [key, value] of Object.entries(av.content)) {
            const el = document.getElementsByName(key)[0];
            if (el) {
                if (el.type !== 'checkbox' && el.type !== 'radio') el.value = value;
            }
            if (Array.isArray(value)) {
                value.forEach(val => {
                    const check = document.querySelector(`input[name="${key}"][value="${val}"]`);
                    if(check) check.checked = true;
                });
            }
        }
        if(document.getElementById('tab-1')) window.mudarAba(1);
    }, 100);
    
    document.getElementById("areaFormulario").scrollIntoView({ behavior: 'smooth' });
};

window.deletarAvaliacao = async (id) => {
    if(!confirm("Apagar?")) return;
    try {
        await authFetch(`/assessments/${id}`, { method: "DELETE" });
        showToast("Apagado.", "info");
        carregarHistorico();
    } catch(e) { showToast("Erro.", "error"); }
};
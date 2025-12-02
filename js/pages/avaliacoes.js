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
          <select id="selPaciente" style="width: 100%; margin-bottom: 15px; padding: 10px;">
            <option value="">Carregando...</option>
          </select>

          <label>Modelo de Ficha</label>
          <select id="selEspecialidade" style="width: 100%; margin-bottom: 20px; padding: 10px;">
            <option value="Completa">Fisioterapia Completa</option>
            <option value="Simplificada">Simplificada / Evolução</option>
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

// --- FUNÇÕES AUXILIARES ---

// 1. Função Global para Abas
window.mudarAba = (n) => {
    // Esconde todos
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    // Mostra o atual
    document.getElementById(`tab-${n}`).style.display = 'block';
    // Ativa botão (gambiarra segura para pegar o botão certo pelo texto ou ordem)
    const btns = document.querySelectorAll('.tab-btn');
    if(btns[n-1]) btns[n-1].classList.add('active');
};

// 2. Calculadora IMC
window.calcIMC = () => {
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    if (peso > 0 && altura > 0) {
        const imc = peso / (altura * altura);
        document.getElementById('imc').value = imc.toFixed(2);
    }
};

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
    document.getElementById("conteudoDinamico").innerHTML = templateHTML || "Erro no template";
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
        // Se já existe (checkbox multiplo), transforma em array
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

    // Preenche campos
    setTimeout(() => {
        // Inputs normais
        for (const [key, value] of Object.entries(av.content)) {
            const el = document.getElementsByName(key)[0];
            // Lida com checkboxes (array) ou valor único
            if (el) {
                if (el.type !== 'checkbox' && el.type !== 'radio') el.value = value;
            }
            // Lida com checkboxes marcados
            if (Array.isArray(value)) {
                value.forEach(val => {
                    const check = document.querySelector(`input[name="${key}"][value="${val}"]`);
                    if(check) check.checked = true;
                });
            }
        }
        // Ativa Aba 1
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
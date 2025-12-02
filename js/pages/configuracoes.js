import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";
import { showToast } from "../core/ui.js";

export function renderConfiguracoes() {
  const html = `
    <div class="container">
      <h2>⚙️ Configurações</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px;" class="grid-mobile">
        
        <div class="card" style="height: fit-content;">
          <h3>🏥 Dados da Clínica</h3>
          <p style="color:#777; font-size:0.9rem; margin-bottom:15px;">
            Estes dados ficam salvos no seu navegador para uso em impressões.
          </p>
          
          <form id="formClinica">
            <label>Nome da Clínica</label>
            <input type="text" id="confNome" class="u-full-width" placeholder="Ex: FisioVida">
            
            <label>Endereço</label>
            <input type="text" id="confEnd" class="u-full-width">
            
            <div style="display:flex; gap:10px;">
                <div style="flex:1;">
                    <label>Telefone</label>
                    <input type="text" id="confTel" class="u-full-width">
                </div>
                <div style="flex:1;">
                    <label>Resp. Técnico</label>
                    <input type="text" id="confResp" class="u-full-width">
                </div>
            </div>

            <div style="text-align: right; margin-top: 15px;">
                <button type="submit" class="btn-primary">Salvar Dados</button>
            </div>
          </form>
        </div>

        <div class="card" style="height: fit-content;">
          <h3>🔒 Alterar Senha</h3>
          <p style="color:#777; font-size:0.9rem; margin-bottom:15px;">
            Cuidado: Ao alterar, você terá que fazer login novamente.
          </p>

          <form id="formSenha">
            <label>Senha Atual</label>
            <input type="password" id="senhaAtual" class="u-full-width" required>
            
            <label>Nova Senha</label>
            <input type="password" id="senhaNova" class="u-full-width" required>
            
            <label>Confirmar Nova Senha</label>
            <input type="password" id="senhaConfirm" class="u-full-width" required>

            <div style="text-align: right; margin-top: 15px;">
                <button type="submit" class="btn-primary" style="background-color: #dc3545; border-color: #dc3545;">Alterar Senha</button>
            </div>
          </form>
        </div>

      </div>
    </div>
    <style>@media(max-width:768px){.grid-mobile{grid-template-columns:1fr !important;}}</style>
  `;

  renderLayout(html);
  
  // Carrega dados salvos
  carregarDadosClinica();

  // Eventos
  document.getElementById("formClinica").addEventListener("submit", salvarClinica);
  document.getElementById("formSenha").addEventListener("submit", alterarSenha);
}

// --- LÓGICA LOCAL (CLÍNICA) ---
function carregarDadosClinica() {
    const dados = localStorage.getItem("fisio_config_clinica");
    if (dados) {
        const obj = JSON.parse(dados);
        document.getElementById("confNome").value = obj.nome || "";
        document.getElementById("confEnd").value = obj.endereco || "";
        document.getElementById("confTel").value = obj.telefone || "";
        document.getElementById("confResp").value = obj.resp || "";
    }
}

function salvarClinica(e) {
    e.preventDefault();
    const dados = {
        nome: document.getElementById("confNome").value,
        endereco: document.getElementById("confEnd").value,
        telefone: document.getElementById("confTel").value,
        resp: document.getElementById("confResp").value
    };
    localStorage.setItem("fisio_config_clinica", JSON.stringify(dados));
    showToast("Dados salvos no navegador!", "success");
}

// --- LÓGICA API (SENHA) ---
async function alterarSenha(e) {
    e.preventDefault();
    const atual = document.getElementById("senhaAtual").value;
    const nova = document.getElementById("senhaNova").value;
    const confirm = document.getElementById("senhaConfirm").value;

    if (nova !== confirm) {
        showToast("As senhas não coincidem.", "error");
        return;
    }
    if (nova.length < 4) {
        showToast("Senha muito curta.", "error");
        return;
    }

    try {
        await authFetch("/users/me/password", {
            method: "PATCH",
            body: JSON.stringify({
                old_password: atual,
                new_password: nova
            })
        });
        
        showToast("Senha alterada! Faça login novamente.", "success");
        setTimeout(() => {
            window.location.reload(); // Força logout indireto ao recarregar com token velho (ou usuário sai)
        }, 2000);

    } catch (erro) {
        showToast("Erro: Senha atual incorreta.", "error");
    }
}
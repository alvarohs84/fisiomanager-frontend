import { renderLayout } from "../core/layout.js";
import { authFetch, getUser } from "../core/auth.js";
import { showToast } from "../core/ui.js";

export function renderConfiguracoes() {
  // Verifica se é admin para mostrar a aba Equipe
  const user = getUser(); // Precisamos implementar isso melhor no auth.js depois
  const isAdmin = true; // Por enquanto libera visualmente, o backend bloqueia se não for

  const html = `
    <div class="container">
      <h2>⚙️ Configurações</h2>
      
      <div class="tab-container" style="margin-top:20px;">
        <button class="tab-btn active" onclick="window.mudarAbaConf(1)">🏥 Clínica</button>
        <button class="tab-btn" onclick="window.mudarAbaConf(2)">🔒 Minha Senha</button>
        <button class="tab-btn" onclick="window.mudarAbaConf(3)">👥 Equipe</button>
      </div>

      <div class="grid-mobile" style="margin-top: 20px;">
        
        <div id="conf-tab-1" class="tab-content active card">
          <h3>Dados da Clínica</h3>
          <form id="formClinica">
            <label>Nome da Clínica</label>
            <input type="text" id="confNome" class="u-full-width">
            <label>Endereço</label>
            <input type="text" id="confEnd" class="u-full-width">
            <div style="display:flex; gap:10px;">
                <div style="flex:1;"><label>Telefone</label><input type="text" id="confTel" class="u-full-width"></div>
                <div style="flex:1;"><label>Resp. Técnico</label><input type="text" id="confResp" class="u-full-width"></div>
            </div>
            <div style="text-align: right; margin-top: 15px;">
                <button type="submit" class="btn-primary">Salvar Dados</button>
            </div>
          </form>
        </div>

        <div id="conf-tab-2" class="tab-content card" style="display:none;">
          <h3>Alterar Senha</h3>
          <form id="formSenha">
            <label>Senha Atual</label><input type="password" id="senhaAtual" class="u-full-width" required>
            <label>Nova Senha</label><input type="password" id="senhaNova" class="u-full-width" required>
            <label>Confirmar</label><input type="password" id="senhaConfirm" class="u-full-width" required>
            <div style="text-align: right; margin-top: 15px;">
                <button type="submit" class="btn-primary" style="background-color: #dc3545; border-color: #dc3545;">Alterar</button>
            </div>
          </form>
        </div>

        <div id="conf-tab-3" class="tab-content card" style="display:none;">
          <h3>Gerenciar Equipe</h3>
          <p style="color:#777; font-size:0.9rem;">Cadastre outros profissionais para acessar o sistema.</p>
          
          <div style="background:#f8f9fa; padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid #eee;">
            <h5>Novo Usuário</h5>
            <form id="formNovoUsuario" style="display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end;">
                <div style="flex:2; min-width:200px;">
                    <label>Nome Completo</label>
                    <input type="text" id="newNome" class="u-full-width" required>
                </div>
                <div style="flex:1; min-width:120px;">
                    <label>Usuário (Login)</label>
                    <input type="text" id="newUser" class="u-full-width" required>
                </div>
                <div style="flex:1; min-width:120px;">
                    <label>Senha</label>
                    <input type="text" id="newPass" class="u-full-width" required>
                </div>
                <div style="flex:1; min-width:120px;">
                    <label>Cargo</label>
                    <select id="newRole" class="u-full-width">
                        <option value="fisio">Fisioterapeuta</option>
                        <option value="recepcao">Recepção</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary" style="height:42px;">+ Adicionar</button>
            </form>
          </div>

          <h4>Lista de Usuários</h4>
          <table width="100%">
            <thead><tr><th>Nome</th><th>Login</th><th>Cargo</th><th>Ação</th></tr></thead>
            <tbody id="listaUsuarios"><tr><td colspan="4">Carregando...</td></tr></tbody>
          </table>
        </div>

      </div>
    </div>
    <style>@media(max-width:768px){.grid-mobile{grid-template-columns:1fr !important;}}</style>
  `;

  renderLayout(html);
  carregarDadosClinica();

  // Eventos
  document.getElementById("formClinica").onsubmit = salvarClinica;
  document.getElementById("formSenha").onsubmit = alterarSenha;
  document.getElementById("formNovoUsuario").onsubmit = criarUsuario;

  // Carregar lista ao abrir (ou ao clicar na aba)
  carregarUsuarios();
}

// LÓGICA DE ABAS
window.mudarAbaConf = (n) => {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`conf-tab-${n}`).style.display = 'block';
    const btns = document.querySelectorAll('.tab-btn');
    if(btns[n-1]) btns[n-1].classList.add('active');
};

// LÓGICA EQUIPE
async function carregarUsuarios() {
    const tbody = document.getElementById("listaUsuarios");
    try {
        const usuarios = await authFetch("/users/");
        tbody.innerHTML = usuarios.map(u => `
            <tr>
                <td>${u.full_name || '-'}</td>
                <td><strong>${u.username}</strong></td>
                <td><span style="background:#e7f1ff; padding:2px 8px; border-radius:10px; font-size:0.8rem;">${u.role}</span></td>
                <td>
                    ${u.username !== 'admin' ? `<button onclick="window.deletarUsuario(${u.id})" style="color:red; border:none; background:none; cursor:pointer;">🗑️</button>` : ''}
                </td>
            </tr>
        `).join("");
    } catch(e) {
        tbody.innerHTML = `<tr><td colspan="4" style="color:red;">Apenas admins podem ver isso.</td></tr>`;
    }
}

async function criarUsuario(e) {
    e.preventDefault();
    const payload = {
        full_name: document.getElementById("newNome").value,
        username: document.getElementById("newUser").value,
        password: document.getElementById("newPass").value,
        role: document.getElementById("newRole").value
    };

    try {
        await authFetch("/users/", {
            method: "POST",
            body: JSON.stringify(payload)
        });
        showToast("Usuário criado!", "success");
        document.getElementById("formNovoUsuario").reset();
        carregarUsuarios();
    } catch(e) {
        showToast("Erro ao criar (Talvez usuário já exista ou você não é admin).", "error");
    }
}

window.deletarUsuario = async (id) => {
    if(!confirm("Remover este usuário?")) return;
    try {
        await authFetch(`/users/${id}`, { method: "DELETE" });
        showToast("Removido.", "info");
        carregarUsuarios();
    } catch(e) { showToast("Erro ao remover.", "error"); }
};

// LÓGICA CLÍNICA E SENHA (MANTIDA)
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
    localStorage.setItem("fisio_config_clinica", JSON.stringify({
        nome: document.getElementById("confNome").value,
        endereco: document.getElementById("confEnd").value,
        telefone: document.getElementById("confTel").value,
        resp: document.getElementById("confResp").value
    }));
    showToast("Salvo!", "success");
}
async function alterarSenha(e) {
    e.preventDefault();
    const atual = document.getElementById("senhaAtual").value;
    const nova = document.getElementById("senhaNova").value;
    const confirm = document.getElementById("senhaConfirm").value;
    if (nova !== confirm) return showToast("Senhas não conferem.", "error");
    try {
        await authFetch("/users/me/password", {
            method: "PATCH",
            body: JSON.stringify({ old_password: atual, new_password: nova })
        });
        showToast("Senha alterada! Faça login novamente.", "success");
        setTimeout(() => window.location.reload(), 2000);
    } catch (erro) { showToast("Senha atual incorreta.", "error"); }
}
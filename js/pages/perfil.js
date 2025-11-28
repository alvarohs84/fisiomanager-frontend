import { layoutShell } from "../core/layout.js";
import { getToken, clearToken } from "../core/auth.js";
import { navigate } from "../core/router.js";

export function renderPerfil() {
  layoutShell(`
    <div class="perfil-wrapper">
      
      <div class="perfil-card">
        <div class="perfil-avatar">F</div>

        <h2 class="perfil-nome">Dr. Álvaro Huber</h2>
        <p class="perfil-clinica">FisioManager Premium</p>

        <p class="perfil-email">ahs_fisio@hotmail.com</p>

        <div class="perfil-buttons">

          <button class="btn btn-primary perfil-btn" onclick="alert('Em desenvolvimento!')">
            ✏️ Editar Perfil
          </button>

          <button class="btn btn-secondary perfil-btn" onclick="alert('Função disponível em breve!')">
            🔒 Trocar Senha
          </button>

          <button class="btn btn-danger perfil-btn" id="sairBtn">
            🚪 Sair
          </button>

        </div>

      </div>
    </div>
  `, "perfil");

  document.getElementById("sairBtn").onclick = () => {
    clearToken();
    navigate("login");
  };
}

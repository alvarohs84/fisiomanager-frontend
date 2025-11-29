// ===============================================
//  Página de Configurações — FisioManager Premium
// ===============================================

import { navigate } from "../core/router.js";

// 🔐 Verifica login
import { getUser, logout } from "../core/auth.js";

// =========================================
// Renderiza a página de Configurações
// =========================================
export function renderConfig() {
  const app = document.getElementById("app");

  const user = getUser();

  app.innerHTML = `
    <div class="page config-page">

      <h2>⚙️ Configurações</h2>

      <div class="config-section">
        <h3>Perfil do Usuário</h3>
        <p><strong>Usuário:</strong> ${user?.username || "Desconhecido"}</p>

        <button id="btnLogout" class="btn-logout">
          Sair da Conta
        </button>
      </div>

      <div class="config-section">
        <h3>Aplicativo</h3>

        <button id="btnClearStorage" class="btn-danger">
          Limpar cache e reiniciar
        </button>
      </div>

      <div class="config-section">
        <h3>Sobre</h3>
        <p>Versão: <strong>1.0.0</strong></p>
        <p>FisioManager Premium © 2025</p>
      </div>

    </div>
  `;

  // =========================================
  // EVENTOS DOS BOTÕES
  // =========================================

  // 🔒 LOGOUT
  document.getElementById("btnLogout").addEventListener("click", () => {
    logout();
    navigate("login");
  });

  // 🧹 LIMPAR CACHE
  document.getElementById("btnClearStorage").addEventListener("click", () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("Cache limpo! O app será reiniciado.");
    navigate("login");
    location.reload();
  });
}


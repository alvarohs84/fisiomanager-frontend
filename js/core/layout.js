// ===================================================
//  FisioManager Premium — LAYOUT.JS
// ===================================================

import { clearToken, getUser, isLogged } from "./auth.js";
import { navigate } from "./router.js";

// Atualiza nome do usuário no layout
export function updateLayoutUser() {
  const user = getUser();
  const userNameElement = document.getElementById("layoutUser");

  if (userNameElement) {
    userNameElement.textContent = user ? user.username : "Visitante";
  }
}

// Configura botões do layout
export function setupLayoutEvents() {
  // Logout
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearToken();
      navigate("login");
    });
  }

  // Links do menu lateral
  document.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.getAttribute("data-route");
      navigate(route);
    });
  });
}

// Renderiza o layout + página interna
export function renderLayout(contentHtml) {
  document.getElementById("app").innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <h2 class="logo">FisioManager</h2>

        <nav>
          <button data-route="dashboard">Dashboard</button>
          <button data-route="pacientes">Pacientes</button>
          <button data-route="agenda">Agenda</button>
          <button data-route="evolucoes">Evoluções</button>
          <button data-route="historico">Histórico</button>
          <button data-route="financeiro">Financeiro</button>
          <button data-route="config">Configurações</button>
        </nav>

        <footer>
          <p id="layoutUser">Usuário</p>
          <button id="logout-btn">Sair</button>
        </footer>
      </aside>

      <main class="content">
        ${contentHtml}
      </main>
    </div>
  `;

  updateLayoutUser();
  setupLayoutEvents();
}





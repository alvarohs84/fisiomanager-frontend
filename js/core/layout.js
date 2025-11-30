// ===================================================
//  FisioManager Premium — LAYOUT.JS
// ===================================================

import { clearToken, getUser } from "./auth.js";
import { navigate } from "./router.js";

// Atualiza nome do usuário no layout
export function updateLayoutUser() {
  const user = getUser();
  const el = document.getElementById("layoutUser");

  if (el) {
    el.textContent = user ? user.username : "Visitante";
  }
}

// Eventos do layout
export function setupLayoutEvents() {
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearToken();
      navigate("login");
    });
  }

  document.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigate(btn.dataset.route);
    });
  });
}

// Renderiza layout + página interna
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
          <p id="layoutUser"></p>
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






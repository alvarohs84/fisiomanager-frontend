// ===================================================
//  LAYOUT — Shell do App
// ===================================================

import { clearToken, getUser } from "./auth.js";
import { navigate } from "./router.js";

export function updateLayoutUser() {
  const u = getUser();
  const el = document.getElementById("layoutUser");
  if (el) el.textContent = u ? u.username : "Visitante";
}

export function setupLayoutEvents() {
  const logout = document.getElementById("logout-btn");
  if (logout) {
    logout.addEventListener("click", () => {
      clearToken();
      navigate("login");
    });
  }

  document.querySelectorAll("[data-route]").forEach(btn => {
    btn.onclick = () => navigate(btn.dataset.route);
  });
}

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






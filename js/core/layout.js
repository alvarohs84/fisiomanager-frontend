import { clearToken } from "./auth.js";
import { navigate } from "./router.js";

/*
  LAYOUT PREMIUM — FisioManager
  Header + Conteúdo + Menu Inferior
*/

export function layoutShell(content, currentPage = "") {
  document.getElementById("app").innerHTML = `
  
    <!-- TOPO -->
    <header class="topbar">
      <div class="topbar-left">
        <span class="logo">FisioManager</span>
      </div>

      <button class="logout-btn" id="logoutBtn">Sair</button>
    </header>

    <!-- ÁREA DE CONTEÚDO -->
    <main class="content-area">
      ${content}
    </main>

    <!-- MENU INFERIOR PREMIUM -->
    <nav class="bottom-nav">

      <button class="nav-btn ${currentPage === "dashboard" ? "active" : ""}" onclick="navigate('dashboard')">
        <span class="icon">🏠</span>
        <span class="label">Início</span>
      </button>

      <button class="nav-btn ${currentPage === "pacientes" ? "active" : ""}" onclick="navigate('pacientes')">
        <span class="icon">👨‍⚕️</span>
        <span class="label">Pacientes</span>
      </button>

      <button class="nav-btn ${currentPage === "agenda" ? "active" : ""}" onclick="navigate('agenda')">
        <span class="icon">📅</span>
        <span class="label">Agenda</span>
      </button>

      <button class="nav-btn ${currentPage === "evolucoes" ? "active" : ""}" onclick="navigate('evolucoes')">
        <span class="icon">📝</span>
        <span class="label">Evoluções</span>
      </button>

      <button class="nav-btn ${currentPage === "historico" ? "active" : ""}" onclick="navigate('historico')">
        <span class="icon">📚</span>
        <span class="label">Histórico</span>
      </button>

      <button class="nav-btn ${currentPage === "financeiro" ? "active" : ""}" onclick="navigate('financeiro')">
        <span class="icon">💰</span>
        <span class="label">Financeiro</span>
      </button>

      <button class="nav-btn ${currentPage === "perfil" ? "active" : ""}" onclick="navigate('perfil')">
        <span class="icon">👤</span>
        <span class="label">Perfil</span>
      </button>

      <button class="nav-btn ${currentPage === "config" ? "active" : ""}" onclick="navigate('config')">
        <span class="icon">⚙️</span>
        <span class="label">Config.</span>
      </button>

    </nav>
  `;

  // Evento do botão sair
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      clearToken();
      navigate("login");
    };
  }
}




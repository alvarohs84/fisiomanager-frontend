import { navigate } from "./router.js";
import { clearToken, getUser } from "./auth.js";

export function renderLayout(contentHTML) {
  const user = getUser();
  const username = user ? user.username : "Usuário";

  // HTML da Barra de Navegação (Navbar)
  const navHTML = `
    <header class="main-header">
      <div class="logo-area">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">FisioManager</span>
      </div>

      <nav class="nav-menu">
        <button onclick="window.navegar('dashboard')" class="nav-btn">Dashboard</button>
        <button onclick="window.navegar('pacientes')" class="nav-btn">Pacientes</button>
        <button onclick="window.navegar('agenda')" class="nav-btn">Agenda</button>
        <button onclick="window.navegar('evolucoes')" class="nav-btn">Evoluções</button>
        <button onclick="window.navegar('financeiro')" class="nav-btn">Financeiro</button>
      </nav>

      <div class="user-area">
        <span class="user-name">Olá, <strong>${username}</strong></span>
        <button id="btnSair" class="btn-logout">Sair</button>
      </div>
    </header>

    <main class="main-content">
      ${contentHTML}
    </main>
  `;

  document.getElementById("app").innerHTML = navHTML;

  // Reatribui a função global de navegação para o onclick funcionar
  window.navegar = (rota) => navigate(rota);

  // Evento de Logout
  document.getElementById("btnSair").addEventListener("click", () => {
    if (confirm("Deseja realmente sair?")) {
      clearToken();
      window.location.reload();
    }
  });
  
  // Destaca o botão ativo no menu
  highlightActiveMenu();
}

function highlightActiveMenu() {
    // Pega a rota atual da URL ou hash se estiver usando
    // Lógica simples: remove classe active de todos e adiciona no clicado
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}





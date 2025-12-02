import { navigate } from "./router.js";
import { clearToken, getUser } from "./auth.js";

export function renderLayout(contentHTML) {
  const user = getUser();
  const username = user ? user.username : "Usuário";

  // HTML da Navbar (Verificado: Sem "F" solto)
  const navHTML = `
    <header class="main-header">
      <div class="logo-area">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">FisioManager</span>
      </div>

      <nav class="nav-menu">
        <button onclick="window.navegar('dashboard')" class="nav-btn btn-dashboard">Dashboard</button>
        <button onclick="window.navegar('pacientes')" class="nav-btn btn-pacientes">Pacientes</button>
        <button onclick="window.navegar('agenda')" class="nav-btn btn-agenda">Agenda</button>
        <button onclick="window.navegar('avaliacoes')" class="nav-btn btn-avaliacoes">Avaliações</button>
        <button onclick="window.navegar('evolucoes')" class="nav-btn btn-evolucoes">Evoluções</button>
        <button onclick="window.navegar('financeiro')" class="nav-btn btn-financeiro">Financeiro</button>
        <button id="btnSairMobile" class="nav-btn btn-sair-mobile">Sair</button>
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

  window.navegar = (rota) => navigate(rota);

  // Lógica de Logout
  const logoutAction = () => {
    if (confirm("Deseja realmente sair?")) {
      clearToken();
      window.location.reload();
    }
  };

  const btnSairDesktop = document.getElementById("btnSair");
  if(btnSairDesktop) btnSairDesktop.addEventListener("click", logoutAction);

  const btnSairMobile = document.getElementById("btnSairMobile");
  if(btnSairMobile) btnSairMobile.addEventListener("click", logoutAction);
  
  highlightActiveMenu();
}

function highlightActiveMenu() {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}




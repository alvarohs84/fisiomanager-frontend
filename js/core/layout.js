import { navigate } from "./router.js";
import { clearToken, getUser } from "./auth.js";

export function renderLayout(contentHTML) {
  const user = getUser();
  const username = user ? user.username : "Usuário";

  // HTML da Navbar (Com o novo botão Sair Mobile)
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
        
        <button id="btnSairMobile" class="nav-btn" style="color: #dc3545; font-weight: bold;">Sair</button>
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

  // Lógica de Logout unificada (funciona pros dois botões)
  const logoutAction = () => {
    if (confirm("Deseja realmente sair?")) {
      clearToken();
      window.location.reload();
    }
  };

  // Associa o evento aos botões se eles existirem na tela
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





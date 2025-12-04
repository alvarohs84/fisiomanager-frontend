import { navigate } from "./router.js";
import { clearToken, getUser } from "./auth.js";

export function renderLayout(contentHTML) {
  const user = getUser();
  const username = user ? user.username : "Usuário";

  const navHTML = `
    <header class="main-header">
      <div class="logo-area">
        <span class="logo-text">FisioManager</span>
      </div>

      <nav class="nav-menu">
        <a href="#dashboard" class="nav-btn btn-dashboard">Dashboard</a>
        <a href="#pacientes" class="nav-btn btn-pacientes">Pacientes</a>
        <a href="#agenda" class="nav-btn btn-agenda">Agenda</a>
        <a href="#prontuario" class="nav-btn" style="background-color: #e83e8c; color: white;">Prontuário</a>
        <a href="#financeiro" class="nav-btn btn-financeiro">Financeiro</a>
        
        <a href="#configuracoes" class="nav-btn" style="background-color: #6c757d; color: white;">Configurações</a>
        
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
    const hash = window.location.hash || "#dashboard";
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('href') === hash) btn.classList.add('active');
    });
}



import { navigate } from "./router.js";
import { clearToken, getUser } from "./auth.js";

export function renderLayout(contentHTML) {
  const user = getUser();
  const username = user ? user.username : "Usuário";

  // HTML da Navbar
  const navHTML = `
    <header class="main-header">
      <div class="logo-area">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">FisioManager</span>
      </div>

      <nav class="nav-menu">
        <a href="#dashboard" class="nav-btn btn-dashboard">Dashboard</a>
        <a href="#pacientes" class="nav-btn btn-pacientes">Pacientes</a>
        <a href="#agenda" class="nav-btn btn-agenda">Agenda</a>
        
        <a href="#prontuario" class="nav-btn" style="background-color: #e83e8c;">Prontuário</a>
        
        <a href="#financeiro" class="nav-btn btn-financeiro">Financeiro</a>
        
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
  
  // Marca o botão atual como ativo (para ficar colorido mais forte)
  highlightActiveMenu();
}

function highlightActiveMenu() {
    const hash = window.location.hash || "#dashboard";
    const buttons = document.querySelectorAll('.nav-btn');
    
    buttons.forEach(btn => {
        // Remove de todos
        btn.classList.remove('active');
        
        // Se o link do botão for igual ao hash da URL, ativa ele
        if(btn.getAttribute('href') === hash) {
            btn.classList.add('active');
        }
    });
}



import { isLogged } from "./core/auth.js";
import { navigate } from "./core/router.js";
import { renderLayout } from "./core/layout.js";

// Importação das Páginas (Módulos)
import { renderLogin } from "./pages/login.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderPacientes } from "./pages/pacientes.js";
import { renderAgenda } from "./pages/agenda.js";
import { renderEvolucoes } from "./pages/evolucoes.js";
import { renderFinanceiro } from "./pages/financeiro.js";

// Função Router: Decide qual tela mostrar
function router() {
  // Pega o nome da rota depois da hash (#). Ex: #agenda -> agenda
  const rota = window.location.hash.slice(1) || "dashboard";

  // 1. Verificação de Segurança
  // Se não estiver logado, mostra o Login (e para a execução aqui)
  if (!isLogged()) {
    renderLogin();
    return;
  }

  // Se o usuário tentar acessar #login mas já estiver logado, manda pro Dashboard
  if (rota === "login") {
    navigate("dashboard");
    return;
  }

  // 2. Navegação
  switch (rota) {
    case "dashboard":
      renderDashboard();
      break;

    case "pacientes":
      renderPacientes();
      break;

    case "agenda":
      renderAgenda();
      break;

    case "evolucoes":
      renderEvolucoes();
      break;

    case "financeiro":
      renderFinanceiro();
      break;

    case "configuracoes":
      // Tela placeholder para o botão não ficar quebrado
      renderLayout(`
        <div class="container">
            <h2>⚙️ Configurações</h2>
            <div class="card" style="margin-top: 20px; text-align: center; padding: 40px; color: #777;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🛠️</div>
                <h3>Em Desenvolvimento</h3>
                <p>Em breve você poderá alterar dados da clínica e senhas aqui.</p>
            </div>
        </div>
      `);
      break;

    default:
      // Se a rota não existir (erro 404), volta pro início
      navigate("dashboard");
  }
}

// 3. Inicialização
// Ouve quando a página carrega ou quando a URL muda
window.addEventListener("load", router);
window.addEventListener("hashchange", router);



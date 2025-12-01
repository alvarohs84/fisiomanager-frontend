import { isLogged } from "./core/auth.js";
import { navigate } from "./core/router.js";
import { renderLayout } from "./core/layout.js";

// Importação das Páginas
import { renderLogin } from "./pages/login.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderPacientes } from "./pages/pacientes.js";
import { renderAgenda } from "./pages/agenda.js";
import { renderEvolucoes } from "./pages/evolucoes.js";
import { renderFinanceiro } from "./pages/financeiro.js";

function router() {
  const rota = window.location.hash.slice(1) || "dashboard";

  if (!isLogged()) {
    renderLogin();
    return;
  }

  if (rota === "login") {
    navigate("dashboard");
    return;
  }

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

    case "avaliacoes":
      // Tela temporária de Avaliações
      renderLayout(`
        <div class="container">
            <h2>📋 Avaliações Cinético-Funcionais</h2>
            <div class="card" style="margin-top: 20px; text-align: center; padding: 60px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🦴</div>
                <h3>Módulo de Avaliação</h3>
                <p style="color: #666; max-width: 500px; margin: 0 auto;">
                    Em breve você poderá criar fichas detalhadas de avaliação postural, 
                    neurológica e ortopédica diretamente no sistema.
                </p>
                <button class="btn-primary" style="margin-top: 20px; opacity: 0.5; cursor: not-allowed;">+ Nova Avaliação (Em Breve)</button>
            </div>
        </div>
      `);
      break;

    case "evolucoes":
      renderEvolucoes();
      break;

    case "financeiro":
      renderFinanceiro();
      break;

    case "configuracoes":
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
      navigate("dashboard");
  }
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);

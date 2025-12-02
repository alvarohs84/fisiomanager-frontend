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
import { renderAvaliacoes } from "./pages/avaliacoes.js";
import { renderProntuario } from "./pages/prontuario.js";
import { renderConfiguracoes } from "./pages/configuracoes.js"; // <--- Importe Novo

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

    case "prontuario":
      renderProntuario();
      break;

    case "financeiro":
      renderFinanceiro();
      break;

    case "configuracoes":
      renderConfiguracoes(); // <--- Rota Nova
      break;
      
    // Casos antigos mantidos por segurança ou removidos se não usar mais
    case "avaliacoes": renderAvaliacoes(); break;
    case "evolucoes": renderEvolucoes(); break;

    default:
      navigate("dashboard");
  }
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
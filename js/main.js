import { isLogged } from "./core/auth.js";
import { navigate } from "./core/router.js";
import { renderLayout } from "./core/layout.js";

// Importação das Páginas
import { renderLogin } from "./pages/login.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderPacientes } from "./pages/pacientes.js";
import { renderAgenda } from "./pages/agenda.js";
import { renderFinanceiro } from "./pages/financeiro.js";
import { renderProntuario } from "./pages/prontuario.js"; // <--- Importe Novo

function router() {
  const rota = window.location.hash.slice(1) || "dashboard";
  console.log("Rota:", rota);

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

    case "prontuario": // <--- Rota Nova Unificada
      renderProntuario();
      break;

    case "financeiro":
      renderFinanceiro();
      break;

    case "configuracoes":
      renderLayout(`<div class="container"><h2>⚙️ Configurações</h2><div class="card" style="padding:40px; text-align:center;"><h3>Em breve</h3></div></div>`);
      break;

    default:
      navigate("dashboard");
  }
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
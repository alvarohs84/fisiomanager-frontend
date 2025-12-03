import { isLogged } from "./core/auth.js";
import { navigate } from "./core/router.js";
import { renderLayout } from "./core/layout.js";

// --- IMPORTAÇÃO DAS PÁGINAS ---
import { renderLogin } from "./pages/login.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderPacientes } from "./pages/pacientes.js";
import { renderAgenda } from "./pages/agenda.js";
import { renderEvolucoes } from "./pages/evolucoes.js";
import { renderFinanceiro } from "./pages/financeiro.js";
import { renderAvaliacoes } from "./pages/avaliacoes.js";     // Rota de Avaliações
import { renderConfiguracoes } from "./pages/configuracoes.js"; // Rota de Configurações

function router() {
  // Pega o que está depois da # na URL. Ex: .../#avaliacoes -> rota = "avaliacoes"
  const rota = window.location.hash.slice(1) || "dashboard";
  
  // LOG DE DEBUG (Olhe no Console F12 se isso aparece ao clicar)
  console.log(">>> Rota detectada:", rota);

  // 1. Segurança: Se não estiver logado, manda pro Login
  if (!isLogged()) {
    renderLogin();
    return;
  }

  // Se tentar ir pro login estando logado, manda pro Dashboard
  if (rota === "login") {
    navigate("dashboard");
    return;
  }

  // 2. Roteamento: Escolhe qual função rodar
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
      renderAvaliacoes(); // <--- O botão "Avaliações" chama isso aqui
      break;

    case "evolucoes":
      renderEvolucoes();
      break;

    case "financeiro":
      renderFinanceiro();
      break;

    case "configuracoes":
      renderConfiguracoes();
      break;

    default:
      console.warn("Rota não encontrada, voltando para Dashboard...");
      navigate("dashboard");
  }
}

// Escuta quando a página carrega ou quando a URL muda (#)
window.addEventListener("load", router);
window.addEventListener("hashchange", router);
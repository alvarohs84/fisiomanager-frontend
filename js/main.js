import { isLogged } from "./core/auth.js";
import { navigate } from "./core/router.js";
import { renderLayout } from "./core/layout.js";

// --- IMPORTAÇÃO DAS PÁGINAS ---
import { renderLogin } from "./pages/login.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderPacientes } from "./pages/pacientes.js";
import { renderAgenda } from "./pages/agenda.js";
import { renderFinanceiro } from "./pages/financeiro.js";
import { renderConfiguracoes } from "./pages/configuracoes.js"; 
// Importação do Módulo Unificado
import { renderProntuario } from "./pages/prontuario.js"; 

// Se você ainda quiser manter as antigas por segurança, pode deixar, 
// mas o foco agora é o Prontuário.
import { renderEvolucoes } from "./pages/evolucoes.js";
import { renderAvaliacoes } from "./pages/avaliacoes.js";

function router() {
  // Pega o que está depois da # na URL. Ex: .../#prontuario -> rota = "prontuario"
  const rota = window.location.hash.slice(1) || "dashboard";
  
  console.log(">>> Rota detectada:", rota);

  // 1. Segurança
  if (!isLogged()) {
    renderLogin();
    return;
  }

  if (rota === "login") {
    navigate("dashboard");
    return;
  }

  // 2. Roteamento
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

    // --- AQUI ESTÁ A CORREÇÃO PRINCIPAL ---
    case "prontuario":
      renderProntuario(); // Abre a tela unificada (Evoluções + Avaliações)
      break;

    case "financeiro":
      renderFinanceiro();
      break;

    case "configuracoes":
      renderConfiguracoes();
      break;
    
    // Mantendo compatibilidade caso links antigos existam
    case "avaliacoes": 
      renderAvaliacoes(); 
      break;
      
    case "evolucoes": 
      renderEvolucoes(); 
      break;

    default:
      console.warn("Rota não encontrada:", rota);
      navigate("dashboard");
  }
}

// Inicialização
window.addEventListener("load", router);
window.addEventListener("hashchange", router);
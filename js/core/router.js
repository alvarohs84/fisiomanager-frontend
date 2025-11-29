// ===================================================
//  FisioManager Premium — Router SPA
// ===================================================

import { isLogged } from "./auth.js";

// ==== IMPORT DAS TELAS ====
import { renderLogin } from "../pages/login.js";
import { renderDashboard } from "../pages/dashboard.js";
import { renderPacientes } from "../pages/pacientes.js";
import { renderAgenda } from "../pages/agenda.js";
import { renderEvolucoes } from "../pages/evolucoes.js";
import { renderHistorico } from "../pages/historico.js";
import { renderHistoricoPaciente } from "../pages/historico.js";
import { renderPerfil } from "../pages/perfil.js";
import { renderConfig } from "../pages/configuracoes.js";
import { renderFinanceiro } from "../pages/financeiro.js";

// ===================================================
//  MAPA DE ROTAS
// ===================================================

const routes = {
  login: renderLogin,
  dashboard: renderDashboard,
  pacientes: renderPacientes,
  agenda: renderAgenda,
  evolucoes: renderEvolucoes,
  historico: renderHistorico,
  perfil: renderPerfil,
  config: renderConfig,
  financeiro: renderFinanceiro
};

// ===================================================
//  NAVEGAÇÃO PRINCIPAL
// ===================================================

export function navigate(route) {
  console.log("Navegando para:", route);

  // ------------------------------------------
  // 1. Bloqueio de rotas privadas
  // ------------------------------------------
  if (route !== "login" && !isLogged()) {
    console.warn("Usuário não autenticado → login");
    return renderLogin();
  }

  // ------------------------------------------
  // 2. Rota dinâmica (histórico por paciente)
  //    Exemplo de chamada:
  //    navigate("historicoPaciente_John Doe")
  // ------------------------------------------
  if (route.startsWith("historicoPaciente_")) {
    const nome = route.replace("historicoPaciente_", "");
    return renderHistoricoPaciente(nome);
  }

  // ------------------------------------------
  // 3. Navegação normal
  // ------------------------------------------
  const page = routes[route];

  if (page) {
    page(); // renderiza a página
  } else {
    console.error("Rota inválida:", route, "→ dashboard");
    renderDashboard();
  }
}

// Torna função acessível no HTML (onclick)
window.navigate = navigate;



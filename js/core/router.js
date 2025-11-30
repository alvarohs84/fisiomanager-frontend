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
import { renderHistorico, renderHistoricoPaciente } from "../pages/historico.js";
import { renderPerfil } from "../pages/perfil.js";
import { renderConfig } from "../pages/configuracoes.js";   // <-- AGORA CORRETO!!!
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

  // 1 — Rotas privadas
  if (route !== "login" && !isLogged()) {
    console.warn("Usuário não autenticado → login");
    return renderLogin();
  }

  // 2 — Rota dinâmica: histórico por paciente
  if (route.startsWith("historicoPaciente_")) {
    const nome = route.replace("historicoPaciente_", "");
    return renderHistoricoPaciente(nome);
  }

  // 3 — Rota normal
  const page = routes[route];

  if (page) {
    page();
  } else {
    console.error("Rota inválida:", route, "→ dashboard");
    renderDashboard();
  }
}

// Permite navegar via HTML onclick="navigate('dashboard')"
window.navigate = navigate;

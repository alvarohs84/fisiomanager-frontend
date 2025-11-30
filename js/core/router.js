// ===================================================
//  FisioManager — SPA ROUTER
// ===================================================

import { isLogged } from "./auth.js";

import { renderLogin } from "../pages/login.js";
import { renderDashboard } from "../pages/dashboard.js";
import { renderPacientes } from "../pages/pacientes.js";
import { renderAgenda } from "../pages/agenda.js";
import { renderEvolucoes } from "../pages/evolucoes.js";
import { renderHistorico, renderHistoricoPaciente } from "../pages/historico.js";
import { renderPerfil } from "../pages/perfil.js";
import { renderConfig } from "../pages/configuracoes.js";
import { renderFinanceiro } from "../pages/financeiro.js";

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

export function navigate(route) {
  if (route !== "login" && !isLogged()) {
    return renderLogin();
  }

  if (route.startsWith("historicoPaciente_")) {
    const nome = route.replace("historicoPaciente_", "");
    return renderHistoricoPaciente(nome);
  }

  const page = routes[route];
  if (page) page();
  else renderDashboard();
}

window.navigate = navigate;


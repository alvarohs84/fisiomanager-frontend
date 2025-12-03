// ===================================================
//  FisioManager — SPA ROUTER (CORRIGIDO)
// ===================================================

import { isLogged } from "./auth.js";

// Importação das Páginas
import { renderLogin } from "../pages/login.js";
import { renderDashboard } from "../pages/dashboard.js";
import { renderPacientes } from "../pages/pacientes.js";
import { renderAgenda } from "../pages/agenda.js";
import { renderEvolucoes } from "../pages/evolucoes.js";
import { renderFinanceiro } from "../pages/financeiro.js";
// Correção 1: Nome certo da importação
import { renderConfiguracoes } from "../pages/configuracoes.js"; 
// Correção 2: Adicionando as páginas novas
import { renderAvaliacoes } from "../pages/avaliacoes.js";
import { renderProntuario } from "../pages/prontuario.js";

const routes = {
  login: renderLogin,
  dashboard: renderDashboard,
  pacientes: renderPacientes,
  agenda: renderAgenda,
  evolucoes: renderEvolucoes,     // (Se ainda usar isolado)
  financeiro: renderFinanceiro,
  
  // Correção 3: Nomes das rotas alinhados com o Menu
  configuracoes: renderConfiguracoes, 
  avaliacoes: renderAvaliacoes,
  prontuario: renderProntuario
};

export function navigate(route) {
  // Se a rota vier com hash (ex: #dashboard), remove o #
  if (route.startsWith("#")) route = route.slice(1);
  
  // Se não vier nada, vai pro dashboard
  if (!route) route = "dashboard";

  console.log("Navegando para:", route); // Debug no console

  if (route !== "login" && !isLogged()) {
    return renderLogin();
  }

  const page = routes[route];
  
  if (page) {
    page();
  } else {
    console.warn("Rota não encontrada:", route);
    renderDashboard();
  }
}

// Expõe para o HTML poder usar onclick="navigate(...)" se necessário
window.navigate = navigate;
window.onhashchange = () => navigate(window.location.hash);
window.onload = () => navigate(window.location.hash);


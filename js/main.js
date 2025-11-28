// ================================
//  FisioManager Premium – main.js
// ================================

import { navigate } from "./core/router.js";
import { isLogged } from "./core/auth.js";

// Aguarda a splash desaparecer antes de iniciar
document.addEventListener("DOMContentLoaded", () => {

  // A splash tem animação de 1.5s → esperamos 1.6s
  setTimeout(() => {
    iniciarApp();
  }, 1600);
});

function iniciarApp() {
  // Se o usuário está logado → vai para dashboard
  // Senão → vai para login
  if (isLogged()) {
    navigate("dashboard");
  } else {
    navigate("login");
  }
}


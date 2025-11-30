// ================================
//  FisioManager Premium – main.js
// ================================

import { navigate } from "./core/router.js";
import { isLogged } from "./core/auth.js";

// ================================
//  BOOT DO APLICATIVO
// ================================

document.addEventListener("DOMContentLoaded", () => {
  
  // Animação da splash dura 1.5s → esperamos 1.6s
  setTimeout(() => {
    iniciarApp();
  }, 1600);

});

function iniciarApp() {

  // Se existe token → vai para a dashboard
  if (isLogged()) {
    navigate("dashboard");
  } 
  // Senão → login
  else {
    navigate("login");
  }
}


import { navigate } from "./core/router.js";
import { isLogged } from "./core/auth.js";
import { renderAgenda } from "./pages/agenda.js"; // <--- IMPORTE ISSO

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (isLogged()) navigate("dashboard");
    else navigate("login");
  }, 1500);
});



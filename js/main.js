import { navigate } from "./core/router.js";
import { isLogged } from "./core/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (isLogged()) navigate("dashboard");
    else navigate("login");
  }, 1500);
});



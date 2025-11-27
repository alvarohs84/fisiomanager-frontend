import { navigate } from "./core/router.js";
import { isLogged } from "./core/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  isLogged() ? navigate("dashboard") : navigate("login");
});

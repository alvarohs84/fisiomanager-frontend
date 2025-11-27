import { isLogged } from "./auth.js";
import { renderLogin } from "../pages/login.js";
import { renderDashboard } from "../pages/dashboard.js";

const routes={
  login:renderLogin,
  dashboard:renderDashboard
};

export function navigate(route){
  if(route!=="login" && !isLogged()) return renderLogin();
  (routes[route]||renderDashboard)();
}

window.navigate=navigate;

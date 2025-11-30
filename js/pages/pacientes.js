import { renderLayout } from "../core/layout.js";
import { authFetch } from "../core/auth.js";

export async function renderPacientes() {
  renderLayout(`<h2>Pacientes</h2><div id="listaPac"></div>`);

  const lista = await authFetch("/patients");
  document.getElementById("listaPac").innerHTML =
    lista.map(p => `<p>${p.name}</p>`).join("");
}


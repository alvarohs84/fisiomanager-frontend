import { login } from "../core/auth.js";
import { navigate } from "../core/router.js";

export function renderLogin() {
  document.getElementById("app").innerHTML = `
    <div class="login-container">
      <h1>FisioManager</h1>
      <p>Premium</p>

      <input id="user" placeholder="Usuário" />
      <input id="pass" placeholder="Senha" type="password" />

      <button id="btnLogin">Entrar</button>
    </div>
  `;

  document.getElementById("btnLogin").onclick = async () => {
    const username = document.getElementById("user").value;
    const password = document.getElementById("pass").value;

    const ok = await login(username, password);
    if (ok) navigate("dashboard");
    else alert("Login inválido");
  };
}




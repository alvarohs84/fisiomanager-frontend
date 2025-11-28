import { layoutShell } from "../core/layout.js";
import { setToken } from "../core/auth.js";
import { navigate } from "../core/router.js";

export function renderLogin() {
  // Tela de login não usa menu → layout simples
  document.getElementById("app").innerHTML = `
    <div class="login-wrapper">

      <div class="login-card">
        <div class="login-logo">F</div>

        <h2 class="login-title">FisioManager</h2>
        <p class="login-subtitle">Premium • Clínica de Fisioterapia</p>

        <input id="user" class="login-input" placeholder="Usuário" />
        <input id="pass" class="login-input" placeholder="Senha" type="password" />

        <button id="btnLogin" class="btn btn-primary login-btn">Entrar</button>

        <div id="msg" class="login-msg"></div>
      </div>
    </div>
  `;

  document.getElementById("btnLogin").onclick = logar;
}

async function logar() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();
  const msg = document.getElementById("msg");

  if (!user || !pass) {
    msg.textContent = "Preencha usuário e senha.";
    return;
  }

  try {
    msg.textContent = "Conectando...";

    const res = await fetch(window.API_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pass })
    });

    if (!res.ok) throw new Error("Usuário ou senha inválidos!");

    const data = await res.json();
    setToken(data.access_token);

    navigate("dashboard");

  } catch (e) {
    msg.textContent = e.message;
  }
}



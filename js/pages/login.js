import { layoutShell } from "../core/layout.js";
import { setToken } from "../core/auth.js";
import { navigate } from "../core/router.js";

export function renderLogin(){
  layoutShell(`
    <h2>Login</h2>
    <input id='user' placeholder='Usuário'/>
    <input id='pass' placeholder='Senha' type='password'/>
    <button id='btn'>Entrar</button>
    <div id='msg'></div>
  `);

  document.getElementById("btn").onclick = async () => {
    try {
      const res = await fetch(window.API_URL + "/token", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          username: document.getElementById("user").value,
          password: document.getElementById("pass").value
        })
      });

      if(!res.ok) throw new Error("Login inválido");
      const data = await res.json();
      setToken(data.access_token);
      navigate("dashboard");
    } catch(e){
      document.getElementById("msg").innerText = e.message;
    }
  };
}

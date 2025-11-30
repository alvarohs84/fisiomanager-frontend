// ===================================================
//  FisioManager Premium — AUTH.JS
// ===================================================

// Realiza login chamando o backend e salva token + user
export async function login(username, password) {
  try {
    const response = await fetch(`${window.API_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username,
        password
      })
    });

    if (!response.ok) {
      throw new Error("Credenciais inválidas!");
    }

    const data = await response.json();

    // Salva token
    localStorage.setItem("token", data.access_token);

    // Salva usuário
    localStorage.setItem("user", JSON.stringify({ username }));

    return true;

  } catch (error) {
    console.error("Erro no login:", error);
    return false;
  }
}

// Obtém token atual
export function getToken() {
  return localStorage.getItem("token");
}

// Retorna TRUE se usuário estiver logado
export function isLogged() {
  return !!localStorage.getItem("token");
}

// Retorna usuário atual
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Logout TOTAL
export function logout() {
  clearToken();
}

// Função usada no layout.js
export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}



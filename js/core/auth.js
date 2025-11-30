// ATUALIZANDO LOGIN AGORA

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function isLogged() {
  return Boolean(getToken());
}

export async function login(username, password) {
  try {
    // --- MUDANÇA CRUCIAL: USAR FORM DATA ---
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await fetch(`${window.API_URL}/token`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded" // <--- O CORRETO
      },
      body: formData // <--- ENVIA FORMULÁRIO
    });

    if (!res.ok) return false;

    const data = await res.json();
    saveToken(data.access_token);
    saveUser({ username });

    return true;
  } catch (e) {
    console.error("Login error:", e);
    return false;
  }
}

export async function authFetch(endpoint, options = {}) {
  const token = getToken();
  if (!token) throw new Error("Token ausente.");

  const res = await fetch(`${window.API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    clearToken();
    // Tenta recarregar para ir pro login
    window.location.reload(); 
  }

  // Proteção para respostas sem conteúdo (ex: delete)
  if (res.status === 204) return null;

  return res.json();
}




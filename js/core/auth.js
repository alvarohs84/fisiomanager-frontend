// ============================================
//   AUTH.JS — Controle de autenticação
// ============================================

// LOGIN DO USUÁRIO
export async function login(username, password) {
    try {
        const response = await fetch(`${window.API_URL}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) return false;

        const data = await response.json();

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify({ username }));

        return true;

    } catch (err) {
        console.error("Erro no login:", err);
        return false;
    }
}

// BUSCAR TOKEN
export function getToken() {
    return localStorage.getItem("token");
}

// BUSCAR USUÁRIO
export function getUser() {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
}

// VERIFICAR LOGIN
export function isLogged() {
    return getToken() !== null;
}

// LOGOUT (USADO PELO layout.js)
export function clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

// FETCH AUTENTICADO
export async function authFetch(endpoint, options = {}) {
    const token = getToken();

    const final = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {})
        }
    };

    const response = await fetch(`${window.API_URL}${endpoint}`, final);

    if (response.status === 401) {
        clearToken();
        window.navigate("login");
    }

    return response.json();
}




// ==================================================
//  AUTH.JS — Controle de autenticação do usuário
// ==================================================

// Salva o usuário no localStorage após login bem-sucedido
export async function login(username, password) {
    try {
        const response = await fetch(`${window.API_URL}/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();

        // salva o token e o usuário
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify({ username }));

        return true;

    } catch (err) {
        console.error("Erro no login:", err);
        return false;
    }
}

// Retorna dados do usuário logado
export function getUser() {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
}

// Verifica se existe token → usuário está logado
export function isLogged() {
    return localStorage.getItem("token") !== null;
}

// Remove dados de login
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}




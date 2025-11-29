// ============================================
//  Autenticação — FisioManager Premium
// ============================================

// URL da API já vem do index.html
const API = window.API_URL;

// --------------------------------------------
// Retorna usuário logado (ou null)
// --------------------------------------------
export function getUser() {
    const data = localStorage.getItem("user");
    try {
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

// --------------------------------------------
// Verifica se o usuário está logado
// --------------------------------------------
export function isLogged() {
    const token = localStorage.getItem("token");
    return token !== null;
}

// --------------------------------------------
// Faz login na API FastAPI
// --------------------------------------------
export async function login(username, password) {
    try {
        const response = await fetch(`${API}/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!response.ok) {
            throw new Error("Usuário ou senha inválidos");
        }

        const data = await response.json();

        // Salva o token e o usuário localmente
        localStorage.setItem("token", data.access_token);

        // Salva o usuário (somente username por enquanto)
        localStorage.setItem("user", JSON.stringify({ username }));

        return true;

    } catch (error) {
        console.error("Erro no login:", error);
        alert(error.message || "Erro ao fazer login");
        return false;
    }
}

// --------------------------------------------
// Logout — remove tudo e volta ao login
// --------------------------------------------
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}



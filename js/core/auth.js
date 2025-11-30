// Requisição autenticada automática com Bearer Token
export async function authFetch(url, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const headers = options.headers || {};
  headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    // Token expirou → força logout
    clearToken();
    window.navigate("login");
  }

  return response;
}




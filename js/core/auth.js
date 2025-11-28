// ============================
//  AUTH – TOKEN LOCALSTORAGE
// ============================

export const setToken = (t) => localStorage.setItem("fm_token", t);
export const getToken = () => localStorage.getItem("fm_token");
export const clearToken = () => localStorage.removeItem("fm_token");
export const isLogged = () => !!getToken();


// ============================
//  AUTH FETCH – REQUISIÇÕES COM TOKEN
// ============================

export async function authFetch(path, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não logado");
  }

  const headers = {
    ...(options.headers || {}),
    "Authorization": "Bearer " + token
  };

  // Só define Content-Type se não for FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(window.API_URL + path, {
    ...options,
    headers
  });

  if (!res.ok) {
    let msg = await res.text();
    console.error("API error:", msg);
    throw new Error("Erro ao comunicar com servidor");
  }

  const type = res.headers.get("content-type") || "";

  if (type.includes("application/json")) {
    return res.json();
  } else {
    return res.text();
  }
}

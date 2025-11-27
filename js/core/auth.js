export const setToken=t=>localStorage.setItem("fm_token",t);
export const getToken=()=>localStorage.getItem("fm_token");
export const clearToken=()=>localStorage.removeItem("fm_token");
export const isLogged=()=>!!getToken();
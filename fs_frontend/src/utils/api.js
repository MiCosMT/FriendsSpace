// Configuración base de Axios para realizar peticiones a la API del backend
// Incluye un interceptor que maneja automáticamente los errores 401 (No autorizado) y redirige a login o banned
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.API_URL || "http://localhost:3000/api",
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const is401 = error.response?.status === 401;
    const isCheckAuth = url.includes("check-auth");
    const isLogin = url.includes("login");

    if (is401 && !isCheckAuth && !isLogin) {
      const mensaje = error.response?.data?.mensaje || "";
      if (mensaje === "Cuenta suspendida") {
        useAuthStore.getState().clearAuth();
        window.location.href = "/banned";
      } else {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;

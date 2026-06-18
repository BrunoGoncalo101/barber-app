// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://barber-api-v1.onrender.com',
})

// Injeta o token automaticamente em todos os pedidos
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('barber_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verifica se a falha é numa rota de autenticação para evitar loops infinitos
    const isAuthRoute = error.config?.url?.includes('/auth/login') || 
                        error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthRoute) {
      console.warn("Sessão expirada ou inválida. A forçar logout...");
      // Dispara o evento global
      window.dispatchEvent(new Event("forceLogout"));
    }
    
    return Promise.reject(error);
  }
);

export default api
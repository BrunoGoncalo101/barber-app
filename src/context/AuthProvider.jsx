// src/context/AuthProvider.jsx  (só exporta o componente)
import { useState } from 'react'
import { useEffect } from 'react';
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('barber_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('barber_token'))

  const login = (userData, token) => {
    setUser(userData)
    setToken(token)
    localStorage.setItem('barber_user', JSON.stringify(userData))
    localStorage.setItem('barber_token', token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('barber_user')
    localStorage.removeItem('barber_token')
  }

  useEffect(() => {
    const handleForceLogout = () => {
      logout(); // Usa a função logout que já definimos antes
      window.location.replace('/'); // Força o refresh para limpar memórias
    };

    window.addEventListener('forceLogout', handleForceLogout);

    // Limpa o listener ao desmontar o componente
    return () => window.removeEventListener('forceLogout', handleForceLogout);
  }, []);

  const handleAutomaticLogout = () => {
    localStorage.removeItem("barber_token");
    localStorage.removeItem("barber_user");
    setUser(null)
    setTimeout(() => {
    window.location.replace("/");
  }, 100);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, handleAutomaticLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
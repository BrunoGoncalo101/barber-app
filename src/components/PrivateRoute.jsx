import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute({ children }) {
  const { user, token } = useAuth()
  
  // Se não houver token ou não houver utilizador, bloqueia
  if (!token || !user) {
    return <Navigate to="/barbeiro/login" replace />
  }

  return children
}
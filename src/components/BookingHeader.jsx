// src/components/BookingHeader.jsx
import { useNavigate } from 'react-router-dom'

export default function BookingHeader() {
  const navigate = useNavigate()
  return (
    <div className="booking-header">
      <button className="booking-header-logo" onClick={() => navigate('/')}>
        EL CHAPO
      </button>
      <button className="booking-header-cancel" onClick={() => navigate('/')}>
        ✕ Cancelar
      </button>
    </div>
  )
}
// src/pages/client/SelectService.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api'
import BookingHeader from '../../components/BookingHeader'

export default function SelectService() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!state?.location) { navigate('/agendar/local'); return }
    api.get('/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [state?.location, navigate])

  if (!state?.location) return null

  return (
    <div className="page">
      <BookingHeader />
      <div className="page-card">
        <button className="page-back" onClick={() => navigate('/agendar/local')}>← Voltar</button>
        <h2 className="page-title">Escolhe o serviço</h2>
        <p className="page-subtitle">{state.location.name}</p>
        {loading ? <p className="loading">A carregar...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {services.map(s => (
              <button key={s._id} className="option-card"
                onClick={() => navigate('/agendar/data', { state: { service: s, location: state.location } })}>
                <div>
                  <p className="option-card-name">
                    {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                  </p>
                  <p className="option-card-sub">{s.duration} min</p>
                </div>
                <span className="option-card-price">{s.price}€</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
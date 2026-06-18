// src/pages/client/SelectLocation.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import BookingHeader from '../../components/BookingHeader'

export default function SelectLocation() {
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/locations')
      .then(res => setLocations(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <BookingHeader />
      <div className="page-card">
        <h2 className="page-title">Escolhe o local</h2>
        <p className="page-subtitle">Seleciona a barbearia mais próxima</p>
        {loading ? <p className="loading">A carregar...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {locations.map(l => (
              <button key={l._id} className="option-card"
                onClick={() => navigate('/agendar/servico', { state: { location: l } })}>
                <div>
                  <p className="option-card-name">{l.name}</p>
                  <p className="option-card-sub">{l.address}</p>
                </div>
                <span style={{ color: '#00BFFF', fontSize: 20 }}>→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
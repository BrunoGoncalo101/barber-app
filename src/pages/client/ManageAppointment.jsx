// src/pages/client/ManageAppointment.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import dayjs from '../../utils/dayjs'
import BookingHeader from '../../components/BookingHeader'

export default function ManageAppointment() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState(null)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    api.get(`/appointments/manage/${token}`)
      .then(res => setAppointment(res.data))
      .catch(() => setError('Marcação não encontrada ou link inválido.'))
      .finally(() => setLoading(false))
  }, [token])

  const handleCancel = async () => {
    if (!confirm('Tens a certeza que queres cancelar a marcação?')) return
    setCancelling(true)
    try {
      await api.post(`/appointments/cancel/${token}`)
      setCancelled(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cancelar marcação.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return (
    <div className="page">
      <BookingHeader />
      <div className="page-card"><p className="loading">A carregar...</p></div>
    </div>
  )

  if (error) return (
    <div className="page">
      <BookingHeader />
      <div className="page-card" style={{ textAlign: 'center' }}>
        <p className="error-msg" style={{ marginBottom: 16 }}>{error}</p>
        <button className="btn-outline" onClick={() => navigate('/')}>Voltar ao início</button>
      </div>
    </div>
  )

  if (cancelled) return (
    <div className="page">
      <BookingHeader />
      <div className="page-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 className="page-title">Marcação cancelada</h2>
        <p className="page-subtitle">A tua marcação foi cancelada com sucesso.</p>
        <button className="btn-solid" style={{ width: '100%' }} onClick={() => navigate('/')}>
          Fazer nova marcação
        </button>
      </div>
    </div>
  )

  return (
    <div className="page">
      <BookingHeader />
      <div className="page-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✂️</div>
          <h2 className="page-title">A tua marcação</h2>
          <p className="page-subtitle">El Chapo · Rio Tinto</p>
        </div>

        <div className="summary-card" style={{ marginBottom: 16 }}>
          <div className="summary-row">
            <span>Nome</span>
            <span>{appointment.clientName}</span>
          </div>
          <div className="summary-row">
            <span>Serviço</span>
            <span style={{ textTransform: 'capitalize' }}>{appointment.service?.name}</span>
          </div>
          <div className="summary-row">
            <span>Data</span>
            <span>{dayjs(appointment.startTime).format('DD/MM/YYYY')}</span>
          </div>
          <div className="summary-row">
            <span>Hora</span>
            <span>{dayjs(appointment.startTime).format('HH:mm')}</span>
          </div>
          <div className="summary-row">
            <span>Preço</span>
            <span className="summary-price">{appointment.service?.price}€</span>
          </div>
          <div className="summary-row">
            <span>Estado</span>
            <span style={{
              color: appointment.status === 'confirmed' ? '#00BFFF' :
                appointment.status === 'cancelled' ? '#CC2200' : '#f59e0b'
            }}>
              {appointment.status === 'confirmed' ? 'Confirmado' :
                appointment.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
            </span>
          </div>
        </div>

        {appointment.status !== 'cancelled' && (
          <button
            className="btn-solid"
            style={{ width: '100%', background: '#CC2200' }}
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'A cancelar...' : 'Cancelar marcação'}
          </button>
        )}
      </div>
    </div>
  )
}
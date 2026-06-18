// src/pages/client/BookingSuccess.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from '../../utils/dayjs'
import BookingHeader from '../../components/BookingHeader'

export default function BookingSuccess() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.appointment) { navigate('/'); return null }

  const { appointment } = state

  return (
    <div className="page">
      <BookingHeader />
      <div className="page-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✂️</div>
        <h2 className="page-title">Marcação confirmada!</h2>
        <p className="page-subtitle">Até já, {appointment.clientName.split(' ')[0]}!</p>

        <div style={{ background: '#080D12', border: '1px solid #f59e0b44', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
  <span style={{ fontSize: 18 }}>⏳</span>
  <p style={{ color: '#f59e0b', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
    A tua marcação está pendente de confirmação. Receberás um email assim que o barbeiro confirmar.
  </p>
</div>
        <div className="summary-card" style={{ textAlign: 'left', marginBottom: 16 }}>
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
        </div>

        <p style={{ color: '#556677', fontSize: 13, marginBottom: 24 }}>
          Recebeste um email com o link para cancelar a marcação se necessário.
        </p>

        <button className="btn-solid" style={{ width: '100%' }} onClick={() => navigate('/')}>
          Pagina Inicial
        </button>
      </div>
    </div>
  )
}
// src/pages/client/ConfirmBooking.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../services/api'
import BookingHeader from '../../components/BookingHeader'
import dayjs from '../../utils/dayjs';
import 'dayjs/locale/pt';


export default function ConfirmBooking() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ clientName: '', clientPhone: '', clientEmail: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!state?.service || !state?.startTime) { navigate('/'); return null }

  const handleSubmit = async () => {
    // 1. Validação de campos vazios
    if (!form.clientName || !form.clientPhone || !form.clientEmail) {
      setError('Preenche todos os campos obrigatórios')
      return
    }

    // 2. Validação de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.clientEmail)) {
      setError('Por favor, introduz um email válido')
      return
    }

    // 3. Validação de Telemóvel (Portugal: 9 dígitos, começando por 9)
    const phoneRegex = /^9[1236]\d{7}$/
    if (!phoneRegex.test(form.clientPhone.replace(/\s/g, ''))) {
      setError('Introduz um número de telemóvel válido (ex: 912345678)')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Enviamos o startTime como string ISO para o servidor
      const payload = {
        serviceId: state.service._id,
        locationId: state.location._id,
        startTime: new Date(state.startTime).toISOString(),
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        clientEmail: form.clientEmail,
        notes: form.notes
      }

      const { data } = await api.post('/appointments', payload)
      navigate('/agendar/sucesso', { state: { appointment: data } })
    } catch (err) {
      // Isto vai mostrar o erro real do servidor na interface
      const errorMessage = err.response?.data?.message || 'Erro ao criar marcação. Verifica o terminal do servidor.'
      setError(errorMessage)
      console.error("Erro na requisição:", err.response?.data || err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <BookingHeader />
      <div className="page-card">
        <button className="page-back" onClick={() => navigate('/agendar/hora', { state })}>
          ← Voltar
        </button>
        <h2 className="page-title">Confirmar marcação</h2>
        <p className="page-subtitle">El Chapo · {state.location?.name}</p>

        <div className="summary-card">
          <div className="summary-row">
            <span>Serviço</span>
            <span style={{ textTransform: 'capitalize' }}>{state.service.name}</span>
          </div>
          <div className="summary-row">
            <span>Local</span>
            <span>{state.location?.name}</span>
          </div>
          <div className="summary-row">
            <span>Data</span>
            <span>{dayjs(state.startTime).tz('Europe/Lisbon').format('DD/MM/YYYY')}</span>
          </div>
          <div className="summary-row">
            <span>Hora</span>
            <span>{dayjs(state.startTime).tz('Europe/Lisbon').format('HH:mm')}</span>
          </div>
          <div className="summary-row">
            <span>Preço</span>
            <span className="summary-price">{state.service.price}€</span>
          </div>
        </div>

        <div className="form-fields">
          <input 
  type="text" 
  placeholder="Nome completo *" 
  value={form.clientName}
  onChange={e => setForm({ ...form, clientName: e.target.value })} 
/>
          <input 
  type="tel" 
  placeholder="Telemóvel *" 
  maxLength="9"
  value={form.clientPhone}
  onChange={e => setForm({ ...form, clientPhone: e.target.value })} 
/>
          <input 
  type="email" 
  placeholder="Email *" 
  value={form.clientEmail}
  onChange={e => setForm({ ...form, clientEmail: e.target.value })} 
/>
          <textarea placeholder="Observações (opcional)" rows={3} value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            style={{ resize: 'none' }} />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="btn-solid" style={{ width: '100%' }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'A confirmar...' : 'Confirmar marcação'}
        </button>
      </div>
    </div>
  )
}
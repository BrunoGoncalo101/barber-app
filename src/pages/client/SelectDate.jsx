// src/pages/client/SelectDate.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BookingHeader from '../../components/BookingHeader'
import dayjs from '../../utils/dayjs'

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function SelectDate() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [selected, setSelected] = useState(null)
  const [current, setCurrent] = useState(dayjs().startOf('month'))

  if (!state?.service) { navigate('/'); return null }

  const today = dayjs().startOf('day')
  const firstDay = current.startOf('month')
  const daysInMonth = current.daysInMonth()

  // Dia da semana do primeiro dia (0=Dom, ajusta para 0=Seg)
  let startOffset = firstDay.day() - 1
  if (startOffset < 0) startOffset = 6

  const prevMonth = () => setCurrent(current.subtract(1, 'month'))
  const nextMonth = () => setCurrent(current.add(1, 'month'))

  const handleNext = () => {
    if (!selected) return
    navigate('/agendar/hora', { state: { ...state, date: selected.format('YYYY-MM-DD') } })
  }

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(current.date(d))

  return (
    <div className="page">
      <BookingHeader />
      <div className="page-card" style={{ maxWidth: 420 }}>
        <button className="page-back"
          onClick={() => navigate('/agendar/servico', { state: { location: state.location } })}>
          ← Voltar
        </button>
        <h2 className="page-title">Escolhe o dia</h2>
        <p className="page-subtitle" style={{ textTransform: 'capitalize' }}>
          {state.service.name} — {state.service.price}€
        </p>

        {/* Calendário */}
        <div style={{ background: '#080D12', border: '1px solid #0a2030', borderRadius: 16, padding: 20, marginBottom: 16 }}>

          {/* Header do mês */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button
              onClick={prevMonth}
              disabled={current.isSame(dayjs().startOf('month'), 'month')}
              style={{ background: '#051525', border: '1px solid #0a2030', color: '#fff', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >←</button>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}>
              {MONTHS[current.month()]} {current.year()}
            </span>
            <button
              onClick={nextMonth}
              style={{ background: '#051525', border: '1px solid #0a2030', color: '#fff', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >→</button>
          </div>

          {/* Dias da semana */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#556677', letterSpacing: '.05em', padding: '4px 0', fontWeight: 600 }}>
                {d}
              </div>
            ))}
          </div>

          {/* Dias */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />

              const isPast = day.isBefore(today)
              const isToday = day.isSame(today, 'day')
              const isSelected = selected && day.isSame(selected, 'day')
              const isWeekend = day.day() === 0 || day.day() === 6

              const isDisabled = isPast || isWeekend //perguntar ao cristiano se quer fins de semana

return (
  <button
    key={i}
    disabled={isDisabled}
    onClick={() => setSelected(day)}
    style={{
      background: isSelected ? '#00BFFF' : isToday ? '#051525' : 'transparent',
      border: isToday && !isSelected ? '1px solid #00BFFF44' : '1px solid transparent',
      borderRadius: 8,
      color: isSelected ? '#050A0F' : isDisabled ? '#1a3040' : '#fff',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      padding: '8px 0',
      fontSize: 14,
      fontWeight: isSelected || isToday ? 700 : 400,
      transition: 'all .15s',
      width: '100%',
    }}
    onMouseOver={e => { if (!isDisabled && !isSelected) e.currentTarget.style.background = '#0a2030' }}
    onMouseOut={e => { if (!isDisabled && !isSelected) e.currentTarget.style.background = 'transparent' }}
  >
    {day.date()}
  </button>
)
            })}
          </div>
        </div>

        {selected && (
          <p style={{ color: '#556677', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
            {selected.format('dddd, DD [de] MMMM')}
          </p>
        )}

        <button
          className="btn-solid"
          style={{ width: '100%' }}
          disabled={!selected}
          onClick={handleNext}
        >
          Seguinte
        </button>
      </div>
    </div>
  )
}
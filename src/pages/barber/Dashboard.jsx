// src/pages/barber/Dashboard.jsx
import { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import api from "../../services/api"
import dayjs from "../../utils/dayjs"
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const statusColor = {
  pending: "#f59e0b",
  confirmed: "#00BFFF",
  cancelled: "#CC2200",
}

const statusLabel = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/appointments?date=${selectedDate}`)
        if (!cancelled) setAppointments(data)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [selectedDate])

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('https://', 'wss://').replace('http://', 'ws://')
      : 'ws://localhost:3000'
    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === "new_appointment") {
        api.get(`/appointments?date=${selectedDate}`)
          .then(res => setAppointments(res.data))
          .catch(err => console.error(err))
      }
    }
    return () => ws.close()
  }, [selectedDate])

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status })
      const { data } = await api.get(`/appointments?date=${selectedDate}`)
      setAppointments(data)
    } catch (err) {
      console.error(err)
    }
  }

  const prevDay = () => setSelectedDate(dayjs(selectedDate).subtract(1, "day").format("YYYY-MM-DD"))
  const nextDay = () => setSelectedDate(dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD"))
  const isToday = selectedDate === dayjs().format("YYYY-MM-DD")

  const grouped = appointments.reduce((acc, apt) => {
    const key = apt.location?.name || "Sem local"
    if (!acc[key]) acc[key] = []
    acc[key].push(apt)
    return acc
  }, {})

  const active = appointments.filter(a => a.status !== "cancelled")

  const counters = [
    { label: 'Total', value: active.length, color: '#fff' },
    { label: 'Pendentes', value: appointments.filter(a => a.status === 'pending').length, color: '#f59e0b' },
    { label: 'Confirmadas', value: appointments.filter(a => a.status === 'confirmed').length, color: '#00BFFF' },
    { label: 'Receita', value: `${active.reduce((sum, a) => sum + (a.service?.price || 0), 0)}€`, color: '#00BFFF' },
  ]

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-header-logo">EL CHAPO</h1>
          <p className="dashboard-header-sub">Olá, {user?.name}</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="dashboard-header-btn" onClick={() => navigate('/')}>← Home</button>
          <button className="dashboard-header-btn" onClick={logout}>Sair</button>
        </div>
      </div>

      <div className="dashboard-content">

        {/* Date nav */}
        <div className="dashboard-date-nav">
          <button className="dashboard-date-btn" onClick={prevDay}>←</button>
          <div className="dashboard-date-center">
            <p className="dashboard-date-day">{isToday ? "Hoje" : dayjs(selectedDate).format("dddd")}</p>
            <p className="dashboard-date-full">{dayjs(selectedDate).format('DD/MM/YYYY')}</p>
          </div>
          <button className="dashboard-date-btn" onClick={nextDay}>→</button>
        </div>

        {/* Counters */}
        {!loading && (
          <div className="dashboard-counters">
            {counters.map(item => (
              <div key={item.label} className="dashboard-counter-card">
                <p className="dashboard-counter-label">{item.label}</p>
                <p className="dashboard-counter-value" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* List */}
        {loading ? (
          <p className="loading">A carregar...</p>
        ) : appointments.length === 0 ? (
          <div className="dashboard-empty">
            <p className="dashboard-empty-icon">✂️</p>
            <p className="dashboard-empty-text">Sem marcações para este dia.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([locationName, apts]) => (
            <div key={locationName} className="dashboard-location-group">
              <div className="dashboard-location-header">
                <span>📍</span>
                <span className="dashboard-location-name">{locationName}</span>
                <div className="dashboard-location-divider" />
                <span className="dashboard-location-count">
                  {apts.filter(a => a.status !== "cancelled").length} marcações
                </span>
              </div>

              <div className="dashboard-appointments">
                {apts.map(apt => (
                  <div key={apt._id} className={`dashboard-apt-card ${apt.status === 'cancelled' ? 'cancelled' : ''}`}>

                    <div className="dashboard-apt-top">
                      <span className={`dashboard-apt-time ${apt.status === 'cancelled' ? 'cancelled' : ''}`}>
                        {dayjs(apt.startTime).tz('Europe/Lisbon').format('HH:mm')}
                        <span className="dashboard-apt-time-sep"> — </span>
                        {dayjs(apt.endTime).tz('Europe/Lisbon').format('HH:mm')}
                      </span>
                      <span
                        className="dashboard-apt-status"
                        style={{
                          background: statusColor[apt.status] + "22",
                          color: statusColor[apt.status],
                          border: `1px solid ${statusColor[apt.status]}44`
                        }}
                      >
                        {statusLabel[apt.status]}
                      </span>
                    </div>

                    <p className="dashboard-apt-name">{apt.clientName}</p>
                    <p className="dashboard-apt-phone">{apt.clientPhone}</p>
                    <p className="dashboard-apt-service">
                      {apt.service?.name} — <span className="dashboard-apt-price">{apt.service?.price}€</span>
                    </p>
                    {apt.notes && <p className="dashboard-apt-notes">"{apt.notes}"</p>}

                    {apt.status === "pending" && (
                      <div className="dashboard-apt-actions">
                        <button className="dashboard-apt-confirm" onClick={() => updateStatus(apt._id, "confirmed")}>✓ Confirmar</button>
                        <button className="dashboard-apt-cancel" onClick={() => updateStatus(apt._id, "cancelled")}>✕ Cancelar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
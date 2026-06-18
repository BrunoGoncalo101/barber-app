// src/pages/barber/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localePt from "dayjs/locale/pt";
import { useNavigate } from 'react-router-dom'

dayjs.locale(localePt);
dayjs.extend(utc);
dayjs.extend(timezone);

const statusColor = {
  pending: "#f59e0b",
  confirmed: "#00BFFF",
  cancelled: "#CC2200",
};

const statusLabel = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};


export default function Dashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/appointments?date=${selectedDate}`);
        if (!cancelled) setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "new_appointment") {
        api
          .get(`/appointments?date=${selectedDate}`)
          .then((res) => setAppointments(res.data))
          .catch((err) => console.error(err));
      }
    };
    return () => ws.close();
  }, [selectedDate]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      const { data } = await api.get(`/appointments?date=${selectedDate}`);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const prevDay = () =>
    setSelectedDate(
      dayjs(selectedDate).subtract(1, "day").format("YYYY-MM-DD"),
    );
  const nextDay = () =>
    setSelectedDate(dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD"));
  const isToday = selectedDate === dayjs().format("YYYY-MM-DD");

  // Agrupar por local
  const grouped = appointments.reduce((acc, apt) => {
    const key = apt.location?.name || "Sem local";
    if (!acc[key]) acc[key] = [];
    acc[key].push(apt);
    return acc;
  }, {});

  const navigate = useNavigate()
  const active = appointments.filter((a) => a.status !== "cancelled");

  return (
    <div style={{ minHeight: "100vh", background: "#050A0F", color: "#fff" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid #0a2030",
          background: "rgba(5,10,15,.97)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#00BFFF",
              margin: 0,
            }}
          >
            EL CHAPO
          </h1>
          <p style={{ color: "#556677", fontSize: 13, margin: 0 }}>
            Olá, {user?.name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
         <button
    onClick={() => navigate('/')}
    style={{ color: '#556677', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', transition: 'color .2s' }}
    onMouseOver={e => e.target.style.color = '#fff'}
    onMouseOut={e => e.target.style.color = '#556677'}
  >
    Voltar
  </button>
        <button
          onClick={logout}
          style={{
            color: "#556677",
            fontSize: 13,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.color = "#fff")}
          onMouseOut={(e) => (e.target.style.color = "#556677")}
        >
          Sair
        </button>
        </div>
      </div>

      <div
        style={{ maxWidth: 640, margin: "0 auto", padding: "24px 24px 48px" }}
      >
        {/* Navegação de data */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <button
            onClick={prevDay}
            style={{
              background: "#080D12",
              border: "1px solid #0a2030",
              color: "#fff",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 16,
              transition: "border-color .2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "#00BFFF")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "#0a2030")}
          >
            ←
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                margin: 0,
                textTransform: "capitalize",
              }}
            >
              {isToday ? "Hoje" : dayjs(selectedDate).format("dddd")}
            </p>
            <p style={{ color: "#556677", fontSize: 13, margin: 0 }}>
              {dayjs(selectedDate).tz('Europe/Lisbon').format('DD [de] MMMM [de] YYYY')}
            </p>
          </div>
          <button
            onClick={nextDay}
            style={{
              background: "#080D12",
              border: "1px solid #0a2030",
              color: "#fff",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 16,
              transition: "border-color .2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "#00BFFF")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "#0a2030")}
          >
            →
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: "auto", padding: "8px 12px", fontSize: 13 }}
          />
        </div>

        {/* Contador */}
        {!loading && (
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "#080D12",
                border: "1px solid #0a2030",
                borderRadius: 10,
                padding: "10px 16px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#556677",
                  fontSize: 11,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  margin: "0 0 2px",
                }}
              >
                Total
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: "#fff",
                }}
              >
                {active.length}
              </p>
            </div>
            <div
              style={{
                background: "#080D12",
                border: "1px solid #0a2030",
                borderRadius: 10,
                padding: "10px 16px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#556677",
                  fontSize: 11,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  margin: "0 0 2px",
                }}
              >
                Pendentes
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: "#f59e0b",
                }}
              >
                {appointments.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <div
              style={{
                background: "#080D12",
                border: "1px solid #0a2030",
                borderRadius: 10,
                padding: "10px 16px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#556677",
                  fontSize: 11,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  margin: "0 0 2px",
                }}
              >
                Confirmadas
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: "#00BFFF",
                }}
              >
                {appointments.filter((a) => a.status === "confirmed").length}
              </p>
            </div>
            <div
              style={{
                background: "#080D12",
                border: "1px solid #0a2030",
                borderRadius: 10,
                padding: "10px 16px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#556677",
                  fontSize: 11,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  margin: "0 0 2px",
                }}
              >
                Receita
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: "#00BFFF",
                }}
              >
                {active.reduce((sum, a) => sum + (a.service?.price || 0), 0)}€
              </p>
            </div>
          </div>
        )}

        {/* Lista agrupada por local */}
        {loading ? (
          <p className="loading">A carregar...</p>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>✂️</p>
            <p style={{ color: "#556677", fontSize: 14 }}>
              Sem marcações para este dia.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([locationName, apts]) => (
            <div key={locationName} style={{ marginBottom: 32 }}>
              {/* Label do local */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 14 }}>📍</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#00BFFF",
                    letterSpacing: ".05em",
                    textTransform: "uppercase",
                  }}
                >
                  {locationName}
                </span>
                <div style={{ flex: 1, height: 1, background: "#0a2030" }} />
                <span style={{ color: "#556677", fontSize: 12 }}>
                  {apts.filter((a) => a.status !== "cancelled").length}{" "}
                  marcações
                </span>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {apts.map((apt) => (
                  <div
                    key={apt._id}
                    style={{
                      background: "#080D12",
                      border: `1px solid ${apt.status === "cancelled" ? "#1a0a0a" : "#0a2030"}`,
                      borderRadius: 14,
                      padding: 18,
                      opacity: apt.status === "cancelled" ? 0.5 : 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 17,
                          fontWeight: 700,
                          color:
                            apt.status === "cancelled" ? "#556677" : "#fff",
                        }}
                      >
                        {dayjs(apt.startTime).tz('Europe/Lisbon').format('HH:mm')}
                        <span style={{ color: "#334455", fontWeight: 400 }}>
                          {" "}
                          —{" "}
                        </span>
                        {dayjs(apt.endTime).tz('Europe/Lisbon').format('HH:mm')}
                        <span style={{ color: "#334455", fontWeight: 400 }}>
                          {" "}
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 50,
                          fontWeight: 600,
                          background: statusColor[apt.status] + "22",
                          color: statusColor[apt.status],
                          border: `1px solid ${statusColor[apt.status]}44`,
                        }}
                      >
                        {statusLabel[apt.status]}
                      </span>
                    </div>

                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                        margin: "0 0 2px",
                      }}
                    >
                      {apt.clientName}
                    </p>
                    <p
                      style={{
                        color: "#556677",
                        fontSize: 13,
                        margin: "0 0 2px",
                      }}
                    >
                      {apt.clientPhone}
                    </p>
                    <p
                      style={{
                        color: "#556677",
                        fontSize: 13,
                        margin: 0,
                        textTransform: "capitalize",
                      }}
                    >
                      {apt.service?.name} —{" "}
                      <span style={{ color: "#00BFFF" }}>
                        {apt.service?.price}€
                      </span>
                    </p>
                    {apt.notes && (
                      <p
                        style={{
                          color: "#445566",
                          fontSize: 13,
                          margin: "8px 0 0",
                          fontStyle: "italic",
                        }}
                      >
                        "{apt.notes}"
                      </p>
                    )}

                    {apt.status === "pending" && (
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button
                          onClick={() => updateStatus(apt._id, "confirmed")}
                          style={{
                            background: "#001a0d",
                            border: "1px solid #00BFFF44",
                            color: "#00BFFF",
                            fontSize: 13,
                            fontWeight: 600,
                            padding: "7px 16px",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "all .2s",
                            flex: 1,
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background = "#002a1a")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background = "#001a0d")
                          }
                        >
                          ✓ Confirmar
                        </button>
                        <button
                          onClick={() => updateStatus(apt._id, "cancelled")}
                          style={{
                            background: "#1a0000",
                            border: "1px solid #CC220044",
                            color: "#CC2200",
                            fontSize: 13,
                            fontWeight: 600,
                            padding: "7px 16px",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "all .2s",
                            flex: 1,
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background = "#2a0000")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background = "#1a0000")
                          }
                        >
                          ✕ Cancelar
                        </button>
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
  );
}

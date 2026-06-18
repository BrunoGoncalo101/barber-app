// src/pages/client/SelectSlot.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import dayjs from '../../utils/dayjs';
import BookingHeader from "../../components/BookingHeader";

export default function SelectSlot() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!state?.service || !state?.date) {
      navigate("/");
      return;
    }
    api
      .get(
        `/appointments/slots?date=${state.date}&serviceId=${state.service._id}&locationId=${state.location._id}`,
      )
      .then((res) => setSlots(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [state?.date, state?.service, state?.location, navigate]);

  if (!state?.service || !state?.date) return null;

  return (
    <div className="page">
      <BookingHeader />
      <div className="page-card">
        <button
          className="page-back"
          onClick={() => navigate("/agendar/data", { state })}
        >
          ← Voltar
        </button>
        <h2 className="page-title">Escolhe a hora</h2>
        <p className="page-subtitle" style={{ textTransform: "capitalize" }}>
          {state.service.name} · {dayjs(state.date).format("DD/MM/YYYY")}
        </p>
        {loading ? (
          <p className="loading">A carregar...</p>
        ) : slots.length === 0 ? (
          <p className="loading">Sem disponibilidade para este dia.</p>
        ) : (
          <div className="slots-grid">
            {slots.map((slot, i) => (
              <button
                key={i}
                className={`slot-btn${selected === slot ? " selected" : ""}`}
                onClick={() => setSelected(slot)}
              >
                {dayjs(slot).tz('Europe/Lisbon').format('HH:mm')}
              </button>
            ))}
          </div>
        )}
        <button
          className="btn-solid"
          style={{ width: "100%" }}
          disabled={!selected}
          onClick={() =>
            navigate("/agendar/confirmar", {
              state: {
                ...state,
                startTime: selected,
              },
            })
          }
        >
          Seguinte
        </button>
      </div>
    </div>
  );
}

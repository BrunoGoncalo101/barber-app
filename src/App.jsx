import { Routes, Route } from 'react-router-dom'

// Client
import SelectService from './pages/client/SelectService.jsx'
import SelectDate from './pages/client/SelectDate.jsx'
import SelectSlot from './pages/client/SelectSlot.jsx'
import ConfirmBooking from './pages/client/ConfirmBooking.jsx'
import BookingSuccess from './pages/client/BookingSuccess.jsx'
import ManageAppointment from './pages/client/ManageAppointment.jsx'
import SelectLocation from './pages/client/SelectLocation.jsx'
import Home from './pages/Home.jsx'

// Barber
import Login from './pages/barber/Login.jsx'
import Dashboard from './pages/barber/Dashboard.jsx'

import PrivateRoute from './components/PrivateRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Fluxo cliente */}
      <Route path="/" element={<Home />} />
      <Route path="/agendar/local" element={<SelectLocation />} />
      <Route path="/agendar/data" element={<SelectDate />} />
      <Route path="/agendar/servico" element={<SelectService />} />
      <Route path="/agendar/hora" element={<SelectSlot />} />
      <Route path="/agendar/confirmar" element={<ConfirmBooking />} />
      <Route path="/agendar/sucesso" element={<BookingSuccess />} />
      <Route path="/marcacao/:token" element={<ManageAppointment />} />

      {/* Barbeiro */}
      <Route path="/barbeiro/login" element={<Login />} />
      <Route path="/barbeiro" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
    </Routes>
  )
}
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const services = [
  { name: 'Cabelo', desc: 'Corte clássico ou moderno', dur: '30 min', price: '10€' },
  { name: 'Barba', desc: 'Modelação e acabamento perfeito', dur: '20 min', price: '5€' },
  { name: 'Cabelo e Barba', desc: 'O pack completo', dur: '45 min', price: '13€' },
]

const locations = [
  { name: 'Alpendurada', addr: 'R. Francisco Borges da Cruz\n4575-052 Alpendurada', maps: 'https://maps.app.goo.gl/putFzzqtUXAo6LqF6' },
  { name: 'Vila Boa do Bispo', addr: 'Café Chaparral\nVila Boa do Bispo', maps: 'https://maps.app.goo.gl/gcMKeYF67nB4aeNd6' },
]

const socials = [
  { icon: '📷', label: 'Instagram', url: 'https://instagram.com/el_chapo_barbearia' },
  { icon: '👍', label: 'Facebook', url: 'https://www.facebook.com/p/El-Chapo-Barbearia-100086287937842/' },
]

export default function Home() {
  const navigate = useNavigate()

  const [logoClicks, setLogoClicks] = useState(0)
const [clickTimer, setClickTimer] = useState(null)

const handleLogoClick = () => {
  const newCount = logoClicks + 1
  setLogoClicks(newCount)

  if (clickTimer) clearTimeout(clickTimer)

  if (newCount >= 3) {
    setLogoClicks(0)
    // Verifica se já tem token ativo
    const token = localStorage.getItem('barber_token')
    if (token) {
      navigate('/barbeiro')
    } else {
      navigate('/barbeiro/login')
    }
    return
  }

  const timer = setTimeout(() => setLogoClicks(0), 600)
  setClickTimer(timer)
}

  return (
    <div className="home">

      {/* NAV */}
      <nav className="home-nav">
        <span className="home-nav-logo">EL CHAPO</span>
        <div className="home-nav-links">
          <a href="#servicos">Serviços</a>
          <a href="#locais">Locais</a>
          <a href="#sobre">Sobre</a>
          <button className="btn-solid-sm" onClick={() => navigate('/agendar/local')}>Agendar ✂</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
  <img src="/logo.jpeg" alt="El Chapo Barbearia" />
</div>
        <p className="section-label">EST. 2020 · Marco de Canaveses</p>
        <h1>EL CHAPO</h1>
        <p className="home-hero-sub">Barbearia</p>
        <div className="home-hero-tagline">
          <div className="home-hero-tagline-line" />
          <span>Onde Estilo é Lei</span>
          <div className="home-hero-tagline-line" />
        </div>
        <div className="home-hero-btns">
          <button className="btn-solid" onClick={() => navigate('/agendar/local')}>Agendar agora</button>
          <a href="#servicos"><button className="btn-outline">Ver serviços</button></a>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="home-services">
        <div className="section-header">
          <p className="section-label">O que fazemos</p>
          <div className="section-divider" />
          <h2 className="section-title">Serviços & Preços</h2>
        </div>
        {services.map(s => (
          <div key={s.name} className="service-row">
            <div>
              <p className="service-name">{s.name}</p>
              <p className="service-desc">{s.desc} · {s.dur}</p>
            </div>
            <span className="service-price">{s.price}</span>
          </div>
        ))}
        <div className="section-cta">
          <button className="btn-solid" onClick={() => navigate('/agendar/local')}>Agendar agora</button>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="home-about">
        <div className="home-about-inner">
          <div>
            <p className="section-label">Quem somos</p>
            <div className="about-divider" />
            <h2>Uma barbearia de referência</h2>
            <p>Na El Chapo Barbearia, o estilo é lei. Com dois espaços no concelho de Marco de Canaveses, cada cliente é tratado com a atenção que merece.</p>
            <p>Mais do que um corte, oferecemos uma experiência.</p>
          </div>
          <div className="about-photos">
            <img src="/alpendurada.jpeg" alt="Alpendurada" />
            <img src="/vila_boa.jpeg" alt="Vila Boa do Bispo" />
          </div>
        </div>
      </section>

      {/* LOCAIS */}
      <section id="locais" className="home-locations">
        <div className="section-header">
          <p className="section-label">Onde estamos</p>
          <div className="section-divider" />
          <h2 className="section-title">Localizações</h2>
        </div>
        <div className="locations-grid">
          {locations.map(l => (
            <div key={l.name} className="location-card">
              <div className="location-pin">📍</div>
              <div>
                <p className="location-name">{l.name}</p>
                <p className="location-addr">{l.addr}</p>
              </div>
              <a href={l.maps} target="_blank" rel="noreferrer" className="location-link">Ver no mapa →</a>
            </div>
          ))}
        </div>
      </section>

      {/* REDES SOCIAIS */}
      <section className="home-socials">
        <p className="section-label">Segue-nos</p>
        <div className="section-divider" />
        <h2>Redes sociais</h2>
        <div className="socials-list">
          {socials.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="social-btn">
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span>{s.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <p className="home-footer-name">EL CHAPO</p>
        <p>© {new Date().getFullYear()} El Chapo Barbearia · Onde Estilo é Lei</p>
      </footer>

    </div>
  )
}
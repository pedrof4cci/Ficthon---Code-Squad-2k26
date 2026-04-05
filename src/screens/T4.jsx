import { useState, useEffect } from 'react' // 1. Adicione os hooks
import logoSvg from '../assets/logo.svg'

const CATS = [
  { icon: '🔒', label: 'Golpe digital',              ml: 0,  active: false },
  { icon: '💼', label: 'Assédio no trabalho',         ml: 24, active: false },
  { icon: '📷', label: 'Vazamento de imagem íntima',  ml: 48, active: true  },
  { icon: '🎤', label: 'Discriminação em entrevista', ml: 24, active: false },
  { icon: null, label: 'Ver mais histórias...',        ml: 0,  active: false },
]

export default function T4({ nav }) {
  // 2. Estado para armazenar o nome do usuário
  const [nomeUsuario, setNomeUsuario] = useState('Visitante')

  // 3. Busca o nome salvo no localStorage ao carregar a tela
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('user')
    if (dadosSalvos) {
      const user = JSON.parse(dadosSalvos)
      // Tenta pegar o 'username' ou o 'login' que foi usado
      setNomeUsuario(user.username || user.login || 'Usuário')
    }
  }, [])

  return (
    <div className="screen">
      {/* TOPBAR */}
      <header style={s.topbar}>
        <button style={s.iconBtn} aria-label="Menu">
          <span style={s.hLine}/><span style={s.hLine}/><span style={s.hLine}/>
        </button>
        <div style={s.topbarTitle}>
          <div>E se fosse</div>
          <div className="gradient-text">você?</div>
        </div>
        <button style={s.iconBtn} aria-label="Perfil">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="8" r="4" stroke="#fff" strokeWidth="1.8"/>
            <path d="M3 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* SAUDAÇÃO */}
      <section style={s.greeting}>
        {/* 4. Troque o texto fixo pela variável nomeUsuario */}
        <p style={s.greetingName}>Olá, {nomeUsuario}</p>
        <h1 style={s.greetingTitle}>Que história você<br/>quer viver hoje?</h1>
        <p style={s.greetingSub}>Suas decisões mudam o rumo da história.</p>
      </section>

      {/* CATEGORIAS (Mantido igual) */}
      <nav style={s.categories}>
        {CATS.map((c, i) => (
          <button
            key={i}
            style={{
              ...s.categoryBtn,
              marginLeft: c.ml,
              background: c.active ? 'linear-gradient(90deg,#FBBC21,#F59F0A)' : '#2A2A33',
            }}
            onClick={c.active ? () => nav('t5') : undefined}
          >
            {c.icon && <span style={s.categoryIcon}>{c.icon}</span>}
            <span style={{ ...s.categoryLabel, color: c.active ? '#000' : '#fff' }}>{c.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* RODAPÉ (Mantido igual) */}
      <footer style={s.bottomBar}>
        <button style={s.ctaBtn}>
          <img src={logoSvg} alt="" width="50" height="35" style={{ flexShrink: 0 }}/>
          <span style={s.ctaText}>Conte seu relato</span>
        </button>
      </footer>
    </div>
  )
}

// Os estilos (s) permanecem os mesmos que você já definiu...
const s = {
    topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '41px 24px 10px' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center' },
    hLine: { display: 'block', width: 20, height: 2, background: '#fff', borderRadius: 2 },
    topbarTitle: { fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 24, color: '#fff', textAlign: 'center' },
    greeting: { padding: '75px 24px 0' },
    greetingName: { fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 400, color: '#fff', marginBottom: 14 },
    greetingTitle: { fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 14 },
    greetingSub: { fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#6B6B7A', marginBottom: 41 },
    categories: { padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 },
    categoryBtn: { height: 36.13, border: 'none', borderRadius: 50, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, cursor: 'pointer', alignSelf: 'flex-start' },
    categoryIcon: { fontSize: 14, lineHeight: 1 },
    categoryLabel: { fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' },
    bottomBar: { padding: '0 24px 41px' },
    ctaBtn: { width: '100%', height: 52, background: '#2A2A33', border: 'none', borderRadius: 50, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 10, cursor: 'pointer' },
    ctaText: { fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500, color: '#fff' },
}

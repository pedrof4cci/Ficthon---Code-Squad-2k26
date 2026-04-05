import { useRef, useState, useEffect } from 'react'
import BtnVoltar from '../components/BtnVoltar'

const CARDS = [
  { 
    disponivel: true, 
    titulo: "Quando o Normal Esconde Padrões",
    texto: "Você acaba de entrar em uma multinacional do setor financeiro.O ambiente é profissional, organizado e aparentemente acolhedor. Seu líder é carismático e bem visto pela equipe.As interações são leves, com humor e participação do grupo.Com o tempo, pequenas situações começam a surgir. Interrupções, correções e diferenças sutis nas reações. Uma colega parece ser tratada de forma diferente. Ideias semelhantes nem sempre recebem o mesmo reconhecimento. Nada é explícito, e tudo parece acontecer de forma natural. O time segue normalmente, sem questionamentos. No seu papel, você precisa interpretar o ambiente. Nem tudo será claro — e suas escolhas influenciam essa percepção.",
    imgDesc: "Imagem de um escritório moderno e corporativo"
  },
  { 
    disponivel: false, 
    titulo: "Segunda História",
    texto: "Descrição da segunda experiência aqui...",
    imgDesc: "Descrição da imagem do segundo card"
  },
  { 
    disponivel: false, 
    titulo: "Terceira História",
    texto: "Descrição da terceira experiência aqui...",
    imgDesc: "Descrição da imagem do terceiro card"
  },
  { 
    disponivel: false, 
    titulo: "Quarta História",
    texto: "Descrição da quarta experiência aqui...",
    imgDesc: "Descrição da imagem do quarto card"
  },
  { 
    disponivel: false, 
    titulo: "Quinta História",
    texto: "Descrição da quinta experiência aqui...",
    imgDesc: "Descrição da imagem do quinto card"
  },
]

export default function T5({ nav }) {
  const carouselRef = useRef(null)
  const [cardAtivo, setCardAtivo] = useState(0)
  const [aviso, setAviso] = useState(false)

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    function onScroll() {
      const centro = el.scrollLeft + el.offsetWidth / 2
      let menor = Infinity, novoAtivo = 0
      el.querySelectorAll('[data-card]').forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centro)
        if (dist < menor) { menor = dist; novoAtivo = i }
      })
      setCardAtivo(novoAtivo)
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  function avancar() {
    if (CARDS[cardAtivo].disponivel) nav('t6')
    else setAviso(true)
  }

  return (
    <div className="screen" style={{ position: 'relative' }}>
      {aviso && (
        <div style={s.avisoOverlay} onClick={e => { if (e.target === e.currentTarget) setAviso(false) }}>
          <div style={s.avisoBox}>
            <span style={{ fontSize: 36 }}>🔒</span>
            <p style={s.avisoTitulo}>Indisponível momentaneamente</p>
            <p style={s.avisoTexto}>Esta história ainda está sendo preparada. Em breve estará disponível para você vivenciar.</p>
            <button style={s.avisoBtn} onClick={() => setAviso(false)}>Entendido</button>
          </div>
        </div>
      )}

      <BtnVoltar onClick={() => nav('t4')} style={s.btnVoltar} />

      <div ref={carouselRef} style={s.carousel}>
        {CARDS.map((c, i) => (
          <div key={i} data-card={i} style={{ ...s.card, ...(i === cardAtivo ? s.cardActive : s.cardInactive) }}>
            <div style={s.cardImg}>
              <p style={s.cardImgPh}>{c.imgDesc}</p> 
            </div>
            <h2 style={s.cardTitle}>{c.titulo}</h2>
            <p style={{ ...s.cardText, whiteSpace: 'pre-line' }}>{c.texto}</p>
          </div>
        ))}
      </div>

      <footer style={s.bottomBar}>
        <button style={s.ctaBtn} onClick={avancar}>Selecionar</button>
      </footer>
    </div>
  )
}

const s = {
  btnVoltar: { position: 'absolute', top: 20, left: 20, zIndex: 10, padding: 8 },
  carousel: {
    flex: 1, display: 'flex', flexDirection: 'row', gap: 16,
    overflowX: 'scroll', overflowY: 'hidden',
    scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
    padding: '40px 52px 120px', scrollPaddingLeft: 52,
  },
  card: {
    minWidth: '75vw', maxWidth: '75vw', scrollSnapAlign: 'center',
    background: '#2A2A33', borderRadius: 20, overflow: 'hidden',
    display: 'flex', flexDirection: 'column', flexShrink: 0,
    transition: 'transform .3s, opacity .3s',
  },
  cardActive:   { transform: 'scale(1)',    opacity: 1   },
  cardInactive: { transform: 'scale(0.95)', opacity: 0.6 },
  cardImg: { width: '100%', height: 220, background: '#3a3a45', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, flexShrink: 0 },
  cardImgPh: { fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#6B6B7A', textAlign: 'center', lineHeight: 1.5 },
  cardTitle: { fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', padding: '16px 16px 8px', lineHeight: 1.2 },
  cardText: { fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#6B6B7A', padding: '0 16px 20px', lineHeight: 1.6 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 36px', background: 'linear-gradient(to top,#0F0F14 70%,transparent)' },
  ctaBtn: { width: '100%', height: 52, background: 'linear-gradient(90deg,#FBBC21,#F59F0A)', border: 'none', borderRadius: 50, fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: '#000', cursor: 'pointer' },
  avisoOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 },
  avisoBox: { background: '#1e1e26', border: '1.5px solid #2A2A33', borderRadius: 20, padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, maxWidth: 280, width: '100%' },
  avisoTitulo: { fontFamily: "'Sora',sans-serif", fontSize: 17, fontWeight: 700, color: '#fff' },
  avisoTexto: { fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#6B6B7A', lineHeight: 1.6 },
  avisoBtn: { width: '100%', height: 44, background: 'linear-gradient(90deg,#FBBC21,#F59F0A)', border: 'none', borderRadius: 50, fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: '#000', cursor: 'pointer', marginTop: 4 },
}

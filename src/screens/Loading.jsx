import { useState, useEffect } from 'react'
import BtnVoltar from '../components/BtnVoltar'

const AMBER = '#F59F0A'
const WHITE = '#FFFFFF'

const FRAMES = [
  [false, false, false, false, false],
  [true,  false, false, false, false],
  [true,  true,  false, false, false],
  [true,  true,  true,  false, false],
  [true,  true,  true,  true,  false],
  [true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true ],
  [true,  false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
]

function LogoAnimada() {
  const [fi, setFi] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setFi(f => (f + 1) % FRAMES.length), 380)
    return () => clearInterval(id)
  }, [])
  const [root, left, center, right, top] = FRAMES[fi]
  const c = v => v ? AMBER : WHITE
  const tr = { transition: `fill 0.3s ease` }
  return (
    <svg width="180" height="180" viewBox="0 0 2348 1508" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="1169.92" cy="175.254"  rx="175.285" ry="175.254" fill={c(top)}    style={tr} />
      <ellipse cx="1169.92" cy="1088.21"  rx="175.285" ry="175.254" fill={c(root)}   style={tr} />
      <ellipse cx="1830.3"  cy="321.978"  rx="175.285" ry="175.254" fill={c(right)}  style={tr} />
      <path d="M1626.61 317.621C1501.61 347.83 1389.71 419.323 1308.04 521.142C1226.37 622.961 1179.44 749.49 1174.44 881.339L1240.39 883.977C1244.82 766.952 1286.48 654.649 1358.96 564.277C1431.45 473.906 1530.78 410.452 1641.72 383.639L1626.61 317.621Z" fill={c(center)} style={tr} />
      <ellipse cx="175.285" cy="175.254" rx="175.285" ry="175.254" transform="matrix(-1 0 0 1 692.986 146.724)" fill={c(left)} style={tr} />
      <path d="M721.391 317.621C846.385 347.83 958.293 419.323 1039.96 521.142C1121.63 622.961 1168.56 749.49 1173.56 881.339L1107.61 883.977C1103.18 766.952 1061.52 654.649 989.036 564.277C916.548 473.906 817.222 410.452 706.281 383.639L721.391 317.621Z" fill={c(left)} style={tr} />
      <path d="M1141.39 366.811H1206.61L1178.08 794.757V880.346H1169.92V794.757L1141.39 366.811Z" fill={c(center)} style={tr} />
    </svg>
  )
}

export default function Loading({ nav }) {
  useEffect(() => {
    const id = setTimeout(() => nav('t7'), 4000)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="screen">
      <header style={s.topbar}>
        <BtnVoltar onClick={() => nav('t6')} style={s.btnVoltar} />
        <div style={s.topbarTitle}>
          <div>E se fosse</div>
          <div className="gradient-text">você?</div>
        </div>
        <div style={s.topbarSpacer} />
      </header>

      <div style={s.content}>
        <p style={s.textTop}>Identificando os pontos de decisão...</p>
        <LogoAnimada />
        <p style={s.textBottom}>Gerando seu relatório final personalizado</p>
      </div>
    </div>
  )
}

const s = {
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 24px 12px', flexShrink: 0 },
  btnVoltar: { padding: 8, width: 36 },
  topbarTitle: { fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', textAlign: 'center', lineHeight: 1.35 },
  topbarSpacer: { width: 36 },
  content: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 52, padding: '0 40px' },
  textTop:    { fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#6B6B7A', textAlign: 'center' },
  textBottom: { fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#6B6B7A', textAlign: 'center' },
}

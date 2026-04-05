export default function Avisos({ nav }) {
  return (
    <div className="screen">
      <header style={s.topbar}>
        <button style={s.iconBtn} onClick={() => nav('t1')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div style={s.topbarTitle}>AVISOS <span className="gradient-text">GERAIS</span></div>
        <div style={s.spacer} />
      </header>
      <main style={s.scroll}>
        <div style={s.card}>
          <section style={s.section}><h3 style={s.h3}>Novas Histórias</h3><p style={s.p}>Adicionamos 3 novos arcos narrativos na categoria de Segurança Digital.</p></section>
          <section style={s.section}><h3 style={s.h3}>Manutenção</h3><p style={s.p}>O sistema passará por instabilidade no dia 20/05 para melhorias nos servidores.</p></section>
          <section style={s.section}><h3 style={s.h3}>Comunidade</h3>
            <ul style={s.list}>
              <li style={s.li}><span style={s.dash}>—</span>Relatos aprovados agora geram pontos de experiência.</li>
              <li style={s.li}><span style={s.dash}>—</span>Melhoramos o sistema de anonimato para sua segurança.</li>
              <li style={s.li}><span style={s.dash}>—</span>O suporte via chat agora é 24h.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}

const s = {
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '50px 24px 15px', flexShrink: 0 },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#fff', display: 'flex', alignItems: 'center' },
  topbarTitle: { fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, textAlign: 'center', textTransform: 'uppercase', color: '#fff' },
  spacer: { width: 40 },
  scroll: { flex: 1, overflowY: 'auto', padding: '10px 24px 30px' },
  card: { border: '1px solid rgba(255,255,255,.15)', borderRadius: 28, padding: 24, background: 'rgba(255,255,255,.02)' },
  section: { marginBottom: 24 },
  h3: { fontFamily: "'Sora',sans-serif", fontSize: 14, color: '#6B6B7A', marginBottom: 12, textTransform: 'uppercase' },
  p: { fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.85)', marginBottom: 12 },
  list: { listStyle: 'none' },
  li: { fontSize: 13, color: 'rgba(255,255,255,.7)', marginBottom: 10, display: 'flex', gap: 12 },
  dash: { color: '#FBBC21', fontWeight: 'bold' },
}

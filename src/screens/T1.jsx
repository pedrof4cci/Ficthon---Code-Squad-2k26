import logoSvg from '../assets/logo.svg'

export default function T1({ nav }) {
  return (
    <div className="screen">
      <div style={s.content}>
        <img height="285px" src={logoSvg} alt="" />
        <div style={s.titulo}>
          <h1 style={s.mainTitle}>E se fosse </h1>
          <h1 style={s.mainTitle}><span className="gradient-text">você?</span></h1>
        </div>
        <p style={s.subtitle}>A empatia começa quando a história é sua.</p>
        <p style={s.termsText}>
          Ao continuar, você confirma que leu e concorda com nossos{' '}
          <span style={s.termsLink} onClick={() => nav('termos')}>Termos de Uso</span>
          {' '}e{' '}
          <span style={s.termsLink} onClick={() => nav('avisos')}>Política de Privacidade</span>
          , que detalham o uso do serviço e a proteção dos seus dados.
        </p>
        <button style={s.btnPrimary} onClick={() => nav('t2')}>Nova Conta</button>
        <button style={s.btnSecondary} onClick={() => nav('t3')}>Entrar</button>
      </div>
    </div>
  )
}

const s = {
  content: {
    flex: 1, display: 'flex', flexDirection: 'column',
    padding: '40px 24px 32px', justifyContent: 'center', alignItems: 'center',
  },
  titulo: { textAlign: 'center' },
  mainTitle: {
    fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 800,
    color: '#fff', textAlign: 'center', marginBottom: 1, lineHeight: 1.2,
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#6B6B7A',
    textAlign: 'center', marginBottom: 48, lineHeight: 1.4,
  },
  termsText: {
    fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#6B6B7A',
    textAlign: 'start', lineHeight: 1.5, marginBottom: 32,
  },
  termsLink: { color: '#FBBC21', cursor: 'pointer' },
  btnPrimary: {
    width: '100%', height: 85, background: 'white', border: 'none',
    borderRadius: 14, fontFamily: "'Sora', sans-serif", fontSize: 16,
    fontWeight: 700, color: '#000', cursor: 'pointer', marginBottom: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
    paddingLeft: 24,
  },
  btnSecondary: {
    width: '100%', height: 85, background: '#2A2A33',
    border: '1.5px solid #2A2A33', borderRadius: 14,
    fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600,
    color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
    paddingLeft: 24,
  },
}

import { useState } from 'react'
import BtnVoltar from '../components/BtnVoltar'

const GoogleSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const FacebookSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/>
  </svg>
)

function validateEmail(e) {
  return /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(e)
}

export default function T2({ nav }) {
  const [f, setF] = useState({ email:'', username:'', password:'', confirm:'' })
  const [err, setErr] = useState({})

  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))

  function validate() {
    const e = {}
    if (!f.email || !validateEmail(f.email)) e.email = 'E-mail inválido'
    if (!f.username || f.username.length < 3) e.username = 'Usuário deve ter pelo menos 3 caracteres'
    if (!f.password || f.password.length < 6) e.password = 'Senha deve ter pelo menos 6 caracteres'
    if (f.password !== f.confirm) e.confirm = 'As senhas não coincidem'
    setErr(e);
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (validate()) {
      localStorage.setItem('user', JSON.stringify({ email: f.email, username: f.username, password: f.password }))
      nav('t4')
    }
  }

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <BtnVoltar onClick={() => nav('t1')} style={s.btnVoltar} />
      <div style={s.content}>
        <div style={s.topbar}>
          <h2 style={s.topbarTitle}>
            E se fosse <br /> <span className="gradient-text">você?</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {[
            { key:'email', type:'email', ph:'E-mail' },
            { key:'username', type:'text', ph:'Usuário' },
            { key:'password', type:'password', ph:'Senha' },
            { key:'confirm', type:'password', ph:'Confirmar senha' },
          ].map(({ key, type, ph }) => (
            <div key={key} style={s.inputGroup}>
              <input 
                type={type} 
                placeholder={ph} 
                value={f[key]} 
                onChange={set(key)} 
                style={{ ...s.formInput, ...(err[key] ? s.inputError : {}) }} 
              />
              {err[key] && <div style={s.errorMsg}>{err[key]}</div>}
            </div>
          ))}
          <button type="submit" style={s.btnPrimary}>Inscreva-se</button>
        </form>

        <div style={s.divider}><span style={s.dividerText}>ou</span></div>

        <div style={s.socialBtns}>
          <button style={s.socialBtn} onClick={() => {}}><GoogleSVG /></button>
          <button style={s.socialBtn} onClick={() => {}}><FacebookSVG /></button>

        </div>

        <div style={s.loginLink}>
          <span style={s.link} onClick={() => nav('t3')}>Já possui uma conta? Entrar</span>
        </div>
      </div>
    </div>
  )
}

const s = {
  btnVoltar: { 
    position: 'absolute',
    top: 24,
    left: 24,
    padding: 10,
    zIndex: 10
  },
  content: { 
    flex: 1, 
    padding: '32px 24px', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  topbar: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '60px 0 41px' 
  },
  topbarTitle: { 
    fontFamily: "'Sora',sans-serif", 
    fontSize: 38, 
    fontWeight: 700, 
    color: '#fff', 
    textAlign: 'center',
    lineHeight: '1.1'
  },
  inputGroup: { marginBottom: 20 },
  formInput: { width: '100%', height: 52, background: 'white', border: '1px solid transparent', borderRadius: 12, padding: '0 16px', fontFamily: "'Inter',sans-serif", fontSize: 15, color: '#333', outline: 'none' },
  inputError: { borderColor: '#E5484D' },
  errorMsg: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#E5484D', marginTop: 6 },
  btnPrimary: { display: 'block', width: '70%', height: 52, background: 'linear-gradient(90deg,#FBBC21,#F59F0A)', border: 'none', borderRadius: 50, fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, color: '#000', cursor: 'pointer', margin: '8px auto 0' },
  divider: { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px 0' },
  dividerText: { fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#6B6B7A', background: '#0F0F14', padding: '0 16px' },
  socialBtns: { display: 'flex', gap: 16, justifyContent: 'center' },
  socialBtn: { width: 52, height: 52, background: '#2A2A33', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  loginLink: { textAlign: 'center', marginTop: 32 },
  link: { fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#FBBC21', cursor: 'pointer', fontWeight: 500 },
}

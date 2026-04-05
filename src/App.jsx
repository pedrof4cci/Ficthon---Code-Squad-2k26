import { useState } from 'react'
import T1 from './screens/T1'
import T2 from './screens/T2'
import T3 from './screens/T3'
import T4 from './screens/T4'
import T5 from './screens/T5'
import T6 from './screens/T6'
import T7 from './screens/T7'
import Loading from './screens/Loading'
import Termos from './screens/Termos'
import Avisos from './screens/Avisos'

export default function App() {
  const [tela, setTela] = useState('t1')
  const nav = (t) => setTela(t)

  return (
    <div className="app-shell">
      {tela === 't1'      && <T1      nav={nav} />}
      {tela === 't2'      && <T2      nav={nav} />}
      {tela === 't3'      && <T3      nav={nav} />}
      {tela === 't4'      && <T4      nav={nav} />}
      {tela === 't5'      && <T5      nav={nav} />}
      {tela === 't6'      && <T6      nav={nav} />}
      {tela === 't7'      && <T7      nav={nav} />}
      {tela === 'loading' && <Loading nav={nav} />}
      {tela === 'termos'  && <Termos  nav={nav} />}
      {tela === 'avisos'  && <Avisos  nav={nav} />}
    </div>
  )
}

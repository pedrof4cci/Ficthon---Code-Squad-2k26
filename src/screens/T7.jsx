/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  T7.jsx — Relatório personalizado baseado nas escolhas da simulação      ║
 * ║  Recebe: historico de cenas, scoreAcum, cena final                       ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * Props esperadas de T6:
 *   nav(tela, payload?) onde payload = {
 *     scoreAcumulado: number,       // -8 a +8
 *     cenasVisitadas: string[],     // todas as cenas visitadas em ordem
 *     cenaFinal: string,            // última cena intermediária (6_norm_A … 6_aten_D)
 *     escolhas: {[cena]: string},   // { cena_1: 'A', cena_2B: 'D', ... }
 *   }
 *
 * Para testes sem payload (rota direta), gera um relatório de fallback.
 */

import React, { useMemo } from 'react'

// ─── ÍCONES SVG INLINE ──────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
    <path d="M1 4.5L4 7.5L10 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconCircle = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)
const IconDot = () => (
  <svg width="8" height="8" viewBox="0 0 8 8">
    <circle cx="4" cy="4" r="3.5" fill="currentColor"/>
  </svg>
)

// ─── DIVISOR ────────────────────────────────────────────────────────────────
function Divisor({ label }) {
  return (
    <div style={s.divisor}>
      <div style={s.hr} />
      <span style={s.divisorLabel}>{label}</span>
      <div style={s.hr} />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MOTOR DE PERSONALIZAÇÃO
// Recebe o histórico completo e devolve todos os textos do relatório
// ══════════════════════════════════════════════════════════════════════════════

function gerarRelatorio({ scoreAcumulado, cenasVisitadas, cenaFinal, escolhas }) {
  const score = scoreAcumulado ?? 0
  const cenas = cenasVisitadas ?? []
  const fin   = cenaFinal ?? ''
  const esc   = escolhas ?? {}

  // ── Ramo geral (normalização vs atenção) ──────────────────────────────────
  const ramoNorm  = cenas.includes('cena_5_normalizacao')
  const ramoAten  = cenas.includes('cena_5_atencao')
  const passouLeticia = ramoAten

  // ── Consciência crescente vs decrescente ──────────────────────────────────
  // Respostas D = mais consciente (score -1), respostas A/C = normalização (score +1)
  const respostasD = Object.values(esc).filter(v => v === 'D').length
  const respostasA = Object.values(esc).filter(v => v === 'A').length
  const respostasC = Object.values(esc).filter(v => v === 'C').length
  const respostasB = Object.values(esc).filter(v => v === 'B').length

  const conscienciaAlta  = score <= -3            // muitas D
  const conscienciaMedia = score > -3 && score < 3
  const normalizacaoAlta = score >= 3             // muitas A/C

  // ── Nível do índice de consciência (0–100) ─────────────────────────────────
  // Transforma score de -8..+8 para 0..100 invertido (score baixo = alta consciência)
  const indiceConsc = Math.round(((score * -1 + 8) / 16) * 100)

  // ── Rótulo do índice ──────────────────────────────────────────────────────
  let rotuloIndice, descIndice, corIndice, posicaoTermometro
  if (indiceConsc >= 70) {
    rotuloIndice       = 'Alta'
    descIndice         = 'Você identificou com clareza os padrões que vivenciou, nomeou o desconforto e resistiu à pressão de normalizá-lo. Isso é raro — e importante.'
    corIndice          = '#7EC8A4'
    posicaoTermometro  = '75%'
  } else if (indiceConsc >= 40) {
    rotuloIndice       = 'Moderada'
    descIndice         = 'Você percebeu sinais de desconforto e os questionou, mas em alguns momentos preferiu deixar passar. Essa ambivalência é comum — e humana.'
    corIndice          = '#FBBC21'
    posicaoTermometro  = '50%'
  } else {
    rotuloIndice       = 'Em desenvolvimento'
    descIndice         = 'Ao longo da jornada você tendeu a normalizar o que aconteceu. Isso não é fraqueza — é o efeito mais poderoso do machismo sutil: fazer parecer que tudo está bem.'
    corIndice          = '#9A9AB0'
    posicaoTermometro  = '20%'
  }

  // ── Etapas da jornada ─────────────────────────────────────────────────────
  const etapas = ['Exposição', 'Dúvida', 'Pressão', 'Nomeação']
  const etapasAtivas = []
  etapasAtivas.push('Exposição') // sempre — cena_1

  if (respostasB > 0 || respostasD > 0) etapasAtivas.push('Dúvida')
  if (cenas.includes('cena_4') || ramoNorm || ramoAten) etapasAtivas.push('Pressão')
  if (conscienciaAlta || passouLeticia || fin.includes('D')) etapasAtivas.push('Nomeação')

  // ── Resumo da percepção ────────────────────────────────────────────────────
  let resumoTexto
  if (conscienciaAlta && passouLeticia) {
    resumoTexto = 'Você identificou um padrão sistemático: silenciamento, exclusão das reuniões e apropriação do seu trabalho. A conversa com Letícia confirmou o que você já sentia. Ao nomear o que estava acontecendo, você deu o passo mais difícil — e mais importante.'
  } else if (conscienciaAlta && ramoNorm) {
    resumoTexto = 'Mesmo no ramo em que a narrativa tentou normalizar os eventos, você reconheceu que havia algo errado. Você sentiu a humilhação, a descida de cargo disfarçada de elogio, e não deixou que a lógica do sistema apagasse essa percepção.'
  } else if (conscienciaMedia && passouLeticia) {
    resumoTexto = 'Você viveu entre a dúvida e o reconhecimento. A conversa com Letícia abriu algo que você ainda não sabia nomear. Você carregou o desconforto sem conseguir sempre articulá-lo — e isso é exatamente o que o machismo sutil provoca: uma sensação sem vocabulário.'
  } else if (conscienciaMedia && ramoNorm) {
    resumoTexto = 'Você oscilou entre aceitar a lógica apresentada por Rodrigo e sentir que algo não fechava. Essa ambivalência é real — ambientes que normalizam comportamentos abusivos dificultam a percepção porque tudo parece funcionar, até que não parece mais.'
  } else if (normalizacaoAlta && ramoNorm) {
    resumoTexto = 'Ao longo da simulação você tendeu a aceitar as explicações oferecidas pelo ambiente: ritmo de reunião, comunicação com cliente, suporte técnico. Esse é o mecanismo central do machismo sutil — cada evento isolado parece razoável. É o padrão que não é.'
  } else {
    resumoTexto = 'Sua jornada refletiu o peso de começar em um ambiente novo: a pressão de se adaptar, de não parecer difícil, de encontrar explicações razoáveis para o que acontece. Esse peso é real — e não é seu.'
  }

  // ── Sinais observados (baseados nas escolhas reais) ────────────────────────
  const sinais = []

  // Sempre presentes (cena_1 e estrutura da história garantem)
  sinais.push({ texto: 'Fala interrompida ou resumida por outra pessoa', intensidade: 'alto' })
  sinais.push({ texto: 'Crédito pelo trabalho dado a outra pessoa', intensidade: 'alto' })

  // Baseado em cenas visitadas
  if (cenas.includes('cena_2B') || cenas.includes('cena_2D')) {
    sinais.push({ texto: 'Sua função descrita como "jeito de ser" em vez de competência', intensidade: 'alto' })
  }
  if (cenas.includes('cena_2C')) {
    sinais.push({ texto: 'Feedback que combina elogio e crítica de forma desestabilizadora', intensidade: 'medio' })
  }
  if (cenas.includes('cena_3_normalizacao') || cenas.includes('cena_3_atencao')) {
    sinais.push({ texto: 'Exclusão de decisões na sua área de especialização', intensidade: 'alto' })
    sinais.push({ texto: 'Seu trabalho sem seu nome em comunicações oficiais', intensidade: 'alto' })
  }
  if (cenas.includes('cena_4')) {
    sinais.push({ texto: 'Ausência sistemática de convites para reuniões relevantes', intensidade: 'alto' })
  }
  if (ramoNorm) {
    sinais.push({ texto: 'Rebaixamento de função justificado por "perfil de comunicação"', intensidade: 'alto' })
  }
  if (ramoAten) {
    sinais.push({ texto: 'Padrão reconhecido por colega que vivenciou o mesmo processo', intensidade: 'medio' })
  }
  if (cenas.includes('cena_2C')) {
    sinais.push({ texto: 'Pressão para falar menos e adaptar seu estilo técnico', intensidade: 'medio' })
  }
  // Baseado em escolhas específicas
  if (esc['cena_4'] === 'C' || esc['cena_4'] === 'D') {
    sinais.push({ texto: 'Medo de ser percebida como "difícil" ao questionar decisões', intensidade: 'medio' })
  }
  if (esc['cena_2C'] === 'C') {
    sinais.push({ texto: 'Aprovação condicionada à diminuição da sua expressão técnica', intensidade: 'medio' })
  }

  // ── Direitos afetados ──────────────────────────────────────────────────────
  const direitos = []

  // Sempre
  direitos.push({
    titulo: 'Crédito pelo trabalho intelectual',
    oQue:   'Seu trabalho deve ser reconhecido com seu nome — em apresentações, e-mails e comunicações oficiais.',
    diaADia:'Análises, relatórios e projetos que você produz devem ser atribuídos a você, mesmo quando apresentados por outra pessoa.',
  })

  if (ramoNorm || cenas.includes('cena_3_normalizacao')) {
    direitos.push({
      titulo: 'Igualdade de oportunidade em projetos',
      oQue:   'Critérios de inclusão em projetos devem ser técnicos e transparentes, não baseados em afinidade ou gênero.',
      diaADia:'Ser designada para "suporte" enquanto colegas menos qualificados lideram pode configurar discriminação disfarçada de critério profissional.',
    })
  }

  direitos.push({
    titulo: 'Participação em decisões da sua área',
    oQue:   'Você tem direito a participar de reuniões onde se decide sobre metodologias e projetos da sua especialidade.',
    diaADia:'Reuniões na sua área realizadas sem você, quando você está disponível, merecem explicação formal e transparente.',
  })

  if (cenas.includes('cena_2C') || esc['cena_1'] === 'C') {
    direitos.push({
      titulo: 'Exercer sua competência técnica sem constrangimento',
      oQue:   'Você não deve ser pressionada a simplificar ou esconder seu conhecimento técnico para ser aceita.',
      diaADia:'Feedbacks que associam "comunicação melhor" ao fato de você falar menos ou com menos profundidade podem ser uma forma de silenciamento.',
    })
  }

  if (passouLeticia) {
    direitos.push({
      titulo: 'Dignidade no ambiente de trabalho',
      oQue:   'Padrões sistemáticos de exclusão e invisibilização afetam sua integridade psicológica e constituem assédio moral.',
      diaADia:'Quando o mesmo padrão se repete com mais de uma pessoa na mesma gestão, o problema não é individual — é estrutural.',
    })
  }

  // ── Próximos passos (personalizados pela cena final) ───────────────────────
  const passos = []

  // Baseado na cena final
  if (fin === 'cena_6_norm_D' || fin === 'cena_6_aten_D') {
    passos.push('Você já começou a documentar. Continue: datas, o que aconteceu, quem disse o quê, exatamente como foi dito.')
    passos.push('Esse registro tem valor legal — especialmente se você precisar formalizar uma denúncia no futuro.')
  } else if (fin === 'cena_6_aten_C') {
    passos.push('A conversa com Letícia te deu uma direção concreta: documentar. É simples — um documento com datas e falas exatas.')
    passos.push('Considere manter o canal com ela. Ter alguém dentro do ambiente que reconhece o padrão é raro e valioso.')
  } else if (fin === 'cena_6_aten_B') {
    passos.push('Você admitiu que não sabe ainda o que fazer — e isso já é honesto. Não saber também é uma resposta válida.')
    passos.push('Um primeiro passo concreto: escrever o que aconteceu enquanto está fresco. Sem decidir o que fazer com isso ainda.')
  } else if (fin === 'cena_6_aten_A') {
    passos.push('A voz pequena que você precisou abafar merece ser ouvida antes de qualquer decisão.')
    passos.push('Conversar com alguém de confiança — fora do trabalho — pode ajudar a nomear o que está acontecendo.')
  } else if (fin === 'cena_6_norm_C') {
    passos.push('Você percebeu que a raiva estava virando autocrítica. Nomear essa armadilha foi importante — e difícil.')
    passos.push('Se possível, converse com alguém de confiança. O que você está carregando não precisa ser carregado sozinho.')
  } else if (fin === 'cena_6_norm_B') {
    passos.push('Pela primeira vez você questionou se quer continuar ali. Esse questionamento merece ser levado a sério.')
    passos.push('Considere explorar o que é possível fazer dentro da empresa antes de qualquer decisão maior.')
  } else {
    // norm_A ou qualquer fallback
    passos.push('A sensação de que "faz sentido" que você precisa repetir três vezes talvez indique o contrário.')
    passos.push('Prestar atenção a padrões ao longo do tempo — não a eventos isolados — é o caminho para nomeá-los.')
  }

  // Passos comuns
  if (passouLeticia || conscienciaAlta) {
    passos.push('Se o padrão continuar, considere registrar formalmente junto ao RH ou Compliance da empresa.')
    passos.push('Sindicatos da área financeira oferecem orientação jurídica gratuita sobre assédio moral no trabalho.')
  } else {
    passos.push('Observar se o padrão se repete nas próximas semanas — com você e com outras pessoas.')
  }
  passos.push('Apoio psicológico pode ajudar a processar o impacto emocional, mesmo que você ainda não saiba nomear o problema.')

  // ── Frase final (baseada no arco completo) ────────────────────────────────
  let fraseFinal
  if (fin === 'cena_6_norm_D' || fin === 'cena_6_aten_D') {
    fraseFinal = '"Você guardou tudo. Com data. Com hora. Com as palavras exatas. Isso já é um ato de resistência."'
  } else if (fin === 'cena_6_aten_C') {
    fraseFinal = '"Você não saiu com uma resposta. Saiu com uma direção. Às vezes é isso que basta para começar."'
  } else if (fin === 'cena_6_aten_B') {
    fraseFinal = '"Não saber também é uma resposta. E admitir isso pra si mesma é o início de algo."'
  } else if (fin === 'cena_6_norm_C') {
    fraseFinal = '"A armadilha de transformar o que fizeram com você em algo que você fez com você mesma. Você a viu — e isso muda tudo."'
  } else if (fin === 'cena_6_norm_B') {
    fraseFinal = '"Você carregou isso sem mostrar. Mas o peso é real. E você não precisa carregá-lo sozinha."'
  } else if (normalizacaoAlta) {
    fraseFinal = '"Cada evento isolado parece razoável. É o padrão que não é. Você decide quando olhar para ele."'
  } else {
    fraseFinal = '"Você decide o seu caminho — mas o que você viveu nessa simulação também é vivido por pessoas reais, todo dia."'
  }

  return {
    indiceConsc,
    rotuloIndice,
    descIndice,
    corIndice,
    posicaoTermometro,
    etapas,
    etapasAtivas,
    resumoTexto,
    sinais,
    direitos,
    passos,
    fraseFinal,
    passouLeticia,
    ramoNorm,
    ramoAten,
    conscienciaAlta,
    normalizacaoAlta,
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════

export default function T7({ nav, payload }) {
  // payload vem de nav('t7', payload) em T6
  const {
    scoreAcumulado = 0,
    cenasVisitadas = ['cena_1', 'cena_2A', 'int_A', 'cena_3_normalizacao', 'cena_4', 'cena_5_normalizacao', 'cena_6_norm_B'],
    cenaFinal      = 'cena_6_norm_B',
    escolhas       = { cena_1: 'A', cena_2A: 'D', cena_3_normalizacao: 'B', cena_4: 'C', cena_5_normalizacao: 'B' },
  } = payload ?? {}

  const rel = useMemo(
    () => gerarRelatorio({ scoreAcumulado, cenasVisitadas, cenaFinal, escolhas }),
    [scoreAcumulado, cenasVisitadas, cenaFinal, escolhas]
  )

  return (
    <div className="screen" style={s.screenContainer}>

      {/* ÁREA ROLÁVEL */}
      <div style={s.contentScroll}>

        {/* ── 1. CABEÇALHO ────────────────────────────────────────────────── */}
        <header style={s.headerSection}>
          <p style={s.eyebrow}>E se fosse você?</p>
          <h1 style={s.mainTitle}>Resumo da experiência</h1>
          <p style={s.scopeNotice}>
            Este relatório é educativo e não substitui apoio profissional ou jurídico.
          </p>
        </header>

        {/* ── 2. TERMÔMETRO DE CONSCIÊNCIA ─────────────────────────────────── */}
        <section style={s.section}>
          <h3 style={s.sectionTitle}>Índice de Consciência</h3>

          {/* Barra */}
          <div style={s.thermWrap}>
            <div style={s.thermBar}>
              {/* Preenchimento */}
              <div style={{
                ...s.thermFill,
                width: `${rel.indiceConsc}%`,
                background: rel.corIndice,
              }} />
              {/* Ponteiro */}
              <div style={{
                ...s.thermPointer,
                left: `calc(${rel.indiceConsc}% - 1px)`,
              }} />
            </div>
            {/* Rótulos */}
            <div style={s.thermLabels}>
              <span style={s.thermLabelText}>Em desenvolvimento</span>
              <span style={s.thermLabelText}>Moderada</span>
              <span style={s.thermLabelText}>Alta</span>
            </div>
          </div>

          {/* Badge de resultado */}
          <div style={{ ...s.badgeWrap, borderColor: rel.corIndice + '44' }}>
            <span style={{ ...s.badgeDot, background: rel.corIndice }} />
            <span style={{ ...s.badgeLabel, color: rel.corIndice }}>{rel.rotuloIndice}</span>
          </div>
          <p style={s.thermDesc}>{rel.descIndice}</p>
        </section>

        {/* ── 3. JORNADA ──────────────────────────────────────────────────── */}
        <section style={s.section}>
          <Divisor label="Jornada de consciência" />
          <div style={s.timeline}>
            {rel.etapas.map((step, i) => {
              const ativa = rel.etapasAtivas.includes(step)
              return (
                <div key={step} style={s.timelineStep}>
                  {/* Linha conectora à esquerda */}
                  {i > 0 && (
                    <div style={{
                      ...s.timelineLine,
                      background: ativa ? '#FBBC21' : '#2A2A33',
                    }} />
                  )}
                  <div style={{
                    ...s.timelineDot,
                    background: ativa ? '#FBBC21' : '#2A2A33',
                    boxShadow: ativa ? '0 0 0 3px rgba(251,188,33,0.18)' : 'none',
                  }} />
                  <span style={{
                    ...s.timelineText,
                    color: ativa ? '#fff' : '#454555',
                    fontWeight: ativa ? 600 : 400,
                  }}>{step}</span>
                </div>
              )
            })}
          </div>

          <p style={s.personalPhrase}>
            Você passou por{' '}
            <strong style={{ color: '#fff' }}>
              {rel.etapasAtivas.join(', ')}
            </strong>.
          </p>
        </section>

        {/* ── 4. RESUMO DA PERCEPÇÃO ──────────────────────────────────────── */}
        <section style={s.section}>
          <Divisor label="O que aconteceu com Carolina" />
          <div style={s.summaryCard}>
            <p style={s.summaryText}>{rel.resumoTexto}</p>
          </div>

          {/* Destaque Letícia */}
          {rel.passouLeticia && (
            <div style={s.leticiaCard}>
              <div style={s.leticiaLine} />
              <div style={{ flex: 1 }}>
                <p style={s.leticiaLabel}>A perspectiva de Letícia</p>
                <p style={s.leticiaText}>
                  Letícia levou dois meses para perceber que não era ela. Você está na terceira semana.
                  Ter alguém que viu o padrão antes de você é raro — e importa.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ── 5. SINAIS OBSERVADOS ────────────────────────────────────────── */}
        <section style={s.section}>
          <Divisor label="Sinais observados na história" />
          <p style={s.subDesc}>
            Esses comportamentos foram identificados nas cenas que você vivenciou.
          </p>
          <div style={s.alertsGrid}>
            {rel.sinais.map((sinal, i) => (
              <div key={i} style={s.alertRow}>
                <div style={{
                  ...s.checkbox,
                  background: sinal.intensidade === 'alto' ? '#FBBC21' : 'transparent',
                  border: sinal.intensidade === 'alto' ? 'none' : '1.5px solid #454555',
                }}>
                  {sinal.intensidade === 'alto'
                    ? <IconCheck />
                    : <span style={{ color: '#454555' }}><IconCircle /></span>
                  }
                </div>
                <span style={{
                  ...s.alertLabel,
                  color: sinal.intensidade === 'alto' ? '#fff' : '#7A7A8A',
                }}>{sinal.texto}</span>
                {sinal.intensidade === 'alto' && (
                  <span style={s.alertBadge}>observado</span>
                )}
              </div>
            ))}
          </div>
          <p style={s.alertLegend}>
            <span style={s.legendDot} />amarelo = observado claramente
            {'  ·  '}
            <span style={{ ...s.legendDot, background: '#454555' }} />cinza = presente de forma velada
          </p>
        </section>

        {/* ── 6. DIREITOS AFETADOS ────────────────────────────────────────── */}
        <section style={s.section}>
          <Divisor label="Direitos que merecem atenção" />
          {rel.direitos.map((dir, i) => (
            <div key={i} style={s.direitoCard}>
              <h4 style={s.direitoTitle}>{dir.titulo}</h4>
              <p style={s.direitoInfo}>
                <span style={s.direitoTag}>O que é</span>
                {dir.oQue}
              </p>
              <p style={s.direitoInfo}>
                <span style={s.direitoTag}>No dia a dia</span>
                {dir.diaADia}
              </p>
            </div>
          ))}
        </section>

        {/* ── 7. PRÓXIMOS PASSOS ──────────────────────────────────────────── */}
        <section style={s.section}>
          <Divisor label="Próximos passos sugeridos" />
          <div style={s.passosList}>
            {rel.passos.map((passo, i) => (
              <div key={i} style={s.passoRow}>
                <div style={s.passoNumero}>{i + 1}</div>
                <p style={s.passoText}>{passo}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. CANAIS DE APOIO ──────────────────────────────────────────── */}
        <section style={s.section}>
          <Divisor label="Canais de apoio oficial" />
          <div style={s.supportGrid}>
            <div style={s.supportBox}>
              <strong style={s.supportTitle}>Disque 100</strong>
              <span style={s.supportDesc}>Direitos Humanos</span>
            </div>
            <div style={s.supportBox}>
              <strong style={s.supportTitle}>Ligue 180</strong>
              <span style={s.supportDesc}>Apoio à Mulher</span>
            </div>
          </div>
          <div style={{ ...s.supportBox, marginTop: 8, flexDirection: 'row', gap: 12, justifyContent: 'flex-start' }}>
            <strong style={s.supportTitle}>MPT</strong>
            <span style={s.supportDesc}>Ministério Público do Trabalho — orientação gratuita</span>
          </div>
        </section>

        {/* ── 9. FRASE FINAL ──────────────────────────────────────────────── */}
        <div style={s.fraseSection}>
          <div style={s.fraseLine} />
          <p style={s.fraseText}>{rel.fraseFinal}</p>
        </div>

      </div>

      {/* ── FOOTER FIXO ────────────────────────────────────────────────────── */}
      <footer style={s.footerFixed}>
        <button style={s.btnSecondary} onClick={() => nav('t4')}>Novo Cenário</button>
        <button style={s.btnPrimary}>Compartilhar</button>
      </footer>

    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ESTILOS
// ══════════════════════════════════════════════════════════════════════════════
const s = {
  // Layout
  screenContainer: {
    display: 'flex', flexDirection: 'column',
    height: '100vh', backgroundColor: '#0F0F14', overflow: 'hidden',
  },
  contentScroll: { flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' },

  // Cabeçalho
  headerSection: { padding: '40px 24px 20px', textAlign: 'center' },
  eyebrow: {
    fontFamily: "'Sora',sans-serif", fontSize: 11,
    color: '#FBBC21', textTransform: 'uppercase',
    letterSpacing: '0.14em', marginBottom: 8, fontWeight: 700,
  },
  mainTitle: {
    fontFamily: "'Sora',sans-serif", fontSize: 24,
    fontWeight: 800, color: '#fff', marginBottom: 10,
  },
  scopeNotice: {
    fontFamily: "'Inter',sans-serif", fontSize: 12,
    color: '#555560', fontStyle: 'italic', lineHeight: 1.5,
  },

  // Seção genérica
  section: {
    padding: '0 22px', marginBottom: 34,
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  sectionTitle: {
    fontFamily: "'Sora',sans-serif", fontSize: 14,
    fontWeight: 700, color: '#fff', margin: 0,
  },
  subDesc: {
    fontFamily: "'Inter',sans-serif", fontSize: 12,
    color: '#555560', lineHeight: 1.5, margin: 0,
  },

  // Termômetro
  thermWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  thermBar: {
    height: 8, background: '#1E1E27',
    borderRadius: 4, overflow: 'visible', position: 'relative',
  },
  thermFill: {
    height: '100%', borderRadius: 4,
    transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
  },
  thermPointer: {
    position: 'absolute', top: -3, width: 2, height: 14,
    background: '#fff', borderRadius: 1,
    transition: 'left 1s cubic-bezier(0.4,0,0.2,1)',
  },
  thermLabels: {
    display: 'flex', justifyContent: 'space-between', marginTop: 4,
  },
  thermLabelText: {
    fontFamily: "'Inter',sans-serif", fontSize: 10,
    color: '#454555', letterSpacing: '0.04em',
  },
  badgeWrap: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid',
    borderRadius: 8, padding: '8px 14px',
    alignSelf: 'flex-start',
  },
  badgeDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  badgeLabel: {
    fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700,
  },
  thermDesc: {
    fontFamily: "'Inter',sans-serif", fontSize: 13,
    color: '#C4C4D0', lineHeight: 1.7, margin: 0,
  },

  // Timeline
  timeline: {
    display: 'flex', alignItems: 'flex-start',
    padding: '6px 0', position: 'relative',
  },
  timelineStep: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 6, flex: 1, position: 'relative',
  },
  timelineLine: {
    position: 'absolute', top: 5, right: '50%',
    width: '100%', height: 2,
    transition: 'background .3s',
  },
  timelineDot: {
    width: 12, height: 12, borderRadius: '50%',
    flexShrink: 0, position: 'relative', zIndex: 1,
    transition: 'background .3s, box-shadow .3s',
  },
  timelineText: {
    fontFamily: "'Inter',sans-serif", fontSize: 10,
    textAlign: 'center', lineHeight: 1.3,
    transition: 'color .3s',
  },
  personalPhrase: {
    fontFamily: "'Inter',sans-serif", fontSize: 13,
    color: '#6B6B7A', textAlign: 'center', margin: 0,
  },

  // Resumo
  summaryCard: {
    background: '#16161E', padding: '16px 18px',
    borderRadius: 12, border: '1px solid #22222C',
  },
  summaryText: {
    fontFamily: "'Inter',sans-serif",
    color: '#C4C4D0', fontSize: 14, lineHeight: 1.8, margin: 0,
  },
  leticiaCard: {
    display: 'flex', gap: 14,
    background: 'rgba(126,200,164,0.05)',
    border: '1px solid rgba(126,200,164,0.15)',
    borderRadius: 12, padding: '14px 16px',
  },
  leticiaLine: {
    width: 3, borderRadius: 2, background: '#7EC8A4', flexShrink: 0,
  },
  leticiaLabel: {
    fontFamily: "'Sora',sans-serif", fontSize: 11,
    color: '#7EC8A4', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    marginBottom: 6,
  },
  leticiaText: {
    fontFamily: "'Inter',sans-serif", fontSize: 13,
    color: '#9AB8A8', lineHeight: 1.7, margin: 0,
  },

  // Sinais
  alertsGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  alertRow: { display: 'flex', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  alertLabel: {
    fontFamily: "'Inter',sans-serif", fontSize: 13,
    lineHeight: 1.4, flex: 1,
  },
  alertBadge: {
    fontFamily: "'Inter',sans-serif", fontSize: 9,
    color: '#FBBC21', border: '1px solid rgba(251,188,33,0.3)',
    borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase',
    letterSpacing: '0.08em', flexShrink: 0,
  },
  alertLegend: {
    fontFamily: "'Inter',sans-serif", fontSize: 11,
    color: '#454555', margin: '4px 0 0',
    display: 'flex', alignItems: 'center', gap: 6,
  },
  legendDot: {
    display: 'inline-block', width: 8, height: 8,
    borderRadius: '50%', background: '#FBBC21',
  },

  // Direitos
  direitoCard: {
    background: '#16161E', padding: '16px 18px',
    borderRadius: 12, border: '1px solid #22222C',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  direitoTitle: {
    fontFamily: "'Sora',sans-serif", fontSize: 14,
    fontWeight: 700, color: '#FBBC21', margin: 0,
  },
  direitoInfo: {
    fontFamily: "'Inter',sans-serif", fontSize: 12.5,
    color: '#9A9AB0', lineHeight: 1.65, margin: 0,
  },
  direitoTag: {
    display: 'inline-block',
    fontFamily: "'Sora',sans-serif", fontSize: 10,
    fontWeight: 700, color: '#454555',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    marginRight: 8,
  },

  // Próximos passos
  passosList: { display: 'flex', flexDirection: 'column', gap: 12 },
  passoRow: { display: 'flex', gap: 14, alignItems: 'flex-start' },
  passoNumero: {
    width: 24, height: 24, borderRadius: '50%',
    background: 'rgba(251,188,33,0.12)',
    border: '1px solid rgba(251,188,33,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Sora',sans-serif", fontSize: 11,
    fontWeight: 700, color: '#FBBC21', flexShrink: 0,
  },
  passoText: {
    fontFamily: "'Inter',sans-serif", fontSize: 13.5,
    color: '#C4C4D0', lineHeight: 1.7, margin: 0,
  },

  // Canais
  supportGrid: { display: 'flex', gap: 10 },
  supportBox: {
    flex: 1, background: '#16161E', padding: '14px 16px',
    borderRadius: 10, border: '1px solid #22222C',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  supportTitle: {
    fontFamily: "'Sora',sans-serif", fontSize: 15,
    fontWeight: 700, color: '#fff',
  },
  supportDesc: {
    fontFamily: "'Inter',sans-serif", fontSize: 12,
    color: '#6B6B7A', lineHeight: 1.4,
  },

  // Frase final
  fraseSection: {
    padding: '10px 24px 48px',
    display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center',
  },
  fraseLine: {
    width: 32, height: 2,
    background: 'linear-gradient(90deg,#FBBC21,#F59F0A)',
    borderRadius: 2,
  },
  fraseText: {
    fontFamily: "'Sora',sans-serif", fontSize: 15,
    color: '#6B6B7A', fontStyle: 'italic',
    textAlign: 'center', lineHeight: 1.6, margin: 0,
  },

  // Footer
  footerFixed: {
    padding: '14px 22px 34px',
    background: '#0F0F14',
    borderTop: '1px solid #1E1E27',
    display: 'flex', gap: 12, flexShrink: 0,
  },
  btnPrimary: {
    flex: 1, height: 50,
    background: 'linear-gradient(90deg,#FBBC21,#F59F0A)',
    border: 'none', borderRadius: 50,
    fontFamily: "'Sora',sans-serif", fontSize: 15,
    fontWeight: 700, color: '#000', cursor: 'pointer',
  },
  btnSecondary: {
    flex: 1, height: 50,
    background: 'transparent',
    border: '1.5px solid #2A2A33',
    borderRadius: 50,
    fontFamily: "'Sora',sans-serif", fontSize: 14,
    fontWeight: 600, color: '#fff', cursor: 'pointer',
  },

  // Divisor
  divisor: { display: 'flex', alignItems: 'center', gap: 10 },
  hr: { flex: 1, height: 1, background: '#1E1E27' },
  divisorLabel: {
    fontFamily: "'Inter',sans-serif", fontSize: 11,
    color: '#454555', whiteSpace: 'nowrap',
    textTransform: 'uppercase', letterSpacing: '0.1em',
  },
}

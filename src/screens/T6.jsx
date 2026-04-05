/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  T6.jsx — Tela de história interativa                                    ║
 * ║  Modo simulação completa — baseado no JSON da história                   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useRef, useEffect } from 'react'
import BtnVoltar from '../components/BtnVoltar'

// ─── ⚙️  CONFIGURAÇÕES ────────────────────────────────────────────────────────
const WEBHOOK_URL    = 'https://csesfv.app.n8n.cloud/webhook-test/code-setHistory'
const USER_ID        = 'usuario_01'
const HISTORIA_ID    = 'corp_machismo_sutil_01'
const MODO_SIMULACAO = true   // true = simulação local completa
// ──────────────────────────────────────────────────────────────────────────────

// ─── PERSONAGENS ──────────────────────────────────────────────────────────────
const PERSONAGENS_PADRAO = {
  rodrigo:  { nome: 'Rodrigo',  cor: '#4A9EFF' },
  leticia:  { nome: 'Letícia',  cor: '#7EC8A4' },
  felipe:   { nome: 'Felipe',   cor: '#9A9AB0' },
  thiago:   { nome: 'Thiago',   cor: '#9A9AB0' },
  diretor:  { nome: 'Diretor',  cor: '#9A9AB0' },
  carolina: { nome: 'Carolina', cor: '#FBBC21' },
}

// ══════════════════════════════════════════════════════════════════════════════
// BANCO DE CENAS — exatamente o JSON da história, com progresso calculado
// ══════════════════════════════════════════════════════════════════════════════

// Mapa de progresso por cena (0.0 → 1.0)
// A barra começa em 0 e vai crescendo conforme o usuário avança
const PROGRESSO_MAP = {
  cena_1:               0.0,
  cena_2A:              0.1,
  cena_2B:              0.1,
  cena_2C:              0.1,
  cena_2D:              0.1,
  int_A:                0.22,
  int_B:                0.22,
  int_C:                0.22,
  int_D:                0.22,
  cena_3_normalizacao:  0.35,
  cena_3_atencao:       0.35,
  cena_4:               0.50,
  cena_5_normalizacao:  0.65,
  cena_5_atencao:       0.65,
  cena_6_norm_A:        0.80,
  cena_6_norm_B:        0.80,
  cena_6_norm_C:        0.80,
  cena_6_norm_D:        0.80,
  cena_6_aten_A:        0.80,
  cena_6_aten_B:        0.80,
  cena_6_aten_C:        0.80,
  cena_6_aten_D:        0.80,
  relatorio_final:      1.0,
}

const CENAS = {

  // ── CENA 1 ──────────────────────────────────────────────────────────────────
  cena_1: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Sua primeira semana na Meridian Financial.' },
      { tipo: 'narracao', texto: 'A sala tem aquele cheiro de ar-condicionado novo e café que ninguém tomou ainda. Rodrigo conduz a reunião de pé, tablet na mão, fazendo todo mundo rir com facilidade. Você ainda está aprendendo os nomes.' },
      { tipo: 'narracao', texto: 'Em determinado momento, um problema com projeções de risco aparece na tela. Rodrigo olha pra você:' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Carolina, você manja mais disso. Explica pra gente.' },
      { tipo: 'narracao', texto: 'Você explica. É o que você sabe fazer — vai construindo o raciocínio em camadas, conectando os dados, sendo precisa. Você está bem. Está no seu elemento.' },
      { tipo: 'narracao', texto: 'No terceiro parágrafo, Rodrigo sorri e levanta a mão levemente:' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Gente, quando ela entra no modo especialista a gente precisa de legenda — mas é isso aí, Carol. Resumindo...' },
      { tipo: 'narracao', texto: 'Ele termina sua explicação em duas frases.' },
      { tipo: 'narracao', texto: 'Algumas pessoas riem.' },
      { tipo: 'narracao', texto: 'Você também sorri.' },
      { tipo: 'narracao', texto: 'A reunião segue.' },
      { tipo: 'narracao', texto: 'Mas alguma coisa ficou no ar.' },
    ],
    opcoes: [
      { id: 'A', texto: 'Nada demais — ele só resumiu pra ganhar tempo. Faz parte.',                              score_delta:  1, proxima_cena: 'cena_2A' },
      { id: 'B', texto: 'Um desconforto rápido, mas você deixa passar. Não vale a pena pensar nisso agora.',     score_delta: -1, proxima_cena: 'cena_2B' },
      { id: 'C', texto: 'Vergonha. Você se pergunta se estava sendo longa demais.',                              score_delta:  1, proxima_cena: 'cena_2C' },
      { id: 'D', texto: 'Algo que você não consegue nomear ainda — não foi grosseiro, mas não foi certo.',       score_delta: -1, proxima_cena: 'cena_2D' },
    ],
  },

  // ── CENA 2A ─────────────────────────────────────────────────────────────────
  cena_2A: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Quinta-feira. Reunião de alinhamento semanal.' },
      { tipo: 'narracao', texto: 'Rodrigo conduz. Clima leve, todo mundo participando.' },
      { tipo: 'narracao', texto: 'Você apresenta uma análise de risco que preparou — dados sólidos, bem estruturada. No meio da sua fala, Felipe interrompe com uma dúvida básica sobre metodologia.' },
      { tipo: 'narracao', texto: 'Rodrigo responde a dúvida do Felipe diretamente.' },
      { tipo: 'narracao', texto: 'Você para. Espera. Quando ele termina, você tenta retomar:' },
      { tipo: 'dialogo',  personagem: 'carolina', texto: 'Então, continuando—' },
      { tipo: 'narracao', texto: 'Rodrigo já está abrindo o próximo slide.' },
      { tipo: 'dialogo',  personagem: 'rodrigo',  texto: 'Beleza, Carol, obrigado. Felipe, você consegue consolidar isso até sexta?' },
      { tipo: 'narracao', texto: 'Felipe anota. A reunião segue.' },
      { tipo: 'narracao', texto: 'Você fecha o notebook devagar.' },
      { tipo: 'narracao', texto: 'Não terminou o que estava dizendo.' },
      { tipo: 'narracao', texto: 'Mas o clima continuou leve, ninguém pareceu notar.' },
      { tipo: 'narracao', texto: 'Talvez não tenha sido nada.' },
    ],
    opcoes: [
      { id: 'A', texto: 'Nada — reuniões têm esse ritmo mesmo. Você termina de passar as informações depois se precisar.', score_delta:  1, proxima_cena: 'int_A' },
      { id: 'B', texto: 'Uma leve frustração, mas você entende que ele estava gerenciando o tempo.',                      score_delta:  1, proxima_cena: 'int_A' },
      { id: 'C', texto: 'Vontade de mandar o restante da análise por e-mail pra garantir que foi registrado.',            score_delta:  0, proxima_cena: 'int_A' },
      { id: 'D', texto: 'A mesma sensação estranha da primeira reunião — desta vez um pouco mais forte.',                 score_delta: -1, proxima_cena: 'int_A' },
    ],
  },

  // ── CENA 2B ─────────────────────────────────────────────────────────────────
  cena_2B: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Sexta-feira. Um diretor de outra área passa pela sala para um alinhamento rápido.' },
      { tipo: 'narracao', texto: 'Rodrigo apresenta o time de pé, informal, um por um.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Felipe — análise quantitativa, o cara dos números.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Thiago — relacionamento com cliente, resolve tudo.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Carolina — ela é bem detalhista, gosta de aprofundar nos dados.' },
      { tipo: 'narracao', texto: 'O diretor acena pra cada um.' },
      { tipo: 'narracao', texto: 'Você sorri. Mas algo ficou estranho.' },
      { tipo: 'narracao', texto: 'Felipe e Thiago ganharam funções. Você ganhou um jeito de ser.' },
      { tipo: 'narracao', texto: 'Durante o alinhamento, você traz um ponto técnico relevante sobre exposição de risco. O diretor se interessa e pergunta mais.' },
      { tipo: 'narracao', texto: 'Antes que você responda, Rodrigo entra:' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Basicamente o que a Carol quer dizer é que precisamos revisar a camada de validação. É isso, Carol?' },
      { tipo: 'narracao', texto: 'Você confirma.' },
      { tipo: 'narracao', texto: 'O diretor anota e agradece a Rodrigo.' },
      { tipo: 'narracao', texto: 'Você disse uma palavra nessa troca.' },
      { tipo: 'narracao', texto: 'Sim.' },
    ],
    opcoes: [
      { id: 'A', texto: 'Gratidão — ele ajudou a deixar seu ponto mais claro pro diretor.',                               score_delta:  1, proxima_cena: 'int_B' },
      { id: 'B', texto: 'Um incômodo que você tenta justificar — talvez você não tenha sido clara o suficiente.',         score_delta:  1, proxima_cena: 'int_B' },
      { id: 'C', texto: 'Vontade de ter falado mais rápido antes que ele entrasse na sua resposta.',                      score_delta:  0, proxima_cena: 'int_B' },
      { id: 'D', texto: 'Certeza crescente de que existe um padrão — e que ele envolve você.',                           score_delta: -1, proxima_cena: 'int_B' },
    ],
  },

  // ── CENA 2C ─────────────────────────────────────────────────────────────────
  cena_2C: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Terça-feira. Rodrigo para na sua mesa entre uma reunião e outra.' },
      { tipo: 'narracao', texto: 'Tom casual, voz baixa. Quase confidencial.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Carol, queria dar um retorno rápido. Você tem um conhecimento técnico muito bom — isso é real. Mas às vezes você vai num nível de detalhe que o grupo não consegue acompanhar. Não é crítica, tá? É só um ajuste de comunicação.' },
      { tipo: 'narracao', texto: 'Ele sorri antes de ir embora.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Você tem tudo pra se destacar aqui.' },
      { tipo: 'narracao', texto: 'Você passa o resto da manhã relendo os e-mails que mandou na última semana.' },
      { tipo: 'narracao', texto: 'Tentando identificar onde foi longa demais.' },
      { tipo: 'narracao', texto: 'Tentando se ajustar.' },
      { tipo: 'narracao', texto: 'Na reunião da tarde, você fala menos.' },
      { tipo: 'narracao', texto: 'Rodrigo te olha uma vez e acena levemente com a cabeça.' },
      { tipo: 'narracao', texto: 'Aprovação.' },
      { tipo: 'narracao', texto: 'Você não sabe se deveria se sentir bem com isso.' },
      { tipo: 'narracao', texto: 'Mas se sentiu.' },
    ],
    opcoes: [
      { id: 'A', texto: 'Alívio — ele poderia ter ignorado, mas se preocupou em te dar um retorno. Isso é bom sinal.',   score_delta:  1, proxima_cena: 'int_C' },
      { id: 'B', texto: 'Confusão — ele elogiou e criticou ao mesmo tempo e você não sabe com qual parte ficar.',        score_delta:  0, proxima_cena: 'int_C' },
      { id: 'C', texto: 'Vontade de provar que consegue se ajustar — você não quer ser o problema do time.',             score_delta:  1, proxima_cena: 'int_C' },
      { id: 'D', texto: 'Algo errado que você não consegue nomear — você fez tudo certo e ainda assim saiu se sentindo menor.', score_delta: -1, proxima_cena: 'int_C' },
    ],
  },

  // ── CENA 2D ─────────────────────────────────────────────────────────────────
  cena_2D: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Quarta-feira. Apresentação de resultados.' },
      { tipo: 'narracao', texto: 'Você preparou os slides. Trabalhou nisso desde segunda.' },
      { tipo: 'narracao', texto: 'Rodrigo abre a apresentação e conduz do início ao fim.' },
      { tipo: 'narracao', texto: 'Com desenvoltura. Com segurança.' },
      { tipo: 'narracao', texto: 'Como se fosse dele.' },
      { tipo: 'narracao', texto: 'Seu nome não aparece em nenhum momento.' },
      { tipo: 'narracao', texto: 'No final, um diretor de outra área elogia a análise — direto pra Rodrigo:' },
      { tipo: 'dialogo',  personagem: 'diretor', texto: 'Muito bem estruturado, parabéns.' },
      { tipo: 'narracao', texto: 'Rodrigo agradece com naturalidade.' },
      { tipo: 'narracao', texto: 'Você está sentada a dois lugares dele.' },
      { tipo: 'narracao', texto: 'Presente. Visível. Invisível.' },
      { tipo: 'narracao', texto: 'Você não corrige. Não fala nada.' },
      { tipo: 'narracao', texto: 'Você não sabe o que te impede — medo, dúvida, ou o simples fato de que ninguém ao redor parece ter notado nada de errado.' },
      { tipo: 'narracao', texto: 'Depois da reunião você vai ao banheiro.' },
      { tipo: 'narracao', texto: 'Fica um minuto parada na frente do espelho.' },
      { tipo: 'narracao', texto: 'Você fez esse trabalho.' },
      { tipo: 'narracao', texto: 'Você sabe que fez.' },
    ],
    opcoes: [
      { id: 'A', texto: 'Raiva. Mas você engole — não é o momento, não é o lugar, você ainda é nova aqui.',              score_delta:  1, proxima_cena: 'int_D' },
      { id: 'B', texto: 'Dúvida — talvez ele fosse apresentar mesmo e você estava esperando um crédito que não era combinado.', score_delta: 1, proxima_cena: 'int_D' },
      { id: 'C', texto: 'Vontade de mandar uma mensagem pra ele perguntando sobre isso — mas você apaga antes de enviar.', score_delta: 0, proxima_cena: 'int_D' },
      { id: 'D', texto: 'Uma clareza fria e desconfortável: isso não foi acidente. E você não sabe o que fazer com essa certeza.', score_delta: -1, proxima_cena: 'int_D' },
    ],
  },

  // ── INT A ────────────────────────────────────────────────────────────────────
  int_A: {
    tipo: 'intermediaria',
    proxima_cena: 'cena_3_normalizacao',
    blocos: [
      { tipo: 'narracao', texto: 'Sábado de manhã.' },
      { tipo: 'narracao', texto: 'Você acorda sem alarme pela primeira vez na semana. Faz café, abre a janela, coloca uma playlist que não ouvia fazia tempo.' },
      { tipo: 'narracao', texto: 'O dia é bom. Você almoça com uma amiga, falam sobre tudo menos trabalho. Você ri bastante. Você está bem.' },
      { tipo: 'narracao', texto: 'Na volta pra casa, no ônibus, seu celular vibra.' },
      { tipo: 'narracao', texto: 'É uma notificação do LinkedIn.' },
      { tipo: 'narracao', texto: '"Rodrigo Mendes adicionou uma nova conquista profissional."' },
      { tipo: 'narracao', texto: 'Você nem sabe por que clica.' },
      { tipo: 'narracao', texto: 'A publicação é sobre o projeto novo. Ele fala sobre visão estratégica, sobre montar times de alta performance, sobre liderança. É bem escrito. Tem quarenta e dois comentários.' },
      { tipo: 'narracao', texto: 'Você fecha o aplicativo.' },
      { tipo: 'narracao', texto: 'Olha pela janela do ônibus.' },
      { tipo: 'narracao', texto: 'Você não sabe exatamente o que sentiu. Não foi raiva. Não foi tristeza.' },
      { tipo: 'narracao', texto: 'Foi algo menor que isso.' },
      { tipo: 'narracao', texto: 'E talvez por isso mais difícil de dispensar.' },
      { tipo: 'narracao', texto: 'Domingo você não pensa mais nisso.' },
      { tipo: 'narracao', texto: 'Ou quase não pensa.' },
    ],
  },

  // ── INT B ────────────────────────────────────────────────────────────────────
  int_B: {
    tipo: 'intermediaria',
    proxima_cena: 'cena_3_atencao',
    blocos: [
      { tipo: 'narracao', texto: 'Sábado à tarde.' },
      { tipo: 'narracao', texto: 'Você tentou dormir até tarde mas acordou cedo mesmo assim.' },
      { tipo: 'narracao', texto: 'A semana ficou no corpo.' },
      { tipo: 'narracao', texto: 'Você passa a manhã fazendo coisas pequenas — arruma a casa, responde mensagens atrasadas, assiste metade de um episódio de uma série e para no meio sem saber por quê.' },
      { tipo: 'narracao', texto: 'À tarde uma amiga manda mensagem perguntando se você quer sair.' },
      { tipo: 'narracao', texto: 'Você quase diz não.' },
      { tipo: 'narracao', texto: 'Mas vai.' },
      { tipo: 'narracao', texto: 'No jantar ela pergunta como está o emprego novo.' },
      { tipo: 'narracao', texto: 'Você responde que está bom. Que o time é legal. Que o líder é experiente.' },
      { tipo: 'narracao', texto: 'Tudo verdade.' },
      { tipo: 'narracao', texto: 'Mas enquanto fala você percebe que está escolhendo as palavras com cuidado. Deixando algumas coisas de fora. Não porque quer esconder — mas porque não sabe como explicar o que deixaria de fora.' },
      { tipo: 'narracao', texto: 'Como você explica uma sensação que não tem nome ainda?' },
      { tipo: 'narracao', texto: 'Sua amiga fala sobre a própria semana. Você ouve. Você ri nos momentos certos.' },
      { tipo: 'narracao', texto: 'Na volta pra casa você fica um tempo no celular sem abrir nada.' },
      { tipo: 'narracao', texto: 'Só segurando.' },
      { tipo: 'narracao', texto: 'Domingo passa rápido.' },
      { tipo: 'narracao', texto: 'Segunda chega antes do que você queria.' },
    ],
  },

  // ── INT C ────────────────────────────────────────────────────────────────────
  int_C: {
    tipo: 'intermediaria',
    proxima_cena: 'cena_3_normalizacao',
    blocos: [
      { tipo: 'narracao', texto: 'Sábado de manhã.' },
      { tipo: 'narracao', texto: 'Você abre o notebook antes do café.' },
      { tipo: 'narracao', texto: 'Não porque precisa. Porque na sexta saiu com a sensação de que poderia ter feito algo diferente — falado de forma mais direta, estruturado melhor uma resposta, sido mais objetiva naquele momento em que todo mundo esperava por você.' },
      { tipo: 'narracao', texto: 'Você passa uma hora relendo e-mails da semana.' },
      { tipo: 'narracao', texto: 'Identificando onde foi longa demais.' },
      { tipo: 'narracao', texto: 'Reescrevendo mentalmente frases que já foram enviadas.' },
      { tipo: 'narracao', texto: 'Você fecha o notebook e tenta descansar.' },
      { tipo: 'narracao', texto: 'À tarde você assiste um vídeo sobre comunicação executiva.' },
      { tipo: 'narracao', texto: 'Depois outro sobre como ser mais assertiva em reuniões.' },
      { tipo: 'narracao', texto: 'Depois um sobre liderança feminina no mercado financeiro.' },
      { tipo: 'narracao', texto: 'Você para no meio do terceiro.' },
      { tipo: 'narracao', texto: 'Fica olhando pra tela por um momento.' },
      { tipo: 'narracao', texto: 'Você veio de uma semana inteira de trabalho.' },
      { tipo: 'narracao', texto: 'E está passando o sábado tentando se consertar.' },
      { tipo: 'narracao', texto: 'Essa palavra — consertar — aparece na sua cabeça e some rápido.' },
      { tipo: 'narracao', texto: 'Você não fica com ela tempo suficiente pra entender o que ela significa ali.' },
      { tipo: 'narracao', texto: 'Domingo você se prepara para a segunda.' },
      { tipo: 'narracao', texto: 'Anota pontos que quer trazer na reunião.' },
      { tipo: 'narracao', texto: 'Pratica como vai falar.' },
      { tipo: 'narracao', texto: 'Cronometra.' },
    ],
  },

  // ── INT D ────────────────────────────────────────────────────────────────────
  int_D: {
    tipo: 'intermediaria',
    proxima_cena: 'cena_3_atencao',
    blocos: [
      { tipo: 'narracao',   texto: 'Sexta-feira à noite.' },
      { tipo: 'narracao',   texto: 'Você chega em casa e senta no chão encostada na cama.' },
      { tipo: 'narracao',   texto: 'Não no sofá. No chão.' },
      { tipo: 'narracao',   texto: 'Às vezes é assim.' },
      { tipo: 'narracao',   texto: 'Você fica ali por uns vinte minutos sem abrir o celular.' },
      { tipo: 'narracao',   texto: 'Só deixando a semana assentar.' },
      { tipo: 'narracao',   texto: 'Você fez um trabalho inteiro.' },
      { tipo: 'narracao',   texto: 'Ele foi apresentado por outra pessoa.' },
      { tipo: 'narracao',   texto: 'Ninguém disse nada.' },
      { tipo: 'narracao',   texto: 'Você também não disse nada.' },
      { tipo: 'narracao',   texto: 'Você não sabe qual das duas coisas te incomoda mais.' },
      { tipo: 'narracao',   texto: '---' },
      { tipo: 'narracao',   texto: 'Sábado você funciona no automático.' },
      { tipo: 'narracao',   texto: 'Mercado. Roupa lavada. Almoço.' },
      { tipo: 'narracao',   texto: 'À noite uma amiga manda áudio perguntando como você está.' },
      { tipo: 'narracao',   texto: 'Você ouve.' },
      { tipo: 'narracao',   texto: 'Fica com o dedo no botão de responder por um tempo.' },
      { tipo: 'pensamento', personagem: 'carolina', texto: 'O que você ia falar? Que seu chefe apresentou seu trabalho como se fosse dele? Que você ficou sentada vendo isso acontecer? Que você foi ao banheiro depois e ficou parada na frente do espelho?' },
      { tipo: 'narracao',   texto: 'Parece pequeno demais pra virar conversa.' },
      { tipo: 'narracao',   texto: 'Parece grande demais pra caber numa mensagem de voz.' },
      { tipo: 'narracao',   texto: 'Você manda um áudio de quarenta segundos dizendo que está bem, que a semana foi corrida, que vocês marcam algo em breve.' },
      { tipo: 'narracao',   texto: 'Sua amiga manda um coração.' },
      { tipo: 'narracao',   texto: '---' },
      { tipo: 'narracao',   texto: 'Domingo à noite você não consegue dormir direito.' },
      { tipo: 'narracao',   texto: 'Não é ansiedade — pelo menos não do jeito que você reconhece ansiedade.' },
      { tipo: 'narracao',   texto: 'É mais como uma pergunta que fica circulando sem pedir licença.' },
      { tipo: 'pensamento', personagem: 'carolina', texto: 'Será que fui eu?' },
      { tipo: 'narracao',   texto: 'Você não responde.' },
      { tipo: 'narracao',   texto: 'Apaga a luz.' },
      { tipo: 'narracao',   texto: 'Segunda de manhã o despertador toca às seis e meia.' },
      { tipo: 'narracao',   texto: 'Você levanta.' },
      { tipo: 'narracao',   texto: 'Vai trabalhar.' },
      { tipo: 'narracao',   texto: 'É isso que se faz.' },
    ],
  },

  // ── CENA 3 NORMALIZAÇÃO ──────────────────────────────────────────────────────
  cena_3_normalizacao: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Segunda-feira. Início da segunda semana.' },
      { tipo: 'narracao', texto: 'Rodrigo anuncia em reunião que o projeto novo começa essa semana.' },
      { tipo: 'narracao', texto: 'Ele nomeia o grupo na frente de todo mundo:' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Felipe, Thiago, Marcos...' },
      { tipo: 'narracao', texto: 'Ele te olha e acena com a cabeça.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: '...e a Carol vai dar suporte técnico quando precisarmos.' },
      { tipo: 'narracao', texto: 'Suporte. Não membro. Suporte.' },
      { tipo: 'narracao', texto: 'Você anota algo no caderno sem levantar a cabeça.' },
      { tipo: 'narracao', texto: 'Mais tarde Rodrigo manda a primeira mensagem no grupo do projeto. Você não está no grupo. Faz sentido — você é suporte, não membro. Você vai entrando quando chamarem.' },
      { tipo: 'narracao', texto: 'Na terça, Felipe te manda mensagem pedindo uma análise de risco pra quinta. Tom gentil, sem cerimônia. Você faz. É o seu trabalho.' },
      { tipo: 'narracao', texto: 'Na quinta, a análise aparece na reunião do projeto.' },
      { tipo: 'narracao', texto: 'Você não foi convidada pra reunião.' },
      { tipo: 'narracao', texto: 'Você vê o resultado no e-mail de alinhamento que Rodrigo manda pra todo mundo depois.' },
      { tipo: 'narracao', texto: 'Sua análise está lá. Sem seu nome.' },
      { tipo: 'narracao', texto: 'Só os dados. Que você passou três horas organizando.' },
      { tipo: 'narracao', texto: 'Você lê o e-mail duas vezes.' },
      { tipo: 'narracao', texto: 'Responde com um "ótimo alinhamento!" junto com todo mundo.' },
      { tipo: 'narracao', texto: 'E volta pro trabalho.' },
    ],
    opcoes: [
      { id: 'A', texto: 'Faz parte — você é nova, suporte é o começo. Todo mundo passa por isso.',                score_delta:  1, proxima_cena: 'cena_4' },
      { id: 'B', texto: 'Uma pontada de algo que você não quer chamar de injustiça. Ainda.',                      score_delta: -1, proxima_cena: 'cena_4' },
      { id: 'C', texto: 'Vontade de fazer um trabalho tão bom que da próxima vez seu nome vai estar lá.',         score_delta:  1, proxima_cena: 'cena_4' },
      { id: 'D', texto: 'A certeza de que existe um padrão — e que você acabou de participar dele sem querer.',   score_delta: -1, proxima_cena: 'cena_4' },
    ],
  },

  // ── CENA 3 ATENÇÃO ───────────────────────────────────────────────────────────
  cena_3_atencao: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Segunda-feira de manhã você chega mais cedo que o normal.' },
      { tipo: 'narracao', texto: 'Não planejou. Simplesmente acordou e foi.' },
      { tipo: 'narracao', texto: 'A sala está quase vazia. Só você e Letícia — analista sênior, está na empresa há três anos, você mal trocou palavras com ela até agora.' },
      { tipo: 'narracao', texto: 'Letícia está na mesa dela com dois monitores abertos e um café que parece estar lá desde antes de você chegar.' },
      { tipo: 'narracao', texto: 'Vocês ficam em silêncio por um tempo.' },
      { tipo: 'narracao', texto: 'Então ela fala sem tirar os olhos da tela:' },
      { tipo: 'dialogo',  personagem: 'leticia', texto: 'Você apresentou na quarta passada, né?' },
      { tipo: 'narracao', texto: 'Você confirma.' },
      { tipo: 'dialogo',  personagem: 'leticia', texto: 'Vi o material. Era bom.' },
      { tipo: 'narracao', texto: 'Pausa.' },
      { tipo: 'dialogo',  personagem: 'leticia', texto: 'Rodrigo apresenta bem.' },
      { tipo: 'narracao', texto: 'Ela diz isso com o tom de quem está comentando o tempo. Neutra. Sem drama. Como se fosse uma informação que você precisaria saber cedo ou tarde e ela estivesse apenas antecipando.' },
      { tipo: 'narracao', texto: 'Antes que você responda, outras pessoas começam a chegar.' },
      { tipo: 'narracao', texto: 'Letícia volta pra tela.' },
      { tipo: 'narracao', texto: 'O assunto fecha sozinho.' },
      { tipo: 'narracao', texto: 'Você passa o dia pensando no que ela quis dizer.' },
      { tipo: 'narracao', texto: 'E no que ela escolheu não dizer.' },
    ],
    opcoes: [
      { id: 'A', texto: 'Confusão — ela foi vaga demais pra você tirar qualquer conclusão.',                      score_delta:  1, proxima_cena: 'cena_4' },
      { id: 'B', texto: 'Alívio perturbador — alguém viu. Mas isso não muda nada.',                              score_delta: -1, proxima_cena: 'cena_4' },
      { id: 'C', texto: 'Vontade de chegar perto de Letícia e perguntar diretamente o que ela quis dizer.',      score_delta: -1, proxima_cena: 'cena_4' },
      { id: 'D', texto: 'O peso de entender que se Letícia sabe, outros provavelmente também sabem. E ninguém fez nada.', score_delta: -1, proxima_cena: 'cena_4' },
    ],
  },

  // ── CENA 4 ──────────────────────────────────────────────────────────────────
  cena_4: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Segunda-feira. Você chega e percebe pelo clima que algo aconteceu antes de você entrar.' },
      { tipo: 'narracao', texto: 'Grupinhos. Conversas que fecham quando você passa. Não de forma óbvia — só aquele imperceptível ajuste de tom que você aprende a notar quando está prestando atenção.' },
      { tipo: 'narracao', texto: 'Você pergunta pro Felipe de forma casual o que foi discutido.' },
      { tipo: 'narracao', texto: 'Ele resume em duas frases — decisões sobre metodologia de análise de risco. A sua área. O seu trabalho. Coisas que vão mudar o que você está fazendo essa semana.' },
      { tipo: 'dialogo',  personagem: 'felipe', texto: 'Foi rápido. Só um alinhamento.' },
      { tipo: 'narracao', texto: 'Você acena com a cabeça e volta pra mesa.' },
      { tipo: 'narracao', texto: 'Mais tarde você abre o calendário compartilhado sem um motivo específico. Talvez curiosidade. Talvez algo menor que isso — um instinto.' },
      { tipo: 'narracao', texto: 'A reunião estava agendada desde quinta-feira.' },
      { tipo: 'narracao', texto: 'Você estava no escritório na quinta.' },
      { tipo: 'narracao', texto: 'Seu nome não estava na lista de convidados.' },
      { tipo: 'narracao', texto: 'Você rola o calendário pra semana anterior sem saber bem por quê.' },
      { tipo: 'narracao', texto: 'Lá está.' },
      { tipo: 'narracao', texto: 'Uma reunião diferente, mesmo grupo, sem você.' },
      { tipo: 'narracao', texto: 'Você fica olhando pra tela por um momento.' },
      { tipo: 'narracao', texto: 'Pode ser coincidência.' },
      { tipo: 'narracao', texto: 'Pode ser critério de relevância — talvez só convidem quem precisa estar.' },
      { tipo: 'narracao', texto: 'Pode ser muita coisa.' },
      { tipo: 'narracao', texto: 'Você fecha o calendário.' },
      { tipo: 'narracao', texto: 'Abre o relatório que estava fazendo.' },
      { tipo: 'narracao', texto: 'Continua trabalhando.' },
      { tipo: 'narracao', texto: 'Mas a pergunta fica aberta em algum lugar que você não consegue fechar.' },
    ],
    // proxima_cena é determinada pelo score_check_5 — resolvido em confirmarEscolha
    opcoes: [
      { id: 'A', texto: 'Provavelmente foi um alinhamento técnico que não precisava da sua presença. Faz sentido.',       score_delta:  1, proxima_cena: 'score_check_5' },
      { id: 'B', texto: 'Um desconforto que você não sabe se tem direito de sentir — afinal, pode ser só critério de relevância.', score_delta: 0, proxima_cena: 'score_check_5' },
      { id: 'C', texto: 'Vontade de perguntar pro Rodrigo diretamente, mas o medo de parecer difícil te paralisa.',       score_delta: -1, proxima_cena: 'score_check_5' },
      { id: 'D', texto: 'A clareza de que isso não é coincidência — e a percepção de que você está sendo sistematicamente mantida fora.', score_delta: -1, proxima_cena: 'score_check_5' },
    ],
  },

  // ── CENA 5 NORMALIZAÇÃO ──────────────────────────────────────────────────────
  cena_5_normalizacao: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Quarta-feira. Final da manhã. Sala de Rodrigo.' },
      { tipo: 'narracao', texto: 'Ele fecha a porta sem cerimônia.' },
      { tipo: 'narracao', texto: 'Convida você a sentar com um gesto natural — o mesmo gesto de sempre, informal, sem peso aparente.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Carol, queria alinhar uma coisa sobre o projeto.' },
      { tipo: 'narracao', texto: 'Ele explica que depois de uma conversa com o cliente na semana passada percebeu que a apresentação da análise de risco precisa de uma abordagem diferente. Mais macro. Menos técnica. Algo que o cliente consiga acompanhar sem conhecimento específico da área.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'E o Felipe tem um jeito de comunicar que encaixa melhor nesse perfil.' },
      { tipo: 'narracao', texto: 'Você ouve.' },
      { tipo: 'narracao', texto: 'Felipe entrou na empresa no mesmo mês que você.' },
      { tipo: 'narracao', texto: 'Felipe não tem background em análise de risco.' },
      { tipo: 'narracao', texto: 'Você passou três anos se especializando nisso antes de chegar aqui.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Você continua sendo fundamental no processo — quero que você revise o trabalho dele antes de sair pro cliente. Ninguém conhece essa análise melhor que você.' },
      { tipo: 'narracao', texto: 'Ele diz isso como se fosse um elogio.' },
      { tipo: 'narracao', texto: 'E talvez pra ele seja.' },
      { tipo: 'narracao', texto: 'Você vai revisar o trabalho de alguém menos qualificado.' },
      { tipo: 'narracao', texto: 'Na sua área.' },
      { tipo: 'narracao', texto: 'Com o seu conhecimento.' },
      { tipo: 'narracao', texto: 'Sem o seu nome.' },
      { tipo: 'dialogo',  personagem: 'rodrigo', texto: 'Faz sentido pra você?' },
      { tipo: 'narracao', texto: 'Ele está esperando.' },
      { tipo: 'narracao', texto: 'A sala está quieta.' },
      { tipo: 'narracao', texto: 'Você sabe que não importa o que você responda.' },
      { tipo: 'narracao', texto: 'A decisão já foi tomada antes de você entrar.' },
    ],
    opcoes: [
      { id: 'A', texto: 'Talvez ele tenha razão — comunicação com cliente é diferente de análise técnica. Talvez não seja sobre você.', score_delta: 0, proxima_cena: 'cena_6_norm_A' },
      { id: 'B', texto: 'Humilhação que você não consegue mostrar porque não quer dar a ele a satisfação de ver.',                       score_delta: 0, proxima_cena: 'cena_6_norm_B' },
      { id: 'C', texto: 'Vontade de listar em voz alta cada qualificação sua comparada à do Felipe — mas você sabe como isso vai parecer.', score_delta: 0, proxima_cena: 'cena_6_norm_C' },
      { id: 'D', texto: 'Uma clareza fria: isso não foi uma decisão profissional. E você vai ter que engolir do mesmo jeito.',            score_delta: 0, proxima_cena: 'cena_6_norm_D' },
    ],
  },

  // ── CENA 5 ATENÇÃO ───────────────────────────────────────────────────────────
  cena_5_atencao: {
    tipo: 'choice',
    label_escolha: 'O que você sente?',
    blocos: [
      { tipo: 'narracao', texto: 'Sexta-feira. Hora do almoço.' },
      { tipo: 'narracao', texto: 'Todo mundo foi almoçar junto.' },
      { tipo: 'narracao', texto: 'Você ficou na mesa com a desculpa de um relatório pra terminar.' },
      { tipo: 'narracao', texto: 'Letícia também ficou.' },
      { tipo: 'narracao', texto: 'Por um tempo vocês ficam em silêncio — o tipo de silêncio que não precisa ser preenchido. Você já aprendeu que ela é assim.' },
      { tipo: 'narracao', texto: 'Então ela fala sem preâmbulo:' },
      { tipo: 'dialogo',  personagem: 'leticia', texto: 'Você viu o calendário essa semana?' },
      { tipo: 'narracao', texto: 'Você confirma com a cabeça.' },
      { tipo: 'narracao', texto: 'Ela não pergunta o que você viu. Ela já sabe.' },
      { tipo: 'dialogo',  personagem: 'leticia', texto: 'Comigo foi diferente. Primeiro eles paravam de me copiar nos e-mails. Pequena coisa. Depois as reuniões. Depois os projetos.' },
      { tipo: 'narracao', texto: 'Ela fala com a mesma neutralidade de sempre. Sem drama. Como quem está descrevendo um processo técnico que já estudou bastante.' },
      { tipo: 'dialogo',  personagem: 'leticia', texto: 'Eu fiquei dois meses achando que era eu.' },
      { tipo: 'narracao', texto: 'Pausa.' },
      { tipo: 'dialogo',  personagem: 'leticia', texto: 'Não era.' },
      { tipo: 'narracao', texto: 'Você não sabe o que dizer. Ela não parece esperar que você diga nada.' },
      { tipo: 'dialogo',  personagem: 'leticia', texto: 'Não estou te dizendo o que fazer. Só estou dizendo o que eu vi.' },
      { tipo: 'narracao', texto: 'O elevador abre no corredor.' },
      { tipo: 'narracao', texto: 'O time está voltando do almoço.' },
      { tipo: 'narracao', texto: 'Letícia abre um documento na tela e volta a trabalhar.' },
      { tipo: 'narracao', texto: 'A conversa fecha sozinha.' },
      { tipo: 'narracao', texto: 'Você fica com tudo aquilo na cabeça.' },
      { tipo: 'narracao', texto: 'Ela ficou dois meses.' },
      { tipo: 'narracao', texto: 'Você está na terceira semana.' },
    ],
    opcoes: [
      { id: 'A', texto: 'Agradecer internamente mas decidir que cada caso é um caso — o dela não precisa ser o seu.',       score_delta: 0, proxima_cena: 'cena_6_aten_A' },
      { id: 'B', texto: 'Sentir o peso do que ela disse mas não saber ainda o que fazer com isso.',                        score_delta: 0, proxima_cena: 'cena_6_aten_B' },
      { id: 'C', texto: 'Querer conversar mais com ela — entender o que ela fez, o que funcionou, o que não funcionou.',  score_delta: 0, proxima_cena: 'cena_6_aten_C' },
      { id: 'D', texto: 'Sentir que alguma coisa mudou agora que você sabe que não está sozinha — e que isso exige uma decisão sua.', score_delta: 0, proxima_cena: 'cena_6_aten_D' },
    ],
  },

  // ── CENAS FINAIS 6 NORM ───────────────────────────────────────────────────────
  cena_6_norm_A: {
    tipo: 'intermediaria',
    proxima_cena: 'relatorio_final',
    blocos: [
      { tipo: 'narracao', texto: 'Sexta-feira. Final do expediente.' },
      { tipo: 'narracao', texto: 'Você arruma a mesa devagar — caneta no lugar, notebook fechado, copo lavado.' },
      { tipo: 'narracao', texto: 'Você tem um ritual nisso. Sempre teve.' },
      { tipo: 'narracao', texto: 'O escritório vai esvaziando.' },
      { tipo: 'narracao', texto: 'Felipe passa e dá um tchau animado — ele está claramente bem.' },
      { tipo: 'narracao', texto: 'Thiago já foi.' },
      { tipo: 'narracao', texto: 'Rodrigo sai sem olhar pra ninguém em específico.' },
      { tipo: 'narracao', texto: 'Você pega a bolsa e vai embora.' },
      { tipo: 'narracao', texto: 'No elevador você verifica o celular.' },
      { tipo: 'narracao', texto: 'Nada importante.' },
      { tipo: 'narracao', texto: 'Na rua o ar está diferente do ar-condicionado do escritório.' },
      { tipo: 'narracao', texto: 'Você respira fundo.' },
      { tipo: 'narracao', texto: 'Você pensa na conversa com Rodrigo.' },
      { tipo: 'narracao', texto: 'Na lógica que ele apresentou.' },
      { tipo: 'narracao', texto: 'No Felipe que vai apresentar a análise.' },
      { tipo: 'narracao', texto: 'Faz sentido.' },
      { tipo: 'narracao', texto: 'Comunicação com cliente é diferente de análise técnica.' },
      { tipo: 'narracao', texto: 'Você vai continuar sendo fundamental.' },
      { tipo: 'narracao', texto: 'Ele disse isso.' },
      { tipo: 'narracao', texto: 'Você repete isso mentalmente enquanto caminha.' },
      { tipo: 'narracao', texto: 'Uma vez.' },
      { tipo: 'narracao', texto: 'Duas vezes.' },
      { tipo: 'narracao', texto: 'Uma terceira.' },
      { tipo: 'narracao', texto: 'Você não sabe por que precisa repetir uma coisa que faz sentido.' },
      { tipo: 'narracao', texto: 'Coisas que fazem sentido não precisam ser repetidas pra fazer sentido.' },
      { tipo: 'narracao', texto: 'Você para num semáforo.' },
      { tipo: 'narracao', texto: 'Verde.' },
      { tipo: 'narracao', texto: 'Você atravessa.' },
      { tipo: 'narracao', texto: 'Segunda-feira você volta.' },
    ],
  },

  cena_6_norm_B: {
    tipo: 'intermediaria',
    proxima_cena: 'relatorio_final',
    blocos: [
      { tipo: 'narracao', texto: 'Sexta-feira. Final do expediente.' },
      { tipo: 'narracao', texto: 'Você sai antes da maioria.' },
      { tipo: 'narracao', texto: 'Não planejou — o corpo simplesmente foi.' },
      { tipo: 'narracao', texto: 'No caminho pro elevador você passa pela sala de reunião onde Rodrigo está fechando o dia com Felipe e Thiago.' },
      { tipo: 'narracao', texto: 'A porta está entreaberta.' },
      { tipo: 'narracao', texto: 'Você não para. Não olha.' },
      { tipo: 'narracao', texto: 'Mas ouve a risada dos três antes de o elevador fechar.' },
      { tipo: 'narracao', texto: 'Na rua você anda mais rápido que o normal.' },
      { tipo: 'narracao', texto: 'Você não está com raiva.' },
      { tipo: 'narracao', texto: 'Ou está — mas de um jeito que não tem forma ainda.' },
      { tipo: 'narracao', texto: 'É mais como pressão. Aquela coisa que fica no peito quando você engoliu algo que não devia ter engolido.' },
      { tipo: 'narracao', texto: 'Você passa por uma vitrine e vê seu reflexo por meio segundo.' },
      { tipo: 'narracao', texto: 'Expressão neutra.' },
      { tipo: 'narracao', texto: 'Postura reta.' },
      { tipo: 'narracao', texto: 'Por fora está tudo bem.' },
      { tipo: 'narracao', texto: 'Você pensa na reunião de quarta.' },
      { tipo: 'narracao', texto: 'Na forma como ele disse "você continua sendo fundamental" com o mesmo tom que se usa pra agradecer um favor pequeno.' },
      { tipo: 'narracao', texto: 'Na forma como você acenou com a cabeça.' },
      { tipo: 'narracao', texto: 'Na forma como você disse "faz sentido".' },
      { tipo: 'narracao', texto: 'Você não disse "faz sentido" porque fazia sentido.' },
      { tipo: 'narracao', texto: 'Você disse porque era o que cabia naquele momento.' },
      { tipo: 'narracao', texto: 'Numa sala fechada.' },
      { tipo: 'narracao', texto: 'Com ele do outro lado da mesa.' },
      { tipo: 'narracao', texto: 'Com a decisão já tomada.' },
      { tipo: 'narracao', texto: 'O semáforo fecha.' },
      { tipo: 'narracao', texto: 'Você para.' },
      { tipo: 'narracao', texto: 'Ao redor todo mundo tem um lugar pra ir.' },
      { tipo: 'narracao', texto: 'Você também tem.' },
      { tipo: 'narracao', texto: 'Mas pela primeira vez desde que entrou na Meridian você não tem certeza se quer ir pra lá segunda-feira.' },
    ],
  },

  cena_6_norm_C: {
    tipo: 'intermediaria',
    proxima_cena: 'relatorio_final',
    blocos: [
      { tipo: 'narracao', texto: 'Sexta-feira. Final do expediente.' },
      { tipo: 'narracao', texto: 'Você fica na mesa até todo mundo ir embora.' },
      { tipo: 'narracao', texto: 'Não porque tem trabalho.' },
      { tipo: 'narracao', texto: 'Porque precisa de um momento sem ninguém ao redor.' },
      { tipo: 'narracao', texto: 'O escritório vazio tem um som diferente.' },
      { tipo: 'narracao', texto: 'Ar-condicionado. Computador. Você.' },
      { tipo: 'narracao', texto: 'Você abre o documento da análise de risco.' },
      { tipo: 'narracao', texto: 'A sua análise.' },
      { tipo: 'narracao', texto: 'Que agora vai ser revisada por você depois que o Felipe terminar a dele.' },
      { tipo: 'narracao', texto: 'Você lê o primeiro parágrafo.' },
      { tipo: 'narracao', texto: 'É bom.' },
      { tipo: 'narracao', texto: 'Você sabe que é bom.' },
      { tipo: 'narracao', texto: 'Você fecha o documento.' },
      { tipo: 'narracao', texto: 'Na reunião com Rodrigo você teve pelo menos três momentos onde poderia ter falado.' },
      { tipo: 'narracao', texto: 'Poderia ter dito que passou três anos se especializando nisso.' },
      { tipo: 'narracao', texto: 'Poderia ter pedido uma explicação mais concreta sobre o que exatamente o Felipe faz melhor.' },
      { tipo: 'narracao', texto: 'Poderia ter perguntado por que a decisão já estava tomada antes de você entrar na sala.' },
      { tipo: 'narracao', texto: 'Você não disse nada disso.' },
      { tipo: 'narracao', texto: 'Disse "faz sentido" e saiu.' },
      { tipo: 'narracao', texto: 'Você desliga o monitor.' },
      { tipo: 'narracao', texto: 'Pega a bolsa.' },
      { tipo: 'narracao', texto: 'Apaga a luz da sua mesa.' },
      { tipo: 'narracao', texto: 'No elevador você olha pro teto.' },
      { tipo: 'narracao', texto: 'A raiva não é de Rodrigo.' },
      { tipo: 'narracao', texto: 'A raiva é de você.' },
      { tipo: 'narracao', texto: 'E você sabe que essa é exatamente a armadilha — transformar o que fizeram com você em algo que você fez com você mesma.' },
      { tipo: 'narracao', texto: 'Mas saber disso não dissolve a raiva.' },
      { tipo: 'narracao', texto: 'Só muda o endereço dela.' },
    ],
  },

  cena_6_norm_D: {
    tipo: 'intermediaria',
    proxima_cena: 'relatorio_final',
    blocos: [
      { tipo: 'narracao',   texto: 'Sexta-feira. Final do expediente.' },
      { tipo: 'narracao',   texto: 'Você sai no horário exato.' },
      { tipo: 'narracao',   texto: 'Nem um minuto antes. Nem um minuto depois.' },
      { tipo: 'narracao',   texto: 'Você não sabe por que isso importa hoje.' },
      { tipo: 'narracao',   texto: 'Mas importa.' },
      { tipo: 'narracao',   texto: 'Na rua você não pega o caminho normal pra casa.' },
      { tipo: 'narracao',   texto: 'Vai andando sem destino específico.' },
      { tipo: 'narracao',   texto: 'Só andando.' },
      { tipo: 'narracao',   texto: 'Você vai catalogando mentalmente.' },
      { tipo: 'narracao',   texto: 'Não é da primeira vez que faz isso — mas hoje está mais organizado. Mais frio.' },
      { tipo: 'pensamento', personagem: 'carolina', texto: 'Primeira semana: a reunião. A legenda. O sorriso que eu dei. Segunda semana: o diretor. Minha ideia na boca dele. O crédito que foi embora. Terceira semana: o calendário. As reuniões que aconteceram sem mim. Duas vezes. Essa semana: a sala fechada. Felipe. "Você continua sendo fundamental."' },
      { tipo: 'narracao',   texto: 'Você para na frente de uma padaria.' },
      { tipo: 'narracao',   texto: 'Entra.' },
      { tipo: 'narracao',   texto: 'Pede um café que você não queria.' },
      { tipo: 'narracao',   texto: 'Senta numa mesa do fundo.' },
      { tipo: 'pensamento', personagem: 'carolina', texto: 'O que faria uma pessoa que não tivesse medo? Que não precisasse desse emprego? Que não fosse nova demais pra criar problema? Essa pessoa falaria. Documentaria. Iria ao RH. Contaria pra alguém.' },
      { tipo: 'narracao',   texto: 'Você não é essa pessoa ainda.' },
      { tipo: 'narracao',   texto: 'Talvez seja um dia.' },
      { tipo: 'narracao',   texto: 'Talvez não seja.' },
      { tipo: 'narracao',   texto: 'Você termina o café.' },
      { tipo: 'narracao',   texto: 'Paga.' },
      { tipo: 'narracao',   texto: 'Vai pra casa.' },
      { tipo: 'narracao',   texto: 'Mas você guardou tudo.' },
      { tipo: 'narracao',   texto: 'Cada detalhe.' },
      { tipo: 'narracao',   texto: 'Com data.' },
      { tipo: 'narracao',   texto: 'Com hora.' },
      { tipo: 'narracao',   texto: 'Com as palavras exatas que ele usou.' },
      { tipo: 'narracao',   texto: 'Você não sabe ainda pra que vai servir isso.' },
      { tipo: 'narracao',   texto: 'Mas alguma coisa em você decidiu não deixar passar.' },
    ],
  },

  // ── CENAS FINAIS 6 ATEN ───────────────────────────────────────────────────────
  cena_6_aten_A: {
    tipo: 'intermediaria',
    proxima_cena: 'relatorio_final',
    blocos: [
      { tipo: 'narracao',   texto: 'Sexta-feira. Final do expediente.' },
      { tipo: 'narracao',   texto: 'Você sai junto com o grupo.' },
      { tipo: 'narracao',   texto: 'Tem uma energia boa no final do dia — alguém faz uma piada no elevador, todo mundo ri, planos vagos de happy hour que provavelmente não vão acontecer.' },
      { tipo: 'narracao',   texto: 'Você participa do clima.' },
      { tipo: 'narracao',   texto: 'Está bem.' },
      { tipo: 'narracao',   texto: 'Na rua você se separa do grupo e vai pro seu caminho.' },
      { tipo: 'narracao',   texto: 'Você pensa no que Letícia disse.' },
      { tipo: 'dialogo',    personagem: 'leticia', texto: 'Eu fiquei dois meses achando que era eu.' },
      { tipo: 'narracao',   texto: 'Você entende o que ela quis dizer.' },
      { tipo: 'narracao',   texto: 'Mas o caso dela é diferente.' },
      { tipo: 'narracao',   texto: 'Você não sabe exatamente como — mas é.' },
      { tipo: 'pensamento', personagem: 'carolina', texto: 'Letícia tem um jeito mais fechado. Menos adaptável. Você é diferente. Você está se saindo bem. As pessoas gostam de você. Rodrigo confia em você.' },
      { tipo: 'narracao',   texto: 'Você repete isso enquanto caminha.' },
      { tipo: 'narracao',   texto: 'Letícia ficou dois meses.' },
      { tipo: 'narracao',   texto: 'Você está na terceira semana.' },
      { tipo: 'narracao',   texto: 'São situações diferentes.' },
      { tipo: 'narracao',   texto: 'Você coloca o fone.' },
      { tipo: 'narracao',   texto: 'Escolhe uma playlist.' },
      { tipo: 'narracao',   texto: 'O volume sobe.' },
      { tipo: 'narracao',   texto: 'Em algum lugar abaixo do volume e da playlist e dos passos na calçada tem uma voz pequena que não concorda com nada do que você acabou de pensar.' },
      { tipo: 'narracao',   texto: 'Você aumenta o volume.' },
    ],
  },

  cena_6_aten_B: {
    tipo: 'intermediaria',
    proxima_cena: 'relatorio_final',
    blocos: [
      { tipo: 'narracao',   texto: 'Sexta-feira. Final do expediente.' },
      { tipo: 'narracao',   texto: 'Você fica na mesa até o escritório esvaziar quase completamente.' },
      { tipo: 'narracao',   texto: 'Letícia passa pela sua mesa antes de ir embora.' },
      { tipo: 'narracao',   texto: 'Não fala nada.' },
      { tipo: 'narracao',   texto: 'Só coloca a mão brevemente no encosto da sua cadeira enquanto passa.' },
      { tipo: 'narracao',   texto: 'Um segundo. Menos que isso.' },
      { tipo: 'narracao',   texto: 'Você olha pra tela até ouvir o elevador fechar.' },
      { tipo: 'narracao',   texto: 'Então você abre um documento em branco.' },
      { tipo: 'narracao',   texto: 'Você não sabe o que vai escrever.' },
      { tipo: 'narracao',   texto: 'Só sabe que precisa colocar alguma coisa pra fora antes de ir embora.' },
      { tipo: 'narracao',   texto: 'Você fica olhando pro cursor piscando por um tempo.' },
      { tipo: 'narracao',   texto: 'Você digita:' },
      { tipo: 'pensamento', personagem: 'carolina', texto: 'Eu sei o que está acontecendo.' },
      { tipo: 'narracao',   texto: 'Para.' },
      { tipo: 'narracao',   texto: 'Apaga.' },
      { tipo: 'narracao',   texto: 'Digita de novo:' },
      { tipo: 'pensamento', personagem: 'carolina', texto: 'Eu acho que sei o que está acontecendo.' },
      { tipo: 'narracao',   texto: 'Para de novo.' },
      { tipo: 'narracao',   texto: 'Apaga tudo.' },
      { tipo: 'narracao',   texto: 'Fecha o documento sem salvar.' },
      { tipo: 'narracao',   texto: 'Você pega a bolsa e vai embora.' },
      { tipo: 'narracao',   texto: 'No caminho você pensa em todas as pessoas que poderiam ouvir o que você tem pra dizer.' },
      { tipo: 'pensamento', personagem: 'carolina', texto: '"Você tem certeza?" "Já tentou conversar com ele?" "Talvez seja só o jeito dele."' },
      { tipo: 'narracao',   texto: 'Você não tem certeza.' },
      { tipo: 'narracao',   texto: 'Você não conversou com ele.' },
      { tipo: 'narracao',   texto: 'Talvez seja só o jeito dele.' },
      { tipo: 'narracao',   texto: 'Ou não.' },
      { tipo: 'narracao',   texto: 'Você chega em casa.' },
      { tipo: 'narracao',   texto: 'Coloca a chave na fechadura.' },
      { tipo: 'narracao',   texto: 'Você ainda não sabe o que fazer.' },
      { tipo: 'narracao',   texto: 'Mas pela primeira vez desde que entrou na Meridian você admite isso pra si mesma.' },
      { tipo: 'narracao',   texto: 'Não saber também é uma resposta.' },
    ],
  },

  cena_6_aten_C: {
    tipo: 'intermediaria',
    proxima_cena: 'relatorio_final',
    blocos: [
      { tipo: 'narracao', texto: 'Sexta-feira. Final do expediente.' },
      { tipo: 'narracao', texto: 'Você espera Letícia guardar as coisas.' },
      { tipo: 'narracao', texto: 'Faz isso sem parecer que está esperando.' },
      { tipo: 'narracao', texto: 'Organiza a mesa. Responde um e-mail que podia esperar. Bebe o resto de um café frio.' },
      { tipo: 'narracao', texto: 'Quando ela passa pela sua mesa você fala natural:' },
      { tipo: 'dialogo',  personagem: 'carolina', texto: 'Vai saindo? Posso te acompanhar até o metrô.' },
      { tipo: 'narracao', texto: 'Ela olha pra você um segundo.' },
      { tipo: 'narracao', texto: 'Concorda com a cabeça.' },
      { tipo: 'narracao', texto: 'No elevador vocês não falam.' },
      { tipo: 'narracao', texto: 'Na rua o movimento absorve o silêncio.' },
      { tipo: 'narracao', texto: 'Você começa:' },
      { tipo: 'dialogo',  personagem: 'carolina', texto: 'O que você disse outro dia... sobre ficar dois meses achando que era você.' },
      { tipo: 'narracao', texto: 'Letícia anda mais dois passos antes de responder.' },
      { tipo: 'dialogo',  personagem: 'leticia',  texto: 'O que você quer saber?' },
      { tipo: 'dialogo',  personagem: 'carolina', texto: 'O que mudou. Como você parou de achar que era você.' },
      { tipo: 'narracao', texto: 'Ela fica em silêncio por um momento.' },
      { tipo: 'dialogo',  personagem: 'leticia',  texto: 'Não parei completamente. Ainda tem dias.' },
      { tipo: 'narracao', texto: 'Pausa.' },
      { tipo: 'dialogo',  personagem: 'leticia',  texto: 'Mas em algum momento eu comecei a anotar as coisas. Datas. O que aconteceu. O que foi dito. Exatamente como foi dito.' },
      { tipo: 'dialogo',  personagem: 'carolina', texto: 'E aí?' },
      { tipo: 'dialogo',  personagem: 'leticia',  texto: 'Aí ficou mais difícil me convencer de que era impressão minha.' },
      { tipo: 'narracao', texto: 'Vocês chegam no metrô.' },
      { tipo: 'narracao', texto: 'Letícia para na entrada.' },
      { tipo: 'dialogo',  personagem: 'leticia',  texto: 'Não estou te dizendo pra fazer o mesmo. Estou dizendo o que funcionou pra mim.' },
      { tipo: 'narracao', texto: 'Ela passa a catraca.' },
      { tipo: 'narracao', texto: 'Você fica do lado de fora.' },
      { tipo: 'narracao', texto: 'Seus caminhos são diferentes.' },
      { tipo: 'narracao', texto: 'Você anda pra casa com uma coisa concreta pela primeira vez.' },
      { tipo: 'narracao', texto: 'Não uma resposta.' },
      { tipo: 'narracao', texto: 'Mas uma direção.' },
    ],
  },

  cena_6_aten_D: {
    tipo: 'intermediaria',
    proxima_cena: 'relatorio_final',
    blocos: [
      { tipo: 'narracao',   texto: 'Sexta-feira. Final do expediente.' },
      { tipo: 'narracao',   texto: 'Você não espera o escritório esvaziar.' },
      { tipo: 'narracao',   texto: 'Pega a bolsa no horário e vai.' },
      { tipo: 'narracao',   texto: 'No elevador você está sozinha.' },
      { tipo: 'narracao',   texto: 'Você olha pro seu reflexo na porta metálica.' },
      { tipo: 'narracao',   texto: 'Distorcido. Irreconhecível nos detalhes.' },
      { tipo: 'narracao',   texto: 'Mas é você.' },
      { tipo: 'narracao',   texto: 'Na rua você anda sem pressa.' },
      { tipo: 'narracao',   texto: 'Você pensa no que Letícia disse.' },
      { tipo: 'dialogo',    personagem: 'leticia', texto: 'Eu fiquei dois meses achando que era eu.' },
      { tipo: 'dialogo',    personagem: 'leticia', texto: 'Não era.' },
      { tipo: 'narracao',   texto: 'Duas frases.' },
      { tipo: 'narracao',   texto: 'Ela usou duas frases pra dizer o que você não conseguiu nomear em três semanas.' },
      { tipo: 'narracao',   texto: 'Você pensa nas reuniões que aconteceram sem você.' },
      { tipo: 'narracao',   texto: 'No trabalho que foi apresentado sem seu nome.' },
      { tipo: 'narracao',   texto: 'Na sala fechada com Rodrigo.' },
      { tipo: 'narracao',   texto: 'Na análise que era sua e agora vai ser revisada por você.' },
      { tipo: 'narracao',   texto: 'Você passa por uma papelaria.' },
      { tipo: 'narracao',   texto: 'Para.' },
      { tipo: 'narracao',   texto: 'Volta dois passos.' },
      { tipo: 'narracao',   texto: 'Entra.' },
      { tipo: 'narracao',   texto: 'Você compra um caderno pequeno.' },
      { tipo: 'narracao',   texto: 'Preto. Sem pauta.' },
      { tipo: 'narracao',   texto: 'O tipo que cabe na bolsa.' },
      { tipo: 'narracao',   texto: 'Na fila do caixa você já sabe o que vai escrever primeiro.' },
      { tipo: 'pensamento', personagem: 'carolina', texto: 'Data. O que aconteceu. O que foi dito. Exatamente como foi dito.' },
      { tipo: 'narracao',   texto: 'Você não sabe ainda o que vai fazer com isso.' },
      { tipo: 'narracao',   texto: 'Não sabe se vai mostrar pra alguém.' },
      { tipo: 'narracao',   texto: 'Não sabe se vai mudar alguma coisa.' },
      { tipo: 'narracao',   texto: 'Mas você decidiu que o que está acontecendo com você vai ter testemunha.' },
      { tipo: 'narracao',   texto: 'Mesmo que essa testemunha seja só você.' },
    ],
  },

  // ── RELATÓRIO FINAL (aciona nav('t7')) ───────────────────────────────────────
  relatorio_final: {
    tipo: 'intermediaria',
    proxima_cena: '__fim__',
    blocos: [
      { tipo: 'narracao', texto: 'Fim da história.' },
    ],
  },
}

// ══════════════════════════════════════════════════════════════════════════════
// FUNÇÃO DE SIMULAÇÃO LOCAL — resolve toda a lógica de routing
// ══════════════════════════════════════════════════════════════════════════════

function resolverProximaCena(idCenaAtual, escolhaId, scoreDelta, scoreAcumuladoAposEscolha) {
  const cena = CENAS[idCenaAtual]
  if (!cena) return null

  if (cena.tipo === 'intermediaria') {
    // Cena intermediária: "continuar" vai pra proxima_cena definida
    return cena.proxima_cena || null
  }

  if (cena.tipo === 'choice') {
    const opcao = cena.opcoes?.find(o => o.id === escolhaId)
    if (!opcao) return null

    const destino = opcao.proxima_cena

    // Lógica especial: score_check_5 (branching após cena_4)
    if (destino === 'score_check_5') {
      // Score acumulado positivo → normalizacao; zero ou negativo → atencao
      if (scoreAcumuladoAposEscolha > 0) {
        return 'cena_5_normalizacao'
      } else {
        return 'cena_5_atencao'
      }
    }

    return destino
  }

  return null
}

function montarDadosCena(idCena, scoreAtual) {
  const cena = CENAS[idCena]
  if (!cena) return null

  return {
    cena_atual:    idCena,
    tipo:          cena.tipo,
    label_escolha: cena.label_escolha || null,
    score_atual:   scoreAtual,
    progresso:     PROGRESSO_MAP[idCena] ?? 0,
    finalizar:     idCena === 'relatorio_final' || cena.proxima_cena === '__fim__',
    personagens:   PERSONAGENS_PADRAO,
    blocos:        cena.blocos,
    opcoes:        cena.opcoes || [],
  }
}

// ─── CHAMADA UNIFICADA (igual ao original, mas resolve localmente no modo sim) ──
async function chamarSetHistory(params, scoreAcumulado) {
  if (MODO_SIMULACAO) {
    await new Promise(r => setTimeout(r, 400))

    // Chamada inicial — sem cena_atual
    if (!params.cena_atual) {
      return montarDadosCena('cena_1', 0)
    }

    // Continuar (intermediária)
    if (params.acao === 'continuar') {
      const proxima = resolverProximaCena(params.cena_atual, null, 0, scoreAcumulado)
      if (!proxima || proxima === '__fim__') return { finalizar: true }
      return montarDadosCena(proxima, scoreAcumulado)
    }

    // Escolha (choice)
    if (params.escolha) {
      const cenaAtual = CENAS[params.cena_atual]
      const opcao = cenaAtual?.opcoes?.find(o => o.id === params.escolha)
      const novoScore = scoreAcumulado // já foi calculado antes de chamar
      const proxima = resolverProximaCena(params.cena_atual, params.escolha, opcao?.score_delta || 0, novoScore)
      if (!proxima || proxima === '__fim__') return { finalizar: true }
      return montarDadosCena(proxima, novoScore)
    }

    return null
  }

  // Modo real (n8n)
  const url = new URL(WEBHOOK_URL)
  url.searchParams.set('user_id',     USER_ID)
  url.searchParams.set('historia_id', HISTORIA_ID)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  })
  const res = await fetch(url.toString(), { method: 'GET' })
  if (!res.ok) throw new Error(`Webhook retornou HTTP ${res.status}`)
  return res.json()
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTES DE RENDERIZAÇÃO (inalterados)
// ══════════════════════════════════════════════════════════════════════════════

function TextoAnimado({ texto, animar, onComplete, estilo }) {
  const [exibido, setExibido] = useState(animar ? '' : texto)
  const timer = useRef(null)
  const idx   = useRef(0)

  useEffect(() => {
    if (!animar) { setExibido(texto); return }
    setExibido('')
    idx.current = 0
    timer.current = setInterval(() => {
      idx.current += 1
      setExibido(texto.slice(0, idx.current))
      if (idx.current >= texto.length) {
        clearInterval(timer.current)
        onComplete?.()
      }
    }, 18)
    return () => clearInterval(timer.current)
  }, [texto, animar])

  return <p style={estilo}>{exibido || '\u00A0'}</p>
}

function Bloco({ bloco, personagens, animar, onComplete }) {
  const info = bloco.personagem ? (personagens[bloco.personagem] || {}) : {}
  const cor  = info.cor  || '#9A9AB0'
  const nome = info.nome || (bloco.personagem || '')

  if (bloco.tipo === 'narracao') {
    return (
      <TextoAnimado
        texto={bloco.texto}
        animar={animar}
        onComplete={onComplete}
        estilo={s.txtNarracao}
      />
    )
  }

  if (bloco.tipo === 'dialogo') {
    return (
      <div style={s.wrapDialogo}>
        <span style={{ ...s.labelPersonagem, color: cor }}>{nome}</span>
        <TextoAnimado
          texto={`"${bloco.texto}"`}
          animar={animar}
          onComplete={onComplete}
          estilo={{ ...s.txtDialogo, borderLeftColor: cor }}
        />
      </div>
    )
  }

  if (bloco.tipo === 'pensamento') {
    return (
      <div style={s.wrapPensamento}>
        <span style={{ ...s.labelPersonagem, color: cor, fontStyle: 'italic' }}>
          ✦ {nome}
        </span>
        <TextoAnimado
          texto={bloco.texto}
          animar={animar}
          onComplete={onComplete}
          estilo={s.txtPensamento}
        />
      </div>
    )
  }

  return null
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════

export default function T6({ nav }) {
  const [cena,           setCena]          = useState(null)
  const [personagens,    setPersonagens]   = useState(PERSONAGENS_PADRAO)
  const [scoreAcum,      setScoreAcum]     = useState(0)
  const [progresso,      setProgresso]     = useState(0)

  // ── Rastreamento para o relatório T7 ─────────────────────────────────────
  const [cenasVisitadas, setCenasVisitadas] = useState([])
  const [cenaFinalRef,   setCenaFinalRef]   = useState(null)
  const [escolhas,       setEscolhas]       = useState({})

  const [blocoIdx,    setBlocoIdx]    = useState(0)
  const [leituraDone, setLeituraDone] = useState(false)

  const [selecionada, setSelecionada] = useState(null)
  const [confirmarOn, setConfirmarOn] = useState(false)

  const [carregando,  setCarregando]  = useState(false)
  const [iniciando,   setIniciando]   = useState(true)
  const [erro,        setErro]        = useState(null)

  const scrollRef = useRef(null)
  const cenaRef   = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const t = setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 80)
    return () => clearTimeout(t)
  }, [blocoIdx, leituraDone, carregando])

  useEffect(() => { iniciar() }, [])

  async function iniciar() {
    setIniciando(true)
    setErro(null)
    setScoreAcum(0)
    setProgresso(0)
    setCenasVisitadas([])
    setCenaFinalRef(null)
    setEscolhas({})
    try {
      const dados = await chamarSetHistory({}, 0)
      aplicarCena(dados)
    } catch (e) {
      setErro('Não foi possível carregar a história. Verifique sua conexão.')
    } finally {
      setIniciando(false)
    }
  }

  function aplicarCena(dados) {
    cenaRef.current = dados.cena_atual
    setCena(dados)

    // Rastreia cenas visitadas e cena final para o relatório
    setCenasVisitadas(prev => prev.includes(dados.cena_atual) ? prev : [...prev, dados.cena_atual])
    if (dados.tipo === 'intermediaria' && dados.cena_atual !== 'relatorio_final') {
      setCenaFinalRef(dados.cena_atual)
    }

    if (dados.personagens) {
      setPersonagens(p => ({ ...p, ...dados.personagens }))
    }

    if (typeof dados.score_atual === 'number') setScoreAcum(dados.score_atual)
    if (typeof dados.progresso   === 'number') setProgresso(dados.progresso)

    setBlocoIdx(0)
    setLeituraDone(!dados.blocos?.length)
    setSelecionada(null)
    setConfirmarOn(false)
    setErro(null)
  }

  function avancarBloco() {
    if (!cena?.blocos) return
    const prox = blocoIdx + 1
    if (prox < cena.blocos.length) {
      setBlocoIdx(prox)
    } else {
      setLeituraDone(true)
    }
  }

  function selecionar(id) {
    if (!leituraDone || carregando) return
    const nova = selecionada === id ? null : id
    setSelecionada(nova)
    setConfirmarOn(!!nova)
  }

  async function confirmarEscolha() {
    if (!selecionada || carregando || !leituraDone) return
    const opcao = cena.opcoes?.find(o => o.id === selecionada)
    if (!opcao) return

    const novoScore = scoreAcum + (opcao.score_delta || 0)
    setScoreAcum(novoScore)

    // Registra escolha desta cena para o relatório
    const cenaAtual = cenaRef.current
    setEscolhas(prev => ({ ...prev, [cenaAtual]: selecionada }))

    setCarregando(true)

    const params = {
      cena_atual:      cenaAtual,
      escolha:         selecionada,
      score:           opcao.score_delta,
      score_acumulado: novoScore,
    }

    try {
      const dados = await chamarSetHistory(params, novoScore)
      if (dados.finalizar) {
        // Monta payload completo para T7
        const payload = {
          scoreAcumulado: novoScore,
          cenasVisitadas: [...cenasVisitadas, cenaAtual],
          cenaFinal:      cenaFinalRef,
          escolhas:       { ...escolhas, [cenaAtual]: selecionada },
        }
        nav('t7', payload)
        return
      }
      aplicarCena(dados)
    } catch {
      setErro('Erro ao processar escolha. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  async function clicarContinuar() {
    if (carregando) return
    setCarregando(true)

    const params = {
      cena_atual:      cenaRef.current,
      acao:            'continuar',
      score_acumulado: scoreAcum,
    }

    try {
      const dados = await chamarSetHistory(params, scoreAcum)
      if (dados.finalizar) {
        const payload = {
          scoreAcumulado: scoreAcum,
          cenasVisitadas,
          cenaFinal:      cenaFinalRef ?? cenaRef.current,
          escolhas,
        }
        nav('t7', payload)
        return
      }
      aplicarCena(dados)
    } catch {
      setErro('Erro ao continuar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const ehChoice  = cena?.tipo === 'choice'
  const ehInter   = cena?.tipo === 'intermediaria'
  const verOpcoes = ehChoice && leituraDone && !carregando
  const verCont   = ehInter  && leituraDone && !carregando

  // ── RENDER ───────────────────────────────────────────────────────────────────

  if (iniciando) return (
    <div className="screen" style={s.centro}>
      <div style={s.spinner} />
      <p style={s.txtDim}>Carregando história...</p>
    </div>
  )

  if (erro && !cena) return (
    <div className="screen" style={s.centro}>
      <p style={{ ...s.txtNarracao, color: '#FF6B6B', textAlign: 'center' }}>{erro}</p>
      <button style={s.btnContinuar} onClick={iniciar}>Tentar novamente</button>
    </div>
  )

  return (
    <div className="screen">

      {/* HEADER */}
      <header style={s.topbar}>
        <BtnVoltar onClick={() => nav('t5')} style={{ padding: 8, width: 36 }} />
        <div style={s.topbarTitle}>
          E se fosse<br /><span className="gradient-text">você?</span>
        </div>
        <div style={{ width: 36 }} />
      </header>

      <div style={s.topbarLine} />

      {/* BARRA DE PROGRESSO — começa em 0 e cresce conforme avanço */}
      <div style={s.progressBar}>
        <div style={{ ...s.progressFill, width: `${Math.min(Math.round(progresso * 100), 100)}%` }} />
      </div>

      {/* CONTEÚDO ROLÁVEL */}
      <div style={s.scroll} ref={scrollRef}>

        {cena?.blocos?.map((bloco, i) => {
          if (i > blocoIdx) return null
          return (
            <Bloco
              key={`${cena.cena_atual}-bloco-${i}`}
              bloco={bloco}
              personagens={personagens}
              animar={i === blocoIdx}
              onComplete={i === blocoIdx ? avancarBloco : undefined}
            />
          )
        })}

        {carregando && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <div style={s.spinner} />
          </div>
        )}

        {erro && !carregando && (
          <div style={s.erroInline}>
            <p style={{ margin: 0 }}>{erro}</p>
            <button
              style={{ ...s.btnContinuar, marginTop: 10, fontSize: 13, height: 40 }}
              onClick={ehChoice ? confirmarEscolha : clicarContinuar}
            >
              Tentar novamente
            </button>
          </div>
        )}

        <div style={{ height: verOpcoes ? 290 : 80 }} />
      </div>

      {/* OPÇÕES DE ESCOLHA */}
      {verOpcoes && (
        <div style={s.rodape}>
          {cena.label_escolha && (
            <p style={s.labelEscolha}>{cena.label_escolha}</p>
          )}

          {cena.opcoes?.map(op => (
            <button
              key={op.id}
              style={{
                ...s.btnOpcao,
                ...(selecionada === op.id ? s.btnOpcaoSel : {}),
              }}
              onClick={() => selecionar(op.id)}
            >
              <span style={s.idOpcao}>{op.id}</span>
              {op.texto}
            </button>
          ))}

          {confirmarOn && selecionada && (
            <button style={s.btnConfirmar} onClick={confirmarEscolha}>
              Confirmar
            </button>
          )}
        </div>
      )}

      {/* BOTÃO CONTINUAR */}
      {verCont && (
        <div style={s.rodapeCont}>
          <button style={s.btnContinuar} onClick={clicarContinuar}>
            Continuar
          </button>
        </div>
      )}

    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ESTILOS (inalterados)
// ══════════════════════════════════════════════════════════════════════════════
const s = {
  centro: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 16, padding: 32,
  },
  spinner: {
    width: 28, height: 28,
    border: '2.5px solid #2A2A33',
    borderTop: '2.5px solid #FBBC21',
    borderRadius: '50%',
    animation: 'spin 0.75s linear infinite',
    flexShrink: 0,
  },
  txtDim: {
    fontFamily: "'Inter',sans-serif", fontSize: 13,
    color: '#6B6B7A', textAlign: 'center',
  },
  erroInline: {
    background: 'rgba(255,107,107,0.08)',
    border: '1px solid rgba(255,107,107,0.2)',
    borderRadius: 12, padding: '14px 16px',
    fontFamily: "'Inter',sans-serif", fontSize: 13,
    color: '#FF6B6B', textAlign: 'center',
  },
  topbar: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '40px 24px 12px', flexShrink: 0,
  },
  topbarTitle: {
    fontFamily: "'Sora',sans-serif", fontWeight: 700,
    fontSize: 16, color: '#fff', textAlign: 'center', lineHeight: 1.3,
  },
  topbarLine: {
    height: 2,
    background: 'linear-gradient(90deg,#FBBC21,#F59F0A)',
    margin: '0 24px', borderRadius: 2, flexShrink: 0,
  },
  progressBar: {
    height: 3, background: '#1E1E27',
    margin: '8px 24px 0', borderRadius: 2,
    overflow: 'hidden', flexShrink: 0,
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg,#FBBC21,#F59F0A)',
    borderRadius: 2, transition: 'width .8s cubic-bezier(0.4,0,0.2,1)',
  },
  scroll: {
    flex: 1, minHeight: 0, overflowY: 'auto',
    padding: '22px 22px 0',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  txtNarracao: {
    fontFamily: "'Inter',sans-serif", fontSize: 14,
    color: '#C4C4D0', lineHeight: 1.85,
    margin: 0,
  },
  wrapDialogo: {
    display: 'flex', flexDirection: 'column', gap: 5,
  },
  labelPersonagem: {
    fontFamily: "'Sora',sans-serif", fontSize: 10,
    fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.12em',
  },
  txtDialogo: {
    fontFamily: "'Inter',sans-serif", fontSize: 14,
    color: '#fff', lineHeight: 1.8,
    margin: 0, paddingLeft: 13,
    borderLeft: '2px solid',
  },
  wrapPensamento: {
    display: 'flex', flexDirection: 'column', gap: 6,
    background: 'rgba(251,188,33,0.04)',
    border: '1px solid rgba(251,188,33,0.10)',
    borderRadius: 10, padding: '11px 15px',
  },
  txtPensamento: {
    fontFamily: "'Inter',sans-serif", fontSize: 13.5,
    color: '#B8B8C8', lineHeight: 1.8,
    fontStyle: 'italic', margin: 0,
  },
  rodape: {
    padding: '10px 18px 28px',
    display: 'flex', flexDirection: 'column', gap: 8,
    background: '#0F0F14',
    flexShrink: 0,
    boxShadow: '0 -24px 32px rgba(15,15,20,0.98)',
  },
  labelEscolha: {
    fontFamily: "'Inter',sans-serif", fontSize: 10,
    color: '#505060', margin: '0 0 1px',
    textTransform: 'uppercase', letterSpacing: '0.1em',
  },
  btnOpcao: {
    width: '100%', padding: '11px 14px',
    background: 'transparent',
    border: '1.5px solid #22222C',
    borderRadius: 12,
    fontFamily: "'Inter',sans-serif", fontSize: 13,
    fontWeight: 500, color: '#B0B0C0',
    cursor: 'pointer', textAlign: 'left',
    transition: 'border-color .15s, color .15s, background .15s',
    outline: 'none', lineHeight: 1.45,
    display: 'flex', alignItems: 'flex-start', gap: 10,
  },
  btnOpcaoSel: {
    borderColor: '#FBBC21',
    color: '#FBBC21',
    background: 'rgba(251,188,33,0.06)',
  },
  idOpcao: {
    fontFamily: "'Sora',sans-serif", fontSize: 11,
    fontWeight: 700, color: 'inherit',
    minWidth: 14, paddingTop: 1, opacity: 0.7,
  },
  btnConfirmar: {
    width: '62%', height: 44,
    background: 'linear-gradient(90deg,#FBBC21,#F59F0A)',
    border: 'none', borderRadius: 50,
    fontFamily: "'Sora',sans-serif", fontSize: 15,
    fontWeight: 700, color: '#000',
    cursor: 'pointer', margin: '3px auto 0', display: 'block',
    transition: 'opacity .2s',
  },
  rodapeCont: {
    padding: '14px 22px 34px',
    background: '#0F0F14',
    flexShrink: 0,
    boxShadow: '0 -24px 32px rgba(15,15,20,0.98)',
  },
  btnContinuar: {
    width: '100%', height: 50,
    background: 'linear-gradient(90deg,#FBBC21,#F59F0A)',
    border: 'none', borderRadius: 50,
    fontFamily: "'Sora',sans-serif", fontSize: 16,
    fontWeight: 700, color: '#000',
    cursor: 'pointer', display: 'block',
  },
}

// ═══════════════════════════════════════════════════════════
// LÓGICA DO CARROSSEL INTELIGENTE
//
// Este script faz duas coisas:
//   1. Detecta qual card está centralizado na tela
//   2. Quando o botão é clicado, avança para a história do card ativo
//
// NÃO PRECISA MEXER NESTE ARQUIVO a não ser que queira
// mudar o destino de cada história (veja a função avancarHistoria)
// ═══════════════════════════════════════════════════════════

const carousel  = document.getElementById('carousel');
const cards     = document.querySelectorAll('.card');

// ── 1. Detectar qual card está no centro ──────────────────────────────────────

// Índice do card atualmente centralizado (começa no 0)
let cardAtivo = 0;

function atualizarCardAtivo() {
  // Centro horizontal da tela/carrossel
  const centroCarrossel = carousel.scrollLeft + carousel.offsetWidth / 2;

  let menorDistancia = Infinity;
  let novoAtivo = 0;

  cards.forEach((card, i) => {
    // Centro do card em relação ao scroll atual
    const centroCard = card.offsetLeft + card.offsetWidth / 2;
    const distancia  = Math.abs(centroCarrossel - centroCard);

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      novoAtivo = i;
    }
  });

  // Só atualiza se mudou para evitar trabalho desnecessário
  if (novoAtivo !== cardAtivo) {
    cardAtivo = novoAtivo;
    destacarCardAtivo();
  }
}

function destacarCardAtivo() {
  cards.forEach((card, i) => {
    // Adiciona a classe "active" só no card centralizado
    card.classList.toggle('active', i === cardAtivo);
  });
}

// Escuta o scroll do carrossel e atualiza o card ativo
carousel.addEventListener('scroll', atualizarCardAtivo);

// Inicializa com o primeiro card ativo ao carregar a página
window.addEventListener('load', () => {
  destacarCardAtivo();
});


// ── 2. Botão inteligente — avança para a história do card ativo ───────────────

function avancarHistoria() {

  // ═══════════════════════════════════════════════════════
  // CONFIGURE OS DESTINOS DE CADA HISTÓRIA AQUI
  //
  // Cada número (0, 1, 2...) corresponde à posição do card
  // no carrossel, começando do zero da esquerda.
  //
  // Exemplo:
  //   cardAtivo === 0  →  primeiro card da esquerda
  //   cardAtivo === 1  →  segundo card
  //   cardAtivo === 4  →  quinto card (último)
  //
  // Troque o alert() pela navegação real do seu app,
  // por exemplo: window.location.href = 'simulacao-1.html'
  // ═══════════════════════════════════════════════════════

  const destinos = {
    0: 't6.html',   // destino do card 1
    1: 'simulacao-historia-2.html',   // destino do card 2
    2: 'simulacao-historia-3.html',   // destino do card 3
    3: 'simulacao-historia-4.html',   // destino do card 4
    4: 'simulacao-historia-5.html',   // destino do card 5
  };

  // Por enquanto mostra qual card seria aberto —
  // substitua este alert() pela navegação real quando tiver as páginas prontas
  //alert(`Abrindo história ${cardAtivo + 1}: ${destinos[cardAtivo]}`);

  // Quando tiver as páginas prontas, descomente a linha abaixo e apague o alert acima:
  window.location.href = destinos[cardAtivo];
}

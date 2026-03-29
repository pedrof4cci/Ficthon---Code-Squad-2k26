// ═══════════════════════════════════════════════════════════
// ANIMAÇÃO DA LOGO
//
// Cada frame: [root, left, center, right, top]
// true  = elemento fica ÂMBAR
// false = elemento fica BRANCO
//
// A sequência replica o sprite sheet do Figma:
// âmbar sobe progressivamente da raiz para os galhos/nós.
// ═══════════════════════════════════════════════════════════

const frames = [
  // Tudo branco
  [false, false, false, false, false],
  // Raiz âmbar
  [true,  false, false, false, false],
  // Raiz + galho esquerdo
  [true,  true,  false, false, false],
  // Raiz + galhos esquerdo e direito
  [true,  true,  true,  false, false],
  // Raiz + todos os galhos + galho central
  [true,  true,  true,  true,  false],
  // Tudo âmbar
  [true,  true,  true,  true,  true ],
  // Pausa tudo âmbar
  [true,  true,  true,  true,  true ],
  // Volta: só raiz âmbar
  [true,  false, false, false, false],
  // Tudo branco
  [false, false, false, false, false],
  // Pausa branco
  [false, false, false, false, false],
];

const els = {
  root:   document.getElementById('node-root'),
  left:   document.getElementById('node-left'),
  lineL:  document.getElementById('line-left'),
  right:  document.getElementById('node-right'),
  lineR:  document.getElementById('line-right'),
  center: document.getElementById('line-center'),
  top:    document.getElementById('node-top'),
};

let frameIndex = 0;

function aplicarFrame(frame) {
  const [root, left, center, right, top] = frame;

  els.root.classList.toggle('amber', root);

  els.left.classList.toggle('amber', left);
  els.lineL.classList.toggle('amber', left);

  els.right.classList.toggle('amber', center);
  els.lineR.classList.toggle('amber', center);

  els.center.classList.toggle('amber', right);

  els.top.classList.toggle('amber', top);
}

function tick() {
  aplicarFrame(frames[frameIndex]);
  frameIndex = (frameIndex + 1) % frames.length;
}

tick();
const intervalo = setInterval(tick, 380);

// ═══════════════════════════════════════════════════════════
// REDIRECIONAMENTO AUTOMÁTICO
// Troque 't7.html' pelo destino correto.
// Troque 4000 pelo tempo em ms desejado.
// ═══════════════════════════════════════════════════════════
setTimeout(function () {
  clearInterval(intervalo);
  window.location.href = 't7.html';
}, 4000);

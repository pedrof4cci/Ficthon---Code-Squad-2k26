// ═══════════════════════════════════════════════════════════
// LÓGICA DE SELEÇÃO DE OPÇÃO E BOTÃO CONFIRMAR
// ═══════════════════════════════════════════════════════════

let opcaoSelecionada = null;

function selecionarOpcao(botao) {
  const confirmar = document.getElementById('btnConfirmar');

  // Se clicar no já selecionado — DESELECIONA e esconde o confirmar
  if (botao.classList.contains('selected')) {
    botao.classList.remove('selected');
    opcaoSelecionada = null;

    // Esconde com animação
    confirmar.classList.remove('visivel');
    setTimeout(function() {
      confirmar.style.display = 'none';
    }, 300); // tempo igual ao da transição CSS
    return;
  }

  // Remove seleção de todos
  document.querySelectorAll('.choice-btn').forEach(function(btn) {
    btn.classList.remove('selected');
  });

  // Seleciona o clicado
  botao.classList.add('selected');
  opcaoSelecionada = botao.textContent.trim();

  // Mostra o confirmar com animação
  confirmar.style.display = 'block';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      confirmar.classList.add('visivel');
    });
  });
}

function avancarPagina() {
  if (!opcaoSelecionada) return;
  window.location.href = 'loading.html';
}
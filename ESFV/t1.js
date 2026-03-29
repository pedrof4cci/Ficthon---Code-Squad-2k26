document.addEventListener('DOMContentLoaded', function() {
  const newAccountBtn = document.getElementById('newAccountBtn');
  const loginBtn = document.getElementById('loginBtn');
  
  // Selecionando os links específicos pelos novos IDs
  const linkTermos = document.getElementById('linkTermos');
  const linkAvisos = document.getElementById('linkAvisos');

  if (newAccountBtn) {
    newAccountBtn.addEventListener('click', function() {
      window.location.href = 't2.html';
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      window.location.href = 't3.html';
    });
  }

  // Link para Termos de Uso (tt.html)
  if (linkTermos) {
    linkTermos.addEventListener('click', function(e) {
      e.preventDefault(); // Evita que a página recarregue antes de ir
      window.location.href = 'tt.html';
    });
  }

  // Link para Avisos/Política (ta.html)
  if (linkAvisos) {
    linkAvisos.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'ta.html';
    });
  }
});
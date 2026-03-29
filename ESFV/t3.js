document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const loginInput = document.getElementById('loginInput');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('loginError');
  const passwordError = document.getElementById('passwordError');

  function validateForm() {
    let isValid = true;

    const login = loginInput.value.trim();
    if (!login) {
      loginInput.classList.add('error');
      loginError.classList.add('show');
      isValid = false;
    } else {
      loginInput.classList.remove('error');
      loginError.classList.remove('show');
    }

    const password = passwordInput.value;
    if (!password) {
      passwordInput.classList.add('error');
      passwordError.classList.add('show');
      isValid = false;
    } else {
      passwordInput.classList.remove('error');
      passwordError.classList.remove('show');
    }

    return isValid;
  }

  loginInput.addEventListener('input', validateForm);
  passwordInput.addEventListener('input', validateForm);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Verifica se existe cadastro
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const loginValue = loginInput.value.trim();
        
        if ((loginValue === user.email || loginValue === user.username) && 
            passwordInput.value === user.password) {
          alert('Login realizado com sucesso!');
          window.location.href = 't4.html';
        } else {
          passwordInput.classList.add('error');
          passwordError.classList.add('show');
          passwordError.textContent = 'E-mail/Usuário ou senha incorretos';
        }
      } else {
        // Demo: aceita qualquer login para teste
        alert('Login realizado com sucesso! (Modo demonstração)');
        window.location.href = 't4.html';
      }
    }
  });

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 't1.html';
    });
  }

  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Recuperação de senha - Em desenvolvimento');
    });
  }

  const googleBtn = document.getElementById('googleBtn');
  const facebookBtn = document.getElementById('facebookBtn');
  
  if (googleBtn) {
    googleBtn.addEventListener('click', function() {
      alert('Login com Google - Em desenvolvimento');
    });
  }
  
  if (facebookBtn) {
    facebookBtn.addEventListener('click', function() {
      alert('Login com Facebook - Em desenvolvimento');
    });
  }
});
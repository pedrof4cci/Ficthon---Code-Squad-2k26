document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');
  const emailInput = document.getElementById('email');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');

  const emailError = document.getElementById('emailError');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const confirmError = document.getElementById('confirmError');

  function validateEmail(email) {
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
  }

  function validateForm() {
    let isValid = true;

    const email = emailInput.value.trim();
    if (!email || !validateEmail(email)) {
      emailInput.classList.add('error');
      emailError.classList.add('show');
      isValid = false;
    } else {
      emailInput.classList.remove('error');
      emailError.classList.remove('show');
    }

    const username = usernameInput.value.trim();
    if (!username || username.length < 3) {
      usernameInput.classList.add('error');
      usernameError.classList.add('show');
      isValid = false;
    } else {
      usernameInput.classList.remove('error');
      usernameError.classList.remove('show');
    }

    const password = passwordInput.value;
    if (!password || password.length < 6) {
      passwordInput.classList.add('error');
      passwordError.classList.add('show');
      isValid = false;
    } else {
      passwordInput.classList.remove('error');
      passwordError.classList.remove('show');
    }

    const confirm = confirmInput.value;
    if (password !== confirm) {
      confirmInput.classList.add('error');
      confirmError.classList.add('show');
      isValid = false;
    } else {
      confirmInput.classList.remove('error');
      confirmError.classList.remove('show');
    }

    return isValid;
  }

  emailInput.addEventListener('input', validateForm);
  usernameInput.addEventListener('input', validateForm);
  passwordInput.addEventListener('input', validateForm);
  confirmInput.addEventListener('input', validateForm);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        email: emailInput.value.trim(),
        username: usernameInput.value.trim(),
        password: passwordInput.value
      };
      localStorage.setItem('user', JSON.stringify(userData));
      alert('Cadastro realizado com sucesso!');
      window.location.href = 't4.html';
    }
  });

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 't1.html';
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
function toggleShowPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}


function toggleShowConfirmPassword() {
    const passwordInput = document.getElementById('confirmPasswordInput');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}


document.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
      const bild = document.getElementById('meinBild');
      const ziel = document.getElementById('zielbereich');
      const inhalt = document.getElementById('inhalt');
      const zielRect = ziel.getBoundingClientRect();
      bild.style.width = '100px'; 
      bild.style.top = zielRect.top + 'px';
      bild.style.left = zielRect.left + 'px';
  
      setTimeout(() => {
        inhalt.style.opacity = 1; 
        inhalt.style.filter = 'blur(0px)'; 
      }, 1000); 
    }, 1000); 
  });
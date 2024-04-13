function toggleShowPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}


async function initLogIn(){
    if(document.getElementById("check").checked){
        fillLogInAuto();
    } else{
        await loadUsers();
    }
}

async function logIn(){
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('passwordInput').value;
    let user = users.find(u => u.email == email && u.password == password);
    if(user){
        window.location.href = 'summary.html';
    } else {
        window.location.reload();
        alert('User ist nicht registriert');
    }
}

function guestLogIn(){
    window.location.href = 'summary.html';
}

function fillLogInAuto(){
    getLocalStorage();
     savedEmail = document.getElementById('inputEmail').value;
     savedPassword = document.getElementById('passwordInput').value;
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


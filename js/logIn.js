let savedUsers = [];

function toggleShowPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

 async function initLogIn(){
    await loadUsers();
    document.getElementById('inputEmail').addEventListener('input', function() {
        const email = this.value;
        const passwordInput = document.getElementById('passwordInput');
        
        // Passwort aus dem localStorage abrufen
        const password = checkLocalStorage(email);
        
        // Wenn ein Passwort gefunden wurde, fülle das Passwortfeld aus
        if (password !== null) {
            passwordInput.value = password;
        } else {
            passwordInput.value = ''; // Passwortfeld leeren, falls keine Übereinstimmung gefunden wurde
        }
    });
}

function checkedFunction(){
    let checkBox = document.getElementById("myCheck");
    if (checkBox.checked == true){
        saveUserToLocalStorage();
    } 
}

async function logIn(){
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('passwordInput').value;
    let user = users.find(u => u.email == email && u.password == password);
    if(user){
        setLocalStorage('user-name', user.name);
        window.location.href = 'summary.html?user=' + user.name;
    } else {
        window.location.reload();
        alert('User ist nicht registriert');
    }
}

function guestLogIn(){
    let guest = 'Guest';
    localStorage.setItem('user-name', JSON.stringify(guest));
    window.location.href = 'summary.html?user=Guest' ;
}

<<<<<<< HEAD
=======
let savedUsers = [];

function checkLocalStorage(email) {
    for (let i = 0; i < savedUsers.length; i++) {
        const user = savedUsers[i];
        if (user.emails.includes(email)) {
            // Passwort für die gefundenen E-Mail zurückgeben
            return user.passwords[user.emails.indexOf(email)];
        }
    }
    // Falls die E-Mail nicht gefunden wurde, null zurückgeben
    return null;
}

>>>>>>> c3e1c39e7301a45d54c90c8db09903e27f743b3d
function saveUserToLocalStorage(){
    savedUsers.push({
        email: inputEmail.value,
        password: passwordInput.value,
        });
    setLocalStorage('savedUsers', savedUsers);
}

function setLocalStorage(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key){
    JSON.parse(localStorage.getItem(key));
}

/* function fillLogInAuto(){
    checkbox = true;
    getLocalStorage();
    document.getElementById('inputEmail').value = savedEmail;
    document.getElementById('passwordInput').value = savedPassword;
} */

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const bild = document.getElementById('meinBild');
        const ziel = document.getElementById('zielbereich');
        const inhalt = document.getElementById('inhalt');
        if (ziel) {
            const zielRect = ziel.getBoundingClientRect();
            bild.style.width = '100px'; 
            bild.style.top = zielRect.top + 'px';
            bild.style.left = zielRect.left + 'px';
        }
        setTimeout(() => {
            if (inhalt) {
                inhalt.style.opacity = 1; 
                inhalt.style.filter = 'blur(0px)';
            }
        }, 1000); 
    }, 1000); 
});

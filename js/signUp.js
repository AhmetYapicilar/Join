const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

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


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}

async function getItem(key) {
    const URL = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(URL).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}


<<<<<<< HEAD
=======
function setLocalStorage() {
    let email = JSON.stringify(document.getElementById('inputEmail').value);
    let password = JSON.stringify(document.getElementById('passwordInput').value);
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
}

function getLocalStorage() {
    savedEmail = JSON.parse(localStorage.getItem('email'));
    savedPassword = JSON.parse(localStorage.getItem('savedPassword'));
}
>>>>>>> c3e1c39e7301a45d54c90c8db09903e27f743b3d

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



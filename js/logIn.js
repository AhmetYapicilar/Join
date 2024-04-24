let savedUsers = [];

function toggleShowPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

 async function initLogIn(){
    await loadUsers();
    getLocalStorage();
    let x = savedUsers.length - 1;
    document.getElementById('inputEmail').value = savedUsers[x]['email'];
    document.getElementById('passwordInput').value = savedUsers[x]['password'];
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
        setUserNameToLocalStorage('user-name', user.name);
        window.location.href = 'summary.html?user=' + user.name;
    } else {
        window.location.reload();
        alert('User ist nicht registriert');
    }
}

function guestLogIn(){
    savedUsers.push({
        email: '',
        password: ''
        });
    setLocalStorage('savedUsers', savedUsers);
    let guest = 'Guest';
    setUserNameToLocalStorage('user-name', JSON.stringify(guest));
    window.location.href = 'summary.html?user=Guest' ;
}

function saveUserToLocalStorage(){
    savedUsers.push({
        email: inputEmail.value,
        password: passwordInput.value,
        });
    setLocalStorage('savedUsers', savedUsers);
}

function setLocalStorage(){
    let userAsText = JSON.stringify(savedUsers);
    localStorage.setItem('savedUsers', userAsText);
}

function getLocalStorage(){
    let textInArray = localStorage.getItem('savedUsers');
    savedUsers = JSON.parse(textInArray);
}

function setUserNameToLocalStorage(key, value){
    localStorage.setItem(key, (JSON.stringify(value)));
}

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

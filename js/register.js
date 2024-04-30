let users = [];

async function init(){
    loadUsers();
    document.getElementById('signUP-Div').classList.remove('overlay-signUp');
    document.getElementById('signedUp').style.visibility = 'hidden';
}

async function loadUsers(){
    try{
    users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}

async function register(){
    registerBTN.disabled = true;
    users.push({
        name: name1.value,
        email: email.value,
        password: passwordInput.value,
        color: randomColor()
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
    succesfullySignedUp();
    setTimeout(function() {
        window.location.href = 'Login.html';
    }, 2000);
}

//Eine zufällige Farbe für den Hintergund im Kreis generieren lassen
function randomColor() {
    const colors = ['#FFA500', '#90EE90', '#FF4500', '#FFD700', '#FF8C00', '#ADD8E6', '#FF6347', '#FFC0CB', '#00FF00', '#00BFFF', '#9370DB', '#FF69B4', '#FFA07A', '#BA55D3', '#7FFFD4']; 
    if (colors.length === 1) return colors[0]; 
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * colors.length);
    } while (colors[randomIndex] === lastColor); 

    lastColor = colors[randomIndex];
    return colors[randomIndex];
}


function succesfullySignedUp(){
    let loadingImage = document.getElementById('signedUp');
    if (loadingImage) {
        document.getElementById('signUP-Div').classList.add('overlay-signUp');
        loadingImage.style.visibility = 'visible';
    }
}

function resetForm(){
    name1.value = '';
    email.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    registerBTN.disabled = false;
}


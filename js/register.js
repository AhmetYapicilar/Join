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
        password: passwordInput.value
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
    succesfullySignedUp();
    setTimeout(function() {
        window.location.href = 'Login.html';
    }, 2000);
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


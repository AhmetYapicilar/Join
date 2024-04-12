let users = [];

async function init(){
    loadUsers();
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
    window.location.href = 'Login.html';
}

function resetForm(){
    name1.value = '';
    email.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    registerBTN.disabled = false;
}


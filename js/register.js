/**
 * Array for storing users.
 * @type {Array<Object>}
 */
let users = [];

/**
 * Variable to store the last randomly generated color.
 */
let lastColor = null;

/**
 * Initializes the registration form by removing the overlay and hiding the "Signed Up" message.
 */
async function init(){
    loadUsers();
    document.getElementById('signUP-Div').classList.remove('overlay-signUp');
    document.getElementById('signedUp').style.visibility = 'hidden';
}

/**
 * Loads user data from localStorage.
 */
async function loadUsers(){
    try{
    users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}

/**
 * Registers a new user by collecting input data, generating initials, and storing the user in localStorage.
 * Disables the register button after submission.
 */
async function register(){
    let input = document.getElementById(`name1`).value;
    let initials = input.match(/\b\w/g) || [];
    let result = initials.join('');
    registerBTN.disabled = true;
    const color = randomColor();
    users.push({
        name: name1.value,
        initials: result,
        email: email.value,
        password: passwordInput.value,
        Color: color
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
    succesfullySignedUp();
    setTimeout(function() {
        window.location.href = 'Login.html';
    }, 2000);
}

/**
 * Generates a random color for the user circle background.
 * @returns {string} - Random color hex value.
 */
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

/**
 * Displays the "Signed Up" message after successful registration.
 */
function succesfullySignedUp(){
    let loadingImage = document.getElementById('signedUp');
    if (loadingImage) {
        document.getElementById('signUP-Div').classList.add('overlay-signUp');
        loadingImage.style.visibility = 'visible';
    }
}

/**
 * Resets the registration form after submission.
 */
function resetForm(){
    name1.value = '';
    email.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    registerBTN.disabled = false;
}


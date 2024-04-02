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
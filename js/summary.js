document.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
        let name = JSON.parse(localStorage.getItem('user-name'));
        if (name != 'guest'){
            document.getElementById('greeting-name').innerHTML = name;
        }}, 1000)
    })
/**
 * Constant representing the token for remote storage.
 */
const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';

/**
 * Constant representing the URL for remote storage.
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Toggles the visibility of the password input field.
 */
function toggleShowPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

/**
 * Toggles the visibility of the confirm password input field.
 */
function toggleShowConfirmPassword() {
    const passwordInput = document.getElementById('confirmPasswordInput');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
}

/**
 * Sets an item in the remote storage.
 * @param {string} key - The key for the item.
 * @param {any} value - The value to be stored.
 * @returns {Promise<any>} - A promise resolving to the response data.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}

/**
 * Gets an item from the remote storage.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<any>} - A promise resolving to the value of the item.
 * @throws {string} - Throws an error if the item with the specified key is not found.
 */
async function getItem(key) {
    const URL = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(URL).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

/**
 * Initializes the DOM content after it has been loaded.
 */
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




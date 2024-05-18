/**
 * An array containing the list of contacts.
 * Each contact is represented as an object with properties such as 'Name', 'Email', 'Number', 'Initials', 'InitialLetter', and 'Color'.
 * Initially, it's an empty array.
 */
let contactList = [];

/**
 * A counter representing the unique identifier for new contacts.
 * It is incremented each time a new contact is added to the list.
 * Initially set to 0.
 */
let contactId = 0;

/**
 * Stores the last randomly generated color.
 * Used to prevent consecutive generation of the same color.
 * Initially set to null.
 */
let lastColor = null;

/**
 * Represents the index of the currently selected contact in the global contact list.
 * Used for tracking the index when navigating through contacts.
 * Initially set to 0.
 */
let globalContactIndex = 0;

/**
 * Stores the index of the last accessed contact.
 * Used for navigating through contacts.
 * Initially set to null.
 */
let lastIndex = null;

/**
 * The token used for authentication when accessing the remote storage API.
 * This token grants permission to read and write data to the storage.
 */
const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';

/**
 * The URL of the remote storage API where data is stored.
 * This URL is used for fetching and storing data remotely.
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Initializes the application by loading users' data and displaying the contact list.
 */
function init() {
    loadUsers();
}

/**
 * Loads the list of users from the storage, updates the contact list, and displays the contact list.
 */
async function loadUsers(){
    try {
        contactList = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
    showContactlist();
}

/**
 * Sets a key-value pair in the storage using a token.
 *
 * @param {string} key - The key under which to store the value.
 * @param {any} value - The value to be stored.
 * @returns {Promise<any>} - A promise that resolves with the response from the storage server.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}

/**
 * Retrieves the value associated with the provided key from the storage URL using a token.
 *
 * @param {string} key - The key used to retrieve the value from the storage.
 * @returns {Promise<any>} - A promise that resolves with the retrieved value from the storage.
 * @throws {string} - Throws an error if the data associated with the key is not found.
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
 * Adds a new contact to the local storage with the provided details and updates the contact list.
 *
 * @param {string} contactId - The unique identifier for the new contact.
 * @param {string} name - The name of the new contact.
 * @param {string} email - The email address of the new contact.
 * @param {string} number - The phone number of the new contact.
 * @param {string} initials - The initials of the new contact.
 * @param {string} initialLetter - The initial letter of the new contact's name.
 * @returns {Promise<void>} - A promise that resolves once the operation is completed.
 */
async function setItemLocalStorage(contactId, name, email, number, initials, initialLetter) {
    const color = randomColor();
    contactList.push({
        id: contactId,
        Name: name,
        Email: email,
        Number: number,
        Initials: initials,
        InitialLetter: initialLetter,
        Color: color 
    });
    await setItem('users', JSON.stringify(contactList));
}

/**
 * Generates a random color from a predefined list of colors and ensures that the same color is not generated consecutively.
 * 
 * @returns {string} - A randomly selected color in hexadecimal format.
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
 * Displays the contact list in the phonebook element by grouping contacts by their initial letters.
 * It clears the existing content of the phonebook element and creates a grouped display of contacts.
 */
function showContactlist() {
    const List = contactList;
    const phonebook = document.getElementById('phonebook');
    const groups = groupContactsByLetter(List);

    phonebook.innerHTML = '';

    createGroupedDisplay(groups, phonebook);
}

/**
 * Groups contacts by the first letter of their initials.
 * 
 * @param {Array<Object>} List - The list of contact objects.
 * @param {string} List[].Initials - The initials of the contact.
 * @param {string} List[].Name - The name of the contact.
 * @param {string} List[].Email - The email of the contact.
 * @param {string} List[].Color - The color associated with the contact.
 * @returns {Object} An object where the keys are the initial letters and the values are arrays of contact objects.
 */
function groupContactsByLetter(List) {
    let groups = {};
    for (let contact of List) {
        if (!contact['Initials'] || !contact['Name'] || !contact['Email'] || !contact['Color']) {
            continue;
        }

        // Get the first letter of the initials
        let initialLetter = contact['Initials'].charAt(0).toUpperCase(); 
        if (!groups[initialLetter]) {
            groups[initialLetter] = [];
        }
        groups[initialLetter].push(contact);
    }
    return groups;
}

/**
 * Creates a grouped display of contacts based on the provided groups and appends it to the phonebook element.
 *
 * @param {Object} groups - An object containing groups of contacts where keys represent letters and values are arrays of contact objects.
 * @param {HTMLElement} phonebook - The HTML element to which the grouped display will be appended.
 */
function createGroupedDisplay(groups, phonebook) {
    let sortedLetters = Object.keys(groups).sort();

    for (let letter of sortedLetters) {
        let groupDiv = createLetterGroup(letter, groups[letter]);
        phonebook.appendChild(groupDiv);
    }
}

/**
 * Creates a letter group containing a header with the specified letter,
 * an image, and an unordered list of contacts.
 *
 * @param {string} letter - The letter representing the group.
 * @param {Array<Object>} contacts - An array of contact objects.
 * @returns {HTMLDivElement} - The created letter group element.
 */
function createLetterGroup(letter, contacts) {
    let groupDiv = document.createElement('div');
    let letterHeader = document.createElement('h2');
    letterHeader.textContent = letter;
    groupDiv.appendChild(letterHeader);
    
    let letterImg = document.createElement('img');
    letterImg.src = 'assets/img/Vector10.png';
    letterImg.className = 'display-flex centerVectorPhoneBook';
    groupDiv.appendChild(letterImg);

    let contactListUl = createContactsList(contacts);
    groupDiv.appendChild(contactListUl);
    return groupDiv;
}

/**
 * Creates an HTML unordered list (ul) containing contact information.
 * Each list item (li) represents a contact, displaying their name, email, and initials in a colored circle.
 * Clicking on a contact list item triggers a function to show the contact's details.
 *
 * @param {Array<Object>} contacts - An array of contact objects containing 'Name', 'Email', 'Initials', and 'Color' properties.
 * @returns {HTMLUListElement} - The created unordered list element containing contact information.
 */
function createContactsList(contacts) {
    let contactListUl = document.createElement('ul');
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let contactLi = document.createElement('li');
        contactLi.id = `${contactList.indexOf(contact)}`;
        contactLi.onclick = function() { showContactsSlideInRightContainer(contactList.indexOf(contact)); };
        contactLi.innerHTML = `
            <span class="initials-circle" style="background-color: ${contact['Color']};">${contact['Initials']}</span>
            <div class="contact-info">
                <strong>${contact['Name']}</strong>
                <div class="showEmailLi">${contact['Email']}</div>
            </div>`;
        contactListUl.appendChild(contactLi);
    }
    return contactListUl;
}

/**
 * Initializes event listeners for DOM content load and 'addNewContactToPhoneList' button click.
 * On button click, triggers slide-in animation for 'letAddContactSlideIn' and displays the contact addition UI.
 * Shows 'overlayOnMobileEditContacts' smoothly after 200ms and updates the contact image source.
 */
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addNewContactToPhoneList').addEventListener('click', function() {
        document.getElementById(`letAddContactSlideIn`).classList.remove(`show-slide-out-Desktop`);
        document.getElementById(`letAddContactSlideIn`).classList.add(`show-slide-in-Desktop`);
        setTimeout(() => {
            document.getElementById(`overlayOnMobileEditContacts`).style.display = "flex";
        }, 200);
        document.getElementById(`letAddContactSlideIn`).style.display = "flex";
      document.getElementById(`addContactImgChange`).src = `assets/img/Frame 194.png`;
    });


/**
 * Adds a click event listener to 'closeButton' to manage the closing animation of the contact addition container.
 * On click, triggers slide-out animation for 'letAddContactSlideIn' and hides the 'overlayOnMobileEditContacts'.
 */
document.getElementById('closeButton').addEventListener('click', function() {
    let addContactContainer = document.getElementById("letAddContactSlideIn");
    addContactContainer.classList.remove("show-slide-in-Desktop");
    addContactContainer.classList.add("show-slide-out-Desktop");
    document.getElementById(`overlayOnMobileEditContacts`).style.display = "none";
});

/**
 * Adds a click event listener to 'cancelAccountSubmit' to control the visibility of 'letAddContactSlideIn'.
 * On click, triggers slide-out animation for 'letAddContactSlideIn' and hides the 'overlayOnMobileEditContacts'.
 */
document.getElementById('cancelAccountSubmit').addEventListener('click', function() {
    let addContactContainer = document.getElementById("letAddContactSlideIn");
    addContactContainer.classList.remove("show-slide-in-Desktop");
    addContactContainer.classList.add("show-slide-out-Desktop");
    document.getElementById(`overlayOnMobileEditContacts`).style.display = "none";

});
});

/**
 * Displays contact details in a sliding container, adapting behavior based on the window width.
 * If the window width is less than 1320 pixels, sets specific containers' display styles and updates the inner HTML.
 * For window widths of 1320 pixels or more, prepares and triggers a sliding animation.
 * Checks for the presence of essential elements and exits if any are missing.
 * 
 * @param {number} index - The index of the contact whose details are to be displayed.
 */
function showContactsSlideInRightContainer(index) {
const contacts = document.getElementById('showContactDetailsOnSlide');
const target = document.getElementById('targetArea');
const slideInContacts = document.getElementById('showInnerHTML');

if (window.innerWidth < 1320) {

    if (!contacts || !target || !slideInContacts) {
        // Falls eine der Variablen leer ist, wird die Funktion beendet
        return;
    }

    // Code für den Fall, dass die Breite unter 1320px ist und alle Variablen gesetzt sind
    document.getElementById("leftContainerContacts").style.display = "none";
    document.getElementById("rightContainerContacts").style.display = "flex";
    lastLiGetsNewClass(index);
    target.innerHTML = '';
    target.innerHTML = generateContactDetailsHTML(contactList[index], index);
    document.getElementById(`showContactMobile`).style.display = "flex";
} else {

    if (!contacts || !target || !slideInContacts) {
        // Falls eine der Variablen leer ist, wird die Funktion beendet
        return;
    }

    // Code für den Fall, dass die Breite ab 1320px ist und alle Variablen gesetzt sind
    lastLiGetsNewClass(index);
    prepareAnimation(contacts);
    slideInContacts.innerHTML = '';
    triggerSlideInAnimation(target, contacts, slideInContacts, index);
}
}


/**
 * Updates the class list of list items by removing a class from the previously selected item and 
 * adding it to the currently selected item.
 * The function uses the global variable `lastIndex` to keep track of the previously selected item.
 * 
 * @param {number} index - The index of the current list item to which the class 'showClickedLi' should be added.
 */
function lastLiGetsNewClass(index) {
    if (lastIndex !== null) {
        const lastItem = document.getElementById(`${lastIndex}`);
        if (lastItem) {
            lastItem.classList.remove('showClickedLi');
        }
    }
    const currentItem = document.getElementById(`${index}`);
    if (currentItem) {
        currentItem.classList.add('showClickedLi');
    }
    lastIndex = index;
}

/**
 * Prepares an element for an animation by initially setting its width, opacity, and left position. 
 * This function is typically used to set the initial state before an animation sequence begins.
 * 
 * @param {HTMLElement} contacts - The DOM element that will undergo animation.
 */
function prepareAnimation(contacts) {
applyStyles(contacts, {
    width: '0px',
    opacity: '0',
    left: '5000px'
});
}

/**
 * Triggers a slide-in animation for displaying contact details. The animation starts after a delay and adjusts the position and 
 * visibility of the contacts element based on the target's location.
 * 
 * @param {HTMLElement} target - The element used as a reference for the slide-in animation's start position.
 * @param {HTMLElement} contacts - The container element where the contact details will be displayed and styled.
 * @param {HTMLElement} slideInContacts - The element into which the HTML content of the contact details is injected.
 * @param {number} index - The index of the contact in the contact list whose details are to be displayed.
 */
function triggerSlideInAnimation(target, contacts, slideInContacts, index) {
setTimeout(() => {
    const { left } = target.getBoundingClientRect();
    applyStyles(contacts, {
        width: '',
        top: '190px',
        left: `${left}px`,
        opacity: '1'
    });
    slideInContacts.innerHTML = generateContactDetailsHTML(contactList[index], index);
}, 350);
}


/**
 * Applies multiple CSS styles to a specified DOM element.
 * 
 * @param {HTMLElement} element - The DOM element to which styles will be applied.
 * @param {Object} styles - An object containing CSS property-value pairs to be applied to the element.
 */
function applyStyles(element, styles) {
Object.assign(element.style, styles);
}
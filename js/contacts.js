let contactList = [];
let contactId = 0;
let lastColor = null;
let globalContactIndex = 0;
let lastIndex = null;

const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';
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
 * Groups contacts by their initial letter and returns an object where keys represent letters
 * and values are arrays containing contacts whose names start with the corresponding letter.
 *
 * @param {Array<Object>} List - An array of contact objects.
 * @returns {Object} - An object containing groups of contacts where keys represent letters and values are arrays of contact objects.
 */
function groupContactsByLetter(List) {
    let groups = {};
    for (let contact of List) {
        if (!contact['InitialLetter'] || !contact['Initials'] || !contact['Name'] || !contact['Email'] || !contact['Color']) {
            continue;
        }

        let initialLetter = contact['InitialLetter'].toUpperCase(); 
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
 * Initializes and displays the edit contact modal for a specific contact. The function loads the edit contact form with pre-filled data,
 * sets up form submission handling to update or validate the contact information, and shows the contact in an edit box.
 * If the form is not valid upon submission, an alert prompts the user to fill in all required fields.
 * @param {number} i - The index of the contact in the contact list array to be edited.
 */
function editContacts(i) {
    let editContactModal = document.getElementById(`editContactsOnclick`);
    let contactLists = contactList;
    editContactModal.innerHTML = generateEditContactForm(contactLists[i], i);
    document.getElementById('editContactForm').addEventListener('submit', function(event) {
        if (event.target.checkValidity()) {
            event.preventDefault();
            updateContact(i);
            deleteContacts(i);
        } else {
            event.preventDefault();
            alert('Please fill in all required fields.');
        }
    });
    showEditContactBox(contactLists[i])
}

/**
 * Displays and animates the edit contact box with pre-filled contact details. The function adjusts animations and visuals
 * based on the screen width. It sets up the edit contact box with sliding animations for either mobile or desktop viewports,
 * fills in the contact's existing details into form fields, and updates the edit icon accordingly.
 * 
 * @param {Object} contact - An object containing the contact's details (`Name`, `Email`, `Number`) to be edited.
 */
function showEditContactBox(contact) {
    let addContactContainer = document.getElementById("letEditContactSlideIn");
    if (window.innerWidth < 1320) {
    addContactContainer.classList.remove("show-slide-out-bottom");
    addContactContainer.classList.add("show-slide-in-bottom"); 
} else {
    addContactContainer.classList.remove("show-slide-out-Desktop");
    addContactContainer.classList.add("show-slide-in-Desktop"); 
}
    document.getElementById(`placeholderName`).value = contact[`Name`];
    document.getElementById(`placeholderEmail`).value = contact[`Email`];
    document.getElementById(`placeholderNumber`).value = contact[`Number`];

    if (window.innerWidth < 1320) {
        document.getElementById(`editContactImgMobile`).src = `assets/img/editContactMobile.png`;
        document.getElementById(`overlayOnMobileEditContacts`).style.display = "flex";
    } else {
        document.getElementById(`editContactImgMobile`).src = `assets/img/editContact.png`;
        setTimeout(() => {
            document.getElementById(`overlayOnMobileEditContacts`).style.display = "flex";
        }, 200);
    }
}

/**
 * Generates an HTML form for editing contact details. The form includes input fields for name, email, and phone number,
 * along with icons and buttons for submitting changes, deleting the contact, or closing the form.
 * Contact details such as initials and color are used to personalize the form display.
 * 
 * @param {Object} contact - The contact object containing data like color and initials to be displayed.
 * @param {number} index - The index of the contact in the contact list, used for identifying which contact is being edited or deleted.
 * @returns {string} HTML string representing the edit contact form.
 */
function generateEditContactForm(contact, index) {
    return `
    <form id="editContactForm">
        <div id="letEditContactSlideIn" class="centerAll-edit">
            <div class="leftrightContainer-edit">
            <img class="exitAddContactMobile" onclick="closeEditWindow()" src="assets/img/CloseWhite.png">
              <div class="addContactImg-edit">
                <img id="editContactImgMobile" src="assets/img/editContact.png" />
              </div>
              <div class="addContactInputFields-edit">
                <div class="imgAndInputfields-edit">
                  <span class="initials-circle-edit-contacts" style="background-color: ${contact['Color']};">${contact['Initials']}</span>
                  <div class="rightContainer-edit">
                    <div class="inPutfields-edit">
                      <div class="closeButton-edit">
                        <img class="cursorPointer" onclick="closeEditWindow()" src="assets/img/close.png" />
                      </div>
                      <div class="inputs-edit">
                        <div class="Name-edit">
                          <input required id="placeholderName" class="inputfieldAddContact-edit" type="text" placeholder="Name"/>
                          <img src="assets/img/person.png" class="inputfield-icon-edit width22" />
                        </div>
                        <div class="Name-edit">
                          <input required id="placeholderEmail" class="inputfieldAddContact-edit" type="email" placeholder="Email"/>
                          <img src="assets/img/mail.png" class="inputfield-icon-edit width22" />
                        </div>
                        <div class="Name-edit">
                          <input required id="placeholderNumber" class="inputfieldAddContact-edit" type="number" placeholder="Phone"/>
                          <img src="assets/img/call.png" class="inputfield-icon-edit" />
                        </div>
                      </div>
                      <div class="cancelOrCreateContact-edit">
                        <button type="button" class="cancelButton-edit cursorPointer" onclick="deleteContactsCloseWindow(${index})">Delete</button>
                        <button type="submit" class="saveButton-edit cursorPointer">
                          Save<img class="checkCreateAccountButton-edit" src="assets/img/check.png"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </form>`;
}

/**
 * Asynchronously clears the contact information at a specified index in the contact list and updates persistent storage.
 * It checks if the index is valid before proceeding. After updating the data, it closes the edit window,
 * refreshes the contact display, and clears the inner HTML of a specific element.
 * If the index is invalid, logs an error message to the console.
 * 
 * @param {number} index - The index of the contact in the list to be deleted.
 */
async function deleteContactsCloseWindow(index) {
    if (index >= 0 && index < contactList.length) {
        contactList[index][`Name`] = ``;
        contactList[index][`Email`] = ``;
        contactList[index][`Number`] = ``;
        await setItem('users', JSON.stringify(contactList));
    } else {
        console.error('Invalid Index');
    }
    closeEditWindow();
    updateContactDisplay();
    document.getElementById(`showInnerHTML`).innerHTML = ``;
}

/**
 * Calls a function to update and display the contact list. This function acts as a 
 * wrapper or shortcut to initiate the display update,
 * making it easier to handle updates from various points within the application.
 */
function updateContactDisplay() {
    showContactlist(); 
}

/**
 * Closes the edit contact window with a sliding animation and hides the overlay. The function adjusts its behavior based on the screen width.
 * If the screen width is less than 1320 pixels, it applies bottom sliding animations. Otherwise, 
 * it applies desktop-specific animations.
 * Additionally, it ensures the image for mobile edits is set to a default image when the window width is 1320 pixels or more.
 * The function also sets a timeout to completely hide the edit contact container after the animation, ensuring a smooth transition.
 */
function closeEditWindow() {
    let addContactContainer = document.getElementById("letEditContactSlideIn");
    if (window.innerWidth < 1320) {
        addContactContainer.classList.remove("show-slide-in-bottom");
        addContactContainer.classList.add("show-slide-out-bottom");
        document.getElementById(`overlayOnMobileEditContacts`).style.display = "none";
        setTimeout(() => {
        document.getElementById(`letEditContactSlideIn`).style.display = "none";
    }, 500);
    } else {
        document.getElementById(`editContactImgMobile`).src = `assets/img/editContact.png`;
        addContactContainer.classList.remove("show-slide-in-Desktop");
        addContactContainer.classList.add("show-slide-out-Desktop");
        document.getElementById(`overlayOnMobileEditContacts`).style.display = "none";
        setTimeout(() => {
            document.getElementById(`letEditContactSlideIn`).style.display = "none";
    }, 500);
    }
}

/**
 * Executes two actions: closing the edit window and deleting a specific contact.
 * This function is typically called when a user confirms the deletion of a contact from a UI element.
 * 
 * @param {number} i - The index of the contact to be deleted from the contacts list.
 */
function deleteContactsCloseWindow(i) {
    closeEditWindow();
    deleteContacts(i);
}

/**
 * Sets up an event listener that triggers when the DOM content has fully loaded. It then attaches another 
 * click event listener to the 'addNewContactToPhoneList' button.
 * Upon clicking, this function removes a class indicating a slide-out animation and adds a class for 
 * a slide-in animation to the 'letAddContactSlideIn' element, initiating the display of contact addition UI.
 * A timeout is set to change the display style of 'overlayOnMobileEditContacts' to 'flex' after 200 milliseconds, 
 * ensuring the overlay appears smoothly.
 * The display style of 'letAddContactSlideIn' is also set to 'flex' to make it visible immediately.
 * Additionally, it updates the source of an image (assumed to be related to the contact addition interface) to a specific asset.
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
 * Attaches a click event listener to the element with the ID 'closeButton'.
 * This event listener executes a function that manages the closure animation of a contact addition container.
 * The function removes the class that triggers the slide-in effect and adds a class for the slide-out effect on the 'letAddContactSlideIn' element.
 * Additionally, it hides the 'overlayOnMobileEditContacts' by setting its display style to 'none', effectively removing the overlay
 *  visibility.
 */
document.getElementById('closeButton').addEventListener('click', function() {
    let addContactContainer = document.getElementById("letAddContactSlideIn");
    addContactContainer.classList.remove("show-slide-in-Desktop");
    addContactContainer.classList.add("show-slide-out-Desktop");
    document.getElementById(`overlayOnMobileEditContacts`).style.display = "none";
});

/**
 * Attaches a click event listener to the element with the ID 'cancelAccountSubmit'.
 * Upon clicking, it executes a function that controls the visibility of the 'letAddContactSlideIn' container.
 * The function removes the class that triggers a slide-in animation and adds a class for a slide-out animation.
 * Additionally, it hides the overlay for mobile edits by setting its display style to 'none'.
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
 * If the window width is less than 1320 pixels, it sets specific containers' display styles and updates the inner HTML directly.
 * For window widths of 1320 pixels or more, it prepares and triggers a sliding animation.
 * This function checks if essential elements are present and exits if any are missing.
 * 
 * @param {number} index - The index of the contact whose details are to be displayed.
 */
function showContactsSlideInRightContainer(index) {
const contacts = document.getElementById('showContactDetailsOnSlide');
const target = document.getElementById('targetArea');
const slideInContacts = document.getElementById('showInnerHTML');

if (window.innerWidth < 1320) {
    console.log("Die Fensterbreite ist unter 1320px.");

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


/**
 * Display the contacts that should be shown.
 * 
 * @param {string} contact - contact array
 * @param {number} index - number of clicked contact
 * @returns - returns the html code for clicked contact
 */
function generateContactDetailsHTML(contact, index) {
const { Color, Initials, Name, Email, Number } = contact;
return `
    <div class="showContactsDetails" id="slideShowContacts" style="overflow: hidden;">
        <div id="showContactMobile" class="showContacts">
            <div class="align-items-contacts-slide-in">    
                <span class="initials-circle-show-contacts" style="background-color:${Color};">${Initials}</span>
                <div class="showContactsNameEditDelete">
                    <h1 style="font-size: 47px;">${Name}</h1>
                    <div id="editDeleteContactsMobile" class="editDeleteContacts">
                        <div onclick="editContacts(${index})" class="editShowContacts cursorPointer">
                            <img class="contacts-icon-edit-showContacts" src="assets/img/edit.png">
                            <p>Edit</p>
                        </div>
                        <div onclick="deleteContacts(${index})" class="deleteShowContacts cursorPointer">
                            <img class="contacts-icon-delete-showContacts" src="assets/img/delete.png">
                            <p>Delete</p>
                        </div>
                    </div>
                </div>
            </div>    
            <p class="font-size-20">Contact Information</p>
            <div class="emailPhone">
                <h4>Email</h4>
                <a href="https://gmail.com" class="lightblue decorationNone">${Email}</a>
                <h4>Phone</h4>
                <p class="font-size-15 cursorPointer">+${Number}</p>
            </div>
        </div>
    `;
}

/**
 * Sets up event listeners after the DOM is fully loaded. Specifically, it prevents the default form submission of 'contactForm', 
 * handles data validation and submission, and updates the UI accordingly. If valid data is provided, a new contact is added, 
 * and various UI elements are updated to reflect the addition, including animations and visibility changes.
 */
document.addEventListener('DOMContentLoaded', function() {
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var number = document.getElementById('newContactNumber').value;
    var email = document.getElementById('newContactEmail').value;
    var name = document.getElementById('newContactName').value;
    if (!number && !email && !name) {
    } else {
        addNewContact();
    }
    let lastIndex = contactList.length - 1;
    toggleContactAdded();
    showContactsSlideInRightContainer(lastIndex);
    addContactWindowClose();
    document.getElementById(`overlayOnMobileAddContacts`).style.display = "none"
});
});

/**
 * Closes the add contact window with animation effects.
 * For screens wider than or equal to 1320 pixels, it triggers horizontal slide-out animations.
 * For narrower screens, it triggers a bottom slide-out animation and then hides the element after a 500ms delay.
 */
function addContactWindowClose() {
    let addContactContainer = document.getElementById("letAddContactSlideIn");

    if (window.innerWidth >= 1320) {
    addContactContainer.classList.remove("show-slide-in-Desktop");
    addContactContainer.classList.add("show-slide-out-Desktop");
    document.getElementById(`overlayOnMobileEditContacts`).style.display = "none";
    } else {
        addContactContainer.classList.remove("show-slide-in-bottom");
        addContactContainer.classList.add("show-slide-out-bottom");
    setTimeout(() => {
        document.getElementById(`letAddContactSlideIn`).style.display = "none";
    }, 500);
    }
}

/**
 * Read values of the input and pass them to addKontakt.
 * 
 */
function addNewContact() {
const name = document.getElementById('newContactName').value.trim();
const email = document.getElementById('newContactEmail').value.trim();
const number = document.getElementById('newContactNumber').value.trim();

if (name) {
    addContact(name, email, number);
    document.getElementById('newContactName').value = '';
    document.getElementById('newContactEmail').value = '';
    document.getElementById('newContactNumber').value = '';
} else {
    alert('Please enter a name!');
}
}

/**
 * Add contact to the array, call the initials function.
 * 
 * @param {string} name - name from inputfield
 * @param {string} email - email from inputfield
 * @param {number} number - telefonenumber from inputfield
 * @param {number} targetElement - this is the targetted Element, set from null to this
 */

function addContact(name, email, number, targetElement = null) {
const initialLetter = name.charAt(0).toUpperCase();
const initials = getInitials(name);
setItemLocalStorage(contactId, name, email, number, initials, initialLetter);
contactId++;
if (targetElement) {
    targetElement.remove();
}
hideEmptySections();
showContactlist();
}


/**
 * Hide sections that have no content.
 * 
 */
function hideEmptySections() {
const sections = document.querySelectorAll('#phonebook > div');
sections.forEach(section => {
    if (section.querySelector('ul').children.length === 0) {
        section.style.display = 'none';
    } else {
        section.style.display = '';
    }
});
}

/**
 * Get initials for the circle.
 * 
 * @param {string} name - Name from the inputfield
 * 
 * 
 * @returns - returns the Initials from the Name
 */

function getInitials(name) {
const nameParts = name.split(' ');
if (nameParts.length > 1) {
    return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
} else {
    return nameParts[0][0].toUpperCase();
}
}

/**
 * Animate that a contact was successfully added, hide the contact's image
 * display "added successfully" at that location.
 * 
 */
function toggleContactAdded() {
const contactAdded = document.getElementById('contactAddedSuccesfullyId');
const betterWaT = document.getElementById('BetterWaTId');
betterWaT.classList.remove('show');
setTimeout(() => {
    betterWaT.style.display = 'none';
    contactAdded.style.display = 'flex';
    setTimeout(() => contactAdded.classList.add('show'), 10); 
    setTimeout(() => {
        contactAdded.classList.remove('show');
        setTimeout(() => {
            contactAdded.style.display = 'none';
            betterWaT.style.display = 'flex';
            setTimeout(() => betterWaT.classList.add('show'), 10);
        }, 500); 
    }, 2000);
}, 500);
}
document.addEventListener('DOMContentLoaded', function() {
});


/**
 * Create new contacts using the addKontakt function.
 * 
 * @param {number} index - index of the current Contact which should get updated
 */
function updateContact(index) {
    const name = document.getElementById('placeholderName').value.trim();
    const email = document.getElementById('placeholderEmail').value.trim();
    const number = document.getElementById('placeholderNumber').value.trim();

    if (name) {
        addContact(name, email, number);
        document.getElementById('newContactName').value = '';
        document.getElementById('newContactEmail').value = '';
        document.getElementById('newContactNumber').value = '';
    } else {
        alert('Please enter a name!');
    }
    document.getElementById('showInnerHTML').innerHTML = '';
    closeEditWindow();
    refreshContacts(index);
}


/**
 * Delete the contact in the array, slide in a new contact, update the phone list.
 * 
 * @param {number} index - index of the current Contact which should get updated
 */

async function refreshContacts(index) {
    if (index >= 0 && index < contactList.length) {
        contactList[index]['Name'] = '';
        contactList[index]['Email'] = '';
        contactList[index]['Number'] = '';
        await setItem('users', JSON.stringify(contactList));
    } else {
        console.error('Invalid Index');
    }
    let lastIndex = contactList.length - 1;
    showContactsSlideInRightContainer(lastIndex);
    updateContactDisplay();
}

/**
 * Delete the contact in the array, clear the inner.HTML where the contact was displayed.
 * 
 * @param {number} index -index of the current Contact which should get deleted
 */
async function deleteContacts(index) {
    if (index >= 0 && index < contactList.length) {
        contactList[index]['Name'] = '';
        contactList[index]['Email'] = '';
        contactList[index]['Number'] = '';
        await setItem('users', JSON.stringify(contactList));
    } else {
        console.error('Invalid Index');
    }
    updateContactDisplay();
    if (window.innerWidth < 1320) {
        showContactListMobile();
        }
    document.getElementById('showInnerHTML').innerHTML = '';
}



//Mobile Javascript


/**
 * Shows the Contactlist and hides the overlay and right Container
 * 
 */
function showContactListMobile() {
        document.getElementById(`rightContainerContacts`).style.display = "none";
        document.getElementById(`leftContainerContacts`).style.display = "flex";
        document.getElementById(`overlayOnMobileAddContacts`).style.display = "none"
}


/**
 * Display addContact in the mobile version.
 * 
 */
function showMobileAddContact() {
    document.getElementById(`addContactImgChange`).src = `assets/img/MobileAddContact.png`;
    document.getElementById(`letAddContactSlideIn`).style.display = "flex";
    document.getElementById(`overlayOnMobileAddContacts`).style.display = "flex";

    let addContactContainer = document.getElementById("letAddContactSlideIn");
        addContactContainer.classList.remove("show-slide-out-bottom");
        addContactContainer.classList.add("show-slide-in-bottom"); 
} 


/**
 * Close addContact in the mobile version.
 * 
 */
function closeAddContactMobile() {
    document.getElementById(`overlayOnMobileAddContacts`).style.display = "none";
    let addContactContainer = document.getElementById("letAddContactSlideIn");
        addContactContainer.classList.remove("show-slide-in-bottom");
        addContactContainer.classList.add("show-slide-out-bottom");
    setTimeout(() => {
        document.getElementById(`letAddContactSlideIn`).style.display = "none";
    }, 500);
}


/**
 * Display the contact list again after visiting contact details.
 * 
 */
function showContactListMobile() {
    document.getElementById("leftContainerContacts").style.display = "flex";
    document.getElementById(`leftContainerContacts`).classList.remove(`dontDisplayOnMobile`)
    document.getElementById("rightContainerContacts").style.display = "none";
    document.getElementById(`menuOptionsContactMobile`).style.display = "flex";
    document.getElementById(`editDeleteContactsMobile`).style.display = "none";
    document.getElementById(`overlayOnMobile`).style.display = "none";
}


/**
 * Event listener that monitors changes to the window width.
 * 
 */
window.addEventListener("resize", displayLeftAndRightContainer);
  
/**
 * If the window width is greater than 1320px, display the containers, otherwise only display the left container.
 * 
 */
function displayLeftAndRightContainer() {
    if (window.innerWidth >= 1320) {
        document.getElementById("rightContainerContacts").style.display = "flex";
        document.getElementById("leftContainerContacts").style.display = "flex";
        document.getElementById(`leftContainerContacts`).classList.remove(`dontDisplayOnMobile`);
        window.location.reload();
    } else {
        document.getElementById("rightContainerContacts").style.display = "none";
        document.getElementById("leftContainerContacts").style.display = "flex";
        document.getElementById(`letAddContactSlideIn`).style.display = "none";
        document.getElementById(`overlayOnMobileAddContacts`).style.display = "none";
    }
}

/**
 * Display the edit and delete buttons.
 * 
 */
function showEditDeleteMobileOnSlide() {
    document.getElementById(`menuOptionsContactMobile`).style.display = "none";
    document.getElementById(`editDeleteContactsMobile`).style.display = "flex";
    document.getElementById(`overlayOnMobile`).style.display = "flex"
    let editDeleteEdit = document.getElementById("editDeleteContactsMobile");
    editDeleteEdit.classList.remove("show-slide-out");
    editDeleteEdit.classList.add("show-slide-in");
}

/**
 * Close the overlay by pressing to hide the edit and delete buttons again.
 * 
 */
function closeDeleteAndEdit() {
    setTimeout(() => {
        document.getElementById(`menuOptionsContactMobile`).style.display = "flex";
    }, 500);
    document.getElementById(`overlayOnMobile`).style.display = "none"
    let editDeleteEdit = document.getElementById("editDeleteContactsMobile");
    editDeleteEdit.classList.remove("show-slide-in");
    editDeleteEdit.classList.add("show-slide-out");
}
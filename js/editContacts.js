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
    toggleContactDeleted(); 
    document.getElementById(`showInnerHTML`).innerHTML = ``;
}

/**
 * Toggles the display of the "Contact Deleted Successfully" message and another element with animation.
 * 
 * This function hides the element with ID 'BetterWaTId', then shows the element with ID 'contactDeletedSuccesfullyId'
 * for a brief period, before hiding it again and showing the 'BetterWaTId' element once more. Each transition
 * includes a fade-in and fade-out effect.
 *
 * @function toggleContactDeleted
 * @returns {void}
 */
function toggleContactDeleted() {
    let contactAdded = document.getElementById('contactDeletedSuccesfullyId');
    let betterWaT = document.getElementById('BetterWaTId');
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
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
    let contactAdded = document.getElementById('contactAddedSuccesfullyId');
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
        toggleContactDeleted();
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
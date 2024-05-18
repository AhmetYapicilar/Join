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
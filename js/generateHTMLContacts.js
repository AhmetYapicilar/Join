/**
 * Display the contacts that should be shown.
 * 
 * @param {Object} contact - The contact object containing details like Color, Initials, Name, Email, and Number.
 * @param {number} index - The index of the clicked contact.
 * @returns {string} - The HTML code for the clicked contact.
 * 
 * @description This function generates HTML code for displaying contact details. 
 * If a phone number is provided in the contact object,
 * it is displayed; otherwise, the phone number section is omitted from the generated HTML.
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
                    ${Number ? `<p class="font-size-15 cursorPointer">+${Number}</p>` : ''}
                </div>
            </div>
        `;
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
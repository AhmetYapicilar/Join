let contactList = [];
let contactId = 0;
let lastColor = null;
let globalContactIndex = 0;
let lastIndex = null;

const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

//speichern und abrufen der Daten für die Telefonliste
function init() {
    loadUsers();
}

//Kontakte aus dem Array laden und anzeigen lassen
async function loadUsers(){
    try {
        contactList = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
    showContactlist();
}

//Array im backend speichern
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}

//Array vom backend laden
async function getItem(key) {
    const URL = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(URL).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

//Dateien von addKontakt im backend speichern lassen mit bestimmten keys, function ausführen die eine zufällige
//Farbe generiert und abspeichert
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

//Eine zufällige Farbe für den Hintergund im Kreis generieren lassen
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

//Ruft die Funktion zum gruppieren der Kontakte auf, zeigt Telefonbuch an
function showContactlist() {
    const List = contactList;
    const phonebook = document.getElementById('phonebook');
    const groups = groupContactsByLetter(List);

    phonebook.innerHTML = '';

    createGroupedDisplay(groups, phonebook);
}

//Gruppiert die Kontakte, filtert Kontakte raus, die benötigte Informationen vermissen
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

//Nimmt die gruppierten Kontakte und fügt sie dem 
//Telefonbuch-Element hinzu, indem es für jeden Buchstaben einen eigenen Display-Block erstellt.
function createGroupedDisplay(groups, phonebook) {
    let sortedLetters = Object.keys(groups).sort();

    for (let letter of sortedLetters) {
        let groupDiv = createLetterGroup(letter, groups[letter]);
        phonebook.appendChild(groupDiv);
    }
}

//Erstellt einen Block für eine Gruppe von Kontakten, die demselben Anfangsbuchstaben zugeordnet sind. 
//Generiert den HTML-Code für den Buchstabenkopf, das Buchstabenbild und die Liste der Kontakte.
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

//Erstellt eine HTML-Liste (ul) für eine Gruppe von Kontakten. 
//Jeder Kontakt wird als Listeneintrag (li) dargestellt, mit Klick-Event, das eine Detailanzeige auslöst.
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

//Öffnen und anzeigen des edit Feldes
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

//Inhalt der inputbox ändern zum Array wert
function showEditContactBox(contact) {
    document.getElementById(`placeholderName`).value = contact[`Name`];
    document.getElementById(`placeholderEmail`).value = contact[`Email`];
    document.getElementById(`placeholderNumber`).value = contact[`Number`];
    document.getElementById('modal-edit').classList.remove('notactive');
    document.getElementById('panel-edit').classList.remove('notactive');
    document.getElementById('modal-edit').classList.add('active');
    document.getElementById('panel-edit').classList.add('active');
}

//Generiert das geöffnete Edit Contact Feld
function generateEditContactForm(contact, index) {
    return `
    <form id="editContactForm">
      <div class="container" id="modal-edit">
        <div class="panel" id="panel-edit">
          <div class="centerAll-edit">
            <div class="leftrightContainer-edit">
              <div class="addContactImg-edit">
                <img src="assets/img/editContact.png" />
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
        </div>
      </div>
    </form>`;
}

//Contacts im Array löschen und Telefonliste aktualisieren
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

//Anzeigen und aktualieseren der Telefonliste
function updateContactDisplay() {
    showContactlist(); 
}

//Edit Feld schließen
function closeEditWindow() {
    document.getElementById('modal-edit').classList.remove('active');
    document.getElementById('panel-edit').classList.remove('active');
    document.getElementById('modal-edit').classList.add('notactive');
    document.getElementById('panel-edit').classList.add('notactive');
}

//Edit Feld schließen und deleteContacts ausführen
function deleteContactsCloseWindow(i) {
    document.getElementById('modal-edit').classList.remove('active');
    document.getElementById('panel-edit').classList.remove('active');
    document.getElementById('modal-edit').classList.add('notactive');
    document.getElementById('panel-edit').classList.add('notactive');
    deleteContacts(i);
}

//addNewContact Feld anzeigen lassen mit eventListener
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addNewContactToPhoneList').addEventListener('click', function() {
      document.getElementById('modal').classList.remove('notactive');
      document.getElementById('panel').classList.remove('notactive');
      document.getElementById('modal').classList.add('active');
      document.getElementById('panel').classList.add('active');
      document.getElementById(`addContactImgChange`).src = `assets/img/Frame 194.png`;
    });


//addNewContact Feld schließen lassen mit eventListener
document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal').classList.add('notactive');
    document.getElementById('panel').classList.add('notactive');
    setTimeout(() => {
        document.getElementById('panel').style.right = "-50%"; 
    }, 500);
});

//addNewContact Feld anzeigen lassen mit eventListener
document.getElementById('cancelAccountSubmit').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal').classList.add('notactive');
    document.getElementById('panel').classList.add('notactive');
    setTimeout(() => {
        document.getElementById('panel').style.right = "-50%"; 
    }, 500);
});
});

//Contacts slide in von rechts
function showContactsSlideInRightContainer(index) {
const contacts = document.getElementById('showContactDetailsOnSlide');
const target = document.getElementById('targetArea');
const slideInContacts = document.getElementById('showInnerHTML');

if (!contacts || !target || !slideInContacts) {
    return;
}
lastLiGetsNewClass(index);
prepareAnimation(contacts);
slideInContacts.innerHTML = '';
triggerSlideInAnimation(target, contacts, slideInContacts, index);
}

//angeklickte LI kriegt neue Css class und altem Li wird diese entfernt
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

//auf anfangswert setzen
function prepareAnimation(contacts) {
applyStyles(contacts, {
    width: '0px',
    opacity: '0',
    left: '5000px'
});
}

//neue style Werte definieren
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

//Style werte hinzufügen
function applyStyles(element, styles) {
Object.assign(element.style, styles);
}

//Den Kontakt darstellen, die angezeigt werden sollen
function generateContactDetailsHTML(contact, index) {
const { Color, Initials, Name, Email, Number } = contact;
return `
    <div class="showContactsDetails" id="slideShowContacts" style="overflow: hidden;">
        <div class="showContacts">
            <div class="align-items-contacts-slide-in">    
                <span class="initials-circle-show-contacts" style="background-color:${Color};">${Initials}</span>
                <div class="showContactsNameEditDelete">
                    <h1 style="font-size: 47px;">${Name}</h1>
                    <div class="editDeleteContacts">
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

//Neuen Kontakt hinzufügen
document.addEventListener('DOMContentLoaded', function() {
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var number = document.getElementById('newContactNumber').value;
    var email = document.getElementById('newContactEmail').value;
    var name = document.getElementById('newContactName').value;
    if (!number && !email && !name) {
    } else {
        addNewContact();
        document.getElementById('modal').classList.remove('active');
        document.getElementById('modal').classList.add('notactive');
        document.getElementById('panel').classList.add('notactive');
        setTimeout(() => {
            document.getElementById('panel').style.right = "-50%"; 
        }, 500);
    }
    let lastIndex = contactList.length - 1;
    toggleContactAdded();
    showContactsSlideInRightContainer(lastIndex);
});
});

//Werte des inputs lesen und weitergeben an addKontakt
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

//Kontakt zum Array hinzufügen, Initialen function aufrufen
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

//Verstecke abschnitte, die keinen Inhalt haben
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

//Initialen für den Kreis bekommen
function getInitials(name) {
const nameParts = name.split(' ');
if (nameParts.length > 1) {
    return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
} else {
    return nameParts[0][0].toUpperCase();
}
}

//Animation dass ein Contact erfolgreich hinzugefügt wurde, Contacts Bild ausblenden 
//an der stelle added succesfully anzeigen
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


//Neue Contacts erstellen, mit addKontakt function
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

//löschen des Contacts im Array, neuen Kontakt reinsliden lassen, telefonliste aktualisieren
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

//Löschen des Contacts im Array, leeren von inner.HTML in dem der Contact angezeigt wurde
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
    document.getElementById('showInnerHTML').innerHTML = '';
}

  
//Mobile Javascript

function showMobileAddContact() {
    document.getElementById('modal').classList.remove('notactive');
    document.getElementById('panel').classList.remove('notactive');
    document.getElementById('modal').classList.add('active');
    document.getElementById('panel').classList.add('active');

    document.getElementById(`addContactImgChange`).src = `assets/img/MobileAddContact.png`;
}

function closeAddContactMobile() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal').classList.add('notactive');
    document.getElementById('panel').classList.add('notactive');
    setTimeout(() => {
        document.getElementById('panel').style.right = "-50%"; 
    }, 500);
}

function showContactListMobile() {
    document.getElementById(`rightContainerContacts`).classList.add(`dontDisplayOnMobile`)
    document.getElementById(`leftContainerContacts`).classList.add(`displayOnMobile`)
}
  
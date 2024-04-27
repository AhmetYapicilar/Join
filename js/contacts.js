let kontaktListe = [];
let kontaktId = 0;
let letzteFarbe = null;


const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


//speichern und abrufen der Daten für die Telefonliste
function init() {
    loadUsers();
}


//Kontakte aus dem Array laden und anzeigen lassen
//7
async function loadUsers(){
    try{
    kontaktListe = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
    showContactlist();
}


//Array im backend speichern
//4
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}


//Array vom backend laden
//7
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
//13
async function setItemLocalStorage(kontaktId, name, email, nummer, initialen, anfangsbuchstabe) {
    const farbe = zufaelligeFarbe();
    kontaktListe.push({
        id: kontaktId,
        Name: name,
        Email: email,
        Number: nummer,
        Initialen: initialen,
        Anfangsbuchstabe: anfangsbuchstabe,
        Farbe: farbe 
    });
    await setItem('users', JSON.stringify(kontaktListe));
}


//Eine zufällige Farbe für den Hintergund im Kreis generieren lassen
//10
function zufaelligeFarbe() {
    const farben = ['#FFA500', '#90EE90', '#FF4500', '#FFD700', '#FF8C00', '#ADD8E6', '#FF6347', '#FFC0CB', '#00FF00', '#00BFFF', '#9370DB', '#FF69B4', '#FFA07A', '#BA55D3', '#7FFFD4']; 
    if (farben.length === 1) return farben[0]; 
    let zufallsIndex;
    do {
        zufallsIndex = Math.floor(Math.random() * farben.length);
    } while (farben[zufallsIndex] === letzteFarbe); 

    letzteFarbe = farben[zufallsIndex];
    return farben[zufallsIndex];
}


//Ruft die Funktion zum gruppieren der Kontakte auf, zeigt Telefonbuch an
//7
function showContactlist() {
    const List = kontaktListe;
    const telefonbook = document.getElementById('telefonliste');
    const gruppen = groupContactsByLetter(List);

    telefonbook.innerHTML = '';

    createGroupedDisplay(gruppen, telefonbook);
}


//Gruppiert die Kontakte, filtert Kontakte raus, die benötigte Informationen vermissen
//13
function groupContactsByLetter(List) {
    let gruppen = {};
    for (let kontakt of List) {
        if (!kontakt['Anfangsbuchstabe'] || !kontakt['Initialen'] || !kontakt['Name'] || !kontakt['Email'] || !kontakt['Farbe']) {
            continue;
        }

        let anfangsbuchstabe = kontakt['Anfangsbuchstabe'].toUpperCase(); 
        if (!gruppen[anfangsbuchstabe]) {
            gruppen[anfangsbuchstabe] = [];
        }
        gruppen[anfangsbuchstabe].push(kontakt);
    }
    return gruppen;
}


//Nimmt die gruppierten Kontakte und fügt sie dem 
//Telefonbuch-Element hinzu, indem es für jeden Buchstaben einen eigenen Display-Block erstellt.
//6
function createGroupedDisplay(gruppen, telefonbook) {
    let sortedLetters = Object.keys(gruppen).sort();

    for (let letter of sortedLetters) {
        let groupDiv = createLetterGroup(letter, gruppen[letter]);
        telefonbook.appendChild(groupDiv);
    }
}


//Erstellt einen Block für eine Gruppe von Kontakten, die demselben Anfangsbuchstaben zugeordnet sind. 
//Generiert den HTML-Code für den Buchstabenkopf, das Buchstabenbild und die Liste der Kontakte.
//13
function createLetterGroup(letter, contacts) {
    let gruppenDiv = document.createElement('div');
    let buchstabeHeader = document.createElement('h2');
    buchstabeHeader.textContent = letter;
    gruppenDiv.appendChild(buchstabeHeader);
    
    let buchstabeImg = document.createElement('img');
    buchstabeImg.src = 'assets/img/Vector10.png';
    buchstabeImg.className = 'display-flex centerVectorPhoneBook';
    gruppenDiv.appendChild(buchstabeImg);

    let kontaktListeUl = createContactsList(contacts);
    gruppenDiv.appendChild(kontaktListeUl);
    return gruppenDiv;
}


//Erstellt eine HTML-Liste (ul) für eine Gruppe von Kontakten. 
//Jeder Kontakt wird als Listeneintrag (li) dargestellt, mit Klick-Event, das eine Detailanzeige auslöst.
function createContactsList(contacts) {
    let kontaktListeUl = document.createElement('ul');
    for (let kontakt of contacts) {
        let kontaktLi = document.createElement('li');
        kontaktLi.onclick = function() { showContactsSlideInRightContainer(kontaktListe.indexOf(kontakt)); };
        kontaktLi.innerHTML = `
            <span class="initialen-kreis" style="background-color: ${kontakt['Farbe']};">${kontakt['Initialen']}</span>
            <div class="kontakt-info">
                <strong>${kontakt['Name']}</strong>
                <div class="showEmailLi">${kontakt['Email']}</div>
            </div>`;
        kontaktListeUl.appendChild(kontaktLi);
    }
    return kontaktListeUl;
}


//Öffnen und anzeigen des edit Feldes 
//15
function editContacts(i) {
    let editContactModal = document.getElementById(`editContactsOnclick`);
    let contactList  = kontaktListe;
    editContactModal.innerHTML = generateEditContactForm(contactList[i], i);
    document.getElementById('editContactForm').addEventListener('submit', function(event) {
      if (event.target.checkValidity()) {
        event.preventDefault(); 
        updateKontakt(i);
        deleteContacts(i);
      } else {
        event.preventDefault();
        alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      }
    });
    showEditContactBox(contactList[i])
  }


//Inhalt der inputbox ändern zum Array wert
//8
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
                  <span class="initialen-kreis-edit-contacts" style="background-color: ${contact['Farbe']};">${contact['Initialen']}</span>
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
//13
async function deleteContactsCloseWindow(index) {
    if (index >= 0 && index < kontaktListe.length) {
        kontaktListe[index][`Name`] = ``;
        kontaktListe[index][`Email`] = ``;
        kontaktListe[index][`Number`] = ``;
        await setItem('users', JSON.stringify(kontaktListe));
    } else {
        console.error('Ungültiger Index');
    }
    closeEditWindow();
    updateContactDisplay();
    document.getElementById(`showInnerHTML`).innerHTML = ``;
}


//Anzeigen und aktualieseren der Telefonliste
//2
function updateContactDisplay() {
    showContactlist(); 
}


//Edit Feld schließen
//5
function closeEditWindow() {
    document.getElementById('modal-edit').classList.remove('active');
    document.getElementById('panel-edit').classList.remove('active');
    document.getElementById('modal-edit').classList.add('notactive');
    document.getElementById('panel-edit').classList.add('notactive');
}


//Edit Feld schließen und deleteContacts ausführen
//5
function deleteContactsCloseWindow(i) {
    document.getElementById('modal-edit').classList.remove('active');
    document.getElementById('panel-edit').classList.remove('active');
    document.getElementById('modal-edit').classList.add('notactive');
    document.getElementById('panel-edit').classList.add('notactive');
    deleteContacts(i);
}


//addNewContact Feld anzeigen lassen mit eventListener
//7
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addNewContactToPhoneList').addEventListener('click', function() {
      document.getElementById('modal').classList.remove('notactive');
      document.getElementById('panel').classList.remove('notactive');
      document.getElementById('modal').classList.add('active');
      document.getElementById('panel').classList.add('active');
    });


//addNewContact Feld schließen lassen mit eventListener
//7
    document.getElementById('closeButton').addEventListener('click', function() {
      document.getElementById('modal').classList.remove('active');
      document.getElementById('modal').classList.add('notactive');
      document.getElementById('panel').classList.add('notactive');
      setTimeout(() => {
        document.getElementById('panel').style.right = "-50%"; 
      }, 500);
    });


//addNewContact Feld anzeigen lassen mit eventListener
//7
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
//11
function showContactsSlideInRightContainer(index) {
    const contacts = document.getElementById('showContactDetailsOnSlide');
    const ziel = document.getElementById('zielbereich');
    const slideInContacts = document.getElementById('showInnerHTML');

    if (!contacts || !ziel || !slideInContacts) {
        return;
    }
    prepareAnimation(contacts);
    slideInContacts.innerHTML = '';
    triggerSlideInAnimation(ziel, contacts, slideInContacts, index);
}


//auf anfangswert setzen
//6
function prepareAnimation(contacts) {
    applyStyles(contacts, {
        width: '0px',
        opacity: '0',
        left: '5000px'
    });
}


//neue style Werte definieren
//10
function triggerSlideInAnimation(ziel, contacts, slideInContacts, index) {
    setTimeout(() => {
        const { left } = ziel.getBoundingClientRect();
        applyStyles(contacts, {
            width: '',
            top: '190px',
            left: `${left}px`,
            opacity: '1'
        });
        slideInContacts.innerHTML = generateContactDetailsHTML(kontaktListe[index], index);
    }, 350);
}


//Style werte hinzufügen
//3
function applyStyles(element, styles) {
    Object.assign(element.style, styles);
}


//Den Kontakt darstellen, die angezeigt werden sollen
function generateContactDetailsHTML(contact, index) {
    const { Farbe, Initialen, Name, Email, Number } = contact;
    return `
        <div class="showContactsDetails" id="slideShowContacts" style="overflow: hidden;">
            <div class="showContacts">
                <div class="align-items-contacts-slide-in">    
                    <span class="initialen-kreis-show-contacts" style="background-color:${Farbe};">${Initialen}</span>
                    <div class="showContactsNameEditDelete">
                        <h1 style="font-size: 47px;">${Name}</h1>
                        <div class="editDelteContacts">
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
                    <a href="https://gmail.com" class="lightblue">${Email}</a>
                    <h4>Phone</h4>
                    <p class="font-size-15 cursorPointer">+${Number}</p>
                </div>
            </div>
        `;
}


//Neuen Kontakt hinzufügen
//20
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('kontaktForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var nummer = document.getElementById('neuerKontaktNummer').value;
        var email = document.getElementById('neuerKontaktEmail').value;
        var name = document.getElementById('neuerKontaktName').value;
        if (!nummer && !email && !name) {
        } else {
            neuenKontaktHinzufuegen();
            document.getElementById('modal').classList.remove('active');
            document.getElementById('modal').classList.add('notactive');
            document.getElementById('panel').classList.add('notactive');
            setTimeout(() => {
                document.getElementById('panel').style.right = "-50%"; 
            }, 500);
        }
        let letzterIndex = kontaktListe.length - 1;
        toggleContactAdded();
        showContactsSlideInRightContainer(letzterIndex);
    });
});


//Werte des inputs lesen und weitergeben an addKontakt
//10
function neuenKontaktHinzufuegen() {
    const name = document.getElementById('neuerKontaktName').value.trim();
    const email = document.getElementById('neuerKontaktEmail').value.trim();
    const nummer = document.getElementById('neuerKontaktNummer').value.trim();

    if (name) {
        addKontakt(name, email, nummer);
        document.getElementById('neuerKontaktName').value = '';
        document.getElementById('neuerKontaktEmail').value = '';
        document.getElementById('neuerKontaktNummer').value = '';
    } else {
        alert('Bitte einen Namen eingeben!');
    }
}


//Kontakt zum Array hinzufügen, Initialen function aufrufen
//10
function addKontakt(name, email, nummer, targetElement = null) {
    const anfangsbuchstabe = name.charAt(0).toUpperCase();
    const initialen = getInitialen(name);
    setItemLocalStorage(kontaktId, name, email, nummer, initialen, anfangsbuchstabe);
    kontaktId++;
    if (targetElement) {
        targetElement.remove();
    }
    versteckeLeereAbschnitte();
    showContactlist();
}


//Verstecke abschnitte, die keinen Inhalt haben
//9
function versteckeLeereAbschnitte() {
    const abschnitte = document.querySelectorAll('#telefonliste > div');
    abschnitte.forEach(abschnitt => {
        if (abschnitt.querySelector('ul').children.length === 0) {
            abschnitt.style.display = 'none';
        } else {
            abschnitt.style.display = '';
        }
    });
}


//Initialen für den Kreis bekommen
//7
function getInitialen(name) {
    const namensteile = name.split(' ');
    if (namensteile.length > 1) {
        return namensteile[0][0].toUpperCase() + namensteile[1][0].toUpperCase();
    } else {
        return namensteile[0][0].toUpperCase();
    }
}


//Animation dass ein Contact erfolgreich hinzugefügt wurde, Contacts Bild ausblenden 
//an der stelle added succesfully anzeigen 
//19
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
//15
function updateKontakt(index) {
    const Name =  document.getElementById(`placeholderName`).value.trim();
    const Email =  document.getElementById(`placeholderEmail`).value.trim();
    const Nummer = document.getElementById(`placeholderNumber`).value.trim();

    if (Name) {
        addKontakt(Name, Email, Nummer);
        document.getElementById('neuerKontaktName').value = '';
        document.getElementById('neuerKontaktEmail').value = '';
        document.getElementById('neuerKontaktNummer').value = '';
    } else {
        alert('Bitte einen Namen eingeben!');
    }
    document.getElementById(`showInnerHTML`).innerHTML = ``;
    closeEditWindow();
    updateContacts(index);
}


//löschen des Contacts im Array, neuen Kontakt reinsliden lassen, telefonliste aktualisieren
//13
async function updateContacts(index) {
    if (index >= 0 && index < kontaktListe.length) {
        kontaktListe[index][`Name`] = ``;
        kontaktListe[index][`Email`] = ``;
        kontaktListe[index][`Number`] = ``;
        await setItem('users', JSON.stringify(kontaktListe));
    } else {
        console.error('Ungültiger Index');
    }
    let letzterIndex = kontaktListe.length - 1;
    showContactsSlideInRightContainer(letzterIndex);
    updateContactDisplay();
}


//Löschen des Contacts im Array, leeren von inner.HTML in dem der Contact angezeigt wurde
//12
async function deleteContacts(index) {
    if (index >= 0 && index < kontaktListe.length) {
        kontaktListe[index][`Name`] = ``;
        kontaktListe[index][`Email`] = ``;
        kontaktListe[index][`Number`] = ``;
        await setItem('users', JSON.stringify(kontaktListe));
    } else {
        console.error('Ungültiger Index');
    }
    updateContactDisplay();
    document.getElementById(`showInnerHTML`).innerHTML = ``;
}
  
  
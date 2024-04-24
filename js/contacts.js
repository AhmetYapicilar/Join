function slideInContacts() {
    setTimeout(() => {
        const contacts = document.getElementById('showContactDetailsOnSlide');
        const ziel = document.getElementById('zielbereich');
        const zielRect = ziel.getBoundingClientRect();
        contacts.style.width = '500px'; 
        contacts.style.top = '190px';
        contacts.style.left = zielRect.left + 'px';
      }, 250); 
  }

  document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('openButton').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('notactive');
    document.getElementById('panel').classList.remove('notactive');
    document.getElementById('modal').classList.add('active');
    document.getElementById('panel').classList.add('active');
  });
  
  document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal').classList.add('notactive');
    document.getElementById('panel').classList.add('notactive');
    setTimeout(() => {
      document.getElementById('panel').style.right = "-50%"; 
    }, 500);
  });

  document.getElementById('cancelAccountSubmit').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal').classList.add('notactive');
    document.getElementById('panel').classList.add('notactive');
    setTimeout(() => {
      document.getElementById('panel').style.right = "-50%"; 
    }, 500);
  });

});  

//unnötige function löschen /////////  functions auf englisch machen

let kontaktListe = [];
let kontaktId = 0;

let letzteFarbe = null;



const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


//speichern und abrufen der Daten für die Telefonliste
function init() {
    loadUsers();
}


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(res => res.json());
}

async function getItem(key) {
    const URL = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(URL).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}


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






async function loadUsers(){
    try{
    kontaktListe = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }

    showSomething();
}

// Zeigt die kontakte aus dem localStorage an
function showSomething() {
    let List = kontaktListe;
    let telefonbook = document.getElementById('telefonliste');
    let gruppen = {};

    // Leere das Telefonbuch zu Beginn, um vorherige Einträge zu entfernen
    telefonbook.innerHTML = '';

    // Gruppieren der Kontakte nach Anfangsbuchstaben
    for (let kontakt of List) {
        if (!kontakt['Anfangsbuchstabe'] || !kontakt['Initialen'] || !kontakt['Name'] || !kontakt['Email'] || !kontakt['Farbe']) {
            continue; 
        }

        let anfangsbuchstabe = kontakt['Anfangsbuchstabe'].toUpperCase(); // Konvertiere zu Großbuchstaben, um Konsistenz zu gewährleisten
        if (!gruppen[anfangsbuchstabe]) {
            gruppen[anfangsbuchstabe] = [];
        }
        gruppen[anfangsbuchstabe].push(kontakt);
    }

    // Sortieren der Anfangsbuchstaben alphabetisch
    let sortierteBuchstaben = Object.keys(gruppen).sort();

    // Erstellen der gruppierten Anzeige in alphabetischer Reihenfolge
    for (let buchstabe of sortierteBuchstaben) {
        let gruppenDiv = document.createElement('div');
        let buchstabeHeader = document.createElement('h2');
        buchstabeHeader.textContent = buchstabe;
        gruppenDiv.appendChild(buchstabeHeader);
        
        let buchstabeImg = document.createElement('img');
        buchstabeImg.src = 'assets/img/Vector10.png';
        buchstabeImg.className = 'display-flex';
        gruppenDiv.appendChild(buchstabeImg);

        let kontaktListeUl = document.createElement('ul');
        for (let kontakt of gruppen[buchstabe]) {
            let kontaktLi = document.createElement('li');
            kontaktLi.onclick = function() { showContactsSlideInRightContainer(kontaktListe.indexOf(kontakt)); };
            kontaktLi.innerHTML = `
                <span class="initialen-kreis" style="background-color: ${kontakt[`Farbe`]};">${kontakt['Initialen']}</span>
                <div class="kontakt-info">
                    <strong>${kontakt['Name']}</strong>
                    <div class="showEmailLi">${kontakt['Email']}</div>
                </div>`;
            kontaktListeUl.appendChild(kontaktLi);
        }

        gruppenDiv.appendChild(kontaktListeUl);
        telefonbook.appendChild(gruppenDiv);
    }
}


function editContacts(i) {
    let editContact = document.getElementById(`editContactsOnclick`);
    let List = kontaktListe;
    let farbe = zufaelligeFarbe();
  
    editContact.innerHTML = `
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
                  <span class="initialen-kreis-edit-contacts" style="background-color: ${List[i][`Farbe`]};">${List[i][`Initialen`]}</span>
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
                        <button type="button" class="cancelButton-edit cursorPointer" onclick="deleteContactsCloseWindow(${i})">Delete</button>
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
  
    document.getElementById('editContactForm').addEventListener('submit', function(event) {
      if (event.target.checkValidity()) {
        event.preventDefault(); // Verhindert die Standard-Formularsendung
        updateKontakt(i);
        deleteContacts(i); // Ruft Ihre Funktion auf, wenn das Formular valide ist
      } else {
        event.preventDefault();
        alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      }
    });

    document.getElementById(`placeholderName`).value = List[i][`Name`];
    document.getElementById(`placeholderEmail`).value = List[i][`Email`];
    document.getElementById(`placeholderNumber`).value = List[i][`Number`];
    document.getElementById('modal-edit').classList.remove('notactive');
    document.getElementById('panel-edit').classList.remove('notactive');
    document.getElementById('modal-edit').classList.add('active');
    document.getElementById('panel-edit').classList.add('active');
  }

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

function closeEditWindow() {
    document.getElementById('modal-edit').classList.remove('active');
    document.getElementById('panel-edit').classList.remove('active');
    document.getElementById('modal-edit').classList.add('notactive');
    document.getElementById('panel-edit').classList.add('notactive');
}

function deleteContactsCloseWindow(i) {
    document.getElementById('modal-edit').classList.remove('active');
    document.getElementById('panel-edit').classList.remove('active');
    document.getElementById('modal-edit').classList.add('notactive');
    document.getElementById('panel-edit').classList.add('notactive');

    deleteContacts(i);
}





//slide in contacts richtig anzeigen lassen
function showContactsSlideInRightContainer(index) {
    const contacts = document.getElementById('showContactDetailsOnSlide');
    const ziel = document.getElementById('zielbereich');
    const slideInContacts = document.getElementById('showInnerHTML');

    if (!contacts || !ziel || !slideInContacts) {
        console.error('Eines der benötigten Elemente fehlt im DOM.');
        return;
    }

    // Reset der Stile und Inhalte
    contacts.style.width = '0px'; 
    contacts.style.opacity = '0'; 
    slideInContacts.innerHTML = '';
    contacts.style.left = `5000px`; 

    setTimeout(() => {
        const zielRect = ziel.getBoundingClientRect();

        contacts.style.width = '';
        contacts.style.top = '190px';
        contacts.style.left = `${zielRect.left}px`;
        contacts.style.opacity = '1';
        let farbe = zufaelligeFarbe();

        let List = kontaktListe;
        slideInContacts.innerHTML = `
        <div class="showContactsDetails" id="slideShowContacts" style="overflow: hidden;">
            <div class="showContacts">
            <div class="align-items-contacts-slide-in">    
            <span class="initialen-kreis-show-contacts" style="background-color:${List[index][`Farbe`]};">${List[index][`Initialen`]}</span>
                <div class="showContactsNameEditDelete">
                    <h1 style="font-size: 47px;">${List[index][`Name`]}</h1>
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
                    <a href="https://gmail.com" class="lightblue">${List[index][`Email`]}</a>
                    <h4>Phone</h4>
                    <p class="font-size-15 cursorPointer">+${List[index][`Number`]}</p>
                </div>
            </div>
        `;
    }, 350);
}



function getNextLetter(currentLetter) {
    let allLetters = kontaktListe.map(kontakt => kontakt['Anfangsbuchstabe']).filter((value, index, self) => self.indexOf(value) === index);
    allLetters.sort();
    let currentIndex = allLetters.indexOf(currentLetter);
    let nextIndex = currentIndex + 1 < allLetters.length ? currentIndex + 1 : 0;
    return allLetters[nextIndex];
}



function updateContactDisplay() {
    showSomething(); 
}



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

///edit
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

async function updateContacts(index) {
    if (index >= 0 && index < kontaktListe.length) {
        kontaktListe[index][`Name`] = ``;
        kontaktListe[index][`Email`] = ``;
        kontaktListe[index][`Number`] = ``;
        await setItem('users', JSON.stringify(kontaktListe));
    } else {
        console.error('Ungültiger Index');
    }

    updateContactDisplay();
}


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


function addKontakt(name, email, nummer, targetElement = null) {
    const anfangsbuchstabe = name.charAt(0).toUpperCase();
    const initialen = getInitialen(name);
    setItemLocalStorage(kontaktId, name, email, nummer, initialen, anfangsbuchstabe);
    kontaktId++;
    if (targetElement) {
        targetElement.remove();
    }
    versteckeLeereAbschnitte();
    showSomething();
}








function getInitialen(name) {
    const namensteile = name.split(' ');
    if (namensteile.length > 1) {
        return namensteile[0][0].toUpperCase() + namensteile[1][0].toUpperCase();
    } else {
        return namensteile[0][0].toUpperCase();
    }
}

function createInitialenKreis(initialen) {
    const kreis = document.createElement('span');
    kreis.className = 'initialen-kreis';
    kreis.textContent = initialen;
    kreis.style.backgroundColor = zufaelligeFarbe(); 
    return kreis;
}



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







//gerade keinen
function bearbeiteKontakt(li) {
    const originalContent = li.innerHTML;
    const details = originalContent.split('<br>');
    const name = details[0].replace('<strong>', '').replace('</strong>', '').trim();
    const email = details[1].replace('Email: ', '').trim();
    const nummer = details[2].replace('Telefon: ', '').trim();

    li.innerHTML = `<input type='text' value='${name}' id='editName'>
                    <input type='email' value='${email}' id='editEmail'>
                    <input type='tel' value='${nummer}' id='editNummer'>
                    <button onclick='aktualisiereKontakt("${name}", ${li})'>Bestätigen</button>`;
}

function aktualisiereKontakt(alterName, li) {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const nummer = document.getElementById('editNummer').value.trim();

    if (name) {
        const neuerAnfangsbuchstabe = name.charAt(0).toUpperCase();
        if (neuerAnfangsbuchstabe !== alterName.charAt(0).toUpperCase()) {
            li.remove();
            addKontakt(name, email, nummer);
        } else {
            li.innerHTML = `<strong>${name}</strong><br>Email: ${email}<br>Telefon: ${nummer}`;
        }
    } else {
        li.remove();
        versteckeLeereAbschnitte();
    }
}








function einfuegenInRichtigerReihenfolge(buchstabenDiv, buchstabe) {
    const telefonliste = document.getElementById('telefonliste');
    let eingefuegt = false;

    Array.from(telefonliste.children).forEach(div => {
        const currentLetter = div.id;
        if (buchstabe < currentLetter && !eingefuegt) {
            telefonliste.insertBefore(buchstabenDiv, div);
            eingefuegt = true;
        }
    });

    if (!eingefuegt) {
        telefonliste.appendChild(buchstabenDiv);
    }
}

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
  


function zeigeKontaktDetails(id) {
    const kontakt = kontaktListe.find(k => k.id === id);
    alert(`Name: ${kontakt.name}, Email: ${kontakt.email}, Telefon: ${kontakt.nummer}`);
}
  
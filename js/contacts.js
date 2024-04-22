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

  document.getElementById('createAccountSubmit').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal').classList.add('notactive');
    document.getElementById('panel').classList.add('notactive');
    setTimeout(() => {
      document.getElementById('panel').style.right = "-50%"; 
    }, 500);
  });
});  


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


async function setItemLocalStorage(kontaktId, name, email, nummer, initialen,anfangsbuchstabe) {
    kontaktListe.push({
        id: kontaktId,
        Name: name,
        Email: email,
        Number: nummer,
        Initialen: initialen,
        Anfangsbuchstabe: anfangsbuchstabe
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
    for (let i = 0; i < List.length; i++) {
        if (!List[i]['Anfangsbuchstabe'] || !List[i]['Initialen'] || !List[i]['Name'] || !List[i]['Email']) {
            continue; 
        }

        let anfangsbuchstabe = List[i]['Anfangsbuchstabe'];
        if (!gruppen[anfangsbuchstabe]) {
            gruppen[anfangsbuchstabe] = [];
        }
        gruppen[anfangsbuchstabe].push(List[i]);
    }
    for (let buchstabe in gruppen) {
        telefonbook.innerHTML += `
        <div>
            <h2>${buchstabe}</h2>
            <img class="display-flex" src="assets/img/Vector10.png">
            <ul>`;

        for (let kontakt of gruppen[buchstabe]) {
            let initialen = kontakt['Initialen'];
            let name = kontakt['Name'];
            let email = kontakt['Email'];
            let farbe = zufaelligeFarbe();

            telefonbook.innerHTML += `
                <li onclick="showContactsSlideInRightContainer(${kontaktListe.indexOf(kontakt)})">
                    <span class="initialen-kreis" style="background-color: ${farbe};">${initialen}</span>
                    <div class="kontakt-info">
                        <strong>${name}</strong>
                        <div class="showEmailLi">${email}</div>
                    </div>
                </li>`;
        }

        telefonbook.innerHTML += `</ul></div>`;
    }
}


//slide in contacts richtig anzeigen lassen
function showContactsSlideInRightContainer(i) {
    setTimeout(() => {
        const contacts = document.getElementById('showContactDetailsOnSlide');
        const ziel = document.getElementById('zielbereich');
        const zielRect = ziel.getBoundingClientRect();
        contacts.style.width = '500px'; 
        contacts.style.top = '190px';
        contacts.style.left = zielRect.left + 'px';
      }, 250); 
    let List = kontaktListe;
    let slideInContacts = document.getElementById(`showInnerHTML`);
    slideInContacts.innerHTML = `
    <div class="showContactsDetails" id="slideShowContacts" style="overflow: hidden;">
    
    <div class="showContacts">
        <img src="assets/img/pb-contacts.png" alt="">
        <div class="showContactsNameEditDelete">
            <h1>${List[i][`Name`]}</h1>
            <div class="editDelteContacts">
                <div class="editShowContacts cursorPointer">
                    <img class="contacts-icon-edit-showContacts" src="assets/img/edit.png">
                    <p>Edit</p>
                </div>
                <div class="deleteShowContacts cursorPointer">
                    <img class="contacts-icon-delete-showContacts" src="assets/img/delete.png">
                    <p>Delete</p>
                </div>
            </div>
        </div>
    </div>

    <p class="font-size-20">Contact Information</p>

    <div class="emailPhone">
        <h4>Email</h4>

        <a href="https://gmail.com" class="lightblue">${List[i][`Email`]}</a>

        <h4>Phone</h4>

        <p class="font-size-15 cursorPointer">+${List[i][`Number`]}</p>
    </div>
    `
    slideInContacts();
}


//noch überarbeiten!!!
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('kontaktForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
        neuenKontaktHinzufuegen();
    });
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


//auch überarbeiten
function addKontakt(name, email, nummer, targetElement = null) {
    const anfangsbuchstabe = name.charAt(0).toUpperCase();
    let buchstabenDiv = document.getElementById(anfangsbuchstabe);

    if (!buchstabenDiv) {
        buchstabenDiv = document.createElement('div');
        buchstabenDiv.id = anfangsbuchstabe;
        buchstabenDiv.innerHTML = `<h2>${anfangsbuchstabe}</h2><img class="display-flex" src="assets/img/Vector10.png"><ul></ul>`;
        einfuegenInRichtigerReihenfolge(buchstabenDiv, anfangsbuchstabe);
    }

    const ul = buchstabenDiv.querySelector('ul');
    const li = document.createElement('li');
    li.id = `kontakt-${kontaktId}`;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'kontakt-info';
    infoDiv.innerHTML = `<strong>${name}</strong><div class="showEmailLi">${email}</div>`;

    const initialen = getInitialen(name);
    const initialenKreis = createInitialenKreis(initialen);
    li.appendChild(initialenKreis);
    li.appendChild(infoDiv);
    ul.appendChild(li);

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







//gerade keinen nutzen
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
  
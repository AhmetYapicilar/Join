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
    }, 500); tion
  });

  document.getElementById('createAccountSubmit').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal').classList.add('notactive');
    document.getElementById('panel').classList.add('notactive');
    setTimeout(() => {
      document.getElementById('panel').style.right = "-50%"; 
    }, 500); tion
  });
});  


let kontaktListe = [];
let kontaktId = 0;


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

function addKontakt(name, email, nummer, targetElement = null) {
    const anfangsbuchstabe = name.charAt(0).toUpperCase();
    let buchstabenDiv = document.getElementById(anfangsbuchstabe);

    if (!buchstabenDiv) {
        buchstabenDiv = document.createElement('div');
        buchstabenDiv.id = anfangsbuchstabe;
        buchstabenDiv.innerHTML = `<h2>${anfangsbuchstabe}</h2><ul></ul>`;
        einfuegenInRichtigerReihenfolge(buchstabenDiv, anfangsbuchstabe);
    }

    const ul = buchstabenDiv.querySelector('ul');
    const li = document.createElement('li');
    const infoDiv = document.createElement('div');
    infoDiv.className = 'kontakt-info';
    infoDiv.innerHTML = `<strong>${name}</strong><div class="showEmailLi">${email}`;

    const initialen = getInitialen(name);
    const initialenKreis = createInitialenKreis(initialen);
    li.appendChild(initialenKreis);
    li.appendChild(infoDiv);
    ul.appendChild(li);

    if (targetElement) {
        targetElement.remove();
    }

    versteckeLeereAbschnitte();
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
    const farben = ['#FFA500', '#90EE90', '#FF4500', '#FFD700', '#FF8C00', `#ADD8E6`]; 
    return farben[Math.floor(Math.random() * farben.length)];
}


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
  
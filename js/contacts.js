function slideInContacts() {
    setTimeout(() => {
        const bild = document.getElementById('showContactDetailsOnSlide');
        const ziel = document.getElementById('zielbereich');
        const zielRect = ziel.getBoundingClientRect();
        bild.style.width = '500px'; 
        bild.style.top = '190px';
        bild.style.left = zielRect.left + 'px';
      }, 250); 
  }
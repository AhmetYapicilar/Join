let savedUsers = [];

function toggleShowPassword() {
  const passwordInput = document.getElementById("passwordInput");
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
}

async function initLogIn() {
  await loadUsers();
  getLocalStorage();
  let x = savedUsers.length - 1;
  document.getElementById("inputEmail").value = savedUsers[x]["email"];
  document.getElementById("passwordInput").value = savedUsers[x]["password"];
}

function checkedFunction() {
  let checkBox = document.getElementById("myCheck");
  if (checkBox.checked == true) {
    saveUserToLocalStorage();
  }
}

async function logIn() {
  let email = document.getElementById("inputEmail").value;
  let password = document.getElementById("passwordInput").value;
  let user = users.find((u) => u.email == email && u.password == password);
  if (user) {
    setUserNameToLocalStorage("user-name", user.name);
    if (window.innerWidth < 1242) {
      greetUserFirst(user.name);
    }
    setTimeout(() => {
      window.location.href = "summary.html?user=" + user.name;
    }, 2000);
  } else {
    window.location.reload();
    alert("User ist nicht registriert");
  }
}

function greetUserFirst(username) {
  let content = document.getElementById("inhalt");
  let greet = getTime();
  content.innerHTML = "";
  if (username === "Guest") {
    username = "";
    content.innerHTML = ` <span class="greeting">${greet}</span>`;
  } else {
    content.innerHTML = `<div class="displayColumn">
            <span class="greeting">${greet}</span>
            <span class="greeting-name">${username}</span>
            </div>`;
  }
}

function getTime() {
  let now = new Date();
  let hours = now.getHours();
  let x;
  if (hours < 17 && hours > 10) x = "Good Afternoon";
  else if (hours < 10 && hours > 4) x = "Good Morning";
  else {
    x = "Good Evening";
  }
  return x;
}

function guestLogIn() {
  document.getElementById("inputEmail").value = "";
  document.getElementById("passwordInput").value = "";
  setUserNameToLocalStorage("user-name", "Guest");
  if (window.innerWidth < 1242) {
    greetUserFirst("Guest");
  }
  setTimeout(() => {
    window.location.href = "summary.html?user=Guest";
  }, 2000);
}

function saveUserToLocalStorage() {
  savedUsers.push({
    email: inputEmail.value,
    password: passwordInput.value,
  });
  setLocalStorage("savedUsers", savedUsers);
}

function setLocalStorage() {
  let userAsText = JSON.stringify(savedUsers);
  localStorage.setItem("savedUsers", userAsText);
}

function getLocalStorage() {
  let textInArray = localStorage.getItem("savedUsers");
  savedUsers = JSON.parse(textInArray);
}

function setUserNameToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const bild = document.getElementById("meinBild");
    const ziel = document.getElementById("zielbereich");
    const inhalt = document.getElementById("inhalt");
    if (ziel) {
      const zielRect = ziel.getBoundingClientRect();
      bild.style.width = "100px";
      bild.style.top = zielRect.top + "px";
      bild.style.left = zielRect.left + "px";
    }
    setTimeout(() => {
      if (inhalt) {
        inhalt.style.opacity = 1;
        inhalt.style.filter = "blur(0px)";
      }
    }, 1000);
  }, 1000);
});

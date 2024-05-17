/**
 * Retrieves the user's data from the local storage.
 */
let user = JSON.parse(localStorage.getItem("user-name"));

/**
 * Displays the initials of the user on the page.
 */
function showInitials() {
  let name = JSON.stringify(user);
  let initials = name.match(/\b\w/g) || [];
  let result = initials.join("");
  setTimeout(() => {
    document.getElementById("initials").innerHTML = result;
  }, 1000);
}

/**
 * Redirects the user to the addTask page.
 */
function openAddTask() {
  window.location.href = "addTask.html?user=" + user;
}

/**
 * Redirects the user to the summary page.
 */
function openSummary() {
  window.location.href = "summary.html?user=" + user;
}

/**
 * Redirects the user to the contact page.
 */
function openContacts() {
  window.location.href = "contacts.html?user=" + user;
}

/**
 * Redirects the user to the board page.
 */
function openBoard() {
  window.location.href = "board.html?user=" + user;
}

/**
 * Toggles the visibility of the help menu bar.
 */
function showMenuBar() {
  document.getElementById("help-menu-bar").classList.toggle("d-none");
}

/**
 * Redirects the user to the login page.
 */
function openLogIn() {
  window.location.href = "Login.html";
}

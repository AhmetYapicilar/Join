/**
 * Retrieves the user's data from the local storage.
 */
let user = JSON.parse(localStorage.getItem("user-name"));

/**
 * Displays the initials of the user on the page.
 */
function showInitials() {
  let name = user;
  if(name === null || name === 'Guest'){
    setTimeout(() => {
      document.getElementById("initials").innerHTML = 'G';
    }, 1000);
  } else{
  let initials = name.match(/\b\w/g) || [];
  let result = initials.join("");
  setTimeout(() => {
    document.getElementById("initials").innerHTML = result;
  }, 1000);
}}

/**
 * Redirects the user to the addTask page.
 */
function openAddTask() {
  if(user === null || user === 'Guest'){
    user = 'Guest';}
  window.location.href = "addTask.html?user=" + user;
}

/**
 * Redirects the user to the summary page.
 */
function openSummary() {
  if(user === null || user === 'Guest'){
    user = 'Guest';}
  window.location.href = "summary.html?user=" + user;
}

/**
 * Redirects the user to the contact page.
 */
function openContacts() {
  if(user === null || user === 'Guest'){
    user = 'Guest';}
  window.location.href = "contacts.html?user=" + user;
}

/**
 * Redirects the user to the board page.
 */
function openBoard() {
  if(user === null || user === 'Guest'){
    user = 'Guest';}
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

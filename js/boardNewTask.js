let newTaskNumber = 0;
let newAddedPrio = [];
let newTaskCategory;

/**
 * Generates CSS for displaying the add task form.
 * @returns {void}
 */
function generateCSSForAddTask(){
  document
  .getElementById("overlay-add-task-board")
  .classList.add("overlay-add-task-board");
document.getElementById("body-board").style.overflow = "hidden";
}

/**
 * Shows the add task form with animation.
 * @returns {void}
 */
function showAddTaskForm(){
  setTimeout(() => {
    document
      .getElementById(`newTask${newTaskNumber}`)
      .classList.add("showAddTask");
  }, 100);
}

/**
 * Prevents default action when the dropdown icon is clicked.
 * @returns {void}
 */
function showNamesWhenClickAssignedTo(){
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
      const dropdownIcon = document.querySelector(".dropdownIcon");
      dropdownIcon.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
        },
        50
      );
    });
  });
}

/**
 * Creates a new task based on the input values and adds it to the tasks array.
 * @returns {void}
 */
async function createNewTask() {
  let {
    newTitle,
    newDescription,
    newDueDate,
    newCategory,
    newWorkflow,
    newPriority,
    newSubtasks,
    newAssignedTo,
  } = await initVariablesForNewTask();
  tasks.push({
    title: newTitle,
    description: newDescription,
    dueDate: newDueDate,
    category: newCategory,
    workflow: newWorkflow,
    priority: newPriority,
    subTasks: newSubtasks,
    assignedTo: newAssignedTo,
  });
  await setItem("task", JSON.stringify(tasks));
  showTaskIsAdded();
}

/**
 * Shows a message indicating that the task has been added to the board.
 * @returns {void}
 */
function showTaskIsAdded() {
  document
    .getElementById("middle-of-the-page")
    .classList.add("middle-of-the-page");
  document.getElementById("added-to-board").classList.remove("d-none");
  setTimeout(() => {
    closeAddTask(newTaskNumber);
    initBoard();
    newTaskNumber++;
  }, 2000);
}

/**
 * Closes the add task form with animation.
 * @param {number} newTaskNumber - Number of the new task.
 * @returns {void}
 */
async function closeAddTask(newTaskNumber) {
  document
    .getElementById(`newTask${newTaskNumber}`)
    .classList.remove("showAddTask");
  document.getElementById("body-board").style.overflow = "auto";
  setTimeout(() => {
    document
      .getElementById("overlay-add-task-board")
      .classList.remove("overlay-add-task-board"); // Verstecke das Element nach der Animation
  }, 400);
}

/**
 * Activates the input field for adding a new subtask in the task edit view.
 * @returns {void}
 */
function activateInput() {
  let addSubtask = document.getElementById("add-subtask-edit");
  let subtasksInputActions = document.getElementById("subtask-input-actions");

  addSubtask.classList.add("d-none");
  subtasksInputActions.classList.remove("d-none");
}

/**
 * Activates the input field for adding a new subtask in the create task view.
 * @returns {void}
 */
function activateInputForCreateTask() {
  let addSubtask = document.getElementById("add-subtask");
  let subtasksInputActions = document.getElementById("subtask-input-Actions");

  addSubtask.classList.add("d-none");
  subtasksInputActions.classList.remove("d-none");
}

/**
 * Checks if the "Enter" key is pressed and submits the subtask if true.
 * @param {Event} event - Key press event.
 * @returns {void}
 */
function checkSubmit(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitSubtask();
  }
}

/**
 * Deactivates the input field for adding a new subtask in the task edit view.
 * @param {number} i - Index of the task.
 * @returns {void}
 */
function deactivateInput(i) {
  let addSubtask = document.querySelector("#add-subtask-edit");
  let subtasksInputActions = document.querySelector("#subtask-input-actions");

  addSubtask.classList.remove("d-none");
  subtasksInputActions.classList.add("d-none");
  document.getElementById(`subtask-input${i}`).value = "";
}

/**
 * Deactivates the input field for adding a new subtask in the create task view.
 * @returns {void}
 */
function deactivateInputForCreateTask() {
  let addSubtask = document.getElementById("add-subtask");
  let subtasksInputActions = document.getElementById("subtask-input-Actions");

  addSubtask.classList.remove("d-none");
  subtasksInputActions.classList.add("d-none");
  document.getElementById("subtask-input").value = "";
}

/**
 * Sets focus on the subtask input field.
 * @returns {void}
 */
function setFocus() {
  document.getElementById("subtask-input").focus();
}

/**
 * Submits a subtask in the task edit view.
 * @param {number} i - Index of the task.
 * @returns {void}
 */
async function submitSubtask(i) {
  if (tasks[i]["subTasks"] && tasks[i]["subTasks"].length >= 6) {
    alert(
      "Maximale Anzahl von Subtasks erreicht. Neue Subtasks können nicht hinzugefügt werden."
    );
    return;
  }
  let subtaskContent = document.getElementById(`subtask-input${i}`).value;
  if (subtaskContent == "") {
    deactivateInput();
  } else {
    const SUBTASK = tasks[i]["subTasks"];
    let newSubtask = {
      subtaskName: subtaskContent,
      done: false,
    };
    SUBTASK.push(newSubtask);
    await setItem("task", JSON.stringify(tasks));
    editTask(i);
  }

  subtaskContent = "";
  deactivateInput(i);
}

let newTaskSubtask = [];

/**
 * Submits a subtask in the create task view.
 * @returns {void}
 */
function submitSubtaskForNewTask() {
  let subtask = document.getElementById("subtask-input").value;
  let createdSubtask = {
    subtaskName: subtask,
    done: false,
  };
  newTaskSubtask.push(createdSubtask);
  showSubtaskForNewTask();
}

/**
 * Shows the submitted subtasks for a new task.
 * @returns {void}
 */
function showSubtaskForNewTask(){
  document.getElementById("addedNewSubtasks").innerHTML = "";
  for (let x = 0; x < newTaskSubtask.length; x++) {
    document.getElementById(
      "addedNewSubtasks"
    ).innerHTML += `<div>${newTaskSubtask[x]["subtaskName"]}</div>`;
  }
  document.getElementById("subtask-input").value = "";
}

/**
 * Clears the add task form.
 * @returns {void}
 */
function clearForm() {
  let form = document.getElementById("addTaskForm");
  form.reset();
  newSubtask = [];
  document.getElementById("addedNewSubtasks").innerHTML = "";
  selectPriority("medium");
}

/**
 * Function to toggle the dropdown menu.
 */
function toggleDropdown() {
  const dropdownContent = document.querySelector(".dropdownContent");
  const isOpen = dropdownContent.classList.contains("show");

  if (!isOpen) {
    dropdownContent.classList.add("show");
  } else {
    dropdownContent.classList.remove("show");
  }
}

/**
 * Function for rendering user names.
 * @param {Array<Object>} users - Array of user objects.
 */
function renderNames(users) {
  const dropdownContent = document.querySelector(".dropdownContent");
  dropdownContent.innerHTML = "";
  const nameSet = new Set();
  const filteredUsers = [];

  users.forEach((user) => {
    const name = user.name || user.Name;
    if (name && !nameSet.has(name)) {
      nameSet.add(name);
      dropdownContent.innerHTML += `<span onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
      filteredUsers.push(user);
    }
  });
  users.push(...filteredUsers);
}

/**
 * Function for searching contacts.
 */
function searchContacts() {
  const searchInput = document.querySelector(".searchInputLittle");
  const filter = searchInput.value.trim().toUpperCase();
  const dropdownContent = document.querySelector(".dropdownContent");
  dropdownContent.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const name = user.name || user.Name;
    if (name && name.toUpperCase().startsWith(filter)) {
      dropdownContent.innerHTML += `<span id="contact${i}" onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
    }
  }
  dropdownContent.classList.add("show");
  selectContactStyleChanger();
}

/**
 * Function for searching contacts when creating a new task.
 */
function searchContactsAddTask() {
  const searchInput = document.querySelector(".searchInput");
  const filter = searchInput.value.trim().toUpperCase();
  const dropdownContent = document.querySelector(".dropdownContent");
  dropdownContent.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const name = user.name || user.Name;
    if (name && name.toUpperCase().startsWith(filter)) {
      dropdownContent.innerHTML += `<span id="contact${i}" onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
    }
  }
  dropdownContent.classList.add("show");
  selectContactStyleChanger();
}

/**
 * Function for selecting a contact.
 * @param {string} name - The name of the selected contact.
 */
function selectContact(name) {
  const selectedContactIndex = selectedContacts.indexOf(name);
  if (selectedContactIndex === -1) {
    selectedContacts.push(name);
  } else {
    selectedContacts.splice(selectedContactIndex, 1);
  }
  name = name.toUpperCase();
  selectContactStyleChanger(name);
  renderSelectedContacts();
}

/**
 * Function for changing the style for selected contacts.
 * @param {string} [name] - The name of the selected contact.
 */
function selectContactStyleChanger() {
  const selectedDropdownContent = document.querySelectorAll(
    ".dropdownContent span"
  );
  selectedDropdownContent.forEach((span) => {
    const contactName = span.textContent.trim();
    const isSelected = selectedContacts.includes(contactName);
    if (isSelected) {
      span.classList.add("selectedDropdownContent");
      const img = span.querySelector("img");
      if (img) {
        img.src = "./assets/img/checkbox-check-white.png";
      }
    } else {
      span.classList.remove("selectedDropdownContent");
      const img = span.querySelector("img");
      if (img) {
        img.src = "./assets/img/Checkbox.png";
      }
    }
  });
}

/**
 * Function for rendering the selected contacts.
 */
async function renderSelectedContacts() {
  const selectedContactsContainer = document.querySelector(
    ".selectedContactsContainer"
  );
  selectedContactsContainer.innerHTML = "";
  const maxContactsToShow = 5;
  const remainingCount = selectedContacts.length - maxContactsToShow;
  if (selectedContacts.length > 1 && selectedContacts.includes("Guest")) {
    selectedContacts = selectedContacts.filter(
      (contact) => contact !== "Guest"
    );
  }

  for (
    let i = 0;
    i < Math.min(selectedContacts.length, maxContactsToShow);
    i++
  ) {
    const contact = selectedContacts[i];
    const initials = contact
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
    const color = await initVariableBgColor(contact);
    selectedContactsContainer.innerHTML += `<div class="selectedContact" style="background-color: ${color};">${initials}</div>`;
  }

  if (remainingCount > 0) {
    selectedContactsContainer.innerHTML += `<div class="selectedContact" style="background-color: #aaa;">+${remainingCount}</div>`;
  }
}

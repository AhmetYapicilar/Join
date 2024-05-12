/**
 * Array of the ids as a string.
 * @type {Array<Object>}
 */
let ids = ["To-Do", "In-Progress", "Await-Feedback", "Done"];

/**
 * Array of priorities as string.
 * @type {Array<Object>}
 */
let priorities = ["low", "medium", "urgent"];

/**
 * Array of strings for images.
 * @type {Array<Object>}
 */
let priopics = [
  "./assets/img/arrow-down-icon.png",
  "./assets/img/equal-sign-icon.png",
  "./assets/img/arrow-up-icon.png",
];

/**
 * Array for counting the tasks in the fields.
 * @type {Array<Object>}
 */
let taskCounts = {
  "To-Do": 0,
  "In-Progress": 0,
  "Await-Feedback": 0,
  Done: 0,
};

/**
 * Array for dragged tasks.
 * @type {Array<Object>}
 */
let draggedTask;

/**
 * Array for storing users.
 * @type {Array<Object>}
 */
let users = [];

/**
 * Array for selected Contacts.
 * @type {Array<Object>}
 */
let selectedContacts = [];

/**
 * Event listener for the DOMContentLoaded event.
 * Hides dropdown content when clicking outside the dropdown.
 */
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const dropdownContent = document.querySelector(".dropdownContent");
    const dropdownIcon = document.querySelector(".dropdownIcon");
    const clickedElement = event.target;

    const isDropdownContentClicked =
      dropdownContent && dropdownContent.contains(clickedElement);
    const isDropdownIconClicked =
      dropdownIcon && dropdownIcon.contains(clickedElement);

    if (
      !isDropdownContentClicked &&
      !isDropdownIconClicked &&
      dropdownContent
    ) {
      dropdownContent.classList.remove("show");
    }
  });
});

/**
 * Initializes the board by generating CSS, cleaning fields, loading users and tasks,
 * showing tasks, calculating progress bar, and checking for empty tasks.
 * @returns {Promise<void>}
 */
async function initBoard() {
  generateCSSForInit();
  cleanAllFieldsBeforeInit();
  await loadUsers();
  await loadTasks();
  await showTasks();
  await calculateProgressBar();
  checkEmptyTasks();
  newTaskSubtask = [];
}

/**
 * Cleans all fields before initializing the board.
 */
function cleanAllFieldsBeforeInit(){
  for (let x = 0; x < ids.length; x++) {
    let category = ids[x];
    taskCounts[category] = 0;
    let contentBefore = document.getElementById(`${ids[x]}`);
    contentBefore.classList.remove("drag-area-highlight");
    contentBefore.innerHTML = "";
  }
}

/**
 * Generates CSS for initialization.
 */
function generateCSSForInit() {
  document
    .getElementById("middle-of-the-page")
    .classList.remove("middle-of-the-page");
  document.getElementById("added-to-board").classList.add("d-none");
  document
    .getElementById("overlay-add-task-board")
    .classList.remove("overlay-add-task-board");
  document
    .getElementById("section-board-overlay")
    .classList.remove("section-board-overlay");
  document.getElementById("body-board").style.overflow = "auto";
}

/**
 * Loads tasks from the storage.
 * @returns {Promise<void>}
 */
async function loadTasks() {
  try {
    const storedTasks = await getItem("task");

    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    }
  } catch (error) {
    console.error("Loading error:", error);
  }
}

/**
 * Loads users from the storage.
 * @returns {Promise<void>}
 */
async function loadUsers() {
  users = JSON.parse(await getItem("users"));
}

/**
 * Checks for empty tasks in each category and adds a message if no tasks are available.
 */
function checkEmptyTasks() {
  for (let i = 0; i < ids.length; i++) {
    const ID = ids[i];
    let content = document.getElementById(ID);
    if (content.innerHTML === "") {
      content.innerHTML = `<div class="no-tasks-board">No tasks available</div>`;
    }
  }
}

/**
 * Removes the big task before initializing all tasks.
 * @param {number} i - Index of the task.
 */
function removeBigTaskBeforeInitAllTasks(i){
  if (document.getElementById(`bigtask${i}`)) {
    document.getElementById(`bigtask${i}`).classList.add("d-none");
  }
}

/**
 * Shows all tasks on the board.
 * @returns {Promise<void>}
 */
async function showTasks() {
  for (let i = 0; i < tasks.length; i++) {
    removeBigTaskBeforeInitAllTasks(i);
    let {
      TASK,
      category2,
      title,
      description,
      dueDate,
      priority,
      priorityIcon,
      allSubtasks,
      assignedTo,
      bgColor,
    } = await initVariablesForShowTasks(i);
    let initials = await initialOfAssignTo(assignedTo);
    if (!category2) {
      category2 = "To-Do";
    }
    await countTasks(category2);
    let circlesHTML = addCirclesWithInitials(bgColor, initials);
    let content = document.getElementById(category2);
    content.innerHTML += generateShowTasksHTML(
      i,
      title,
      description,
      priorityIcon,
      allSubtasks,
      circlesHTML
    );
    userStoryOrTechnicalTask(TASK, i);
    activateCheckboxIfClickedBefore(i, allSubtasks);
  }
}

/**
 * Gets the initials of users assigned to a task.
 * @param {Array<Object>} assignedTo - Array of assigned users.
 * @returns {Promise<Array<string>>} - Array of initials.
 */
async function initialOfAssignTo(assignedTo) {
  let initials = [];
  for (let i = 0; i < assignedTo.length; i++) {
    let contact = assignedTo[i];
    let name = JSON.stringify(contact);
    let initial = name.match(/\b\w/g) || [];
    let result = initial.join("");
    initials.push(result);
  }
  return initials;
}

/**
 * Initializes variables required for showing tasks.
 * @param {number} i - Index of the task.
 * @returns {Promise<Object>} - Object containing initialized variables.
 */
async function initVariablesForShowTasks(i) {
  const TASK = tasks[i];
  let category2 = TASK["category2"];
  let title = TASK["title"];
  let description = TASK["description"];
  let dueDate = TASK["dueDate"];

  if (!TASK["priority"]) {
    TASK["priority"] = "medium";
  }
  let priority = TASK["priority"];
  let priorityIcon = await proofPriority(priority);
  let { assignedTo, bgColor } = await initVariableAssignedTo(TASK);
  let allSubtasks = await initVariableSubTask(TASK);
  return {
    TASK,
    category2,
    title,
    description,
    dueDate,
    priority,
    priorityIcon,
    allSubtasks,
    assignedTo,
    bgColor,
  };
}

/**
 * Initializes variables for assigned users and their background colors.
 * @param {Object} TASK - Task object containing assignedTo property.
 * @returns {Promise<Object>} - Object containing assignedTo array and bgColor array.
 */
async function initVariableAssignedTo(TASK) {
  let bgColor = [];
  let assignedTo = [];
  let contacts = TASK["assignedTo"];
  if (contacts) {
    for (let j = 0; j < contacts.length; j++) {
      let newContact = contacts[j];
      assignedTo.push(newContact);
      bgColor.push(await initVariableBgColor(newContact));
    }
  } else {
    assignedTo = ["Guest"];
    bgColor = ["#FF7A00"];
  }
  return { assignedTo, bgColor };
}

/**
 * Initializes background color for a user based on their name.
 * @param {string} newContact - Name of the user.
 * @returns {Promise<string>} - Background color.
 */
async function initVariableBgColor(newContact) {
  const index = users.findIndex((user) => user.name === newContact);
  let bgColor;
  if (index !== -1 && users[index].Color) {
    bgColor = users[index].Color;
  } else {
    bgColor = "#FF7A00";
  }
  return bgColor;
}

/**
 * Initializes subtasks for a task.
 * @param {Object} TASK - Task object containing subTasks property.
 * @returns {Promise<string>} - String containing all subtasks.
 */
async function initVariableSubTask(TASK) {
  let allSubtasks = [];
  let subtasks = TASK["subTasks"];
  if (subtasks) {
    for (let x = 0; x < subtasks.length; x++) {
      let newSubtask = subtasks[x]["subtaskName"];
      allSubtasks.push(newSubtask);
    }
  } else {
    allSubtasks = "";
  }
  return allSubtasks;
}

/**
 * Generates HTML for circles with initials of assigned users.
 * @param {Array<string>} bgColor - Array of background colors.
 * @param {Array<string>} initials - Array of initials.
 * @returns {string} - HTML string for circles.
 */
function addCirclesWithInitials(bgColor, initials){
  let circlesHTML = "";
  for (let j = 0; j < initials.length; j++) {
    circlesHTML += `<div class="circle-board margin-left-9px colorWhite" style="background-color:${bgColor[j]}">${initials[j]}</div>`;
  }
  return circlesHTML;
}

/**
 * Generates HTML for displaying a task.
 * @param {number} i - Index of the task.
 * @param {string} title - Title of the task.
 * @param {string} description - Description of the task.
 * @param {string} priorityIcon - URL of the priority icon.
 * @param {Array<string>} allSubtasks - Array of subtasks.
 * @param {string} circlesHTML - HTML for circles representing assigned users.
 * @returns {string} - HTML string representing the task.
 */
function generateShowTasksHTML(
  i,
  title,
  description,
  priorityIcon,
  allSubtasks,
  circlesHTML
) {
  return `
    <div id='task${i}' draggable="true" class="tasks-board" onclick=showTaskInBig(${i}) ondragstart="startDragging(${i})">
    <div id="user-technical-board${i}"></div>
    <div class="name-of-task-board"><span>${title}</span><p>${description}</p></div>
    <div class="space-between-board width-100percent margin-top-16">
        <div class="progressbar-background">
            <div id="progressbar${i}" class="progressbar-board" role="progressbar"></div>
        </div>
        <span class="sub-tasks"><b id="completedSubTasks${i}"></b>/<b>${allSubtasks.length}</b> Subtasks</span>
    </div>
    <div class="space-between-board width-100percent margin-top-16">
        <div class="flex-board">
            ${circlesHTML}
        </div>
        <img class="priority-icon-board" src="${priorityIcon}">
    </div></div>`;
}

/**
 * Adds "User Story" or "Technical Task" label to a task based on its category.
 * @param {Object} TASK - Task object.
 * @param {number} i - Index of the task.
 */
function userStoryOrTechnicalTask(TASK, i) {
  if (TASK["category"] === "User Story") {
    document
      .getElementById(`user-technical-board${i}`)
      .classList.add("user-story-board");
    document.getElementById(`user-technical-board${i}`).innerHTML =
      "User Story";
  } else {
    document
      .getElementById(`user-technical-board${i}`)
      .classList.add("technical-task-board");
    document.getElementById(`user-technical-board${i}`).innerHTML =
      "Technical Task";
  }
}

/**
 * Adds "User Story" or "Technical Task" label to a task in big view based on its category.
 * @param {Object} TASK - Task object.
 * @param {number} i - Index of the task.
 */
function userStoryOrTechnicalTaskBig(TASK, i) {
  if (TASK["category"] === "User Story") {
    document
      .getElementById(`user-technical-big${i}`)
      .classList.add("user-story-board-big");
    document.getElementById(`user-technical-big${i}`).innerHTML = "User Story";
  } else {
    document.getElementById(`user-technical-big${i}`).innerHTML =
      "Technical Task";
    document
      .getElementById(`user-technical-big${i}`)
      .classList.add("technical-task-board-big");
  }
}

/**
 * Increments the task count for a given category.
 * @param {string} category - Category of the task.
 * @returns {Promise<void>}
 */
async function countTasks(category) {
  taskCounts[category]++;
  await setItem("taskCount", JSON.stringify(taskCounts));
}

/**
 * Searches for tasks based on the input value.
 * @returns {Promise<void>}
 */
async function searchTask() {
  await loadTasks();
  let search = document.getElementById("search-input").value;
  search = search.toLowerCase();
  if (search === "") {
    initBoard();
  } else {
    await showSearchedTasks(search);
    checkEmptyTasks();
  }
}

/**
 * Array to store tasks founded by search.
 */
let foundedTasks = [];

/**
 * Displays tasks that match the search criteria.
 * @param {string} search - Search criteria.
 * @returns {Promise<void>}
 */
async function showSearchedTasks(search) {
  foundedTasks = [];
  for (let i = 0; i < ids.length; i++) {
    document.getElementById(`${ids[i]}`).innerHTML = "";
    for (let x = 0; x < tasks.length; x++) {
      const TASK = tasks[x];
      let tasktitle = TASK["title"];
      if (
        TASK["category2"] === ids[i] &&
        tasktitle.toLowerCase().startsWith(search)
      ) {
        foundedTasks.push(TASK);
      }
    }
  }
  await showFoundedTasks();
}

/**
 * Displays the tasks found by the search.
 * @returns {Promise<void>}
 */
async function showFoundedTasks() {
  for (let j = 0; j < foundedTasks.length; j++) {
    let foundedTask = foundedTasks[j];
    let {
      TASK,
      category2,
      title,
      description,
      dueDate,
      priority,
      priorityIcon,
      allSubtasks,
      assignedTo,
      bgColor,
    } = await initVariablesForShowTasks(tasks.indexOf(foundedTask));
    let content = document.getElementById(category2);
    content.innerHTML += generateShowTasksHTML(
      tasks.indexOf(foundedTask),
      title,
      description,
      priorityIcon,
      allSubtasks,
      initials,
      bgColor
    );
    userStoryOrTechnicalTask(TASK, tasks.indexOf(foundedTask));
  }
}

/**
 * Generates CSS before displaying a big task.
 */
function generateCSSBeforeBigTaskIsShowed(){
  document
    .getElementById("section-board-overlay")
    .classList.add("section-board-overlay");
  document.getElementById("body-board").style.overflow = "hidden";
}

/**
 * Shows a task in a big view.
 * @param {number} i - Index of the task.
 * @returns {Promise<void>}
 */
async function showTaskInBig(i) {
  await loadTasks();
  let {
    TASK,
    category2,
    title,
    description,
    dueDate,
    priority,
    priorityIcon,
    allSubtasks,
    assignedTo,
    bgColor,
  } = await initVariablesForShowTasks(i);
  let initials = await initialOfAssignTo(assignedTo);
  generateCSSBeforeBigTaskIsShowed();
  let subtaskHTML = showSubtasksInBigTask(i, allSubtasks);
  let content = document.getElementById("section-board-overlay");
  content.innerHTML = generateBigTaskHTML(
    i,
    title,
    description,
    dueDate,
    priority,
    priorityIcon,
    subtaskHTML,
    assignedTo,
    bgColor
  );
  userStoryOrTechnicalTaskBig(TASK, i);
  settimeoutForBigTask(i, allSubtasks);
  selectedContacts = [];
  initCirclesInBigTask(i, initials, bgColor, assignedTo);
  }

/**
 * Initializes circles representing assigned users in a big task.
 * @param {number} i - Index of the task.
 * @param {Array<string>} initials - Array of initials of assigned users.
 * @param {Array<string>} bgColor - Array of background colors for circles.
 * @param {Array<string>} assignedTo - Array of assigned users.
 */
function initCirclesInBigTask(i, initials, bgColor, assignedTo){
  let circlesHTML = document.getElementById(`assigned-to-contacts${i}`);
  for (let x = 0; x < initials.length; x++) {
    circlesHTML.innerHTML += `<div class="flex-board">
                              <div class="circle-board-big" style="background-color:${bgColor[x]}">${initials[x]}</div>
                              <span class="contact-name">${assignedTo[x]}</span>
                            </div>`;
                            selectedContacts.push(assignedTo[x]);
}}

/**
 * Sets a timeout before showing a big task with animations.
 * @param {number} i - Index of the task.
 * @param {Array<string>} allSubtasks - Array of subtasks.
 */
function settimeoutForBigTask(i, allSubtasks){
  setTimeout(() => {
    document.getElementById(`bigtask${i}`).classList.add("animation");
    activateCheckboxIfClickedBefore(i, allSubtasks);
  }, 100);
}

/**
 * Generates HTML for subtasks in a big task.
 * @param {number} i - Index of the task.
 * @param {Array<string>} allSubtasks - Array of subtasks.
 * @returns {string} - HTML string representing subtasks.
 */
function showSubtasksInBigTask(i, allSubtasks){
  let subtaskHTML = "";
  for (let j = 0; j < allSubtasks.length; j++) {
    const checkboxId = `subtaskCheckbox${i}-${j}`;
    subtaskHTML += `<div class="flex-board gap-16 padding-left-4">
        <label class="checkbox-container">
        <input onclick="checkBOXClick('${checkboxId}', ${i}, ${j})" type="checkbox" id="${checkboxId}">
            <span class="checkmark"></span>
        </label>
        <p class="checkbox-p">${allSubtasks[j]}</p>
        </div>`;
  }
  return subtaskHTML;
}

/**
 * Generates HTML for displaying a big task.
 * @param {number} i - Index of the task.
 * @param {string} title - Title of the task.
 * @param {string} description - Description of the task.
 * @param {string} dueDate - Due date of the task.
 * @param {string} priority - Priority of the task.
 * @param {string} priorityIcon - URL of the priority icon.
 * @param {string} subtaskHTML - HTML for subtasks.
 * @returns {string} - HTML string representing the big task.
 */
function generateBigTaskHTML(
  i,
  title,
  description,
  dueDate,
  priority,
  priorityIcon,
  subtaskHTML
) {
  return `
    <div id='bigtask${i}' class="tasks-board-big">
    <div class="space-between-board">
        <div id="user-technical-big${i}"></div>
        <img class="close-icon" onclick="closeTaskInBig(${i})" src="./assets/img/close.png">
    </div>
    <div class="name-of-task-board"><span id="user-technical-big{i}" class="name-of-task-board-big">${title}</span><p class="name-of-task-board-big-p">${description}</p></div>
    <div class="due-date-priority margin-top-16">
        <span>Due date:</span>
        <p>${dueDate}</p>
    </div>
    <div class="due-date-priority margin-top-16">
        <span>Priority:</span>
        <div class="priority-div">
            <p>${priority}</p>
            <img src="${priorityIcon}">
        </div>
    </div>
    <div class="assigned-to margin-top-16">
        <span>Assigned To:</span>
        <div class="assigned-to-contacts" id="assigned-to-contacts${i}">
        </div>
    </div>
    <div class="assigned-to margin-top-16">
        <span>Subtasks</span>
        ${subtaskHTML}
    </div>
    <div class="last-line margin-top-16">
    <img onclick="deleteTask(${i})" src="./assets/img/delete (1).png" onmouseover="this.src='./assets/img/deleteHover.png'; this.style.cursor='pointer';" onmouseout="this.src='./assets/img/delete (1).png';">
        <div class="vertical-line-board"></div>
        <img onclick="editTask(${i})" src="./assets/img/edit (1).png" onmouseover="this.src='./assets/img/editHover.png'; this.style.cursor='pointer';" onmouseout="this.src='./assets/img/edit (1).png';">
    </div>`;
}

/**
 * Array for completed subtasks.
 * @type {Array<Object>}
 */
let subTaskCheckBox = [];

/**
 * Activates checkboxes for subtasks that were clicked before.
 * @param {number} i - Index of the task.
 * @param {Array<string>} allSubtasks - Array of subtask names.
 */
function activateCheckboxIfClickedBefore(i, allSubtasks) {
  subTaskCheckBox = JSON.parse(localStorage.getItem("subTaskCheckBox")) || [];
  for (let j = 0; j < allSubtasks.length; j++) {
    let checkboxId = `subtaskCheckbox${i}-${j}`;
    if (subTaskCheckBox.includes(checkboxId)) {
      if(document.getElementById(checkboxId)){
      document.getElementById(checkboxId).checked = true;
    }
      tasks[i]["subTasks"][j]["done"] = true;
    } else {
      tasks[i]["subTasks"][j]["done"] = false;
    }
  }
}

/**
 * Gets the number of completed subtasks for a task.
 * @param {Array<Object>} SUBTASKS - Array of subtasks.
 * @param {number} i - Index of the task.
 * @returns {number} - Number of completed subtasks.
 */
function getCompletedSubtasks(SUBTASKS, i){
  let completedSubtasks = 0;
    for (let j = 0; j < SUBTASKS.length; j++) {
      let checkboxId = `subtaskCheckbox${i}-${j}`;
      if (subTaskCheckBox.includes(checkboxId)) {
        tasks[i]["subTasks"][j]["done"] = true;
        completedSubtasks++;
      } else {
        tasks[i]["subTasks"][j]["done"] = false;
      }
    }
    return completedSubtasks;
}

/**
 * Generates the width of the progress bar based on completed subtasks.
 * @param {number} i - Index of the task.
 * @param {number} completedSubtasks - Number of completed subtasks.
 * @param {Array<Object>} SUBTASKS - Array of subtasks.
 */
function generateWidthOfProgressBar(i, completedSubtasks, SUBTASKS){
  let progressPercentage = (completedSubtasks / SUBTASKS.length) * 100;
    document.getElementById(
      `progressbar${i}`
    ).style.width = `${progressPercentage}%`;
    document.getElementById(`completedSubTasks${i}`).innerHTML =
      completedSubtasks;
}

/**
 * Calculates and updates the progress bar for all tasks.
 * @returns {Promise<void>}
 */
async function calculateProgressBar() {
  subTaskCheckBox = JSON.parse(localStorage.getItem("subTaskCheckBox")) || [];
  for (let i = 0; i < tasks.length; i++) {
    const SUBTASKS = tasks[i]["subTasks"];
    if (SUBTASKS.length === 0) {
      document.getElementById(`progressbar${i}`).style.width = "0px";
      document.getElementById(`completedSubTasks${i}`).innerHTML = 0;
      continue;
    }
    let completedSubtasks = getCompletedSubtasks(SUBTASKS, i);
   generateWidthOfProgressBar(i, completedSubtasks, SUBTASKS);
  }
}

/**
 * Handles click event on subtask checkbox.
 * @param {string} checkboxId - ID of the checkbox.
 * @param {number} i - Index of the task.
 * @param {number} j - Index of the subtask.
 */
function checkBOXClick(checkboxId, i, j) {
  subTaskCheckBox = JSON.parse(localStorage.getItem("subTaskCheckBox")) || [];
  const index = subTaskCheckBox.indexOf(checkboxId);
  if (index !== -1) {
    subTaskCheckBox.splice(index, 1);
    tasks[i]["subTasks"][j]["done"] = false;
  } else {
    subTaskCheckBox.push(checkboxId);
    tasks[i]["subTasks"][j]["done"] = true;
  }
  localStorage.setItem("subTaskCheckBox", JSON.stringify(subTaskCheckBox));
}

/**
 * Deletes a task from the tasks array.
 * @param {number} i - Index of the task to delete.
 * @returns {Promise<void>}
 */
async function deleteTask(i) {
  tasks.splice(i, 1);
  await setItem("task", tasks);
  initBoard();
}

/**
 * Edits a task by displaying it in edit mode.
 * @param {number} i - Index of the task to edit.
 * @returns {Promise<void>}
 */
async function editTask(i) {
  let {
    TASK,
    category2,
    title,
    description,
    dueDate,
    priority,
    priorityIcon,
    allSubtasks,
    assignedTo,
    bgColor,
  } = await initVariablesForShowTasks(i);
  let initials = await initialOfAssignTo(assignedTo);
  priority = priority.toLowerCase();
  showEditTask(i);
  setValuesInForm(i, title, description, dueDate);
  addSubtasksToEditHTML(allSubtasks, i);
  addCirclesEditHTML(i, initials, bgColor);
  proofPrio(priority, i);
 showNamesWhenClickAssignedTo();
  renderNames(users);
  renderSelectedContacts();
  selectContactStyleChanger();
}

/**
 * Displays a task in edit mode.
 * @param {number} i - Index of the task.
 */
function showEditTask(i){
  let content = document.getElementById("section-board-overlay");
  content.innerHTML = "";
  content.innerHTML = editTaskHTML(i);
}

/**
 * Adds circles representing assigned contacts to the edit task form.
 * @param {number} i - Index of the task.
 * @param {Array<string>} initials - Array of initials.
 * @param {Array<string>} bgColor - Array of background colors.
 */
function addCirclesEditHTML(i, initials, bgColor){
  let circlesHTML = document.getElementById(`selectedContactsContainer${i}`);
  for (let j = 0; j < initials.length; j++) {
    circlesHTML.innerHTML += `<div class="circle-board margin-left-9px colorWhite" style="background-color:${bgColor[j]}">${initials[j]}</div>`;
  }
}

/**
 * Sets values in the edit task form.
 * @param {number} i - Index of the task.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} dueDate - Due date of the task.
 */
function setValuesInForm(i, title, description, dueDate){
  document.getElementById(`title-id${i}`).value = title;
  document.getElementById(`description-id${i}`).value = description;
  document.getElementById(`duedate-id${i}`).value = dueDate;
}

/**
 * Adds subtasks to the edit task form.
 * @param {Array<string>} allSubtasks - Array of subtask names.
 * @param {number} i - Index of the task.
 */
function addSubtasksToEditHTML(allSubtasks, i){
  for (let j = 0; j < allSubtasks.length; j++) {
    let subtask = allSubtasks[j];
    document.getElementById(
      `subtask-container${i}`
    ).innerHTML += `<div id="showSubtask${i}-${j}" class="space-between-board subtask-div">${subtask}
    <div class="visibility flex-board"><img onclick="deleteSubtask(${i}, ${j})" id="delete-icon-edit${i}-${j}" src="./assets/img/delete.png"><div class="grey-line"></div><img onclick="editSubtask(${i}, ${j})" id="pencil-icon-edit${i}-${j}" src="./assets/img/edit.png"></div>`;
  }
}

/**
 * Deletes a subtask from the task's subtasks array.
 * @param {number} i - Index of the task.
 * @param {number} j - Index of the subtask to delete.
 * @returns {Promise<void>}
 */
async function deleteSubtask(i, j) {
  let subtasks = tasks[i]["subTasks"];
  subtasks.splice(j, 1);
  await setItem("task", JSON.stringify(tasks));
  editTask(i);
  selectContactStyleChanger();
}

/**
 * Edits a subtask in the edit task form.
 * @param {number} i - Index of the task.
 * @param {number} j - Index of the subtask to edit.
 * @returns {Promise<void>}
 */
async function editSubtask(i, j) {
  let subtask = tasks[i]["subTasks"][j]["subtaskName"];
  document.getElementById(`showSubtask${i}-${j}`).remove();
  document.getElementById(`subtask-input${i}`).value = subtask;
  let task = tasks[i]["subTasks"];
  task.splice(j, 1);
  await setItem("task", JSON.stringify(tasks));
}

/**
 * Updates the priority display in the edit task form.
 * @param {string} priority - Priority of the task.
 * @param {number} i - Index of the task.
 */
async function proofPrio(priority, i) {
  priority = priority.toLowerCase();
  removeAllClassesFromButton(i);
  if (priority === "low") {
    document.getElementById(`lowButton-id${i}`).classList.add("bg-low");
    document.getElementById(`low-img-id${i}`).src =
      "./assets/img/prioDownWhite.png";
  } else if (priority === "medium") {
    document.getElementById(`mediumButton-id${i}`).classList.add("bg-medium");
    document.getElementById(`medium-img-id${i}`).src =
      "./assets/img/prioEvenWhite.png";
  } else {
    document.getElementById(`urgentButton-id${i}`).classList.add("bg-urgent");
    document.getElementById(`urgent-img-id${i}`).src =
      "./assets/img/prioUpWhite.png";
  }
}

/**
 * Removes all classes from priority buttons and resets their icons.
 * @param {number} i - Index of the task.
 */
function removeAllClassesFromButton(i) {
  document.getElementById(`lowButton-id${i}`).classList.remove("bg-low");
  document.getElementById(`low-img-id${i}`).src = "./assets/img/prioDown.png";
  document.getElementById(`mediumButton-id${i}`).classList.remove("bg-medium");
  document.getElementById(`medium-img-id${i}`).src =
    "./assets/img/prioEven.png";
  document.getElementById(`urgentButton-id${i}`).classList.remove("bg-urgent");
  document.getElementById(`urgent-img-id${i}`).src = "./assets/img/prioUp.png";
}

/**
 * Generates the HTML content for editing a task.
 * @param {number} i - Index of the task.
 * @returns {string} - HTML content for editing a task.
 */
function editTaskHTML(i) {
  return `
    <div class="task-edit">
    <div class="column-edit">
        <span>Title</span>
        <input id="title-id${i}" class="edit-input" type="text">
    </div>
    <div class="column-edit margin-top-16">
        <span>Description</span>
        <input id="description-id${i}" class="edit-input" type="text">
    </div>
    <div class="column-edit margin-top-16">
        <span>Due date</span>
        <input id="duedate-id${i}" class="edit-input" type="date">
    </div>
    <div class="column-edit margin-top-16">
        <div class="flex-board-edit flex-board gap-16">
            <button onclick="newPrioToUrgent(${i})" id="urgentButton-id${i}" class="urgentButton-edit">Urgent<img id="urgent-img-id${i}" src="./assets/img/prioUp.png"></button>
            <button onclick="newPrioToMedium(${i})" id="mediumButton-id${i}" class="mediumButton-edit">Medium<img id="medium-img-id${i}" src="./assets/img/prioEven.png"></button>
            <button onclick="newPrioToLow(${i})" id="lowButton-id${i}" class="lowButton-edit">Low<img id="low-img-id${i}" src="./assets/img/prioDown.png"></button>
        </div>
    </div> 
    <div class="assignContactsContainerLittle margin-top-16">
    <span>Assigned to</span>
    <div class="dropdown">
        <div class="contactsInputFieldLittle">
            <input type="text" id="searchInput" class="searchInputLittle fontSize20px"
                placeholder="Search contacts" onkeyup="searchContacts()">
            <img src="./assets/img/arrow-drop-down.png" class="dropdownIcon"
                onclick="toggleDropdown()">
        </div>
        <div class="dropdownContent"></div>
        <div id="selectedContactsContainer${i}" class="selectedContactsContainer"></div>
</div>
        <div class="flex-board" id="initial-in-circle">
        </div>
    </div>
    <div class="column-edit margin-top-16">
        <span>Subtasks</span>
        <div class="relative">
            <input type="text" class="subtask-input" placeholder="Add new subtask" id="subtask-input${i}">
            <img src="./assets/img/add-subtask.png" onclick="event.stopPropagation(); activateInput()" id="add-subtask-edit" class="add-subtasks-btn-edit">
            <div id="subtask-input-actions" class="d-flex align-c add-subtasks-btn d-none">
                                <img src="./assets/img/check-blue.png" class="subtask-actions submit-input"
                                    onclick="submitSubtask(${i})" />
                                <span class="vertical-line-sub"></span>
                                <img src="./assets/img/close.png" class="subtask-actions" onclick="deactivateInput()" />
             </div>    
        </div>
        <div id="subtask-container${i}"></div>
    </div>
    <div class="saveDiv">
    <button onclick="saveChangedTask(${i})" class="ok-button">Ok <img src="./assets/img/check.png" alt=""></button>
    </div>
</div>`;
}

/**
 * Initializes variables needed to save changes to a task.
 * @param {number} i - Index of the task.
 * @returns {object} - Object containing task details.
 */
function initVariablesForSaveChangedTask(i){
  const TASK = tasks[i];
  let title = document.getElementById(`title-id${i}`).value;
  let description = document.getElementById(`description-id${i}`).value;
  let dueDate = document.getElementById(`duedate-id${i}`).value;
  let priority = TASK["priority"];
  let priorityIcon = proofPriority(priority);
  return {TASK, title, description, dueDate, priority, priorityIcon};
}

/**
 * Saves new subtasks for the edited task.
 * @param {number} i - Index of the task.
 * @param {object} TASK - Task object.
 * @returns {Array<object>} - Array of new subtasks.
 */
function saveNewSubtasks(i, TASK){
  const SUBTASK = TASK["subTasks"];
  let allSubTasks = [];
  for (let j = 0; j < SUBTASK.length; j++) {
    let subtask = document.getElementById(`showSubtask${i}-${j}`);
    let subtaskName = subtask.textContent;
    let newSubtask = {
      subtaskName: subtaskName,
      done: false,
    };
    allSubTasks.push(newSubtask);
  }
  return allSubTasks;
}

/**
 * Deletes "Guest" from the selected contacts if there are other contacts selected.
 */
function deleteGuestFromSelectedContacts(){
  if (selectedContacts.length > 1 && selectedContacts.includes("Guest")) {
    selectedContacts = selectedContacts.filter(
      (contact) => contact !== "Guest"
    );
  }
}

/**
 * Saves the changes made to a task.
 * @param {number} i - Index of the task.
 * @returns {Promise<void>}
 */
async function saveChangedTask(i) {
  let {TASK, title, description, dueDate, priority, priorityIcon} = initVariablesForSaveChangedTask(i);
  let allSubTasks = saveNewSubtasks(i, TASK);
 deleteGuestFromSelectedContacts();
  tasks[i]["title"] = title;
  tasks[i]["description"] = description;
  tasks[i]["dueDate"] = dueDate;
  tasks[i]["subTasks"] = allSubTasks;
  tasks[i]["assignedTo"] = selectedContacts;
  await setItem("task", JSON.stringify(tasks));
  showTaskInBig(i);
}

/**
 * Sets the priority of the task to "Urgent" and updates it in the storage.
 * @param {number} i - Index of the task.
 * @returns {Promise<void>}
 */
async function newPrioToUrgent(i) {
  let { TASK, title, description, dueDate, priority, priorityIcon } =
    await initVariablesForShowTasks(i);
  priority = "Urgent";
  tasks[i]["priority"] = "urgent";
  proofPrio(priority, i);
  await setItem("task", JSON.stringify(tasks));
}

/**
 * Sets the priority of the task to "Medium" and updates it in the storage.
 * @param {number} i - Index of the task.
 * @returns {Promise<void>}
 */
async function newPrioToMedium(i) {
  let { TASK, title, description, dueDate, priority, priorityIcon } =
    await initVariablesForShowTasks(i);
  priority = "Medium";
  tasks[i]["priority"] = "medium";
  proofPrio(priority, i);
  await setItem("task", JSON.stringify(tasks));
}

/**
 * Sets the priority of the task to "Low" and updates it in the storage.
 * @param {number} i - Index of the task.
 * @returns {Promise<void>}
 */
async function newPrioToLow(i) {
  let { TASK, title, description, dueDate, priority, priorityIcon } =
    await initVariablesForShowTasks(i);
  priority = "Low";
  tasks[i]["priority"] = "low";
  proofPrio(priority, i);
  await setItem("task", JSON.stringify(tasks));
}

/**
 * Closes the expanded view of a task.
 * @param {number} i - Index of the task.
 * @returns {Promise<void>}
 */
async function closeTaskInBig(i) {
  document.getElementById(`bigtask${i}`).classList.remove("animation");
  document.getElementById("body-board").style.overflow = "auto";
  setTimeout(() => {
    document
      .getElementById("section-board-overlay")
      .classList.remove("section-board-overlay"); // Verstecke das Element nach der Animation
    initBoard();
  }, 400);
}

/**
 * Proofreads the priority of the task.
 * @param {string} priority - Priority of the task.
 * @returns {Promise<string>} - Priority icon URL.
 */
async function proofPriority(priority) {
  for (let i = 0; i < priorities.length; i++) {
    priority = priority.toLowerCase();
    const PRIO = priorities[i];
    if (priority === PRIO) {
      let pic = priopics[i];
      return pic;
    }
  }
}

/**
 * Finds the ID of a category.
 * @param {string} category - Category name.
 * @returns {string} - Category ID.
 */
async function findId(category) {
  for (let i = 0; i < ids.length; i++) {
    const ID = ids[i];
    if (category === ID) {
      return ID;
    }
  }
}

/**
 * Allows dropping of draggable elements.
 * @param {Event} ev - Drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Marks the start of dragging a task.
 * @param {number} id - ID of the dragged task.
 */
function startDragging(id) {
  draggedTask = id;
}

/**
 * Moves a task to a new category.
 * @param {string} category - Category to move the task to.
 * @returns {Promise<void>}
 */
async function moveTo(category) {
  tasks[draggedTask]["category2"] = category;
  await setItem("task", JSON.stringify(tasks));
  initBoard();
}

/**
 * Highlights the drop area when an element is dragged over it.
 * @param {string} id - ID of the drop area.
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from the drop area when an element is dragged out.
 * @param {string} id - ID of the drop area.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

let newTaskNumber = 0;
let newAddedPrio = [];
let newTaskCategory;

/**
 * Adds a new task to the board based on the selected category.
 * If the window width is less than 770px, opens the add task form.
 * @param {string} selectedCategory - Selected category for the new task.
 * @returns {void}
 */
async function addTaskOnBoard(selectedCategory) {
  if (window.innerWidth < 770) {
    localStorage.setItem('selectedCategory', JSON.stringify(selectedCategory));
    openAddTask();
  } else {
    selectedContacts = [];
    newTaskCategory = selectedCategory;
   generateCSSForAddTask();
    let content = document.getElementById("overlay-add-task-board");
    content.innerHTML = addTaskOnBoardHTML(newTaskNumber);
   showAddTaskForm();
   showNamesWhenClickAssignedTo();
    renderNames(users);
  }
}

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
 * Initializes variables for a new task based on the input values.
 * @returns {Object} - Object containing new task properties.
 */
async function initVariablesForNewTask() {
  let newTitle = document.getElementById(`newTaskTitle${newTaskNumber}`).value;
  let newDescription = document.getElementById(
    `newTaskDescription${newTaskNumber}`
  ).value;
  let newDueDate = document.getElementById(`newTaskDate${newTaskNumber}`).value;
  let newCategory = document.querySelector(".categoryPicker").value;
  let newCategory2 = newTaskCategory;
  let newPriority = newAddedPrio[0];
  let newSubtasks = newTaskSubtask;
  let newAssignedTo = selectedContacts;

  return {
    newTitle,
    newDescription,
    newDueDate,
    newCategory,
    newCategory2,
    newPriority,
    newSubtasks,
    newAssignedTo,
  };
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
    newCategory2,
    newPriority,
    newSubtasks,
    newAssignedTo,
  } = await initVariablesForNewTask();
  tasks.push({
    title: newTitle,
    description: newDescription,
    dueDate: newDueDate,
    category: newCategory,
    category2: newCategory2,
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
    document.getElementById(`newTask${newTaskNumber}`).classList.add("d-none");
    initBoard();
    newTaskNumber++;
  }, 2000);
}

/**
 * Sets the priority for the new task.
 * @param {string} prio - Priority for the new task.
 * @returns {void}
 */
async function newTaskWithPrio(prio) {
  newAddedPrio.splice(0, newAddedPrio.length);
  newAddedPrio.push(prio);
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
 * Function to select a priority.
 * @param {string} priority - The selected priority.
 */
function selectPriority(priority) {
  resetButtons();
  const selectedButton = document.getElementById(priority);
  const img = selectedButton.querySelector("img");
  switch (priority) {
    case "low":
      img.src = "./assets/img/prioDownWhite.png";
      break;
    case "medium":
      img.src = "./assets/img/prioEvenWhite.png";
      break;
    case "urgent":
      img.src = "./assets/img/prioUpWhite.png";
      break;
    default:
      break;
  }
  selectedButton.classList.add(`${priority}ButtonSelected`);
}

/**
 * Function to reset priority buttons.
 */
function resetButtons() {
  document
    .querySelectorAll(".urgentButton, .mediumButton, .lowButton")
    .forEach((button) => {
      button.classList.remove(
        "urgentButtonSelected",
        "mediumButtonSelected",
        "lowButtonSelected"
      );
      const img = button.querySelector("img");
      switch (button.id) {
        case "low":
          img.src = "./assets/img/prioDown.png";
          break;
        case "medium":
          img.src = "./assets/img/prioEven.png";
          break;
        case "urgent":
          img.src = "./assets/img/prioUp.png";
          break;
        default:
          break;
      }
    });
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
 * Generates the HTML for adding a task on the board.
 * @param {number} newTaskNumber - Index of the new task.
 * @returns {string} - HTML markup for adding a task on the board.
 */
function addTaskOnBoardHTML(newTaskNumber) {
  return `
    <div id="newTask${newTaskNumber}" class="addTaskContentContainerBoard">
    <div class="headlineAddTaskContainerBoard space-between-board">
        <h1 class="headlineAddTask">Add Task</h1>
        <img onclick="closeAddTask(${newTaskNumber})" src="./assets/img/close.png" class="close-task">
    </div>

    <form id="addTaskForm" onsubmit="createNewTask(); return false">
        <div class="leftAddTaskContainer fontSize20px">
            <div class="titleContainer">
                <div class="flex-start-board">
                    <span>Title</span>
                    <p class="redText">*</p>
                </div>
                <input required class="titleInputAddTask fontSize20px" id="newTaskTitle${newTaskNumber}" type="text"
                    placeholder="Enter a title">
            </div>

            <div class="descriptionContainer">
                <span>Description</span>
                <textarea class="descriptionTextArea fontSize20px" name="" id="newTaskDescription${newTaskNumber}" cols="30" rows="10"
                    placeholder="Enter a Description"></textarea>
            </div>

            <div class="assignContactsContainer">
            <span>Assigned to</span>
            <div class="dropdown">
                <div class="contactsInputField">
                    <input type="text" id="searchInput" class="searchInput fontSize20px"
                        placeholder="Search contacts" onkeyup="searchContactsAddTask()">
                    <img src="./assets/img/arrow-drop-down.png" class="dropdownIcon"
                        onclick="toggleDropdown()">
                </div>
                <div class="dropdownContent"></div>
                <div id="selectedContactsContainer" class="selectedContactsContainer"></div>
            </div>
        </div>
        </div>

        <div class="addTaskDividingBar"></div>

        <div class="rightAddTaskContainer fontSize20px">
            <div class="taskDateContainer">
                <div class="flex-start-board">
                    <span>Due Date</span>
                    <p class="redText">*</p>
                </div>
                <input required class="dateInput fontSize20px" id="newTaskDate${newTaskNumber}" type="date" id="date">
            </div>
            <div class="prioPickerContainer">
                <span>Prio</span>
                <div class="prioPickerButtonsContainer">
                    <button type="button" class="urgentButton fontSize20px" id="urgent"
                        onclick="selectPriority('urgent'); newTaskWithPrio('urgent')">Urgent <img src="./assets/img/prioUp.png"></button>
                    <button type="button" class="mediumButton fontSize20px mediumButtonSelected" id="medium"
                        onclick="selectPriority('medium'); newTaskWithPrio('medium')">Medium <img src="./assets/img/prioEven.png"></button>
                    <button type="button" class="lowButton fontSize20px" id="low"
                        onclick="selectPriority('low'); newTaskWithPrio('low')">Low <img src="./assets/img/prioDown.png"></button>
                </div>
            </div>
            <div class="categoryContainer">
                <div class="flex-start-board">
                    <span>Category</span>
                    <p class="redText">*</p>
                </div>
                <select required class="categoryPicker fontSize20px" id="category" name="category">
                    <option value="1" disabled selected hidden>Select task category</option>
                    <option value="User Story">User Story</option>
                    <option value="Technical Task">Technical Task</option>
                </select>
            </div>

            <div class="input-container">
            <div class="">
            <input type="text" id="subtask-input" class="subtask-input fontSize20px" autocomplete="off" placeholder="Add new subtask" onkeydown="checkSubmit(event)" size="10">
            <img src="./assets/img/add-subtask.png" onclick="event.stopPropagation();  activateInputForCreateTask(); setFocus()" id="add-subtask" class="add-subtasks-btn">
            <div id="subtask-input-Actions" class="d-flex align-c add-subtasks-btn d-none">
                                <img src="./assets/img/check-blue.png" class="subtask-actions submit-input"
                                    onclick="submitSubtaskForNewTask()" />
                                <span class="vertical-line-sub"></span>
                                <img src="./assets/img/close.png" class="subtask-actions" onclick="deactivateInputForCreateTask()" />
                            </div>
                <div id="addedNewSubtasks"></div>
        </div>
                <ul class="subtask-container-board"></ul>
            </div>

        </div>
        <div class="fieldRequiredText">
            <div class="flex-start-board">
                <p class="redText">*</p>
                <span>This field is required</span>
            </div>
        </div>
        <div class="clearCreateButtonsContainer">
            <button type="button" class="clearButton" onclick="clearForm()">Clear <img
                    src="./assets/img/iconoir_cancel.png" alt=""></button>
            <div class="fieldRequiredText2">
                        <p class="redText">*</p>
                        <span>This field is required</span>
                </div>
            <button type="submit" class="createButton" id="createTaskButton">Create Task <img
                    src="./assets/img/check.png" alt=""></button>

        </div>
    </form>

</div>`;
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

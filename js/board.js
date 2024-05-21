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
  removeBigTaskBeforeInitAllTasks();
  await showTasks();
  await calculateProgressBar();
  checkEmptyTasks();
  newTaskSubtask = [];
}

/**
 * Removes the big task before initializing all tasks.
 * @param {number} i - Index of the task.
 */
function removeBigTaskBeforeInitAllTasks(){
  for (let i = 0; i < tasks.length+1; i++) {
  if (document.getElementById(`bigtask${i}`)) {
    document.getElementById(`bigtask${i}`).classList.add("d-none");
  }
}}

function shortenDescriptionIfTooLong(i){
  let description = document.getElementById(`description${i}`);
  if (description.textContent.length > 50) {
    description.textContent = description.textContent.substring(0, 50) + '...';
}
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
 * Generates CSS before displaying a big task.
 */
function generateCSSBeforeBigTaskIsShowed(){
  document
    .getElementById("section-board-overlay")
    .classList.add("section-board-overlay");
  document.getElementById("body-board").style.overflow = "hidden";
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
  if(document.getElementById(
    `progressbar${i}`
  )){
    document.getElementById(
      `progressbar${i}`
    ).style.width = `${progressPercentage}%`;
    document.getElementById(`completedSubTasks${i}`).innerHTML =
      completedSubtasks;
  }
}

/**
 * Calculates and updates the progress bar for all tasks.
 * @returns {Promise<void>}
 */
async function calculateProgressBar() {
  subTaskCheckBox = JSON.parse(localStorage.getItem("subTaskCheckBox")) || [];
  for (let i = 0; i < tasks.length; i++) {
    const SUBTASKS = tasks[i]["subTasks"];
    if (SUBTASKS.length === 0 && document.getElementById(`progressbar-background${i}`)) {
      document.getElementById(`progressbar-background${i}`).style.display = 'none';
      document.getElementById(`completedSubTasks${i}`).innerHTML = 0;
      continue;
    }
    let completedSubtasks = getCompletedSubtasks(SUBTASKS, i);
   generateWidthOfProgressBar(i, completedSubtasks, SUBTASKS);
  }
}

async function calculateProgressBarForOneTask(i){
  subTaskCheckBox = JSON.parse(localStorage.getItem("subTaskCheckBox")) || [];
    const SUBTASKS = tasks[i]["subTasks"];
    if (SUBTASKS.length === 0 && document.getElementById(`progressbar-background${i}`)) {
      document.getElementById(`progressbar-background${i}`).style.display = 'none';
      document.getElementById(`completedSubTasks${i}`).innerHTML = 0;
    }
    let completedSubtasks = getCompletedSubtasks(SUBTASKS, i);
   generateWidthOfProgressBar(i, completedSubtasks, SUBTASKS);
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
  let currentWorkflow = tasks[i]["workflow"];
  taskCounts[currentWorkflow] - 2;
  await countTasks(currentWorkflow);
  let taskElement = document.getElementById(`task${i}`);
  taskElement.remove();
  checkEmptyTasks();
  tasks.splice(i, 1);
  await setItem("task", tasks);
  document.getElementById(`bigtask${i}`).classList.remove("animation");
  document.getElementById("body-board").style.overflow = "auto";
  document.getElementById("section-board-overlay").classList.remove("section-board-overlay"); 
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
 * Closes the expanded view of a task.
 * @param {number} i - Index of the task.
 * @returns {Promise<void>}
 */
async function closeTaskInBig(i) {
  let taskElement = document.getElementById(`task${i}`);
  taskElement.remove();
  document.getElementById(`bigtask${i}`).classList.remove("animation");
  document.getElementById("body-board").style.overflow = "auto";
  setTimeout(() => {
    document
      .getElementById("section-board-overlay")
      .classList.remove("section-board-overlay"); // Verstecke das Element nach der Animation
      addOneTaskToBoard(i);
  }, 400);
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
  let currentWorkflow = tasks[draggedTask]["workflow"];
  tasks[draggedTask]["workflow"] = category;
  await setItem("task", JSON.stringify(tasks));
  let taskElement = document.getElementById(`task${draggedTask}`);
  taskElement.remove();
  taskCounts[currentWorkflow]--;
  await addOneTaskToBoard(draggedTask);
  removeHighlight(category);
  checkEmptyTasks();
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

async function closeEdit(i){
  showTaskInBig(i);
}
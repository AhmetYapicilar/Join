let ids = ["To-Do", "In-Progress", "Await-Feedback", "Done"];
let priorities = ["low", "medium", "urgent"];
let priopics = [
  "./assets/img/arrow-down-icon.png",
  "./assets/img/equal-sign-icon.png",
  "./assets/img/arrow-up-icon.png",
];
let taskCounts = {
  "To-Do": 0,
  "In-Progress": 0,
  "Await-Feedback": 0,
  Done: 0,
};
let draggedTask;
let users = [];
let selectedContacts = [];

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (event) {
      const dropdownContent = document.querySelector('.dropdownContent');
      const dropdownIcon = document.querySelector('.dropdownIcon');
      const clickedElement = event.target;

      const isDropdownContentClicked = dropdownContent && dropdownContent.contains(clickedElement);
      const isDropdownIconClicked = dropdownIcon && dropdownIcon.contains(clickedElement);

      if (!isDropdownContentClicked && !isDropdownIconClicked && dropdownContent) {
          dropdownContent.classList.remove('show');
      }
  });
});



async function initBoard() {
  removeAllClassesWhenInit();
  for (let x = 0; x < ids.length; x++) {
    let category = ids[x];
    taskCounts[category] = 0;
    let contentBefore = document.getElementById(`${ids[x]}`);
    contentBefore.classList.remove("drag-area-highlight");
    contentBefore.innerHTML = "";
  }
  await loadUsers();
  await loadTasks();
  await showTasks();
  await calculateProgressBar();
  checkEmptyTasks();
}


function removeAllClassesWhenInit() {
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

async function loadUsers() {
  users = JSON.parse(await getItem("users"));
}

function checkEmptyTasks() {
  for (let i = 0; i < ids.length; i++) {
    const ID = ids[i];
    let content = document.getElementById(ID);
    if (content.innerHTML === "") {
      content.innerHTML = `<div class="no-tasks-board">No tasks available</div>`;
    }
  }
}

async function showTasks() {
  for (let i = 0; i < tasks.length; i++) {
    if (document.getElementById(`bigtask${i}`)) {
      document.getElementById(`bigtask${i}`).classList.add("d-none");
    }
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
    let content = document.getElementById(category2);
    content.innerHTML += generateShowTasksHTML(
      i,
      title,
      description,
      priorityIcon,
      allSubtasks,
      initials,
      bgColor
    );
    userStoryOrTechnicalTask(TASK, i);
  }
  activateCheckboxIfClickedBefore;
}

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

async function initVariableBgColor(newContact) {
  const index = users.findIndex(user => user.name === newContact);
  let bgColor;
  if (index !== -1 && users[index].Color) {
    bgColor = users[index].Color;
  } else {
    bgColor = "#FF7A00";
  }
  return bgColor;
}

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

function generateShowTasksHTML(
  i,
  title,
  description,
  priorityIcon,
  allSubtasks,
  initials,
  bgColor
) {
  let circlesHTML = "";
  for (let j = 0; j < initials.length; j++) {
    circlesHTML += `<div class="circle-board margin-left-9px colorWhite" style="background-color:${bgColor[j]}">${initials[j]}</div>`;
  }
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

async function countTasks(category) {
  taskCounts[category]++;
  await setItem("taskCount", JSON.stringify(taskCounts));
}

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

let foundedTasks = [];

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
  document
    .getElementById("section-board-overlay")
    .classList.add("section-board-overlay");
  document.getElementById("body-board").style.overflow = "hidden";
  let content = document.getElementById("section-board-overlay");
  content.innerHTML = generateBigTaskHTML(
    i,
    title,
    description,
    dueDate,
    priority,
    priorityIcon,
    allSubtasks,
    assignedTo,
    bgColor,
    
  );
  userStoryOrTechnicalTaskBig(TASK, i);
  setTimeout(() => {
    document.getElementById(`bigtask${i}`).classList.add("animation");
    activateCheckboxIfClickedBefore(i, allSubtasks);
  }, 100);
  selectedContacts = [];
  let circlesHTML = document.getElementById(`assigned-to-contacts${i}`);
  for(let x=0; x<initials.length; x++){
  circlesHTML.innerHTML += `<div class="flex-board">
                              <div class="circle-board-big" style="background-color:${bgColor[x]}">${initials[x]}</div>
                              <span class="contact-name">${assignedTo[x]}</span>
                            </div>`;
  selectedContacts.push(assignedTo[x]);
  }
}

function generateBigTaskHTML(
  i,
  title,
  description,
  dueDate,
  priority,
  priorityIcon,
  allSubtasks
) {
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

let subTaskCheckBox = [];

function activateCheckboxIfClickedBefore(i, allSubtasks) {
  subTaskCheckBox = JSON.parse(localStorage.getItem("subTaskCheckBox")) || [];
  for (let j = 0; j < allSubtasks.length; j++) {
    let checkboxId = `subtaskCheckbox${i}-${j}`;
    if (subTaskCheckBox.includes(checkboxId)) {
      document.getElementById(checkboxId).checked = true;
      tasks[i]["subTasks"][j]["done"] = true;
    } else {
      tasks[i]["subTasks"][j]["done"] = false;
    }
  }
}

async function calculateProgressBar() {
  subTaskCheckBox = JSON.parse(localStorage.getItem("subTaskCheckBox")) || [];
  for (let i = 0; i < tasks.length; i++) {
    const SUBTASKS = tasks[i]["subTasks"];
    if (SUBTASKS.length === 0) {
      document.getElementById(`progressbar${i}`).style.width = "0px";
      document.getElementById(`completedSubTasks${i}`).innerHTML = 0;
      continue;
    }
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
    let progressPercentage = (completedSubtasks / SUBTASKS.length) * 100;
    document.getElementById(
      `progressbar${i}`
    ).style.width = `${progressPercentage}%`;
    document.getElementById(`completedSubTasks${i}`).innerHTML =
      completedSubtasks;
  }
}

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

async function deleteTask(i) {
  tasks.splice(i, 1);
  await setItem("task", tasks);
  initBoard();
}

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
  let content = document.getElementById("section-board-overlay");
  content.innerHTML = "";
  content.innerHTML = editTaskHTML(i);
  document.getElementById(`title-id${i}`).value = title;
  document.getElementById(`description-id${i}`).value = description;
  document.getElementById(`duedate-id${i}`).value = dueDate;
  for (let j = 0; j < allSubtasks.length; j++) {
    let subtask = allSubtasks[j];
    document.getElementById(`subtask-container${i}`).innerHTML += `<div id="showSubtask${i}-${j}" class="space-between-board subtask-div">${subtask}
    <div class="visibility flex-board"><img onclick="deleteSubtask(${i}, ${j})" id="delete-icon-edit${i}-${j}" src="./assets/img/delete.png"><div class="grey-line"></div><img onclick="editSubtask(${i}, ${j})" id="pencil-icon-edit${i}-${j}" src="./assets/img/edit.png"></div>`;
}
let circlesHTML = document.getElementById(`selectedContactsContainer${i}`);
for (let j = 0; j < initials.length; j++) {
  circlesHTML.innerHTML += `<div class="circle-board margin-left-9px colorWhite" style="background-color:${bgColor[j]}">${initials[j]}</div>`;
}
  proofPrio(priority, i);
    setTimeout(() => {
      document.addEventListener('DOMContentLoaded', function () {
      const dropdownIcon = document.querySelector('.dropdownIcon');
      dropdownIcon.addEventListener('click', function (event) {
        event.preventDefault();
    }, 50);
    });
  });
  renderNames(users);
  renderSelectedContacts();
  }

async function deleteSubtask(i, j){
  let subtasks = tasks[i]['subTasks'];
  subtasks.splice(j, 1);
  await setItem("task", JSON.stringify(tasks));
  editTask(i);
}

async function editSubtask(i, j){
  let subtask = tasks[i]['subTasks'][j]['subtaskName'];
  document.getElementById(`showSubtask${i}-${j}`).remove();
  document.getElementById(`subtask-input${i}`).value = subtask;
  let task = tasks[i]['subTasks'];
  task.splice(j, 1);
  await setItem("task", JSON.stringify(tasks));
}


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

function removeAllClassesFromButton(i) {
  document.getElementById(`lowButton-id${i}`).classList.remove("bg-low");
  document.getElementById(`low-img-id${i}`).src = "./assets/img/prioDown.png";
  document.getElementById(`mediumButton-id${i}`).classList.remove("bg-medium");
  document.getElementById(`medium-img-id${i}`).src =
    "./assets/img/prioEven.png";
  document.getElementById(`urgentButton-id${i}`).classList.remove("bg-urgent");
  document.getElementById(`urgent-img-id${i}`).src = "./assets/img/prioUp.png";
}

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

async function saveChangedTask(i) {
  const TASK = tasks[i];
  let title = document.getElementById(`title-id${i}`).value;
  let description = document.getElementById(`description-id${i}`).value;
  let dueDate = document.getElementById(`duedate-id${i}`).value;
  let priority = TASK["priority"];
  let priorityIcon = proofPriority(priority);
  let allSubTasks = [];
  const SUBTASK = TASK['subTasks'];
  for (let j = 0; j < SUBTASK.length; j++) {
    let subtask = document.getElementById(`showSubtask${i}-${j}`);
    let subtaskName = subtask.textContent;
    let newSubtask = {
      subtaskName: subtaskName,
      done: false,
  };
  allSubTasks.push(newSubtask);
  }
  if(selectedContacts.length>1 && selectedContacts.includes('Guest')){
    selectedContacts = selectedContacts.filter(contact => contact !== 'Guest');
  }
  tasks[i]["title"] = title;
  tasks[i]["description"] = description;
  tasks[i]["dueDate"] = dueDate;
  tasks[i]["subTasks"] = allSubTasks;
  tasks[i]['assignedTo'] = selectedContacts;
  await setItem("task", JSON.stringify(tasks));
  showTaskInBig(i);
}

async function newPrioToUrgent(i) {
  let { TASK, title, description, dueDate, priority, priorityIcon } =
    await initVariablesForShowTasks(i);
  priority = "Urgent";
  tasks[i]["priority"] = "urgent";
  proofPrio(priority, i);
  await setItem("task", JSON.stringify(tasks));
}

async function newPrioToMedium(i) {
  let { TASK, title, description, dueDate, priority, priorityIcon } =
    await initVariablesForShowTasks(i);
  priority = "Medium";
  tasks[i]["priority"] = "medium";
  proofPrio(priority, i);
  await setItem("task", JSON.stringify(tasks));
}

async function newPrioToLow(i) {
  let { TASK, title, description, dueDate, priority, priorityIcon } =
    await initVariablesForShowTasks(i);
  priority = "Low";
  tasks[i]["priority"] = "low";
  proofPrio(priority, i);
  await setItem("task", JSON.stringify(tasks));
}

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

async function findId(category) {
  for (let i = 0; i < ids.length; i++) {
    const ID = ids[i];
    if (category === ID) {
      return ID;
    }
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function startDragging(id) {
  draggedTask = id;
}

async function moveTo(category) {
  tasks[draggedTask]["category2"] = category;
  await setItem("task", JSON.stringify(tasks));
  initBoard();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

let newTaskNumber = 0;
let newAddedPrio = [];
let newTaskCategory;

async function addTaskOnBoard(selectedCategory) {
  newTaskCategory = selectedCategory;
  document
    .getElementById("overlay-add-task-board")
    .classList.add("overlay-add-task-board");
  document.getElementById("body-board").style.overflow = "hidden";
  let content = document.getElementById("overlay-add-task-board");
  content.innerHTML = addTaskOnBoardHTML(newTaskNumber);
  setTimeout(() => {
    document
      .getElementById(`newTask${newTaskNumber}`)
      .classList.add("showAddTask");
  }, 100);
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
      const dropdownIcon = document.querySelector('.dropdownIcon');
      dropdownIcon.addEventListener('click', function (event) {
        event.preventDefault();
    }, 50);
    });
  });
  renderNames(users);
}

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
    newAssignedTo
  };
}

async function createNewTask() {
  let {
    newTitle,
    newDescription,
    newDueDate,
    newCategory,
    newCategory2,
    newPriority,
    newSubtasks,
    newAssignedTo
  } = await initVariablesForNewTask();
  tasks.push({
    title: newTitle,
    description: newDescription,
    dueDate: newDueDate,
    category: newCategory,
    category2: newCategory2,
    priority: newPriority,
    subTasks: newSubtasks,
    assignedTo: newAssignedTo
  });
  await setItem("task", JSON.stringify(tasks));
  showTaskIsAdded();
  newTaskSubtask = [];
}

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

async function newTaskWithPrio(prio) {
  newAddedPrio.splice(0, newAddedPrio.length);
  newAddedPrio.push(prio);
}

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

function resetButtons() {
  document.querySelectorAll('.urgentButton, .mediumButton, .lowButton').forEach(button => {
      button.classList.remove('urgentButtonSelected', 'mediumButtonSelected', 'lowButtonSelected');
      const img = button.querySelector('img');
      switch (button.id) {
          case 'low':
              img.src = './assets/img/prioDown.png';
              break;
          case 'medium':
              img.src = './assets/img/prioEven.png';
              break;
          case 'urgent':
              img.src = './assets/img/prioUp.png';
              break;
          default:
              break;
      }
  });
}

function activateInput() {
  let addSubtask = document.getElementById("add-subtask-edit");
  let subtasksInputActions = document.getElementById("subtask-input-actions");

  addSubtask.classList.add("d-none");
  subtasksInputActions.classList.remove("d-none");
}

function activateInputForCreateTask() {
  let addSubtask = document.getElementById("add-subtask");
  let subtasksInputActions = document.getElementById("subtask-input-Actions");

  addSubtask.classList.add("d-none");
  subtasksInputActions.classList.remove("d-none");
}

function checkSubmit(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitSubtask();
  }
}

function deactivateInput(i) {
  let addSubtask = document.querySelector("#add-subtask-edit");
  let subtasksInputActions = document.querySelector("#subtask-input-actions");

  addSubtask.classList.remove("d-none");
  subtasksInputActions.classList.add("d-none");
  document.getElementById(`subtask-input${i}`).value = "";
}

function deactivateInputForCreateTask(){
  let addSubtask = document.getElementById("add-subtask");
  let subtasksInputActions = document.getElementById("subtask-input-Actions");

  addSubtask.classList.remove("d-none");
  subtasksInputActions.classList.add("d-none");
  document.getElementById('subtask-input').value = "";
}

function setFocus() {
  document.getElementById("subtask-input").focus();
}

async function submitSubtask(i) {
  if (tasks[i]['subTasks'] && tasks[i]['subTasks'].length >= 6) {
    alert(
      "Maximale Anzahl von Subtasks erreicht. Neue Subtasks können nicht hinzugefügt werden."
    );
    return;
  }
  let subtaskContent = document.getElementById(`subtask-input${i}`).value;
  if (subtaskContent == "") {
    deactivateInput();
  } else {
    const SUBTASK = tasks[i]['subTasks'];
    let newSubtask = {
      subtaskName: subtaskContent,
      done: false,
  };
  SUBTASK.push(newSubtask);
    await setItem("task", JSON.stringify(tasks));
    editTask(i);
    };
    
    subtaskContent = "";
    deactivateInput(i);
  }

  let newTaskSubtask = [];

function submitSubtaskForNewTask(){
  let subtask = document.getElementById('subtask-input').value;
  let createdSubtask = {
    subtaskName: subtask,
    done: false
  }
  newTaskSubtask.push(createdSubtask);
  document.getElementById('addedNewSubtasks').innerHTML = '';
  for(let x=0; x<newTaskSubtask.length; x++){
  document.getElementById('addedNewSubtasks').innerHTML += `<div>${newTaskSubtask[x]['subtaskName']}</div>`;
  }
  document.getElementById('subtask-input').value = '';
}

function clearForm(){
  let form = document.getElementById("addTaskForm");
  form.reset();
  newSubtask = [];
  document.getElementById('addedNewSubtasks').innerHTML = '';
  selectPriority('medium');
}


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
            <button type="submit" class="createButton" id="createTaskButton">Create Task <img
                    src="./assets/img/check.png" alt=""></button>

        </div>
    </form>

</div>`;
}

function toggleDropdown() {
  const dropdownContent = document.querySelector('.dropdownContent');
  const isOpen = dropdownContent.classList.contains('show');

  if (!isOpen) {
      dropdownContent.classList.add('show');
  } else {
      dropdownContent.classList.remove('show');
  }
}



function renderNames(users) {
  const dropdownContent = document.querySelector('.dropdownContent');
  dropdownContent.innerHTML = '';
  const nameSet = new Set();
  const filteredUsers = [];

  users.forEach(user => {
      const name = user.name || user.Name;
      if (name && !nameSet.has(name)) {
          nameSet.add(name);
          dropdownContent.innerHTML += `<span onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
          filteredUsers.push(user);
      }
  });
  users.push(...filteredUsers);
}

function searchContacts() {
  const searchInput = document.querySelector('.searchInputLittle');
  const filter = searchInput.value.trim().toUpperCase();
  const dropdownContent = document.querySelector('.dropdownContent');
  dropdownContent.innerHTML = '';

  for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const name = user.name || user.Name;
      if (name && name.toUpperCase().startsWith(filter)) {
          dropdownContent.innerHTML += `<span id="contact${i}" onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
      }
  }
  dropdownContent.classList.add('show');
  selectContactStyleChanger();
}

function searchContactsAddTask() {
  const searchInput = document.querySelector('.searchInput');
  const filter = searchInput.value.trim().toUpperCase();
  const dropdownContent = document.querySelector('.dropdownContent');
  dropdownContent.innerHTML = '';

  for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const name = user.name || user.Name;
      if (name && name.toUpperCase().startsWith(filter)) {
          dropdownContent.innerHTML += `<span id="contact${i}" onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
      }
  }
  dropdownContent.classList.add('show');
  selectContactStyleChanger();
}

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

function selectContactStyleChanger() {
  const selectedDropdownContent = document.querySelectorAll('.dropdownContent span');
  selectedDropdownContent.forEach(span => {
      const contactName = span.textContent.trim();
      const isSelected = selectedContacts.includes(contactName);
      if (isSelected) {
          span.classList.add('selectedDropdownContent');
          const img = span.querySelector('img');
          if (img) {
              img.src = './assets/img/checkbox-check-white.png';
          }
      } else {
          span.classList.remove('selectedDropdownContent');
          const img = span.querySelector('img');
          if (img) {
              img.src = './assets/img/Checkbox.png';
          }
      }
  });
}

async function renderSelectedContacts() {
  const selectedContactsContainer = document.querySelector('.selectedContactsContainer');
  selectedContactsContainer.innerHTML = '';
  const maxContactsToShow = 5;
  const remainingCount = selectedContacts.length - maxContactsToShow;
  if(selectedContacts.length>1 && selectedContacts.includes('Guest')){
    selectedContacts = selectedContacts.filter(contact => contact !== 'Guest');
  }

  for (let i = 0; i < Math.min(selectedContacts.length, maxContactsToShow); i++) {
      const contact = selectedContacts[i];
      const initials = contact.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
      const color = await initVariableBgColor(contact);
      selectedContactsContainer.innerHTML += `<div class="selectedContact" style="background-color: ${color};">${initials}</div>`;
  }

  if (remainingCount > 0) {
      selectedContactsContainer.innerHTML += `<div class="selectedContact" style="background-color: #aaa;">+${remainingCount}</div>`;
  }
}


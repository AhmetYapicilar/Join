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
      <div class="name-of-task-board"><span>${title}</span><p id="description${i}">${description}</p></div>
      <div id="progressbar-background${i}" class="space-between-board width-100percent margin-top-16">
          <div class="progressbar-background">
              <div id="progressbar${i}" class="progressbar-board" role="progressbar"></div>
          </div>
          <span class="sub-tasks"><b id="completedSubTasks${i}"></b>/<b>${allSubtasks.length}</b> Subtasks</span>
      </div>
      <div class="space-between-board width-100percent margin-top-16">
          <div style=width:135px class="flex-board">
              ${circlesHTML}
          </div>
          <img class="priority-icon-board" src="${priorityIcon}">
      </div></div>`;
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
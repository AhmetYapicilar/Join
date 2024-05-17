/**
 * Shows all tasks on the board.
 * @returns {Promise<void>}
 */
async function showTasks() {
    for (let i = 0; i < tasks.length; i++) {
      let {
        TASK,
        workflow,
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
      if (!workflow) {
        workflow = "To-Do";
      }
      await countTasks(workflow);
      let circlesHTML = addCirclesWithInitials(bgColor, initials);
      let content = document.getElementById(workflow);
      content.innerHTML += generateShowTasksHTML(
        i,
        title,
        description,
        priorityIcon,
        allSubtasks,
        circlesHTML
      );
      shortenDescriptionIfTooLong(i);
      userStoryOrTechnicalTask(TASK, i);
      activateCheckboxIfClickedBefore(i, allSubtasks);
    }
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
      workflow,
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
 * Edits a task by displaying it in edit mode.
 * @param {number} i - Index of the task to edit.
 * @returns {Promise<void>}
 */
async function editTask(i) {
    let {
      TASK,
      workflow,
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
 * Searches for tasks based on the input value.
 * @returns {Promise<void>}
 */
async function searchTask() {
 
    let search = document.getElementById("search-input1").value;
    search = search.toLowerCase();
    if (search === "") {
      initBoard();
    } else {
      await showSearchedTasks(search);
      checkEmptyTasks();
    }
  }

/**
 * Searches for tasks based on the input value for responsive Input.
 * @returns {Promise<void>}
 */
async function searchTaskResponsive() {
 
    let search = document.getElementById("search-input2").value;
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
          TASK["workflow"] === ids[i] &&
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
        workflow,
        title,
        description,
        dueDate,
        priority,
        priorityIcon,
        allSubtasks,
        assignedTo,
        bgColor,
      } = await initVariablesForShowTasks(tasks.indexOf(foundedTask));
      let initials = await initialOfAssignTo(assignedTo);
      let circlesHTML = addCirclesWithInitials(bgColor, initials);
      let content = document.getElementById(workflow);
      content.innerHTML += generateShowTasksHTML(
        tasks.indexOf(foundedTask),
        title,
        description,
        priorityIcon,
        allSubtasks,
        circlesHTML
      );
      userStoryOrTechnicalTask(TASK, tasks.indexOf(foundedTask));
    }
  }

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
     document.getElementById('overlay-add-task-board').classList.remove('d-none');
      let content = document.getElementById("overlay-add-task-board");
      content.innerHTML = addTaskOnBoardHTML(newTaskNumber);
     showAddTaskForm();
     showNamesWhenClickAssignedTo();
      renderNames(users);
    }
  }
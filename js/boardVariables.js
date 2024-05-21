/**
 * Initializes variables required for showing tasks.
 * @param {number} i - Index of the task.
 * @returns {Promise<Object>} - Object containing initialized variables.
 */
async function initVariablesForShowTasks(i) {
    const TASK = tasks[i];
    let workflow = TASK["workflow"];
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
      workflow,
      title,
      description,
      dueDate,
      priority,
      priorityIcon,
      allSubtasks,
      assignedTo,
      bgColor
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
    let newWorkflow = newTaskCategory;
    let newPriority = newAddedPrio[0];
    let newSubtasks = newTaskSubtask;
    let newAssignedTo = selectedContacts;
  
    return {
      newTitle,
      newDescription,
      newDueDate,
      newCategory,
      newWorkflow,
      newPriority,
      newSubtasks,
      newAssignedTo,
    };
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
 * Generates HTML for circles with initials of assigned users.
 * @param {Array<string>} bgColor - Array of background colors.
 * @param {Array<string>} initials - Array of initials.
 * @returns {string} - HTML string for circles.
 */
function addCirclesWithInitials(bgColor, initials){
    let circlesHTML = "";
    for (let j = 0; j < Math.min(initials.length, 5); j++) {
      circlesHTML += `<div class="circle-board margin-left-9px colorWhite" style="background-color:${bgColor[j]}">${initials[j]}</div>`;
    }
    if(initials.length>5){
      let number = initials.length - 5;
      circlesHTML += `<div class="circle-board margin-left-9px colorWhite" style="background-color:orange">+${number}</div>`;
    }
    return circlesHTML;
  }
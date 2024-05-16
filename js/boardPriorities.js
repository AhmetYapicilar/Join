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
 * Sets the priority for the new task.
 * @param {string} prio - Priority for the new task.
 * @returns {void}
 */
async function newTaskWithPrio(prio) {
    newAddedPrio.splice(0, newAddedPrio.length);
    newAddedPrio.push(prio);
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
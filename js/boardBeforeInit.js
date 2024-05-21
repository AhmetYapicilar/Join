/**
 * Array of the ids as a string.
 * @type {Array<Object>}
 */
let ids = ["To-Do", "In-Progress", "Await-Feedback", "Done"];

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
    if(document.getElementById('overlay-add-task-board')){
      document.getElementById('overlay-add-task-board').classList.add('d-none');
    }
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
/**
 * Waits for the DOM to be fully loaded, then sets the greeting name if available.
 * @param {Event} event - The DOMContentLoaded event.
 */
document.addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    let name = JSON.parse(localStorage.getItem("user-name"));
    if (name != "guest") {
      document.getElementById("greeting-name").innerHTML = name;
    }
  }, 1000);
});

/**
 * Initializes the summary by loading the task counters and displaying the task summary.
 * @returns {Promise<void>}
 */
async function initSummary() {
  await loadCountTasks();
  await showSummaryTasks();
}

/**
 * Loads the task counts from storage.
 * @returns {Promise<void>}
 */
async function loadCountTasks() {
  taskCounts = JSON.parse(await getItem("taskCount"));
}

/**
 * Array for the dates.
 * @type {Array<Object>}
 */
let dates = [];

/**
 * Displays the summary of tasks, including the number of urgent tasks and the earliest date.
 * @returns {Promise<void>}
 */
async function showSummaryTasks() {
  await showHowManyTasks();
  let urgentTasks = 0;
  await loadTasks();
  for (let i = 0; i < tasks.length; i++) {
    const TASK = tasks[i];
    if (TASK["priority"].toLowerCase() === "urgent") {
      urgentTasks++;
      dates.push(TASK["dueDate"]);
    }
  }
  document.getElementById("urgent-tasks-content").innerHTML = urgentTasks;
  document.getElementById("earliest-date-content").innerHTML = earliestDate();
}

/**
 * Displays the count of different types of tasks in the summary.
 * @returns {Promise<void>}
 */
async function showHowManyTasks() {
  document.getElementById("to-do-content").innerHTML = `${taskCounts["To-Do"]}`;
  document.getElementById("done-content").innerHTML = `${taskCounts["Done"]}`;
  let x =
    taskCounts["To-Do"] +
    taskCounts["Await-Feedback"] +
    taskCounts["In-Progress"];
  document.getElementById("tasks-in-board-content").innerHTML = x;
  document.getElementById(
    "tasks-in-progress-content"
  ).innerHTML = `${taskCounts["In-Progress"]}`;
  document.getElementById(
    "awaiting-feedback-content"
  ).innerHTML = `${taskCounts["Await-Feedback"]}`;
}

/**
 * Finds the earliest date from a list of dates and returns it in date format.
 * @returns {string} - The earliest date in date format (DD/MM/YYYY).
 */
function earliestDate() {
  // Konvertiere die Daten in Millisekunden seit dem 1. Januar 1970 (Unix-Zeitstempel)
  const dateInMilliseconds = dates.map((date) => new Date(date).getTime());

  // Finde den kleinsten Wert (das früheste Datum) mit Math.min()
  const earliestDateInMilliseconds = Math.min(...dateInMilliseconds);

  // Konvertiere den Unix-Zeitstempel zurück in ein Datum
  const earliestDate = new Date(earliestDateInMilliseconds);

  return earliestDate.toLocaleDateString();
}

/**
 * Array of the ids as a string.
 * @type {Array<Object>}
 */
let workflows = ["To-Do", "In-Progress", "Await-Feedback", "Done"];

/**
 * Array for counting the tasks in the fields.
 * @type {Array<Object>}
 */
let taskCounts = {
  "To-Do": 0,
  "In-Progress": 0,
  "Await-Feedback": 0,
  "Done": 0,
};

/**
 * Returns a greeting message based on the current time of day.
 * @returns {string} - The greeting message.
 */
function getTime() {
  let now = new Date();
  let hours = now.getHours();
  let x;
  if (hours < 17 && hours > 10) x = "Good Afternoon";
  else if (hours < 10 && hours > 4) x = "Good Morning";
  else {
    x = "Good Evening";
  }
  return x;
}

/**
 * Greets the user based on the time of the day.
 */
function greetingUser() {
  let content = document.getElementById("greeting");
  let nameToGreet = document.getElementById('greeting-name');
  let name = JSON.parse(localStorage.getItem("user-name"));
  if(name === 'Guest' || name === null){
    content.innerHTML = getTime();
  } else{
    content.innerHTML = getTime() + ',';
    nameToGreet.innerHTML = name;
  }
}

/**
 * Initializes the summary by loading the task counters and displaying the task summary.
 * @returns {Promise<void>}
 */
async function initSummary() {
  await loadTasks();
  await countTasks();
  await showSummaryTasks();
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

async function countTasks(){
  for(let x = 0; x<workflows.length; x++){
    let currentWorkflow = workflows[x];
  for(let i=0; i<tasks.length; i++){
    const TASK = tasks[i];
    let workflow = TASK['workflow'];
    if(workflow === currentWorkflow){
      taskCounts[currentWorkflow]++;
    }
    else{
      continue;
    }
  }
}
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
  for (let i = 0; i < tasks.length; i++) {
    const TASK = tasks[i];
    if (TASK["priority"] && TASK["priority"].toLowerCase() === "urgent") {
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

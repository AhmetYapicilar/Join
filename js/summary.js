document.addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    let name = JSON.parse(localStorage.getItem("user-name"));
    if (name != "guest") {
      document.getElementById("greeting-name").innerHTML = name;
    }
  }, 1000);
});

async function initSummary() {
  await loadCountTasks();
  await showSummaryTasks();
}

async function loadCountTasks() {
  taskCounts = JSON.parse(await getItem("taskCount"));
}

let dates = [];

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

function earliestDate() {
  // Konvertiere die Daten in Millisekunden seit dem 1. Januar 1970 (Unix-Zeitstempel)
  const dateInMilliseconds = dates.map((date) => new Date(date).getTime());

  // Finde den kleinsten Wert (das früheste Datum) mit Math.min()
  const earliestDateInMilliseconds = Math.min(...dateInMilliseconds);

  // Konvertiere den Unix-Zeitstempel zurück in ein Datum
  const earliestDate = new Date(earliestDateInMilliseconds);

  return earliestDate.toLocaleDateString();
}

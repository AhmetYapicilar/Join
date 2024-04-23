// Konstanten für den Zugriff auf den Remote-Speicher definieren
const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let subtasks = []; // Array zum Speichern der hinzugefügten Subtasks

// Funktion zum Erstellen eines neuen Tasks und Speichern im Remote-Speicher
function createTask() {
    // Informationen aus dem Formular sammeln
    let title = document.querySelector(".titleInputAddTask").value,
        description = document.querySelector(".descriptionTextArea").value,
        assignedTo = document.querySelector(".assignContacts").value,
        dueDate = document.querySelector(".dateInput").value,
        priority = getPriority(), // Priorität ermitteln
        category = document.querySelector(".categoryPicker").value,
        subtasks = getSubtasks(), // Unteraufgaben sammeln
        task = {title, description, assignedTo, dueDate, priority, category, subtasks}; // Task-Objekt erstellen

    // Überprüfen, ob erforderliche Felder ausgefüllt sind
    if (title.trim() === "" || dueDate.trim() === "" || category.trim() === "") {
        return alert("Please fill in all required fields.");
    }

    // Daten an den Remote-Speicher senden
    fetch(STORAGE_URL, {method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${STORAGE_TOKEN}`}, body: JSON.stringify(task)})
    .then(response => response.ok ? response.json() : Promise.reject('Failed to save task.')) // Erfolgreiche Antwort überprüfen
    .then(data => (console.log('Task saved successfully:', data), clearForm())) // Erfolgreich gespeichert, Formular zurücksetzen
    .catch(error => console.error('Error saving task:', error.message)); // Fehlerbehandlung
}

// Funktion zum Abrufen der ausgewählten Priorität
function getPriority() {
    return (document.querySelector(".urgentButton").classList.contains("selected") && "Urgent") || // Priorität: Dringend
           (document.querySelector(".mediumButton").classList.contains("selected") && "Medium") || // Priorität: Mittel
           (document.querySelector(".lowButton").classList.contains("selected") && "Low") || // Priorität: Niedrig
           "Medium"; // Standardpriorität, falls keine ausgewählt ist
}

// Funktion zum Hinzufügen eines Subtasks
function addSubtask() {
    let subtaskInput = document.querySelector(".subtaskPicker");
    let subtaskText = subtaskInput.value.trim();
    if (subtaskText !== "") {
        subtasks.push(subtaskText);
        updateSubtaskList(); // Aktualisiere die Anzeige der Subtasks
        subtaskInput.value = ""; // Leere das Eingabefeld
    }
}

// Funktion zum Löschen eines Subtasks
function removeSubtask(index) {
    subtasks.splice(index, 1);
    updateSubtaskList(); // Aktualisiere die Anzeige der Subtasks
}

// Funktion zum Aktualisieren der Anzeige der Subtasks
function updateSubtaskList() {
    let subtaskListContainer = document.getElementById("subtaskList");
    subtaskListContainer.innerHTML = ""; // Leere die Anzeige, um neu zu rendern
    subtasks.forEach((subtask, index) => {
        let listItem = document.createElement("div");
        listItem.innerHTML = `<span>&#8226; ${subtask}</span>
                              <button onclick="removeSubtask(${index})">X</button>`;
        subtaskListContainer.appendChild(listItem);
    });
}

// Funktion zum Zurücksetzen des Formulars
function clearForm() {
    let form = document.getElementById("addTaskForm");
    form.reset();
}


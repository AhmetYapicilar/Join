/**
 * Function to activate input for adding subtasks.
 */
function activateInput() {
    let addSubtask = document.getElementById("add-subtask");
    let subtasksInputActions = document.getElementById("subtask-input-actions");

    addSubtask.classList.add("d-none");
    subtasksInputActions.classList.remove("d-none");
}


/**
 * Function to check if Enter key is pressed and submit the subtask.
 * @param {Event} event - The keyboard event.
 */
function checkSubmit(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSubtask();
    }
}


/**
 * Function to submit a subtask.
 */
function submitSubtask() {
    if (subtasks.length >= 6) {
        alert('Maximale Anzahl von Subtasks erreicht. Neue Subtasks können nicht hinzugefügt werden.');
        return;
    }
    let subtaskContent = document.querySelector("#subtask-input").value;
    if (subtaskContent == "") {
        deactivateInput();
    } else {
        let newSubtask = {
            subtaskName: subtaskContent,
            done: false,
        };
        subtasks.push(newSubtask);
        document.querySelector("#subtask-input").value = "";
        renderSubtasks();
        deactivateInput();
    }
}


/**
 * Function to deactivate input for adding subtasks.
 */
function deactivateInput() {
    let addSubtask = document.querySelector("#add-subtask");
    let subtasksInputActions = document.querySelector("#subtask-input-actions");

    addSubtask.classList.remove("d-none");
    subtasksInputActions.classList.add("d-none");
    document.querySelector("#subtask-input").value = "";
}


/**
 * Function to set focus on the subtask input field.
 */
function setFocus() {
    document.getElementById("subtask-input").focus();
}


/**
 * Function to delete a subtask.
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
    subtasks.splice(i, 1);
    renderSubtasks();
}


/**
 * Function to edit a subtask.
 * @param {number} i - The index of the subtask to edit.
 */
function editSubtask(i) {
    let subtaskContent = document.querySelector(`#subtask-element${i}`);
    let editContainer = document.getElementById("edit-subtask-container");
    let subtaskEditInput = document.querySelector(`#edit-subtask-${i}`);
    subtaskContent.classList.add("d-none");
    editContainer.classList.remove("d-none");
    document.getElementById(`edit-subtask-${i}`).focus();
    subtaskEditInput.value = subtasks[i].subtaskName;
}


/**
 * Function to check the edit submission for subtasks.
 * @param {number} i - The index of the subtask.
 * @param {Event} event - The keyboard event.
 */
function checkEditSubmit(i, event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitChange(i);
    }
}


/**
 * Function to submit a change to a subtask.
 * @param {number} i - The index of the subtask to change.
 */
function submitChange(i) {
    let newSubtaskContent = document.querySelector(`#edit-subtask-${i}`).value;
    subtasks[i].subtaskName = newSubtaskContent;
    renderSubtasks();
}


/**
 * Function to render the subtasks.
 */
function renderSubtasks() {
    let subtaskList = document.querySelector("#subtask-container");
    subtaskList.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i].subtaskName;
        subtaskList.innerHTML += subtaskHtml(element, i);
    }
}
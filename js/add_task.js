const STORAGE_TOKEN = '3HDM5PQUHYXFJ42ELVGHJHKC15X2E80YC0TD1RAR';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let subtasks = [];

function createTask() {
    let title = document.querySelector(".titleInputAddTask").value,
        description = document.querySelector(".descriptionTextArea").value,
        assignedTo = document.querySelector(".assignContacts").value,
        dueDate = document.querySelector(".dateInput").value,
        priority = getPriority(),
        category = document.querySelector(".categoryPicker").value,
        subtasks = getSubtasks(),
        task = {title, description, assignedTo, dueDate, priority, category, subtasks}; 
    if (title.trim() === "" || dueDate.trim() === "" || category.trim() === "") {
        return alert("Please fill in all required fields.");
    }
    setItem(task, title);
}

function selectPriority(priority) {
    document.querySelectorAll('.urgentButton, .mediumButton, .lowButton').forEach(button => {
        button.classList.remove('urgentButtonSelected', 'mediumButtonSelected', 'lowButtonSelected');
    });

    const selectedButton = document.getElementById(priority);
    const img = selectedButton.querySelector('img');
    switch (priority) {
        case 'low':
            img.src = './assets/img/prioDownWhite.png';
            break;
        case 'medium':
            img.src = './assets/img/prioEvenWhite.png';
            break;
        case 'urgent':
            img.src = './assets/img/prioUpWhite.png';
            break;
        default:
            break;
    }
    selectedButton.classList.add(`${priority}ButtonSelected`);
}

function addSubtask() {
    let subtaskInput = document.querySelector(".subtaskPicker");
    let subtaskText = subtaskInput.value.trim();
    if (subtaskText !== "") {
        subtasks.push(subtaskText);
        updateSubtaskList();
        subtaskInput.value = "";
    }
}

function removeSubtask(index) {
    subtasks.splice(index, 1);
    updateSubtaskList();
}

function updateSubtaskList() {
    let subtaskListContainer = document.getElementById("subtaskList");
    subtaskListContainer.innerHTML = "";
    subtasks.forEach((subtask, index) => {
        let listItem = document.createElement("div");
        listItem.innerHTML = `<span>&#8226; ${subtask}</span>
                              <button onclick="removeSubtask(${index})">X</button>`;
        subtaskListContainer.appendChild(listItem);
    });
}

function clearForm() {
    let form = document.getElementById("addTaskForm");
    form.reset();
}


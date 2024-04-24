let subtasks = [];
let tasks = [];

async function loadTasks() {
    try{
        tasks = JSON.parse(await getItem('task'));
        } catch(e){
            console.error('Loading error:', e);
        }
}



async function createTask() {
    tasks.push({
        title : document.querySelector(".titleInputAddTask").value,
        description : document.querySelector(".descriptionTextArea").value,
        assignedTo : document.querySelector(".assignContacts").value,
        dueDate : document.querySelector(".dateInput").value,
        priority : getPriority(),
        category : document.querySelector(".categoryPicker").value
    });
    await setItem('task', JSON.stringify(tasks));
}



function resetButtons() {
    document.querySelectorAll('.urgentButton, .mediumButton, .lowButton').forEach(button => {
        button.classList.remove('urgentButtonSelected', 'mediumButtonSelected', 'lowButtonSelected');
        const img = button.querySelector('img');
        switch (button.id) {
            case 'low':
                img.src = './assets/img/prioDown.png';
                break;
            case 'medium':
                img.src = './assets/img/prioEven.png';
                break;
            case 'urgent':
                img.src = './assets/img/prioUp.png';
                break;
            default:
                break;
        }
    });
}

function selectPriority(priority) {
    resetButtons();
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

function getPriority() {
    let priority;
    if (document.getElementById('urgent').classList.contains('urgentButtonSelected')) {
        priority = 'urgent';
    } else if (document.getElementById('medium').classList.contains('mediumButtonSelected')) {
        priority = 'medium';
    } else if (document.getElementById('low').classList.contains('lowButtonSelected')) {
        priority = 'low';
    } else {
        priority = 'medium';
    }
    return priority;
}

function selectMedium() {
    resetButtons();
    selectPriority('medium');
}

function onLoad() {
    selectMedium();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onLoad);
} else {
    onLoad();
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


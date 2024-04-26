let tasks = [];

async function loadTasks() {
    try {
        const storedTasks = await getItem('task');

        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    } catch (error) {
        console.error('Loading error:', error);
    }
}

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    try {
        const response = await fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) });
        if (!response.ok) {
            throw new Error('Failed to save data.');
        }
        return response.json();
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function getItem(key) {
    const URL = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Failed to fetch data.');
        }
        const data = await response.json();
        if (data && data.data) {
            return data.data.value;
        } else {
            throw new Error(`Could not find data with key "${key}".`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addTaskForm');

    form.addEventListener('submit', function (event) {
        if (form.checkValidity()) {
            createTask();
        } else {
            console.log('Das Formular ist ungültig. Bitte überprüfe deine Eingaben.');
        }
    });
});

async function createTask() {
    try {
        tasks.push({
            title: document.querySelector(".titleInputAddTask").value,
            description: document.querySelector(".descriptionTextArea").value,
            assignedTo: document.querySelector(".assignContacts").value,
            dueDate: document.querySelector(".dateInput").value,
            priority: getPriority(),
            category: document.querySelector(".categoryPicker").value
        });
        await setItem('task', JSON.stringify(tasks));
        console.log('Task successfully created.');
        clearForm();
    } catch (error) {
        console.error('Error creating task:', error);
    }
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
    selectMedium();
}

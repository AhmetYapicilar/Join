let tasks = [];
let subtasks = [];
let users = [];
let selectedContacts = [];

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        const dropdownContent = document.querySelector('.dropdownContent');
        const dropdownIcon = document.querySelector('.dropdownIcon');
        const clickedElement = event.target;

        const isDropdownContentClicked = dropdownContent && dropdownContent.contains(clickedElement);
        const isDropdownIconClicked = dropdownIcon && dropdownIcon.contains(clickedElement);

        if (!isDropdownContentClicked && !isDropdownIconClicked && dropdownContent) {
            dropdownContent.classList.remove('show');
        }
    });
});

function toggleDropdown() {
    const dropdownContent = document.querySelector('.dropdownContent');
    const isOpen = dropdownContent.classList.contains('show');

    if (!isOpen) {
        dropdownContent.classList.add('show');
    } else {
        dropdownContent.classList.remove('show');
    }
}

document.querySelector('.dropdownIcon').addEventListener('click', function(event) {
    event.preventDefault();
    toggleDropdown();
});






async function loadAndRenderNames() {
    try {
        users = JSON.parse(await getItem('users'));
        const dropdownContent = document.querySelector('.dropdownContent');
        dropdownContent.innerHTML = '';
        users.forEach(user => {
            if (user.name || user.Name) {
                const name = user.name || user.Name;
                dropdownContent.innerHTML += `<span onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
            }
        });
    } catch (error) {
        console.error('Error loading and rendering names:', error);
    }
}

function searchContacts() {
    const searchInput = document.querySelector('.searchInput');
    const filter = searchInput.value.toUpperCase();
    const dropdownContent = document.querySelector('.dropdownContent');
    dropdownContent.innerHTML = '';


    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const name = user.name || user.Name;
        if (name && name.toUpperCase().startsWith(filter)) {
            dropdownContent.innerHTML += `<span id="contact${i}" onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
            selectContactStyleChanger(filter);
        }
    }
    dropdownContent.classList.add('show');

}


function selectContact(name) {
    const selectedContactIndex = selectedContacts.indexOf(name);
    if (selectedContactIndex === -1) {
        selectedContacts.push(name);
    } else {
        selectedContacts.splice(selectedContactIndex, 1);
    }
    name = name.toUpperCase();
    selectContactStyleChanger(name);
    renderSelectedContacts();
}

function selectContactStyleChanger(filter) {
    for(let x = 0; x<selectedContacts.length; x++){
        const CONTACT = selectedContacts[x];
        if(CONTACT.toUpperCase().startsWith(filter)){
            let trueContact = CONTACT;
        
        
    const selectedDropdownContent = document.querySelectorAll('.dropdownContent span');
    selectedDropdownContent.forEach(span => {
        if (span.textContent === trueContact) {
            span.classList.add('selectedDropdownContent');
            const img = span.querySelector('img');
            if (img) {
                img.src = span.classList.contains('selectedDropdownContent') ? './assets/img/checkbox-check-white.png' : './assets/img/Checkbox.png';
            }
        
        }
    });
}}}

function renderSelectedContacts() {
    const selectedContactsContainer = document.querySelector('.selectedContactsContainer');
    selectedContactsContainer.innerHTML = '';
    const maxContactsToShow = 5; 
    const remainingCount = selectedContacts.length - maxContactsToShow;

    for (let i = 0; i < Math.min(selectedContacts.length, maxContactsToShow); i++) {
        const contact = selectedContacts[i];
        const initials = contact.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16); 
        selectedContactsContainer.innerHTML += `<div class="selectedContact" style="background-color: ${randomColor};">${initials}</div>`;
    }
    
    if (remainingCount > 0) {
        selectedContactsContainer.innerHTML += `<div class="selectedContact" style="background-color: #aaa;">+${remainingCount}</div>`;
    }
}









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
            category: document.querySelector(".categoryPicker").value,
            category2: 'To-Do'
        });
        await setItem('task', JSON.stringify(tasks));
        console.log('Task successfully created.');
        clearForm();
        openBoard();
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

function clearForm() {
    let form = document.getElementById("addTaskForm");
    form.reset();
    selectMedium();
    clearSubtasks();
}

function clearSubtasks() {
    let subtasksContainer = document.getElementById("subtask-container");
    subtasksContainer.innerHTML = ``
    subtasks = [];
}

function activateInput() {
    let addSubtask = document.getElementById("add-subtask");
    let subtasksInputActions = document.getElementById("subtask-input-actions");

    addSubtask.classList.add("d-none");
    subtasksInputActions.classList.remove("d-none");
}

function checkSubmit(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSubtask();
    }
}

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

function deactivateInput() {
    let addSubtask = document.querySelector("#add-subtask");
    let subtasksInputActions = document.querySelector("#subtask-input-actions");

    addSubtask.classList.remove("d-none");
    subtasksInputActions.classList.add("d-none");
    document.querySelector("#subtask-input").value = "";
}

function setFocus() {
    document.getElementById("subtask-input").focus();
}

function deleteSubtask(i) {
    subtasks.splice(i, 1);
    renderSubtasks();
}

function editSubtask(i) {
    let subtaskContent = document.querySelector(`#subtask-element${i}`);
    let editContainer = document.getElementById("edit-subtask-container");
    let subtaskEditInput = document.querySelector(`#edit-subtask-${i}`);
    subtaskContent.classList.add("d-none");
    editContainer.classList.remove("d-none");
    document.getElementById(`edit-subtask-${i}`).focus();
    subtaskEditInput.value = subtasks[i].subtaskName;
}
function checkEditSubmit(i, event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitChange(i);
    }
}

function submitChange(i) {
    let newSubtaskContent = document.querySelector(`#edit-subtask-${i}`).value;
    subtasks[i].subtaskName = newSubtaskContent;
    renderSubtasks();
}

function renderSubtasks() {
    let subtaskList = document.querySelector("#subtask-container");
    subtaskList.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i].subtaskName;
        subtaskList.innerHTML += /*html*/ `
            <li
				id="todo-id-${i}"
				class="todo-subtask d-flex"
				ondblclick="editSubtask(${i})">
                <div class="d-flex align-c todo-subtask-container" id="subtask-element${i}">
                    <p>${element}</p>
                    <div class="subtask-imgs d-flex align-c">
					    <img
						    src="./assets/img/edit.png"
						    class="subtask-actions"
                            onclick="event.stopPropagation(); editSubtask(${i})"/>
					    <span class="vertical-line-sub"></span>
					    <img src="./assets/img/delete.png" onclick="deleteSubtask(${i})" class="subtask-actions" />
				    </div>
                </div>
                <div class="d-flex align-c todo-subtask-container set-edit d-none" id="edit-subtask-container">
                    <input type="text" id="edit-subtask-${i}" class="subtask-edit" onkeydown="checkEditSubmit(${i}, event)">
                    <div class="subtask-imgs d-flex align-c">
					    <img
						    src="./assets/img/check-blue.png"
						    class="subtask-actions" onclick="submitChange(${i})"/>
					    <span class="vertical-line-sub"></span>
					    <img src="./assets/img/delete.png" onclick="deleteSubtask(${i})" class="subtask-actions" />
				    </div>
                </div>
			</li>
        `;
    }
}

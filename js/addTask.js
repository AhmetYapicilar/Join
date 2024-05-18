/**
 * Array for storing tasks.
 * @type {Array<Object>}
 */
let tasks = [];


/**
 * Array for storing subtasks.
 * @type {Array<Object>}
 */
let subtasks = [];


/**
 * Array for storing users.
 * @type {Array<Object>}
 */
let users = [];


/**
 * Array for storing selected contacts.
 * @type {Array<string>}
 */
let selectedContacts = [];


/**
 * Function to toggle the dropdown menu.
 */
function toggleDropdown() {
    const dropdownContent = document.querySelector('.dropdownContent');
    const isOpen = dropdownContent.classList.contains('show');

    if (!isOpen) {
        dropdownContent.classList.add('show');
    } else {
        dropdownContent.classList.remove('show');
    }
}


/**
 * Function for loading and rendering user names.
 * @async
 */
async function loadAndRenderNames() {
    try {
        const loadedUsers = JSON.parse(await getItem('users'));
        renderNames(loadedUsers);
    } catch (error) {
        console.error('Fehler beim Laden und Rendern von Namen:', error);
    }
}


/**
 * Function for rendering user names.
 * @param {Array<Object>} loadedUsers - Array of user objects.
 */
function renderNames(loadedUsers) {
    const dropdownContent = document.querySelector('.dropdownContent');
    dropdownContent.innerHTML = '';
    const nameSet = new Set();
    const filteredUsers = [];

    loadedUsers.forEach(user => {
        const name = user.name || user.Name;
        if (name && !nameSet.has(name)) {
            nameSet.add(name);
            dropdownContent.innerHTML += `<span onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
            filteredUsers.push(user);
        }
    });
    users.push(...filteredUsers);
}


/**
 * Function for searching contacts.
 */
function searchContacts() {
    const searchInput = document.querySelector('.searchInput');
    const filter = searchInput.value.trim().toUpperCase();
    const dropdownContent = document.querySelector('.dropdownContent');
    dropdownContent.innerHTML = '';

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const name = user.name || user.Name;
        if (name && name.toUpperCase().startsWith(filter)) {
            dropdownContent.innerHTML += `<span id="contact${i}" onclick="selectContact('${name}')">${name}<img src="./assets/img/Checkbox.png" width="24px"></span>`;
        }
    }
    dropdownContent.classList.add('show');
    selectContactStyleChanger();
}


/**
 * Function for selecting a contact.
 * @param {string} name - The name of the selected contact.
 */
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


/**
 * Function for changing the style for selected contacts.
 * @param {string} [name] - The name of the selected contact.
 */
function selectContactStyleChanger() {
    const selectedDropdownContent = document.querySelectorAll('.dropdownContent span');
    selectedDropdownContent.forEach(span => {
        const contactName = span.textContent.trim();
        const isSelected = selectedContacts.includes(contactName);
        if (isSelected) {
            span.classList.add('selectedDropdownContent');
            const img = span.querySelector('img');
            if (img) {
                img.src = './assets/img/checkbox-check-white.png';
            }
        } else {
            span.classList.remove('selectedDropdownContent');
            const img = span.querySelector('img');
            if (img) {
                img.src = './assets/img/Checkbox.png';
            }
        }
    });
}


/**
 * Function for rendering the selected contacts.
 */
function renderSelectedContacts() {
    const selectedContactsContainer = document.querySelector('.selectedContactsContainer');
    selectedContactsContainer.innerHTML = '';
    const maxContactsToShow = 5;
    const remainingCount = selectedContacts.length - maxContactsToShow;

    for (let i = 0; i < Math.min(selectedContacts.length, maxContactsToShow); i++) {
        const contact = selectedContacts[i];
        const initials = contact.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        selectedContactsContainer.innerHTML += `<div class="selectedContact" style="background-color: ${randomColor};">${initials}</div>`;
    }

    if (remainingCount > 0) {
        selectedContactsContainer.innerHTML += `<div class="selectedContact" style="background-color: #aaa;">+${remainingCount}</div>`;
    }
}


/**
 * Function for loading tasks.
 * @async
 */
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


/**
 * Function for saving an item to storage.
 * @async
 * @param {string} key - The key of the item.
 * @param {any} value - The value of the item.
 * @returns {Promise<Object>} - The result of the request.
 */
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


/**
 * Function for getting an item from storage.
 * @async
 * @param {string} key - The key of the item.
 * @returns {Promise<any>} - The retrieved item.
 */
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

/**
 * Asynchronously creates a new task based on form inputs and stores it.
 * @async
 * @function createTask
 * @throws {Error} If an error occurs during task creation.
 */
async function createTask() {
    let taskWorkflow = JSON.parse(localStorage.getItem('selectedCategory')) || 'To-Do';
    try {
        tasks.push({
            title: document.querySelector(".titleInputAddTask").value,
            description: document.querySelector(".descriptionTextArea").value,
            assignedTo: selectedContacts,
            dueDate: document.querySelector(".dateInput").value,
            priority: getPriority(),
            category: document.querySelector(".categoryPicker").value,
            workflow: taskWorkflow,
            subTasks: subtasks
        });
        await setItem('task', JSON.stringify(tasks));
    } catch (error) {
        console.log('Error creating task.');
    }

}


/**
 * Function to reset priority buttons.
 */
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


/**
 * Function to select a priority.
 * @param {string} priority - The selected priority.
 */
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


/**
 * Function to get the priority.
 * @returns {string} - The selected priority.
 */
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


/**
 * Function to select the "Medium" priority.
 */
function selectMedium() {
    resetButtons();
    selectPriority('medium');
}


/**
 * Function called when the document is loaded.
 */
function onLoad() {
    selectMedium();
}


/**
 * Checks if the document is still loading. If it is, adds an event listener for the 'DOMContentLoaded' event,
 * otherwise calls the onLoad function immediately.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onLoad);
} else {
    onLoad();
}


/**
 * Function to clear the form.
 */
function clearForm() {
    let form = document.getElementById("addTaskForm");
    form.reset();
    selectMedium();
    clearArrays();
    loadAndRenderNames();
}


/**
 * Function to clear arrays and reset input fields.
 */
function clearArrays() {
    let contactsInput = document.getElementById("searchInput");
    let subtasksContainer = document.getElementById("subtask-container");
    let selectedContactsContainer = document.getElementById("selectedContactsContainer");
    contactsInput = "";
    subtasksContainer.innerHTML = ``;
    selectedContactsContainer.innerHTML = ``;
    subtasks = [];
    selectedContacts = [];
}


/**
 * Sets the minimum date for the specified date input field to today's date.
 * @function setMinDateToday
 */
function setMinDateToday() {
    const dateInput = document.getElementById('dateInputPicker');
    const today = new Date().toISOString().split('T')[0];

    dateInput.setAttribute('min', today);
}


/**
 * Displays a message indicating that a task has been successfully added.
 * The message fades in and the image scales up, and after a delay, the user is redirected to the board page.
 */
function showTaskAddedMessage() {
    
    const messageDiv = document.getElementById('taskAddedMessage');
    messageDiv.classList.remove('hidden');
    setTimeout(() => {
        window.location.href = './board.html';
    }, 3000);
}
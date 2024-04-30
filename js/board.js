let ids = ['To-Do', 'In-Progress', 'Await-Feedback', 'Done'];
let priorities = ['low', 'medium', 'urgent'];
let priopics = ["./assets/img/arrow-down-icon.png", "./assets/img/equal-sign-icon.png", "./assets/img/arrow-up-icon.png"];
let taskCounts = {
    'To-Do': 0,
    'In-Progress': 0,
    'Await-Feedback': 0,
    'Done': 0
};
let draggedTask;

  

async function initBoard(){
    document.getElementById('overlay-add-task-board').classList.remove('overlay-add-task-board');
    document.getElementById('section-board-overlay').classList.remove('section-board-overlay');
    document.getElementById('body-board').style.overflow = 'auto';
    for (let x = 0; x < ids.length; x++) {
        let category = ids[x];
        taskCounts[category] = 0;
        let contentBefore = document.getElementById(`${ids[x]}`);
        contentBefore.classList.remove('drag-area-highlight');
        contentBefore.innerHTML = '';
    }
    await loadTasks();
    await showTasks();
    checkEmptyTasks();
}


function checkEmptyTasks() {
    for(let i=0; i<ids.length; i++){
        const ID = ids[i];
        let content = document.getElementById(ID);
        if(content.innerHTML === ''){
            content.innerHTML = `<div class="no-tasks-board">No tasks available</div>`;
        }
    }
}

async function showTasks(){
    for (let i = 0; i < tasks.length; i++) {
        if(document.getElementById(`bigtask${i}`)){
            document.getElementById(`bigtask${i}`).classList.add('d-none');
        }
            let {TASK, category2, title, description, dueDate, priority, priorityIcon} = await initVariablesForShowTasks(i);
            if(!category2){
                category2 = 'To-Do';
            }
            await countTasks(category2);
            let content = document.getElementById(category2);
            content.innerHTML += generateShowTasksHTML(i, title, description, priorityIcon);
            userStoryOrTechnicalTask(TASK, i);
        };
        }

async function initVariablesForShowTasks(i){
        const TASK = tasks[i];
        let category2 = TASK["category2"]
        let title = TASK["title"];
        let description = TASK["description"];
        let dueDate = TASK["dueDate"];
        if(!TASK['priority']){
            TASK['priority']='medium';
        }
        let priority = TASK["priority"];
        let priorityIcon = await proofPriority(priority);
        return {TASK, category2, title, description, dueDate, priority, priorityIcon};
}

function generateShowTasksHTML(i, title, description, priorityIcon){
    return `
    <div id='task${i}' draggable="true" class="tasks-board" onclick=showTaskInBig(${i}) ondragstart="startDragging(${i})">
    <div id="user-technical-board${i}"></div>
    <div class="name-of-task-board"><span>${title}</span><p>${description}</p></div>
    <div class="space-between-board width-100percent margin-top-16">
        <div class="progressbar-background">
            <div class="progressbar-board" role="progressbar"></div>
        </div>
        <span class="sub-tasks">1/2 Subtasks</span>
    </div>
    <div class="space-between-board width-100percent margin-top-16">
        <div class="flex-board">
            <div class="circle-board background-color-orange margin-left-9px colorWhite">AM</div>
            <div class="circle-board background-color-green margin-left-9px colorWhite">EM</div>
            <div class="circle-board background-color-darkblue margin-left-9px colorWhite">MB</div>
        </div>
        <img class="priority-icon-board" src="${priorityIcon}">
    </div></div>`;
}

function userStoryOrTechnicalTask(TASK, i){
    if(TASK['category'] === 'User Story'){
        document.getElementById(`user-technical-board${i}`).classList.add('user-story-board');
        document.getElementById(`user-technical-board${i}`).innerHTML = 'User Story';
    } else {
        document.getElementById(`user-technical-board${i}`).classList.add('technical-task-board');
        document.getElementById(`user-technical-board${i}`).innerHTML = 'Technical Task';
    }
 }


function userStoryOrTechnicalTaskBig(TASK, i){
    if(TASK['category'] === 'User Story'){
        document.getElementById(`user-technical-big${i}`).classList.add('user-story-board-big');
        document.getElementById(`user-technical-big${i}`).innerHTML = 'User Story';
} else{
document.getElementById(`user-technical-big${i}`).innerHTML = 'Technical Task';
document.getElementById(`user-technical-big${i}`).classList.add('technical-task-board-big');
}
}

async function countTasks(category){
    taskCounts[category]++;
    await setItem('taskCount', JSON.stringify(taskCounts));
}




async function searchTask(){
    await loadTasks();
    let search = document.getElementById('search-input').value;
  search = search.toLowerCase();
  if (search === '') { 
    initBoard();
   } else{
     await showSearchedTasks(search);
      checkEmptyTasks();
}}

async function showSearchedTasks(search){
    let foundedTasks = [];
    for(let i=0; i<ids.length; i++){
        document.getElementById(`${ids[i]}`).innerHTML = '';
        for(let x=0; x<tasks.length; x++){
            const TASK = tasks[x];
            let tasktitle = TASK['title'];
            if(TASK['category2'] === ids[i] && tasktitle.toLowerCase().includes(search)){
                foundedTasks.push(TASK);
            }
        }
        }
        for(let j=0; j<foundedTasks.length; j++){
            let foundedTask = foundedTasks[j];
            let {TASK, category2, title, description, dueDate, priority, priorityIcon} = await initVariablesForShowTasks(tasks.indexOf(foundedTask));
            let content = document.getElementById(category2);
            content.innerHTML += generateShowTasksHTML(tasks.indexOf(foundedTask), title, description, priorityIcon);
            userStoryOrTechnicalTask(TASK, tasks.indexOf(foundedTask));
        }
    
}

async function showTaskInBig(i){
    await loadTasks();
    let {TASK, title, description, dueDate, priority, priorityIcon} = await initVariablesForShowTasks(i);
    document.getElementById('section-board-overlay').classList.add('section-board-overlay');
    document.getElementById('body-board').style.overflow = 'hidden';
    let content = document.getElementById('section-board-overlay');
    content.innerHTML = generateBigTaskHTML(i, title, description, dueDate, priority, priorityIcon);
    userStoryOrTechnicalTaskBig(TASK, i);
    setTimeout(() => {
    document.getElementById(`bigtask${i}`).classList.add('animation');
    }, 100);
}

function generateBigTaskHTML(i, title, description, dueDate, priority, priorityIcon){
    return `
    <div id='bigtask${i}' class="tasks-board-big">
    <div class="space-between-board">
        <div id="user-technical-big${i}"></div>
        <img class="close-icon" onclick="closeTaskInBig(${i})" src="./assets/img/close.png">
    </div>
    <div class="name-of-task-board"><span id="user-technical-big{i}" class="name-of-task-board-big">${title}</span><p class="name-of-task-board-big-p">${description}</p></div>
    <div class="due-date-priority margin-top-16">
        <span>Due date:</span>
        <p>${dueDate}</p>
    </div>
    <div class="due-date-priority margin-top-16">
        <span>Priority:</span>
        <div class="priority-div">
            <p>${priority}</p>
            <img src="${priorityIcon}">
        </div>
    </div>
    <div class="assigned-to margin-top-16">
        <span>Assigned To:</span>
        <div class="assigned-to-contacts">
            <div class="flex-board">
                <div class="circle-board-big background-color-green">EM</div>
                <span class="contact-name">Emmanuel Mauer</span>
            </div>
            <div class="flex-board">
                <div class="circle-board-big background-color-darkblue">MB</div>
                <span class="contact-name">Marcel Bauer</span>
            </div>
            <div class="flex-board">
                <div class="circle-board-big background-color-violet">AM</div>
                <span class="contact-name">Anton Mayer</span>
            </div>
        </div>
    </div>
    <div class="assigned-to margin-top-16">
        <span>Subtasks</span>
        <div class="flex-board gap-16 padding-left-4">
            <label class="checkbox-container">
                <input type="checkbox">
                <span class="checkmark"></span>
            </label>
            <p class="checkbox-p">Implement Recipe Recommendation</p>
            </div>
        <div class="flex-board gap-16 padding-left-4">
        <label class="checkbox-container">
            <input type="checkbox">
            <span class="checkmark"></span>
        </label>
        <p class="checkbox-p">Start Page Layout</p>
        </div>
    </div>
    <div class="last-line margin-top-16">
    <img onclick="deleteTask(${i})" src="./assets/img/delete (1).png" onmouseover="this.src='./assets/img/deleteHover.png'; this.style.cursor='pointer';" onmouseout="this.src='./assets/img/delete (1).png';">
        <div class="vertical-line-board"></div>
        <img onclick="editTask(${i})" src="./assets/img/edit (1).png" onmouseover="this.src='./assets/img/editHover.png'; this.style.cursor='pointer';" onmouseout="this.src='./assets/img/edit (1).png';">
    </div>`;
}

async function deleteTask(i){
    tasks.splice(i, 1);
    await setItem('task', tasks);
    initBoard();
}

async function editTask(i){
    let {TASK, title, description, dueDate, priority, priorityIcon} = await initVariablesForShowTasks(i);
    priority = priority.toLowerCase(); 
    let content = document.getElementById('section-board-overlay');
    content.innerHTML = '';
    content.innerHTML = editTaskHTML(i);
    document.getElementById(`title-id${i}`).value = title;
    document.getElementById(`description-id${i}`).value = description;
    document.getElementById(`duedate-id${i}`).value = dueDate;
    proofPrio(priority, i);

}

async function proofPrio(priority, i){
    priority = priority.toLowerCase();
    removeAllClassesFromButton(i);
    if(priority === 'low'){
        document.getElementById(`lowButton-id${i}`).classList.add('bg-low');
        document.getElementById(`low-img-id${i}`).src = './assets/img/prioDownWhite.png';
    } else if(priority === 'medium'){
        document.getElementById(`mediumButton-id${i}`).classList.add('bg-medium');
        document.getElementById(`medium-img-id${i}`).src = './assets/img/prioEvenWhite.png';
    } else {
        document.getElementById(`urgentButton-id${i}`).classList.add('bg-urgent');
        document.getElementById(`urgent-img-id${i}`).src = './assets/img/prioUpWhite.png';
    }
}

function removeAllClassesFromButton(i){
    document.getElementById(`lowButton-id${i}`).classList.remove('bg-low');
    document.getElementById(`low-img-id${i}`).src = './assets/img/prioDown.png';
    document.getElementById(`mediumButton-id${i}`).classList.remove('bg-medium');
    document.getElementById(`medium-img-id${i}`).src = './assets/img/prioEven.png';
    document.getElementById(`urgentButton-id${i}`).classList.remove('bg-urgent');
    document.getElementById(`urgent-img-id${i}`).src = './assets/img/prioUp.png';
}

function editTaskHTML(i){
    return `
    <div class="task-edit">
    <div class="column-edit">
        <span>Title</span>
        <input id="title-id${i}" class="edit-input" type="text">
    </div>
    <div class="column-edit margin-top-16">
        <span>Description</span>
        <input id="description-id${i}" class="edit-input" type="text">
    </div>
    <div class="column-edit margin-top-16">
        <span>Due date</span>
        <input id="duedate-id${i}" class="edit-input" type="date">
    </div>
    <div class="column-edit margin-top-16">
        <div class="flex-board-edit flex-board gap-16">
            <button onclick="newPrioToUrgent(${i})" id="urgentButton-id${i}" class="urgentButton-edit">Urgent<img id="urgent-img-id${i}" src="./assets/img/prioUp.png"></button>
            <button onclick="newPrioToMedium(${i})" id="mediumButton-id${i}" class="mediumButton-edit">Medium<img id="medium-img-id${i}" src="./assets/img/prioEven.png"></button>
            <button onclick="newPrioToLow(${i})" id="lowButton-id${i}" class="lowButton-edit">Low<img id="low-img-id${i}" src="./assets/img/prioDown.png"></button>
        </div>
    </div> 
    <div class="column-edit margin-top-16">
        <span>Assigned to</span>
        <select class="assignContacts">
            <option value="">Select contacts to assign</option>
        </select>
        <div class="flex-board">
            <div class="circle-board background-color-darkblue">AM</div>
            <div class="circle-board background-color-green">EM</div>
            <div class="circle-board background-color-violet">MB</div>
        </div>
    </div>
    <div class="column-edit margin-top-16">
        <span>Subtasks</span>
        <div class="relative">
            <input type="text" class="subtask-input" placeholder="Add new subtask">
            <img src="./assets/img/add-subtask.png" onclick="event.stopPropagation(); activateInput(); setFocus()" id="add-subtask-edit" class="add-subtasks-btn-edit">
        </div>
    </div>
    <button onclick="saveChangedTask(${i})" class="ok-button">Ok <img src="./assets/img/check.png" alt=""></button>
</div>`;
}

async function saveChangedTask(i){
    const TASK = tasks[i];
    let title = document.getElementById(`title-id${i}`).value;
    let description = document.getElementById(`description-id${i}`).value;
    let dueDate = document.getElementById(`duedate-id${i}`).value;
    let priority = TASK['priority'];
    let priorityIcon = proofPriority(priority);
    tasks[i]['title'] = title;
    tasks[i]['description'] = description;
    tasks[i]['dueDate'] = dueDate;
    await setItem('task', JSON.stringify(tasks));
    showTaskInBig(i);
}

async function newPrioToUrgent(i){
    let {TASK, title, description, dueDate, priority, priorityIcon} = await initVariablesForShowTasks(i);
    priority = 'Urgent';
    tasks[i]['priority'] = 'urgent';
    proofPrio(priority, i);
    await setItem('task', JSON.stringify(tasks));
}

async function newPrioToMedium(i){
    let {TASK, title, description, dueDate, priority, priorityIcon} = await initVariablesForShowTasks(i);
    priority = 'Medium';
    tasks[i]['priority'] = 'medium';
    proofPrio(priority, i);
    await setItem('task', JSON.stringify(tasks));
}

async function newPrioToLow(i){
    let {TASK, title, description, dueDate, priority, priorityIcon} = await initVariablesForShowTasks(i);
    priority = 'Low';
    tasks[i]['priority'] = 'low';
    proofPrio(priority, i);
    await setItem('task', JSON.stringify(tasks));
}

async function closeTaskInBig(i){
    document.getElementById(`bigtask${i}`).classList.remove('animation');
    document.getElementById('body-board').style.overflow = 'auto';
    setTimeout(() => {
        document.getElementById('section-board-overlay').classList.remove('section-board-overlay'); // Verstecke das Element nach der Animation
        initBoard();
    }, 400);
}

async function proofPriority(priority){
    for (let i = 0; i < priorities.length; i++) {
        priority = priority.toLowerCase();
        const PRIO = priorities[i];
        if(priority === PRIO){
            let pic = priopics[i];
            return pic;
        } 
    }
}

async function findId(category){
    for (let i = 0; i < ids.length; i++) {
        const ID = ids[i];
        if(category === ID){
            return ID;
        }
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function startDragging(id){
    draggedTask = id;
}

async function moveTo(category){
    tasks[draggedTask]['category2'] = category;
    await setItem('task', JSON.stringify(tasks));
    initBoard();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

let newTaskNumber=0;
let newAddedPrio=[];
let newTaskCategory;

async function addTaskOnBoard(selectedCategory){
    newTaskCategory = selectedCategory;
    document.getElementById('overlay-add-task-board').classList.add('overlay-add-task-board');
    document.getElementById('body-board').style.overflow = 'hidden';
    let content = document.getElementById('overlay-add-task-board');
    content.innerHTML = addTaskOnBoardHTML(newTaskNumber);
    setTimeout(() => {
        document.getElementById(`newTask${newTaskNumber}`).classList.add('showAddTask');
        }, 100);
}

async function createNewTask(){
    let newTitle = document.getElementById(`newTaskTitle${newTaskNumber}`).value;
    let newDescription = document.getElementById(`newTaskDescription${newTaskNumber}`).value;
    let newDueDate = document.getElementById(`newTaskDate${newTaskNumber}`).value;
    let newCategory = document.querySelector(".categoryPicker").value;
    let newCategory2 = newTaskCategory;
    let newPriority = newAddedPrio[0];
    tasks.push({
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate,
        category: newCategory,
        category2: newCategory2,
        priority: newPriority
    });
    newTaskNumber++;
    await setItem('task', JSON.stringify(tasks));
}

async function newTaskWithPrio(prio){
    newAddedPrio.splice(0, newAddedPrio.length);
    newAddedPrio.push(prio);
}

async function closeAddTask(newTaskNumber){
    document.getElementById(`newTask${newTaskNumber}`).classList.remove('showAddTask');
    document.getElementById('body-board').style.overflow = 'auto';
    setTimeout(() => {
        document.getElementById('overlay-add-task-board').classList.remove('overlay-add-task-board'); // Verstecke das Element nach der Animation
    }, 400);
}


function addTaskOnBoardHTML(newTaskNumber){
    return `
    <div id="newTask${newTaskNumber}" class="addTaskContentContainerBoard">
    <div class="headlineAddTaskContainerBoard space-between-board">
        <h1 class="headlineAddTask">Add Task</h1>
        <img onclick="closeAddTask(${newTaskNumber})" src="./assets/img/close.png" class="close-task">
    </div>

    <form id="addTaskForm" onsubmit="createNewTask(); return false">
        <div class="leftAddTaskContainer fontSize20px">
            <div class="titleContainer">
                <div class="flex-start-board">
                    <span>Title</span>
                    <p class="redText">*</p>
                </div>
                <input required class="titleInputAddTask fontSize20px" id="newTaskTitle${newTaskNumber}" type="text"
                    placeholder="Enter a title">
            </div>

            <div class="descriptionContainer">
                <span>Description</span>
                <textarea class="descriptionTextArea fontSize20px" name="" id="newTaskDescription${newTaskNumber}" cols="30" rows="10"
                    placeholder="Enter a Description"></textarea>
            </div>

            <div class="assignContactsContainer">
                <span>Assigned to</span>
                <select class="assignContacts-select fontSize20px" id="contacts" name="contacts">
                    <option value="">Select contacts to assign</option>
                </select>
            </div>
        </div>

        <div class="addTaskDividingBar"></div>

        <div class="rightAddTaskContainer fontSize20px">
            <div class="taskDateContainer">
                <div class="flex-start-board">
                    <span>Due Date</span>
                    <p class="redText">*</p>
                </div>
                <input required class="dateInput fontSize20px" id="newTaskDate${newTaskNumber}" type="date" id="date">
            </div>
            <div class="prioPickerContainer">
                <span>Prio</span>
                <div class="prioPickerButtonsContainer">
                    <button type="button" class="urgentButton fontSize20px" id="urgent"
                        onclick="selectPriority('urgent'); newTaskWithPrio('urgent')">Urgent <img src="./assets/img/prioUp.png"></button>
                    <button type="button" class="mediumButton fontSize20px mediumButtonSelected" id="medium"
                        onclick="selectPriority('medium'); newTaskWithPrio('medium')">Medium <img src="./assets/img/prioEven.png"></button>
                    <button type="button" class="lowButton fontSize20px" id="low"
                        onclick="selectPriority('low'); newTaskWithPrio('low')">Low <img src="./assets/img/prioDown.png"></button>
                </div>
            </div>
            <div class="categoryContainer">
                <div class="flex-start-board">
                    <span>Category</span>
                    <p class="redText">*</p>
                </div>
                <select required class="categoryPicker fontSize20px" id="category" name="category">
                    <option value="1" disabled selected hidden>Select task category</option>
                    <option value="User Story">User Story</option>
                    <option value="Technical Task">Technical Task</option>
                </select>
            </div>

            <div class="input-container">
            <div class="">
            <input type="text" id="subtask-input" class="subtask-input fontSize20px" autocomplete="off" placeholder="Add new subtask" onclick="activateInput()" onkeydown="checkSubmit(event)" size="10">
            <img src="./assets/img/add-subtask.png" onclick="event.stopPropagation(); activateInput(); setFocus()" id="add-subtask" class="add-subtasks-btn">
            <div id="subtask-input-actions" class="d-flex align-c add-subtasks-btn">
                <img src="./assets/img/check-blue.png" class="subtask-actions submit-input" onclick="submitSubtask('subtask-input')">
                <span class="vertical-line-sub"></span>
                <img src="./assets/img/close.png" class="subtask-actions" onclick="deactivateInput()">
            </div>
        </div>
                <ul class="subtask-container-board"></ul>
            </div>

        </div>
        <div class="fieldRequiredText">
            <div class="flex-start-board">
                <p class="redText">*</p>
                <span>This field is required</span>
            </div>
        </div>
        <div class="clearCreateButtonsContainer">
            <button type="button" class="clearButton" onclick="clearForm()">Clear <img
                    src="./assets/img/iconoir_cancel.png" alt=""></button>
            <button type="submit" class="createButton" id="createTaskButton">Create Task <img
                    src="./assets/img/check.png" alt=""></button>

        </div>
    </form>

</div>`;
}

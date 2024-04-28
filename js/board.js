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
    document.getElementById('section-board-overlay').classList.remove('section-board-overlay');
    document.getElementById('body-board').style.overflow = 'auto';
    for (let x = 0; x < ids.length; x++) {
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
    } else 
        document.getElementById(`user-technical-board${i}`).innerHTML = 'Technical Task';
        document.getElementById(`user-technical-board${i}`).classList.add('technical-task-board');
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
    document.getElementById('section-board-overlay').classList.add('section-board-overlay');
    document.getElementById('body-board').style.overflow = 'hidden';
    let content = document.getElementById('section-board-overlay');
    let {TASK, title, description, dueDate, priority, priorityIcon} = await initVariablesForShowTasks(i);
    content.innerHTML = generateBigTaskHTML(i, title, description, dueDate, priority, priorityIcon);
    userStoryOrTechnicalTaskBig(TASK, i);
    document.getElementById(`bigtask${i}`).classList.add('animation');
}

function generateBigTaskHTML(i, title, description, dueDate, priority, priorityIcon){
    return `
    <div id='bigtask${i}' class="tasks-board-big">
    <div class="space-between-board">
        <div id="user-technical-big${i}"></div>
        <img src="./assets/img/close.png">
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
    <img src="./assets/img/delete (1).png" onmouseover="this.src='./assets/img/deleteHover.png'; this.style.cursor='pointer';" onmouseout="this.src='./assets/img/delete (1).png';">
        <div class="vertical-line-board"></div>
        <img src="./assets/img/edit (1).png" onmouseover="this.src='./assets/img/editHover.png'; this.style.cursor='pointer';" onmouseout="this.src='./assets/img/edit (1).png';">
    </div>`;
}

async function proofPriority(priority){
    for (let i = 0; i < priorities.length; i++) {
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

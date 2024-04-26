let ids = ['To-Do', 'In Progress', 'Await feedback', 'Done'];
let priorities = ['low', 'medium', 'urgent'];
let priopics = ["../assets/img/arrow-down-icon.png", "../assets/img/equal-sign-icon.png", "../assets/img/arrow-up-icon.png"];


function initBoard(){
    document.getElementById('section-board-overlay').classList.remove('section-board-overlay');
    document.getElementById('body-board').style.overflow = 'auto';
    checkEmptyTasks();
    showNewTask();
}


function openTask(){
    document.getElementById('section-board-overlay').classList.add('section-board-overlay');
    document.getElementById('task').classList.add('animation');
    document.getElementById('body-board').style.overflow = 'hidden';
}

function checkEmptyTasks() {
    ids.forEach(id => {
        let element = document.getElementById(id);
        if (element) {
            if (element.children.length === 1){
                // Das Element hat nur ein Unterelement
            let newChildElement = document.createElement('div');
            
            // Füge eine Klasse zum neuen Element hinzu
            newChildElement.classList.add('no-tasks-board');

            // Füge Textinhalt zum neuen Element hinzu
            newChildElement.textContent = 'No tasks available';

            // Füge das neue Unterelement dem Element hinzu
            element.appendChild(newChildElement);
            }
        }
    });
}

// Funktion aufrufen, um zu prüfen, ob Tasks vorhanden sind
document.addEventListener('DOMContentLoaded', () => {
    checkEmptyTasks();
});

async function showNewTask(){
    await loadTasks();
    for (let i = 0; i < tasks.length; i++) {
        const TASK = tasks[i];
        let title = TASK["title"];
        let description = TASK["description"];
        let dueDate = TASK["dueDate"];
        let category = TASK["category"];
        let priority = TASK["priority"];

        let priorityIcon = await proofPriority(priority); 
        let matchingId = findId(category);

        if(matchingId){
            let categoryToDo = document.getElementById(matchingId);
            let noTasksDiv = categoryToDo.querySelector('.no-tasks-board');
            if (noTasksDiv) {
                categoryToDo.removeChild(noTasksDiv);
            }
            let newChildElement = document.createElement('div');
            newChildElement.classList.add('tasks-board');
            newChildElement.innerHTML = `
            <div class="user-story-board">User Story</div>
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
            </div>`;
            categoryToDo.appendChild(newChildElement);
            newChildElement.addEventListener('click', function() {
                showTaskInBig(title, description, priority, priorityIcon, dueDate, i);
                console.log('Das neu erstellte Element wurde geklickt!');
            });
        }
        
    }
}

async function showTaskInBig(title, description, priority, priorityIcon, dueDate, i){
    document.getElementById('section-board-overlay').classList.add('section-board-overlay');
    document.getElementById('body-board').style.overflow = 'hidden';
    let content = document.getElementById('section-board-overlay');
    content.innerHTML = `
    <div id="i" class="tasks-board-big">
    <div class="user-story-board">User Story</div>
    <div class="name-of-task-board"><span class="name-of-task-board-big">${title}</span><p class="name-of-task-board-big-p">${description}</p></div>
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
        <a href="#" class="flex-board link">
            <img src="./assets/img/delete.svg">
            Delete 
        </a>
        <div class="vertical-line-board"></div>
        <a href="#" class="flex-board link">
            <img src="./assets/img/edit.svg">
            Edit
        </a>
    </div>`;
    document.getElementById('i').classList.add('animation');
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

function findId(category){
    for (let i = 0; i < ids.length; i++) {
        const ID = ids[i];
        if(category === ID){
            return ID;
        }
    }
}

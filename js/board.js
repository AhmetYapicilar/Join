let ids = ['To-Do', 'In Progress', 'Await feedback', 'Done'];
let priorities = ['low', 'medium', 'urgent'];
let priopics = ["../assets/img/arrow-down-icon.png", "../assets/img/equal-sign-icon.png", "../assets/img/arrow-up-icon.png"];
let taskCounts = {
    'To-Do': 0,
    'In Progress': 0,
    'Await feedback': 0,
    'Done': 0
};

function initBoard(){
    document.getElementById('section-board-overlay').classList.remove('section-board-overlay');
    document.getElementById('body-board').style.overflow = 'auto';
    checkEmptyTasks();
    for (let x = 0; x < ids.length; x++) {
        let contentBefore = document.getElementById(`${ids[x]}`);
        contentBefore.innerHTML = '';
    }
    showTasks();
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

async function showTasks(){
    await loadTasks();
    for (let i = 0; i < tasks.length; i++) {
        if(document.getElementById(`task${i}`)){
            document.getElementById(`task${i}`).classList.add('d-none');
        }
        const TASK = tasks[i];
        let category = TASK["category"]; 
        if (!category) {
            continue; // Springe zur nächsten Iteration der Schleife, wenn keine Kategorie vorhanden ist
        }
        let matchingId = await findId(category);
        let content = document.getElementById(matchingId);
        let title = TASK["title"];
        let description = TASK["description"];
        let dueDate = TASK["dueDate"];
        let priority = TASK["priority"];

        let priorityIcon = await proofPriority(priority);
            content.innerHTML += `
            <div class="tasks-board" onclick=showTaskInBig(${i})>
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
            </div></div>`;
            countTasks(category);
        };
        }

async function countTasks(category){
    taskCounts[category]++;
    await setItem('taskCount', JSON.stringify(taskCounts));
}
        


async function showTaskInBig(i){
    await loadTasks();
    document.getElementById('section-board-overlay').classList.add('section-board-overlay');
    document.getElementById('body-board').style.overflow = 'hidden';
    let content = document.getElementById('section-board-overlay');
    const TASK = tasks[i];
        let category = TASK["category"]; 
        let title = TASK["title"];
        let description = TASK["description"];
        let dueDate = TASK["dueDate"];
        let priority = TASK["priority"];
        let priorityIcon = await proofPriority(priority);
    content.innerHTML = `
    <div id='task${i}' class="tasks-board-big">
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
    <img src="./assets/img/delete (1).png" onmouseover="this.src='./assets/img/deleteHover.png'; this.style.cursor='pointer';" onmouseout="this.src='./assets/img/delete (1).png';">
        <div class="vertical-line-board"></div>
        <img src="./assets/img/edit (1).png" onmouseover="this.src='./assets/img/editHover.png'; this.style.cursor='pointer';" onmouseout="this.src='./assets/img/edit (1).png';">
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

async function findId(category){
    for (let i = 0; i < ids.length; i++) {
        const ID = ids[i];
        if(category === ID){
            return ID;
        }
    }
}

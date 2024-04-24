let ids = ['toDo', 'inProgress', 'await Feedback', 'done'];


function initBoard(){
    document.getElementById('section-board-overlay').classList.remove('section-board-overlay');
    document.getElementById('task').classList.add('d-none');
    document.getElementById('body-board').style.overflow = 'auto';
    checkEmptyTasks();
}


function openTask(){
    document.getElementById('section-board-overlay').classList.add('section-board-overlay');
    document.getElementById('task').classList.remove('d-none');
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


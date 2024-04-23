function initBoard(){
    document.getElementById('section-board-overlay').classList.remove('section-board-overlay');
    document.getElementById('task').classList.add('d-none');
    document.getElementById('body-board').style.overflow = 'auto';
}

function openTask(){
    document.getElementById('section-board-overlay').classList.add('section-board-overlay');
    document.getElementById('task').classList.remove('d-none');
    document.getElementById('task').classList.add('animation');
    document.getElementById('body-board').style.overflow = 'hidden';
}

function checkEmptyTasks() {
    const toDoElement = document.getElementById('toDo');

if (toDoElement.childElementCount === 0) {
    document.getElementById('toDo').classList.add('no-tasks-board');
    document.getElementById('toDo').classList.remove('tasks-board');
    document.getElementById('toDo').innerHTML = 'No tasks available';
    

} else {
    console.log('Das Element hat keine Unterelemente (Kinder).');
}
}

// Funktion aufrufen, um zu prüfen, ob Tasks vorhanden sind
document.addEventListener('DOMContentLoaded', () => {
    checkEmptyTasks();
});


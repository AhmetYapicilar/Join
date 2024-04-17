function initBoard(){
    document.getElementById('section-board-overlay').classList.remove('section-board-overlay');
}

function openTask(){
    document.getElementById('section-board-overlay').classList.add('section-board-overlay');
    document.getElementById('task').classList.add('animation');
    document.getElementById('body-board').style.overflow = 'hidden';
}
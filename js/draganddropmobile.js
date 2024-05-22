let toDoPos;
let inProgressPos;
let awaitFeedbackPos;
let donePos;
let tASK;
let idNumber;
let startX;
let startY;
let nextX;
let nextY;

 function determinePositions(){
  let toDo = document.querySelector(".mini-box-To-Do");
  let inProgress = document.querySelector(".mini-box-In-Progress");
  let awaitFeedback = document.querySelector(".mini-box-Await-Feedback");
  let done = document.querySelector(".mini-box-Done");
  
  toDoPos = toDo.getBoundingClientRect();
  inProgressPos = inProgress.getBoundingClientRect();
  awaitFeedbackPos = awaitFeedback.getBoundingClientRect();
  donePos = done.getBoundingClientRect();
}

async function startTouch(i) {
  tASK = document.getElementById(`task${i}`);
  idNumber = i;
  tASK.addEventListener("touchstart", e =>{
  startX = e.changedTouches[0].clientX;
  startY = e.changedTouches[0].clientY;
  tASK.addEventListener("touchmove", handleMove);
  })} 

async function handleMove(e){
  e.preventDefault();
  nextX = e.changedTouches[0].clientX;
  nextY = e.changedTouches[0].clientY;

  tASK.style.left = nextX - startX + "px";
  tASK.style.top = nextY -startY + "px";
  tASK.style.zIndex = 100;
  document.getElementById('responsive-DragAndDrop').style.display = 'block';
  document.getElementById('body-board').style.overflowY = 'hidden';
  determinePositions();
  tASK.addEventListener("touchend", handleEnd);
  }

  async function handleEnd(){
   await changeWorkflowResponsive();
    tASK.remove();
    document.getElementById('responsive-DragAndDrop').style.display = 'none';
  document.getElementById('body-board').style.overflowY = 'auto';
  tASK.style.zIndex = 0;
    await addOneTaskToBoard(idNumber);
    checkEmptyTasks();
  }

async function changeWorkflowResponsive(){
  let finalTop = tASK.getBoundingClientRect().top;
  if(finalTop >= toDoPos.top && finalTop < inProgressPos.top){
    tasks[idNumber]["workflow"] = 'To-Do'; 
  } else  if(finalTop >= inProgressPos.top && finalTop < awaitFeedbackPos.top){
    tasks[idNumber]["workflow"] = 'In-Progress'; 
  } else  if(finalTop >= awaitFeedbackPos.top && finalTop < donePos.top){
    tasks[idNumber]["workflow"] = 'Await-Feedback'; 
  } else if (finalTop >= donePos.top){
    tasks[idNumber]["workflow"] = 'Done';
  }
  await setItem("task", JSON.stringify(tasks));
}

    
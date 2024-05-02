function subtaskHtml(element, i) {
    return /*html*/ `
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
/**
 * Event listener that closes dropdown content when clicking outside of it.
 * Listens for 'DOMContentLoaded' and 'click' events.
 */
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        const dropdownContent = document.querySelector('.dropdownContent');
        const dropdownIcon = document.querySelector('.dropdownIcon');
        const clickedElement = event.target;

        const isDropdownContentClicked = dropdownContent && dropdownContent.contains(clickedElement);
        const isDropdownIconClicked = dropdownIcon && dropdownIcon.contains(clickedElement);

        if (!isDropdownContentClicked && !isDropdownIconClicked && dropdownContent) {
            dropdownContent.classList.remove('show');
        }
    });
});


/**
 * Event listener that prevents default behavior when clicking on the dropdown icon.
 * Listens for 'DOMContentLoaded' and 'click' events on the dropdown icon.
 */
document.addEventListener('DOMContentLoaded', function () {
    const dropdownIcon = document.querySelector('.dropdownIcon');

    dropdownIcon.addEventListener('click', function (event) {
        event.preventDefault();
    });
});


/**
 * Event listener that handles form submission for adding tasks.
 * Listens for 'DOMContentLoaded' and 'submit' events on the 'addTaskForm' element.
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addTaskForm');

    form.addEventListener('submit', function (event) {
        if (form.checkValidity()) {
            createTask();
        } else {
            console.log('Das Formular ist ungültig. Bitte überprüfe deine Eingaben.');
        }
    });
});



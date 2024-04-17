document.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(() => {
       let currentUserJSON = JSON.parse(localStorage.getItem('user-name'));
       let currentUser = JSON.stringify(currentUserJSON);
        let initials = currentUser.match(/\b\w/g) || [];
        let result = initials.join('');
        document.getElementById('initials').innerHTML = result;}, 1000)
    })

    let user = JSON.parse(localStorage.getItem('user-name'));

    function openAddTask(){
        window.location.href = 'add_task.html?user=' + user;
}

    function openSummary(){
        window.location.href = 'summary.html?user=' + user;
    }

    function openContacts(){
        window.location.href = 'contacts.html?user=' + user;
    }

    function openBoard(){
        window.location.href = 'board.html?user=' + user;
    }

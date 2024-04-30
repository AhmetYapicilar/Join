let user = JSON.parse(localStorage.getItem('user-name'));

    function showInitials(){
        let name = JSON.stringify(user);
        let initials = name.match(/\b\w/g) || [];
        let result = initials.join('');
        setTimeout(() => {
            document.getElementById('initials').innerHTML = result;
            }, 1000)}
    
    

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

    function showMenuBar(){
        document.getElementById('help-menu-bar').classList.toggle('d-none');
    }

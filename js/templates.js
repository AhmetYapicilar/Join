let user = JSON.parse(localStorage.getItem('user-name'));

    function showInitials(){
        let name = JSON.stringify(user);
        let initials = name.match(/\b\w/g) || [];
        let result = initials.join('');
        setTimeout(() => {
            document.getElementById('initials').innerHTML = result;
            }, 1000)}

    function greetingUser(){
        let content = document.getElementById('greeting');
        let now = new Date();
        let hours = now.getHours();
        if(hours < 17 && hours > 10){
            setTimeout(() => {
                content.innerHTML = 'Good Afternoon,'
                }, 1000)}
         else if(hours < 10 && hours > 4){
            setTimeout(() => {
                content.innerHTML = 'Good Morning,'
                }, 1000)}
         else {
            setTimeout(() => {
                content.innerHTML = 'Good Evening,'
                }, 1000)}
        }
    
    
    

    function openAddTask(){
        window.location.href = 'addTask.html?user=' + user;
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

    function openLogIn(){
        window.location.href = 'Login.html';
    }



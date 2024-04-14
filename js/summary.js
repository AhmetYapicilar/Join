window.onload = function() {
    document.getElementById('initials').innerHTML = extractInitials() 
}

function extractInitials(){
    let params = new URLSearchParams(document.location.search);
    let name = params.get("user");
    let initials = name.match(/\b\w/g) || [];
    let result = initials.join('');
    console.log(result);
    document.getElementById('greeting-name').innerHTML = name;
    return result
}
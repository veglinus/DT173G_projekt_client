// For main functions

window.onload = function() {
    getData("h");
}


const api = "http://localhost/DT173G_projekt_server/api/";

function getData(url) {
    fetch(url, {
        method: 'GET',
        mode: 'cors'
    })
    .then(status) // Kolla om status är okej
    .then(response => response.json()) // Konvertera
    .then(response => {
        return response;
    }).catch(function(error) {
        console.log('Error: ' + error);
        return;
    });;
}


function navigate(view) {
    
}
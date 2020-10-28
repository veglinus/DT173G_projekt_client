// For main functions
const api = "http://127.0.0.1:8000/api/";
const client = "/";
var cv;
var kontakt;
var projekt;

window.onload = function() {
    //getData("hem");
    prepare();
}

function prepare() { // Prepares the other pages for viewing so they're ready
    console.log('preparing data');
    cv = getData(client + 'cv.html', 'GET', false);
    kontakt = getData(client + 'kontakt.html', 'GET', false);
    projekt = getData(client + 'projekt.html', 'GET', false);

    console.log(projekt);
}

function getData(url, method, json) {
    fetch(url, {
        method: method,
        mode: 'cors'
    })
    .then(status) // Kolla om status är okej
    /*
    .then(response => { // Konvertera
        if (json === true) {
            response = response.json();
        }
    })*/
    .then(response => {
        console.log(response);
        return response;
    }).catch(function(error) {
        console.log('Error: ' + error);
        return;
    });;
}


async function navigate(view) { // remove old data on page and replace with new view
    var oldcontent = document.getElementById('content');
    oldcontent.innerHTML = "";
    // animate away

    var data = await getData(client + view, 'GET', false);
    // animate in
    oldcontent.innerHTML = view;


// create a html shard and fetch GET it, then replace old data with new with an animation
}
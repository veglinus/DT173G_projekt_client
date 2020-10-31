// For main functions
const api = "http://127.0.0.1:8000/api/";

var cv;
var kontakt;
var projekt;

window.onload = function() {
    //getData("hem");
    prepare();
}

function prepare() { // Prepares the other pages for viewing so they're ready

}

function next() {
    changeDots();
}

function previous() {
    changeDots();

    
}

function changeDots() {
    // todo
}

async function navigate(view) { // remove old data on page and replace with new view
    var oldcontent = document.getElementById('content');
    oldcontent.innerHTML = "";
    // animate away

    var data = await getData2(client + view, 'GET', false);
    // animate in
    oldcontent.innerHTML = view;


// create a html shard and fetch GET it, then replace old data with new with an animation
}
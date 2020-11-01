
/*

window.onload = fillData();


function fillData() {
    getData('courses', true);
    getData('sites', true);
    getData('jobs', true);
}

function getFrontendData(what) { // What är vad vi ska hämta, courses, sites, jobs
    fetch(backend + what, {
        method: 'GET',
        mode: 'cors'
    })
    .then(status) // Kolla om status är okej
    .then(response => response.json()) // Konvertera
    .then(response => {
        var fill = document.getElementById(what);



    }).catch(function(error) {
        console.log('Error:' + error);
    });
}

*/
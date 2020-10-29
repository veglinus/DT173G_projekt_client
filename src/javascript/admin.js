// For editing products in backend

// TODO: hantera jobb och sites


var backend = "http://127.0.0.1:8000/api/";
var currentelement;
window.onload = onLoad(); // Onload, fyll table med data

function onLoad() {
    getData('courses');
    getData('sites');
    getData('jobs');
}

async function getData(what) {
    
    fetch(backend + what, {
        method: 'GET',
        mode: 'cors'
    })
    .then(status) // Kolla om status är okej
    .then(response => response.json()) // Konvertera
    .then(response => {

        var table = document.querySelector("#" + what + " tbody");
        //console.log(table);
        response.forEach(row => {
            var newrow = table.insertRow(0); // Skapa en ny rad

            switch (what) {
                case 'courses':
                    var index = 0;
                    Object.keys(row).forEach(key => {

                        var newcell = newrow.insertCell(index); // Ny cell
                        newcell.innerHTML = row[key]; // Fyll cell med value
                        newcell.className = key; // Sätt cellens class till keyname
        
                        if (index === 3) { // Ändra kursplan till länkar
                            var old = newcell.innerHTML;
                            newcell.innerHTML = `<a href='${old}'>Kursplan</a>`;
                        }
                        if (index !== 1) { // Gör element editable
                            newcell.contentEditable = "true";
                        }
        
                        index++;
                    });
                    
                    break;
                
                case 'sites':
                    var cell1 = newrow.insertCell(0);
                    var cell2 = newrow.insertCell(1);
                    cell1.innerHTML = `<a href='${row["url"]}'>${row["name"]}</a>`;
                    cell2.innerHTML = row["description"];
                    break;
            
                case 'jobs':
                    var cell1 = newrow.insertCell(0);
                    var cell2 = newrow.insertCell(1);
                    var cell3 = newrow.insertCell(2);
                    cell1.innerHTML = row["name"];
                    cell2.innerHTML = row["description"];
                    cell3.innerHTML = row["startdate"] + " - " + row["enddate"];
                    break;
                default:
                    break;
            }

            var deletebutton = newrow.insertCell(index); // TODO fix the function delete
            deletebutton.innerHTML = `<a href='#' onclick='deleteCourse("${row['code']}")'><img src="assets/delete.svg" alt="Ta bort"></a>`;

        });
    }
    /*
    ).then(function() {
        trackCells();
        trackOff(); // Tracka om celler redigeras nu efter att de har skapats
    } 
    */
    ).catch(function(error) {
        console.log('Error:' + error);
    });
}

function reload() {
    var tbody = document.getElementsByTagName("tbody");
    tbody.forEach(element => {
        element.innerHTML = "";
    });
    onLoad();
}

function trackCells() {
    const cells = document.querySelectorAll("td:not(.link)");
    cells.forEach(element => element.addEventListener("click", function() {

        currentelement = element.innerHTML;
    }));
}

function trackOff() { // Trackar om en cell förlorat fokus
    var cells = document.querySelectorAll("td:not(.link)");
    cells.forEach(element => element.addEventListener("blur", function() {
        console.log(this.innerHTML + " has been blurred");

        if (currentelement !== this.innerHTML) { // Om innehållet har ändrats: Uppdatera DB
            var what = element.className; // Klassnamn är vilken typ av kolumn det är
            var parent = element.parentElement; // Hittar parent av elementet klickat på
            var index = parent.firstChild.innerHTML; // Hittar första elementet av parent, alltså kurskoden som är index
    
            updateOne(index, what, this.innerHTML);
        }
    }));
}

function updateOne(index, what, newdata) {
    var senddata = {
        'index': index, // vilken rad, alltså code som är index
        'what': what, // vilken kolumn ska vi ändra på
        'newvalue': newdata // det nya värdet
    }

    fetch('http://localhost/DT173G_moment5_server/updateone.php', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(senddata)
    })
    .then(status)
    //.then(response => response.json())
    .then(response => {
        console.log('Updated in DB!');

    }).catch(function(error) {
        console.log('Error: ' + error);
    });
}


function del(data, what) {

    var senddata = {
        'code': data
    }
    var res = confirm("Är du säker på att du vill ta bort detta?");

    if (res === true) {
        fetch(backend + what, {
            method: 'DELETE',
            mode: 'cors',
            body: JSON.stringify(senddata)
        })
        .then(status)
        //.then(response => response.json())
        .then(response => {
            
            alert(response);
            reload();
    
        }).catch(function(error) {
            console.log('Error: ' + error);
            reload();
        });
    }
}

const myForm = document.getElementById("form");
myForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addCourse();
});

function addCourse() {
    const form = new FormData(myForm);

    fetch('http://localhost/DT173G_moment5_server/create.php', {
        method: 'POST',
        mode: 'cors',
        body: form
    })
    .then(status)
    .then(response => response.json())
    .then(response => {
        
        if (response === "Kurs tillagd!") {
            reload();
        } else {
            alert(response);
        }

    }).catch(function(error) {
        console.log('Error: ' + error);
    });

}

// Tagen från https://developers.google.com/web/updates/2015/03/introduction-to-fetch
function status(response) {
    //console.log(response.status);
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
}
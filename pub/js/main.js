var backend = "http://127.0.0.1:8000/api/";
var currentelement;
window.onload = onLoad();

function onLoad() {

    

    getData('courses');
    getData('sites');
    getData('jobs');
}

async function getData(what) { // What är vad vi ska hämta, courses, sites, jobs
    fetch(backend + what, {
        method: 'GET',
        mode: 'cors'
    })
    .then(status) // Kolla om status är okej
    .then(response => response.json()) // Konvertera
    .then(response => {

        var table = document.querySelector("#" + what + " tbody"); // Ändrar selectorn till bodyn av vad vi hämtar, tex #courses tbody

        response.forEach(row => {
            var newrow = table.insertRow(0); // Skapa en ny rad

            switch (what) {
                case 'courses':
                    var index = 0;
                    Object.keys(row).forEach(key => { // Iterera genom varje par av key & value

                        var newcell = newrow.insertCell(index); // Ny cell
                        newcell.innerHTML = row[key]; // Fyll cell med value
                        newcell.className = key; // Sätt cellens class till keyname för css
        
                        if (index === 3) { // Ändra kursplan till länkar
                            var old = newcell.innerHTML;
                            newcell.innerHTML = `<a href='${old}'>Kursplan</a>`;
                        }
                        if (index !== 1) { // Gör element editable
                            newcell.contentEditable = "true";
                        }
        
                        index++;
                    });

                    var deletebutton = newrow.insertCell(index);
                    deletebutton.innerHTML = `<a href='#' onclick='del("${row["id"]}", "courses")'><img src="assets/delete.svg" alt="Ta bort"></a>`;
                    
                    break;
                
                case 'sites':
                    var cell1 = newrow.insertCell(0); // Standard, nya celler
                    var cell2 = newrow.insertCell(1);
                    cell1.innerHTML = `<a href='${row["url"]}'>${row["name"]}</a>`; // Sätt in data
                    cell2.innerHTML = row["description"];
                    cell1.contentEditable = "true"; // Gör editable
                    cell2.contentEditable = "true";

                    var deletebutton = newrow.insertCell(index); // TODO fix the function delete
                    deletebutton.innerHTML = `<a href='#' onclick='del("${row["id"]}", "sites")'><img src="assets/delete.svg" alt="Ta bort"></a>`;
                    break;
            
                case 'jobs':
                    var cell1 = newrow.insertCell(0);
                    var cell2 = newrow.insertCell(1);
                    var cell3 = newrow.insertCell(2);
                    var cell4 = newrow.insertCell(3);
                    cell1.innerHTML = row["name"];
                    cell2.innerHTML = row["description"];
                    cell3.innerHTML = row["startdate"];
                    cell4.innerHTML = row["enddate"];
                    cell1.contentEditable = "true";
                    cell2.contentEditable = "true";
                    cell3.contentEditable = "true";
                    cell4.contentEditable = "true";
                    var deletebutton = newrow.insertCell(index); // TODO fix the function delete
                    deletebutton.innerHTML = `<a href='#' onclick='del("${row["id"]}", "jobs")'><img src="assets/delete.svg" alt="Ta bort"></a>`;
                    break;
                default:
                    break;
            }

            

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
    /*
    var tbody = document.getElementsByTagName("tbody");
    tbody.forEach(element => {
        element.innerHTML = "";
    });*/
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
    
            var type = element.parentElement.parentElement.parentElement.id; // Vilken table som klickats

            updateOne(index, what, this.innerHTML, type);
        }
    }));
}

function updateOne(index, what, newdata, type) {
    var senddata = {
        'index': index, // vilken rad, alltså code som är index
        'what': what, // vilken kolumn ska vi ändra på
        'newvalue': newdata // det nya värdet
    }

    fetch(backend + type, {
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
    var type = document.getElementById('type').value;

    fetch(backend + type, {
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
        alert('Error: ' + error);
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

function formChange() {
    var form = document.getElementById("type").value;
    var content = document.getElementById("formcontent");
    switch (form) {
        case 'courses':
            content.innerHTML = `
            <label for="code">Kurskod:</label><br>
            <input type="text" name="code" id="code" required><br><br>
    
            <label for="name">Kursnamn:</label><br>
            <input type="text" name="name" id="name" required><br><br>
        
            <label for="progression">Progression:</label><br>
            <input type="text" name="progression" id="progression" required><br><br>
    
            <label for="syllabus">Kursplan:</label><br>
            <input type="url" name="syllabus" id="syllabus" required><br><br>

            <input type="submit" value="Lägg till">
            `;
            break;
    
        case 'jobs':
            content.innerHTML = `
            <label for="name">Namn:</label><br>
            <input type="text" name="name" id="name" required><br><br>

            <label for="description">Beskrivning:</label><br>
            <input type="text" name="description" id="description" required><br><br>
        
            <label for="startdate">Från:</label><br>
            <input type="text" name="startdate" id="startdate" required><br><br>
    
            <label for="enddate">Till:</label><br>
            <input type="text" name="enddate" id="enddate" required><br><br>

            <input type="submit" value="Lägg till">
            `;
            break;
        
        case 'sites':
            content.innerHTML = `
            <label for="name">Namn:</label><br>
            <input type="text" name="name" id="name" required><br><br>
    
            <label for="url">Url:</label><br>
            <input type="url" name="url" id="url" required><br><br>
        
            <label for="description">Beskrivning:</label><br>
            <input type="text" name="description" id="description" required><br><br>

            <input type="submit" value="Lägg till">
            `;
            break;
        default:
            break;
    }
}
// For main functions
const api = "http://127.0.0.1:8000/api/";
const client = "/";
var cv;
var kontakt;
var projekt;

window.onload = function() {
    //getData("hem");
    //prepare();
}

function prepare() { // Prepares the other pages for viewing so they're ready
    console.log('preparing data');
    cv = getData2(client + 'cv.html', 'GET', false);
    kontakt = getData2(client + 'kontakt.html', 'GET', false);
    projekt = getData2(client + 'projekt.html', 'GET', false);

    console.log(projekt);
}


function getData2(url, method, json) {
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

    var data = await getData2(client + view, 'GET', false);
    // animate in
    oldcontent.innerHTML = view;


// create a html shard and fetch GET it, then replace old data with new with an animation
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
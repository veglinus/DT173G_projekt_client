// Only load for admin.html
var backend = "http://127.0.0.1:8000/api/";

var admin = true;
var editable = true;
window.onload = onLoad();

// Skicka request till /check, if true; set auth = true, else false

function onLoad() {
    fetch(backend + "check", {
        method: 'GET',
        mode: 'cors'
    })
    .then(status)
    .then(response => response.json()).then(response => {

        console.log(response['auth']);
        auth = response['auth'];

        var loginform = document.getElementById("login");
        var adminstuff = document.getElementById("adminstuff");
    
        if (auth === false) { // If not logged in, visa login
            loginform.style.display = "initial";
            adminstuff.style.display = "none";
        } else { // If logged in
            loginform.style.display = "none";
            adminstuff.style.display = "initial";
        }
    
        //console.log(auth);
        getData('courses', editable);
        getData('sites', editable);
        getData('jobs', editable);
    });
}

async function getData(what, editable) { // What är vad vi ska hämta, courses, sites, jobs
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

                    if (editable === true) {
                        var deletebutton = newrow.insertCell(index);
                        deletebutton.innerHTML = `<a href='#' onclick='del("${row["id"]}", "courses")'><img src="assets/delete.svg" alt="Ta bort"></a>`;
                    }

                    
                    break;
                
                case 'sites':
                    var cell1 = newrow.insertCell(0); // Standard, nya celler
                    var cell2 = newrow.insertCell(1);
                    cell1.innerHTML = `<a href='${row["url"]}'>${row["name"]}</a>`; // Sätt in data
                    cell2.innerHTML = row["description"];

                    if (editable === true) {
                        cell1.contentEditable = "true"; // Gör editable
                        cell2.contentEditable = "true";
                        var deletebutton = newrow.insertCell(index); // TODO fix the function delete
                        deletebutton.innerHTML = `<a href='#' onclick='del("${row["id"]}", "sites")'><img src="assets/delete.svg" alt="Ta bort"></a>`;
                    }


                    
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
                    if (editable === true) {
                        cell1.contentEditable = "true";
                        cell2.contentEditable = "true";
                        cell3.contentEditable = "true";
                        cell4.contentEditable = "true";
                        var deletebutton = newrow.insertCell(index); // TODO fix the function delete
                        deletebutton.innerHTML = `<a href='#' onclick='del("${row["id"]}", "jobs")'><img src="assets/delete.svg" alt="Ta bort"></a>`;
                    }
                    
                    break;
                default:
                    break;
            }

            

        });
    }
    /*
    ).then(function() {

        if (editable === true) {
            trackCells();
            trackOff(); // Tracka om celler redigeras nu efter att de har skapats
        }
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

var currentelement;

// TODO: Move to admin.js


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
            alert(error);
            reload();
        });
    }
}

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
            <label for="id">Kurskod:</label><br>
            <input type="text" name="id" id="id" required><br><br>
    
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


const myForm = document.getElementById("form");
myForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addCourse();
});


// Listen to form

// if submit, send call to server
// if true response, reload page
// else send "wrong password message"

document.querySelector('form').addEventListener('submit', (event) => { // Om någon submittar login
    event.preventDefault(); // Stoppa default
    const form = new FormData(event.target);

    console.log(form.get('email'));
    console.log(form.get('password'));

    fetch(backend + "logon", { // Skicka till API
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ // Skicka med data från form
            email: form.get('email'),
            password: form.get('password')
        })
    })
    .then(status)
    .then(response => response.json()) // Konvertera till JSON
    .then(response => {
        console.log(response);
        if (response['auth'] == "true") { // Successs
            console.log('success');
            //location.reload();
            //onLoad(); // Ladda om

            var loginform = document.getElementById("login");
            var adminstuff = document.getElementById("adminstuff");
            loginform.style.display = "none";
            adminstuff.style.display = "initial";
        } else {// Om auth inte gick igenom

            console.log('fail');
            alert(response['email']); // Skicka error
            document.getElementById("password").value = ""; // cleara password-fält
        }
    });


    
});
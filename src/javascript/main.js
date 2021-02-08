// Only load for index.html
// Taget och modiferat från Moment 5

var backend = "http://127.0.0.1:8000/api/";

window.onload = onLoad();
var editable = false;

function onLoad() {
    getData('courses', editable);
    getData('sites', editable);
    getData('jobs', editable);
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
    ).catch(function(error) {
        console.log('Error:' + error);
    });
}

function reload() {
    onLoad();
}
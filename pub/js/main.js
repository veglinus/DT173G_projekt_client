"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// For editing products in backend

/*
var currentelement;
//window.onload = getData(); // Onload, fyll table med data

function reload() {
    var tbody = document.getElementById("coursesbody");
    tbody.innerHTML = "";
    getData();
}

function getCourses() {
    fetch('http://localhost/DT173G_moment5_server/read.php', {
        method: 'GET',
        mode: 'cors'
    })
    .then(status) // Kolla om status är okej
    .then(response => response.json()) // Konvertera
    .then(response => {
    
        var table = document.getElementById("coursesbody");
        //console.log(response);

        response.forEach(row => {
            var newrow = table.insertRow(0); // Skapa en ny rad

            var cell1 = newrow.insertCell(0); // Och 5 nya celler
            var cell2 = newrow.insertCell(1);
            var cell3 = newrow.insertCell(2);
            var cell4 = newrow.insertCell(3);
            var cell5 = newrow.insertCell(4);

            // Maybe make this into a edit-button instead
            cell1.contentEditable = "true";
            cell2.contentEditable = "true";
            cell3.contentEditable = "true";

            cell1.className = 'kurskod';
            cell2.className = 'kursnamn';
            cell3.className = "progression";
            cell4.className = 'link';
            cell5.className = 'link';

            cell1.innerHTML = row["code"]; // Tryck in data i dessa 5 celler
            cell2.innerHTML = row["name"];
            cell3.innerHTML = row["progression"];
            cell4.innerHTML = `<a href='${row['syllabus']}'>Kursplan</a>`;
            cell5.innerHTML = `<a href='#' onclick='deleteCourse("${row['code']}")'><img src="assets/delete.svg" alt="Ta bort"></a>`;
        });
    }
    ).then(function() {
        trackCells();
        trackOff(); // Tracka om celler redigeras nu efter att de har skapats
    } 
    ).catch(function(error) {
        console.log('Error: ' + error);
    });;
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


function deleteCourse(data) {
    var senddata = {
        'code': data
    }
    var res = confirm("Är du säker på att du vill ta bort kursen?");

    if (res === true) {
        fetch('http://localhost/DT173G_moment5_server/delete.php', {
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
*/
// For main functions
var api = "http://127.0.0.1:8000/api/";
var client = "/";
var cv;
var kontakt;
var projekt;

window.onload = function () {
  //getData("hem");
  prepare();
};

function prepare() {
  // Prepares the other pages for viewing so they're ready
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
  }).then(status) // Kolla om status är okej

  /*
  .then(response => { // Konvertera
      if (json === true) {
          response = response.json();
      }
  })*/
  .then(function (response) {
    console.log(response);
    return response;
  })["catch"](function (error) {
    console.log('Error: ' + error);
    return;
  });
  ;
}

function navigate(_x) {
  return _navigate.apply(this, arguments);
}

function _navigate() {
  _navigate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(view) {
    var oldcontent, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // remove old data on page and replace with new view
            oldcontent = document.getElementById('content');
            oldcontent.innerHTML = ""; // animate away

            _context.next = 4;
            return getData(client + view, 'GET', false);

          case 4:
            data = _context.sent;
            // animate in
            oldcontent.innerHTML = view; // create a html shard and fetch GET it, then replace old data with new with an animation

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _navigate.apply(this, arguments);
}

function next() {
  changeDots();
}

function previous() {
  changeDots();
}

function changeDots() {// todo
}
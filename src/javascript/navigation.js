var slideIndex = 1; // Vilken sida vi ska börja på

// 1 = hem, 2 = projekt, 3 = cv, 4 = kontakt

window.onload = function() {
    if (window.location.pathname === "/") {
        showDivs(slideIndex);
    }
}

function setPage(n) { // For indicator dots
    if (isNaN(n)) {
        switch (n) {
            case 'hem':
                n = 1;
                break;
            case 'projekt':
                n = 2;
                break;
            case 'cv':
                n = 3;
                break;
            case 'kontakt':
                n = 4;
                break;
            default:
                n = 1;
                break;
        }
    }
    showDivs(slideIndex = n);
}
function plusDivs(n) { // Om man klickar höger/vänster (Obsolete)
    showDivs(slideIndex += n);
}
  
function showDivs(n) { // Från W3Schools, stora delar använda
    var i;
    var x = document.getElementsByClassName("page");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }

    x[slideIndex-1].style.display = "initial"; 

    if (n === 1 || n === 4) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "initial";
    }
     

    var dots = document.getElementsByClassName("navoption");
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" underline", "");
    }
    dots[slideIndex-1].className += " underline";
}
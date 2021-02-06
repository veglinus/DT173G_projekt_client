var slideIndex = 1;

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
function plusDivs(n) { // Om man klickar höger/vänster
    showDivs(slideIndex += n);
}
  
function showDivs(n) {
    //console.log(n);
    var i;
    var x = document.getElementsByClassName("page");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    console.log(n);

    /*
    if (window.innerWidth > 768 && n === 1) {
        x[slideIndex-1].style.display = "flex"; 
    } else { */
        x[slideIndex-1].style.display = "initial"; 
    //}
     

    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[slideIndex-1].className += " active";

}
document.addEventListener('DOMContentLoaded', function() {
    let urlParams = new URLSearchParams(window.location.search);
    let un = urlParams.get("un");
    sessionStorage.setItem("un", un);

    const links = document.querySelectorAll(".page");
    let iframe = document.querySelector("iframe.main-ifm");
    let btn = document.getElementById("out-button");

    if (sessionStorage.getItem("present-page") != null) {
        iframe.src = sessionStorage.getItem("present-page");
    }
    else{
        iframe.src = "first.html";
    }

    document.addEventListener("keydown", function(event){
        if(event.key === "Escape") {
            var i;
        }
    })

    links.forEach(link => {
        link.onclick = function () {
            iframe.src = link.getAttribute("href");
            sessionStorage.setItem("present-page", link.getAttribute("href"));
            return false;
        }
    });

    btn.onclick = function() {
        window.location.href = "checkin.html";
    };
});
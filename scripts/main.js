const links = document.querySelectorAll(".page");
let iframe = document.getElementById('ifm');
let nm = document.getElementById("top-name");

if (sessionStorage.getItem("present-page") != null) {
    iframe.src = sessionStorage.getItem("present-page");
}
else{
    iframe.src = "htmls/first.html";
}

links.forEach(link => {
    link.onclick = function () {
        iframe.src = link.getAttribute("href");
        sessionStorage.setItem("present-page", link.getAttribute("href"));
        return false;
    }
});
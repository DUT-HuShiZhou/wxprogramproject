const links = document.querySelectorAll(".page");
let iframe = document.getElementById('ifm');

links.forEach(link => {
    link.onclick = function () {
        iframe.src = link.getAttribute("href");
        return false;
    }
});
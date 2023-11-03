const iframe = document.getElementById("ifm");
iframe.onload = function() {
    let content = iframe.contentWindow.document;
    content.querySelector("body").style.backgroundImage = "images/test.jpg";
}
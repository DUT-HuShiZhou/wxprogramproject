let sl = document.querySelector("button.sl-btn");

sl.onclick = function() {
    let ifm = document.querySelector("iframe.line-ifm");
    
    ifm.src = "drama-line.html?num=50 ";
};
let sl = document.querySelector("button.sl-btn");

sl.onclick = function() {
    let ifm = document.querySelector("iframe.line-ifm");
    let ls = document.querySelector("div.line-show");
    
    if (ifm.src != "about:blank") {
        ifm.src = "about:blank";
        ifm.style.backgroundColor = null;
        ls.style.display = "none";
    }
    else {
        ifm.src = "drama-line.html?num=50 ";
        ifm.style.backgroundColor = "white";
        ls.style.display = "block";
    }

};
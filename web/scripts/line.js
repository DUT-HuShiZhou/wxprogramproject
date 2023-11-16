let sl = document.querySelector("button.sl-btn");

let container = document.querySelector("nav.container");

var xhr = new XMLHttpRequest();
var url = "/searchRoute";

sl.onclick = function() {
    let ifm = document.querySelector("iframe.line-ifm");
    let ls = document.querySelector("div.line-show");
    
    if (ifm.src != "about:blank") {
        ifm.src = "about:blank";
        ifm.style.backgroundColor = null;
        ls.style.display = "none";
    }
    else {
        var params = new FormData();
        params.append("type", "lines");
        params.append("un", sessionStorage.getItem("un"));
        xhr.open("POST", url, false);

        xhr.onreadystatechange =  function() {
            var data = xhr.responseText;
            ifm.src = "drama-line.html?revise=" + data;
            ifm.style.backgroundColor = "white";
            ls.style.display = "block";
        };

        xhr.send(params);
    }
};

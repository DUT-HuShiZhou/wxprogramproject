document.addEventListener("DOMContentLoaded", function() {
    let sl = document.querySelector("button.sl-btn");
    let sp = document.querySelector("button.sp-btn");

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
            xhr.open("POST", url, true);
            var params = new FormData();
            params.append("un", sessionStorage.getItem("un"));
            params.append("type", "lines");

            xhr.onreadystatechange =  function() {
                var data = xhr.responseText;
                ifm.src = "drama-line.html?revise=" + data;
                ifm.style.backgroundColor = "white";
                ls.style.display = "block";
            };

            xhr.send(params);
        }
    };

    sp.onclick = function() {
    };
})
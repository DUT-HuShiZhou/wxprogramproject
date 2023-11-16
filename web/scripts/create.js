let sl = document.querySelector("button.sl-btn");
let fw = document.querySelector("button.fw-btn");

let container = document.querySelector("nav.container");

var xhr = new XMLHttpRequest();
var url = "the post url";

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
        xhr.open("POST", url, false);

        xhr.onreadystatechange =  function() {
            var data = xhr.responseText;
            ifm.src = "drama-line.html?lines=" + data;
            ifm.style.backgroundColor = "white";
            ls.style.display = "block";
        };

        xhr.send(params);
    }
};

fw.onclick - function() {
    var params = new FormData();
    params.append("type", "formworksnum");
    xhr.open("POST", url, true);

    //xhr.setRequestHeader(); 设置请求头，如果有需要
    xhr.onreadystatechange = function() {
        var data = xhr.responseText;
        for (var i = 0; i < data; i++) {
            var button = document.createElement("button");
            button.textContent = "模板" + (i + 1);
            button.id = "num" + (i + 1);
            container.appendChild(button);
        }
    }

    xhr.send(params)
};
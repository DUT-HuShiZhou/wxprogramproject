document.addEventListener('DOMContentLoaded', function() {
    let sl = document.querySelector("button.sl-btn");
    let fw = document.querySelector("button.fw-btn");

    let context = document.querySelector("iframe.context-ifm");

    let container = document.querySelector("nav.container");
    var xhr = new XMLHttpRequest();
    var url = "/searchRoute";

    this.addEventListener("message", function(event) {
        if (event.data.action === "drama-line-loaded") {
            context.postMessage({action: "load_context", states: event.data.states, num: event.data.num}, "*")
        }
    })

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
            params.append("type", "lines");
            params.append("un", sessionStorage.getItem("un"));

            xhr.onreadystatechange =  function() {
                var data = xhr.responseText;
                ifm.src = "drama-line.html?choose=" + data;
                ifm.style.backgroundColor = "white";
                ls.style.display = "block";
            };

            xhr.send(params);
        }
    };

    fw.onclick = function() {
        if (container.childElementCount === 0) {
            xhr.open("POST", url, true);
            var params = new FormData();
            params.append("type", "formworksnum");

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

            xhr.send(params);

            var div = document.createElement("div");
            div.className = "div-container";
            for (var i = 0; i < 5; i++) {
                var button = document.createElement("button");
                button.textContent = "模板" + (i + 1);
                button.id = "num" + (i + 1);
                div.appendChild(button);
            }
            container.appendChild(div);
        }
        else {
            container.innerHTML = "";
        }
    };
})
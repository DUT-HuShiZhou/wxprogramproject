document.addEventListener('DOMContentLoaded', function() {
    let sl = document.querySelector("button.sl-btn");
    let fw = document.querySelector("button.fw-btn");
    let fs = document.querySelector("button.fs-btn");
    let re = document.querySelector("button.rs-btn");

    let ifm = document.querySelector("iframe.line-ifm");
    let ls = document.querySelector("div.line-show");
    let context = document.querySelector("iframe.context-ifm");

    let infplace = document.querySelector("div.infplace");

    let container = document.querySelector("div.fwbtn-container");
    var xhr = new XMLHttpRequest();
    var url = "/searchRoute";

    window.addEventListener("message", function(event) {
        if (event.data.action === "drama-line-loaded") {
            ifm.src = "about:blank";
            ifm.style.backgroundColor = null;
            ls.style.display = "none";
            context.postMessage({action: "load_context", states: event.data.states}, "*");
        }
        else if (event.data.action === "page-load") {
            var url = "/getpage"
            xhr.open("POST", url, true);

            var params = new FormData();
            params.append("un", sessionStorage.getItem("un"));
            params.append("line", sessionStorage.getItem("drama-id"));
            params.append("page", event.data.datafrom);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    var data = xhr.responseText;
                    // ...
                }
            }

            xhr.send(params);
        }
    }, false);

    sl.onclick = function() {
        if (ifm.src != "about:blank") {
            ifm.src = "about:blank";
            ifm.style.backgroundColor = null;
            ls.style.display = "none";
        }
        else {
            ifm.src = "drama-line.html?choose=1;test";
            xhr.open("POST", url, true);
            var params = new FormData();
            params.append("type", "lines");
            params.append("un", sessionStorage.getItem("un"));

            xhr.onreadystatechange =  function() {
                var data = xhr.responseText;
                // ifm.src = "drama-line.html?choose=" + data;
                ifm.style.backgroundColor = "white";
                ls.style.display = "block";
            };

            xhr.send(params);
        }
    };

    fw.onclick = function() {
        if (sessionStorage.getItem("drama-contained")){
            if (container.childElementCount === 0) {
                var url = "/getFormworks";
                xhr.open("POST", url, true);
                var params = new FormData();
                params.append("type", "formworks");

                xhr.onreadystatechange = function() {
                    if(xhr.readyState === 4){
                        layui.use(function(){
                            var data = xhr.responseText.split(";");
                            for(var i = 1; i <= data[0]; i++){
                                (function(i){
                                var button = document.createElement("button");
                                button.type = "button";
                                button.classList.add("layui-btn");
                                button.classList.add("layui-btn-sm");
                                button.textContent = data[i].split(":")[0];
                                button.onclick = function() {
                                    var url = "/getFormwork";
                                    xhr.open("POST", url, true);
                                    var params = new FormData();
                                    params.append("formwork-type", data[i].split(":")[1]);

                                    xhr.onreadystatechange = function() {
                                        if(xhr.readyState === 4) {
                                            var data = xhr.responseText;
                                            // ...
                                        }
                                    }

                                    xhr.send(params);
                                }
                                container.appendChild(button);
                            })(i);}
                        });
                    }
                }

                xhr.send(params);
            }
            else {
                container.innerHTML = "";
            }
        }
        else {
            layui.use(function(){
                layui.layer.open({
                    type: 1,
                    area: ["45vw", "50vh"],
                    title: "错误",
                    shade: 0.6,
                    shadeClose: true,
                    maxmin: false,
                    anim: Math.floor(Math.random() * 6),
                    content: '<div style="padding: 32px;text-align: center;">你似乎没有预先选择好路线<hr>无法对空路线进行框架选择</div>'
                })
            })
        }
    };

    fs.onclick = function() {
        if(sessionStorage.getItem("drama-contained")) {
            result = confirm("此操作将改变服务端数据，请再一次确认是否更改");
            if(result) {
                if(sessionStorage.getItem("cacheDrama-contained")){
                    sessionStorage.setItem("drama-contained", sessionStorage.getItem("cacheDrama-contained"));
                }
                var url = "";

                var params = new FormData();
                params.append("un", sessionStorage.getItem("un"));
                params.append("type", "drama");
                params.append("id", sessionStorage.getItem("drama-id"));
                var j = JSON.parse(sessionStorage.getItem("drama-contained"));
                params.append("num", j.length);
                for(var i = 0; i < j.length; i++){
                    params.append(i + 1, j[i][0] + "|" + j[i][1] + "|" + j[i][2]);
                }

                xhr.open("POST", url, true);
                xhr.send(params);
            }
        }
        else{
            layui.use(function(){
                layui.layer.open({
                    type: 1,
                    area: ["45vw", "50vh"],
                    title: "错误",
                    shade: 0.6,
                    shadeClose: true,
                    maxmin: false,
                    anim: Math.floor(Math.random() * 6),
                    content: '<div style="padding: 32px;text-align: center;">没有检测到剧本数据存在<hr>无法向服务端发送数据</div>'
                })
            })
        }
    }

    re.onclick = function() {
        sessionStorage.removeItem("cacheDrama-contained");
        var resetDramaEvent = new CustomEvent("resetDrama");
        context.dispatchEvent(resetDramaEvent);
    }


})
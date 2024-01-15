document.addEventListener('DOMContentLoaded', function() {
    /**路线选择按钮 */
    let sl = document.querySelector("button.sl-btn");
    /**框架选择按钮 */
    let fw = document.querySelector("button.fw-btn");
    /**完成设置按钮 */
    let fs = document.querySelector("button.fs-btn");
    /**重置按钮 */
    let re = document.querySelector("button.rs-btn");

    let ifm = document.querySelector("iframe.line-ifm");
    let ls = document.querySelector("div.line-show");
    let context = document.querySelector("iframe.context-ifm");
    let workplace = document.querySelector("div.showitem-panel");

    let shwoitemplace = document.querySelector("div.main-item");
    /**组件详细操作展示区 */
    let infplace = document.querySelector("div.infplace");

    let container = document.querySelector("div.fwbtn-container");
    var xhr = new XMLHttpRequest();
    var url = "/searchRoute";

    const uploadItemEvent = new CustomEvent("UploadAllItem");

    window.addEventListener("message", function(event) {
        if (event.data.action === "drama-line-loaded") {
            ifm.src = "about:blank";
            ifm.style.backgroundColor = null;
            ls.style.display = "none";
            workplace.style.display = "block";
            context.postMessage({action: "load_context", states: event.data.states}, "*");
        }
        else if (event.data.action === "page-load") {
            shwoitemplace.innerHTML = "";
            infplace.innerHTML = "";
            var url = "/getpage"
            xhr.open("POST", url, true);

            var params = new FormData();
            params.append("un", sessionStorage.getItem("un"));
            params.append("line", sessionStorage.getItem("drama-id"));
            params.append("page", event.data.datafrom);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    var data = xhr.responseText;
                    data.split(";");
                    var datas = []
                    for(var i = 0; i < data.length; i++) {
                        datas.push(data[i].split(":"));
                    }
                    // sessionStorage.setItem("page-datas", JSON.stringify(datas));
                    // page_load();
                }
            }

            xhr.send(params);

            // test
            sessionStorage.setItem("page-datas", JSON.stringify([[event.data.datafrom.split("|")[0], "90x40", "5x0",""],[event.data.datafrom.split("|")[1], "94x60", "3x0",""]]));
            page_load();
            // test
        }
    }, false);

    /**添加hr函数 */
    function hr_add() {
        var hr = document.createElement("hr");
        hr.style.margin = "10px 0";
        hr.style.border = "1px solid #5a5a5a";
        infplace.appendChild(hr);
    }

    /**datas数据结构: type, size(width x height,百分比单位,单位省略), position(left x top,百分比单位,单位省略), url*/
    function page_load() {
        if (sessionStorage.getItem("page-datas")){
            var datas = JSON.parse(sessionStorage.getItem("page-datas"));
            if (datas != ["none"]){
                itemsClear();
                for (var i = 0; i < datas.length; i++) {
                    (function(i){
                        switch(datas[i][0]) {
                            case "photo":
                                photo(datas[i], i);
                                break;
                            case "question":
                                question(datas[i], i);
                                break;
                            case "video":
                                video(datas[i], i);
                                break;
                            case "audio":
                                audio(datas[i], i);
                                break;
                            default:
                                break;
                        }
                        hr_add();
                })(i);}

                var box = document.createElement("div");
                box.className = "item";
                var upload_button = document.createElement("button");
                upload_button.classList = "layui-btn layui-btn-fluid";
                upload_button.textContent = "上传更新";
                upload_button.style.height = "30px";
                upload_button.style.fontSize = "16px";
                upload_button.style.lineHeight = "20px";
                upload_button.onclick = function() {
                    window.dispatchEvent(uploadItemEvent, "*");
                }
                box.appendChild(upload_button);
                infplace.appendChild(box);
                
                fresh_form();
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
                    content: '<div style="padding: 32px;text-align: center;">发生了未知错误<hr>没有检测到来自服务器的数据<hr>数据加载失败</div>'
                })
            })
        }
    }

    sl.onclick = function() {
        if (ifm.src != "about:blank") {
            ifm.src = "about:blank";
            ifm.style.backgroundColor = null;
            ls.style.display = "none";
            workplace.style.display = "block";
        }
        else {
            workplace.style.display = "none";
            ifm.src = "drama-line.html?choose=1;test";
            xhr.open("POST", url, true);
            var params = new FormData();
            params.append("type", "lines");
            params.append("un", sessionStorage.getItem("un"));

            xhr.onreadystatechange =  function() {
                if(xhr.readyState === 4){
                    var data = xhr.responseText;
                    // ifm.src = "drama-line.html?choose=" + data;
                    ifm.style.backgroundColor = "white";
                    ls.style.display = "block";
                }
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
                                button.classList = "layui-btn layui-btn-sm";
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

    let test = document.querySelector("button.test");
})
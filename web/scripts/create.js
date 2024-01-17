document.addEventListener('DOMContentLoaded', function() {
    let ifm_fram = document.querySelector(".line-choose-ifm");

    var xhr = new XMLHttpRequest();
    var url = "/searchRoute";

    const uploadItemEvent = new CustomEvent("UploadAllItem");

    window.addEventListener("message", function(event) {
        if (event.data.action === "drama-line-loaded") {
            layui.use(function(){
                layer.open({
                    type: 2,
                    title: false,
                    area: ['90vw', '90vh'],
                    content: '../htmls/context.html',
                    fixed: false, // 不固定
                    maxmin: false,
                    shadeClose: true,
                });
            });
        }
        else if (event.data.action === "page-load") {
            // test
            sessionStorage.setItem("page-datas", JSON.stringify([[event.data.datafrom.split("|")[0], "90x40", "5x0",""],[event.data.datafrom.split("|")[1], "94x60", "3x0",""]]));
            page_load();
            // test
        }
    }, false);

    ifm_fram.src = "drama-line.html?choose=1;test";
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

    // 页面加载函数（可挪用）
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

    // 上传数据函数（暂时保留可挪用）
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
})
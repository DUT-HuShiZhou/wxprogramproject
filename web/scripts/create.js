// 数据发送顺序：首先发送路线数据，在进行完路线选择后发送剧本数据和点位数据，在选择完剧本后，打开编辑页面
document.addEventListener('DOMContentLoaded', function() {
    let ifm_fram = document.querySelector(".line-choose-ifm");

    var xhr = new XMLHttpRequest();
    var url = "/searchRoute";//这里需要改 发送给你名称+id

    const uploadItemEvent = new CustomEvent("UploadAllItem");

    window.addEventListener("message", function(event) {
        if (event.data.action === "drama-line-loaded") {
            layui.use(function(){
                var layer = layui.layer;
                function open_context () {
                    layer.open({
                        type: 2,
                        title: false,
                        area: ['90vw', '90vh'],
                        content: '../htmls/context.html',
                        fixed: false, // 不固定
                        maxmin: false,
                        shadeClose: false,
                    });
                };

                var url = "/webgetdramascriptlist";
                var xhr = new XMLHttpRequest();
                xhr.open("POST", url, true);
                var params = new FormData();
                params.append("un", sessionStorage.getItem("un"));
                params.append("LineID", sessionStorage.getItem("LineID"));//发送路线id从而在后端进行查询
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        // 单元  剧本名称:剧本内容:剧本ID
                        var data = xhr.responseText;
                        //data = "测试1:测试1描述:test1";

                        var root = document.createElement("div");
                        root.style.width = "100%";
                        root.style.height = "100%";
                        root.style.display = "flex";

                        var right = document.createElement("div");
                        right.style.width = "50%";
                        right.style.height = "100%";
                        right.style.display = "flex";
                        right.style.flexDirection = "column";
                        right.style.alignItems = "center";
                        root.appendChild(right);

                        var name = document.createElement("input");
                        name.className = "drama-name";
                        name.style.height = "25px";
                        name.style.width = "80%";
                        name.style.marginTop = "25px";
                        name.placeholder = "剧本名称";
                        name.readOnly = true;
                        name.style.border = "0";
                        name.style.borderBottom = "1px solid black";
                        right.appendChild(name);

                        var marker = document.createElement("textarea");
                        marker.className = "drama-marker";
                        marker.style.height = "100px";
                        marker.style.width = "80%";
                        marker.style.marginTop = "15px";
                        marker.placeholder = "剧本描述";
                        marker.readOnly = true;
                        marker.style.resize = "none";
                        right.appendChild(marker);

                        var button = document.createElement("button");
                        button.className = "layui-btn save-btn";
                        button.style.marginTop = "20px";
                        button.style.width = "50%";
                        button.textContent = "保存";
                        right.appendChild(button);

                        var left = document.createElement("div");
                        left.style.width = "50%";
                        left.style.height = "100%";
                        left.style.display = "flex";
                        left.style.flexDirection = "column";
                        left.style.alignItems = "center";
                        root.appendChild(left);

                        var div = document.createElement("div");
                        div.className = "layui-col-md6";
                        div.style.marginTop = "15px";
                        div.style.width = "80%";
                        left.appendChild(div);

                        var selector = document.createElement("select");
                        selector.className = "drama-selector";
                        selector.style.width = "100%";
                        selector.style.height = "36px";
                        selector.setAttribute("lay-filter", "drama-selector");
                        div.appendChild(selector);
                        var option0 = document.createElement("option");
                        option0.value = "";
                        option0.textContent = "请选择剧本";
                        selector.appendChild(option0);

                        var button1 = document.createElement("button");
                        button1.classList = "layui-btn button1";
                        button1.textContent = "确定";
                        button1.style.width = "50%";
                        button1.style.marginTop = "20px";
                        left.appendChild(button1);

                        var button2 = document.createElement("button");
                        button2.className = "layui-btn";
                        button2.id = "closebtn";
                        button2.textContent = "取消";
                        button2.style.width = "50%";
                        button2.style.marginLeft = "0";
                        button2.style.marginTop = "20px";
                        left.appendChild(button2);

                        var button3 = document.createElement("button");
                        button3.classList = "layui-btn new-drama";
                        button3.textContent = "新建";
                        button3.style.width = "50%";
                        button3.style.marginLeft = "0";
                        button3.style.marginTop = "20px";
                        left.appendChild(button3);

                        if (data != "blank"){
                            for (var i = 0; i < data.split(";").length; i++) {
                                (function(i){
                                    var option = document.createElement("option");
                                    option.value = data.split(";")[i].split(":")[2];
                                    option.setAttribute("marker", data.split(";")[i].split(":")[1]);
                                    option.textContent = data.split(";")[i].split(":")[0];
                                    selector.appendChild(option);
                                })(i)
                            };
                        }
                        else {
                            var option = document.createElement("option");
                            option.value = "none";
                            option.textContent = "没有可用剧本";
                            option.setAttribute("disabled", true);
                            selector.appendChild(option);
                        }

                        layer.open({
                            type: 1,
                            id: "你好",
                            title: "剧本选择",
                            area: ['400px', '320px'], // 宽高
                            content: root.outerHTML,
                            success: function(layero, index){
                                var selector = document.querySelector("select.drama-selector");
                                selector.addEventListener("change", function () {
                                    var selectedOption = selector.options[selector.selectedIndex];
                                    var name = document.querySelector("input.drama-name");
                                    var marker = document.querySelector("textarea.drama-marker");
                                    name.value = selectedOption.textContent==="请选择剧本"?"":selectedOption.textContent;
                                    marker.value = selectedOption.getAttribute("marker");
                                    if (name.value != "") {
                                        name.readOnly = false;
                                        marker.readOnly = false;
                                    }
                                    else {
                                        name.readOnly = true;
                                        marker.readOnly = true;
                                    }
                                })

                                var button1 = document.querySelector("button.button1");
                                button1.onclick = function () {
                                    if (selector.options[selector.selectedIndex].value != "" && selector.options[selector.selectedIndex].value != "none") {
                                        sessionStorage.setItem("DramaID", selector.options[selector.selectedIndex].value);
                                        layer.close(index);
                                        open_context();
                                    }
                                    else {
                                        msg_set("请选择正确的剧本或新建剧本以进行下一步操作");
                                    }
                                };

                                var closeBtn = document.getElementById("closebtn");
                                closeBtn.onclick = function () {
                                    layer.close(index);
                                }

                                var newBtn = document.querySelector("button.new-drama");
                                newBtn.onclick = function () {
                                    layer.close(index);
                                    create_new_drama(open_context);
                                }

                                var saveBtn = document.querySelector("button.save-btn");
                                saveBtn.onclick = function () {
                                    if (selector.selectedIndex != 0) {
                                        var xhr = new XMLHttpRequest();
                                        var params = new FormData();

                                        xhr.open("POST", "", true);
                                        params.append("un", sessionStorage.getItem("un"));
                                        params.append("LineID", sessionStorage.getItem("LineID"));
                                        params.append("DramaID", selector.options[selector.selectedIndex].value);
                                        params.append("NewName", document.querySelector("input.drama-name").value);
                                        params.append("NewMarker", document.querySelector("textarea.drama-marker").value);
                                        
                                        xhr.onreadystatechange = function () {
                                            if (xhr.readyState === 4) {
                                                if (xhr.responseText === "true") {

                                                }
                                                else {
                                                    window_set("错误", ["出现未知错误","剧本信息修改失败", "请重试"]);

                                                    document.querySelector("input.drama-name").value = selector.options[selector.selectedIndex].textContent;
                                                    document.querySelector("textarea.drama-marker").value = selector.options[selector.selectedIndex].getAttribute("marker");
                                                }
                                            }
                                        }
                                        xhr.send(params);
                                    }
                                    else {
                                        window_set("错误", ["请先选择剧本", "再进行后续操作"]);
                                    }
                                }
                            }
                        });
                    }
                }
                xhr.send(params);
            });
        }
    }, false);

    xhr.open("POST", url, true);
    var params = new FormData();
    params.append("type", "lines");
    params.append("un", sessionStorage.getItem("un"));

    xhr.onreadystatechange =  function() {
        if(xhr.readyState === 4){
            // num;数据...   数据单元为  线路名称:LineID
            var data = xhr.responseText;
            ifm_fram.src = "drama-line.html?choose=" + data;
        }
    };
    
    xhr.send(params);

    function create_new_drama (callback) {
        layui.use(function () {
            var layer = layui.layer;

            var root = document.createElement("div");
            root.style.width = "100%";
            root.style.height = "100%";
            root.style.display = "flex";
            root.style.flexDirection = "column";
            root.style.alignItems = "center";

            var input = document.createElement("input");
            input.className = "drama-name";
            input.style.width = "50%";
            input.style.height = "32px";
            input.style.marginTop = "15px";
            input.placeholder = "请输入剧本名称";
            root.appendChild(input);
            
            var textarea = document.createElement("textarea");
            textarea.className = "drama-marker";
            textarea.style.resize = "none";
            textarea.style.width = "50%";
            textarea.style.height = "120px";
            textarea.style.marginTop = "15px";
            textarea.placeholder = "请输入剧本描述(选填)";
            root.appendChild(textarea);

            var button_div = document.createElement("div");
            button_div.style.width = "70%";
            button_div.style.height = "40px";
            button_div.style.marginTop = "20px";
            button_div.style.display = "flex";
            button_div.style.justifyContent = "space-between";
            root.appendChild(button_div);
            var button_sure = document.createElement("button");
            button_sure.classList = "sure layui-btn";
            button_sure.textContent = "确定";
            button_sure.style.width = "40%"
            button_sure.style.height = "100%"
            button_div.appendChild(button_sure);

            var button_cancer = document.createElement("button");
            button_cancer.classList = "cancer layui-btn";
            button_cancer.textContent = "取消";
            button_cancer.style.width = "40%"
            button_cancer.style.height = "100%"
            button_div.appendChild(button_cancer);

            layer.open({
                type: 1,
                area: ["400px", "320px"],
                title: "新建剧本",
                content: root.outerHTML,
                success: function (layero, index) {
                    var button_sure = document.querySelector("button.sure");
                    var button_cancer = document.querySelector("button.cancer");

                    button_sure.onclick = function () {
                        var input = document.querySelector("input.drama-name");
                        var textarea = document.querySelector("textarea.drama-marker")
                        if (input.value === "") {
                            layer.open({
                                type: 1,
                                area: ["300px", "180px"],
                                title: "错误",
                                shade: 0.6,
                                shadeClose: true,
                                maxmin: false,
                                anim: Math.floor(Math.random() * 6),
                                content: '<div style="padding: 32px;text-align: center;">请正确输入剧本名称<hr>以进行下一步操作</div>'
                            });
                        }
                        else {
                            var xhr = new XMLHttpRequest();
                            var url = "/webcreatenewdramacript";//少打了一个s
                            xhr.open("POST", url, true);
                            var params = new FormData();
                            params.append("un", sessionStorage.getItem("un"));//剧本创建者
                            params.append("LineID", sessionStorage.getItem("LineID"));//路线id
                            params.append("DramaName", input.value);//剧本名称
                            params.append("DramaMarker", textarea.value);//剧本描述

                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4) {
                                    if (xhr.responseText){
                                        sessionStorage.setItem("DramaID", xhr.responseText);//后端发送dramascriptid给前端
                                        callback();
                                    }
                                }
                            }
                            xhr.send(params);
                        }
                    };

                    button_cancer.onclick = function () {
                        layer.close(index);
                    };
                }
            });
        });
    }
})
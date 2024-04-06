document.addEventListener('DOMContentLoaded', function() {
    let point_menu = document.querySelector("ul.point-menu");
    let operate_panel = document.querySelector("div.operate-root");
    let main_item = document.querySelector("div.preview-panel div.main-item");
    let module_frame = document.querySelector("div.module-frame");

    let fn_update_btn = document.querySelector("button.fn-update-btn");
    let update_btn = document.querySelector("button.update-btn"); 
    let bn_update_btn = document.querySelector("button.bn-update-btn");

    question_datas = ["1:你好:666","2:再见:777"];
    var question_selector = document.querySelector("select.question-selector");
    for(var i = 0; i < question_datas.length; i++) {
        (function (i) {
            var option = document.createElement("option");
            option.value = question_datas[i].split(":")[0];
            option.textContent = question_datas[i].split(":")[1];
            option.title = question_datas[i].split(":")[2];
            question_selector.appendChild(option);
        })(i)    
    };

    // 获取题库数据
    var xhr = new XMLHttpRequest();
    var params = new FormData();
    params.append("un", sessionStorage.getItem("un"));
    xhr.open("POST", "", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4){
            if (xhr.responseText != "" && xhr.responseText != "*") {
                // 数据单元  id:name:marker 这个marker是什么意思
                var question_datas = xhr.split(";");
                var question_selector = document.querySelector("select.question-selector");
                for(var i = 0; i < question_datas.length; i++) {
                    (function (i) {
                        var option = document.createElement("option");
                        option.value = question_datas[i].split(":")[0];
                        option.textContent = question_datas[i].split(":")[1];
                        option.title = question_datas[i].split(":")[2];
                        question_selector.appendChild(option);
                    })(i)    
                };
            }
            else if (xhr.responseText === "*") {} 
            else msg_set("发生未知错误，无法获取题库数据，请重试或联系维护人员");
        }
    }

    // 屏蔽全局右键
    document.oncontextmenu = (e) => {
        e.preventDefault()
    }    

    AMapLoader.load({
        key: "ed729e18de199349c4ab973ba060babe", //申请好的Web端开发者key，调用 load 时必填
        version: "2.0", //指定要加载的 JS API 的版本
        plugin: "AMap.Walking" 
        })
        .then((AMap) => {
            /**点位名称|点位描述|纬度|经度|点位ID */
            var point_datas = JSON.parse(sessionStorage.getItem("line_points")); 
            
            //point_datas = [["你好", "不好", 38.878799, 121.600998, "测试"],["再见", "再也不见", 38.868799, 121.600992, "空目标"]];

            const layer = new AMap.createDefaultLayer({
                zooms: [3, 20], //可见级别
                visible: true, //是否可见
                opacity: 1, //透明度
                zIndex: 0, //叠加层级
            });        
            let map = new AMap.Map("map-div", {
                viewMode: '3D', //默认使用 2D 模式
                zoom: 16, //地图级别
                pitch:30, //俯仰角度 0为完全俯视
                center: [116.397428, 39.90923], //地图中心点 默认为北京 setCenter()可修改中心点位置
                mapStyle: "amap://styles/normal", //设置地图的显示样式
                layers:[layer],
            });
            const traffic = new AMap.TileLayer.Traffic({
                autoRefresh: true, //是否自动刷新，默认为false
                interval: 180, //刷新间隔，默认180s
            });
            map.add(traffic);
            map.setCenter([point_datas[0][3],point_datas[0][2]]); 

            for (var i = 0; i < point_datas.length; i++) {
                (function(i){ 
                    var markerContent = '' +
                    '<div class="custom-content-marker" point-name ' + 'ID="' + point_datas[i][4] + '">' +
                    '   <i class="layui-icon layui-icon-flag" style="font-size: 30px;"></i>' + 
                    '   <div class="num">' + point_datas[i][0] +'</div>'
                    '</div>'; // 打点图标

                    var position = new AMap.LngLat(point_datas[i][3], point_datas[i][2]);
                    var marker = new AMap.Marker({
                        position: position,
                        content: markerContent, // 将 html 传给 content
                        offset: new AMap.Pixel(-13, -30) // 以 icon 的 [center bottom] 为原点
                    });

                    map.add(marker);

                    var li = document.createElement("li");
                    li.className = "point";
                    li.setAttribute("ID", point_datas[i][4]);
                    li.setAttribute("position", (point_datas[i][3].toString() + ',' + point_datas[i][2].toString()));

                    var div = document.createElement("div");
                    div.className = "layui-menu-body-title";
                    li.appendChild(div);

                    var _i = document.createElement("i");
                    _i.classList = "layui-icon layui-icon-flag";
                    div.appendChild(_i);

                    var a = document.createElement("a");
                    a.href = "javascript:;";
                    a.innerHTML = 'P' + i.toString() + "_" + point_datas[i][0];
                    div.appendChild(a);

                    point_menu.append(li);

                    var option = document.createElement("option");
                    option.value = point_datas[i][4];
                    option.textContent = point_datas[i][0];
                })(i);
            };

            // 设置鼠标选中显示描述
            let shwoName = document.querySelectorAll("div.custom-content-marker");
            for(var i = 0; i < point_datas.length; i++){
                (function(i){
                    shwoName[i].addEventListener("mousedown", function(e){
                        if (e.button === 2) {
                            shwoName[i].setAttribute("point-name", point_datas[i][1]);
                        }
                        else if (e.button === 0) {
                            var points = document.querySelectorAll("li.point");
                            points.forEach(point => {
                                if (point.id === shwoName[i].id) {
                                    point.classList.add("layui-menu-item-checked");
                                }
                                else {
                                    point.classList.remove("layui-menu-item-checked");
                                };
                            });

                            point_choose_action(shwoName[i]);
                        }
                    });
                    shwoName[i].addEventListener("mouseout", function(){
                        shwoName[i].setAttribute("point-name", "");
                    });
                })(i);
            };
            
            layui.use(function(){
                var dropdown = layui.dropdown;
                // 菜单点击事件
                dropdown.on('click(point-menu)', function(options){
                    map.setCenter(this.getAttribute("position").split(","))
                    point_choose_action(this);
                });

                var form = layui.form;
                form.on('radio(operate-type-input)', function(data){
                    var value = data.elem.value;
                    state_change(value, []);
                });
            });

        })
        .catch((e) => {
            alert(e); //加载错误提示
        });

    // 模板选择函数
    layui.use(function(){                   
        var layer = layui.layer;
        var selector = document.querySelector("select.question-selector");
        // select 事件
        selector.addEventListener("change", function () {
            if (selector.value === "-1") {
                selector.selectedIndex = 0;
                fetch("../text/frametype.txt").then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                    }
                    return response.text();
                }).then(content => {
                    var page_window = document.createElement("div");
                    page_window.classList = "layui-tab layui-tab-brief";
                    page_window.style.height = "460px";

                    var ul0 = document.createElement("ul");
                    ul0.classList = "layui-tab-title";

                    var context0 = content.split("\n!!").splice(1);

                    var list0 = context0[0].split("**");
                    for (var i = 0; i < list0.length; i++) {
                        var li = document.createElement("li");
                        if (i === 0) {li.className = "layui-this"};

                        li.textContent = list0[i];
                        ul0.appendChild(li);
                    }
                    page_window.appendChild(ul0);

                    var div0 = document.createElement("div");
                    div0.className = "layui-tab-content";
                    div0.style.height = "390px"

                    for (var i = 1; i <= list0.length; i++) {
                        (function(i) {
                            var page = document.createElement("div");
                            if (i === 1) {page.classList = "layui-tab-item layui-show"}
                            else {page.className = "layui-tab-item"};

                            page.style.flexDirection = "column";
                            page.style.alignItems = "center";
                            page.style.height = "100%"
                            
                            page.innerHTML = '<div class="layui-card" style="width: 300px; height: 360px; display: flex; align-items: center; justify-content: center;">' +
                            '<div class="layui-card showitem-panel">' +
                            '<div class="head-item">' +
                            '<img src="../images/return_item.png" alt="Image" class="return-img img-item" />' +
                            '<i style="color: black; font-size: 14px">时间显示测试</i>' +
                            '</div>' +
                            '<div class="main-item"></div>' +
                            '<div class="bottom-item">' +
                            '<img src="../images/help_item.png" alt="Image" class="help-img img-item" />' +
                            '<img src="../images/bag_item.png" alt="Image" class="bag-img img-item" />' +
                            '</div></div></div>'

                            var main_div = page.querySelector("div.main-item");
                            var items = context0[i].split("||"); 
                            var Items = [];

                            for (var j = 0; j < items.length; j++) {
                                /*宽|高|左间距|上间距|内容文本|背景颜色|字体颜色|类型*/
                                var item = items[j].split("|");

                                var _div_ = document.createElement("div");
                                _div_.style.position = "relative";
                                _div_.style.display = "flex";
                                _div_.style.alignItems = "center";
                                _div_.style.justifyContent = "center";

                                _div_.style.width = item[0] + "%";
                                _div_.style.height = item[1] + "%";
                                _div_.style.left = item[2] + "%";
                                _div_.style.top = item[3] + "%";
                                _div_.textContent = item[4];
                                _div_.style.backgroundColor = item[5];
                                _div_.style.color = item[6];

                                if (item[7].trim() != "selection" && item[7].trim() != "question") {
                                    Items.push(item[7].trim() + "|" + item[0] + "x" + item[1] + "|" + item[2] + "x" + item[3] + "|" + "*|~!");
                                }
                                else {
                                    Items.push(item[7].trim() + "|" + item[0] + "x" + item[1] + "|" + item[2] + "x" + item[3] + "|" + "*|~!~@~@~@");
                                }
                                main_div.appendChild(_div_);
                            }
                            
                            var select_button = document.createElement("button");
                            select_button.classList = "layui-btn frameselect-btn layui-btn-radius";
                            select_button.textContent = "——选择——";
                            var mediatype = items[0].split("|")[items[0].split("|").length - 1];
                            select_button.setAttribute("module-type", (mediatype==="photo"?"image":mediatype) + "|selection");
                            select_button.setAttribute("item", Items.join(":"));
                            page.appendChild(select_button);

                            div0.appendChild(page);
                        })(i);
                    }
                    page_window.appendChild(div0);

                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: ['420px', '480px'],
                        maxmin: false,
                        shadeClose: false,
                        content: page_window.outerHTML
                    });

                    var btns = document.querySelectorAll("button.frameselect-btn");
                    btns.forEach(btn => {
                        btn.onclick = function () {
                            var taskname = document.querySelector("input.task-name").value;
                            var taskmarket = document.querySelector("textarea.task-remark").value;
                            var nexttask = document.querySelector("select.nexttask").selectedIndex;
                            var form = layui.form;
                            var type = form.val('operate-input-form').type;

                            init_panel();
                            alert(6);

                            task_load(type, 0, taskname, [nexttask, taskmarket, btn.getAttribute("item"), ""]);
                            alert(6);

                            sessionStorage.setItem("module-type", btn.getAttribute("module-type"));
                            layer.close(index);
                        }
                    });
                }).catch(error => console.error('Fetch error:', error));
            }
        });
    });

    /**
     * 点位选择操作主函数
     * @param {Element} elemnet 元素 
     */
    function point_choose_action (elemnet) {
        operate_panel.style.display = "none";

        var params = new FormData();
        params.append("un", sessionStorage.getItem("un"));
        params.append("PointID", elemnet.getAttribute("ID"));
        params.append("DramaID", sessionStorage.getItem("DramaID"));

        var xhr = new XMLHttpRequest();
        var url = "/webgetpointmissions";
        
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if ( xhr.readyState === 4){
                //任务列表  单元：任务名:任务类型(普通任务和结束任务,0是结束任务，1是普通):任务ID:模板类型(video/photo/audio)|题目类型(selection)
                var data = xhr.responseText;
                if(data !=""){//主要是解决没有任务的时候也会加载一个任务的问题
                    var task_line = data.split(";");
                    var tasks = [];
                    for (var i = 0; i < task_line.length; i++) {
                        tasks.push(task_line[i].split(":"));
                    };
                    task_panel_load(tasks, elemnet.getAttribute("ID"));
                }//这里后面还需要这个task_panel_load吗，交给你来改了 @李立 修改理由上一条注释
            };
        };

        xhr.send(params);

        /*if (elemnet.getAttribute("ID") === "测试"){
            task_panel_load([["视频模板", "1", "视频", "video|selection"], ["图片模板", "0", "图片", "photo|selection"], ["音频模板", "1", "音频", "audio|selection"]], elemnet.getAttribute("ID"));
        }
        else {
            task_panel_load([],);
        };
        */
    };

    /**
     * 任务列表加载主函数
     * @param {Array<Array>} tasks 任务名称,任务类型(1普通任务,0结束任务),任务ID,模板类型
     * @param {Number} pointID 点位ID
     */
    function task_panel_load (tasks, pointID) {
        init_panel();
        var task_card = document.querySelector("div#tasks-div");
        task_card.innerHTML = "";
        sessionStorage.setItem("PointID", pointID);

        for (var i = 0; i < tasks.length; i++){
            (function(i) {
                var task_div = document.createElement("div");
                task_div.classList = "layui-panel task-panel";
                task_div.setAttribute("ID", tasks[i][2]);

                var name = document.createElement("span");
                name.textContent = tasks[i][0];
                task_div.appendChild(name);

                var hr = document.createElement("hr");
                task_div.appendChild(hr);

                var name = document.createElement("span");
                name.textContent = tasks[i][1] === "1"? "普通任务": "结束任务";
                task_div.appendChild(name);

                var button = document.createElement("button");
                button.classList = "layui-btn layui-btn-primary layui-btn-radius task-btn";
                button.textContent = "选择";
                button.onclick = function() {
                    sessionStorage.setItem("TaskID", tasks[i][2]);

                    init_panel();

                    var params = new FormData();
                    params.append("un", sessionStorage.getItem("un"));
                    params.append("PointID", pointID);
                    params.append("DramaID",sessionStorage.getItem("DramaID"));
                    params.append("ID", tasks[i][2]);//应该是题目的id

                    var xhr = new XMLHttpRequest();
                    var url = "/webGetTask";//这里需要实现选择功能

                    xhr.open("POST", url, true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            task_select(task_div);
                            sessionStorage.setItem("newtask", "false");
                            sessionStorage.setItem("module-type", tasks[i][3]);

                            // 任务状态(status应该是);下一个任务id;任务备注;题库内容;ar功能
                            var data = xhr.responseText;

                            var source = data.split(";");

                            task_load(Number(tasks[i][1]), Number(source[0]), tasks[i][0], source.splice(1));

                            reload_task();
                        };
                    }

                    xhr.send(params);
                };
                task_div.appendChild(button);

                var button = document.createElement("button");
                button.classList = "layui-btn layui-btn-primary layui-btn-radius task-btn";
                button.textContent = "复制";
                button.onclick = function () {
                    var add_div = document.querySelector("div.add-panel");
                    task_card.removeChild(add_div);

                    var task_div = document.createElement("div");
                    task_div.classList = "layui-panel task-panel new";
        
                    var name = document.createElement("span");
                    name.textContent = "复制-" + tasks[i][0];
                    task_div.appendChild(name);
        
                    var hr = document.createElement("hr");
                    task_div.appendChild(hr);

                    var button = document.createElement("button");
                    button.classList = "layui-btn layui-btn-primary layui-btn-radius task-btn";
                    button.textContent = "选择";
                    button.onclick = function() {
                        task_select(task_div);
                        sessionStorage.setItem("newtask", "true");
                        
                        init_panel();

                        var params = new FormData();
                        params.append("un", sessionStorage.getItem("un"));
                        params.append("PointID", pointID);
                        params.append("DramaID",sessionStorage.getItem("DramaID"));
                        params.append("ID", tasks[i][2]);

                        var xhr = new XMLHttpRequest();
                        var url = "/getTask";//应该到创建新题目的函数,这里要实现的是复制功能

                        xhr.open("POST", url, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                task_select(task_div);
                                sessionStorage.setItem("newtask", "true");
                                sessionStorage.setItem("module-type", tasks[i][3]);

                                // 任务状态;下一个任务;任务备注;题库内容;ar功能
                                var data = xhr.responseText;

                                var source = data.split(";");

                                task_load(Number(tasks[i][1]), Number(source[0]), tasks[i][0], source.splice(1));
                                
                                reload_task();
                            };
                        }

                        xhr.send(params);

                        /*var items = ""
                        switch (i) {
                            case 0: 
                                items = "video|90x40|5x0|../video:question|90x60|5x0|*";
                                break;
                            case 1:
                                items = "photo|90x40|5x0|../photo:question|90x60|5x0|*";
                                break;
                            case 2:
                                items = "audio|90x40|5x0|../audio:question|90x60|5x0|*";
                                break;
                            default:
                                items = "";
                                break;
                        };
                        task_load(Number(tasks[i][1]), 0, tasks[i][0], ["空目标", "", tasks[i][2], items, "1:2"]);*/
                    };
                    task_div.appendChild(button);

                    var button = document.createElement("button");
                    button.classList = "layui-btn layui-btn-primary layui-btn-radius task-btn";
                    button.textContent = "删除"; 
                    button.onclick = function () {
                        if (task_div.classList.contains("selected")) {
                            init_panel();
                            
                            operate_panel.style.display = "none";
                        }
                        task_div.remove();
                    };
                    task_div.appendChild(button);

                    task_card.appendChild(task_div);
                    task_card.appendChild(add_div);
                }
                task_div.appendChild(button);

                var button = document.createElement("button");
                button.classList = "layui-btn layui-btn-primary layui-btn-radius task-btn";
                button.textContent = "删除";
                button.onclick = function () {
                    layui.use(function () {
                        var layer = layui.layer;
                        layer.confirm("此操作将从服务器上删除此选项，且无法撤销，请再一次确认是否进行？", {
                            title: "询问",
                            icon: 3,
                        }, function (index) {
                            var params = new FormData();
                            params.append("un", sessionStorage.getItem("un"));
                            params.append("PointID", pointID);
                            params.append("DramaID",sessionStorage.getItem("DramaID"));
                            params.append("TaskID", sessionStorage.getItem("TaskID"));

                            var xhr = new XMLHttpRequest();
                            var url = "/getTask";//这里要实现删除功能

                            xhr.open("POST", url, true);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4) {
                                    var data = xhr.responseText;
                                    
                                };
                            };

                            xhr.send(params);
                            
                            if (task_div.classList.contains("selected")) {
                                init_panel();

                                operate_panel.style.display = "none";
                            }

                            task_div.remove();
                            layer.close(index);
                        }, );
                    });
                };
                task_div.appendChild(button);

                task_card.appendChild(task_div);
            })(i);
        };

        var add_div = document.createElement("div");
        add_div.classList = "layui-panel add-panel";

        var _i = document.createElement("i");
        _i.classList = "layui-icon layui-icon-add-circle";
        _i.style.fontSize = "60px";
        _i.addEventListener("mousedown", function(e) {
            if (e.button === 0){
                var add_div = document.querySelector("div.add-panel");
                task_card.removeChild(add_div);

                var task_div = document.createElement("div");
                task_div.classList = "layui-panel task-panel new";
    
                var name = document.createElement("span");
                name.textContent = "新建任务";
                task_div.appendChild(name);
    
                var hr = document.createElement("hr");
                task_div.appendChild(hr);

                var button = document.createElement("button");
                button.classList = "layui-btn layui-btn-primary layui-btn-radius task-btn";
                button.textContent = "选择";
                button.onclick = function() {
                    task_select(task_div);
                    sessionStorage.setItem("newtask", "true");
                    
                    init_panel();

                    task_load(1, 0, "新建任务", []);
                    reload_task();
                };
                task_div.appendChild(button);

                var button = document.createElement("button");
                button.classList = "layui-btn layui-btn-primary layui-btn-radius task-btn";
                button.textContent = "删除";
                button.onclick = function () {
                    if (task_div.classList.contains("selected")) {
                        init_panel();
                        
                        operate_panel.style.display = "none";
                    }
                    task_div.remove();
                };
                task_div.appendChild(button);

                task_card.appendChild(task_div);
                task_card.appendChild(add_div);
            };
        });
        add_div.appendChild(_i);

        var hr = document.createElement("hr");
        add_div.appendChild(hr);

        var text = document.createElement("span");
        text.textContent = "创建新任务";
        add_div.appendChild(text);

        task_card.appendChild(add_div);
    };

    /**
     * 任务信息加载主函数 
     * @param {Number} type 任务类型
     * @param {Number} state 任务启动状态
     * @param {String} name 任务名称
     * @param {Array} objs 任务组件  下一个任务|任务备注|题库内容|ar功能
     */
    function task_load (type, state, name, objs) {
        operate_panel.style.display = "block";

        layui.use("form", function () {
            var form = layui.form;
            form.val('operate-input-form', {
                "type": type,
                "state": state
            });
        });

        var name_input = document.querySelector("input.task-name");
        name_input.value = name;
        name_input.placeholder = name;

        if (objs.length != 0) {
            state_change(type, objs[0]);

            var remark = document.querySelector("textarea.task-remark");
            remark.value = objs[1];
            remark.placeholder = objs[1];

            var items = objs[2].split(":");
            var datas = [];
            items.forEach(item => {
                datas.push(item.split("|"));
            });
            items_load(datas);

            if (objs[4].split(":").length > 1) {
                // 1|AR类型|获取数据URL
                var ar_set = objs[3].split(":")
                layui.use("form", function () {
                    var form = layui.form;
                    form.val('operate-input-form', {
                        "AR": 1
                    });

                    var form0 = layui.form;
                    var AR_selector = document.querySelector("select.AR-selector");
                    var optionToSelect = AR_selector.querySelector('option[value="' + ar_set[1] + '"]');
                    optionToSelect.selected = true;

                    form0.render('select');

                    var div1 = document.querySelector("div.AR-operate");
                    var div2 = document.querySelector("div.AR-file-update");
                    div1.style.display = "flex";
                    div2.style.display = "flex";
                });
            }
            else {
                layui.use("form", function () {
                    var form = layui.form;
                    form.val('operate-input-form', {
                        "AR": 0
                    });

                    var form0 = layui.form;
                    var AR_selector = document.querySelector("select.AR-selector");
                    var optionToSelect = AR_selector.querySelector('option[value=""]');
                    optionToSelect.selected = true;
        
                    form0.render('select');
        
                    var div1 = document.querySelector("div.AR-operate");
                    var div2 = document.querySelector("div.AR-file-update");
                    div1.style.display = "none";
                    div2.style.display = "none";
                });
            };
        }
        else {
            var nexttask_selector = document.querySelector("select.nexttask");
            nexttask_selector.selectedIndex = 0;
        };
    };

    /**初始化任务编辑栏基础组件 */
    function init_panel () {
        layui.use("form", function () {
            main_item.innerHTML = "";
            module_frame.innerHTML = "";
            
            var form = layui.form;
            form.val('operate-input-form', {
                "type": 1,
                "state": 0,
                "AR": 0
            });
            var nexttask_selector = document.querySelector("select.nexttask");
            nexttask_selector.selectedIndex = 0;

            var question_selector = document.querySelector("select.question-selector");
            question_selector.selectedIndex = 0;

            var name_input = document.querySelector("input.task-name");
            name_input.value = "新建任务";
            name_input.placeholder = "新建任务";
    
            var remark = document.querySelector("textarea.task-remark");
            remark.value = "空"
            remark.placeholder = "空";

            var form0 = layui.form;
            var AR_selector = document.querySelector("select.AR-selector");
            var optionToSelect = AR_selector.querySelector('option[value=""]');
            optionToSelect.selected = true;

            form0.render('select');

            var div1 = document.querySelector("div.AR-operate");
            var div2 = document.querySelector("div.AR-file-update");
            div1.style.display = "none";
            div2.style.display = "none";
        });
    };

    /**
     * 组件加载
     * @param {Array<Array>} datas datas数据结构: type, size(width x height,百分比单位,单位省略), position(left x top,百分比单位,单位省略), url, status(名称~!备注或题目内容(内容~@选项~#选项~#选项~#选项))
     */
    function items_load (datas) {
        clearitems();
        for (var i = 0; i < datas.length; i++) {
            (function(i) {
                switch (datas[i][0]) {
                    case "photo":
                        photo(datas[i], i, "update-btn");
                        break;
                    case "question":
                        question(datas[i], i, "update-btn");
                        break;
                    case "video":
                        video(datas[i], i, "update-btn");
                        break;
                    case "audio":
                        audio(datas[i], i, "update-btn");
                        break;
                    default:
                        break;
                }
            })(i);
        };

        key_bind();
        
        narration_load();
    };

    // 选择状态更改函数
    function task_select (elem) {
        var tasks = document.querySelectorAll("div.task-panel");
        tasks.forEach(task => {
            task.classList.remove("selected");
        })

        elem.classList.add("selected");
    }

    /**
     * 任务重选页面重置函数
     */
    function reload_task () {
        var btndiv = document.querySelector("div.pageChange-btn");
        var pages = document.querySelectorAll("div.operate-part");
        pages.forEach(page => {
            page.style.display = "none";
        })
        pages[1].style.display = "block";
        btndiv.querySelector("button.layui-btn-disabled").classList.remove("layui-btn-disabled");
        document.querySelector("button.question_page").classList.add("layui-btn-disabled");
    }

    // 前旁白上传按钮
    fn_update_btn.onclick = function () {
        var xhr = new XMLHttpRequest();
        var params = new FormData();
        params.append("un", sessionStorage.getItem("un"));
        params.append("LineID", sessionStorage.getItem("LineID"));
        params.append("DramaID", sessionStorage.getItem("DramaID"));
        params.append("PointID", sessionStorage.getItem("PointID"));
        params.append("TaskID", sessionStorage.getItem("TaskID"));
        params.append("NarrationType", "Front");
        params.append("content", fn_updata(0)[0]);
        params.append("url", fn_updata(0)[1]);
        
        xhr.open("POST", "", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.responseText === true) {
                    msg_set("修改成功");
                }
                else {
                    window_set("未知错误", "修改失败");
                }
            }
        }
        xhr.send(params);
    }

    // 问题上传按钮
    update_btn.onclick = function () {
        // 判断是否为新建任务
        if (sessionStorage.getItem("newtask") != "false"){
            // 二次确定
            var xhr = new XMLHttpRequest();
            var url = "/genNewID";
            var params = new FormData();
            params.append("un", sessionStorage.getItem("un"));
            params.append("LineID", sessionStorage.getItem("LineID"));
            params.append("DramaID", sessionStorage.getItem("DramaID"));
            params.append("PointID", sessionStorage.getItem("PointID"));
            
            xhr.open("POST", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    update_event(xhr.responseText);
                };
            };

            xhr.send(params);
        }
        else {
            update_event(sessionStorage.getItem("TaskID"));
        }

    }

    // 后旁白上传按钮
    bn_update_btn.onclick = function () {
        var xhr = new XMLHttpRequest();
        var params = new FormData();
        params.append("un", sessionStorage.getItem("un"));
        params.append("LineID", sessionStorage.getItem("LineID"));
        params.append("DramaID", sessionStorage.getItem("DramaID"));
        params.append("PointID", sessionStorage.getItem("PointID"));
        params.append("TaskID", sessionStorage.getItem("TaskID"));
        params.append("NarrationType", "Back");
        params.append("content", fn_updata(1)[0]);
        params.append("url", fn_updata(1)[1]);
        
        xhr.open("POST", "/pushdatas", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.responseText === true) {
                    msg_set("修改成功");
                }
                else {
                    window_set("未知错误", "修改失败");
                }
            }
        }
        xhr.send(params);
    }

    /**
     * 上传任务数据
     * @param {String} TaskID 
     */
    function update_event (TaskID) {
        layui.use("form", function () {
            layui.form
            var layer = layui.layer;
            layer.confirm("此操作将修改服务器上的全部相关内容，且无法撤销，请再一次确认是否进行？", {
                title: "询问",
                icon: 3,
            }, function (index) {
                var xhr = new XMLHttpRequest();
                var url = "/webUpdateTask";
                var params = new FormData();
                params.append("un", sessionStorage.getItem("un"));
                params.append("LineID", sessionStorage.getItem("LineID"));
                params.append("DramaID", sessionStorage.getItem("DramaID"));
                params.append("PointID", sessionStorage.getItem("PointID"));
                params.append("TaskID", TaskID);

                var type = sessionStorage.getItem("module-type").split("|");
                params.append("mediatype", type[0]);
                params.append("questiontype", type[1]);
                
                var task = [];
                var form = layui.form;
                task.push(form.val('operate-input-form').state);
                task.push(document.querySelector("select.nexttask").selectedIndex);
                task.push(document.querySelector("textarea.task-remark").value);
                task.push(updateitems());
                task = task.join(";");
                params.append("taskDatas", task);
                params.append("missiontype", form.val('operate-input-form').type);
                params.append("missionname", document.querySelector("input.task-name").value);

                var indexs = get_fileresponse();
                for (var key in indexs) {
                    params.append(key, indexs[key]);
                };

                xhr.open("POST", url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        // 重加载点位任务数据以及任务面板数据
                        layer.msg("上传成功");
                    };
                };
                xhr.send(params);
                layer.close(index);
            });
        });
    }

    /**
     * 任务状态改变主函数
     * @param {(Number|String)} type 类型(1普通任务|0结束任务)
     * @param {Number} value 任务选择值
     */
    function state_change (type, value) {
        var nexttask_selector = document.querySelector("select.nexttask");
        if (type === 1 || type === "1"){
            nexttask_selector.removeAttribute("disabled");

            if (value != null){
                nexttask_selector.value = value;
            }
        }
        else {
            nexttask_selector.setAttribute("disabled", true);
        }
    }
});
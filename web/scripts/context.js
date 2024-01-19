document.addEventListener('DOMContentLoaded', function() {
    let point_menu = document.querySelector("ul.point-menu");
    let operate_panel = document.querySelector("div.operate-root");

    AMapLoader.load({
        key: "ed729e18de199349c4ab973ba060babe", //申请好的Web端开发者key，调用 load 时必填
        version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
        plugin: "AMap.Walking" 
        })
        .then((AMap) => {
            /**点位名称|点位描述|纬度|经度|点位ID */
            var point_datas = JSON.parse(sessionStorage.getItem("line_points"));
            
            point_datas = [["你好", "不好", 111, 25, "测试"],["再见", "再也不见", 111.001, 25.001, "空目标"]];

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
            map.setCenter([point_datas[0][2],point_datas[0][3]]); 

            for (var i = 0; i < point_datas.length; i++) {
                (function(i){ 
                    var markerContent = '' +
                    '<div class="custom-content-marker" point-name ' + 'ID="' + point_datas[i][4] + '">' +
                    '   <i class="layui-icon layui-icon-flag" style="font-size: 30px;"></i>' + 
                    '   <div class="num">' + point_datas[i][0] +'</div>'
                    '</div>'; // 打点图标

                    var position = new AMap.LngLat(point_datas[i][2], point_datas[i][3]);
                    var marker = new AMap.Marker({
                        position: position,
                        content: markerContent, // 将 html 传给 content
                        offset: new AMap.Pixel(-13, -30) // 以 icon 的 [center bottom] 为原点
                    });

                    map.add(marker);

                    var li = document.createElement("li");
                    li.className = "point";
                    li.setAttribute("ID", point_datas[i][4]);
                    li.setAttribute("position", (point_datas[i][2].toString() + ',' + point_datas[i][3].toString()));

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

                    var nextpoint_selector = document.querySelector("select.nextpoint");

                    var option = document.createElement("option");
                    option.value = point_datas[i][4];
                    option.textContent = point_datas[i][0];
                    nextpoint_selector.add(option);
                })(i);
            }

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
            }
            
            layui.use(function(){
                var dropdown = layui.dropdown;
                // 菜单点击事件
                dropdown.on('click(point-menu)', function(options){
                    map.setCenter(this.getAttribute("position").split(","))
                    point_choose_action(this);
                });
            });

        })
        .catch((e) => {
            alert(e); //加载错误提示
        });

    /**
     * 点位选择操作主函数
     * @param {Element} elemnet 元素 
     */
    function point_choose_action (elemnet) {
        operate_panel.style.display = "none";

        var params = new FormData();
        params.append("un", sessionStorage.getItem("un"));
        params.append("LineID", sessionStorage.getItem("LineID"));
        params.append("PointID", elemnet.getAttribute("ID"))

        var xhr = new XMLHttpRequest();
        var url = sessionStorage.getItem("URL");
        
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if ( xhr.readyState === 4){
                //任务列表  单元：任务名:任务类型:任务ID
                var data = xhr.responseText;
                var task_line = data.split(";");
                var tasks = [];
                for (var i = 0; i < task_line.length; i++) {
                    tasks.push(task_line[i].split(":"));
                };
                //task_panel_load(tasks);
            };
        };

        xhr.send(params);

        if (elemnet.getAttribute("ID") === "测试"){
            task_panel_load([["视频模板", "1", "视频"], ["图片模板", "0", "图片"], ["音频模板", "1", "音频"]], elemnet.getAttribute("ID"));
        }
        else {
            task_panel_load([],);
        }
    }

    /**
     * 任务列表加载主函数
     * @param {Array<Array>} tasks 任务名称,任务类型,任务ID
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
                    params.append("LineID", sessionStorage.getItem("LineID"));
                    params.append("PointID", pointID);
                    params.append("ID", tasks[i][2]);

                    var xhr = new XMLHttpRequest();
                    var url = "/getTask";

                    xhr.open("POST", url, true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            // 任务状态;下一个点位;下一个任务;任务备注;题库内容;ar功能
                            var data = xhr.responseText;

                            var source = data.split(";");

                            // task_load(Number(tasks[i][1]), Number(source[0]), tasks[i][0], source.splice(1));
                        };
                    }

                    xhr.send(params);
                    task_load(Number(tasks[i][1]), 0, tasks[i][0], ["空目标", "", tasks[i][2], "", "1:2"]);
                };
                task_div.appendChild(button);

                var button = document.createElement("button");
                button.classList = "layui-btn layui-btn-primary layui-btn-radius task-btn";
                button.textContent = "复制";
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
                            params.append("LineID", sessionStorage.getItem("LineID"));
                            params.append("PointID", pointID);
                            params.append("ID", tasks[i][1]);

                            var xhr = new XMLHttpRequest();
                            var url = "/getTask";

                            xhr.open("POST", url, true);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4) {
                                    var data = xhr.responseText;
                                };
                            }

                            xhr.send(params);

                            task_div.remove();
                            layer.close(index);
                        }, );
                    });
                }
                task_div.appendChild(button);

                task_card.appendChild(task_div);
            })(i);
        }

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
                    init_panel();

                    task_load(1, 0, "新建任务", []);
                };
                task_div.appendChild(button);

                var button = document.createElement("button");
                button.classList = "layui-btn layui-btn-primary layui-btn-radius task-btn";
                button.textContent = "删除";
                button.onclick = function () {
                    task_div.remove();
                    operate_panel.style.display = "none";
                }
                task_div.appendChild(button);

                task_card.appendChild(task_div);
                task_card.appendChild(add_div);
            }
        })
        add_div.appendChild(_i);

        var hr = document.createElement("hr");
        add_div.appendChild(hr);

        var text = document.createElement("span");
        text.textContent = "创建新任务";
        add_div.appendChild(text);

        task_card.appendChild(add_div);
    }

    /**
     * 任务信息加载主函数 
     * @param {Number} type 任务类型
     * @param {Number} state 任务启动状态
     * @param {String} name 任务名称
     * @param {Array} objs 任务组件  下一个点位|下一个任务|任务备注|题库内容|ar功能
     */
    function task_load (type, state, name, objs) {
        operate_panel.style.display = "block";

        layui.use("form", function () {
            var form = layui.form;
            form.val('operate-input-form', {
                "type": type,
                "state": state
            });
        })

        var name_input = document.querySelector("input.task-name");
        name_input.placeholder = name;

        if (objs.length != 0) {
            var nextpoint_selector = document.querySelector("select.nextpoint");
            nextpoint_selector.value = objs[0];

            var nexttask_selector = document.querySelector("select.nexttask");
            nexttask_selector.value = objs[1];

            var remark = document.querySelector("textarea.task-remark");
            remark.placeholder = objs[2];



            if (objs[4].split(":").length > 1) {
                // 1|AR类型|获取数据URL
                var ar_set = objs[4].split(":")
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
            var nextpoint_selector = document.querySelector("select.nextpoint");
            nextpoint_selector.selectedIndex = 0;

            var nexttask_selector = document.querySelector("select.nexttask");
            nexttask_selector.selectedIndex = 0;
        }
    }

    /**初始化任务编辑栏基础组件 */
    function init_panel () {
        layui.use("form", function () {
            var form = layui.form;
            form.val('operate-input-form', {
                "type": 1,
                "state": 0,
                "AR": 0
            });

            var nextpoint_selector = document.querySelector("select.nextpoint");
            nextpoint_selector.selectedIndex = 0;

            var nexttask_selector = document.querySelector("select.nexttask");
            nexttask_selector.selectedIndex = 0;

            var question_selector = document.querySelector("select.question-selector");
            question_selector.selectedIndex = 0;

            var name_input = document.querySelector("input.task-name");
            name_input.placeholder = "新建任务";
    
            var remark = document.querySelector("textarea.task-remark");
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
        })
    }

    /**
     * 组件加载
     * @param {Array} datas datas数据结构: type, size(width x height,百分比单位,单位省略), position(left x top,百分比单位,单位省略), url
     */
    function items_load (items) {

    }
})
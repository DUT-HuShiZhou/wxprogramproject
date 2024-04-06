// 题目数组
let selectedCategoryValue = ''; // 全局变量，存储选择的值
let tableBody = document.querySelector('.main-table tbody');
let typeSelector = document.querySelector("select.type-selector");
let searchInput = document.querySelector("input.searchInput");
let allDatas = [];

// allDatas = [[1, "图片daaaaaaaaaaaaaaaaaaaaaa", "Image-selection", "4", "*"]
//             , [2, "视频", "Video-selection", "4", "*"]
//             , [3, "音频", "Audio-selection", "4", "*"]]; // 测试可删
get_obj(0); // 测试可删
// renderQuestionTable(allDatas); // 测试可删

layui.use(function(){
    var form = layui.form;
    var layer = layui.layer;
    // select 事件
    form.on('select(type-select-filter)', function (data) {
      var value = data.value; // 获得被选中的值
      if (value === "") {
        typeSelectorInitial();
      }
      else {
        var searchDatas = [];
        allDatas.forEach(Data => {
            if (Data[2] === value) {
                searchDatas.push(Data);
            }
        })
        renderQuestionTable(searchDatas);
      }
    });
  });

/**
 * 数据收发函数
 * @param {Number} Page 
 */
function get_obj (Page) {
    var xhr = new XMLHttpRequest();
    var params = new FormData();
    params.append("un", sessionStorage.getItem("un"));
    params.append("Page", Page);//这个是什么东西,是不是设置了一页中最多显示的条数
    xhr.open("POST", "/webGetQuestionBank", true);//这个函数是一个获取题库列表的初步信息的一个函数
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.responseText) {
                allDatas = [];//测试需启动
                // 数据元 id:name:category:grade:url url是什么
                var data = xhr.responseText.split(";");
                for (var i = 0; i < data.length; i++) {
                    allDatas[i] = data[i].split(":");//测试需启动
                }
                renderQuestionTable(allDatas); //测试需启动
            }
        }
    }
    xhr.send(params);
}

/**
 * 渲染表格函数
 * @param {Array<Array>} questions  数据元 id,name,category,grade,url
 */
function renderQuestionTable(questions) {
    tableBody.innerHTML = '';
    questions.forEach(question => {
        var row = tableBody.insertRow();
        row.insertCell(0).textContent = question[0];
        var td = row.insertCell();
        td.className = "QName-td";
        td.textContent = question[1];
        row.insertCell(2).textContent = question[2];
        row.insertCell(3).textContent = question[3];
        
        var btn_root = document.createElement("div");

        var changeBtn = document.createElement("button");
        changeBtn.classList = "layui-btn layui-btn-sm change-btn";
        changeBtn.textContent = "修改";
        changeBtn.onclick = function () {
            var xhr = new XMLHttpRequest();
            var params = new FormData();
            params.append("un", sessionStorage.getItem("un"));
            params.append("ID", question[0]);
            xhr.open("POST", "/webQuestionBankGetTask", true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.responseText != "") {
                        sessionStorage.setItem("ID", question[0]);
                        // 数据格式 题目名称;题目注释;数据(此部分详细请参见item.js)
                        openEditPanel(xhr.responseText);
                        
                    }
                    else {
                        msg_set("发生未知错误，请重试");
                    }
                }
            }

            xhr.send(params);
        }
        btn_root.appendChild(changeBtn);

        var delBtn = document.createElement("button");
        delBtn.classList = "layui-btn layui-btn-sm del-btn";
        delBtn.textContent = "删除";
        delBtn.onclick = function () {
            layui.use("form", function () {
                var layer = layui.layer;
                layer.confirm("此操作将删除服务器上的全部相关内容，且无法撤销，请再一次确认是否进行？", {
                    title: "询问",
                    icon: 3,
                }, function (index) {
                    var xhr = new XMLHttpRequest();
                    var params = new FormData();
                    params.append("un", sessionStorage.getItem("un"));
                    params.append("ID", question[0]);
                    xhr.open("POST", "", true);

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.responseText != "") {
                                var rowToDelete = delBtn.closest('tr'); // 获取最近的父级行
                                rowToDelete.parentNode.removeChild(rowToDelete); // 从表格中移除行
                                msg_set("删除成功");
                            }
                        }
                    }

                    xhr.send(params);
                    layer.close(index);
                });
            });
        }
        btn_root.appendChild(delBtn);
        
        row.insertCell(4).appendChild(btn_root);
    })
}

/**
 * 打开编辑面板函数
 * @param {String|Number} datas 题目内容，0为新建内容
 */
function openEditPanel (datas) {
    if (datas != 0) editPanelCreate(datas);
    else editPanelCreate("");
}

// 重置函数
function reloadEditPanel () {
    var infplace = document.querySelector("div.module-frame");
    var place = document.querySelector("div.main-item");
    infplace.innerHTML = "";
    place.innerHTML = "";
}

/**
 * 编辑面板创建函数
 * @param {String} datas name;marker;datas(这部分详细请见item.js)
 */
function editPanelCreate (datas) {
    if (datas === "") sessionStorage.removeItem("ID");

    var name = "";
    var marker = "";
    var existance = "请选择问题模板";
    var raw_item = ["video|90x40|5x0|../video|~!:question|90x60|5x0|*|~!~@~@~@", 
                    "photo|90x40|5x0|../photo|~!:question|90x60|5x0|*|~!~@~@~@", 
                    "audio|90x40|5x0|../audio|~!:question|90x60|5x0|*|~!~@~@~@"];
    if (datas != "") {
        name = datas.split(";")[0];
        marker = datas.split(";")[1];
        datas = datas.split(";")[2];
        existance = "已存在问题内容";
    }

    var preview_panel = `
    <div class="layui-card"style="width: 100%; height: 98%; display: flex; align-items: center; justify-content: center;">
        <div class="layui-card showitem-panel">
        <div class="head-item">
            <img src="../images/return_item.png" alt="Image" class="return-img img-item" />
            <i style="color: black; font-size: 80%">时间显示测试</i>
        </div>
        <div class="main-item"></div>
        <div class="bottom-item">
            <img src="../images/help_item.png" alt="Image" class="help-img img-item" />
            <img src="../images/bag_item.png" alt="Image" class="bag-img img-item" />
        </div>
        </div>
    </div>`

    // 面板根组件
    var root = document.createElement("div");
    root.className = "edit-panel-root";
    root.style.display = "flex";
    root.style.width = "100%";
    root.style.height = "100%";

    // 左部预览组件
    var preview_div = document.createElement("div");
    preview_div.className = "preview-root";
    preview_div.style.width = "40%";
    preview_div.style.height = "100%";
    preview_div.style.margin = "0 5%";
    preview_div.innerHTML = preview_panel;
    root.appendChild(preview_div);

    // 右部操作组件
    var edit_div = document.createElement("div");
    edit_div.className = "edit-root";
    edit_div.style.backgroundColor = "rgb(240,240,240)";
    edit_div.style.width = "50%";
    edit_div.style.height = "100%";
    edit_div.style.borderLeft = "1px solid";
    edit_div.style.borderImage = "linear-gradient(to top, #8f41e9, #578aef) 1";
    root.appendChild(edit_div);

    var name_div = document.createElement("div");
    name_div.classList = "name-root layui-form-item";
    name_div.width = "100%";
    name_div.height = "32px";
    name_div.style.display = "flex";
    name_div.style.alignItems = "center";
    name_div.style.justifyContent = "center";
    name_div.style.marginTop = "10px";
    name_div.innerHTML = `
    <div class="layui-input-group" style="width:280px;">
      <div class="layui-input-split layui-input-prefix">
        任务名称
      </div>
      <input type="text" placeholder="任务名称" class="layui-input task-name">
    </div>`;
    edit_div.appendChild(name_div);

    var marker_div = document.createElement("div");
    marker_div.classList = "marker-root layui-form-item";
    marker_div.width = "100%";
    marker_div.style.display = "flex";
    marker_div.style.alignItems = "center";
    marker_div.style.justifyContent = "center";
    marker_div.style.marginTop = "10px";
    marker_div.innerHTML = `
    <div class="layui-input-group" style="width:280px;">
      <div class="layui-input-split layui-input-prefix">
        任务备注
      </div>
      <textarea type="text" placeholder="任务备注" class="layui-textarea task-marker" style="resize: none;"></textarea>
    </div>`;
    edit_div.appendChild(marker_div);

    var type_div = document.createElement("div");
    type_div.className = "typeChoose-root";
    type_div.width = "100%";
    type_div.style.display = "flex";
    type_div.style.alignItems = "center";
    type_div.style.justifyContent = "center";
    type_div.style.marginTop = "10px";
    type_div.innerHTML = `
    <div class="layui-form">
        <select lay-filter="create-type-selector" class="create-type-selector">
            <option value="" selected>` + existance +`</option>
            <option value="video-question">视频题</option>
            <option value="image-question">图片题</option>
            <option value="audio-question">音频题</option>
        </select>
    </div>`;
    edit_div.appendChild(type_div);

    var hr = document.createElement("hr");
    hr.className = "layui-border-black";
    hr.style.width = "90%";
    hr.style.marginLeft = "5%";
    edit_div.appendChild(hr);

    var infplace = document.createElement("div");
    infplace.className = "module-frame";
    infplace.style.width = "80%";
    infplace.style.marginLeft = "10%";
    edit_div.appendChild(infplace);

    var div = document.createElement("div");
    div.style.textAlign = "center";
    var updateBtn = document.createElement("button");
    updateBtn.classList = "create-btn update-btn layui-btn layui-btn-normal";
    updateBtn.id = "update-btn";
    updateBtn.textContent = "保存|更新";
    div.appendChild(updateBtn);
    edit_div.appendChild(div);

    itemChoose(datas, document.querySelector("div.main-item"), document.querySelector("div.module-frame"));
    alert(6)

    layui.use(function(){
        var layer = layui.layer;
        var open = layer.open({
            type: 1,
            area: ['720px', '480px'],
            title: false,
            shade: 0.6,
            shadeClose: false,
            maxmin: false,
            anim: -1,
            content: root.outerHTML,
            success: function() {
                fresh_form();

                var input = document.querySelector(".task-name");
                var textarea = document.querySelector(".task-marker");
                input.value = name;
                textarea.value = marker;
                
                var selector = document.querySelector(".create-type-selector");
                var form = layui.form;
                form.on("select(create-type-selector)", function (data) {
                    if (selector.selectedIndex > 0) {
                        reloadEditPanel();
                        itemChoose(raw_item[selector.selectedIndex - 1], document.querySelector("div.main-item"), document.querySelector("div.module-frame"));
                    }
                    else {
                        reloadEditPanel();
                        itemChoose(datas, document.querySelector("div.main-item"), document.querySelector("div.module-frame"));
                    }
                })

                // 数据发送函数
                function dataSend (ifNew) {
                    var xhr = new XMLHttpRequest();
                    var params = new FormData();
                    params.append("un", sessionStorage.getItem("un"));
                    params.append("ID", sessionStorage.getItem("ID"));
                    params.append("data", input.value + ";" + textarea.value + ";" +updateitems());
                    xhr.open("POST", "", true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.responseText) {
                                if (ifNew) msg_set("新建题目成功");
                                else msg_set("更新数据成功");
                            }
                        }
                    }
                }

                var updateBtn = document.querySelector(".update-btn");
                updateBtn.onclick = function () {
                    var layer = layui.layer;
                    layer.confirm("此操作将删除服务器上的全部相关内容，且无法撤销，请再一次确认是否进行？", {
                        title: "询问",
                        icon: 3,
                    }, function (index) {
                        if (sessionStorage.getItem("ID")) {
                            dataSend(0);
                        }
                        else {
                            var xhr = new XMLHttpRequest();
                            var params = new FormData();
                            params.append("un", sessionStorage.getItem("un"));
                            xhr.open("POST", "", true);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4) {
                                    if (xhr.responseText) {
                                        sessionStorage.setItem("ID", xhr.responseText);
                                        dataSend(1);
                                    }
                                    else msg_set("在新建任务的过程中发生了未知错误，请重试或联系维护人员");
                                }
                            }
                        }
                        layer.close(index);
                    });
                }
            }
        });
    });
}

// 类别选择器重置
function typeSelectorInitial () {
    typeSelector.selectedIndex = 0;
    renderQuestionTable(allDatas);
}

// 搜索初始化函数
function nameSearchInitial () {
    searchInput.value = "";
    renderQuestionTable(allDatas);
}

// 名称搜索函数
function nameSearch () {
    var value = searchInput.value;
    var searchDatas = [];
    allDatas.forEach(Data => {
        if (Data[1].includes(value)) {
            searchDatas.push(Data);
        }
    })
    renderQuestionTable(searchDatas);
}


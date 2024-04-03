let place = document.querySelector("div.main-item");
let infplace = document.querySelector("div.module-frame");
let fnplace = document.querySelector("div.front-narration-frame");
let bnplace = document.querySelector("div.back-narration-frame");
/**Array<type, size, position, url, <title, contain|<question, <options...>, right, grade>>>*/
let items = [];
let files_index = [];
/**前旁白,后旁白,图片url*/
let narration_contents = [[], [], []];

/**组件数据清空函数 */
function clearitems () {
    items = [];
}

/**
 * 整理组件数据，返回组装完成的字符串
 * @returns {String} 完整数据格式
 */
function updateitems () {
    var datas = items;
    for (var i = 0; i < datas.length; i++) {
        if (Array.isArray(datas[i][4][1])) {
            datas[i][4][1][1] = datas[i][4][1][1].join("~#");
            datas[i][4][1] = datas[i][4][1].join("~@");
        }
        datas[i][4] = datas[i][4].join("~!");
        datas[i] = datas[i].join("|");
    };
    datas = datas.join(":");
    return datas;
}

/**获取文件路径索引函数 */
function get_fileresponse () {
    return files_index;
}

/**
 * size position preload 
 * @param {string} size datas[1] 
 * @param {string} position datas[2]
 * @param {Number} id 序号
 * @returns {Element} 返回item根元素
 */
function SP_load(size, position, id) {
    items[id] = [];
    items[id][1] = size;
    items[id][2] = position; 
    
    var obj = document.createElement("div");
    obj.style.position = "relative";
    obj.style.overflow = "hidden";

    var size = size.split("x");
    var position = position.split("x");

    obj.style.width = size[0] + "%";
    obj.style.height = size[1] + "%";
    obj.style.left = position[0] + "%";
    obj.style.top = position[1] + "%";

    return obj;
}

/**按键绑定 */
function key_bind () {
    var inputs = document.querySelectorAll("input[type='text']");
    inputs.forEach(input => {
        input.onkeydown = function(event) {
            event = event || window.event;
            if (event.keyCode === 13) {
                input.placeholder = input.value;
            };
        };
    });

    var textareas = document.querySelectorAll("textarea");
    textareas.forEach(textarea => {
        textarea.onkeydown = function(event) {
            event = event || window.event;
            if (event.key === "Enter" && event.shiftKey) {
                textarea.placeholder = textarea.value;
                event.preventDefault();
            };
        };
    });
}

/**更新框架 */
function fresh_form() {
    layui.use('form', function(){
        var form = layui.form;
        form.render();
    });
}

/**
 * 获取旁白内容函数
 * @param {Number} sequence 旁白类型 
 * @returns {[String, String]} 旁白数据字符串，图片url
 */
function fn_updata (sequence) {
    var contains = "";
    for (var i = 0; i < narration_contents[sequence].length; i++) {
        contains = contains + narration_contents[sequence][i];
    }
    return [contains, narration_contents[2][sequence]];
}
 
/**
 * 旁白数据获取函数
 */
function narration_load() {
    fnplace.innerHTML = "";
    bnplace.innerHTML = "";
    var xhr = new XMLHttpRequest();
    var params = new FormData();
    
    params.append("un", sessionStorage.getItem("un"));
    params.append("LineID",sessionStorage.getItem("LineID"))
    params.append("PointID", sessionStorage.getItem("PointID"));
    params.append("DramaID",sessionStorage.getItem("DramaID"));
    params.append("TaskID", sessionStorage.getItem("TaskID"));

    xhr.open("POST", "/webGetOverlay", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            //数据内容：前旁白图片url:前旁白内容1|前旁白内容2|...;后旁白图片url:后旁白内容1|后旁白内容2|...\
            var data = xhr.responseText;

            var images = [];
            images.push(data.split(";")[0].split(":")[0]);
            images.push(data.split(";")[1].split(":")[0]);
            var contents = [];
            contents.push(data.split(";")[0].split(":")[1].split("|"));
            contents.push(data.split(";")[1].split(":")[1].split("|"));

            narration(0, "bn-update-btn0", images[0], contents[0]);
            narration(1, "bn-update-btn1", images[1], contents[1]);
            alert(6);

            //narration(0, "bn-update-btn0", "", ["hdukhawuikdbhawuioawhduhicbasdjk", "dawdaa"]);
            //narration(1, "bn-update-btn1", "", ["sdaw", "awdaw", "daw"]);
        };
    };

    xhr.send(params);
}

/**datas数据结构: type, size(width x height,百分比单位,单位省略), position(left x top,百分比单位,单位省略), url, status(名称~!备注或题目内容(内容~@选项~#选项~#选项~#选项~@正确选项~@分值))*/

/**添加分隔符 */
function hr_add() {
    var hr = document.createElement("hr");
    hr.style.margin = "10px 0";
    hr.style.border = "1px solid #5a5a5a";
    infplace.appendChild(hr);
}

/** 
 * 图片加载函数 
 * @param {Array} datas datas数据结构: type, size(width x height,百分比单位,单位省略), position(left x top,百分比单位,单位省略), url, status(名称~!备注或题目内容(内容~@选项~#选项~#选项~#选项~@正确选项~@分值))
 * @param {Number} id 序号
 * @param {String} buttonID 绑定上传按钮的id
 * @param {Boolean} mode 是否启用模板模式
 */
function photo(datas, id, buttonID, mode) {
    files_index.push({"image": datas[3]});
    // 预览加载
    var root_div = SP_load(datas[1], datas[2], id);
    items[id][0] = datas[0];
    items[id][3] = datas[3];
    items[id][4] = [];
    root_div.className = "photo-item";
    root_div.title = datas[4].split("~!")[0];
    // root_div.title = "测试名称";

    var photo_img = document.createElement("img");
    photo_img.className = "photo";

    // photo_img.src = datas[3]; 
    photo_img.src = "../images/test.jpg";
    photo_img.style.width = "100%";
    photo_img.style.height = "100%";
    

    root_div.appendChild(photo_img);

    place.appendChild(root_div);

    // 编辑栏加载
    var root = document.createElement("div");
    root.classList = "photo_option item";
    root.style.width = "100%";
    
    var name_div = document.createElement("div");
    name_div.className = "item-name";

    var title_span = document.createElement("span");
    title_span.className = "title-span";
    title_span.textContent = "图片名称";
    name_div.appendChild(title_span);

    var title = document.createElement("input");
    title.classList = "layui-input input";
    title.type = "text";
    title.name = "图片名称";
    title.value = datas[4].split("~!")[0];
    title.placeholder = title.value;
    // title.value = "图片测试"
    // title.placeholder = "图片测试";
    items[id][4][0] = title.value;
    title.style.border = "none";
    title.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            root_div.title = title.value;
            items[id][4][0] = title.value;
        }
    });
    name_div.appendChild(title);
    root.appendChild(name_div);

    var remark_div = document.createElement("div");
    remark_div.style.display = "flex";
    remark_div.style.alignItems = "center";
    remark_div.style.marginTop = "5%";
    remark_div.style.width = "100%";

    var photo_span = document.createElement("span");
    photo_span.className = "title-span";
    photo_span.textContent = "图片备注";
    remark_div.appendChild(photo_span);

    var textarea = document.createElement("textarea");
    textarea.classList = "layui-textarea photo-remark";
    textarea.id = id;
    textarea.value = datas[4].split("~!")[1];
    textarea.placeholder = datas[4].split("~!")[1];
    // textarea.value = "空";
    // textarea.placeholder = "空";
    items[id][4][1] = textarea.value;
    remark_div.appendChild(textarea);
    root.appendChild(remark_div);

    var push_div = document.createElement("div");
    push_div.className = "push-photo";
    push_div.style.marginTop = "5px";
    push_div.style.width = "100%";

    var box = document.createElement("div");
    box.className = "box";
    box.style.width = "90%";
    box.style.margin = "0 5%";
    box.style.border = "1px dashed black";

    var div_load = document.createElement("div");
    div_load.classList = "layui-upload-list upload-list";
    div_load.style.width = "100%";
    div_load.style.display = "flex";
    div_load.style.flexDirection = "column";
    div_load.style.alignItems = "center";

    var img = document.createElement("img");
    img.classList = "layui-upload-img upload-img";
    img.id = "ID-upload-img-img";
    img.style.width = "90%";
    img.style.height = "auto";
    div_load.appendChild(img);
    box.appendChild(div_load);
    push_div.appendChild(box)

    var button = document.createElement("button");
    button.type = "button";
    button.classList = "layui-btn push-button";
    button.id = "ID-upload-img-btn";
    button.innerHTML = '<i class="layui-icon layui-icon-upload"></i> 图片上传';
    button.style.width = "50%";
    button.style.margin = "5% 25%";
    push_div.appendChild(button)

    root.appendChild(push_div);
    infplace.appendChild(root);

    layui.use(function () {
        var upload = layui.upload;
        var layer = layui.layer;
        var element = layui.element;
        var $ = layui.$;
        // 单图片上传
        var uploadInst = upload.render({
            elem: '#ID-upload-img-btn',
            url: datas[3], // 实际使用时改成您自己的上传接口即可。
            auto: false,
            bindAction: "#" + buttonID,
            accept: 'file', // 普通文件
            data: {
                "LineID": sessionStorage.getItem("LineID"),
                "PointID": sessionStorage.getItem("PointID"),
                "TaskID": sessionStorage.getItem("TaskID"),
            }, 
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#ID-upload-img-img').attr('src', result); // 图片链接（base64）
                    photo_img.src = result;
                });
            },
            done: function (res) {
                var newDict = {"image": res.response};
                var existingIndex = files_index.findIndex(function(item) {
                    return item.photo !== undefined; 
                });
                if (existingIndex !== -1) {
                    files_index[existingIndex] = newDict;
                }
                else {
                    files_index.push(newDict); 
                }
            }
        });
    })

}

/** 
 * 问题加载函数 
 * @param {Array} datas datas数据结构: type, size(width x height,百分比单位,单位省略), position(left x top,百分比单位,单位省略), url, status(名称~!备注或题目内容(内容~@选项~#选项~#选项~#选项~@正确选项~@分值))
 * @param {Number} id 序号
 * @param {String} buttonID 绑定上传按钮的id
 * @param {Boolean} mode 是否启用模板模式
 */
function question(datas, id, buttonID, mode) {
    // 预览加载
    var root_div = SP_load(datas[1], datas[2], id);
    items[id][0] = datas[0];
    items[id][3] = datas[3];
    items[id][4] = [];
    items[id][4][1] = [];
    items[id][4][1][1] = [];
    root_div.className = "question-item";
    root_div.title = datas[4].split("~!")[0];
    // root_div.title = "问题测试";

    var question_div = document.createElement("div");
    question_div.classList = "question";
    question_div.style.width = "100%";
    question_div.style.height = "100%";
    question_div.style.overflow = "hidden";
    question_div.style.display = "flex";
    question_div.style.flexDirection = "column";
    question_div.style.backgroundColor = "rgb(240, 240, 240, 0)"

    var text_div = document.createElement("div");
    text_div.className = "text";
    text_div.textContent = datas[4].split("~!")[1].split("~@")[0];
    // text_div.textContent = "问题测试";
    text_div.style.color = "black";
    text_div.style.width = "100%";
    text_div.style.minHeight = "25%";
    text_div.style.height = "auto";
    text_div.style.overflowWrap = "break-word";
    text_div.style.wordBreak = "normal";
    text_div.style.whiteSpace = "pre-wrap";
    text_div.style.setProperty("font-size", "10px", "important");
    question_div.appendChild(text_div);

    var choose_div = document.createElement("div");
    choose_div.className = "form";
    choose_div.style.display = "flex";
    choose_div.style.flexDirection = "column";
    choose_div.style.alignItems = "center";
    choose_div.style.width = "100%";
    choose_div.style.flexGrow = "1";
    choose_div.style.height = "75%";

    var options = [];
    var optiondata = datas[4].split("~!")[1].split("~@")[1].split("~#");
    for (var i = 0; i < optiondata.length; i++) {
        options.push(optiondata[i]);
    };
    // options = ["测试1", "测试2", "测试3", "测试4"];
    for (var i = 0; i < options.length; i++) {
        var button = document.createElement("button");
        button.type = "button";
        button.classList = "layui-btn choice-button";
        button.style.margin = "0.5%";
        button.style.lineHeight = "20px";
        button.style.fontSize = "8px";
        button.value = i;
        button.textContent = String.fromCharCode(65 + i) + "." + options[i];
        choose_div.appendChild(button);
    }

    question_div.appendChild(choose_div);

    root_div.appendChild(question_div);

    place.appendChild(root_div);
    
    // 编辑栏加载
    var root = document.createElement("div");
    root.classList = "question_option item";

    var name_div = document.createElement("div");
    name_div.className = "item-name";

    var title_span = document.createElement("span");
    title_span.className = "title-span";
    title_span.textContent = "问题名称";
    name_div.appendChild(title_span);

    var title = document.createElement("input");
    title.classList = "layui-input input";
    title.type = "text";
    title.name = "问题名称";
    title.value = datas[4].split("~!")[0];
    title.placeholder = datas[4].split("~!")[0];
    // title.value = "问题测试";
    // title.placeholder = "问题测试";
    items[id][4][0] = title.value;
    title.style.border = "none";
    title.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            root_div.title = title.value;
            items[id][4][0] = title.value;
        }
    });
    name_div.appendChild(title);
    root.appendChild(name_div);

    var context_div = document.createElement("div");
    context_div.style.display = "flex";
    context_div.style.alignItems = "center";
    context_div.style.marginTop = "5px";
    context_div.style.width = "100%";

    var context_span = document.createElement("span");
    context_span.className = "title-span";
    context_span.textContent = "问题内容";
    context_div.appendChild(context_span);

    var textarea = document.createElement("textarea");
    textarea.classList = "layui-textarea question-context";
    textarea.value = datas[4].split("~!")[1].split("~@")[0];
    textarea.placeholder = datas[4].split("~!")[1].split("~@")[0];
    // textarea.value = "问题测试";
    // textarea.placeholder = "问题测试";
    items[id][4][1][0] = textarea.value;
    textarea.addEventListener("keydown", function (event) {
        event = event || window.event;
        if (event.key === 'Enter' && event.shiftKey) {
            textarea.placeholder = textarea.value;
            text_div.textContent = textarea.value;
            items[id][4][1][0] = textarea.value;
            event.preventDefault();
        };
    })
    context_div.appendChild(textarea);
    root.appendChild(context_div);

    var div = document.createElement("div");
    div.className = "Qbox";
    div.style.marginTop = "5px";
    div.style.width = "100%";
    for (var i = 0; i < options.length; i++) {
        (function(i){
            var option_div = document.createElement("div");
            option_div.className = "option-div";
            option_div.style.display = "flex";
            option_div.style.alignItems = "center";
            option_div.style.width = "100%";
            option_div.style.height = "25px";

            var option_span = document.createElement("span");
            option_span.className = "title-span";
            option_span.textContent = String.fromCharCode(65 + i) + "选项";
            option_div.appendChild(option_span);

            var input = document.createElement("input");
            input.className = "layui-input input Qname-input";
            input.type = "text";
            input.name = "选项";
            input.value = datas[4].split("~!")[1].split("~@")[1].split("~#")[i];
            input.placeholder = input.value;
            // input.value = options[i];
            // input.placeholder = options[i];
            items[id][4][1][1][i] = input.value;
            input.addEventListener("keydown", function(event) {
                event = event || window.event;
		            if (event.key === "Enter") {
                        options[i] = input.value;
                        var choices = document.querySelectorAll("button.choice-button");
                        choices[i].textContent = String.fromCharCode(65 + i) + "." + options[i];
                        var option = document.querySelectorAll("div.optionbox option");
                        option[i].textContent = options[i];
                        fresh_form();

                        items[id][4][1][1][i] = input.value;
                    } 
            });
            option_div.appendChild(input);
            div.appendChild(option_div);
        })(i);
    }

    var right_div = document.createElement("div");
    right_div.className = "rightgrade";
    right_div.style.marginTop = "10px";
    right_div.style.width = "100%";

    var right_option_box = document.createElement("div");
    right_option_box.style.display = "flex";
    right_option_box.style.alignItems = "center";
    right_option_box.style.width = "100%";

    var text = document.createElement("span");
    text.classList= "title-span";
    text.innerHTML = "正确答案";
    right_option_box.appendChild(text);

    var select_div = document.createElement("div")
    select_div.className = "layui-col-md6 optionbox";

    var select = document.createElement("select");
    select.style.width = "100%";
    select.style.height = "38px";
    for (var i = 0; i < options.length; i++) {
        (function(i){
            var option = document.createElement("option");
            option.value = i;
            option.textContent = options[i];
            select.appendChild(option);
        })(i);
    };
    select.selectedIndex = datas[4].split("~!")[1].split("~@")[2];
    items[id][4][1][2] = select.selectedIndex;
    select.addEventListener("change", function (event) {
        items[id][4][1][2] = select.selectedIndex;
    });
    select_div.appendChild(select);
    right_option_box.appendChild(select_div);
    right_div.appendChild(right_option_box);

    var number_div = document.createElement("div");
    number_div.style.display = "flex";
    number_div.style.alignItems = "center";
    number_div.style.width = "100%";
    number_div.style.margin = "5% 0";

    var text = document.createElement("span");
    text.className = "title-span";
    text.innerHTML = "获得分数";
    number_div.appendChild(text);

    var input = document.createElement("input");
    input.classList = "layui-input gradeinput";
    input.type = "number";
    input.setAttribute("lay-affix", "number");
    input.style.height = "25px";
    input.step = "1";
    input.value = datas[4].split("~!")[1].split("~@")[3];
    // input.value = "0";
    items[id][4][1][3] = input.value;
    input.min = "0";
    input.max = "100";
    input.title = "请输入整数";
    input.addEventListener("input", function() {
        if (Number(input.value) > 100) {
            input.value = "100";
        }
        else if (Number(input.value) < 0 || input.value === "") {
            input.value = "0";
        };
        items[id][4][1][3] = input.value;
    });
    input.addEventListener("keydown", function(event) {
        if (event.key === '.') {
            event.preventDefault();
        }
    });
    number_div.appendChild(input);
    right_div.appendChild(number_div);

    div.appendChild(right_div);
    root.appendChild(div);

    infplace.appendChild(root);
}

/**
 * 视频加载函数
 * @param {Array} datas datas数据结构: type, size(width x height,百分比单位,单位省略), position(left x top,百分比单位,单位省略), url, status(名称~!备注或题目内容(内容~@选项~#选项~#选项~#选项~@正确选项~@分值))
 * @param {Number} id 序号
 * @param {String} buttonID 绑定上传按钮的id
 * @param {Boolean} mode 是否启用模板模式
 */
function video(datas, id, buttonID, mode) {
    files_index.push({"video": datas[3]});
    sessionStorage.setItem("video", "0");
    // 预览加载
    var root_div = SP_load(datas[1], datas[2], id);
    items[id][0] = datas[0];
    items[id][3] = datas[3];
    items[id][4] = [];
    root_div.className = "video-item";
    // root_div.title = datas[4].split("~!")[0];
    root_div.title = "视频测试";

    var video_div = document.createElement("video");
    video_div.className = "video";
    video_div.setAttribute("controls", "true");
    video_div.setAttribute("autoplay", "false");
    video_div.style.width = "100%";
    video_div.style.height = "100%";

    // 添加等待
    layui.use(function () {
        var layer = layui.layer;
        var loadIndex = layer.load(0, {shade: 0.5});
    
        video_div.addEventListener("canplay", function() {
            if (!video_div.paused) {
                video_div.play();
            }
        });
        video_div.addEventListener('loadeddata', function(e) {
            video_div.pause();
            layer.close(loadIndex);
        });
    });

    var video_source = document.createElement("source");
    video_source.className = "video-source";
    // video_source.src = datas[3]; 
    // video_source.type = "video/" + datas[3].split(".")[datas[3].split(".").length - 1];
    video_source.src = "../video/video_test.mp4";
    video_source.type = "video/mp4";
    video_div.appendChild(video_source);

    var textNode = document.createTextNode("视频加载失败")
    video_div.appendChild(textNode);

    root_div.appendChild(video_div);
    place.appendChild(root_div);

    // 编辑栏加载
    var root = document.createElement("div");
    root.classList = "video_option item";

    var name_div = document.createElement("div");
    name_div.className = "item-name";

    var title_span = document.createElement("span");
    title_span.className = "title-span";
    title_span.textContent = "视频名称";
    name_div.appendChild(title_span);

    var title = document.createElement("input");
    title.classList = "layui-input input";
    title.type = "text";
    title.name = "视频名称";
    // title.value = datas[4].split("~!")[0];
    // title.placeholder = title.value;
    title.value = "视频测试"
    title.placeholder = "视频测试";
    items[id][4][0] = title.value;
    title.style.border = "none";
    title.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            root_div.title = title.value;
            items[id][4][0] = title.value;
        }
    });
    name_div.appendChild(title);
    root.appendChild(name_div);

    var remark_div = document.createElement("div");
    remark_div.style.display = "flex";
    remark_div.style.alignItems = "center";
    remark_div.style.marginTop = "5%";
    remark_div.style.width = "100";

    var video_span = document.createElement("span");
    video_span.className = "title-span";
    video_span.textContent = "视频备注";
    remark_div.appendChild(video_span);

    var textarea = document.createElement("textarea");
    textarea.classList = "layui-textarea video-remark";
    // textarea.value = datas[4].split("~!")[1];
    // textarea.placeholder = datas[4].split("~!")[1];
    textarea.value = "空";
    textarea.placeholder = "空";
    items[id][4][1] = textarea.value;
    remark_div.appendChild(textarea);
    root.appendChild(remark_div);

    var file_div = document.createElement("div");
    file_div.className = "file-div";
    file_div.style.display = "flex";
    file_div.style.flexDirection = "column";
    file_div.style.marginTop = "5%";
    file_div.style.width = "100%";

    var file_textarea = document.createElement("textarea");
    file_textarea.className = "file-name";
    file_textarea.style.width = "90%";
    file_textarea.style.height = "auto";
    file_textarea.style.marginLeft = "5%";
    file_textarea.style.display = "inline-block";
    file_textarea.style.resize = "none";
    file_textarea.style.minHeight = "5px";
    file_textarea.readOnly = "true";
    file_div.appendChild(file_textarea);

    var update_button = document.createElement("button");
    update_button.type = "button";
    update_button.classList = "layui-btn video-accept";
    update_button.id = "ID-upload-video-btn";
    update_button.innerHTML = '<i class="layui-icon layui-icon-upload"></i> 视频上传';
    update_button.setAttribute("lay-options", "{accept: 'video'}");
    update_button.style.width = "50%";
    update_button.style.margin = "5% 25%";
    file_div.appendChild(update_button);
    root.appendChild(file_div);
    infplace.appendChild(root);

    layui.use(function(){
        var upload = layui.upload;
        var layer = layui.layer;
        // 渲染
        upload.render({
            elem: '.video-accept', // 绑定多个元素
            url: datas[3], // 此处配置你自己的上传接口即可
            auto: false,
            bindAction: "#" + buttonID,
            accept: 'file', // 普通文件
            data: {
                "LineID": sessionStorage.getItem("LineID"),
                "PointID": sessionStorage.getItem("PointID"),
                "TaskID": sessionStorage.getItem("TaskID"),
            }, 
            choose: function (obj) {
                obj.preview(function(index, file, result){
                    var size;
                    if (file.size/1024/1024 > 0) {
                        size = Math.ceil(file.size/1024/1024) + "MB";
                    }
                    else {
                        size = Math.ceil(file.size/1024) + "KB";
                    };
                    file_textarea.textContent = file.name + "   " + size;

                    video_source.src = URL.createObjectURL(file);
                    video_source.type = file.type;

                    video_div.load(); 
                    layui.use(function () {
                        var layer = layui.layer;
                        var loadIndex = layer.load(0, {shade: 0.5});
                    
                        video_div.addEventListener("canplay", function() {
                            if (!video_div.paused) {
                                video_div.play();
                            }
                        });
                        video_div.addEventListener('loadeddata', function(e) {
                            video_div.pause();
                            layer.close(loadIndex);
                        });
                    });
                    // 实时加载视频资源组件未完成
                    // video_source.src = file;
                    // video_source.type = "video/" + result.split(".")[result.split(".").length - 1];
                }); 
            },
            done: function (res) {
                var newDict = {"video": res.response};
                var existingIndex = files_index.findIndex(function(item) {
                    return item.photo !== undefined; 
                });
                if (existingIndex !== -1) {
                    files_index[existingIndex] = newDict;
                }
                else {
                    files_index.push(newDict); 
                }
            }
        });
      });
}

/**
 * 音频加载函数
 * @param {Array} datas datas数据结构: type, size(width x height,百分比单位,单位省略), position(left x top,百分比单位,单位省略), url, status(名称~!备注或题目内容(内容~@选项~#选项~#选项~#选项~@正确选项~@分值))
 * @param {Number} id 序号
 * @param {String} buttonID 绑定上传按钮的id
 * @param {Boolean} mode 是否启用模板模式
 */
function audio(datas, id, buttonID, mode) {
    files_index.push({"audio": datas[3]});
    // 预览加载
    var root_div = SP_load(datas[1], datas[2], id);
    items[id][0] = datas[0];
    items[id][3] = datas[3];
    items[id][4] = [];
    root_div.className = "audio-item";
    root_div.title = "音频测试";

    var audio_div = document.createElement("audio");
    audio_div.className = "audio";
    // audio_div.src = datas[3]; 
    audio_div.src = "../audio/test.mp3";
    audio_div.setAttribute("controls", "true");
    audio_div.style.width = "100%";
    audio_div.style.height = "30%";

    root_div.appendChild(audio_div);
    place.appendChild(root_div);

    // 编辑栏加载
    var root = document.createElement("div");
    root.classList = "audio_option item";

    var name_div = document.createElement("div");
    name_div.className = "item-name";

    var title_span = document.createElement("span");
    title_span.className = "title-span";
    title_span.textContent = "音频名称";
    name_div.appendChild(title_span);

    var title = document.createElement("input");
    title.classList = "layui-input input";
    title.type = "text";
    title.name = "音频名称";
    // title.value = datas[4].split("~!")[0];
    // title.placeholder = datas[4].split("~!")[0];
    title.value = "音频测试"
    title.placeholder = "音频测试";
    items[id][4][0] = title.value;
    title.style.border = "none";
    title.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            root_div.title = title.value;
            items[id][4][0] = title.value;
        }
    });
    name_div.appendChild(title);
    root.appendChild(name_div);

    var remark_div = document.createElement("div");
    remark_div.style.display = "flex";
    remark_div.style.alignItems = "center";
    remark_div.style.marginTop = "5%";
    remark_div.style.width = "100";

    var video_span = document.createElement("span");
    video_span.className = "title-span";
    video_span.textContent = "音频备注";
    remark_div.appendChild(video_span);

    var textarea = document.createElement("textarea");
    textarea.classList = "layui-textarea audio-remark";
    // textarea.value = datas[4].split("~!")[1];
    // textarea.placeholder = datas[4].split("~!")[1];
    textarea.value = "空";
    textarea.placeholder = "空";
    items[id][4][1] = textarea.value;
    remark_div.appendChild(textarea);
    root.appendChild(remark_div);

    var file_div = document.createElement("div");
    file_div.className = "file-div";
    file_div.style.display = "flex";
    file_div.style.flexDirection = "column";
    file_div.style.marginTop = "5%";
    file_div.style.width = "100%";

    var file_textarea = document.createElement("textarea");
    file_textarea.className = "file-name";
    file_textarea.style.width = "90%";
    file_textarea.style.height = "auto";
    file_textarea.style.marginLeft = "5%";
    file_textarea.style.display = "inline-block";
    file_textarea.style.resize = "none";
    file_textarea.style.minHeight = "5px";
    file_textarea.readOnly = "true";
    file_div.appendChild(file_textarea);

    var update_button = document.createElement("button");
    update_button.type = "button";
    update_button.classList = "layui-btn audio-accept";
    update_button.setAttribute("lay-options", "{accept: 'audio'}");
    update_button.id = "ID-upload-audio-btn";
    update_button.innerHTML = '<i class="layui-icon layui-icon-upload"></i> 音频上传';
    update_button.style.width = "50%";
    update_button.style.margin = "5% 25%";
    file_div.appendChild(update_button);
    root.appendChild(file_div);
    infplace.appendChild(root);

    layui.use(function(){
        var upload = layui.upload;
        var layer = layui.layer;
        // 渲染
        upload.render({
            elem: '.audio-accept', // 绑定多个元素
            url: datas[3], // 此处配置你自己的上传接口即可
            auto: false, // 取消自动上传
            bindAction: "#" + buttonID, // 绑定上传按钮自动实现点击上传功能
            accept: 'file', // 普通文件
            data: {
                "LineID": sessionStorage.getItem("LineID"),
                "PointID": sessionStorage.getItem("PointID"),
                "TaskID": sessionStorage.getItem("TaskID"),
            }, 
            choose: function (obj) {
                obj.preview(function(index, file, result){
                    var size;
                    if (file.size/1024/1024 > 0) {
                        size = Math.ceil(file.size/1024/1024) + "MB";
                    }
                    else {
                        size = Math.ceil(file.size/1024) + "KB";
                    };
                    file_textarea.textContent = file.name + "   " + size;

                    audio_div.src = result;
                }); 
            },
            done: function (res) {
                var newDict = {"audio": res.response};
                var existingIndex = files_index.findIndex(function(item) {
                    return item.photo !== undefined; 
                });
                if (existingIndex !== -1) {
                    files_index[existingIndex] = newDict;
                }
                else {
                    files_index.push(newDict); 
                }
            }
        });
      });
}

/**
 * AR控制函数
 * @param {Number|String} xD AR模型类型
 */
function AR(xD) {
    layui.use(function() {
        var files_ok = [false, false];
        var layer = layui.layer

        var root = document.createElement("div");
        root.style.width = "480px";
        root.style.height = "200px";
        root.style.overflow = "hidden";
        root.style.display = "flex";

        var bottom_div = document.createElement("div");
        bottom_div.style.width = "40%";
        bottom_div.style.height = "100%";
        bottom_div.style.padding = "5%";
        bottom_div.style.display = "flex";
        bottom_div.style.flexDirection = "column";

        var file_choose1 = document.createElement("button");
        file_choose1.innerHTML = '<i class="layui-icon layui-icon-upload"></i> 上传glb或gltf文件';
        file_choose1.type = "button";
        file_choose1.classList = "layui-btn module-set-button"; 
        file_choose1.setAttribute("lay-options", "{accept: 'file', exts: 'glb|gitf'}");
        bottom_div.appendChild(file_choose1);

        var file_choose2 = document.createElement("button");
        file_choose2.classList = "layui-btn module-set-button"; 
        file_choose2.style.marginTop = "5%";
        file_choose2.type = "button";
        // 2DMarker
        if (xD === 2){
            file_choose2.innerHTML = '<i class="layui-icon layui-icon-upload"></i> 上传图片文件';
            file_choose2.setAttribute("lay-options", "{accept: 'file', exts: 'jpg|png'}");
        }
        // 3DMarker
        else {
            file_choose2.innerHTML = '<i class="layui-icon layui-icon-upload"></i> 上传视频文件';
            file_choose2.setAttribute("lay-options", "{accept: 'video'}");
        }
        bottom_div.appendChild(file_choose2);

        var sure = document.createElement("button");
        sure.classList = "layui-btn certain-btn";
        sure.id = "certain-btn";
        sure.textContent = "保存";
        sure.style.width = "80px";
        sure.style.margin = "20px 56px";
        bottom_div.appendChild(sure);
        root.appendChild(bottom_div);

        var file_textarea = document.createElement("textarea");
        file_textarea.className = "AR-file-name";
        file_textarea.style.marginLeft = "5%";
        file_textarea.style.display = "inline-block";
        file_textarea.style.resize = "none";
        file_textarea.style.minHeight = "5px";
        file_textarea.style.height = "160px";
        file_textarea.style.width = "180px";
        file_textarea.style.marginTop = "20px";
        file_textarea.readOnly = "true";
        root.appendChild(file_textarea);

        var index = layer.open({
            type: 1,
            area: ['480px', '200px'],
            title: false,
            content: root.outerHTML
        });

        var upload = layui.upload;
        var i = 0;
        upload.render({
            elem: '.module-set-button',
            url: 'http://8.130.89.101:8080/file/upload',
            accept: 'file', // 普通文件
            data: {
                "LineID": sessionStorage.getItem("LineID"),
                "PointID": sessionStorage.getItem("PointID"),
                "TaskID": sessionStorage.getItem("TaskID"),
            }, 
            choose: function (obj) {
                obj.preview(function(index, file, result){
                    var size;
                    if (file.size/1024/1024 > 0) {
                        size = Math.ceil(file.size/1024/1024) + "MB";
                    }
                    else {
                        size = Math.ceil(file.size/1024) + "KB";
                    };
                    var file_textarea = document.querySelector("textarea.AR-file-name");
                    var text = file_textarea.textContent;
                    text = text.split("\n");
                    if (file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2) === "glb" ||
                    file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2) === "gitf") {
                        text[0] = file.name + "   " + size;
                        text[1] = text[1]===undefined?"":text[1];
                        i = 0;
                    }
                    else {
                        text[0] = text[0]===undefined?"":text[0];
                        text[1] = file.name + "   " + size;
                        i = 1;
                    }
                    file_textarea.textContent = text[0] + "\n" + text[1];
                });
            },
            done: function (res) {
                var file = res.file;
                var fileExtension = "AR" + file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
                var newDict = {};
                newDict[fileExtension] = res.response;
                var existingIndex = files_index.findIndex(function(item) {
                    return item.photo !== undefined; 
                });
                if (existingIndex !== -1) {
                    files_index[existingIndex] = newDict;
                }
                else {
                    files_index.push(newDict); 
                };

                files_ok[i] = true;

                if (files_ok[0] === true && files_ok[1] === true) {
                    var ARfile_state = document.querySelector("span.AR-state-span");
                    ARfile_state.textContent = "已达标";
                    layer.close(index);
                }
            },
            error: function() {
                files_ok[i] = false;
                layer.msg("上传失败");
            }
        });
    });
}

/**
 * 旁白组件添加函数
 * @param {Number} sequence 旁白位置
 * @param {String} buttonID 上传绑定按钮 
 * @param {String} image 旁白图片url
 * @param {Array<String>} contents 旁白内容数组
 */
function narration(sequence, buttonID, image, contents) {
    // 预览效果添加
    alert(7);

    // 编辑栏加载
    var root = document.createElement("div");
    root.classList = sequence + "narration-option item";
    root.style.width = "100%";
    root.style.marginTop = "10px";

    // 图片上传部分
    var image_div = document.createElement("div");
    image_div.classList = "image-item" + sequence;
    image_div.style.width = "100%";

    var title_span = document.createElement("span");
    title_span.className = "title-span";
    title_span.textContent = "旁白图片";
    image_div.appendChild(title_span);

    var push_div = document.createElement("div");
    push_div.className = "push-image" + sequence;
    push_div.style.marginTop = "5px";
    push_div.style.width = "100%";

    var box = document.createElement("div");
    box.className = "box";
    box.style.width = "90%";
    box.style.margin = "0 5%";
    box.style.border = "1px dashed black";

    var div_load = document.createElement("div");
    div_load.classList = "layui-upload-list upload-list" + sequence;
    div_load.style.width = "100%";
    div_load.style.display = "flex";
    div_load.style.flexDirection = "column";
    div_load.style.alignItems = "center";

    var img = document.createElement("img");
    img.classList = "layui-upload-img upload-fnImg" + sequence;
    img.id = "ID-upload-fn-img" + sequence;
    img.src = image;
    narration_contents[2][sequence] = image;
    img.style.width = "90%";
    img.style.height = "auto";
    div_load.appendChild(img);
    box.appendChild(div_load);
    push_div.appendChild(box)

    // 上传按钮
    var button = document.createElement("button");
    button.type = "button";
    button.classList = "layui-btn push-button" + sequence;
    button.id = "ID-upload-fnImg-btn" + sequence;
    button.innerHTML = '<i class="layui-icon layui-icon-upload"></i> 图片上传';
    button.style.width = "50%";
    button.style.margin = "5% 25%";
    push_div.appendChild(button)

    image_div.appendChild(push_div);
    root.appendChild(image_div);

    // 文本写入部分
    var contents_div = document.createElement("div");
    contents_div.classList = "narrastions-item" + sequence;
    contents_div.style.width = "100%";

    var title_span = document.createElement("span");
    title_span.className = "title-span";
    title_span.textContent = "旁白内容";
    contents_div.appendChild(title_span);

    var text_box = document.createElement("div");
    text_box.className = "box";
    text_box.style.margin = "5px 0";

    var textarea = document.createElement("textarea");
    textarea.classList = "narrations-textarea" + sequence;
    textarea.style.marginLeft = "5%";
    textarea.style.width = "90%";
    textarea.style.resize = "none";
    textarea.style.height = '256px';
    textarea.value = contents[0];
    text_box.appendChild(textarea);

    // 按钮盒子
    var btn_box = document.createElement("div");
    btn_box.classList = "layui-btn-group narration-btnBox" + sequence;
    btn_box.style = "margin-top: 5px;height: 30px; width: 90%; margin-left: 5%; display: block; overflow:hidden; overflow-x:auto";

    function btn_click (Element) {
        var area = document.querySelector("textarea.narrations-textarea" + sequence);
        var raw_btn = btn_box.querySelector("button.layui-btn-disabled");
        raw_btn.classList.remove("layui-btn-disabled");
        Element.classList.add("layui-btn-disabled");
        narration_contents[sequence][raw_btn.classList[3].replace("btn-", "")] = area.value;
        var value = narration_contents[sequence][Element.classList[3].replace("btn-", "")];
        area.value = value===undefined?"":value;
    };

    function del_click (elem, Element) {
        if (elem.button === 2 && btn_box.childElementCount > 2){
            btn_box.removeChild(Element);
            var btns = btn_box.querySelectorAll("button.narration-btn");
            var i;
            if (Element.classList[4] != undefined) {
                i = Element.classList[3].replace("btn-", "");
            }
            else {
                i = btn_box.querySelector("button.layui-btn-disabled").classList[3].replace("btn-", "");
            };
            i = parseInt(i);
            narration_contents[sequence][i] = textarea.value;
            for (var j = Element.classList[3].replace("btn-", ""); j < btns.length; j++) {(
                function (index) {
                    btns[index].classList = "narration-btn layui-btn layui-btn-sm btn-" + index;
                    btns[index].textContent = "对话" + (index + 1);

                    narration_contents[sequence][index] = narration_contents[sequence][index + 1];
                }
            )(parseInt(j));}
            if (btns.length > i) {
                btns[i].classList.add("layui-btn-disabled");
                textarea.value = narration_contents[sequence][i];
            }
            else {
                btns[i - 1].classList.add("layui-btn-disabled");
                textarea.value = narration_contents[sequence][i - 1];
            }
            
            narration_contents[sequence].pop();
        }
    }

    for (var i = 0; i < contents.length; i++) {(
        function(index) {
            var button = document.createElement("button");
            button.type = "button";
            button.classList = "narration-btn layui-btn layui-btn-sm btn-" + index;
            button.title = "右键删除";
            button.textContent = "对话" + (index + 1);
            button.onclick = function () {
                btn_click(button);
            };
            button.addEventListener("mousedown", function (e) {
                del_click(e, button);
            });
            btn_box.appendChild(button);
        }
    )(i);};
    btn_box.querySelector("button.btn-0").classList.add("layui-btn-disabled");

    var add_btn = document.createElement("button");
    add_btn.type = "button";
    add_btn.innerHTML = '<i class="layui-icon layui-icon-add-1"></i>'
    add_btn.classList = "add-btn layui-btn layui-btn-sm";
    btn_box.appendChild(add_btn);

    add_btn.onclick = function () {
        var new_btn = document.createElement("button");
        new_btn.type = "button";
        new_btn.classList = "narration-btn layui-btn layui-btn-sm btn-" + (btn_box.childElementCount - 1);
        new_btn.title = "右键删除";
        new_btn.textContent = "对话" + btn_box.childElementCount;
        btn_box.removeChild(add_btn);
        btn_box.appendChild(new_btn);
        btn_box.appendChild(add_btn);

        new_btn.onclick = function () {
            btn_click(new_btn);
        };
        new_btn.addEventListener("mousedown", function (e) {
            del_click(e, new_btn);
        });
        narration_contents[sequence].push("");
    };
    
    text_box.appendChild(btn_box);
    contents_div.appendChild(text_box);
    root.appendChild(contents_div);
    
    if (sequence === 0) {
        root.classList.add("fn");
        fnplace.appendChild(root);
        narration_contents[0] = contents;
    }
    else {
        root.classList.add("bn");
        bnplace.appendChild(root);
        narration_contents[1] = contents;
    }

    layui.use(function () {
        var upload = layui.upload;
        var layer = layui.layer;
        var element = layui.element;
        var $ = layui.$;
        // 单图片上传
        var uploadInst = upload.render({
            elem: '#ID-upload-fnImg-btn' + sequence,
            url: image, // 实际使用时改成您自己的上传接口即可。
            auto: false,
            bindAction: "#" + buttonID,
            accept: 'file', // 普通文件
            data: {
                "LineID": sessionStorage.getItem("LineID"),
                "PointID": sessionStorage.getItem("PointID"),
                "TaskID": sessionStorage.getItem("TaskID"),
            }, 
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#ID-upload-fn-img' + sequence).attr('src', result); // 图片链接（base64）
                    photo_img.src = result;
                });
            },
            done: function (res) {
                var newDict = {"image": res.response};
                var existingIndex = files_index.findIndex(function(item) {
                    return item.photo !== undefined; 
                });
                if (existingIndex !== -1) {
                    files_index[existingIndex] = newDict;
                }
                else {
                    files_index.push(newDict); 
                }
                narration_contents[2][sequence] = res.data;
            }
        });
    })
}

/**
 * 窗口创建函数
 * @param {String} name 窗口名称
 * @param {[String, String]} area 窗口区域，默认为["300px", "180px"]
 * @param {String|Array<String>} content 窗口内容，可使用双引号对文字添加css，不可使用单引号
 */
function window_set (name, content, area = ["300px", "180px"]) {
    layui.use(function () {
        var contain;
        if (content instanceof Array) {
            contain = '<div style="padding: 32px;text-align: center;">';
            for (var i = 0; i < content.length - 1; i++) {
                contain = contain + content[i] + '<hr>';
            }
            contain = contain + content[content.length - 1] + '</div>';
        }
        else {
            contain = '<div style="padding: 32px;text-align: center;">' + content + '</div>';
        }
        var layer = layui.layer;
        layer.open({
            type: 1,
            area: area,
            title: name,
            shade: 0.6,
            shadeClose: true,
            maxmin: false,
            anim: Math.floor(Math.random() * 6),
            content: contain
        });
    })
}

/**
 * POST快捷函数
 * @param {String} url 上传接口 
 * @param {FormData} params 上传参数
 * @param {function callback(xhr)} callback 回调函数
 */
function xhr_send (url, params, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr);
        }
    }

    xhr.send(params);
}

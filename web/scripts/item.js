let place = document.querySelector("div.main-item");
let infplace = document.querySelector("div.module-frame");
/**Array<type, size, position, url, <title, contain|<question, <options...>, right, grade>>>*/
let items = [];

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

function key_bind () {
    var inputs = document.querySelectorAll("input[type='text']");
    inputs.forEach(input => {
        input.onkeydown = function(event) {
            event = event || window.event;
            if (event.keyCode == 13) {
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

function fresh_form() {
    layui.use('form', function(){
        var form = layui.form;
        form.render();
    });
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
    // 预览加载
    var root_div = SP_load(datas[1], datas[2], id);
    items[id][0] = datas[0];
    items[id][3] = datas[3];
    items[id][4] = [];
    root_div.className = "photo-item";
    // root_div.title = datas[4].split("~!")[0];
    root_div.title = "测试名称";

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
    name_div.style.display = "flex";
    name_div.style.alignItems = "center";
    name_div.style.marginTop = "15px";
    name_div.style.width = "100";

    var title_span = document.createElement("span");
    title_span.className = "title-span";
    title_span.textContent = "图片名称";
    name_div.appendChild(title_span);

    var title = document.createElement("input");
    title.classList = "layui-input input";
    title.type = "text";
    title.name = "图片名称";
    // title.value = datas[4].split("~!")[0];
    // title.placeholder = title.value;
    title.value = "图片测试"
    title.placeholder = "图片测试";
    items[id][4][0] = title.value;
    title.style.border = "none";
    title.style.marginLeft = "15px";
    title.style.width = "65%";
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

    var photo_span = document.createElement("span");
    photo_span.className = "title-span";
    photo_span.textContent = "图片备注";
    remark_div.appendChild(photo_span);

    var textarea = document.createElement("textarea");
    textarea.classList = "layui-textarea photo-remark";
    textarea.id = id;
    textarea.style.resize = "none";
    textarea.style.height = "75px"
    textarea.style.marginLeft = "15px";
    textarea.style.width = "65%";
    // textarea.value = datas[4].split("~!")[1];
    // textarea.placeholder = datas[4].split("~!")[1];
    textarea.value = "空";
    textarea.placeholder = "空";
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
            choose: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#ID-upload-img-img').attr('src', result); // 图片链接（base64）
                    photo_img.src = result;
                });
            },
            done: function (res) {
                layer.msg('上传成功');
                console.log(res);
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
    // root_div.title = datas[4].split("~!")[0];
    root_div.title = "问题测试";

    var question_div = document.createElement("div");
    question_div.classList = "question";
    question_div.style.width = "100%";
    question_div.style.height = "100%";
    question_div.style.backgroundColor = "rgb(240, 240, 240, 0)"

    var text_div = document.createElement("div");
    text_div.className = "text";
    // text_div.textContent = datas[4].split("~!")[1].split("~@")[0];
    text_div.textContent = "问题测试";
    text_div.style.color = "black";
    text_div.style.width = "100%";
    text_div.style.height = "25%";
    text_div.style.setProperty("font-size", "10px", "important");
    question_div.appendChild(text_div);

    var choose_div = document.createElement("div");
    choose_div.className = "form";
    choose_div.style.display = "flex";
    choose_div.style.flexDirection = "column";
    choose_div.style.alignItems = "center";
    choose_div.style.width = "100%";
    choose_div.style.height = "75%";

    var options = [];
    // var optiondata = datas[4].split("~!")[1].split("~@")[0].split("~#");
    // for (var i = 0; i < optiondata.length; i++) {
    //     options.push(optiondata[i]);
    // };
    options = ["测试1", "测试2", "测试3", "测试4"];
    for (var i = 0; i < options.length; i++) {
        var button = document.createElement("button");
        button.type = "button";
        button.classList = "layui-btn choice-button";
        button.style.margin = "0.5%";
        button.style.height = "23%";
        button.style.lineHeight = "0";
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
    root.style.width = "100%";

    var name_div = document.createElement("div");
    name_div.className = "item-name";
    name_div.style.display = "flex";
    name_div.style.alignItems = "center";
    name_div.style.marginTop = "15px";
    name_div.style.width = "100";

    var title_span = document.createElement("span");
    title_span.className = "title-span";
    title_span.textContent = "问题名称";
    name_div.appendChild(title_span);

    var title = document.createElement("input");
    title.classList = "layui-input input";
    title.type = "text";
    title.name = "问题名称";
    // title.value = datas[4].split("~!")[0];
    // title.placeholder = datas[4].split("~!")[0];
    title.value = "问题测试";
    title.placeholder = "问题测试";
    items[id][4][0] = title.value;
    title.style.border = "none";
    title.style.marginLeft = "15px";
    title.style.width = "65%";
    title.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            root_div.title = title.value;
            items[id][4][0] = title.value;
        }
    });
    name_div.appendChild(title);
    root.appendChild(name_div);

    var context_div = document.createElement("div");
    context_div.className = "item-name";
    context_div.style.display = "flex";
    context_div.style.alignItems = "center";
    context_div.style.marginTop = "5px";
    context_div.style.width = "100";

    var context_span = document.createElement("span");
    context_span.className = "title-span";
    context_span.textContent = "问题内容";
    context_div.appendChild(context_span);

    var textarea = document.createElement("textarea");
    textarea.classList = "layui-textarea question-context";
    textarea.style.resize = "none";
    textarea.style.height = "75px"
    textarea.style.marginLeft = "15px";
    textarea.style.width = "65%";
    // textarea.value = datas[4].split("~!")[1].split("~@")[0];
    // textarea.placeholder = datas[4].split("~!")[1].split("~@")[0];
    textarea.value = "问题测试";
    textarea.placeholder = "问题测试";
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

            var option_span = document.createElement("span");
            option_span.className = "title-span";
            option_span.textContent = String.fromCharCode(65 + i) + "选项";
            option_div.appendChild(option_span);

            var input = document.createElement("input");
            input.className = "layui-input input Qname-input";
            input.type = "text";
            input.name = "选项";
            // input.value = datas[4].split("~!")[1].split("~@")[1].split("~#")[i];
            // input.placeholder = input.value;
            input.value = options[i];
            input.placeholder = options[i];
            items[id][4][1][1][i] = input.value;
            input.style.marginLeft = "15%";
            input.style.width = "65%";
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
            })
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
    select_div.style.width = "65%";
    select_div.style.marginLeft = "8%";

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
    // select.selectedIndex = datas[4].split("~!")[1].split("~@")[2];
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
    input.style.width = "65px";
    input.style.marginLeft = "8%";
    input.step = "1";
    // input.value = datas[4].split("~!")[1].split("~@")[3];
    input.value = "0";
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
    root.style.width = "100%";

    var name_div = document.createElement("div");
    name_div.className = "item-name";
    name_div.style.display = "flex";
    name_div.style.alignItems = "center";
    name_div.style.marginTop = "15px";
    name_div.style.width = "100";

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
    title.style.marginLeft = "15px";
    title.style.width = "65%";
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
    textarea.style.resize = "none";
    textarea.style.height = "75px"
    textarea.style.marginLeft = "15px";
    textarea.style.width = "65%";
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
            done: function(res){
                layer.msg('上传成功');
                console.log(res);
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
    root.style.width = "100%";

    var name_div = document.createElement("div");
    name_div.className = "item-name";
    name_div.style.display = "flex";
    name_div.style.alignItems = "center";
    name_div.style.marginTop = "15px";
    name_div.style.width = "100";

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
    title.style.marginLeft = "15px";
    title.style.width = "65%";
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
    textarea.style.resize = "none";
    textarea.style.height = "75px"
    textarea.style.marginLeft = "15px";
    textarea.style.width = "65%";
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
            done: function(res){
                layer.msg('上传成功');
                console.log(res);
            }
        });
      });
}


function AR () {
    layui.use("", function() {
        var layer = layui.layer

        var root = document.createElement("div");
    });
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

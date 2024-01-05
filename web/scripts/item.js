let place = document.querySelector("div.showitem-panel");
let infplace = document.querySelector("div.infplace");

let items = [];
let updata = false;

window.addEventListener("UploadAllItem", function(event) {
    updata = true;
    items.forEach(item => {
        item[2]();
        item[1].upload();
    });
    updata = false;
});

/**
 * size position preload 
 * @param {string} size datas[1] 
 * @param {string} position datas[2]
 * @returns {Element} 
 */
function SP_load(size, position) {
    var obj = document.createElement("div");
    obj.style.position = "absolute";
    obj.style.overflow = "hidden";

    var size = size.split("x");
    var position = position.split("x");

    obj.style.width = size[0] + "%";
    obj.style.height = size[1] + "%";
    obj.style.left = position[0] + "%";
    obj.style.top = position[1] + "%";

    return obj;
}

function itemsClear() {
    items = [];
}

function fresh_form() {
    layui.use('form', function(){
        var form = layui.form;
        form.render();
    });
}

/**
 * 数据更新
 * @param {Number} id 
 * @param {*} item upload.rende的相关配置数据
 */
function update_items(id, item, upload) {
    if (items.length > id) {
        items[id] = [id, item, upload];
    }
    else{
        items.push([id, item, upload]);
    }
}

/** 
 * 图片加载函数 
 * @param {Array} datas
 * @param {Number} id 序号
 */
function photo(datas, id) {
    // 预览加载
    var root_div = SP_load(datas[1], datas[2]);
    root_div.className = "photo_item";
    root_div.title = "测试名称";

    var photo_img = document.createElement("img");
    photo_img.className = "photo";

    photo_img.src = "../images/test.jpg";
    photo_img.style.width = "100%";
    photo_img.style.height = "auto";

    root_div.appendChild(photo_img);

    place.appendChild(root_div);

    // 编辑栏加载
    var root = document.createElement("div");
    root.classList = "photo_option item";

    var title = document.createElement("input");
    title.className = "layui-input input";
    title.type = "text";
    title.name = "图片名称";
    title.placeholder = "测试名称";
    title.style.border = "none";
    root.appendChild(title);

    var push_div = document.createElement("div");
    push_div.className = "push-photo";

    var button = document.createElement("button");
    button.type = "button";
    button.classList = "layui-btn push-button";
    button.id = "ID-upload-img-btn";
    button.innerHTML = '<i class="layui-icon layui-icon-upload"></i> 图片上传';
    push_div.appendChild(button)

    var box = document.createElement("div");
    box.className = "box";

    var div_load = document.createElement("div");
    div_load.classList = "layui-upload-list upload-list";
    var img = document.createElement("img");
    img.classList = "layui-upload-img upload-img";
    img.id = "ID-upload-img-img";
    img.src = "../images/test.jpg";
    div_load.appendChild(img);
    var div_text = document.createElement("div");
    div_text.id = "ID-upload-img-text";
    div_load.appendChild(div_text);
    box.appendChild(div_load);

    var lay_filter = document.createElement("div");
    lay_filter.classList = "layui-progress layui-progress-big progress";
    lay_filter.setAttribute("lay-showPercent", "yes");
    lay_filter.setAttribute("lay-filter", "filter-demo");
    var demo_bar = document.createElement("div");
    demo_bar.className = "layui-progress-bar";
    demo_bar.setAttribute("lay-percent", "");
    lay_filter.appendChild(demo_bar);
    box.appendChild(lay_filter);

    push_div.appendChild(box);
;
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
            url: '', // 实际使用时改成您自己的上传接口即可。
            before: function (obj) {
                var demoText = $('#ID-upload-img-text');
                demoText.html('');
                element.progress('filter-demo', '0%');

                // 预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) {
                    $('#ID-upload-img-img').attr('src', result); // 图片链接（base64）
                });
    
                function upload() {
                    element.progress('filter-demo', '0%'); // 进度条复位
                }

                update_items(id, uploadInst, upload);

                if (updata === false){
                    return false;
                }
                else{
                    return true;
                }
            },
            done: function (res) {
                // 若上传失败
                if (res.code > 0) {
                }
                // 上传成功的一些操作
                // …
                $('#ID-upload-img-text').html(''); // 置空上传失败的状态
            },
            error: function () {
                // 演示失败状态，并实现重传
                var demoText = $('#ID-upload-img-text');
                demoText.html('<span style="color: #FF5722;">上传失败</span>');
            },
            // 进度条
            progress: function (n, elem, e) {
                element.progress('filter-demo', n + '%'); // 可配合 layui 进度条元素使用
                if (n == 100) {
                    layer.msg('上传完毕', { icon: 1 });
                }
            }
        });
    })

}

/** 
 * 问题加载函数 
 * @param {Array} datas
 * @param {Number} id 序号
 */
function question(datas, id) {
    // 预览加载
    var root_div = SP_load(datas[1], datas[2]);
    root_div.className = "question_item";
    root_div.title = "问题测试";

    var question_div = document.createElement("div");
    question_div.classList = "layui-panel question";
    question_div.style.width = "100%";
    question_div.style.height = "100%";
    question_div.style.backgroundColor = "rgb(240, 240, 240)"

    var text_div = document.createElement("div");
    text_div.className = "text";
    text_div.style.padding = "10%";
    text_div.textContent = "问题测试";
    question_div.appendChild(text_div);

    var choose_div = document.createElement("div");
    choose_div.className = "layui-form";
    choose_div.style.display = "flex";

    // test 3可修改,选项也可修改
    var options = ["选项1", "选项2", "选项3"]
    for (var i = 0; i < 3; i++) {
        var choose_input = document.createElement("input");
        choose_input.className = "choice";
        choose_input.type = "radio";
        choose_input.name = "选项";
        choose_input.value = i;
        choose_input.title = options[i];
        choose_div.appendChild(choose_input);
    }

    question_div.appendChild(choose_div);

    root_div.appendChild(question_div);

    place.appendChild(root_div);
    
    // 编辑栏加载
    var root = document.createElement("div");
    root.classList = "photo_option item";

    var title = document.createElement("input");
    title.className = "layui-input input";
    title.type = "text";
    title.name = "问题名称";
    title.placeholder = "问题测试";
    title.style.border = "none";
    root.appendChild(title);

    var div = document.createElement("div");
    div.className = "Qbox";
    div.style.padding = "5%";
    for (var i = 0; i < 3; i++) {
        (function(i){
            var input = document.createElement("input");
            input.className = "layui-input input Qname-input";
            input.type = "text";
            input.name = "选项";
            input.value = options[i];
            input.onkeydown = function(event) {
                event = event || window.event;
		            if (event.keyCode == 13) {
                        options[i] = input.value;
                        var choices = document.querySelectorAll("input.choice");
                        choices[i].title = options[i];
                        var option = document.querySelectorAll("option");
                        option[i].textContent = options[i];
                        fresh_form();
                    } 
            }
            div.appendChild(input);
        })(i);
    }

    var right_div = document.createElement("div");
    right_div.className = "rightgrade";
    var text = document.createElement("div");
    text.className = "textContent";
    text.innerHTML = "正确答案";
    right_div.appendChild(text);
    var select_div = document.createElement("div")
    select_div.className = "layui-col-md6 optionbox";
    var select = document.createElement("select");
    for (var i = 0; i < 3; i++) {
        (function(i){
            var option = document.createElement("option");
            option.value = i;
            option.textContent = options[i];
            select.appendChild(option);
        })(i);
    }
    select_div.appendChild(select);
    right_div.appendChild(select_div);
    var text = document.createElement("div");
    text.className = "textContent";
    text.innerHTML = "获得分数";
    right_div.appendChild(text);
    var input = document.createElement("input");
    input.classList = "layui-input gradeinput";
    input.type = "number";
    input.setAttribute("lay-affix", "number");
    input.step = "1";
    input.value = "0";
    input.title = "请输入整数";
    right_div.appendChild(input);

    div.appendChild(right_div);
    root.appendChild(div);

    infplace.appendChild(root);
}


let place = document.querySelector("div.showitem-panel");
let infplace = document.querySelector("div.infplace");

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

/** 
 * 图片加载函数 
 * @param {Array} datas
 */
function photo(datas) {
    var root_div = SP_load(datas[1], datas[2]);
    root_div.className = "photo_item";

    var photo_img = document.createElement("img");
    photo_img.className = "photo";

    photo_img.src = "../images/test.jpg";
    photo_img.style.width = "100%";
    photo_img.style.height = "auto";

    root_div.appendChild(photo_img);

    place.appendChild(root_div);


    var root = document.createElement("div");
    root.className = "photo_option";

    var title = document.createElement("input");
    title.className = "layui-input";
    title.type = "text";
    title.name = "图片名称";
    title.placeholder = "测试名称";
    title.style.border = "none";
    root.appendChild(title);

    var push_div = document.createElement("div");
    push_div.className = "push-photo";




    root.appendChild(push_div);

    infplace.appendChild(root);

}

/** 
 * 问题加载函数 
 * @param {Array} datas
 */
function question(datas) {
    var root_div = SP_load(datas[1], datas[2]);
    root_div.className = "question_item";

    var question_div = document.createElement("div");
    question_div.classList.add("layui-panel");
    question_div.classList.add("question");
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

    for (var i = 0; i < 3; i++) {
        var choose_input = document.createElement("input");
        choose_input.type = "radio";
        choose_input.name = "选项";
        choose_input.value = i;
        choose_input.title = "选项" + (i + 1).toString();
        choose_div.appendChild(choose_input);
    }

    question_div.appendChild(choose_div);

    root_div.appendChild(question_div);

    place.appendChild(root_div);
    
}
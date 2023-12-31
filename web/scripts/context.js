document.addEventListener('DOMContentLoaded', function() {
    
    let MainLine = document.querySelector("div.container");

    // 更新数据接收
    this.addEventListener("message", function(event) {
        if (event.data.action === "load-context") {
            drama_load(event.data.states);
        }
    })

    this.addEventListener("resetDrama", function(event) {
        load_storage();
    })

    // 加载缓存
    function load_storage() {
        if(sessionStorage.getItem("cacheDrama-contained")) {
            drama_load(JSON.parse(sessionStorage.getItem("cacheDrama-contained")));
        }
        else if(sessionStorage.getItem("drama-contained")) {
            drama_load(JSON.parse(sessionStorage.getItem("drama-contained")));
        }
    }

    /**
     * 剧本数据大纲加载显示函数
     * @param {Array<Array>} data  数据列表，每个列表中包含了页面名称，页面数据，以及页面数据获取地址
     */
    function drama_load(data) {
        for(var i = 0; i < data.length; i++){
            (function(i){
                var div = document.createElement("div");
                div.classList = "layui-colla-item item";

                // var page = document.createElement("a");
                // page.className = "a-page";
                // page.textContent = data[i][0];
                // page.href = "none";
                // page.onclick = function() {
                //     window.parent.postMessage({action: "page-load", datafrom: data[i][2]}, "*");
                //     return false;
                // }
                // div.appendChild(page);
                var div_title = document.createElement("div");
                div_title.classList = "layui-colla-title head";
                div_title.innerHTML = data[i][0];
                div.appendChild(div_title);

                var div_contain = document.createElement("div");
                div_contain.classList = "layui-colla-content body";
                var contains = data[i][1].split("|");
                contains.forEach(data => {
                    var b = document.createElement("div");
                    b.innerHTML = data;
                    div_contain.appendChild(b);
                });
                var div_button = document.createElement("button");
                div_button.className = "choose";
                div_button.innerHTML = "查看修改";
                div_button.onclick = function() {
                    window.parent.postMessage({action: "page-load", datafrom: data[i][2]}, "*");
                }
                div_contain.appendChild(div_button);
                div.appendChild(div_contain);
                
                MainLine.appendChild(div);
            })(i);}

        layui.use('element', function(){
            var element = layui.element;
            element.init();
        });
    }
    
    load_storage();

    var data = [["你好", "1|2|3|4|5", "none"], ["你好", "1|2|3|4|5", "none"], ["你好", "1|2|3|4|5", "none"]];

    for(var i = 0; i < data.length; i++){
        (function(i){
            var div = document.createElement("div");
            div.classList = "layui-colla-item item";
            var div_title = document.createElement("div");
            div_title.classList = "layui-colla-title head";
            div_title.innerHTML = data[i][0];
            div.appendChild(div_title);

            var div_contain = document.createElement("div");
            div_contain.classList = "layui-colla-content body";
            var contains = data[i][1].split("|");
            contains.forEach(data => {
                var b = document.createElement("div");
                b.innerHTML = data;
                div_contain.appendChild(b);
            });
            var div_button = document.createElement("button");
            div_button.className = "choose";
            div_button.innerHTML = "查看修改";
            div_button.onclick = function() {
                window.parent.postMessage({action: "page-load", datafrom: data[i][2]}, "*");
            }
            div_contain.appendChild(div_button);
            div.appendChild(div_contain);
            
            MainLine.appendChild(div);
        })(i);}

    layui.use('element', function(){
        var element = layui.element;
        element.init();
    });

})
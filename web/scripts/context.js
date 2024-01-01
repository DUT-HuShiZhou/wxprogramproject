document.addEventListener('DOMContentLoaded', function() {
    const pageloadEvent = new CustomEvent("pageload")

    let MainLine = document.querySelector("div.context-Line");

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

    // 剧本加载主函数
    function drama_load(data) {
        for(var i = 0; i < data.length; i++){
            (function(i){
                var div = document.createElement("div");
                div.className = "page-head";

                var page = document.createElement("a");
                page.className = "a-page";
                page.textContent = data[i][0];
                page.href = "none";
                page.onclick = function() {
                    window.parent.postMessage({action: "page-load", datafrom: data[i][2]}, "*");
                    return false;
                }
                div.appendChild(page);

                var div_contain = document.createElement("div");
                div_contain.className = "page-contain";
                var contains = data[i][1].split("|");
                for (var a = 0; a < contains.length; a++){
                    var b = document.createElement("div");
                    b.innerHTML = contains[a];
                    div_contain.appendChild(b);
                }
                div_contain.style.display = "none";
                div.appendChild(div_contain);

                div.addEventListener("contextmenu", function(event) {
                    event.preventDefault();

                    if (event.button === 2) {
                        var pages = document.querySelectorAll("a.a-page");
                    for (var i = 0; i < pages.length; i++){
                        pages[i].style.display = "none";
                    }
                    page.style.display = "block";
                    page.style.position = "fixed";
                    page.style.top = "0";
                    page.style.left ="calc(50% - " + (page.offsetWidth / 2) + "px)"; // 计算位置中间值
                    div_contain.style.display = "flex";
                    }
                })

                div.onmouseleave = function() {
                    var pages = document.querySelectorAll("a.a-page");
                    for (var i = 0; i < pages.length; i++){
                        pages[i].style.display = "block";
                    }
                    page.style.removeProperty("position");
                    page.style.removeProperty("top");
                    page.style.removeProperty("left");
                    div_contain.style.display = "none";
                }
                
                MainLine.appendChild(div);
            })(i);
        }
    }

    data = ["你好", "1|2|3|4|5", "none"];

    var div = document.createElement("div");
                div.className = "page-head";

                var page = document.createElement("a");
                page.className = "a-page";
                page.textContent = data[0];
                page.href = "none";
                page.onclick = function() {
                    // window.parent.postMessage({action: "page-load", datafrom: data[2]}, "*");

                    //test 
                    window.parent.postMessage({action: "page-load"}, "*");

                    return false;
                }
                div.appendChild(page);

                var div_contain = document.createElement("div");
                div_contain.className = "page-contain";
                var contains = data[1].split("|");
                for (var a = 0; a < contains.length; a++){
                    var b = document.createElement("div");
                    b.innerHTML = contains[a];
                    div_contain.appendChild(b);
                }
                div_contain.style.display = "none";
                div.appendChild(div_contain);

                div.addEventListener("contextmenu", function(event) {
                    event.preventDefault();

                    if (event.button === 2) {
                        if (div_contain.style.display === "none") {
                            var pages = document.querySelectorAll("a.a-page");
                            for (var i = 0; i < pages.length; i++){
                                pages[i].style.display = "none";
                            }
                            page.style.display = "block";
                            page.style.position = "fixed";
                            page.style.top = "0";
                            page.style.left ="calc(50% - " + (page.offsetWidth / 2) + "px)"; // 计算位置中间值
                            div_contain.style.display = "flex";
                        }
                        else {
                            var pages = document.querySelectorAll("a.a-page");
                            for (var i = 0; i < pages.length; i++){
                                pages[i].style.display = "block";
                            }
                            page.style.removeProperty("position");
                            page.style.removeProperty("top");
                            page.style.removeProperty("left");
                            div_contain.style.display = "none";
                        }
                    }
                })
                
                MainLine.appendChild(div);

    load_storage();
})
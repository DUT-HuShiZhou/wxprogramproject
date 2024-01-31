document.addEventListener('DOMContentLoaded', function() {
    let urlParams = new URLSearchParams(window.location.search);
    let un = urlParams.get("un");
    sessionStorage.setItem("un", un);

    const links = document.querySelectorAll(".page");
    let iframe = document.querySelector("iframe.main-ifm");
    let btn = document.getElementById("out-button");
    
    layui.use(function () {
        var layer = layui.layer;
        var $ = layui.$;
        layer.open({
            type: 1,
            shade: false, // 不显示遮罩
            skin: 'circular-popup',
            offset: ["50px", "50px"],
            closeBtn: 0,
            title: "移动",
            area: ['80px', '80px'],
            content: $('#circle-layer-wrapper'), // 捕获的元素
            end: function(){
              // layer.msg('关闭后的回调', {icon:6});
            }
          });
    });

    var selector = document.querySelector("div.layui-layer-wrap");
    selector.addEventListener("click", function () {
        var circular_popup = document.querySelector("div.circular-popup");
        circular_popup.classList.add("open");
        var circle_page = document.querySelector("div.layui-layer-content");
        circle_page.classList.add("open");
        var sidebar = document.querySelector("div.selectbar");
        sidebar.style.display = "block";
    });
    selector.addEventListener("mouseleave", function () {
        var circular_popup = document.querySelector("div.circular-popup");
        circular_popup.classList.remove("open");
        var circle_page = document.querySelector("div.layui-layer-content");
        circle_page.style.height = "60px";
        var sidebar = document.querySelector("div.selectbar");
        sidebar.style.display = "none";
    });

    if (sessionStorage.getItem("present-page") != null) {
        iframe.src = sessionStorage.getItem("present-page");
    }
    else{
        iframe.src = "first.html";
    }

    document.addEventListener("keydown", function(event){
        if(event.key === "Escape") {
            var i;
        }
    })

    links.forEach(link => {
        link.onclick = function () {
            iframe.src = link.getAttribute("href");
            sessionStorage.setItem("present-page", link.getAttribute("href"));
            return false;
        }
    });

    btn.onclick = function() {
        window.location.href = "checkin.html";
    };
});
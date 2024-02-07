document.addEventListener('DOMContentLoaded', function() {
    let ifm_fram = document.querySelector(".line-choose-ifm");

    var xhr = new XMLHttpRequest();
    var url = "/searchRoute";

    const uploadItemEvent = new CustomEvent("UploadAllItem");

    window.addEventListener("message", function(event) {
        if (event.data.action === "drama-line-loaded") {
            layui.use(function(){
                layer.open({
                    type: 2,
                    title: false,
                    area: ['90vw', '90vh'],
                    content: '../htmls/context.html',
                    fixed: false, // 不固定
                    maxmin: false,
                    shadeClose: false,
                });
            });
        }
    }, false);

    ifm_fram.src = "drama-line.html?choose=1;test";
    xhr.open("POST", url, true);
    var params = new FormData();
    params.append("type", "lines");
    params.append("un", sessionStorage.getItem("un"));

    xhr.onreadystatechange =  function() {
        if(xhr.readyState === 4){
            var data = xhr.responseText;
            // ifm.src = "drama-line.html?choose=" + data;
            ifm.style.backgroundColor = "white";
            ls.style.display = "block";
        }
    };
    
    xhr.send(params);
})
document.addEventListener('DOMContentLoaded', function() {
    const interval = 10000;//数据刷新时间间隔ms

    let no = document.querySelector("span.num-online");
    let mno = document.querySelector("span.mnum-online");
    let mnf = document.querySelector("span.mnum-finish");

    var xhr = new XMLHttpRequest();
    var url = "";
    xhr.open("POST", url, true);

    var params = new FormData();
    params.append("un", sessionStorage.getItem("un"));
    params.append("type", "name");

    xhr.onreadystatechange = function() {
        if (xhr.responseText.split(":")[0] === "name") {
            let name = document.querySelector("p.name");
            name.textContent = xhr.responseText.split(":")[1] + ", 你好"; 
        }
        else if (xhr.responseText.split(":")[0] === "onlinedata") {
            let datas = xhr.responseText.split(":")[1].split(";");
            no.textContent = datas[0];
            mno.textContent = datas[1];
            mnf.textContent = datas[2];
        }
    };

    xhr.send(params);

    function sendpost() {
        xhr.open("POST", url, true);
        var params = new FormData();

        params.append("un", sessionStorage.getItem("un"));
        params.append("type", "onlinedata");

        xhr.send(params);
    }

    const timer = setInterval(sendpost, interval);
});
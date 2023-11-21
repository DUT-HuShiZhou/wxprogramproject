document.addEventListener("DOMContentLoaded", function() {
    let sl = document.querySelector("button.sl-btn");
    let sp = document.querySelector("button.sp-btn");

    let table = document.querySelector("table.gradesTable");
    let operate = document.querySelector("table.operateTable");
    table.innerHTML = "";
    operate.innerHTML = "";

    let container = document.querySelector("nav.container");

    var xhr = new XMLHttpRequest();
    var url = "/searchRoute";

    sl.onclick = function() {
        let ifm = document.querySelector("iframe.line-ifm");
        let ls = document.querySelector("div.line-show");
        
        if (ifm.src != "about:blank") {
            ifm.src = "about:blank";
            ifm.style.backgroundColor = null;
            ls.style.display = "none";
        }
        else {
            xhr.open("POST", url, true);
            var params = new FormData();
            params.append("un", sessionStorage.getItem("un"));
            params.append("type", "lines");

            xhr.onreadystatechange =  function() {
                var data = xhr.responseText;
                ifm.src = "drama-line.html?revise=" + data;
                ifm.style.backgroundColor = "white";
                ls.style.display = "block";
            };

            xhr.send(params);
        }
    };

    sp.onclick = function() {
        if (table.hasChildNodes()) { // 检查是否存在子元素
            table.innerHTML = "";
            operate.innerHTML = "";
        }

        else {
            var rowHeader = table.insertRow();
            var pointnum = rowHeader.insertCell();
            pointnum.innerHTML = "<p>点位<p>";
            var Latitude = rowHeader.insertCell();
            Latitude.innerHTML = "<p>经度<p>";
            var Longitude = rowHeader.insertCell();
            Longitude.innerHTML = "<p>纬度<p>";
            var Deletebtn = rowHeader.insertCell();
            Deletebtn.innerHTML = "<p>操作<p>";

            var rowBottom = operate.insertRow();
            var Cancel = rowBottom.insertCell();
            Cancel.className = "operate";
            var btn = document.createElement("button");
            btn.textContent = "取消";
            btn.className = "Cancel";
            Cancel.appendChild(btn);
            var addPoint = rowBottom.insertCell();
            addPoint.className = "operate";
            var btn = document.createElement("button");
            btn.textContent = "添加点位";
            btn.className = "addPoint";
            addPoint.appendChild(btn);
            var Confirm = rowBottom.insertCell();
            Confirm.className = "operate";
            var btn = document.createElement("button");
            btn.textContent = "确认";
            btn.className = "Confirm";
            Confirm.appendChild(btn);

            let cancel = document.querySelector("button.Cancel");
            cancel.onclick = function() {
                table.innerHTML = "";
                operate.innerHTML = "";
            };

            let add = document.querySelector("button.addPoint");
            add.onclick = function() {
                var rowPoint = table.insertRow();

                var nums = table.getElementsByTagName("tr");

                var num = rowPoint.insertCell();
                num.innerHTML = nums.length - 1;
                var latitude = rowPoint.insertCell();
                var input = document.createElement("input");
                input.className = "latitude";
                latitude.appendChild(input);
                var longitude = rowPoint.insertCell();
                var input = document.createElement("input");
                input.className = "longitude";
                longitude.appendChild(input);
                var deletebtn = rowPoint.insertCell();
                var btn = document.createElement("button");
                btn.textContent = "删除";
                deletebtn.appendChild(btn);
            };

            let sure = document.querySelector("button.Confirm");
            sure.onclick = function() {
                var nums = table.getElementsByTagName("tr");
                nums = nums.length - 1
                if (nums > 0) {
                    var name = prompt("请输入路线名称");
                    var params = new FormData();
                    params.append("un", sessionStorage.getItem("un"));
                    params.append("routename", name);
                    params.append("pointNum")

                    var latitudes = table.querySelectorAll("input.latitude");
                    var longitudes = table.querySelectorAll("input.longitude");
                    for (var i = 0; i < nums; i++) {
                        params.append(i + 1, longitudes[i] + "|" + latitudes[i]);
                    }

                    xhr.open("POST", "/createNewRoute", true);

                    xhr.send(params);
                }
                else {
                    alert("警告：添加的点位数量不能为空！");
                }
            };
        }
    };
})
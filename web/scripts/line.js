document.addEventListener("DOMContentLoaded", function() {
    let sl = document.querySelector("button.sl-btn");
    let sp = document.querySelector("button.sp-btn");
    let ifm = document.querySelector("iframe.line-ifm");
    let ls = document.querySelector("div.line-show");
    let Plist = document.querySelector(".PList");

    let mainplace = document.querySelector("div.mainplace");

    let table = document.querySelector("table.gradesTable");
    let operate = document.querySelector("table.operateTable");
    
    const resetPointsEvent = new CustomEvent("resetPoints", {detail: {id: "resetPoints"}});

    function clear () {
        ifm.style.display = "none";
        mainplace.style.display = "none";
        table.style.display = "none";
        operate.style.display = "none";
        ifm.src = "about:blank";
        ifm.style.backgroundColor = null;
        ls.style.display = "none";
        table.innerHTML = "";
        operate.innerHTML = "";
    }

    this.addEventListener("PointsLoaded", function(event){
        if(event.detail.id === "loadNum"){
            var points = JSON.parse(sessionStorage.getItem("points"));

            for(var i = 0; i < points.length; i++){
                (function (index) {
                var newRow = Plist.insertRow();
                newRow.className = "PO";
                
                var buttonCell = newRow.insertCell();
                buttonCell.className = "PO1";
                var buttoncontainer = document.createElement("div");
                var bnext = document.createElement("button");
                var bbefore = document.createElement("button");
                bnext.classList.add("Next");
                bnext.classList.add(String(i + 1));
                bnext.textContent = "▼";
                bbefore.classList.add("Before");
                bbefore.classList.add(String(i + 1));
                bbefore.textContent = "▲";
                buttoncontainer.appendChild(bbefore);
                buttoncontainer.appendChild(bnext);
                buttonCell.appendChild(buttoncontainer);
                
                var nameCell = newRow.insertCell();
                nameCell.classList.add("PO2");
                nameCell.innerHTML = points[i][2];

                bbefore.onclick = function() {
                    var rowIndex = parseInt(bbefore.classList[1]);
                    var PO2 = document.querySelectorAll(".PO2");
                    var change = PO2[rowIndex].textContent;
                    PO2[rowIndex].textContent = PO2[rowIndex - 1].textContent;
                    PO2[rowIndex - 1].textContent = change;
                };
                bnext.onclick = function() {
                    var rowIndex = parseInt(bnext.classList[1]);
                    var PO2 = document.querySelectorAll(".PO2");
                    var change = PO2[rowIndex].textContent;
                    PO2[rowIndex].textContent = PO2[rowIndex + 1].textContent;
                    PO2[rowIndex + 1].textContent = change;
                };
            })(i);
            }

            BNbtnDisplace();
        }
    })
    
    clear();

    mainplace.style.display = "flex";

    var xhr = new XMLHttpRequest();
    var url = "/searchRoute";

    sl.onclick = function() {
        if (ifm.src != "about:blank") {
            clear();
            mainplace.style.display = "flex";
        }
        else {
            clear()
            ifm.style.display = "block";

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
            clear();
            mainplace.style.display = "flex";
        }

        else {
            clear();
            table.style.display = "table";
            operate.style.display = "table";
            var rowHeader = table.insertRow();
            var pointnum = rowHeader.insertCell();
            pointnum.innerHTML = "<p>点位<p>";
            var Longitude = rowHeader.insertCell();
            Longitude.innerHTML = "<p>经度<p>";
            var Latitude = rowHeader.insertCell();
            Latitude.innerHTML = "<p>纬度<p>";
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
                clear();
            };

            let add = document.querySelector("button.addPoint");
            add.onclick = function() {
                var rowPoint = table.insertRow();

                var nums = table.getElementsByTagName("tr").length;

                var num = rowPoint.insertCell();
                num.innerHTML = nums - 1;
                var longitude = rowPoint.insertCell();
                var input = document.createElement("input");
                input.className = "longitude";
                longitude.appendChild(input);
                var latitude = rowPoint.insertCell();
                var input = document.createElement("input");
                input.className = "latitude";
                latitude.appendChild(input);
                var deletebtn = rowPoint.insertCell();
                var btn = document.createElement("button");
                btn.textContent = "删除";
                
                btn.onclick = function() {
                    var tbody = table.getElementsByTagName("tbody")[0];
                    tbody.removeChild(rowPoint);

                    var lines = table.getElementsByTagName("tr");
                    for (var i = 1; i < lines.length; i++){
                        var cell = lines[i].getElementsByTagName("td")[0];
                        cell.innerHTML = i;
                    }
                };

                deletebtn.appendChild(btn);
            };

            let sure = document.querySelector("button.Confirm");
            sure.onclick = function() {
                var nums = table.getElementsByTagName("tr").length;
                nums = nums - 1
                if (nums > 0) {
                    var name = prompt("请输入路线名称");
                    var params = new FormData();
                    params.append("un", sessionStorage.getItem("un"));
                    params.append("routename", name);
                    params.append("pointNum", nums);

                    var longitudes = table.querySelectorAll("input.longitude");
                    var latitudes = table.querySelectorAll("input.latitude");
                    for (var i = 0; i < nums; i++) {
                        params.append(i + 1, longitudes[i].value + "|" + latitudes[i].value);
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

    function BNbtnDisplace () {
        var btns = document.querySelectorAll(".Before");
        btns[0].style.display = "none";

        var btns = document.querySelectorAll(".Next");
        btns[btns.length - 1].style.display = "none";
    }
})
document.addEventListener("DOMContentLoaded", function() {
    let sl = document.querySelector("button.sl-btn"); // 路线选择按钮
    let sp = document.querySelector("button.sp-btn"); // 路线创建按钮
    let freshmapbtn = document.querySelector("button.freshmap-btn"); // 刷新地图按钮    
    let addp = document.querySelector("button.addpoint-btn"); // 点位添加按钮
    let clearcache = document.querySelector("button.clearcache-btn"); // 清楚缓存按钮

    let SP_option = document.querySelector("button.SP-options"); // 点位选择按钮
    let SP_sure = document.querySelector("button.SP-Sure"); // 点位确定按钮
    let SP_reget = document.querySelector("button.SP-Reget"); // 点位重置按钮
    let SP_delete = document.querySelector("button.SP-Delete"); // 点位删除按钮
    let SP_cancer = document.querySelector("button.SP-Cancer"); // 取消操作按钮

    let ifm = document.querySelector("iframe.line-ifm"); // 嵌入框架iframe
    let ls = document.querySelector("div.line-show"); // 路线选择块
    let Plist = document.querySelector(".PList"); // 点位顺序表格

    let mainplace = document.querySelector("div.mainplace"); // 地图块

    let refreshbtn = document.querySelector("button.refreshPoints"); // 确定点位顺序操作按钮
    let reloadbtn = document.querySelector("button.reloadPoints"); // 重置点位顺序操作按钮
    let sendbtn = document.querySelector("button.sendPointsMS"); // 发送点位顺序操作按钮

    let table = document.querySelector("table.gradesTable"); // 路线创建表格 
    let operate = document.querySelector("table.operateTable"); // 路线创建操作表格
    
    const resetPointsEvent = new CustomEvent("resetPoints", {detail: {id: "resetPoints"}}); // 重新设置点位事件

    // 清除工作区显示函数
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

    // 路线加载完毕响应函数
    this.addEventListener("PointsLoaded", function(event){
        if(event.detail.id === "loadNum"){
            if (sessionStorage.getItem("cachePoints")){
                var points = JSON.parse(sessionStorage.getItem("cachePoints"));
            }
            else{
                var points = JSON.parse(sessionStorage.getItem("points"));
            }
            Plist.innerHTML = ""
            var headRow = Plist.insertRow();
            headRow.className = "PO";

            var PO1 = headRow.insertCell();
            PO1.className = "PO1";
            PO1.innerHTML = "操作";

            var PO2 = headRow.insertCell();
            PO2.className = "PO2";
            PO2.innerHTML = "名称";

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
            clear();
 
            mainplace.style.display = "flex";
        }
    })

    // 点位选择响应函数
    this.addEventListener("PointSelected", function(event){
        SP_set();
    })
    
    // 默认显示地图块
    clear();
    mainplace.style.display = "flex";

    var xhr = new XMLHttpRequest();
    var url = "/searchRoute";

    // 路线选择按钮触发函数
    sl.onclick = function() {
        // 切换显示检测
        if (ifm.src != "about:blank") {
            clear();
            mainplace.style.display = "flex";
        }
        else {
            clear()
            ifm.style.display = "block";

            //向服务端发送POST请求
            xhr.open("POST", url, true);
            var params = new FormData();
            params.append("un", sessionStorage.getItem("un"));
            params.append("type", "lines");

            xhr.onreadystatechange =  function() {
                // 处理返回数据，发送给drama-line嵌入页面加载数据
                var data = xhr.responseText;
                ifm.src = "drama-line.html?revise=" + data;
                ifm.style.backgroundColor = "white";
                ls.style.display = "block";
            };

            xhr.send(params);
        }
    };

    // 路线创建按钮触发函数
    sp.onclick = function() {
        if (table.hasChildNodes()) { // 检查是否存在子元素
            clear();
            mainplace.style.display = "flex";
        }

        else {
            clear();
            table.style.display = "table";
            operate.style.display = "table";

            // 表格头
            var rowHeader = table.insertRow();
            var pointnum = rowHeader.insertCell();
            pointnum.innerHTML = "<p>点位<p>";
            var Longitude = rowHeader.insertCell();
            Longitude.innerHTML = "<p>纬度<p>";
            var Latitude = rowHeader.insertCell();
            Latitude.innerHTML = "<p>经度<p>";
            var Name = rowHeader.insertCell();
            Name.innerHTML = "<p>名称<p>";
            var Description = rowHeader.insertCell();
            Description.innerHTML = "<p>描述<p>"
            var Deletebtn = rowHeader.insertCell();
            Deletebtn.innerHTML = "<p>操作<p>";

            // 操作表格
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
                mainplace.style.display = "flex";
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
                var name = rowPoint.insertCell();
                var input = document.createElement("input");
                input.className = "pointname";
                name.appendChild(input);
                var description = rowPoint.insertCell();
                var input = document.createElement("input");
                input.className = "description";
                description.appendChild(input);
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
                    var pointnames = table.querySelectorAll("input.pointname");
                    var descriptions = table.querySelectorAll("input.description");
                    for (var i = 0; i < nums; i++) {
                        params.append(i + 1, longitudes[i].value + "|" + latitudes[i].value + "|" + pointnames[i].value + "|" + descriptions[i].value);
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

    freshmapbtn.onclick = function() {
        document.dispatchEvent(resetPointsEvent);
    }

    addp.onclick = function() {
        if(sessionStorage.getItem("points")){
            var longitude = prompt("请输入经度");
            var latitude = prompt("请输入维度");
            var name = prompt("请输入名称");
            var description = prompt("请输入点位描述信息");
            var newpoint = [parseInt(longitude), parseInt(latitude), name, description];
            var points = []

            if(sessionStorage.getItem("cachePoints")){
                points = JSON.parse(sessionStorage.getItem("cachePoints"));
                points.push(newpoint);
            }
            else{
                points = JSON.parse(sessionStorage.getItem("points"));
                points.push(newpoint);
            }
            sessionStorage.setItem("cachePoints", JSON.stringify(points));
            document.dispatchEvent(resetPointsEvent);
        }
        else{
            alert("未检测到点位数据，无法对未知路线添加点位");
        }
    }

    clearcache.onclick = function() {
        sessionStorage.removeItem("cachePoints");
        sessionStorage.removeItem("SP");
    }

    SP_option.onclick = function() {
        var computedColor = window.getComputedStyle(SP_option).color;
    
        if (computedColor === "rgb(0, 0, 0)" && sessionStorage.getItem("SP")) {
            var optionBlock = document.querySelector("div.OptionBlock");
            optionBlock.style.display = "block";
            SP_option.style.color = "red";
        } 
        else if (sessionStorage.getItem("SP")) {
            var optionBlock = document.querySelector("div.OptionBlock");
            optionBlock.style.display = "none";
            SP_option.style.color = "black";
        } 
        else {
            alert("您没有选择具体的点位，无法进行此操作");
        }
    }

    SP_sure.onclick = function() {
        var newpoint = [];
        var SPlongi = document.querySelector("input.SP-longitude");
        newpoint.push(SPlongi.value);
        var SPlati = document.querySelector("input.SP-latitude");
        newpoint.push(SPlati.value);
        var SPname = document.querySelector("input.SP-name");
        newpoint.push(SPname.value);
        var SPdescr = document.querySelector("input.SP-description");
        newpoint.push(SPdescr.value);
        var points = []
        var i = sessionStorage.getItem("SP");
        if (sessionStorage.getItem("cachePoints")){
            points = JSON.parse(sessionStorage.getItem("cachePoints"));
        }
        else{
            points = JSON.parse(sessionStorage.getItem("points"));
        }
        points[i] = newpoint;
        sessionStorage.setItem("cachePoints", JSON.stringify(points));
        alert("信息以进行临时缓存，如要上传至服务器，请点击保存按钮操作");
        document.dispatchEvent(resetPointsEvent);
    }

    SP_reget.onclick = function() {
        SP_set();
    }

    SP_delete.onclick = function() {
        var result = confirm("此选项将暂时删除该点数据(点击“点位顺序切换”栏中的重置即可恢复)，如果要确认此行为，请点击保存上传至服务器，即可更新本地数据，再次确认是否删除？");
        if (result){
            var points = []
            var i = sessionStorage.getItem("SP");
            if (sessionStorage.getItem("cachePoints")){
                points = JSON.parse(sessionStorage.getItem("cachePoints"));
            }
            else{
                points = JSON.parse(sessionStorage.getItem("points"));
            }
            points.splice(i, 1);
            sessionStorage.setItem("cachePoints", JSON.stringify(points));
            document.dispatchEvent(resetPointsEvent);
        }
    }

    SP_cancer.onclick = function() {
        var SPnum = document.querySelector("span.SP-num");
        SPnum.textContent = "";
        var SPname = document.querySelector("input.SP-name");
        SPname.value = "";
        var SPdescr = document.querySelector("input.SP-description");
        SPdescr.value = "";
        var SPlongi = document.querySelector("input.SP-longitude");
        SPlongi.value = "";
        var SPlati = document.querySelector("input.SP-latitude");
        SPlati.value = "";
        sessionStorage.removeItem("SP");
        var optionBlock = document.querySelector("div.OptionBlock");
            optionBlock.style.display = "none";
            SP_option.style.color = "black";
    }

    function BNbtnDisplace () {
        var btns = document.querySelectorAll(".Before");
        btns[0].style.display = "none";

        var btns = document.querySelectorAll(".Next");
        btns[btns.length - 1].style.display = "none";
    }

    refreshbtn.onclick = function() {
        if(sessionStorage.getItem("points")){
            PO2s = document.querySelectorAll(".PO2");
            var names = [];
            for(var i = 1; i < PO2s.length; i++){
                names.push(PO2s[i].textContent);
            }

            var states = JSON.parse(sessionStorage.getItem("points"));

            var orderMap = {};
            names.forEach((value, index) => {
            orderMap[value] = index;            
            });

            var sortstates = states.sort((a, b) => {
                return orderMap[a[2]] - orderMap[b[2]];
            });
        
            sessionStorage.setItem("cachePoints", JSON.stringify(sortstates));

            document.dispatchEvent(resetPointsEvent);
        }
        else{
            alert("未检测到点位数据，无法更新点位");
        }
    }
    
    reloadbtn.onclick = function() {
        if(sessionStorage.getItem("points")){
            sessionStorage.removeItem("cachePoints");

            document.dispatchEvent(resetPointsEvent);
        }
        else{
            alert("未检测到点位数据，无法重置数据");
        }
    }

    sendbtn.onclick = function() {
        if(sessionStorage.getItem("points")){
            var result = confirm("此选项将改变服务器保存的数据，请再次确认是否更改？");
            if (result){
                if(sessionStorage.getItem("cachePoints")){
                    sessionStorage.setItem("points", sessionStorage.getItem("cachePoints"));
                }
                sessionStorage.removeItem("cachePoints");

                var points = JSON.parse(sessionStorage.getItem("points"));

                var params = new FormData();
                params.append("un", sessionStorage.getItem("un"));
                params.append("routename", sessionStorage.getItem("pointsName"));
                params.append("pointNum", points.length);
                for(var i = 0; i < points.length; i++){
                    params.append(i + 1, points[i][0] + "|" + points[i][1] + "|" + points[i][2] + "|" + points[i][3]);
                }

                xhr.open("POST", "/createNewRoute", true);
                xhr.send(params);
            }
        }
        else{
            alert("未检测到点位数据，无法向服务端发送数据");
        }
    }

    function SP_set() {
        var points = [];
        var i = sessionStorage.getItem("SP");
        if (sessionStorage.getItem("cachePoints")){
            points = JSON.parse(sessionStorage.getItem("cachePoints"));
        }
        else{
            points = JSON.parse(sessionStorage.getItem("points"));
        }
        var Spoint = points[i];
        var SPnum = document.querySelector("span.SP-num");
        SPnum.textContent = i;
        var SPname = document.querySelector("input.SP-name");
        SPname.value = Spoint[2];
        var SPdescr = document.querySelector("input.SP-description");
        SPdescr.value = Spoint[3];
        var SPlongi = document.querySelector("input.SP-longitude");
        SPlongi.value = Spoint[0];
        var SPlati = document.querySelector("input.SP-latitude");
        SPlati.value = Spoint[1];
    }

})
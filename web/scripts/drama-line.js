document.addEventListener('DOMContentLoaded', function() {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('choose') != null){
        var lines = urlParams.get('choose');
        lines = lines + ";choose";
    }
    else if (urlParams.get('revise') != null){
        var lines = urlParams.get('revise');
        lines = lines + ";revise";
    }

    var line = lines.split(";");

    var grades = [];

    var xhr = new XMLHttpRequest();

    function displayGrades() {
        var table = document.getElementById('gradesTable');
        table.innerHTML = '';
        var headerRow = table.insertRow();
        var orderHeader = headerRow.insertCell();
        orderHeader.innerHTML = '<b>序号</b>'
        var courseHeader = headerRow.insertCell();
        courseHeader.innerHTML = '<b>线路名称</b>';
        var gradeHeader = headerRow.insertCell();
        gradeHeader.innerHTML = '<b>操作</b>';

        for (var i = 0; i < grades.length; i++) {
            (function(i) {
            var row = table.insertRow();
            var orderCell = row.insertCell();
            orderCell.innerHTML = grades[i].order;
            var courseCell = row.insertCell();
            courseCell.innerHTML = grades[i].course.split(":")[0];
            var gradeCell = row.insertCell();

            var gradeButton = document.createElement('div');
            if (line[line.length - 1] === "choose"){
                var button = document.createElement("button");
                button.textContent = "选择";
                button.onclick = function() {
                    var params = new FormData();
                    params.append("un", sessionStorage.getItem("un"));
                    params.append("RouteId", i + 1);
                    params.append("type", "drama");

                    url = "/webgetroutepoints";
                    xhr.open("POST", url, true);

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4){
                            // 单元为  点位名称:点位描述:纬度:经度:ID
                            var text = xhr.responseText;
                            var state = text.split(";");
                            var states = [];
                            for (var j = 0; j < state.length; j++) {
                                states.push(state[j].split(":"));
                            }
                            sessionStorage.setItem("line_points", JSON.stringify(states));
                            sessionStorage.setItem("LineID", grades[i].course.split(":")[1]);//这个grades[i].cource不知道是什么
                            window.parent.postMessage({ action: "drama-line-loaded"}, "*");
                        }
                    }

                    xhr.send(params);
                }

                gradeButton.appendChild(button);
            }
            else if (line[line.length - 1] === "revise"){
                var button1 = document.createElement("button");
                var button2 = document.createElement("button");
                button1.textContent = "编辑";
                button2.textContent = "删除";

                button1.onclick = function() {
                    var params = new FormData();
                    params.append("un", sessionStorage.getItem("un"));
                    params.append("RouteId", i + 1);

                    url = "/getPoints";
                    xhr.open("POST", url, true);

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4){
                            var text = xhr.responseText;
                            var num = text.split(";")[0];
                            var states = text.split(";").slice(1);
                            var points = [];
                            for (var i = 0; i < num; i++){
                                var state = states[i].split(":");
                                points.push(state);
                            }
                            sessionStorage.setItem("points", JSON.stringify(points));
                            sessionStorage.setItem("pointsName", grades[i].course);
                            sessionStorage.setItem("lineId", grades[i].course.split(":")[0]);
                            window.parent.postMessage({ action: "pointStates", num: num}, "*");
                        }
                    }
                    xhr.send(params);
                }

                gradeButton.appendChild(button1);
                gradeButton.appendChild(button2);
            }

            gradeCell.appendChild(gradeButton);
        })(i);
        }
    }
        
    for (var j = 0; j < parseInt(line[0]); j++)
        grades.push({order: j + 1, course: line[j + 1]});
    // 刷新表格
    displayGrades();

    });
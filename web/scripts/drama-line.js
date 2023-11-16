document.addEventListener('DOMContentLoaded', function() {
    let content = document.getElementById('content');
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
            var row = table.insertRow();
            var orderCell = row.insertCell();
            orderCell.innerHTML = grades[i].order;
            var courseCell = row.insertCell();
            courseCell.innerHTML = grades[i].course;
            var gradeCell = row.insertCell();

            var gradeButton = document.createElement('div');
            if (line[line.length - 1] === "choose"){
                var button = document.createElement("button");
                button.textContent = "选择";
                gradeButton.appendChild(button);
            }
            else if (line[line.length - 1] === "revise"){
                var button1 = document.createElement("button");
                var button2 = document.createElement("button");
                button1.textContent = "编辑";
                button2.textContent = "删除";
                gradeButton.appendChild(button1);
                gradeButton.appendChild(button2);
            }

            gradeCell.appendChild(gradeButton);
        }
        }
        
    var course = 0;
    for (var j = 0; j < parseInt(line[0]); j++)
        grades.push({order: j + 1, course: line[j + 1]});
    // 刷新表格
    displayGrades();
    });
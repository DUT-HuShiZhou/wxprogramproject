document.addEventListener('DOMContentLoaded', function() {
    let content = document.getElementById('content');
    let urlParams = new URLSearchParams(window.location.search);
    let lines = urlParams.get('lines');

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
            var gradeButton = document.createElement("button");
            gradeButton.textContent = "选择";
            gradeCell.appendChild(gradeButton);
        }
        }
        
    var course = 0;
    for (var j = 0; j < line[0]; j++)
        grades.push({order: j + 1, course: line[j + 1]});
    // 刷新表格
    displayGrades();
    });
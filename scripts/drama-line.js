document.addEventListener('DOMContentLoaded', function() {
    let content = document.getElementById('content');
    let urlParams = new URLSearchParams(window.location.search);
    let num = urlParams.get('num');

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
            gradeCell.innerHTML = grades[i].grade;
        }
        }

    var course = 0;
    var grade = 0;
    for (var j = 0; j < num; j++)
        grades.push({order: j + 1, course: course, grade: grade });
    // 刷新表格
    displayGrades();
    });
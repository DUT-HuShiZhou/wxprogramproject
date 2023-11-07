var grades = [];

function addGrade() {
    // 获取输入的课程和成绩
    var course = 0;
    var grade = 0;
    var num = 7
    for (var j = 0; j < num; j++)
    // 添加课程和成绩到数组中
    grades.push({ course: course, grade: grade });
    // 刷新表格
    displayGrades();
  }

function displayGrades() {
    // 获取表格对象
    var table = document.getElementById('gradesTable');
    // 清空表格内容
    table.innerHTML = '';
    // 添加表头行
    var headerRow = table.insertRow();
    var courseHeader = headerRow.insertCell();
    courseHeader.innerHTML = '<b>线路名称</b>';
    var gradeHeader = headerRow.insertCell();
    gradeHeader.innerHTML = '<b>操作</b>';
    // 添加每个成绩行
    for (var i = 0; i < grades.length; i++) {
      var row = table.insertRow();
      var courseCell = row.insertCell();
      courseCell.innerHTML = grades[i].course;
      var gradeCell = row.insertCell();
      gradeCell.innerHTML = grades[i].grade;
    }
  }
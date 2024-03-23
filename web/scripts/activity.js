document.addEventListener('DOMContentLoaded', function() {
    var xhr = new XMLHttpRequest();
    var url = "/webgetactivitylist";
    var params = new FormData();
    xhr.open("POST", url, true);

    params.append("un", sessionStorage.getItem("un"));
    params.append("type", "activity");

    var grades = [];

    function displayGrades() {
        var table = document.getElementById('gradesTable');
        table.innerHTML = '';
        var headerRow = table.insertRow();
        var nameHeader = headerRow.insertCell();
        nameHeader.innerHTML = '<b>活动名称</b>'
        var testHeader = headerRow.insertCell();
        testHeader.innerHTML = '<b>测试码</b>';
        var officialHeader = headerRow.insertCell();
        officialHeader.innerHTML = '<b>正式码</b>';
        var peopleHeader = headerRow.insertCell();
        peopleHeader.innerHTML = '<b>积累参与人数</b>';
        var timeHeader = headerRow.insertCell();
        timeHeader.innerHTML = '<b>平均参与时长</b>';
        var operateHeader = headerRow.insertCell();
        operateHeader.innerHTML = '<b>操作</b>';

        for (var i = 0; i < grades.length; i++) {
            var row = table.insertRow();
            var nameCell = row.insertCell();
            nameCell.innerHTML = grades[i].name;

            var testHeader = row.insertCell();
            var button = document.createElement("button");
            button.textContent = "查看";
            testHeader.appendChild(button);

            var officialHeader = row.insertCell();
            var button = document.createElement("button");
            button.textContent = "查看";
            officialHeader.appendChild(button);

            var peopleCell = row.insertCell();
            peopleCell.innerHTML = grades[i].people;
            var timeCell = row.insertCell();
            timeCell.innerHTML = grades[i].time;

            var gradeButton = document.createElement('div');
            var button1 = document.createElement("button");
            var button2 = document.createElement("button");
            button1.textContent = "活动监控";
            button2.textContent = "删除";
            gradeButton.appendChild(button1);
            gradeButton.appendChild(button2);

            var operateCell = row.insertCell();
            operateCell.appendChild(gradeButton);
        }
        }

    xhr.onreadystatechange = function() {
        var data = xhr.responseText;
        var datas = data.split(";");

        for (i = 0; i <datas[0]; i++){
            var imf = datas[i + 1].split(":");
            grades.push({name: imf[0], people: imf[1], time: imf[2]})
        }

        displayGrades();
    };

    xhr.send(params)

});
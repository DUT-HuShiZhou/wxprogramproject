 // 题目数组
 let selectedCategoryValue = ''; // 全局变量，存储选择的值

 let questions = [
    { id: 1, title: "fuck", category: "图片" ,grade:"4"},
    { id: 2, title: "rape", category: "视频" ,grade:"4"},
    { id: 3, title: "shit", category: "音频" ,grade:"4"}
];

// 弹窗相关函数
function openAddQuestionModal() {
    document.getElementById('addQuestionModal').style.display = 'block';
}

function closeAddQuestionModal() {
    document.getElementById('addQuestionModal').style.display = 'none';
}


// 添加题目函数
function addQuestion() {
    const titleInput = document.getElementById('titleInput');
    const gradeInput = document.getElementById('gradeInput'); 
    const title = titleInput.value;
    const category = selectedCategoryValue;
    const grade = gradeInput.value; 

    if (title && category && grade) 
    {
        const newQuestion = {
            id: questions.length + 1,
            title: title,
            category: category,
            grade:grade
        };

        // 添加到题目数组
        questions.push(newQuestion);

        // 关闭弹窗
        closeAddQuestionModal();

        // 重新渲染表格
        renderQuestionTable();

        // 重新渲染筛选框
        renderCategorySelect();
    } else {
        alert('请将题目信息填写完整');
    }
}

//删除
function deleteQuestion() {
    const idInput = document.getElementById('deleteIdInput');
    const idToDelete = parseInt(idInput.value);

    if (!isNaN(idToDelete)) {
        const indexToDelete = questions.findIndex(question => question.id === idToDelete);

        if (indexToDelete !== -1) {
            // Remove the question from the array
            questions.splice(indexToDelete, 1);

            // Update the IDs of the remaining questions
            questions.forEach((question, index) => {
                question.id = index + 1;
            });

            // Re-render the table and category select
            renderQuestionTable();
            renderCategorySelect();
            alert('删除完毕！');
        } else {
            alert('题目ID不存在！');
        }
    } else {
        alert('请输入有效的题目ID！');
    }
    document.getElementById('deleteIdInput').value = '';
}

function clearButton(){
    document.getElementById('searchInput').value = '';
    renderQuestionTable();
}

// 渲染表格函数
function renderQuestionTable() {
    const tableBody = document.querySelector('#questionTable tbody');
    tableBody.innerHTML = '';

    questions.forEach(function (question) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = question.id;
        row.insertCell(1).textContent = question.title;
        row.insertCell(2).textContent = question.category;
        row.insertCell(3).textContent = question.grade;
    });
}

// 渲染筛选框函数
function renderCategorySelect() {
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.innerHTML = '<option value="all">全部</option>';

    const uniqueCategories = [...new Set(questions.map(question => question.category))];
    uniqueCategories.forEach(function (category) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// 根据类别筛选函数
function filterByCategory() {
    const selectedCategory = document.getElementById('categorySelect').value;
    const table = document.getElementById('questionTable');
    const rows = table.getElementsByTagName('tr');
    clearButton();
    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].getElementsByTagName('td')[2];
        const categoryText = cell.textContent || cell.innerText;

        if (selectedCategory === 'all' || categoryText === selectedCategory) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

// 新增渲染筛选后表格函数
function renderFilteredTable(filteredQuestions) {
    const tableBody = document.querySelector('#questionTable tbody');
    tableBody.innerHTML = '';

    filteredQuestions.forEach(function (question) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = question.id;
        row.insertCell(1).textContent = question.title;
        row.insertCell(2).textContent = question.category;
        row.insertCell(3).textContent = question.grade;
    });
}

function searchByTitle() {
    const searchInput = document.getElementById('searchInput');
    const searchText = searchInput.value.toUpperCase();
    const filteredQuestions = questions.filter(question => {
        const titleText = question.title.toUpperCase();
        return titleText.includes(searchText);
    });
    // 渲染筛选后的表格
    renderFilteredTable(filteredQuestions);
}


    // 页面加载时渲染表格和筛选框
    document.addEventListener('DOMContentLoaded', function () {
    renderQuestionTable();
    renderCategorySelect();

    // 新增按标题搜索事件监听
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', searchByTitle);
});


layui.use(function(){
    var form = layui.form;
    var layer = layui.layer;
    // select 事件
    form.on( 'select(demo-select-filter)', function(data){
        var main_item = document.querySelector("div.main-item");
        var module_frame = document.querySelector("div.module-frame");
        main_item.innerHTML = "";
       module_frame.innerHTML = "";
        var selectedCategoryValue = data.value; // 获得被选中的值
        var options = [[["video", "90x40", "5x0", ""], ["question", "90x50", "5x0", ""]],
        [["photo", "90x40", "5x0", ""], ["question", "90x50", "5x0", ""]],
        [["audio", "90x40", "5x0", ""], ["question", "90x50", "5x0", ""]]];

        var datas = []
        if (selectedCategoryValue === "视频") {
          datas = options[0];
          
          clearitems();
        }
        else if (selectedCategoryValue === "图片") {
          datas = options[1];
        }
        else if (selectedCategoryValue === "音频") {
          datas = options[2];
        };

        for (var i = 0; i < datas.length; i++) {
          (function(i) {
              switch (datas[i][0]) {
                  case "photo":
                      photo(datas[i], i, "update-btn");
                      break;
                  case "question":
                      question(datas[i], i, "update-btn");
                      var text = document.querySelector("div.text");
                      text.style.setProperty("color","white");

                      break;
                  case "video":
                      video(datas[i], i, "update-btn");
                      break;
                  case "audio":
                      audio(datas[i], i, "update-btn");
                      break;
                  default:
                      break;
              }
          })(i);
        };
        key_bind();
    });
  });







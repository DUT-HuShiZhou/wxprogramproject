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
    form.on('select(demo-select-filter)', function(data){
        selectedCategoryValue = data.value; // 获得被选中的值

        if(selectedCategoryValue=="图片"){
            document.getElementById('Photo').style.display = 'block';
            document.getElementById('Media').style.display = 'none';
        }
        else if(selectedCategoryValue === "视频" || selectedCategoryValue === "音频"){
            document.getElementById('Photo').style.display = 'none';
            document.getElementById('Media').style.display = 'block';
        }
        else {
            document.getElementById('Photo').style.display = 'none';
            document.getElementById('Media').style.display = 'none';
        }
    });
  });

  layui.use(function(){
    var form = layui.form;
    var layer = layui.layer;
    // select 事件
    form.on('select(demo-select-filter2)', function(data){
        selectedCategoryValue = data.value; // 获得被选中的值

        if(selectedCategoryValue === "选择"){
            document.getElementById('qustionTitle').style.display = 'block';
            document.getElementById('FillBlank').style.display = 'none';
        }
        else if(selectedCategoryValue === "填空"){
            document.getElementById('qustionTitle').style.display = 'none';
            document.getElementById('FillBlank').style.display = 'block';
        }
        else {
            document.getElementById('qustionTitle').style.display = 'none';
            document.getElementById('FillBlank').style.display = 'none';
        }
    });
  });


//lay图片上传
layui.use(function(){
    var upload = layui.upload;
    var layer = layui.layer;
    var element = layui.element;
    var $ = layui.$;
    // 单图片上传
    var uploadInst = upload.render({
      elem: '#ID-upload-demo-btn',
      url: '', // 实际使用时改成您自己的上传接口即可。
      before: function(obj){
        // 预读本地文件示例，不支持ie8
        obj.preview(function(index, file, result){
          $('#ID-upload-demo-img').attr('src', result); // 图片链接（base64）
        });
        
        element.progress('filter-demo', '0%'); // 进度条复位
        layer.msg('上传中', {icon: 16, time: 0});
      },
      done: function(res){
        // 若上传失败
        if(res.code > 0){
          return layer.msg('上传失败');
        }
        // 上传成功的一些操作
        // …
        $('#ID-upload-demo-text').html(''); // 置空上传失败的状态
      },
      error: function(){
        // 演示失败状态，并实现重传
        var demoText = $('#ID-upload-demo-text');
        demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
        demoText.find('.demo-reload').on('click', function(){
          uploadInst.upload();
        });
      },
      // 进度条
      progress: function(n, elem, e){
        element.progress('filter-demo', n + '%'); // 可配合 layui 进度条元素使用
        if(n == 100){
          layer.msg('上传完毕', {icon: 1});
        }
      }
    });  
});

//上传文件
layui.use(function(){
    var upload = layui.upload;
    // 渲染
    upload.render({
      elem: '#ID-upload-demo-choose',
      url: '', // 此处配置你自己的上传接口即可
      auto: false,
      // multiple: true,
      bindAction: '#ID-upload-demo-action',
      done: function(res){
        layer.msg('上传成功');
        console.log(res)
      }
    });
  });

//AR选择框
  layui.use(function(){
    var form = layui.form;
    var layer = layui.layer;
    // radio 事件
    form.on('radio(demo-radio-filter)', function(data){
      var elem = data.elem; // 获得 radio 原始 DOM 对象
      var value = elem.value; // 获得 radio 值
      if(value==="1")
      {
        document.getElementById('ARbutton').style.display = 'block';
      }
      else
      {
        document.getElementById('ARbutton').style.display = 'none';
      }
     
    });
    
  });
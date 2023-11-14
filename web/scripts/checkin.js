const un = document.getElementById("un");
const pw = document.getElementById("pw");
const btn = document.querySelector("button");
/*const crypto = require('crypto');

function pwMD5(pw){
    const hash = crypto.createHash('md5');
    hash.update(pw);
    const a = hash.digest('hex');
    console.log(a);
}
这里是对输入的密码进行md5加密部分
*/
function login(){
    var httpRequest = new XMLHttpRequest;
    var url = "/user/"+un.value;
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
        //处理响应结果
            var result = httpRequest.responseText;
            if(result=="login success"){
                console.log('test success');
            }
        } else {
        //处理请求失败
        alert('请求失败');
        }
    }
    };
console.log("执行到该步了");
httpRequest.send(pw.value);
}

btn.onclick = function() {
    let failed = document.getElementById("failed");
    login();
    //pwMD5(pw.value); 这个是对输入的密码进行加密
    if (un.value == "elab" && pw.value == "elab") {
        failed.textContent = "";
        window.location.href = "/index";
    }
    else {
        if (un.value == "" || pw.value == "") {
            failed.textContent = "登陆失败：账号或密码不能为空！";
        }
        else {
            failed.textContent = "登陆失败：账号不存在或密码错误！";
        }
    }
}


window.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        btn.onclick();
    }
});
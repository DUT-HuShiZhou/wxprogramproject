const un = document.getElementById("un");
const pw = document.getElementById("pw");
const btn = document.querySelector("button");
let loginform = document.getElementById("loginform");
/*const crypto = require('crypto');

function pwMD5(pw){
    const hash = crypto.createHash('md5');
    hash.update(pw);
    const a = hash.digest('hex');
    console.log(a);
}
这里是对输入的密码进行md5加密部分
*/
btn.onclick = function() {
    let failed = document.getElementById("failed");
    var FD = new FormData();
    FD.append("username",un.value);
    FD.append("userpassword",pw.value);
    var httpRequest = new XMLHttpRequest;
    var url = "/user";
    httpRequest.open("POST", url, true);
    //httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
        //处理响应结果
            var result = httpRequest.responseText;
            if (un.value == "" || pw.value == "") {
                failed.textContent = "登陆失败：账号或密码不能为空！";
            }else{
                if(result=="login success"){
                    console.log('login success');
                    failed.textContent = "";
                    window.location.href = "/index";
                }
                if(result=="account doesn't exist"){
                    failed.textContent = "登陆失败:账号不存在";
                }
                if(result=="not correct password"){
                    failed.textContent = "登陆失败:密码错误";
                }
            }
        } else {
        //处理请求失败
        alert('网络请求失败，请检查你的网络情况');
        }
    }
    };
    console.log("执行到该步了");
    console.log(FD.get("username"));
    console.log(FD.get("userpassword"));
    httpRequest.send(FD);
    //pwMD5(pw.value); 这个是对输入的密码进行加密
}
window.addEventListener("keydown",function(event){
    if(event.key == "Enter"){
        btn.onclick();
    }
})
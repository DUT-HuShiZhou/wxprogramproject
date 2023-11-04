const un = document.getElementById("un");
const pw = document.getElementById("pw");
const btn = document.querySelector("button");

btn.onclick = function() {
    let failed = document.getElementById("failed");
    if (un.value == "elab" && pw.value == "elab") {
        failed.textContent = "";
        window.location.href = "index.html";
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
    if (event.key = "Enter") {
        btn.onclick();
    }
});
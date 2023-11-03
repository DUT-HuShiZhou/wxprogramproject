const output = document.querySelector(".inputcontent");
const input = document.querySelector(".inputField");

if (localStorage.getItem("inputContent") != null){
    output.textContent = localStorage.getItem("inputContent");
}
else{
    output.textContent = "输出：无";
}

input.addEventListener("keydown", function(e) {
    if(e.key == 'Enter') {
        let content = input.value;
        input.value = "";
        output.textContent = content;
        localStorage.setItem("inputContent", content);
    }
})
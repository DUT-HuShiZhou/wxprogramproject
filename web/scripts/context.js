document.addEventListener('DOMContentLoaded', function() {
    let MainLine = document.querySelector("div.context-Line");

    var pages = []
    this.addEventListener("message", function(event) {
        if (event.data.action === "load-context") {
            for(var i = 0; i < event.data.num; i++){
                var page = document.createElement("a");
                page.className = "a-page";
                page.textContent = event.data.states[i][0];
                page.href = event.data.states[i][2];
                pages.push(page);

                var div = document.createElement("div");
                div.className = "page-head";
                div.appendChild(page);

                var div_contain = document.createElement("div");
                div_contain.className = "page-contain";
                div_contain.innerHTML = event.data.states[i][1].split("");
                div.appendChild(div_contain);
                
                MainLine.appendChild(div);
            }
        }
    })
})
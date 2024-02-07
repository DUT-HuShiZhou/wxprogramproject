function Send(event) {
    if (event.key === 'Enter') {
      document.getElementById('chatBox').value = '';
      event.preventDefault(); // 阻止默认的Enter键行为（换行）
      Sendmess();
    }
  }
function Sendmess()
{
 alert("发送成功！");   
}

function sendBtn(){
  document.getElementById('chatBox').value = '';
  Sendmess();
}
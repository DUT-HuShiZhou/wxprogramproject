document.addEventListener('DOMContentLoaded', function() {
    let content = document.getElementById('content');
    let urlParams = new URLSearchParams(window.location.search);
    let pageType = urlParams.get('showWay');
  
    if (pageType === 'dream') {
      content.textContent = '这是页面1的效果。';
    }
    else if (pageType === 'page2') {
      content.textContent = '这是页面2的效果。';
    }
  });
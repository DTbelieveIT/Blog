  if (typeof document.webkitHidden == "undefined") {
    // 非chrome浏览器阻止粘贴
    box.onpaste = function() {
      return false;
    }
  }

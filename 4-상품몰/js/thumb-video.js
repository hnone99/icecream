function play1(e){
  var num = parseInt(e.currentTarget.id.replace('thumbImg-', ''), 10);
  var i = num - 1;
  e.currentTarget.innerHTML =
    '<iframe width=' + data[i].width + " height=" + data[i].height + ' src="' + data[i].url + '" allow="autoplay"' + ' frameborder="0"></iframe>';
  // 배경/버튼 이미지 삭제
  var thumbImg = document.querySelector('.thumb-img');
  thumbImg.classList.add('on');
}
var data = [
  {
  url: "https://www.youtube.com/embed/78PkL1nLh8I?autoplay=1",
  width: "341",
  height: "207",
  }
]

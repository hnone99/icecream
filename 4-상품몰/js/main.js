$(document).on('ready', function() {
  // 메인 슬라이드
  $(".main-slider").slick({
    infinite: true,
    dots: true,
    arrows : true,
    speed : 300,
    autoplay : true,
    autoplaySpeed : 5000,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1279,
        settings: {
          arrows : false,
          dots: true
        }
      },
      {
        breakpoint: 960,
        settings: {
          arrows : false,
          dots: true,
          variableWidth: false
        }
      }
    ]
  });
});

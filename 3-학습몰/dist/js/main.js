$(document).on('ready resize', function() {
  // 메인 슬라이드
  /* $(".main-slider").slick({
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
  }); */
  /* 상품몰 메인과 동일하게 설정 */
  $(".main-slider").slick({
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000
  });
});

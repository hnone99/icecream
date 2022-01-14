$(document).on('ready', function() {
  // 상세 슬라이드
  $(".regular").slick({
    dots: true,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows : false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows : false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows : false
        }
      }
    ]
  });


  // 상세 더보기 버튼
  $('.btn-state').on("click",function(){
    var detailPage = $(".detail-page");
    if(detailPage.hasClass("closed") === true){
      detailPage.addClass('open');
      detailPage.removeClass('closed');
    } else {
      detailPage.addClass('closed');
      detailPage.removeClass('open');
    }
  });
  // 학습목차
  $(".detail-index .title-detail-area").on("click", function() {
    var detailIndex = $(".detail-index");
    if(detailIndex.hasClass("on") === true){
      detailIndex.removeClass('on');
    } else {
      detailIndex.addClass('on');
    }
  });
  // 변경 내역
  $(".detail-history .title-detail-area").on("click", function() {
    var detailHistory = $(".detail-history");
    if(detailHistory.hasClass("on") === true){
      detailHistory.removeClass('on');
    } else {
      detailHistory.addClass('on');
    }
  });
  // 환불/해지 안내
  $(".detail-refund .title-detail-area").on("click", function() {
    var detailHistory = $(".detail-refund");
    if(detailHistory.hasClass("on") === true){
      detailHistory.removeClass('on');
    } else {
      detailHistory.addClass('on');
    }
  });
  // 상품 상세 페이지 하단 버튼
  var lastScroll = 0;
  var stickyBtn = $(".sticky-btn");
  var fixedBtn =$(".fixed-btn");
  var containerFooter = $('.container-footer');
  $(window).scroll(function(event){
     var scroll = $(this).scrollTop();
     if (scroll > 500){
       stickyBtn.addClass("on");
       fixedBtn.addClass("on");
       containerFooter.addClass("on");
     }
     else {
       stickyBtn.removeClass("on");
       fixedBtn.removeClass("on");
       containerFooter.removeClass("on");
     }
     lastScroll = scroll;
     console.log(lastScroll)
  });
});

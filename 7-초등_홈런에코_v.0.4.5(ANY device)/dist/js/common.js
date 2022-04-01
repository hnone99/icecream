$(function(){

	// 링크용 함수
	// ex)   <div data-href="http://google.com">
	// ex)   <div data-href="todayStudy.htm">
	// ex)   <div data-href="todayStudy.htm, window_name"> // 새창
	// ex)   <div data-href="todayStudy.htm, _blank"> // 새창
	$("body").on("click", "[data-href]", function(){
		var href = $(this).attr("data-href");
		if (!href) return;
		href = href.split(",").map(function(item){ return item.trim();});
		if (href.length > 1) {
			window.open(href[0], href[1]);
		} else {
			location.href = href[0];
		}
	});

	//커스텀 스크롤 outside 에 적용
	$(".mCustomScroll.outside").mCustomScrollbar({
		theme: "dark",
		scrollbarPosition: "outside"
	});

	//커스텀 스크롤 적용
	$(".mCustomScroll").mCustomScrollbar({
		theme: "dark"
	});

  //팝업
  var btnPop = $("._openPopup");
  var viewPop = $("#layers");
  var closeBtn = $("._closeBtn");

  btnPop.on("click", function (e) {
    viewPop.css('display','flex');
  });
  closeBtn.on("click", function (e) {
    viewPop.hide();
  });

  // 팝업 닫히는 함수
  function openPopup() {
    $("._openPopup").css('display','flex');
  }
  // 팝업 닫히는 함수
  function closePopup() {
    $("#layers").hide();
  }

	// 레이어 닫기 버튼
	$("body").on("click", ".closeBox", function(){
		if ($(this).parents("#layers").length) {
			$("#layers").hide();
    }
	});

	// .bannerSection 있을 경우에만 배너 롤링
	if ($(".bannerSection").length) {
		$(".bannerSection > div").scrollEnd(function ($this) {
			var $dots = $this.siblings(".bannerIndicator");
			var scrollLeft = $this[0].scrollLeft;
			var itemWidth = $this.children().eq(0).width();
			var index = Math.round(scrollLeft / itemWidth);
			$dots.children().eq(index).addClass("on").siblings().removeClass("on");
		});

		setInterval(function(){
			$(".bannerSection div").nextSlide();
		}, 3000);
	}

	// .banner_section 있을 경우에만 배너 롤링(중등)
	if ($(".banner_section").length) {
		$(".banner_section > div").scrollEnd(function ($this) {
			var $dots = $this.siblings(".banner_dots");
			var scrollLeft = $this[0].scrollLeft;
			var itemWidth = $this.children().eq(0).width();
			var index = Math.round(scrollLeft / itemWidth);
			$dots.children().eq(index).addClass("on").siblings().removeClass("on");
		});

		setInterval(function(){
			$(".banner_section > div").nextSlide();
		}, 3000);
	}

	// 커스텀 셀렉트용 바인딩 customSelect, customSelect2, custom_select(중등)
	$("body").on("click", ".customSelect, .customSelect2, .custom_select", function(e){
		if ($(this).hasClass("disabled")) return;
		e.stopPropagation();
		$(this).toggleClass("down");
	});

	$("body").on("click", ".customSelect li, .customSelect2 li, .custom_select li", function(e){
		var $input = $(this).parent("ul").siblings("input[type='hidden']");
		var value = $(this).attr("data-value");
		$input.val(value);
		$(this).parent("ul").removeClass("down");
		var text = $(this).text();
		$(this).parent("ul").prev("span").text(text);
		console.log(value);
	});

	$("body").on("click", ".view_type_select > div", function(){
		$(this).addClass("on").siblings().removeClass("on");
	});

	$("body").on("click", function(){
		$(".customSelect, .customSelect2, .custom_select").removeClass("down");
	});
});


// 커스텀 레인지 슬라이더
$.fn.customSlider = function(callback) {
	$(this).each(function(){
		var $slider = $(this);
		var rand_id = "sd_" + String(Math.random()).substr(2, 8);
		var value = $(this).data("value");
		var min = $(this).data("min");
		var max = $(this).data("max");
		var w = $(this).width();

		$(this).attr("data-slider-id", rand_id);

		var custom_sliders = window.custom_sliders;
		if (!custom_sliders) custom_sliders = window.custom_sliders = {
			sliders: [],
			active_slider_id: null
		};

		custom_sliders.sliders.push({
			id: rand_id,
			callback: callback
		});

		$(this).prepend("<div><div></div></div><div class=\"handle\" />");

		if (value < min) value = min;
		if (value > max) value = max;
		left = (w / (max - min)) * (value - min);

		var $handle = $(this).children(".handle");
		var $bar = $(this).children("div").first().children("div");

		$handle.css("left", left);
		$bar.width(left);

		$(this).on("mousedown", function(e){
			if ($(e.target).hasClass("handle")) {
				$(this).removeClass("transit");
			} else {
				$(this).addClass("transit");
			}
			window.custom_sliders.active_slider_id = $(this).attr("data-slider-id");
			bodyMouseMove(e);
		});

		$handle.on("transitionend", function(){
			$slider.removeClass("transit");
		});
	});

	var bodyMouseMove = function(e){
		if (!window.custom_sliders) return;
		var active_id = window.custom_sliders.active_slider_id;
		var callback = (function(){
			var sliders = window.custom_sliders.sliders;
			for(var i = 0; i < sliders.length; i++) {
				if (sliders[i].id == active_id) {
					return sliders[i].callback;
				}
				return null;
			}
		})();

		if (!active_id) return;
		var $slider = $("[data-slider-id='" + window.custom_sliders.active_slider_id + "']");
		var $bar = $slider.children("div").first().children().first();
		var $handle = $slider.children(".handle");
		var max_length = parseFloat($slider.width());
		var pageX, min, max;
		if (e.pageX) {
			pageX = e.pageX;
		} else {
			pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		}
		var offsetLeft = window.custom_sliders.offsetLeft;
		if (!window.custom_sliders.offsetLeft) offsetLeft = window.custom_sliders.offsetLeft = $slider.offset().left;

		var left = pageX - offsetLeft;
		var bar_width = left;
		if (bar_width >= max_length) bar_width = max_length;
		if (bar_width < 0) bar_width = 0;

		var handle_pos = bar_width;
		if (handle_pos < 0) handle_pos = 0;
		if (handle_pos >= max_length) handle_pos = max_length;
		$handle.css("left", handle_pos);
		$bar.width(bar_width);

		if (left > max_length) left = max_length;
		if (left < 0) left = 0;
		min = parseFloat($slider.attr("data-min"));
		max = parseFloat($slider.attr("data-max"));
		var value = Math.round(left * (max - min) / max_length + min);
		// console.log(value);
		$slider.children("input").val(value);
		if (callback) callback(value);
	};

	var bodyMouseUp = function(e){
		if (window.custom_sliders && window.custom_sliders.active_slider_id) {
			var $slider = $("[data-slider-id='" + window.custom_sliders.active_slider_id + "']");
			$slider.addClass("transit");
			if (!$slider.lenth) {
				window.custom_sliders.active_slider_id = null;
				window.custom_sliders.offsetLeft = null;
				return;
			}
		}
	};

	$("body").off("mousemove", bodyMouseMove).on("mousemove", bodyMouseMove);
	$("body").off("mouseup", bodyMouseUp).on("mouseup", bodyMouseUp);
}

// 배너 이전 슬라이드
$.fn.prevSlide = function(){
	var w = $(this).children().first().outerWidth(true);
	var $scrollBox = $(this);
	var scrollLeft = $(this).scrollLeft() - w;
	var scrollSnap = false;
	if ($(this).hasClass("scrollXMandatory")) {
		$(this).removeClass("scrollXMandatory");
		scrollSnap = true;
	}
	$(this).animate({
		scrollLeft : scrollLeft
	}, function(){
		if (scrollSnap) $scrollBox.addClass("scrollXMandatory");
	});
};

// 배너 다음 슬라이드
$.fn.nextSlide = function(){
	var w = $(this).children().first().outerWidth(true);
	var $scrollBox = $(this);
	var scrollLeft = $(this).scrollLeft() + w;
	var scrollSnap = false;
	if ($scrollBox[0].scrollWidth <= scrollLeft) scrollLeft = 0;
	if ($(this).hasClass("scrollXMandatory")) {
		$(this).removeClass("scrollXMandatory");
		scrollSnap = true;
	}
	// console.log($scrollBox[0].scrollWidth, scrollLeft);
	$(this).animate({
		scrollLeft : scrollLeft
	}, function(){
		if (scrollSnap) $scrollBox.addClass("scrollXMandatory");
	});
};

// scroll end 이벤트 바인딩
$.fn.scrollEnd = function (callback, timeout) {
	timeout = timeout || 200;
	$(this).scroll(function () {
		var $this = $(this);
		if ($this.data('scrollTimeout')) {
			clearTimeout($this.data('scrollTimeout'));
		}
		$this.data('scrollTimeout', setTimeout(function () {
			callback($this);
		}, timeout));
	});
};

//image 프리 로드
var imgArray = [
	"../img/common/icon_rightArrow.png",
	"../img/common/icon_leftArrow.png",
	"../img/common/icon_rightArrow_dim.png",
	"../img/common/icon_leftArrow_dim.png"
];

for(var i = 0; i < imgArray.length; i++) {
	var img = new Image();
	img.src = imgArray[i];
}

// 배너 외 좌우 스크롤 박스 들
$.fn.scrollBox = function (prev, next) {
	var $scrollBox = $(this);
	var $prev = $(prev);
	var $next = $(next);

	$prev.add($next).on("click", function(){
		if ($(this).hasClass("dim")) return;
		$scrollBox.removeClass("scrollXMandatory");
		var scrollLeft = $scrollBox.scrollLeft();
		var w = $scrollBox.children().eq(1).outerWidth(true);
		if ($(this).is($prev)) {
			scrollLeft -= w;
		} else {
			scrollLeft += w;
		}

		$scrollBox.animate({
			scrollLeft: scrollLeft
		}, function(){
			var scrollLeftNow = $(this).scrollLeft();
			$(this).addClass("scrollXMandatory");
			$(this).scrollLeft(scrollLeftNow);
			checkArrows();
		});
	});

	$scrollBox.scrollEnd(function(){
		checkArrows();
	});

	var checkArrows = function(){
		var scrollLeft = $scrollBox.scrollLeft();
		if (scrollLeft <= 0) {
			$prev.addClass("dim");
			$next.removeClass("dim");
		} else if ($scrollBox[0].scrollWidth <= $scrollBox[0].offsetWidth + scrollLeft) {
			$prev.removeClass("dim");
			$next.addClass("dim");
		} else {
			$prev.removeClass("dim");
			$next.removeClass("dim");
		}
	};
}


// 언어 설정
window.onload = function () {
  let koBtn = document.getElementById("koBtn");
  let enBtn = document.getElementById("enBtn");
  let setLanguage = function(lang) {
    let textList = Array.prototype.slice.call(document.querySelectorAll('[data-text]'));

    textList.map( function (v) {

      let child = v.firstChild;
      while (child) {
        if (child.nodeType == 3) {

          var split_text = v.dataset.text.split(';');
          if(split_text.length == 2){
            child.data = String.format(langData[lang][split_text[0]],split_text[1]);
          }
          else if(split_text.length == 3){
            child.data = String.format(langData[lang][split_text[0]],split_text[1],split_text[2]);
          }
          else if(split_text.length == 4){
            child.data = String.format(langData[lang][split_text[0]],split_text[1],split_text[2],split_text[3]);
          }
          else if(split_text.length == 5){
            child.data = String.format(langData[lang][split_text[0]],split_text[1],split_text[2],split_text[3],split_text[4]);
          }
          else{
            child.data = langData[lang][v.dataset.text];
          }
          break;
        }
        child = child.nextSibling;
      }
    });

    let urlList = Array.prototype.slice.call(document.querySelectorAll('[data-url]'));
    urlList.map( function (v) {
      v.src = langData[lang][v.dataset.url]
    });

    let placeholderList = Array.prototype.slice.call(document.querySelectorAll('[data-placeholder]'));
    placeholderList.map( function (v) {
      v.placeholder = langData[lang][v.dataset.placeholder]
    });
  };
  koBtn.addEventListener("click" , function () {
    setLanguage("ko");
  });
  enBtn.addEventListener("click" , function () {
    setLanguage("en");
  });
  setLanguage("ko");
};

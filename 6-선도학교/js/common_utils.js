
$.extend({
	isEmpty: function (value) { //값이 비었는지 확인
		if (value === ""
			|| value === null
			|| value === undefined
			|| value == undefined
			|| (value !== null && typeof value === "object" && !Object.keys(value).length)
			|| value === "undefined") {
			return true;
		} else {
			return false;
		}
	},
	getUrlParams: function (params) { //파라미터 값 배열로 반환
		var url = decodeURIComponent(window.location.href);

		if (!$.isEmpty(params)) {
			url = decodeURIComponent(params);
		}

		if (!$.isEmpty(url)) {
			// hash value filtering
			if (url.indexOf('#/') > -1) {
				url = url.substr(0, url.indexOf('#/'));
			} else if (url.indexOf('#') > -1) {
				url = url.substr(0, url.indexOf('#'));
			}

			url = url.slice(url.indexOf('?') + 1).split('&');
			var param = '';
			var params = [];
			for (var i = 0; i < url.length; i++) {
				param = url[i].split('=');
				params.push(param[0]);
				params[param[0]] = param[1];
			}

			return params;
		} else {
			return '';
		}
	},
	getUrlParam: function (key) { //파라미터 값 반환
		return $.getUrlParams()[key];
	},
	postJSON: function (target, url, reqData, callback, bShowLoadingbar, method, addHeader) { //ajax 통신 기본 케이스

		try {
			/*
			 * bShowLoadingbar의 기본 값 true: 로딩바 노출
			 * */
			if ($.isEmpty(bShowLoadingbar)) {
				bShowLoadingbar = true;
			}
			bShowLoadingbar = true;
			var param = null;
			if (reqData != null) {
				if (addHeader && addHeader["Content-Type"] && addHeader["Content-Type"].indexOf("json") > -1) {
					param = reqData;
				} else if (reqData instanceof FormData) {
					param = reqData;
				} else {
					param = $.param(reqData);
				}
			}

			if (method == null || method == '') {
				method = "POST";
			}

			//console.log("REQ_HEADER ::: " + JSON.stringify(REQ_HEADER));
			var callUrl = Global.A_URL(target, url);
			//header에 추가 속성이 있는 경우 사용
			var REQ_HEADER = null;
			if (addHeader)
				REQ_HEADER = addHeader;
			else if (Global.isOnHeader)
				REQ_HEADER = EU_HEADER;
			else
				REQ_HEADER = EX_HEADER;
//			console.trace("postJSON called: ", target, url, reqData, callback, bShowLoadingbar, method, addHeader, REQ_HEADER);
			// 전달하는 데이터가 FormData 형식일 경우, contentType은 생략한다
			if (param instanceof FormData) {
				delete REQ_HEADER["Content-Type"];
			}

			var ajaxOptions = {
				type: method,
				url: callUrl,
				data: param,
				cache: false,
				timeout: 15000,
				headers: REQ_HEADER,
				crossDomain: true,
				processData: false,
				contentType: ((reqData instanceof FormData) ? false : "application/x-www-form-urlencoded; charset=UTF-8"),
				beforeSend: function () {
					if (bShowLoadingbar) {
						showLoadingbar();
					}
				},
				success: function (data) {
					//console.log("[API] "+callUrl+" | [Request] "+JSON.stringify(reqData)+" | [Response] "+JSON.stringify(data));

					if (EUSER_INFO && EUSER_INFO.GRADE_GBN)
						$('.userGrade').text("(" + EUSER_INFO.GRADE_GBN + "학년)");

					//사용자 인증 실패
					if (data != null && data.errorCode == "9991") {
//						console.trace("ajax 호출 중 토큰 무효화 응답 받음", ajaxOptions, data, (typeof EUSER_INFO != "undefined" ? EUSER_INFO : null));
						fnCheckLogin("Y");
					}
					else {

						if (!$.isEmpty(callback)) {
							callback(data);
						} else {
							return data;
						}
					}
				},
				dataType: 'json',
				error: function (xhr, status, errorThrown) {
					//console.log("[API] Ajax Error:: " + callUrl + " | [Request] " + JSON.stringify(reqData) + " | [ajax Error] " + JSON.stringify(xhr) + ", status=" + status);
					console.log("Ajax failuire", ajaxOptions, xhr, status, errorThrown);
					// 20210426 ynjoung added.
					// 네트워크 단절이 확인된 경우에는 네트워크 단절 팝업 표시
					if (xhr.readyState == 0) {
						// XMLHttpRequest.readyState == 0: Client has been created, but open() not called yet.
						__fnKtShowPopup__({
							title: "서버 접속 실패",
							body: "" +
								"서버 접속에 실패하였습니다.<br /><br />" + "잠시 후 다시 시도해 주세요",
							showConfirm: true,
							confirmCaption: "확인",
							confirm: "CLOSE",
							clickToClose: false,
							showClose: false,
							close: "CLOSE"
						});
					}

					if (bShowLoadingbar) {
						hideLoadingbar();
					}
					//displayErrorPage();
				},
				complete: function () {

					if (bShowLoadingbar) {
						hideLoadingbar();
					}
				}
			};

			$.ajax(ajaxOptions);
		} catch (e) {
			console.log(e);
		}
	},
	encodeHtmlEntity: function (str) {
		return $('<div/>').text(str).html();
	},
	decodeHtmlEntity: function (str) {
		return $('<div/>').html(str).text();
	}
});


/** xcaliper 스크립트 로드 */
document.write('<script src="https://code.i-screamreport.com/xcaliper.js"></script>');
document.write('<script src="/kt/js/base64.js"></script>');
document.write('<script src="/kt/js/xcaliper.js?v=2.1.0.8"></script>');
//$('head').append('<script src="https://code.i-screamreport.com/xcaliper.js"></script>');
//$('head').append('<script src="/es/js/xcaliper.js"></script>');
/**
 * 공통 사용
 */
$("#koBtn").next("br").remove();
$("#koBtn").remove();
$("#enBtn").next("br").remove();
$("#enBtn").remove();

$(document).ready(function () {

	$("#koBtn").next("br").remove();
	$("#koBtn").remove();
	$("#enBtn").next("br").remove();
	$("#enBtn").remove();

	//공통팝업
//	fnOpenKtClosePopup();

	//마이페이지 이동
	$('nav .btn_my').on('click', function(){
//		alert("SAID확인 "+ sessionStorage.getItem("SAID"))
		openWebView("/kt/html/mypage/mypage.html");
//		openWebView("/kt/html/mypage/mypage.html?said="+ sessionStorage.getItem("SAID"));
	})

	//xcaliper 체크
	//fnXcaliperCheck();
	/**
	 * 초등 팝업 목록의 컨텐츠를 선택했을 때 글꼴 색을 변경하도록 공통으로 이벤트 처리
	 */
	$("body").on("click", "div.entireWrap", function (e) {

		if ($(e.target).hasClass("con")){
			if(!$(e.target).hasClass("pop")){
				$(e.target).find('span.tit').css("color", "red");
				fnCheckOpenContentEvent($(e.target).find('span.tit'));
			}
		}
		else if($(e.target).hasClass("num")){
			if(!$(e.target).hasClass("pop")){
				$(e.target).siblings("div.con").find('span.tit').css("color", "red");
				fnCheckOpenContentEvent($(e.target).siblings("div.con").find('span.tit'));
			}
		}
		else if($(e.target).parent().hasClass("con")){
			if(!$(e.target).parent().hasClass("pop")){
				$(e.target).parent().find('span.tit').css("color", "red");
				fnCheckOpenContentEvent($(e.target).parent().find('span.tit'));
			}
		}
		else if($(e.target).parent().hasClass("num")){
			if(!$(e.target).parent().hasClass("pop")){
				$(e.target).parent().siblings("div.con").find('span.tit').css("color", "red");
				fnCheckOpenContentEvent($(e.target).parent().siblings("div.con").find('span.tit'));
			}
		}

		$('div.entireWrap li div.con').parents("li").on("click", function () {

			$(this).siblings().find('span.tit').css("color", "");
		});
	});

	function fnCheckOpenContentEvent(obj){

		var CHKOFF = false;
		var isOnEvent = false;
		$(obj).parent().find('span.tit').parents().each(function () {

			if(CHKOFF || isOnEvent)
				return;

			if (this.tagName == "LI")
				CHKOFF = true;

			if(this.onclick && (""+this.onclick).indexOf("span") < 0){
				isOnEvent = true;
			}
		});

		if (!isOnEvent)
			alert("컨텐츠는 준비 중입니다.");
	}

	/*window.addEventListener("unload", function (e){

		console.log("unload${e}");
		e.target;
	});*/

	/* window.addEventListener('keydown', function(e) {

		if (e.key == "Backspace"){

			var chref = location.href;
			if (chref.indexOf("login") > -1)
				return true;
			if (chref.indexOf("odayStudy") > -1) {

				userLogout();
			}
			else {

				history.back();
			}
		}
	}); */

	//메인화면인 경우
	var chref = location.href;

	if ($('#menubar').length > 0){

		window.backKeyEvent = function() {

			if (chref.indexOf("login") > -1)
				return true;
			if (chref.indexOf("odayStudy") > -1) {

				userLogout();
			}
			else{

				history.back();
			}
		}
	}
	else{

		window.backKeyEvent = function () {
			if (chref.indexOf("login") > -1){
				history.back();
			}else {
				if (chref.indexOf("joinPay") > -1 ){
					if(modYn == "Y"){
			    		$('#commonTitle').html('서비스 가입을 종료하시겠습니까?');
						$('#commonPopup .pop_header').remove();
						$('.btn_comfirm').text('확인');
			       	  	$('#commonPopup').css('display','');
			       	  	$('.pop_btn_wrap .btn_cancel').css('display','');
			       	 	modInfo = "Y";
			       	  	$.fn.openPopup('commonPopup');
		   	    	}else{
		   	    		if(isFromMypage == 'Y'){
		   	    			location.href = 'mypage.html';
		   	    		}else{
		   	    			if(Global.isApp && window.ecohybrid.modifyProfile && sessionStorage.getItem('modProfile') =='Y'){
		   	    				window.ecohybrid.modifyProfile();
		   	    				sessionStorage.removeItem('modProfile');
								sessionStorage.setItem('joinPaid','Y');
		   	    			}
		   	    			closeWebView();
		   	    		}
		   	    	}

				}else if (chref.indexOf("modifyInfo") > -1){
					if(modYn == "Y"){
		    			$('.popup_wrap > div').css('display','none');
			    		$('#commonTitle').html('수정하신 내용이 저장되지 않습니다<br/>이전 화면으로 돌아가시겠습니까?');
			       	  	$('#commonPopup').css('display','');
			       	 	$('#pwPopup').css('display','none');
				      	$('#postPopup').css('display','none');
			       	  	$('.pop_btn_wrap #cancelPop').css('display','');
			       	 	modInfo = "Y";
			       	  	$.fn.openPopup('commonPopup');
		    		}else{
		    			location.href = 'mypage.html?said='+sessionStorage.getItem('SAID');
		//     			history.back();
		    		}
				}else{
					closeWebView();
				}
			}


		}
	}
	//새창 목록의 공통 닫기 css에 닫기 이벤트 설정
	$(".btn-close[data-dismiss!='modal']").on('click', function () {
		closeWebView();
	});
	//새창 목록의 공통 닫기 css에 닫기 이벤트 설정
	$("div.area_top a.closeBtn").on('click', function () {
		closeWebView();
	});
	//중등 메인 새창의 공통 닫기 css에 닫기 이벤트 설정
	$("div.header a.btn-back").on('click', function () {
		closeWebView();
	});
	//중등 목록 새창의 공통 닫기 css에 닫기 이벤트 설정
	$("div.container_wrapper div.btn_before>a").on('click', function () {
		closeWebView();
	});
});


var Global = {
	env: 'dev',
	local: {
		cdn: 'https://xcdn.home-learn.com', 			//CDN
		eco: 'http://localhost:8080/ECOAPI',	//에코 API
		hstu: 'https://dev-stu.home-learn.com',		//구홈런 공통
		hapi: 'https://dev-api.home-learn.com',		//구홈런 초등
		hsch: 'https://dev-api.schooling.co.kr',		//구홈런 중등
		hatt: 'http://182.162.87.56',					//초등출석
		hexm: 'https://dev-exam.home-learn.com',		//오답노트등..
		hpnt: 'https://dev-point.home-learn.com',  //포인트 상품 조회 등..
		ecomk: 'https://dev-market.home-learn.com', //에코(마켓)
		weburl: 'https://dev-any.home-learn.com',		// 웹연동 기본 URL
	},
	dev: {
		cdn: 'https://xcdn.home-learn.com', 					//CDN
		eco: 'https://dev-ecoapi.home-learn.com/ECOAPI',	//에코 API
		hstu: 'https://dev-stu.home-learn.com',			//구홈런 공통
		hapi: 'https://dev-api.home-learn.com',			//구홈런 초등
		hsch: 'https://dev-api.schooling.co.kr',			//구홈런 중등
		hatt: 'http://172.16.150.55',					//초등출석
		hexm: 'https://dev-exam.home-learn.com',		//오답노트등..
		hpnt: 'https://dev-point.home-learn.com',  //포인트 상품 조회 등..
		ecomk: 'https://dev-market.home-learn.com', //에코(마켓)
		weburl: 'https://dev-any.home-learn.com',		// 웹연동 기본 URL
	},
	real: {
		cdn: 'https://xcdn.home-learn.com', 			//CDN
		eco: 'https://ecoapi.home-learn.com',		//에코 API
		hstu: 'https://www.home-learn.com',			//구홈런 공통
		hapi: 'https://api.home-learn.com',			//구홈런 초등
		hsch: 'https://api.schooling.co.kr',		//구홈런 중등
		hatt: 'https://172.16.200.55',					//초등출석
		hexm: 'https://exam.home-learn.com',		//오답노트등..
		hpnt: 'https://con.ozozmall.com',  //포인트 상품 조회 등..
		ecomk: 'https://market.home-learn.co.kr',
		weburl: 'https://kt-home.home-learn.com',		// 웹연동 기본 URL
	},
	isOnHeader: false, //에코서버 요청 여부
	isOnHeader2: false, //홈런서버 요청시 token 설정 여부
	isApp: false, //webview로 실행되었는지 여부
	isDev: false, //컨텐츠 개발버전 여부
	local_cd: "10001",//아이스크림 에듀 API 통신 parameter 코드(모두 같기능 한데 변경될 경우를 위해 공통 변수로 지정)
	confirm_cd: "10001",//아이스크림 에듀 API 통신 parameter 코드(모두 같기능 한데 변경될 경우를 위해 공통 변수로 지정)
	notiCnt: "", //메뉴바의 알림 카운트
	withCd: "UrNhfNis43XMiHybNdBVHWj4dQcoTlvs"
};

//하이브리드 앱으로 실행 여부 확인
if ((location.host != "dev-eco.homelearn.com" && "|Android|iOS|".indexOf(fnGetOS()) > -1) || window.ecohybrid)
	Global.isApp = true;
else
	Global.isApp = false;

	//Global.isApp = false;
/**
 * 서버 환경 별 요청할 API URL 생성
 * target : 대상 서버 (cdn, eco, hstu, hapi, hsch, hatt 중 선택)
 * API : 요청하는 API URL
 */
Global.A_URL = function (target, API) {
	if ('|eco|hapi|'.indexOf(target) > -1) {

		this.isOnHeader = true;
		this.isOnHeader2 = false;
	}
	else if ('|hsch|hstu|hpnt|'.indexOf(target) > -1) {

		this.isOnHeader = false;
		this.isOnHeader2 = true;
	}
	else {

		this.isOnHeader = false;
		this.isOnHeader2 = false;
	}
	EX_HEADER = new Object();
	EX_HEADER["Content-Type"] = EU_HEADER["Content-Type"];

	// 홈런서버 연동시 토큰이 필요한 경우 토근 값 설정
	if (EUSER_INFO && Global.isOnHeader2) {
		if (EUSER_INFO.isSchoolingUser == true)
			EX_HEADER["front-sa"] = EU_HEADER["front-sa"];
		else
			EX_HEADER["token"] = EU_HEADER["token"];
	}

	return Global[Global.env][target] + API;
}

//ECO 서버 통신용 header
var EU_HEADER = new Object();
//기타 서버 통신용 header
var EX_HEADER = new Object();//{"Content-Type":"application/x-www-form-urlencoded"};
//로그인 후 사용자 정보 Object
var EUSER_INFO = new Object();
//메뉴 정보 Object
var TOP_MENU_INFO;
var MENU_NAMES = "|";//목록 앱에서 필터링에서 사용할 메뉴 목록
//B2B정보 Object
var B2B_INFO;// btb_name(이름), btb_back(대표이미지)
var ECO_IS_KT = "Y";// KT앱 실행 여부(Y:KT, N:에코)

//앱 정보
var APP_INFO = {
	version: null,
	name: null
};

EU_HEADER["Content-Type"] = "application/x-www-form-urlencoded";
EU_HEADER["lang"] = fnGetLang();
EU_HEADER["token"] = "";
EU_HEADER["front-sa"] = "";
EU_HEADER["model"] = "ECO-HYBRID";
EU_HEADER["clientType"] = "H";
EU_HEADER["os"] = fnGetOS();

//앱 정보 조회
ifGetAppInfo();
//KT 여부 조회
ifIsKT();

if (Global.isApp){
	//사용자정보 조회
	ifRecvUserInfo();
}
else /* if (sessionStorage.getItem("EU_HEADER") && sessionStorage.getItem("EU_HEADER") != null) */ {
	EUSER_INFO = JSON.parse(sessionStorage.getItem("EUSER_INFO"));
	fnCheckLogin();
}


function modifyProfile(){
	//프로필 변경 후  window.ecohybrid.modifyProfile 호출 후 단말에서 새로고침 요청하도록

	// 20210422 ynjoung modified.
	// 현재 페이지가 지정된 페이지라면 지정된 로직을 처리한다
	// 나머지의 경우 기존과 동일하게 강제 새로고침
	var chref = location.href;
	if(chref.indexOf("selectProfile.html") > 0) {
		// 현재 페이지가 프로필 선택 페이지인 경우, 유료가입 후 closeWebView()로 넘어왔다고 가정하고
		// SessionStorage 전체 갱신 후, KT 부가서비스 가입 여부만 강제로 "가입"으로 저장한다
		// (KT 서버 내부 연동 문제로 바로 갱신되지 않기 때문)
		getAllDataForKt( function() {
			// KT 부가서비스 가입 여부를 강제로 성공으로 입력
			sessionStorage.setItem("IS_JOIN_KT_PRD", true);

			location.reload(true);
		} );
	} else {
		location.reload(true);
	}
}

//xcaliper 중 페이지 이동후 전송이 필요한 경우 처리
function fnXcaliperCheck() {

	console.log('localStorage.getItem("ISLOGIN") : ' + localStorage.getItem("ISLOGIN"));
	console.log('localStorage.getItem("ISLOGOUT") : ' + localStorage.getItem("ISLOGOUT"));

	var href = location.href;
	if (href.indexOf("odayStudy.html") > -1) {//메인 페이지에서만

		//로그인 직후 페이지 이동 한 경우
		if (localStorage.getItem("ISLOGIN") == "Y") {
			xLogin();
			localStorage.removeItem("ISLOGIN");
		}
	}
	else if (href.indexOf("login.html") > -1) { //로그인 화면에서만

		//로그인 직후 페이지 이동 한 경우
		if (localStorage.getItem("ISLOGOUT") == "Y") {
			xLogout();
			localStorage.removeItem("ISLOGOUT");
		}
	}
}
//로그인 Header 정보 설정 및 세션 검증
function fnCheckLogin(isSessionOut){

	if (isSessionOut != 'Y' && EUSER_INFO != null && EUSER_INFO["token"] != null && EUSER_INFO["token"] != "") {

		EU_HEADER["token"] = EUSER_INFO["token"];
		EU_HEADER["front-sa"] = EUSER_INFO["frontSa"];

		if (EUSER_INFO.user_type == "20")
			ifGetBtBInfo();
	}
	else {
//console.trace("알 수 없는 경로로부터 세션 만료 알림 받음", (typeof EUSER_INFO != "undefined" ? EUSER_INFO : null));
		var href = location.href;
		if (href.indexOf("/intro/") > 0) {

		} else if (href.indexOf("login.html") < 0) {

			// 20210324 ynjoung modified.
			// 임시로, xLoginTimeout 함수를 읽어들일 수 없을때는 건너뛴다
			if(typeof xLoginTimeout != "undefined") xLoginTimeout();
			//xLoginTimeout();
			if (href.indexOf("/es/") > -1){

				if (href.indexOf("/html/main") > -1){//메뉴바가 있는 메인 페이지인 경우

					//TODO 확인필요
					//getJoinNSaid();
					//location.reload();

					commonAlert("일시적인 오류가 발생했습니다. <br/>잠시 후 다시 시도해주세요.", null, function () { userLogout("Y") });
				}
				else{//메뉴바가 없는 경우

					if(Global.isApp){

						ifNativeRun("sessionClose");
					}
					else{

						if(opener)
							opener.location.reload();
						window.close();
					}
				}
			}
			else{

				if (href.indexOf("/html/main") > -1) {//메뉴바가 있는 메인 페이지인 경우
//					msCommonAlert("사용자 세션이 만료되었거나, 다른곳에서 로그인하였습니다.", null, function () { userLogout("Y") });

					//getJoinNSaid();
					//location.reload();
					commonAlert("일시적인 오류가 발생했습니다. <br/>잠시 후 다시 시도해주세요.", null, function () { userLogout("Y") });
				}
				else {//메뉴바가 없는 경우

					if (Global.isApp) {

						ifNativeRun("sessionClose");
					}
					else {

						if (opener)
							opener.location.reload();
						window.close();
					}
				}
			}
		}
	}
}

//로그인 정보 저장
function fnLoginOk(data) {

	if (data.errorCode == "0000") {

		var resMap = data.resultMap;
		/**
			* 회원 상태(STATUS) code
			*
			* PAUSE : 학습중지(휴지/미납/환불) 상태
			* CLOSE : 학습만료 상태
			* INVALID_DEVICE : 미허용단말기로 접속함
			* ON_SERVICE : 학습진행 상태
			* FIRST_LOGIN : 첫 로그인 상태
			* NOT_AVAILABLE : 사용자없거나 비밀번호 틀림
			* 빈값: 서비스상태 알수없음
			*/
		if ("|ON_SERVICE|FIRST_LOGIN|".indexOf(resMap.STATUS) > -1){

			EUSER_INFO = resMap;
			EUSER_INFO.frontSa = data.SCHOOLING_INFO.frontSa;
			EUSER_INFO.isSchoolingUser = data.SCHOOLING_INFO.isSchoolingUser;

			EU_HEADER["token"] = EUSER_INFO.token;
			EU_HEADER["front-sa"] = EUSER_INFO.frontSa;

			if (Global.isApp) {
				//단말 로그인 정보 전달
				ifSendUserInfo();
			}
			else {
				sessionStorage.setItem("EUSER_INFO", JSON.stringify(EUSER_INFO));
				sessionStorage.setItem("EU_HEADER", JSON.stringify(EU_HEADER));
			}

			//B2B 사용자인 경우
			if (EUSER_INFO.user_type == "20") {

				var param = {
					user_id: EUSER_INFO.USER_ID
				};
				$.postJSON('eco', '/eco/api/btob/setting', param,
					function (data) {

						if (data && data.success == true && data.btbInfo) {

							B2B_INFO = data.btbInfo;
							//native로 값 전달
							ifSetBtBInfo(B2B_INFO);
							//컨텐츠 개발인 경우
							if (Global.isDev)
								fnLoginTest();
							else //컨텐츠 개발이 아닌경우
								fnGoMain();
						}
					}
					, false);
			}
			else {

				localStorage.removeItem("B2B_INFO");
				B2B_INFO = null;
				//컨텐츠 개발인 경우
				if (Global.isDev)
					fnLoginTest();
				else //컨텐츠 개발이 아닌경우
					fnGoMain();
			}
			console.log("EUSER_INFO.USER_ID:" + EUSER_INFO.USER_ID);
			console.log("EUSER_INFO.STUDENT_NO:" + EUSER_INFO.STUDENT_NO);
		}
		else{

			if(resMap.MESSAGE && resMap.MESSAGE != ""){

				var message = resMap.MESSAGE;
				message = message.replace(/\n/, "<br/>");
				commonAlert(message);
			}
			else
				commonAlert("비밀번호가 맞지 않거나<br/>등록된 사용자가 아닙니다.");
		}
	}
	else {

		commonAlert("비밀번호가 맞지 않거나<br/>등록된 사용자가 아닙니다.");
	}
}

//접속 디바이스 OS
function fnGetOS() {

	if (navigator.userAgent.match(/Android/i) != null) {

		return "Android";
	}
	else if (navigator.userAgent.match(/iPhone|iPad|iPod/i) != null) {

		return "iOS";
	}
	else if (navigator.userAgent.match(/Windows NT/i) != null) {

		return "Windows";
	}
	else {

		return "unknown";
	}
}

//언어
function fnGetLang() {
	var lang = navigator.language;
	if (lang != null || lang != "undefined") {
		lang = lang.toLowerCase().substring(0, 2);
	} else {
		lang = "ko"; //default
	}

	return lang;

}

//로그인 페이지 이동
function fnGoLoginHome(){

	location.href = "/kt/html/intro/selectProfile.html";
}

//메인 화면 이동
function fnGoMain(isSended){

	if (isSended != "Y"){

		xLogin(fnGoMain);
		xSEND_CHECK(fnGoMain);
		return;
	}

	if(EUSER_INFO.isSchoolingUser == false){

		if (B2B_INFO && B2B_INFO.btb_name && B2B_INFO.btb_name != ""){//B2B인경우

			if (B2B_INFO.schedule_yn == "Y")//학습계획 사용하는 경우
				location.href = "/es/html/main/eB2bTodayStudy.html";
			else
				location.href = "/es/html/main/eMyClassroom.html";
		}
		else
			location.href = "/es/html/main/todayStudy.html";
	}else{

		if (B2B_INFO && B2B_INFO.btb_name && B2B_INFO.btb_name != ""){//B2B인경우

			if (B2B_INFO.schedule_yn == "Y")//학습계획 사용하는 경우
				location.href = "/ms/html/main/mB2BTodayStudy.html";
			else
				location.href = "/es/html/main/mB2BMyRoom.html";
		}
		else
			location.href = "/ms/html/main/mTodayStudy.html";
	}
}

//로컬 html include
function includeHtmlKt(includeSectionId, htmlSrc, callback) {
	try {
		$.ajax({
			type: "GET",
			url: htmlSrc,
			success: function (res) {
				//$('#' + includeSectionId).html(res).promise().done(Global.bindEvent);
				$(includeSectionId).append(res).promise().done(Global.bindEvent);

				if (callback != null) {
					callback();
				}
			},
			error: function () {
				//alert('include를 실패 하였습니다. 파일 경로를 확인해 주세요.');
			},
			cache: false,
			dataType: 'html'
		});
	} catch (e) {
		console.log(e);
		debugLog("includeHtml Error=" + e);
	}
}

//로컬 html include
function includeHtml(includeSectionId, htmlSrc, callback) {
	try {
		$.ajax({
			type: "GET",
			url: htmlSrc,
			success: function (res) {
				//$('#' + includeSectionId).html(res).promise().done(Global.bindEvent);
				$(includeSectionId).html(res).promise().done(Global.bindEvent);

				//언어 설정에 따른 화면 변경
//				fnSetLanguage('#' + includeSectionId);
				fnSetLanguage(includeSectionId);

				if (callback != null) {
					callback();
				}
			},
			error: function () {
				//alert('include를 실패 하였습니다. 파일 경로를 확인해 주세요.');
			},
			cache: false,
			dataType: 'html'
		});
	} catch (e) {
		console.log(e);
		debugLog("includeHtml Error=" + e);
	}
}

function fnSetLanguage(scope){
	let lang = EU_HEADER.lang;
	scope = nvl(scope);

	if (typeof langData[lang] != "undefined") {
		let textList = Array.prototype.slice.call($(scope + ' [data-text]'));

		$.each(textList, function(index, v){

			let child = v.firstChild;
			while (child) {
				if (child.nodeType == 3) {
					var split_text = v.dataset.text.split(';');

					if (split_text.length > 1) {
						child.data = commonMessage(split_text[0], split_text.splice(1));
					} else {
						child.data = commonMessage(v.dataset.text);
					}
					break;
				}
				child = child.nextSibling;
			}
		});

		let urlList = Array.prototype.slice.call($(scope + ' [data-url]'));
		$.each(urlList, function(index, v){
			v.src = langData[lang][v.dataset.url];
		});

		let placeholderList = Array.prototype.slice.call($(scope + ' [data-placeholder]'));
		$.each(placeholderList, function(index, v){
			v.placeholder = langData[lang][v.dataset.placeholder];
		});
	}
}


//TOP메뉴
function getTopMenu() {
	if (!$.isEmpty(TOP_MENU_INFO)) {
		fnTopMenuOk(TOP_MENU_INFO);
	} else {
		if (!$.isEmpty(EU_HEADER.token)) {
			var param = {
				user_id: EUSER_INFO.USER_ID,
				isSchoolingUser: getIsSchoolingUser()
			};

			$.postJSON('eco', '/eco/api/menu/top', param, fnTopMenuOk, false);
		}
	}
}

function fnTopMenuOk(resData) {

	var isSchoolingUser = getIsSchoolingUser();

	if (isSchoolingUser == 'N') {
		//초등
		fnSetEsTopMenu(resData);
	} else if (isSchoolingUser == 'Y') {
		//중등
		fnSetMsTopMenu(resData);
	}
}

//상단 알림정보 조회
function fnGetTalkInfo(){

	var param = {
		user_id: EUSER_INFO.USER_ID,
		student_no: EUSER_INFO.STUDENT_NO,
		user_grade: EUSER_INFO.GRADE_GBN
	};
	$.postJSON('hapi', '/talk/TalkInfo.json', param, fnGetTalkInfoOk, false);
}

//상단 알림정보 조회결과 처리
function fnGetTalkInfoOk(resData){

	if(resData.resultCode == "0"){
		var notiCnt = 0;
		var talkCnt = 0;
		var eventCnt = 0;
		var magazCnt = 0;
		var questionCnt = 0;
		//{ "": 0, "": 0, "resultCode": 0, "requestCode": "TalkInfo", "": 0, "": 0, "": 0 }
		talkCnt += parseInt(resData.unreadTalkTeacherCnt, 10);
		talkCnt += parseInt(resData.unreadTalkParentCnt, 10);

		eventCnt = parseInt(resData.unreadNewsCnt, 10);

		magazCnt = parseInt(resData.unreadMagazineCnt, 10);

		questionCnt = parseInt(resData.unreadQuestionCnt, 10);

		notiCnt = talkCnt + eventCnt + magazCnt + questionCnt;

		if ($('.homeLearnMagazine') && $('.homeLearnMagazine').length > 0) {

			if (magazCnt > 0)
				$('.homeLearnMagazine').html('<span class="alert">' + magazCnt + '</span>');
			else
				$('.homeLearnMagazine').html("");
		}

		if ($('.eventBox') && $('.eventBox').length > 0) {

			if (eventCnt > 0)
				$('.eventBox').html('<span class="alert">' + eventCnt + '</span>');
			else
				$('.eventBox').html("");
		}

		if ($('.homeLearnTalk') && $('.homeLearnTalk').length > 0) {

			if (talkCnt > 0)
				$('.homeLearnTalk').html('<span class="alert">' + talkCnt + '</span>');
			else
				$('.homeLearnTalk').html("");
		}

		if ($('.askMyQuestion') && $('.askMyQuestion').length > 0) {

			if (questionCnt > 0)
				$('.askMyQuestion').html('<span class="alert">' + questionCnt + '</span>');
			else
				$('.askMyQuestion').html("");
		}

		if(notiCnt > 0){

			Global.notiCnt = notiCnt;
			if($('i.menubar_bell')){

				$('i.menubar_bell').html('<label class="noti">' + Global.notiCnt + '</label>');
			}
		}
		else{

			Global.notiCnt = "";
			if ($('.menubar_bell .noti').length > 0)
				$('.menubar_bell .noti').remove();
		}
	}
}

//초등 TOP메뉴
function fnSetEsTopMenu(resData) {

	var allMenuUrl = "/es/html/main/eAllMenu.html?grade=" + EUSER_INFO.GRADE_GBN;
	var onClass = ''
	var template = '';

	template += '<div class="left_side">';
	template += '<i class="menubar_menu_btn" onClick="openWebView(\'' + allMenuUrl + '\')"></i>';
	template += ' <div class="scrollWrap">';
	template += ' <a href="/es/html/main/todayStudy.html" class="menu_item" >오늘의 학습</a>';

	if (!$.isEmpty(resData) && resData.errorCode == "0000") {

		if ($.isEmpty(TOP_MENU_INFO)) {
			TOP_MENU_INFO = resData;
		}

		$.each(resData.menuList, function (index, item) {

			onClass = '';

			if (!$.isEmpty(item.menu_name)) {

				if (item.menu_cd == REQ_MENU_CD) {
					onClass = "on";
				}
				template += '<a href="' + item.action + '" class="menu_item ' + onClass + '" >' + item.menu_name + '</a>';
				//구매한 메뉴명 저장
				MENU_NAMES += item.menu_name + "|";
			}
		});
	}

	template += ' </div>';
	template += '<a href="#" onclick="openWebView(\'/es/html/special/eGlobal.html?cate_grade_div=E\')" class="roundButton"><span data-text="SUB_107_018">글로벌리더십</span></a>';
	template += '</div>';

	template += '<div class="right_side">';
	//template += '<div style="width: 35px; height: auto"><img src="../../img/common/menubar_icon.png" alt="아이콘이미지" class="width_100"></div>';
	template += ' <a href="#" onclick="ifCallScheme(\'talk://main\')" ><i class="menubar_bell">';

	if (Global.notiCnt && Global.notiCnt != ""){

		template += '<label class="noti">' + Global.notiCnt + '</label>';
	}

	template += '</i></a>';
	template += ' <a href="#" onclick="openWebView(\'/es/html/main/eMyRoom.html\')"><i class="menubar_personal"></i></a>';
	template += ' <a href="#"><i class="menubar_config"></i></a>';
	template += ' <a href="#"><i class="menubar_wifi"></i></a>';
	template += ' <i class="menubar_battery"></i>';
	template += ' <span class="time"><span data-text="COM_001_015">오후</span> 01:36</span>';
	template += ' <a href="#" onclick="ifExitApp()"><i class="menubar_quit"></i></a>';
	template += '</div>';

	$("#menubar").append(template);
	fnGetTalkInfo();
	/*	$("#menubar .left_side a").click(function(){
			$(this).addClass('on');
		});*/
	//학습안내 팝업 추가
	if(location.pathname.indexOf("html/main") > -1){

		$(".studyGuide").on("click", fnGetEsStudyInfo);
	}
}
//초등 메인 학습안내
function fnGetEsStudyInfo(){

	var html = "";
	html += '<div class="modal modal-big modal-info schoolStudy fade" id="introSchoolStudy" data-backdrop="static" tabindex="-1" role="dialog" >';
	html += '  <div class="modal-dialog modal-dialog-centered" role="document">';
	html += '    <div class="modal-content">';
	html += '      <div class="modal-header">';
	html += '        <span class="modal-title"><img src="../../img/element/schoolStudy/studyTest/ic_info.png" alt=""><span data-text="SUB_001_005">학습안내</span></span>';
	html += '        <a href="#" class="close closeBox" data-dismiss="modal" aria-label="Close"></a>';
	html += '      </div>';
	html += '      <div class="modal-body">';
	html += '        <div class="box-grey">';
	html += '          <div class="title-area">';
	html += '            <p class="tit"><span data-text="HOM_001_002">학교공부</span></p>';
	html += '            <p class="desc"><span data-text="SUB_003_003">학교공부에 최적화된 전학년/전과목 콘텐츠로 무제한 학습을 할 수 있어요</span></p>';
	html += '          </div>';
	html += '          <div class="box-card">';
	html += '            <ul class="clearfix">';
	html += '              <li>';
	html += '                <div class="img"><img src="../../img/element/schoolStudy/studyTest/info_pop_01.png" alt=""></div>';
	html += '              </li>';
	html += '              <li>';
	html += '                <div class="img"><img src="../../img/element/schoolStudy/studyTest/info_pop_02.png" alt=""></div>';
	html += '              </li>';
	html += '              <li>';
	html += '                <div class="img"><img src="../../img/element/schoolStudy/studyTest/info_pop_03.png" alt=""></div>';
	html += '              </li>';
	html += '              <li>';
	html += '                <div class="img"><img src="../../img/element/schoolStudy/studyTest/info_pop_04.png" alt=""></div>';
	html += '              </li>';
	html += '            </ul>';
	html += '          </div>';
	html += '        </div>';
	html += '      </div>';
	html += '    </div>';
	html += '  </div>';
	html += '</div>';

	var rModal = $(html);
	$('#introSchoolStudy').remove();
	$(document.body).append(rModal);
	//$('#introSchoolStudy').css("display", "block");
	$('#introSchoolStudy').modal('show')
	$('.modal_content .close').on("click", function () {
		$('#introSchoolStudy').remove();
	});
}

//중등 TOP메뉴
function fnSetMsTopMenu(resData) {
	var onClass = ''
	var template = '';

	template += '<div class="left_side">';
	template += '<i class="ms-header_menu_icon" onClick="openWebView(\'/ms/html/main/mAllMenu.html\')"></i>';
	template += '<div class="scrollWrap">';
	template += '<a href="/ms/html/main/mTodayStudy.html"  data-text="HOM_001_001">오늘의 학습</a>';

	if (!$.isEmpty(resData) && resData.errorCode == "0000") {

		if ($.isEmpty(TOP_MENU_INFO)) {
			TOP_MENU_INFO = resData;
		}

		$.each(resData.menuList, function (index, item) {
			onClass = '';

			if (!$.isEmpty(item.menu_name)) {

				if (item.menu_cd == REQ_MENU_CD) {
					onClass = "on";
				}

				template += '<a href="' + item.action + '" class="' + onClass + '">' + item.menu_name + '</a>';
				//구매한 메뉴명 저장
				MENU_NAMES += item.menu_name + "|";
			}
		});
	}

	template += '<a href="#" onclick="openWebView(\'/ms/html/nadero/mNadero.html\')" class="outline"><span data-text="HOM_001_008">나대로</span></a>';
	template += '</div>';
	template += '</div>';

	template += '<div class="right_side">';
	template += ' <i class="nm_2"></i>';
	template += ' <i class="nm_1"></i>';
	template += ' <span class="time">오후 2:46</span>';
	//	template += ' <i class="alarm"><label class="noti">10</label></i>';
	template += ' <i class="setting" onclick="fnOpenMsSetting()"></i>';
	template += ' <i class="power" onclick="ifExitApp()"></i>';
	template += '</div>';

	$("#ms_menubar").append(template);

}

//중등 설정
function fnOpenMsSetting(){

	if ($("._settingPopup").length > 0) {
		$("._settingPopup").remove();
	}
	$(document.body).append('<div id="layers" class="_settingPopup">');

	includeHtml('._settingPopup', '../../html/main/mSettingPopup.html', function() {

		if(!$.isEmpty(onOpen) && typeof onOpen == "function"){
			onOpen();
		}
	});
}



//kt 메인 공통 종료 팝업
function fnOpenKtClosePopup(){

	if ($(".opacity7").length > 0) {
		$(".opacity7").remove();
	}

		$(document.body).append('<section class="popup_wrap opacity7"></section>');

		if(!$('.popup_common').hasClass('end')){
			includeHtmlKt('.opacity7', '../../html/common/closePopup.html', function() {
			   	$('body > .container > .btn_close').on('click', function () {
			   		$.fn.openPopup('popupSample');
			   	});
			   	$('#popupSample .btn_close_popup').on('click', function () {
			   		$.fn.closePopup('popupSample');
			   	});
			});
		}

		if(!$('.popup_common').hasClass('joinPaidIng')){
			includeHtmlKt('.opacity7', '../../html/common/joinPopup.html', function() {

	//			$.fn.openPopup('joinPopup');
				var ds = sessionStorage.getItem("DEMO_REST_DATE");
				var dd = String(ds).length === 1 ? '0' + ds : ds;
				$('#remainDate').text(dd+'일');

	//		   	$('#closeJoinPopup').on('click', function () {
	//		   		$.fn.closePopup('joinPopup');
	//		   	});
			});
		}

		if(!$('.popup_common').hasClass('joinPaidEnd')){
			includeHtmlKt('.opacity7', '../../html/common/expPopup.html', function() {

	//			$.fn.openPopup('expPopup');

	//		   	$('#closeExpPopup').on('click', function () {
	//		   		$.fn.closePopup('expPopup');
	//		   	});
			});
		}
		setTimeout(function(){
			$('nav .btn_joinPaid').on('click', function(){
				if(sessionStorage.IS_EXPIRE_DEMO == false || sessionStorage.IS_EXPIRE_DEMO == "false" ){
					var ds = sessionStorage.getItem("DEMO_REST_DATE");
					var dd = String(ds).length === 1 ? '0' + ds : ds;
					$('#remainDate').text(dd+'일');
					$('#expPopup').css('display', 'none');
					$('#joinPopup').css('display', '');
					$('#joinPopup .pop_btn_wrap').html('<a href="#none" class="btn_joinPaid" onClick="goJoinPay()"  style="font-size: 1.8vw!important">서비스 가입하기</a>');
					$.fn.openPopup('joinPopup');
				}else{
					$('#joinPopup').css('display', 'none');
					$('#expPopup').css('display', '');
					$('#expPopup .pop_btn_wrap').html('<a href="#none" class="btn_joinPaid" onClick="goJoinPay()" style="font-size: 1.8vw!important">서비스 가입하기</a>');
					$.fn.openPopup('expPopup');
				}
			})
		 }, 500);

}

//학생구분 (Y:중등, N:초등, B:리틀홈런)
function getIsSchoolingUser() {

	var gubun;

	if (EUSER_INFO != null) {

		if (!$.isEmpty(EUSER_INFO.frontSa)) {
			gubun = 'Y'; //중등
		} else if (EUSER_INFO.GRADE_GBN == '0') {
			gubun = 'B'; //리틀홈런
		} else {
			gubun = 'N'; //초등
		}

	}

	return gubun;

}

//캐릭터이미지 src
function fnGetCharacterSrc(crtId) {
	var fSrc = "../../img/modify/character_character";
	var imgSrc = "";

	var crtNoArr = crtId.split("_");

	if (crtNoArr.length == 2) {

		if (crtNoArr[0] == 'ddurudduru') {
			imgSrc = fSrc + "_trtr_" + crtNoArr[1] + ".webp";
		} else if (crtNoArr[0] == 'bingbing') {
			imgSrc = fSrc + "_bb_" + crtNoArr[1] + ".webp";
		} else if (crtNoArr[0] == 'bangul') {
			imgSrc = fSrc + "_bw_" + crtNoArr[1] + ".webp";
		} else if (crtNoArr[0] == 'kwon') {
			imgSrc = fSrc + "_g_" + crtNoArr[1] + ".webp";
		} else if (crtNoArr[0] == 'hong') {
			imgSrc = fSrc + "_h_" + crtNoArr[1] + ".webp";
		}
	}

	return imgSrc;

}

//중등 학년 변환
function fnGetMsGrade(grade){

	var msGrade='';

	if(grade == '7'){
		msGrade =  "10002";
	}else if(grade == '8'){
		msGrade =  "10003";
	}else if(grade == '9'){
		msGrade =  "10004";
	}else if(grade == '10'){ //고1
		msGrade =  "10005";
	}else if(grade == 'B'){ //예비중학
		msGrade =  "10001";
	}

	return msGrade;
}

//내앱서랍 앱사이즈 변환
function fnByteCalculation(bytes) {
    var bytes = parseInt(bytes);
    var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(bytes)/Math.log(1024));
    var result = '';
    if(e == "-Infinity"){
      	result = "0 "+s[0];
    }else{
      	result = Math.round((bytes/Math.pow(1024, Math.floor(e))).toFixed(2)) +" "+s[e];
    }
	return result;
}

/* ======================== //APP ======================== */
/*
 * command : native 함수명
 * param : 파라미터 (json 형식 문자열)
 * callback : 결과를 전달받을 callback 함수명
 */
function ifNativeRun() {

	if (arguments == null || arguments.length == 0) {
		console.error("not found navtive command!!");
		return false;
	}

	console.log("native command : " + arguments[0] + ", parmas number : " + arguments.length);
	//for (var n = 0; n < arguments.length; n++) { console.log(arguments[n]); }

	if (Global.isApp) {

		if ("Android" == fnGetOS() || window.ecohybrid) {

			/*if (command == "getUserInfo")
				return window.ecohybrid.getUserInfo();
			else if (command == "setUserInfo")
				return window.ecohybrid.setUserInfo(param);
			else if (command == "openWebview")
				return window.ecohybrid.openWebview(param);
			else if (command == "closeWebview")
				return window.ecohybrid.closeWebview();
			else if (command == "showToastPop")
				return window.ecohybrid.displayToastPopup(param);
			else if (command == "userLogout")
				return window.ecohybrid.userLogout();*/

			switch (arguments.length) {

				case 1:
					window.ecohybrid[arguments[0]]();
					break;
				case 2:
					window.ecohybrid[arguments[0]](arguments[1]);
					break;
				case 3:
					window.ecohybrid[arguments[0]](arguments[1], arguments[2]);
					break;
				case 7:
					window.ecohybrid[arguments[0]](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
					break;
				default:
					console.log("undefined native command : " + arguments[0] + ", parmas number : " + arguments.length);
			}
		}
		else if ("iOS" == fnGetOS()) {		// 아이폰

			switch (arguments.length) {

				case 1:
					window.webkit.messageHandlers[arguments[0]].postMessage('');
					break;
				case 2:
					window.webkit.messageHandlers[arguments[0]].postMessage(arguments[1]);
					break;
				case 3:
					window.webkit.messageHandlers[arguments[0]].postMessage(arguments[1], arguments[2]);
					break;
				case 7:

					var param = {
						svc_flag: ""+arguments[1],
						studyCourceId: ""+arguments[2],
						gradeDiv: ""+arguments[3],
						termCd: ""+arguments[4],
						subjViwNm: ""+arguments[5],
						preSubjNm: ""+arguments[6]
					};

					window.webkit.messageHandlers[arguments[0]].postMessage(param);
					break;
				default:
					console.log("undefined native command : " + arguments[0] + ", parmas number : " + arguments.length);
			}
		}
	}
	else {

		if (arguments[0] == "getBtBInfo"){

			B2B_INFO = JSON.parse(localStorage.getItem("B2B_INFO"));
		}
		//console.log("window natvie command call=========================================== " + arguments[0]);
	}
}

/* ======================== Interface ======================== */
//로그인 정보 전달
function ifSendUserInfo() {

	var obj = { "UserInfo": EUSER_INFO };
	ifNativeRun("setUserInfo", JSON.stringify(obj));
}

//사용자 정보 조회
function ifRecvUserInfo() {

	ifNativeRun("getUserInfo");
}

//B2B 정보 전달
function ifSetBtBInfo(param) {

	localStorage.setItem("B2B_INFO", JSON.stringify(param));
	var obj = { "btbInfo": param };
	ifNativeRun("setBtBInfo", JSON.stringify(obj));
}

//B2B 정보 요청 (callback : callbackBtBInfo)
function ifGetBtBInfo() {

	ifNativeRun("getBtBInfo");
}

//웹뷰 새창 열기
function openWebView(link) {
	// xCaliper 전역변수로 등록한 URL: 페이지명 쌍 객체를 불러올 수 있고,
	// open하려는 URL이 xCaliper 목록으로 등록되어 있다면 xCaliper를 호출한다
	if(typeof ES_PAGES != "undefined") {
		//var path = location.pathname;
		var path = location.protocol+"//"+location.hostname+link;
		if(Object.keys(ES_PAGES).includes(link)) {
			xNaviEvent2({
				name: ES_PAGES[link],
				content_desc: ES_PAGES[link],
				objType: "M",
//				url: path
			});
		}
	}

	if (Global.isApp) {

		if (link != null && link.indexOf("/") == 0)
			ifNativeRun("openWebview", Global[Global.env].weburl + link);
		else if(link != null && link.indexOf("http") != 0 && link.indexOf("://") > -1) //http로 시작하지 않는 scheme 인경우 callscheme로 전달
			ifCallScheme(link);
		else
			ifNativeRun("openWebview", link);
	} else {
		//console.log(link);
		window.open(link);
	}
}

// 브라우저로 새 창 열기
function openWebBrowser(link) {

	if (Global.isApp) {

		if (link != null && link.indexOf("/") == 0)
			ifNativeRun("openWebBrowser", Global[Global.env].weburl + link);
		else if(link != null && link.indexOf("http") != 0 && link.indexOf("://") > -1) //http로 시작하지 않는 scheme 인경우 callscheme로 전달
			ifCallScheme(link);
		else
			ifNativeRun("openWebBrowser", link);
	} else {
		//console.log(link);
		window.open(link);
	}

}

//APP 종료
function ifExitApp() {

	if (Global.isApp) {
		var href = location.href;
		if (href.indexOf("/es/") > -1)
			commonConfirm("홈런을 종료 하시겠습니까?", "btnCancel", ifExitAppRun, null);
		else
			msCommonConfirm("홈런을 종료 하시겠습니까?", "btnCancel", ifExitAppRun, null);
	}
	else{
		userLogout();
	}
}

//APP 종료 실행
function ifExitAppRun() {
	if (Global.isApp) {
		ifNativeRun("exitApp");
	}
	else { //PC인 경우 로그아웃 처리
		console.log("PC에서 앱 종료 명령 실행")
	}
	userLogoutCallback();
}


//웹뷰 새창 닫기
function closeWebView() {
	if (Global.isApp) {
		ifNativeRun("closeWebview");
	} else {
		window.close();
	}
}

//토스트 팝업 노출
function showToastPop(msg) {
	if (Global.isApp) {
		ifNativeRun("displayToastPopup", msg);
	} else {
		alert(msg);
	}
}

//로딩바 보이기
function showLoadingbar() {

	ifNativeRun("showLoadingbar");
}

//로딩바 닫기
function hideLoadingbar() {

	ifNativeRun("hideLoadingbar");
}

//로그아웃
function userLogout(isNoMsg) {

	if (isNoMsg) {

		fnRunLogOut();
	}
	else {
		var href = location.href;
		if (href.indexOf("/es/") > -1)
			commonConfirm("로그아웃 하시겠습니까?", "btnCancel", fnRunLogOut, null);
		else
			msCommonConfirm("로그아웃 하시겠습니까?", "btnCancel", fnRunLogOut, null);
	}
}

function fnRunLogOut() {

	fnGoLoginHome();

//	if (Global.isApp) {
//		ifNativeRun("userLogout", null, null);
//	}

	xLogout();
	xSEND_CHECK(userLogoutCallback);
}

/**
 * 스킴 호출
 * - 내 오답노트 : "learningstatus://errnote”
 * - 내공상자 : "learningstatus://abilitystudy"
 * - AI생활기록부 : "ai://report”
 * - 이벤트 : "event://eventmain”
 * - 홈런톡 : "talk://main”.
 * - 홈런매거진 : "talk://zine"
 * - 내 문제질문 : "learningstatus://question"
 * 홈런매거진 메뉴 영역에 다음 메뉴가 노출되는 경우도 있습니다.
 * - 학습심리검사 : "studypsychology://studypsychologymain"
 */
function ifCallScheme(param) {

	ifNativeRun("callScheme", param);
}

/**
 * 홈런 for anydevice 앱의 정보를 native로 부터 조회 (응답받는 callback 함수 : callbackAppInfo)
 */
function ifGetAppInfo(){

	if (Global.isApp == false) {

		console.log(`getAppInfo`);

		var appInfo = {
			appInfo: {
				version: "1.0.0",
				name: "홈런 for any device"
			}
		}
		callbackAppInfo(JSON.stringify(appInfo));
	}
	else {
		ifNativeRun("getAppInfo");
	}
}

/**
 * KT앱에서 실행했는지 여부를 조회한다.(응답받는 callback 함수 : callbackIsKT)
 */
function ifIsKT() {

	if (Global.isApp == false) {

		console.log(`native interface ifIsKT`);
	}
	else {
		ifNativeRun("isKT");
	}
}

/*function getInitVariables(){

	return ifNativeRun("getInitVariables");
}*/
/* ======================== //Interface ======================== */

/* ======================== Callback ======================== */

/**
 * 홈런 for anydevice 앱의 정보를 native로 부터 조회 callback (ifGetAppInfo 함수 실행 뒤 호출)
 * @param {json string} appInfo
 */
function callbackAppInfo(appInfo){

	try {

		console.log(`callbackAppInfo : [${appInfo}]`);
		if (appInfo != null && appInfo != "") {

			if (appInfo.indexOf("\"") == 0)
				appInfo = appInfo.substring(1);

			if (appInfo.lastIndexOf("\"") == (appInfo.length - 1))
				appInfo = appInfo.substring(0, appInfo.length - 1);

			var appInfo = JSON.parse(appInfo);

			if (appInfo && appInfo.appInfo) {

				APP_INFO = appInfo.appInfo;
			}
		}
	} catch (err) {
		console.error(err);
	}
}

/**
 * KT앱에서 실행했는지 여부 조회 callback (ifIsKT 함수 대응)
 * @param {String Y:KT, N:에코} isKT
 */
function callbackIsKT(isKT) {

	console.log(`callbackIsKT : [${isKT}]`);
	if (isKT != null && isKT != "") {

		ECO_IS_KT = isKT;
	}
}

//getUserInfo() 콜백
function userInfoCallback(userInfo) {
	console.log(`userInfoCallback =========================================================  `);
	//사용자정보 set
	var userInfoMap = JSON.parse(userInfo);
	EUSER_INFO = userInfoMap.UserInfo;
	if(!sessionStorage.getItem("EUSER_INFO"))
		sessionStorage.setItem("EUSER_INFO", JSON.stringify(EUSER_INFO));
	fnCheckLogin();
}

//userLogout() 콜백
function userLogoutCallback() {

	if (!Global.isApp) {
		sessionStorage.clear();
	}
	//localStorage.clear();

	EUSER_INFO = null;
	EU_HEADER = null;
	localStorage.setItem("ISLOGOUT","Y");//xcaliper 연동을 위해 설정
	fnGoLoginHome();
}

//getBtBInfo() callback
function callbackBtBInfo(btbInfo) {

	var btbInfoMap = JSON.parse(btbInfo);
	B2B_INFO = btbInfoMap.btbInfo;

	//fnB2bLoginSet 함수가 정의 되어 있는 경우 B2B정보 전달
	if (fnB2bLoginSet && typeof fnB2bLoginSet === 'function'){
		fnB2bLoginSet(btbInfo);
	}
}

/**
 * 홈런 for anydevice 앱의 정보를 native로 부터 조회 callback (ifGetAppInfo 함수 실행 뒤 호출)
 * @param {json string} appInfo
 */
function callbackAppInfo(appInfo){

	try {

		console.log(`callbackAppInfo : [${appInfo}]`);
		if (appInfo != null && appInfo != "") {

			if (appInfo.indexOf("\"") == 0)
				appInfo = appInfo.substring(1);

			if (appInfo.lastIndexOf("\"") == (appInfo.length - 1))
				appInfo = appInfo.substring(0, appInfo.length - 1);

			var appInfo = JSON.parse(appInfo);

			if (appInfo && appInfo.appInfo) {

				APP_INFO = appInfo.appInfo;
			}
		}
	} catch (err) {
		console.error(err);
	}
}

//native에서 오늘의 학습 갱신이 필요한 경우 호출
function callTodayReload(){
	var href = location.href;
	if (href.indexOf("odayStudy") > -1) {
		var year = sessionStorage.getItem('ts_year');
		var month = sessionStorage.getItem('ts_month');
		var day = sessionStorage.getItem('ts_day');
		if(!$.isEmpty(year) && !$.isEmpty(month) && !$.isEmpty(day) ){
			sessionStorage.removeItem('ts_year');
			sessionStorage.removeItem('ts_month');
			sessionStorage.removeItem('ts_day');
			location.href = "todayStudy.html?year="+year+"&month="+month+"&day="+day
		}else{
			location.reload();
		}
	}
}

//세션종료시 native에서 호출하는 callback (session 만료 이벤트시 호출)
function callSessionClose(){
//console.trace("native에서 세션 만료 알림 받음",  (typeof EUSER_INFO != "undefined" ? EUSER_INFO : null));
	fnCheckLogin("Y");
}

/**
 * 학교학습 컨텐츠에서 native를 통해 xCaliper연동 시 데이터를 web으로 전달
 */
/*
callStudyxCaliper called:
eventType: AssignableEvent
actionType: Paused
studyId: 12719
studyType: AssignableDigitalResource
studyTitle: 24장. 1분보다 작은 단위는 무엇일까요
studyKind: CourseSection
studyProgDay: 2021-04-24|2065085|49
edappVersion: 01.00.08
edappName: 올레tv 홈스쿨 X AI홈런 */
function callStudyxCaliper(eventType, actionType, studyId, studyType, studyTitle, studyKind, studyProgDay, edappVersion, edappName){

	//xESStudyEnd(eventType, actionType, studyId, studyType, studyTitle, studyKind, studyProgDay, edappVersion, edappName);

	/* console.log("callStudyxCaliper called:" +
		"\neventType: " + eventType +
		"\nactionType: " + actionType +
		"\nstudyId: " + studyId +
		"\nstudyType: " + studyType +
		"\nstudyTitle: " + studyTitle +
		"\nstudyKind: " + studyKind +
		"\nstudyProgDay: " + studyProgDay +
		"\nedappVersion: " + edappVersion +
		"\nedappName: " + edappName); */
	var version = "1.0", appname = "KT초등";
	if(typeof APP_INFO != "undefined") {
		if(APP_INFO.hasOwnProperty("version")) version = APP_INFO.version;
		if(APP_INFO.hasOwnProperty("name")) appname = APP_INFO.name;
	}

	if(typeof xAssignEvent == "function") {
		xAssignEvent(
			actionType,				// a_type
			studyId,				// obj_id
			studyType,				// objType
			studyTitle,				// name
			studyKind,				// kind
			"",						// keyword
			"",						// learn
			"",						// mediaType
			"",						// attempts
			"",						// score
			"",						// submits
			studyProgDay
		);
	}

}

/*
 * 오늘의 학습용 XCaliper Caller
 */
function callTodayxCaliper(eventType, actionType, studyId, studyType, studyTitle, studyKind, studyProgDay, edappVersion, edappName) {
	console.log("callTodayxCaliper 호출됨: ", eventType, "/", actionType, "/", studyId, "/", studyType, "/", studyTitle, "/", studyKind, "/", studyProgDay, "/", edappVersion, "/", edappName);

	const APP_NAME = "올레tv 홈스쿨 X AI홈런";
	const BASE_ACTION = "com.homelearn.aimath";

	if(actionType == 0)
		actionType = "Start";
	else if(actionType == 1)
		actionType = "Pause";
	else if(actionType == 2)
		actionType = "Completed";

	var uniqueAction = "";
	if(actionType.toLowerCase() == "started")
		uniqueAction = "AssignableStudyStarted";
	else if(actionType.toLowerCase() == "paused")
		uniqueAction = "AssignablePaused";
	else if(actionType.toLowerCase() == "completed")
		uniqueAction = "AssignableStudyCompleted";

	if(studyKind == "S")
		studyKind = "CourseSection";
	else if(studyKind == "U")
		studyKind = "Chapter";

	// API를 통해 전달받은 오늘의 학습 목록 중, service_id(=studyId)에 해당하는 학습이 있는지 찾아본다
	var studyData = {};
	var serviceNm = "";
	if(typeof window.TODAYLIST != "undefined") {
		var data = window.TODAYLIST.filter(function(study) { return study.service_id == studyId; });

		// service_id에 해당하는 학습 데이터가 있다면
		if(data.length > 0) {
			studyData = data[0];

			if(studyData.hasOwnProperty("service_nm")) {
				var splitedServiceNm = studyData.service_nm.split("@@");
				if(splitedServiceNm.length >=3) {
					serviceNm = studyData.service_nm.split("@@")[2]
				}
			}
		}
	}

	var caliperDataObj = {
		"EVENT_TYPE": "AssignableEvent",
		"ACTION_TYPE": actionType,
		"UNIQUE_ACTION": uniqueAction,
		"OBJ_ID": studyId,
		"OBJ_NAME": (studyData.hasOwnProperty("contentTitle") ? studyData["contentTitle"] : ""),
		"OBJ_SVC_NAME": serviceNm,
		"OBJ_PRE_SUB_NAME": (studyData.hasOwnProperty("pre_subj_nm") ? studyData["pre_subj_nm"] : ""),
		"OBJ_GRADE_GBN": (studyData.hasOwnProperty("grade_gbn") ? studyData["grade_gbn"] : ""),
		"OBJ_SEMESTER_GBN": (studyData.hasOwnProperty("semester_gbn") ? studyData["semester_gbn"] : ""),
		"OBJ_PROG_DAY": (studyData.hasOwnProperty("prog_day") ? studyData["prog_day"] : ""),
		"EDAPP_NAME": APP_NAME
	};

	var caliperData = "";

	var caliperDataObjKeys = Object.keys(caliperDataObj);

	for(var i = 0; i < caliperDataObjKeys.length; i++) {
		var key = caliperDataObjKeys[i];
		var data = caliperDataObj[key];

		if(data != undefined && data != null) {
			if(caliperData != "") caliperData += "&";
			caliperData += key + "=" + data;
		}
	}

	console.log("오늘의 학습 xCaliper Data: ", caliperData);

	// xCaliper native func call
	if(window && window.ecohybrid && window.ecohybrid.callBroadcast) {
		window.ecohybrid.callBroadcast(BASE_ACTION, caliperData);
		console.log("ecohybrid.callBroadcast 호출함");
	} else if(window && window.Android && window.Android.callBroadcast) {
		window.Android.callBroadcast(BASE_ACTION, caliper);
		console.log("Android.callBroadcast 호출함");
	} else {
		console.log("callBroadcast 인터페이스를 발견하지 못함");
	}

}

/*
 * <a> 태그용 xCaliper 호출해주는 이벤트 핸들러. <a> 태그의 click 이벤트에 붙여준다
 * ex. <a href='todayStudy.html' onclick='callAnchorxCaliper(this)'>
 */
function callAnchorxCaliper(anchorEl) {
	var fullAnchorUrl = anchorEl.href;
	var currentDomain = location.protocol + "//" + location.hostname;
	var fullAnchorPath = fullAnchorUrl.replace(currentDomain, "");

	var pagename = ES_PAGES[fullAnchorPath];

	if(!pagename) return;

	//xNaviEvent(pagename, "", pagename, "M");
	xNaviEvent2({
		name: pagename,
		contents_desc: pagename,
//		url: fullAnchorUrl,
		objType: "M"
	});
}

/*
 * native scheme 호출시 xCaliper를 호출할 경우
 */
function callNativeSchemeByxCaliper(scheme) {
	var xCaliperEventData = {};
	xCaliperEventData["url"] = scheme;
	xCaliperEventData["objType"] = "C";

	var oScheme = fnSplitScheme(scheme);

	var contentName = "";
	switch(oScheme.protocol) {
		case "hlschoolstudy": // 교과학습
			if(oScheme.name == "kor") {
				contentName = "교과학습 > 국어";
			} else if(oScheme.name == "mat") {
				contentName = "교과학습 > 수학";
			} else if(oScheme.name == "soc") {
				contentName = "교과학습 > 사회";
			} else if(oScheme.name == "sci") {
				contentName = "교과학습 > 과학";
			} else if(oScheme.name == "eng") {
				contentName = "교과학습 > 영어";
			}
			break;

		case "proverb":
			contentName = "속담의 달인"; break;

		case "hlaitextbook":
			contentName = "홈런AI교과서"; break;

		case "hlheroes":
			contentName = "유형히어로즈"; break;

		case "hlcoding":
			contentName = "열려라코딩"; break;

		case "enggrammar":
			contentName = "그래머탐험대"; break;

		case "hlchinesecharacter":
			contentName = "한자서당"; break;

		case "hldicessence":
			contentName = "핵심전과"; break;

		case "hldictextbook":
			contentName = "교과서사전"; break;

		case "hldicenrichmentstudy":
			contentName = "학습백과"; break;

		case "hlreadepisode":
			contentName = "읽기마당"; break;

		case "hlcalculation":
			contentName = "홈런연산"; break;

		case "hlsong":
			contentName = "홈런공부송"; break;

		case "futurewindowcapability":
			contentName = "미래직업탐색"; break;

		case "hltyping":
			contentName = "홈런 타자연습"; break;

		case "ai":
			contentName = "AI생기부"; break;

		case "event":
			contentName = "이벤트"; break;

		case "talk":
			contentName = "홈런톡"; break;

		case "studypsychology":
			contentName = "심리검사"; break;

		case "learningstatus":
			if(oScheme.name == "errnote") {
				contentName = "오답노트";
			} else if(oScheme.name == "abilitystudy") {
				contentName = "내공상자";
			}
			break;

		case "hlfunfuneng":
			if(oScheme.name == "phonics") {
				contentName = "파닉스";
			} else if(oScheme.name == "engword") {
				contentName = "영단어암기";
			}
			break;

		case "hlpreschool_n":
			if(oScheme.name == "singersong") {
				contentName = "싱어송";
			} else if(oScheme.name == "storytime") {
				contentName = "스토리타임";
			}
			break;

		case "hltest": // 평가학습
			if(oScheme.name == "skill") {
				switch(oScheme["params"]["com.home_learn.schooltest.extra.NAV_TEST_DIV"]) {
					case "10010":
						contentName = "학교공부 평가학습 > 요점노트"; break;
					case "10001":
						contentName = "학교공부 평가학습 > 실력평가"; break;
					case "10013":
						contentName = "학교공부 평가학습 > 스피드퀴즈"; break;
					case "10002":
						contentName = "학교공부 평가학습 > 단원평가"; break;
					case "10007":
						contentName = "학교공부 평가학습 > 서술형평가"; break;
					default:
						contentName = "";
				}
			} else if(oScheme.name == "prepare") {
				switch(oScheme["params"]["com.home_learn.schooltest.extra.NAV_TEST_DIV"]) {
					case "10008":
						contentName = "학교공부 평가학습 > 시험대비특강"; break;
					case "10004":
						contentName = "학교공부 평가학습 > 족집게문제"; break;
					case "10012":
						contentName = "학교공부 평가학습 > 수행평가"; break;
					case "10005":
						contentName = "학교공부 평가학습 > 탑시크릿"; break;
					case "10003":
						contentName = "학교공부 평가학습 > 성취도평가"; break;
					case "10011":
						contentName = "학교공부 평가학습 > 모의고사"; break;
					default:
						contentName = "";
				}
			} else if(oScheme.name == "" && oScheme["params"]["com.home_learn.schooltest.extra.NAV_TEST_DIV"] == "10006") {
				contentName = "수학경시";
			}
			break;

		default:
			contentName = "";
	}

	xNaviEvent2({
		name: contentName,
		contentid: "",
		contents_desc: contentName,
		objType: "M",
//		url: scheme
	});
}

// 안드로이드 가상 키보드가 올라오거나 내려갈 때마다 호출되는 callback
function onChangeSoftKeyBoardState(keyboardState) {
	if(keyboardState == "1") { // 가상 키보드가 표시될 때
		if(typeof keyboard_onShow != "undefined" && typeof keyboard_onShow == "function") {
			keyboard_onShow();
		}
	} else if(keyboardState == "2") { // 가상 키보드가 사라질 때
		if(typeof keyboard_onHide != "undefined" && typeof keyboard_onHide == "function") {
			keyboard_onHide();
		}
	}
}

function fnKtKeyboard_onShow() {
	// 현재 포커스를 얻은 활성 요소
	var jqEl = $(document.activeElement);
	// 현재 활성 요소의 위치 정보
	var clientRect = jqEl[0].getBoundingClientRect();
	// 화면 높이
	var screenHeight = $(document).height();

	// 현재 활성 요소가 INPUT 태그가 아니라면 로직이 동작하지 않는다 (혹시 모를 방어코드)
	if(jqEl.prop("tagName").toLowerCase() != "input") return;

	// 현재 화면 기준으로 2/3 높이 아래에 있는 요소에서만 로직이 동작한다
	if(clientRect.top + clientRect.height >= ((screenHeight / 3) * 2)) {
		$("body").css("marginTop", -(screenHeight - parseInt(clientRect.top) + parseInt(clientRect.height) + 5) + "px");
	}
}

function fnKtKeyboard_onHide() {
	$("body").css("marginTop", "0px");
}
/* ======================== //Callback ======================== */



/* ======================== UTIL ======================== */
function fnGetParam(name) {
	var rtnval = '';
	var nowAddress = unescape(decodeURI(location.href));
	var parameters = (nowAddress.slice(nowAddress.indexOf('?') + 1, nowAddress.length)).split('&');
	for (var i = 0; i < parameters.length; i++) {
		var varName = parameters[i].split('=')[0];
		if (varName.toUpperCase() == name.toUpperCase()) {
			rtnval = parameters[i].split('=')[1];
			break;
		}
	}
	rtnval = rtnval.replace(/#/ig, '');
	return rtnval;
}

function fnGetHost(target) {

	return Global[Global.env][target];

}


//숫자 천단위 , 찍는 함수
function commaNum(str) {
	str = String(str);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

//CTN format
function phoneNumFormat(ctn) {
	if (ctn.length == 11) {
		ctn = ctn.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
	} else if (ctn.length == 8) {
		ctn = ctn.replace(/(\d{4})(\d{4})/, '$1-$2');
	} else {
		if (ctn.indexOf('02') == 0) {
			ctn = ctn.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
		} else {
			ctn = ctn.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
		}
	}
	return ctn;
}

//전화번호 포맷 ex) 010-1234-5678 -> 010-**34-**78
function ctnMaskingFormat(ctn) {
	ctn = phoneNumFormat(ctn);
	ctn = ctn.replace(/-[0-9]{2}/g, "-**");
	return ctn;
}

//이름 포맷 ex) 홍길동 -> 홍*동
function nameMaskingFormat(name) {
	var nameLength = name.length;
	name = name.substring(0, 1) + "*" + name.substring(2, nameLength);
	return name;
}

//특수 문자 제거
function removeExtChar(str) {
	return str.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, "");
}

//String을 자리수에 맞추어 입력된 addChar로 채워 String반환
function digits(data, cnt, addChar) {
	var char = "";
	var digit = "";
	data = data + "";

	if (addChar == null || addChar == undefined) { char = "0"; }
	else { char = addChar; }

	if (data.length < cnt) {
		for (var i = 0; i < cnt - data.length; i++) {
			digit += char;
		}
	}
	return digit + data;
}

function getDateToYYYYMMDD(date) {
	if (date) {
		var year = date.substr(0, 4);
		var month = date.substr(4, 2);
		var day = date.substr(6, 2);
		return new Date(year, month-1, day);
	} else {
		return null;
	}
}

function formmatCommaDate(regDt) {
	return getDateToYYYYMMDD(regDt).format("yyyy.MM.dd");
}

/* 날짜 포맷 변환 함수 */
Date.prototype.format = function (f) {
	if (!this.valueOf()) return " ";

	var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var weekNameDataGive = ["일", "월", "화", "수", "목", "금", "토"];
	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|EE|E|hh|mm|ss|MX|a\/p)/gi, function ($1) {
		switch ($1) {
			case "yyyy": return d.getFullYear();
			case "yy": return (d.getFullYear() % 1000).zf(2);
			case "MM": return (d.getMonth() + 1).zf(2);
			case "MX": return (d.getMonth()).zf(2);
			case "dd": return d.getDate().zf(2);
			case "EE": return weekNameDataGive[d.getDay()];
			case "E": return weekName[d.getDay()];
			case "HH": return d.getHours().zf(2);
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
			case "mm": return d.getMinutes().zf(2);
			case "ss": return d.getSeconds().zf(2);
			case "a/p": return d.getHours() < 12 ? "오전" : "오후";
			default: return $1;
		}
	});
};

String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };

//히스토리 링크 변경
function replaceHistory(replaceUrl) {
	window.history.replaceState({}, '', replaceUrl);
}

//페이지 새로고침
function pageReload() {
	location.reload();
}

//데이터 단위 변경
function changeUnitToGb(dataSize) {
	dataSize = parseInt(dataSize) / 1024;
	dataSize = dataSize.toString();

	var dotIdx = dataSize.indexOf('.');
	if (dotIdx > -1) {
		dataSize = dataSize.substr(0, dataSize.indexOf('.') + 2);
	}

	if (dataSize.endsWith('.0')) {
		dataSize = dataSize.substr(0, dataSize.indexOf('.'));
	}

	return dataSize;
}

//현재 월 마지막 날 구하기
function getLastDayInMonth(format) {
	var result = moment(moment().format('YYYY-MM'), 'YYYY-MM').daysInMonth();

	switch (format) {
		case 'DD':
			break;
		case 'YYYYMMDD':
			result = moment().format('YYYYMM') + result;
			break;
	}

	return result;
}

//문자 null 또는 공백 처리
function nvl(value, returnValue) {
	if ($.isEmpty(value)) {
		return $.isEmpty(returnValue) ? "" : returnValue;
	} else {
		return value;
	}

}



//json 특정 key로 정렬 (정렬할 목록, key, 오름차순여부)
//ex: sortResults(newList, 'sort', true);
function sortResults(list, prop, asc) {
	list.sort(function (a, b) {
		if (asc) {
			return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
		} else {
			return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
		}
	});
}
/* ======================== //UTIL ======================== */

/* ======================== APP ======================== */

/** input length 길이 체크
 *
 * @param obj = input 태그의 아이디
 * @param maxLength = 길이 최대값
 * @returns boolean
 */
function valueLengthChk(obj, maxLength) {
	var text = $(obj).val();
	if (text.length > maxLength) {
		return false;
	} else {
		return true;
	}
};

//input string 길이 확인
function checkInputLength(inputTarget, length) {
	var valueLength = inputTarget.val().length;

	if (valueLength >= length) {
		inputTarget.val(inputTarget.val().slice(0, length));

		return 'overflow';
	} else {
		return valueLength;
	}
}

function onClickEventPrevent(event) {
	event.preventDefault();
}

function commonModalRemove(){

	$("div[name=commonAlert]").remove();
	$("div[name=commonConfirm]").remove();
	$("div[name=commonVideoModal]").remove();
	$("div[name=mainCommonConfirm]").remove();
	$("div[name=msCommonAlert]").remove();
	$("div[name=msCommonConfirm]").remove();
	$("div.modal-backdrop.fade.show").remove();
}

//초등 공통 얼럿 팝업 화면
//option { btnOk : "확인"}
function commonAlert(message, option, okCallback) {
//	alert(message);
//	commonModalRemove();
//	var alertId = "Popup";

//	var messageArgs = !$.isEmpty(option) && !$.isEmpty(option.messageArgs) ? option.messageArgs : "";
//	var btnOk = !$.isEmpty(option) && !$.isEmpty(option.btnOk) ? option.btnOk : commonMessage("COM_002_003", messageArgs);

	var template = '';
	template += '<section class="popup_wrap">';
	template += '	<div class="popup_common" id="commonPopup" style="display:none">';
	template += '		<h1 class="popup_commonTitle" id="commonTitle">';
	template += '' + commonMessage(message);
	template += '		</h1>';
	template += '		<div class="pop_btn_wrap">';
	template += '	 	   <a href="#none" class="btn_comfirm" id="commonConfirm">확인</a>';
//	template += '		   <a href="#none" class="btn_cancel" style="display:none">취소</a> ';
	template += '		</div>';
	template += '	</div>';
	template += '</section>';

	$("body div.container").append(template);

	var commonAlertPopup = $("#commonPopup");
	$('#commonPopup').css('display','');
	$.fn.openPopup('commonPopup', false);

	$('#commonConfirm').on('click', function(e){
		onClickEventPrevent(e);
		$('#commonPopup').css('display','none');
    	 $.fn.closePopup('commonPopup');
		okCallback();
    })
//	commonAlertPopup.modal({ backdrop: 'static', keyboard: false, show: true });
//	commonAlertPopup.on("#commonConfirm", function () {
//		commonAlertPopup.remove();
//	});
//
//	commonAlertPopup.find("div.modal-content a.btn-close").on('click', function (e) {
//		onClickEventPrevent(e);
//		if (!$.isEmpty(okCallback) && typeof okCallback === 'function') {
//			okCallback();
//		}
//		commonAlertPopup.modal("hide");
//	});
//
//	commonAlertPopup.find("a[name=btnOk]").on('click', function (e) {
//		onClickEventPrevent(e);
//		if (!$.isEmpty(okCallback) && typeof okCallback === 'function') {
//			okCallback();
//		}
//		commonAlertPopup.modal("hide");
//	});

}

//초등 메인에서 사용하는 메세지 팝업
//option { btnOk : "예", btnCancel : "아니오"}
function mainConfirm(messageCode, option, okCallback, cancelCallback) {

	commonModalRemove();
	var index = $("div[name=mainCommonConfirm]").length + 1;
	//	var alertId = "layers_"+index;
	var alertId = "layers";

	var messageArgs = !$.isEmpty(option) && !$.isEmpty(option.messageArgs) ? option.messageArgs : "";
	var btnOk = !$.isEmpty(option) && !$.isEmpty(option.btnOk) ? option.btnOk : commonMessage("COM_002_003", messageArgs);
	var btnCancel = !$.isEmpty(option) && !$.isEmpty(option.btnCancel) ? option.btnCancel : commonMessage("COM_002_004", messageArgs);

	var template = '';
	template += '<div id="' + alertId + '" name="mainCommonConfirm">';
	template += '	<div class="layer">';
	template += '		<div class="alertText">';
	template += '				' + commonMessage(messageCode, messageArgs);
	template += '		</div>';
	template += '		<div class="buttonBox">';
	template += '			<button class="b2b_btn" type="button" name="btnOk" >' + btnOk + '</button>';
	template += '			<button class="b2b_btn no" type="button" name="btnCancel" >' + btnCancel + '</button>';
	template += '		</div>';
	template += '		<div class="closeBox"></div>';
	template += '	</div>';
	template += '</div>';

	$(document.body).append(template);

	var commonAlertPopup = $("div[name=mainCommonConfirm]");

	//commonAlertPopup.css('display','flex');

	commonAlertPopup.find("button[name=btnOk]").on('click', function (e) {
		onClickEventPrevent(e);
		if (!$.isEmpty(okCallback) && typeof okCallback === 'function') {
			okCallback();
		}
		commonAlertPopup.remove();
	});

	commonAlertPopup.find("div.modal-content a.btn-close").on('click', function (e) {
		onClickEventPrevent(e);
		if (!$.isEmpty(cancelCallback) && typeof cancelCallback === 'function') {
			cancelCallback();
		}
		commonAlertPopup.modal("hide");
	});

	commonAlertPopup.find("button[name=btnCancel]").on('click', function (e) {
		onClickEventPrevent(e);
		if (!$.isEmpty(cancelCallback) && typeof cancelCallback === 'function') {
			cancelCallback();
		}
		commonAlertPopup.remove();
	});

}

//초등 공통 메세지 팝업
//option { btnOk : "예", btnCancel : "아니오"}
function commonConfirm(messageCode, option, okCallback, cancelCallback) {

	commonModalRemove();
	var index = $("div[name=commonConfirm]").length + 1;
	var alertId = "commonConfirm" + index;
	//var alertId = "Popup";

	var messageArgs = !$.isEmpty(option) && !$.isEmpty(option.messageArgs) ? option.messageArgs : "";
	var btnOk = !$.isEmpty(option) && !$.isEmpty(option.btnOk) ? option.btnOk : commonMessage("COM_002_003", messageArgs);
	var btnCancel = !$.isEmpty(option) && !$.isEmpty(option.btnCancel) ? option.btnCancel : commonMessage("COM_002_004", messageArgs);

	var template = '';
	template += '<div class="modal modal-info schoolStudy_popup fade show" id="' + alertId + '" name="commonConfirm" data-backdrop="static" tabindex="-1" role="dialog" aria-modal="true">';
	template += ' <div class="modal-dialog modal-dialog-centered" role="document">';
	template += '   <div class="modal-content">';
	template += '     <a href="#" class="btn-close" data-dismiss="modal" aria-label="Close"><img src="../../img/element/special/koreanHistory/btn_X.png" alt=""></a>';
	template += '     <div class="content">';
	template += '        <img src="../../img/element/schoolStudy/popup/popup_s.png" alt="">';
	template += '        <p class="text">';
	template += '' + commonMessage(messageCode, messageArgs);
	template += '        </p>';
	template += '        <div class="btn-wrap">';
	template += '          <a class="btn-yes" href="#" name=btnOk><span>' + btnOk + '</span><img src="../../img/element/schoolStudy/popup/btn_yes.png" alt=""></a>';
	template += '          <a class="btn-no" href="#" name=btnCancel><span>' + btnCancel + '</span><img src="../../img/element/schoolStudy/popup/btn_no.png" alt=""></a>';
	template += '        </div>';
	template += '     </div>';
	template += '   </div>';
	template += ' </div>';
	template += '</div>';

	$(document.body).append(template);

	//var commonAlertPopup = $("div[name=commonConfirm]");
	var commonAlertPopup = $("#" + alertId);

	commonAlertPopup.modal({ backdrop: 'static', keyboard: false, show: true });
	commonAlertPopup.on("hide.bs.modal", function () {
		commonAlertPopup.remove();
	});

	commonAlertPopup.find("a[name=btnOk]").on('click', function (e) {
		onClickEventPrevent(e);
		if (!$.isEmpty(okCallback) && typeof okCallback === 'function') {
			okCallback();
		}
		commonAlertPopup.modal("hide");
	});

	commonAlertPopup.find("div.modal-content a.btn-close").on('click', function (e) {
		onClickEventPrevent(e);
		if (!$.isEmpty(cancelCallback) && typeof cancelCallback === 'function') {
			cancelCallback();
		}
		commonAlertPopup.modal("hide");
	});

	commonAlertPopup.find("a[name=btnCancel]").on('click', function (e) {
		onClickEventPrevent(e);
		if (!$.isEmpty(cancelCallback) && typeof cancelCallback === 'function') {
			cancelCallback();
		}
		commonAlertPopup.modal("hide");
	});
}


//공통 > 같이 공부하면 좋아요 videomodal 팝업
//비디오 제목, 썸네일, 재생시간, 재생링크
function commonVideoModal(videoTitle, videoThumb, videoTime, videoLink) {

	commonModalRemove();
	var alertId = "introMath";
	var template = '';
	template += '<div class="modal modal-big  modal-info fade videomodal" id="' + alertId + '" name="commonVideoModal" data-backdrop="static" tabindex="-1" role="dialog" aria-modal="true">';
	template += '  <div class="modal-dialog modal-dialog-centered" role="document">';
	template += '    <div class="modal-content">';
	template += '      <p class="video-title" data-text="SUB_210_002" >같이 공부하면 좋아요!</p>';
	template += '      <div class="modal-img">';
	template += '        <img src="../../img/modify/videopopup.png" alt="" class="width_100">';
	template += '      </div>';
	template += '      <a href="#" data-dismiss="modal" aria-label="Close" class="close_size">';
	template += '        <img src="../../img/element/special/koreanHistory/btn_X.png" alt="" class="width_100">';
	template += '      </a>';
	template += '      <div class="text_area">';
	template += '        <p class="video_title">'+videoTitle+'</p>';
	template += '      </div>';
	template += '      <div class="vide-area">';
	template += '        <img src="'+videoThumb+'" alt="" class="width_100">';
	template += '        <a href="#" data-link="'+videoLink+'"><img src="../../img/modify/play_arrow.png" width="width_100" class="icon_arrow"></a>';
	template += '        <p>'+videoTime+'</p>';
	template += '      </div>';
	template += '    </div>';
	template += '  </div>';
	template += '</div>';

	$(document.body).append(template);

	var commonAlertPopup = $("div[name=commonVideoModal]");

	commonAlertPopup.modal({ backdrop: 'static', keyboard: false, show: true });
	commonAlertPopup.on("hide.bs.modal", function () {
		commonAlertPopup.remove();
	});

	commonAlertPopup.find("div.modal-content a.close_size").on('click', function (e) {
		onClickEventPrevent(e);
		//TODO 비디오 재생
		var link = commonAlertPopup.find("div.vide-area a").data('link');
		//		if (!$.isEmpty(okCallback) && typeof okCallback === 'function') {
		//			okCallback();
		//		}
		commonAlertPopup.modal("hide");
	});

	commonAlertPopup.find("div.vide-area a").on('click', function (e) {
		onClickEventPrevent(e);
		//TODO 비디오 재생
		var link = commonAlertPopup.find("div.vide-area a").data('link');
//		if (!$.isEmpty(okCallback) && typeof okCallback === 'function') {
//			okCallback();
//		}
		commonAlertPopup.modal("hide");
	});

}

//중등 메세지 얼럿
//option { btnOk : "예"}
function msCommonAlert(messageCode, option, okCallback) {

	commonModalRemove();
	var index = $("div[name=msCommonAlert]").length + 1;
	var alertId = "msCommonAlert" + index;
	//var alertId = "Popup";

	var messageArgs = !$.isEmpty(option) && !$.isEmpty(option.messageArgs) ? option.messageArgs : "";
	var btnOk = !$.isEmpty(option) && !$.isEmpty(option.btnOk) ? option.btnOk : commonMessage("COM_002_002", messageArgs);

	var template = '';
	template += '<div class="modal fade normal-popup" id="' + alertId + '" name="msCommonAlert" data-backdrop="static" tabindex="-1" role="dialog">';
	template += ' <div class="modal-dialog modal-dialog-centered" role="document">';
	template += '   <div class="modal-content">';
	template += '    <div class="modal-header">';
	template += '      <span>알림</span>';
	template += '    </div>';
	template += '    <div class="modal-body">';
	template += '     <div class="content">';
	template += '        <p class="text">';
	template += '' + commonMessage(messageCode, messageArgs);
	template += '        </p>';
	template += '     </div>';
	template += '     <div class="btn-wrap">';
	template += '        <a class="btn-footer" href="#" name=btnOk>' + btnOk + '</a>';
	template += '     </div>';
	template += '    </div>';
	template += '   </div>';
	template += ' </div>';
	template += '</div>';

	$(document.body).append(template);

	var commonAlertPopup = $("#" + alertId);

	commonAlertPopup.modal({ backdrop: 'static', keyboard: false, show: true });
	commonAlertPopup.on("hide.bs.modal", function () {
		commonAlertPopup.remove();
	});

	commonAlertPopup.find("a[name=btnOk]").on('click', function (e) {
		onClickEventPrevent(e);
		if (!$.isEmpty(okCallback) && typeof okCallback === 'function') {
			okCallback();
		}
		commonAlertPopup.modal("hide");
	});

}

//중등 메세지 팝업
//option { btnOk : "예", btnCancel : "아니오"}
function msCommonConfirm(messageCode, option, okCallback, cancelCallback) {

	commonModalRemove();
	var index = $("div[name=msCommonConfirm]").length + 1;
	var alertId = "msCommonConfirm" + index;
	//var alertId = "Popup";

	var messageArgs = !$.isEmpty(option) && !$.isEmpty(option.messageArgs) ? option.messageArgs : "";
	var btnOk = !$.isEmpty(option) && !$.isEmpty(option.btnOk) ? option.btnOk : commonMessage("COM_002_003", messageArgs);
	var btnCancel = !$.isEmpty(option) && !$.isEmpty(option.btnCancel) ? option.btnCancel : commonMessage("COM_002_004", messageArgs);

	var template = '';
	template += '<div class="modal fade normal-popup" id="' + alertId + '" name="msCommonConfirm" data-backdrop="static" tabindex="-1" role="dialog">';
	template += ' <div class="modal-dialog modal-dialog-centered" role="document">';
	template += '   <div class="modal-content">';
	template += '    <div class="modal-header">';
	template += '      <span>알림</span>';
	template += '    </div>';
	template += '    <div class="modal-body">';
	template += '     <div class="content">';
	template += '        <p class="text">';
	template += '' + commonMessage(messageCode, messageArgs);
	template += '        </p>';
	template += '     </div>';
	template += '     <div class="btn-wrap">';
	template += '        <a class="btn-footer btn-border" href="#" data-dismiss="modal" aria-label="Close" name=btnCancel>' + btnCancel + '</a>';
	template += '        <a class="btn-footer" href="#" name=btnOk>' + btnOk + '</a>';
	template += '     </div>';
	template += '    </div>';
	template += '   </div>';
	template += ' </div>';
	template += '</div>';

	$(document.body).append(template);

	var commonAlertPopup = $("#" + alertId);

	commonAlertPopup.modal({ backdrop: 'static', keyboard: false, show: true });
	commonAlertPopup.on("hide.bs.modal", function () {
		commonAlertPopup.remove();
	});

	commonAlertPopup.find("a[name=btnOk]").on('click', function (e) {
		onClickEventPrevent(e);
		if (!$.isEmpty(okCallback) && typeof okCallback === 'function') {
			okCallback();
		}
		commonAlertPopup.modal("hide");
	});

	commonAlertPopup.find("a[name=btnCancel]").on('click', function (e) {
		onClickEventPrevent(e);
		if (!$.isEmpty(cancelCallback) && typeof cancelCallback === 'function') {
			cancelCallback();
		}
		commonAlertPopup.modal("hide");
	});
}

function commonMessage(messageCode, args) {

	var lang = EU_HEADER.lang;
	var code = nvl(messageCode);

	if (typeof langData === 'undefined') {
		return messageCode;
	}

	var message = "";
	if (!$.isEmpty(langData[lang]) && !$.isEmpty(langData[lang][code])) {
		message = langData[lang][code];
	} else {
		message = nvl(langData["ko"][code], code);
	}

	if ($.isEmpty(args)) {
		args = new Array();
	} else if (args != null && typeof args !== "object") {
		args = [args];
	}

	//{0}은 필수값입니다. 형식의 메시지
	message = message.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});

	var index = 0;
	//N%은 필수값입니다. 형식의 메시지
	message = message.replace(/[A-Z]\%+/gi, function (match) {
		var result = match;
		if (typeof args[index] != 'undefined') {
			result = args[index];
			index++;
		}
		return result;
	});

	//%S은 필수값입니다. 형식의 메시지
	index = 0;
	return message.replace(/\%[A-Z]+/gi, function (match) {
		var result = match;
		if (typeof args[index] != 'undefined') {
			result = args[index];
			index++;
		}
		return result;
	});

}

window.sStorage = window.sessionStorage || (function () {
	// window.sStorage = (function() {
	var winObj = opener || window; //opener가 있으면 팝업창으로 열렸으므로 부모 창을 사용
	var data = JSON.parse(winObj.top.name || '{}');
	var fn = {
		length: Object.keys(data).length,
		setItem: function (key, value) {
			data[key] = value + '';
			winObj.top.name = JSON.stringify(data);
			fn.length++;
		},
		getItem: function (key) {
			return data[key] || null;
		},
		key: function (idx) {
			return Object.keys(data)[idx] || null; //Object.keys() 는 IE9 이상을 지원하므로 IE8 이하 브라우저 환경에선 수정되어야함
		},
		removeItem: function (key) {
			delete data[key];
			winObj.top.name = JSON.stringify(data);
			fn.length--;
		},
		clear: function () {
			winObj.top.name = '{}';
			fn.length = 0;
		}
	};
	return fn;
})();

/*
sStorage.setItem("key2", new Date());
console.log(sStorage.getItem("key2"));
sStorage.removeItem('key2');
console.log(sStorage.length);
console.log(sStorage.key(1));
sStorage.clear();
console.log(sStorage.length);
*/

const g_IMG_PATH = "../../imgs/";
const g_ICON_LIST = [];
g_ICON_LIST[0] = [];
g_ICON_LIST[1] = [];
g_ICON_LIST[2] = [];
g_ICON_LIST[3] = [];
g_ICON_LIST[3]["재미수학"] = "img_study_math_01.png";
g_ICON_LIST[3]["놀이연산"] = "img_study_math_02.png";
g_ICON_LIST[3]["창의수학"] = "img_study_math_03.png";
g_ICON_LIST[3]["홈런연산"] = "img_study_math_04.png";
g_ICON_LIST[3]["영역별수학"] = "img_study_math_05.png";
g_ICON_LIST[3]["수학경시"] = "img_study_math_06.png";
g_ICON_LIST[3]["유형히어로즈"] = "img_study_math_07.png";
g_ICON_LIST[3]["사고수학"] = "img_study_math_08.png";
g_ICON_LIST[4] = [];
g_ICON_LIST[4]["파닉스"] = "img_study_eng_01.png";
g_ICON_LIST[4]["싱어송"] = "img_study_eng_02.png";
g_ICON_LIST[4]["영단어암기"] = "img_study_eng_03.png";
g_ICON_LIST[4]["스토리타임"] = "img_study_eng_04.png";
g_ICON_LIST[4]["호밍영어"] = "img_study_eng_05.png";
g_ICON_LIST[4]["그래머탐험대"] = "img_study_eng_06.png";
g_ICON_LIST[5] = [];
g_ICON_LIST[5]["안녕학교"] = "img_study_speical_01.png";
g_ICON_LIST[5]["동화누리"] = "img_study_speical_02.png";
g_ICON_LIST[5]["음악누리"] = "img_study_speical_03.png";
g_ICON_LIST[5]["미술누리"] = "img_study_speical_04.png";
g_ICON_LIST[5]["인물한국사"] = "img_study_speical_05.png";
g_ICON_LIST[5]["홈런공부송"] = "img_study_speical_06.png";
g_ICON_LIST[5]["코딩송"] = "img_study_speical_07.png";
g_ICON_LIST[5]["한자서당"] = "img_study_speical_08.png";
g_ICON_LIST[5]["홈런타자연습"] = "img_study_speical_09.png";
g_ICON_LIST[5]["홈트레이닝생활체조"] = "img_study_speical_10.png";
g_ICON_LIST[5]["한국문화100"] = "img_study_speical_11.png";
g_ICON_LIST[5]["열려라코딩"] = "img_study_speical_12.png";
g_ICON_LIST[5]["미래직업탐색"] = "img_study_speical_13.png";
g_ICON_LIST[5]["홈런AI교과서"] = "img_study_speical_14.png";
g_ICON_LIST[5]["일상의소리"] = "img_study_speical_15.png";
/* g_ICON_LIST[5]["한자서당"] = "img_study_specialSub_01.png";
g_ICON_LIST[5]["마법천자문"] = "img_study_specialSub_02.png";
g_ICON_LIST[5]["태극천자문"] = "img_study_specialSub_03.png";
g_ICON_LIST[5]["한자도로롱"] = "img_study_specialSub_04.png"; */

/**
 * KT 초등랜드용 scheme 호출 함수
 * fnKtSchemCall 호출 시 ifCallScheme로 재호출
 */
 function fnKtSchemCall(recvScheme) {
	// ATTN: 임시코드

	// 일단 xCaliper부터 호출
	callNativeSchemeByxCaliper(recvScheme);

	// 전달받은 scheme에 term 인자가 없다면, 강제로 term 인자를 추가한다
	var scheme = recvScheme;
	try {
		var oScheme = fnSplitScheme(recvScheme);
		if(oScheme.params != null && !oScheme.params.hasOwnProperty("term")) {
			var term = fnGetTerm();
			oScheme.params["term"] = term;
		}

		scheme = fnJoinSchemeObj(oScheme);
		console.log("term 정보 없어서 수동으로 term 정보 붙임:", scheme);
	} catch(ex) {
		console.error(ex);
	}

	ifCallScheme(scheme);
}

/**
 * KT 초등랜드용 scheme 호출 함수
 * openWebView 호출 시 이슈가 있어 사용 중지
 * 추후 사용할지 판단 필요
 */
function fnKtSchemCall_2(recvScheme) {
	var url = '';
	// 아래 if문에서 계속 예외처리
	var oScheme = fnSplitScheme(recvScheme);
	console.log(oScheme)

	// default values...
	var grade = fnGetGradeInfo();

	/* 교과학습 */
	if(oScheme.protocol == "hlschoolstudy") {
		var subjectName = "";
		switch(oScheme.name) {
			case "kor":
				subjectName = "국어";
				break;

			case "mat":
				subjectName = "수학";
				break;

			case "soc":
				subjectName = "사회";
				break;

			case "sci":
				subjectName = "과학";
				break;

			case "eng":
				subjectName = "영어";
				break;

			case "tot":
				subjectName = "통합";
				break;
		}

		if(subjectName != "") {
			// 과목명을 인지할 수 있었을 때...
			url = "/es/html/school/eStudyList.html" + "?" +
				"subj=" + subjectName + "&" +
				"grade=" + grade.grade + "&" +
				"term=" + grade.term;
		}
	}
	// 핵심전과
	else if(oScheme.protocol == 'hldicessence') {
		url = '/es/html/studyInfo/eSubjPoint.html?grade=' + grade.grade + '&term=' + grade.term;
	}
	// 교과서사전
	else if(oScheme.protocol == 'hldictextbook') {
		url = '/es/html/studyInfo/eStudyDic.html?grade=' + grade.grade + '&term=' + grade.term;
	}
	// 학습백과
	else if(oScheme.protocol == 'hldicenrichmentstudy') {
		url = '/es/html/school/eLearningEncyclopedia.html';
	}

	/* 평가학습 */
	else if(oScheme.protocol == 'hltest'&& oScheme.name == 'skill') {
		var subjectName = '';
		switch(subjectName, oScheme.params['com.home_learn.schooltest.extra.NAV_TEST_DIV']) {
			case '10010':
				subjectName = '요점노트';
				break;
			case '10001':
				subjectName = '실력평가';
				break;
			case '10013':
				subjectName = '스피드퀴즈';
				break;
			case '10002':
				subjectName = '단원평가';
				break;
			case '10007':
				subjectName = '서술형평가';
				break;
		}

		if(subjectName != '') {
			// 과목명을 인지할 수 있었을 때...
			url = '/es/html/school/eTestList.html' + '?' +
				'subj=' + subjectName + '&' +
				'grade=' + grade.grade + '&' +
				'term=' + grade.term;
		}
	}
	else if(oScheme.protocol == 'hltest'&& oScheme.name == 'prepare') {
		var subjectName = '';
		switch(subjectName, oScheme.params['com.home_learn.schooltest.extra.NAV_TEST_DIV']) {
			case '10008':
				subjectName = '시험대비특강';
				break;
			case '10004':
				subjectName = '족집게문제';
				break;
			case '10012':
				subjectName = '수행평가';
				break;
			case '10005':
				subjectName = 'TOP SECRET';
				break;
			case '10003':
				subjectName = '성취도평가';
				break;
			case '10011':
				subjectName = '모의고사';
				break;
		}

		if(subjectName != '') {
			url = '/es/html/school/eExamList.html?' +
				'subj=' + subjectName + '&' +
				'grade=' + grade.grade + '&' +
				'term=' + grade.term;
		}
	}

	/* 국어공부 */
	else if(oScheme.protocol == 'hlpreschool'&& oScheme.name == 'korwrite') {
		switch(oScheme.params.tab) {
			// 쓰기연습
			case '0':
				subj_id = 515;
				break;
			// 받아쓰기연습
			case '1':
				subj_id = 517;
				break;
			// 알림장쓰기
			case '2':
				subj_id = 516;
				break;
			// 일기쓰기
			case '3':
				subj_id = 518;
				break;
		}
		url = '/es/html/special/eKoreanWrite.html?subj_id=' + subj_id + '&grade_div=1';
	}
	/*
	else if(oScheme.protocol == 'hlpreschool_n' && oScheme.name == 'kormaster') {
		url = '/es/html/special/eKoreanWrite.html?subj_id={subj_id}&grade_div=1';
		switch(oScheme.params.tab) {
			// 다다어휘
			case '0':
				url = url.replace('{subj_id}', 515);
				break;
			// 국어생활
			case '0':
				url = url.replace('{subj_id}', 515);
				break;
			// 문장연습
			case '0':
				url = url.replace('{subj_id}', 515);
				break;
		}
	}
	 */
	// 받아쓰기
	else if(oScheme.protocol == 'hldictation') {
		url = '/es/html/special/eDictation.html?list_gbn=All';
	}
	// 속담의달인
	else if(oScheme.protocol == 'proverb') {
		url = '';
	}
	// 읽기마당
	else if(oScheme.protocol == 'hlreadepisode') {
		url = '/es/html/special/eReadingYard.html?grade=' + grade.grade + '&term=' + grade.term;
	}

	/* 수학공부 */
	// 홈런연산 (url 정보 없음)
	else if(oScheme.protocol == 'hlpreschool_n' && oScheme.protocol == 'hlpreschool_n' && oScheme.name == 'hlcalculation') {
		url = '';
	}
	// 유형히어로즈 (1, 2학년 없음)
	else if(oScheme.protocol == 'hlheroes' && grade.grade >= 3) {
		url = '/es/html/mathcomp/eTypeHeroes.html?grade=' + grade.grade + '&term=' + grade.term;
	}
	// 영역별수학
	else if(oScheme.protocol == 'hlsectionmath') {
		url = '/es/html/mathcomp/eMathByArea.html?subj_id=254';
	}
	// 수학경시
	else if(oScheme.protocol == 'hltest' && oScheme.name == '') {
		url = '/es/html/mathcomp/eMathTest.html?grade=' + grade.grade + '&term=' + grade.term;
	}

	/* 영어공부 */
	// 파닉스
	else if(oScheme.protocol == 'hlfunfuneng' && oScheme.name == 'phonics') {
		url = '/es/html/engcomp/ePhonics.html';
	}
	// 싱어송
	else if(oScheme.protocol == 'hlpreschool_n' && oScheme.name == 'singersong') {
		url = '';
	}
	// 영단어암기
	else if(oScheme.protocol == 'hlfunfuneng' && oScheme.name == 'engword') {
		url = '/es/html/engcomp/eWordMemo.html';
	}
	// 스토리타임
	else if(oScheme.protocol == 'hlpreschool_n' && oScheme.name == 'storytime') {
		url = '';
	}
	// 호밍영어
	else if(oScheme.protocol == 'homieng') {
		url = '';
	}
	// 그래머탐험대 (url 정보 없음)
	else if(oScheme.protocol == 'enggrammar') {
		url = '';
	}

	/* 특별학습 */
	// 안녕학교
	else if(oScheme.protocol == 'hlpreschool' && oScheme.name == 'hischool') {
		url = '';
	}
	// 동화누리
	else if(oScheme.protocol == 'hlpreschool_n' && oScheme.name == 'storynuri') {
		url = '';
	}
	// 음악누리
	else if(oScheme.protocol == 'hlpreschool_n' && oScheme.name == 'musicnuri') {
		url = '';
	}
	// 미술누리
	else if(oScheme.protocol == 'hlpreschool_n' && oScheme.name == 'artnuri') {
		url = '';
	}
	// 인물한국사
	else if(oScheme.protocol == 'hlpreschool_n' && oScheme.name == 'personhistory') {
		url = '';
	}
	// 홈런공부송
	else if(oScheme.protocol == 'hlsong') {
		url = '/es/html/special/eHomelearnSong.html';
	}
	// 코딩송
	else if(oScheme.protocol == 'hlpreschool_n' && oScheme.name == 'codingsong') {
		url = '';
	}
	// 한자서당
	else if(oScheme.protocol == 'hlchinesecharacter') {
		url = '/es/html/special/eChineseSchool.html?category_no=18626';
	}
	// 한국문화100
	else if(oScheme.protocol == 'masterexperiment') {
		url = '';
	}
	// 열려라코딩
	else if(oScheme.protocol == 'hlcoding') {
		url = '';
	}
	// 미래직업탐색
	else if(oScheme.protocol == 'futurewindowcapability') {
		url = '';
	}
	// 홈런AI교과서
	else if(oScheme.protocol == 'hlaitextbook') {
		url = '';
	}
	// 홈런타자연습
	else if(oScheme.protocol == 'hltyping') {
		url = '';
	}
	// 홈트레이닝 생활체조
	else if(oScheme.protocol == 'masterexperiment') {
		url = '';
	}
	// 일상의소리 (!!!홈트레이닝 생활체조와 동일한 스킴 확인 필요!!!!)
	else if(oScheme.protocol == 'masterexperiment') {
		url = '';
	}


	console.log('url', url)
	if(url != '') {
		openWebView(url);
		return;
	}

	ifCallScheme(recvScheme);
}

/**
 * 모바일 연동용 scheme을 분해해서 객체로 반환한다
 *
 *
 * Scheme
 * - protocol
 * - name
 * - params
 */
function fnSplitScheme(scheme) {
	var oScheme = [];

	var schemeTokens = scheme.split("://");
	if(schemeTokens.length > 0) {
		oScheme["protocol"] = schemeTokens[0];
	}

	if(schemeTokens.length > 1) {
		var urlTokens = schemeTokens[1].split("?");
		if(urlTokens.length > 0) {
			oScheme["name"] = urlTokens[0];
		}

		if(urlTokens.length > 1) {
			var params = urlTokens[1].split("&");

			var oParams = [];
			for(idx in params) {
				var param = params[idx];
				var paramTokens = param.split("=");
				var key = paramTokens[0], value = paramTokens[1];

				oParams[key] = value;
			}

			oScheme["params"] = oParams;
		} else {
			oScheme["params"] = null;
		}
	}

	return oScheme;
}

/**
 * fnSplitScheme() 함수로 분해된 scheme 객체를 결합해서 scheme 문자열로 만든다
 * 반드시 fnSplitScheme() 함수로 분해된 scheme 객체만 사용해야 한다. 이외의 경우에
 * 정상 작동을 보장하지 않음
 */
function fnJoinSchemeObj(oScheme) {
	var scheme = "";

	scheme = "" +
		oScheme["protocol"] + "://" + oScheme["name"];

	var params = oScheme.params;

	if(params != null) {
		scheme += "?";

		var keys = Object.keys(params);

		for(var i = 0; i < keys.length; i++) {
			if(i > 0) scheme += "&";
			scheme += keys[i] + "=" + params[keys[i]];
		}
	}
	return scheme;
}

/**
 * 학년 정보 조회
 */
function fnGetGrade() {
	var grade;

	try {
		var euserInfo = JSON.parse(sessionStorage.getItem("EUSER_INFO"));
		grade = euserInfo.GRADE_GBN;
	} catch(ex) {
		console.error("Native에서 저장한 계정 정보 (중 학년 정보) 조회 실패");

		try {
			var studentData = JSON.parse(sessionStorage.getItem("STU_DATA"));

			grade = studentData.grade;
		} catch(ex) {
			console.error("API를 통한 계정 정보 조회 실패");

			grade = "3";
		}
	}

	return grade;
}

function fnGetTerm() {
	// 학기 정보 조회
	var termEl = $("#selGrade a.active");
	var term = 1;
	if(termEl.length > 0) {
		if($(termEl[0]).hasClass("1"))
			term = 1;
		else
			term = 2;

	}

	return term;
}

function fnGetGradeInfo() {
	// 학기 정보 조회
	var text = $('#selGrade a.active').html().split(' ');
	var grade = '';
	var term = '';
	if(text[0]) {
		grade = text[0].replace(/[^0-9]/gi, '');
	}
	if(text[1]) {
		term = text[1].replace(/[^0-9]/gi, '');
	}

	return {
		grade: Number(grade),
		term: Number(term)
	};
}

/** KT 부가서비스 가입 완료 후 콜백 */
var ___fnJoinKtAddServiceComplete__ = null;
/** KT 부가서비스 가입 완료 후 넘겨줄 추가 데이터 */
var ___fnJoinKtAddServiceAdditionalData = null;

/** KT 부가서비스 가입 신청 */
function fnJoinKtService(params) {
	if(!params) params = {};

	if(params.hasOwnProperty("complete") && typeof params.complete == "function") {
		___fnJoinKtAddServiceComplete__ = params.complete;
	}
	if(params.hasOwnProperty("data")) {
		___fnJoinKtAddServiceAdditionalData = params.data;
	}

	if(!params.hasOwnProperty("pinno")) {
		failRegSub("핀번호가 입력되지 않았습니다");
		return;
	}

	if(!params.pinno) {
		failRegSub("핀번호가 입력되지 않았습니다");
		return;
	}

	var pinno = params["pinno"];

	if(window && window.ecohybrid && window.ecohybrid.requestRegSubMSVC) {
		window.ecohybrid.requestRegSubMSVC(pinno);
	} else {
		console.warn("부가서비스 가입 신청 인터페이스가 준비되지 않았습니다");

		if(params.hasOwnProperty("testSuccess")) {
			console.log("testSuccess 인자가 지정됨에 따라, 강제로 성공/실패 콜백으로 분기함");

			if(params["testSuccess"] == true) {
				successRegSub("KT 부가서비스에 가입되셨습니다");
			} else {
				failRegSub("부가서비스 가입 중에 오류가 발생했습니다");
			}
		}
	}
}

/** KT 부가서비스 가입 성공 콜백 */
function successRegSub(message) {
	var ret = {
		success: true,
		data: ___fnJoinKtAddServiceAdditionalData,
		result: {
			message: message
		}
	};

	if(typeof ___fnJoinKtAddServiceComplete__ == "function") {
		___fnJoinKtAddServiceComplete__(ret);
		___fnJoinKtAddServiceComplete__ = null;
		___fnJoinKtAddServiceAdditionalData = null;
	} else {
		console.log("KT 부가상품 가입 성공했으나, 결과를 전달할 개발자 콜백 존재하지 않음", ret);
	}
}

/** KT 부가서비스 가입 성공 콜백 */
function failRegSub(message) {
	var ret = {
		success: false,
		data: ___fnJoinKtAddServiceAdditionalData,
		result: {
			message: message
		}
	};

	if(typeof ___fnJoinKtAddServiceComplete__ == "function") {
		___fnJoinKtAddServiceComplete__(ret);
		___fnJoinKtAddServiceComplete__ = null;
		___fnJoinKtAddServiceAdditionalData = null;
	} else {
		console.log("KT 부가상품 가입 실패했으나, 결과를 전달할 개발자 콜백 존재하지 않음", ret);
	}
}

/** 인증 정보 등 기반 정보를 조회해서 저장한다 */
// 개발용 옵션
// --- true일 경우, SAID를 단말에서 조회하지 않고, 콜백을 직접 호출한다
var __DEBUG__DO_NOT_LOAD_SAID_FROM_NATIVE = false;
// --- SAID를 단말에서 조회하지 않는 경우 사용될 SAID 값
var __DEBUG__STATIC_SAID = "TT210222155";
// --- 부가상품 가입 여부를 단말에서 조회하지 않는 경우 사용될 부가상품 가입 여부 값
var __DEBUG__IS_JOIN_KT_PRD = false;
// --- 무료체험 진행중 여부. 이 값이 null 이외의 값이 지정되면, 무료체험 진행 여부는 이 값으로 고정된다
var __DEBUG__IS_DEMO_NOW = null;
// --- 무료체험 기간 만료 여부. 이 값이 null 이외의 값이 지정되면, 무료체험 기간만료 여부는 이 값으로 고정된다
var __DEBUG__IS_EXPIRE_DEMO = null;
// --- 학부모 토큰값. 이 값이 null 이외의 값이 지정되면, 학부모 토큰값은 이 값으로 고정된다.
var __DEBUG__PAR_TOKEN = null;
// 개발용 옵션 여기까지


// 데이터 로드 완료 확인
var g_Loaded = [];
// 데이터 로드 최대 임계치
const MAX_LOAD_COUNT = 15;

/** SAID와 KT부가상품 여부 조회 시작 */
function getJoinNSaid() {
	if(Global.isApp && window && window.ecohybrid && window.ecohybrid.requestJoinNSaid && !__DEBUG__DO_NOT_LOAD_SAID_FROM_NATIVE) {
		window.ecohybrid.requestJoinNSaid();
	} else {
		// 모바일 접속이 아닌경우, SAID와 KT 부가상품 가입 여부는 하드코딩
		//sessionStorage.setItem("SAID", "0000000001");
		//sessionStorage.setItem("IS_JOIN_KT_PRD", true);
		//g_Loaded["said"] = true;
		sendJoinNSaid(__DEBUG__IS_JOIN_KT_PRD, __DEBUG__STATIC_SAID);
	}
}

function sendJoinNSaid(join, said) {
	// said가 빈 값으로 넘어와서 이하 로직이 전부 망가질때를 대비한 방어코드
	if(said == "") said = " ";

	sessionStorage.setItem("SAID", said);
	sessionStorage.setItem("IS_JOIN_KT_PRD", join);

	g_Loaded["said"] = true;
}
/** SAID와 KT부가상품 여부 조회 끝 */

/** 홈런 회원 가입 여부 및 무료체험 여부 확인 시작 */
function getHomelearnRegAndDemo() {
	if(sessionStorage.getItem("SAID") == "" || !sessionStorage.getItem("SAID")) {
		setTimeout(getHomelearnRegAndDemo, 300);
		return;
	}

	var said = sessionStorage.getItem("SAID");
	var url = "/eco/api/kt/getJoinInfo";
	var joinCheckParam = {
		said: kt.cipher.enc(said)
	};

	$.postJSON("eco", url, joinCheckParam, function(resp) {
		if(resp.success) {
			var isDemoNow;
			var parRegDate, dteRegDate;

			// 체험학습 진행 여부
			var demoYn = (resp ? (resp.hasOwnProperty("demoYn") ? resp.demoYn : null) : null);
			demoYn = demoYn.toLowerCase();
			if(resp && resp.demoYn && resp.demoYn.toLowerCase() == "y") {
				isDemoNow = true;
			} else {
				isDemoNow = false;
			}
			sessionStorage.setItem("IS_DEMO_NOW", isDemoNow);

			// 회원 가입일
			if(resp && resp.regTime) {
				parRegDate = resp.regTime;

				var year = parseFloat(parRegDate.substring(0, 4));
				var month = parseFloat(parRegDate.substring(4, 6));
				var day = parseFloat(parRegDate.substring(6, 8));

				var dteRegDate = new Date(year, (month - 1), day);
				var dteToday = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate());
				var period = dteToday.getTime() - dteRegDate.getTime();
				period = period / 1000 / 60 / 60 / 24;

				console.log("period>> "+period)
				if(period >= 14) {
					sessionStorage.setItem("IS_EXPIRE_DEMO", true);
				} else {
					sessionStorage.setItem("IS_EXPIRE_DEMO", false);
				}

				sessionStorage.setItem("DEMO_REST_DATE", 14-period);
				sessionStorage.setItem("PAR_REG_DATE", parRegDate);

				// 20210426 ynjoung added.
				// 서버에서 연산결과를 전달받았다면, 위에서 계산한 값 대산 서버 연산 결과로 대체한다
				// >>> 무료체험중 여부
				if(resp.hasOwnProperty("isExpireDemo")) {
					var isExpireDemo = resp.isExpireDemo;

					if(isExpireDemo.toLowerCase() == "y") {
						sessionStorage.setItem("IS_EXPIRE_DEMO", true);
					} else {
						sessionStorage.setItem("IS_EXPIRE_DEMO", false);
					}
				}
				// >>> 무료체험 남은 일자
				if(resp.hasOwnProperty("leftDay")) {
					var leftDay = resp.leftDay;

					if(!isNaN(leftDay)) {
						sessionStorage.setItem("DEMO_REST_DATE", leftDay);
					}
				}
			}

			// 개발용 옵션 적용 여부
			if(__DEBUG__IS_DEMO_NOW != null) sessionStorage.setItem("IS_DEMO_NOW", __DEBUG__IS_DEMO_NOW);
			if(__DEBUG__IS_EXPIRE_DEMO != null) sessionStorage.setItem("IS_EXPIRE_DEMO", __DEBUG__IS_EXPIRE_DEMO);

			g_Loaded["demo"] = true;
		}
	});
}
/** 홈런 회원 가입 여부 및 무료체험 여부 확인 끝 */

/** 학부모 로그인하여 토큰 저장 */
function loadParentToken() {
	if(!sessionStorage.getItem("SAID")) {
		setTimeout(loadParentToken, 300);
		return;
	}

	var said = sessionStorage.getItem("SAID");
	var url = "/eco/api/kt/login";
	var loginParam = {
		said: kt.cipher.enc(said)
	}

	$.postJSON("eco", url, loginParam, function(resp) {
		if(resp.success) {
			if(resp.userInfo && resp.userInfo.token)
				g_TOKEN = resp.userInfo.token;
			else
				g_TOKEN = null;

//			console.log(resp.userInfo.loginId);
//			resp.userInfo.loginId = kt.cipher.dec(resp.userInfo.loginId);
			sessionStorage.setItem("PAR_TOKEN", g_TOKEN);
			sessionStorage.setItem("PAR_DATA", JSON.stringify(resp));
		} else {
			sessionStorage.setItem("PAR_TOKEN", "");
			sessionStorage.setItem("PAR_DATA", "");
		}

		// 개발용 옵션 적용
		if(__DEBUG__PAR_TOKEN != null) sessionStorage.setItem("PAR_TOKEN", __DEBUG__PAR_TOKEN);

		g_Loaded["parToken"] = true;
	});
}

function getAllDataForKt(completeCallback) {
	// ※※※ 서버 환경은 전부 https프로토콜임을 이용해서, 현재 접속 주소가 https이면(=서버에 올라간 상태라면) 디버깅 플래그를 모두 없앤다 ※※※
	if( location.protocol.toLowerCase().startsWith("https") == true ) {
		__DEBUG__DO_NOT_LOAD_SAID_FROM_NATIVE = false;
		__DEBUG__IS_DEMO_NOW = null;
		__DEBUG__IS_EXPIRE_DEMO = null;
		__DEBUG__PAR_TOKEN = null;
	}

	// SAID 및 부가상품가입여부 flag
	g_Loaded["said"] = false;
	// 홈런 가입 여부 및 무료체험 진행여부 flag
	g_Loaded["demo"] = false;
	// 학부모 토큰 조회 flag
	g_Loaded["parToken"] = false;

	// SAID와 부가상품 가입 여부를 가져온다
	getJoinNSaid();
	// 홈런 가입 여부 및 무료체험 진행 여부를 가져온다
	getHomelearnRegAndDemo();
	// 학부모 토큰을 가져온다
	loadParentToken();

	var checkInterval = 300;
	var checkCnt = 0;
	var checkDataLoadedComplete;
	checkDataLoadedComplete = function() {
		if(checkCnt++ >= MAX_LOAD_COUNT) {
			console.warn("데이터 조회 횟수가 임계치를 초과하여 조회 종료");
			/* 만약 데이터 조회 횟수가 임계치를 넘겨도 callback을 호출해야 한다면
			   아래 로직에 주석을 해제한다 */
			/*
			if(typeof completeCallback == "function") {
				completeCallback();
			}
			*/
			return;
		}
		for(key in g_Loaded) {
			if(g_Loaded[key] == false) {
				console.warn(key + "로드 안됨");
				setTimeout(checkDataLoadedComplete, checkInterval);
				return;
			}
		}

		console.log("전체 로드 완료");

		if(typeof completeCallback == "function") {
			completeCallback();
		}
	}

	setTimeout(checkDataLoadedComplete, checkInterval);
}

/**
 * 현재 URL을 파싱해서, QueryString을 key/value 형태의 object로 만들어 반환한다
 */
function getQueryStringObject() {
	var a = window.location.search.substr(1).split('&');
	if (a == "") return {};
	var b = {};
	for (var i = 0; i < a.length; ++i) {
		var p = a[i].split('=', 2);
		if (p.length == 1)
			b[p[0]] = "";
		else
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return b;
}



function setMyConBtn(){
	var said = sessionStorage.getItem("SAID");
    var url = "/eco/api/kt/getJoinInfo";
	var joinInfoParams = {
		said: kt.cipher.enc(said),
	};

	var isDemoNow;
////	if(!$.isEmpty(sessionStorage.getItem("IS_DEMO_NOW"))){
//		isDemoNow = sessionStorage.getItem("IS_DEMO_NOW");
//		console.log("isDemoNow:: "+isDemoNow);
//		if(isDemoNow == "true" || isDemoNow == true){
//    		$('.userCorn').remove();
//    		$('.btn_joinPaid').remove();
//    		$('.userInfo').append('<a href="#none" class="btn_joinPaid">월정액 가입</a>');
//    	}else{
//    		$('.btn_joinPaid').remove();
//    		$('.userCorn').remove();
//    		$('.userInfo').append('<span class="userCorn"> 콘</span>');
//    		fnGetUserCon();
//    	}
//	}else{
    	$.postJSON("eco", url, joinInfoParams, function(resp) {
    		if(resp.success) {
    			// 체험학습 진행 여부
    			if(resp && resp.demoYn && resp.demoYn.toLowerCase() == "y") {
    				isDemoNow = true;
    			} else {
    				isDemoNow = false;
    			}
				console.log("isDemoNow>> "+isDemoNow);
    			sessionStorage.setItem("IS_DEMO_NOW", isDemoNow);
				if(isDemoNow == "true" || isDemoNow == true){
    				$('.userCorn').remove();
    				$('.btn_joinPaid').remove();
    				$('.userInfo').append('<a href="#none" class="btn_joinPaid">서비스 가입</a>');
    			}else{
    				$('.btn_joinPaid').remove();
    				$('.userCorn').remove();
    				$('.userInfo').append('<span class="userCorn"> 콘</span>');
    				fnGetUserCon();
    			}

    		}
    	});
//	}
}



/**
 *
 */
function fnKtElLandDrawGnb(activeClass) {
	// 정보 조회
	var studentName, studentGrade;

	try {
		var euserInfo = JSON.parse(sessionStorage.getItem("EUSER_INFO"));
		studentName = euserInfo.NAME_KOR;
		studentGrade = euserInfo.GRADE_GBN;

	} catch(ex) {
		console.error("Native에서 저장한 계정 정보 조회 실패");

		try {
			var studentData = JSON.parse(sessionStorage.getItem("STU_DATA"));

			studentName = studentData.userNm;
			studentGrade = studentData.grade;
		} catch(ex) {
			console.error("API를 통한 계정 정보 조회 실패");
			studentName = "홍길동";
			studentGrade = "3";
		}
	}

//TODO 20210329 화상교육 -> 일상의소리ASMR 로

	var isDemo = nvl(sessionStorage.getItem('IS_DEMO_NOW'), false);
	var gnbTags = "" +
		'<a href="#none" class="btn_close"><img src="../../imgs/common/btn_end.png" alt="로그아웃, 앱종료"></a>' +
		'<nav>' +
		'	<h1><img src="../../imgs/common/bg_ci.svg" alt="초등랜드"></h1>' +
		'	<div class="userInfo">' +
		'		<div class="userImg_wrap"><img src="../../imgs/dummy/dummy_userImg.png" alt="dummy Image"></div>' +
		'		<strong class="userName">' + studentName + '<span class="userGrade">(' + studentGrade + '학년)</span></strong>' ;

		if(isDemo == false || isDemo == "false"){
			gnbTags  += '		<span class="userCorn">  콘</span>' ;
		}else{
	      	gnbTags  += '        <a href="#none" class="btn_joinPaid">서비스 가입</a>' ;
		}

		gnbTags += '		<a href="#none" class="btn_my"><img src="../../imgs/common/btn/btn_gnb_my.png" alt="마이"></a>' +
		'	</div>' +
		'	<a href="todayStudy.html" class="ico_gnb_today"><span>오늘의학습</span></a>' +
		'	<a href="curriculumStudy.html" class="ico_gnb_study"><span>교과학습</span></a>' +
		'	<a href="testStudyP.html" class="ico_gnb_test"><span>평가학습</span></a>' +
		'	<a href="koreanStudy.html" class="ico_gnb_kor"><span>국어공부</span></a>' +
		'	<a href="mathStudy.html" class="ico_gnb_math"><span>수학공부</span></a>' +
		'	<a href="englishStudy.html" class="ico_gnb_eng"><span>영어공부</span></a>' +
		'	<a href="specialStudy.html" class="ico_gnb_special"><span>특별학습</span></a>' +
		'	<a href="#none" onclick="openWebView(\'/kt/html/videoedu/videoEducation.html\')" class="ico_gnb_tele"><span>화상교육</span></a>' +
		'</nav>';

	if(activeClass) {
		gnbTags = gnbTags.replace(activeClass, activeClass + " active");
	}

	//임시로 여기에서 콘 설정
	document.write(gnbTags);

	//공통팝업 처리
//	fnOpenKtClosePopup();

	//월정액가입 버튼
//	if(demoYn == "Y"){
		/*$('nav .btn_joinPaid').on('click', function(){
			if(sessionStorage.IS_EXPIRE_DEMO){
				$.fn.openPopup('expPopup');
			}else{
				var ds = sessionStorage.getItem("DEMO_REST_DATE");
				var dd = String(ds).length === 1 ? '0' + ds : ds;
				$('#remainDate').text(dd+'일');
				$.fn.openPopup('joinPopup');
			}
		})*/
//	}

	//TODO 콘정보 넣기
	//사용자 정보 세팅
	if(typeof EUSER_INFO != "undefined")
		setTimeout(fnGetUserCon(), 300);
	$('.userImg_wrap img').attr('src', localStorage.getItem("profileImg"));
}

//프로필 이미지 변경
function changeChar(profileImgNo){
   return "../../imgs/login/img_login_profile_sel_0"+(profileImgNo*1+1)+".png";
}

window.CONRUNCNT = 0;
//콘 정보 조회
function fnGetUserCon(){

	setTimeout(fnGetUserConRun, 500);
}

function fnGetUserConRun(){

	console.log(`fnGetUserCon =========================================================  `);
	if (window.CONRUNCNT > 5){
		commonAlert("일시적인 오류가 발생했습니다. <br/>잠시 후 다시 시도해주세요.", null, function () { userLogout("Y") });
	}
	else{

		if (EUSER_INFO == null || EUSER_INFO["token"] == null || EUSER_INFO["token"] == "") {

			setTimeout(fnGetUserConRun, 500);
			window.CONRUNCNT++;
		}
		else{
			window.CONRUNCNT = 0;
			var apiUrl = "/eco/api/kt/getPoint";

			$.postJSON("eco", apiUrl, null, function (resp) {
				if (resp.errorCode == "0000") {
					$('.userCorn').text(resp.totalPoint + " 콘");
				}
			}, false, "POST");
		}
	}
}

//native -> 오늘의 학습으로 이동
function setMonthDay(year, month, day){
    location.href = "../main/todayStudy.html?year="+year+"&month="+ month +"&day="+day;
}


/**
 *
 */
function fnKtDrawShortcut(isShowCharacter) {
/*
    <!-- S 개인화 영역 -->
        <aside>
            <div class="personalMenu">
                <a href="javascript:ifCallScheme('learningstatus://errnote');" class="ico_note" ><span>오답노트</span></a>
                <a href="javascript:ifCallScheme('learningstatus://abilitystudy');" class="ico_box"><span>내공상자</span></a>
                <a href="javascript:ifCallScheme('ai://report')" class="ico_ai"><span>AI생기부</span></a>
                <a href="javascript:fnGetAttendanceInfo();" class="ico_check"><span>출석체크</span></a>
                <a href="javascript:ifCallScheme('event://eventmain');" class="ico_event"><span>이벤트</span></a>
                <a href="javascript:openWebView('/es/html/coneworld/eConeWorld.html');" class="ico_shop"><span>코니월드</span></a>
                <a href="javascript:ifCallScheme('talk://main');" class="ico_talk"><span>홈런톡</span></a>
                <a href="javascript:alert('진단검사 랜딩 페이지 확인 필요');" class="ico_test"><span>진단검사</span></a>
            </div>
        </aside>
    <!-- E 개인화 영역 -->
*/
	const WRONG_NOTE      = "javascript:fnKtSchemCall('learningstatus://errnote');";
	const MYBOX           = "javascript:fnKtSchemCall('learningstatus://abilitystudy');";
	const AI_LIFE_RECORD  = "javascript:fnKtSchemCall('ai://report')";
	const ATTENDENCE      = "javascript:fnGetAttendanceInfo();";
	const EVENT           = "javascript:fnKtSchemCall('event://eventmain');";
	const CONEWORLD       = "javascript:openWebView('/es/html/coneworld/eConeWorld.html');";
	const HOMERUN_TALK    = "javascript:fnKtSchemCall('talk://main');";
	const DIAGNOSTIC_TEST = "javascript:fnKtSchemCall('studypsychology://studypsychologymain');";

	var tags = "";

	if(isShowCharacter && isShowCharacter == true) {
		tags = "<aside class='init playing'>";
	} else {
		tags = "<aside>";
	}

//20210329 진단검사 ->심리검사 변경
	tags = tags +
		'<div class="personalMenu">' +
		'	<a href="' + WRONG_NOTE + '" class="ico_note" ><span>오답노트</span></a>' +
		'	<a href="' + MYBOX + '" class="ico_box"><span>내공상자</span></a>' +
		'	<a href="' + AI_LIFE_RECORD + '" class="ico_ai"><span>AI생기부</span></a>' +
		'	<a href="' + ATTENDENCE + '" class="ico_check"><span>출석체크</span></a>' +
		'	<a href="' + EVENT + '" class="ico_event"><span>이벤트</span></a>' +
//		'	<a href="' + CONEWORLD + '" class="ico_shop"><span>코니월드</span></a>' +
		'	<a href="' + HOMERUN_TALK + '" class="ico_talk"><span>홈런톡</span></a>' +
		'	<a href="' + DIAGNOSTIC_TEST + '" class="ico_test"><span>심리검사</span></a>' +
		'</div>' +
		'</aside>';

	document.write(tags);
}

/**
 * 기본 팝업 함수
 *
 * 팝업창을 제어하는 popOpt 객체에 필요한 필드를 넣고 함수를 호출하면 공통 팝업이 표출된다
 */
function __fnKtShowPopup__(popOpt) {
	var title = null;
	var body = null;
	var showConfirm = null;
	var confirmCaption = null;
	var confirm = null;
	var showCancel = null;
	var cancelCaption = null;
	var cancel = null;
	var clickToClose = true;		// false면 팝업 외부를 클릭해서 팝업이 사라지지 않는다
	var wide = false;				// true면 큰 사이즈의 팝업으로 만든다 (약관표시용 팝업)
	var showClose = null;			// true면 우측 상단에 팝업 닫기 버튼을 표시한다
	var close = null;
	if(popOpt) {
		if(popOpt.hasOwnProperty("title")) {
			title = popOpt.title;
		}
		if(popOpt.hasOwnProperty("body")) {
			body = popOpt.body;
		}
		if(popOpt.hasOwnProperty("showConfirm")) {
			if(typeof popOpt.showConfirm == "boolean") {
				showConfirm = popOpt.showConfirm;
			}
		}
		if(popOpt.hasOwnProperty("confirmCaption")) {
			confirmCaption = popOpt.confirmCaption;
		}
		if(popOpt.hasOwnProperty("confirm")) {
			if(typeof popOpt.confirm == "function") {
				confirm = popOpt.confirm;
			} else if(popOpt.confirm == "CLOSE") {
				confirm = "CLOSE";
			}
		}
		if(popOpt.hasOwnProperty("showCancel")) {
			if(typeof popOpt.showCancel == "boolean") {
				showCancel = popOpt.showCancel;
			}
		}
		if(popOpt.hasOwnProperty("cancelCaption")) {
			cancelCaption = popOpt.cancelCaption;
		}
		if(popOpt.hasOwnProperty("cancel")) {
			if(typeof popOpt.cancel == "function") {
				cancel = popOpt.cancel;
			} else if(popOpt.cancel == "CLOSE") {
				cancel = "CLOSE";
			}
		}
		if(popOpt.hasOwnProperty("clickToClose")) {
			if(popOpt.clickToClose == false) {
				clickToClose = false;
			} else {
				clickToClose = true;
			}
		}
		if(popOpt.hasOwnProperty("wide")) {
			if(popOpt.wide == true) {
				wide = true;
			}
		}
		if(popOpt.hasOwnProperty("showClose")) {
			if(popOpt.showClose == true) {
				showClose = true;
			}
		}
		if(popOpt.hasOwnProperty("close")) {
			if(typeof popOpt.close == "function") {
				close = popOpt.close;
			} else if(popOpt.close == "CLOSE") {
				close = "CLOSE";
			}
		}
	}

	var popupTags = "" +
		'<section class="popup_wrap">' +
		'	<div class="popup_common' + (wide ? " pop_terms" : "") + '" id="">';
	if(title != null) {
		popupTags +=
			'		<div class="pop_header">' +
			'			<strong>' + title + '</strong>';

		if(showClose) {
			popupTags += "" +
			'				<a href="#none" class="btn_close_popup"><img src="../../imgs/popup/btn_popup_close.png" alt="팝업 닫기"></a>';
		}

		popupTags +=
			'		</div>';
	}
	if(body != null) {
		popupTags +=
			'		<h1 class="popup_commonTitle">' + body + '</h1>';
	}
	popupTags +=
			'		<div class="pop_btn_wrap">';
	if(showConfirm) {
		popupTags +=
			'			<a href="#none" class="btn_comfirm">확인</a>';
	}
	if(showCancel) {
		popupTags +=
			'			<a href="#none" class="btn_cancel">취소</a>';
	}
	popupTags +=
		'		</div>' +
		'	</div>' +
		'</section>';

	var jqPopup = $(popupTags);

	if(confirmCaption) {
		jqPopup.find("a.btn_comfirm").text(confirmCaption);
	}
	if(cancelCaption) {
		jqPopup.find("a.btn_cancel").text(cancelCaption);
	}

	var target = jqPopup.find(".popup_common");

	if(confirm != null) {
		var btnConfirm = jqPopup.find("a.btn_comfirm");

		if(confirm == "CLOSE") {
			btnConfirm.on("click", function() {
				target.parents(".popup_wrap").fadeOut();
				$.when(target.fadeOut())
					.done(function() {
						jqPopup.remove();
					});
			});
		} else {
			btnConfirm.on("click", function(evt) {
				confirm(evt);
			});
		}
	}

	if(cancel != null) {
		var btnCancel = jqPopup.find("a.btn_cancel");

		if(cancel == "CLOSE") {
			btnCancel.on("click", function() {
				target.parents(".popup_wrap").fadeOut();
				$.when(target.fadeOut())
					.done(function() {
						jqPopup.remove();
					});
			});
		} else {
			btnCancel.on("click", function(evt) {
				cancel(evt);
			});
		}
	}

	if(close != null) {
		var btnClose = jqPopup.find("a.btn_close_popup");

		if(close == "CLOSE") {
			btnClose.on("click", function() {
				target.parents(".popup_wrap").fadeOut();
				$.when(target.fadeOut())
					.done(function() {
						jqPopup.remove();
					});
			});
		} else {
			btnClose.on("click", function(evt) {
				close(evt);
			});
		}
	}

	target.parents(".popup_wrap").css({"display": "flex"});

	$("body").append(jqPopup);

	target.fadeIn(function() {
		if(clickToClose) {
			target.parents(".popup_wrap").off("click").on({
				click: function(e) {
					if(e.target === e.currentTarget) {
						target.parents(".popup_wrap").fadeOut();
						$.when(target.fadeOut())
							.done(function() {
								jqPopup.remove();
							});
					} else {}
				}
			});
		}
	});
}

/*
 * 확인 버튼을 클릭하면 닫히는 레이어 팝업을 표시한다
 *
 * title: 팝업의 타이틀. 이 값이 null이면 팝업에 타이틀 영역이 표시되지 않는다
 * body: 팝업 본문
 * btnCaption: 확인 버튼에 표시될 텍스트
 * clickToClose: 이 값이 false라면, 팝업의 외부 영역을 클릭해도 팝업이 사라지지 않는다
 */
function fnKtShowPopup(title, body, btnCaption, clickToClose) {
	var opt = {};
	if(title == null) {
		opt.title = title;
	}
	opt.body = body;
	opt.showConfirm = true;
	opt.confirmCaption = btnCaption;
	opt.confirm = "CLOSE";
	if(clickToClose && typeof clickToClose == "boolean") {
		opt.clickToClose = clickToClose;
	}

	__fnKtShowPopup__(opt);
}

/**
 * 선택한 학생 ID로 로그인한다
 */
function fnKtLoginProfile(memberStudentSid) {
	var bShowLoadingbar = true;
	var said = sessionStorage.getItem("SAID");
	var url = "/eco/api/kt/profileLogin";
	var loginParams = {
		said: kt.cipher.enc(said),
		userId: kt.cipher.enc(memberStudentSid),
	}

	// native dimm 이벤트를 직접 제어하기 위해, 공통 postJSON이 아닌 plain jQuery Ajax 함수를 사용한다
	$.ajax({
		url: Global[Global.env].eco + url,
		type: "POST",
		data: $.param(loginParams),
		cache: false,
		timeout: 15000,
		crossDomain: true,
		processData: false,
		beforeSend: function() {
			if (bShowLoadingbar) {
				showLoadingbar();
			}
		},
		success: function(resp) {
			if(resp.success) {
				// 로그인에 성공했다면 프로필들의 click 이벤트를 모두 없앤다
				$(".profile_wrap li a[data-member-sid]").off("click");

				console.log(resp);
				if(resp.profileType == "c"){
					localStorage.setItem("profileImg", changeChar(resp.profileImg));
				}else{
					localStorage.setItem("profileImg", resp.profileImg);
				}
				sessionStorage.setItem("profileType", resp.profileType);

				sessionStorage.setItem("STU_DATA", JSON.stringify(resp));

				// 전달받은 데이터 중 학습기 학생 데이터의 필드명을 모두 Upper Score Snake Case로 변형한다
				var euserInfo = __camelCaseToUpperUnderscoreCase(resp.resultMap, ["extlink_yn", "isSchoolingUser", "parent_cert", "token", "user_type"]);
				var userInfo = {
					UserInfo: euserInfo
				};
				// xCaliper 호출 위해 전역변수 설정
				EUSER_INFO = JSON.parse(JSON.stringify(euserInfo));

				sessionStorage.setItem("EUSER_INFO", JSON.stringify(euserInfo));
				EUSER_INFO = JSON.parse(JSON.stringify(euserInfo));
				ifNativeRun("setUserInfo", JSON.stringify(userInfo));
//				console.trace("프로필 로그인 통해 학생 정보 확립", EUSER_INFO);
				// 페이지 이동하기 전에 xCaliper 호출
				console.log("xCaliper login 호출");
				xLogin();

				// 로그인 완료되고 필요한 데이터도 모두 저장했다면, sessionStorage를 다시 한번 갱신한다
				// location.href = "../main/todayStudy.html";
				getAllDataForKt(function() {
					location.href = "../main/todayStudy.html";
				});
			} else {
				var errorCode = (resp && resp.hasOwnProperty("errorCode")) ? resp.errorCode : "";

				if(errorCode == "7001") {
					console.error("로그인 중 인증서버 연동 오류 발생", resp);

					__fnKtShowPopup__({
						xtitle: "로그인 실패",
						body: "" +
							"로그인 할 수 없습니다.<br />" +
							"잠시 후 다시 시도해보세요.<br /><br />" +
							"문제가 지속될 경우<br />" +
							"(국번없이) 100 으로 문의 바랍니다",
						showConfirm: true,
						confirmCaption: "확인",
						confirm: function() { ifExitAppRun(); },
						clickToClose: false,
						showClose: false,
						close: function() { ifExitAppRun(); },
					});

				} else {
					console.error("로그인 중 알 수 없는 서버측 오류 발생", resp);
				}
			}
		}
	});

	/*
	$.postJSON("eco", url, loginParams, function(resp) {
		if(resp.success) {
			console.log(resp);
			if(resp.profileType == "c"){
				localStorage.setItem("profileImg", changeChar(resp.profileImg));
			}else{
				localStorage.setItem("profileImg", resp.profileImg);
			}
			sessionStorage.setItem("profileType", resp.profileType);
//			sessionStorage.setItem('demoYn', resp.demoYn);

			sessionStorage.setItem("STU_DATA", JSON.stringify(resp));

			// 전달받은 데이터 중 학습기 학생 데이터의 필드명을 모두 Upper Score Snake Case로 변형한다
			var euserInfo = __camelCaseToUpperUnderscoreCase(resp.resultMap, ["extlink_yn", "isSchoolingUser", "parent_cert", "token", "user_type"]);
			var userInfo = {
				UserInfo: euserInfo
			};
			// xCaliper 호출 위해 전역변수 설정
			EUSER_INFO = JSON.parse(JSON.stringify(euserInfo));

			sessionStorage.setItem("EUSER_INFO", JSON.stringify(euserInfo));
			EUSER_INFO = JSON.parse(JSON.stringify(euserInfo));
			ifNativeRun("setUserInfo", JSON.stringify(userInfo));

			// 페이지 이동하기 전에 xCaliper 호출
			xLogin();

			// 로그인 완료되고 필요한 데이터도 모두 저장했다면, sessionStorage를 다시 한번 갱신한다
			// location.href = "../main/todayStudy.html";
			getAllDataForKt(function() {
				location.href = "../main/todayStudy.html";
			});
		}
	});
	*/
}

/**
 * key가 camelCase로 구성되어 있는 key/value 형식의 객체 map을 전달받아,
 * key를 Upper Underscore Case로 변환한 key/value 형태의 객체를 반환한다.
 * 이때 expectKeys에는 변환되면 안되는 key의 목록을 배열로 담아서 전달한다
 */
function __camelCaseToUpperUnderscoreCase(map, expectKeys) {
	if(!expectKeys) expectKeys = [];
	var newMap = {};

	for(var key of Object.keys(map)) {
		if(expectKeys.includes(key)) {
			newMap[key] = map[key];
			continue;
		}

		var newKey = key.replace(/([A-Z])/g, "_$1").toUpperCase();
		newMap[newKey] = map[key];
	}

	return newMap;
}

/*
 * 문자열 string을 입력받아, 오른쪽에서부터 length만큼의 문자를 maskChr로 치환한
 * 마스킹 문자열을 반환한다
 * 단, string.length < length 인 경우, string을 그대로 반환한다
 */
function fnKtStringMaskingR(string, maskChr, length) {
	if(string.length < length) return string;

	return "" +
		string.substring(0, string.length - length) +
		(function(chr, len) { var ret = ""; for(var i = 0; i < len; i++) ret+=chr; return ret; })(maskChr, length);
}

/**
 * 아이디 정책에 부합하는지 확인한다
 * (영어 숫자를 포함한 6자 이상)
 */
function fnKtIsValidIdPolicy(id) {
	var length = id.length;
	var minLength = 6, maxLength = 999999;
	const ALPHABET_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const ALPHABET_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
	const ALPHABET = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const NUMBERS = "0123456789";
	const SPECIAL_CHARS = "!@#$%^&*";

	if(length == 0) return false;
	if(length < minLength || length > maxLength) return false;

	/* var isIncludeUpperCase = false;
	for(var i = 0; i < length; i++) {
		if(id[i] == id[i].toUpperCase()) {
			isIncludeUpperCase = true;
			break;
		}
	}
	if(!isIncludeUpperCase) return false;

	var isIncludeLowerCase = false;
	for(var i = 0; i < length; i++) {
		if(id[i] == id[i].toLowerCase()) {
			isIncludeLowerCase = true;
			break;
		}
	}
	if(!isIncludeLowerCase) return false; */

	var isIncludeAlphabet = false;
	for(var i = 0; i < ALPHABET.length; i++) {
		if(id.includes(ALPHABET[i])) {
			isIncludeAlphabet = true;
			break;
		}
	}
	if(!isIncludeAlphabet) return false;

	var isIncludeNumber = false;
	for(var i = 0; i < length; i++) {
		if(!isNaN(parseInt(id[i]))) {
			isIncludeNumber = true;
			break;
		}
	}
	if(!isIncludeNumber) return false;

	return true;
}

/**
 * 패스워드 정책에 부합하는지 확인한다
 (8~16자의 영어 대소문자 및 특수문자 조합)
 */
function fnKtIsValidPwdPolicy(pwd) {
	var length = pwd.length;
	var minLength = 8, maxLength = 16;
	const ALPHABET_UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const ALPHABET_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
	const NUMBERS = "0123456789";
	const SPECIAL_CHARS = "!@#$%^&*";

	if(length == 0) return false;
	if(length < minLength || length > maxLength) return false;

	var isIncludeUpperCase = false;
	for(var i = 0; i < ALPHABET_UPPERCASE.length; i++) {
		if(pwd.includes(ALPHABET_UPPERCASE[i])) {
			isIncludeUpperCase = true;
			break;
		}
	}
	if(!isIncludeUpperCase) return false;

	var isIncludeLowerCase = false;
	for(var i = 0; i < ALPHABET_LOWERCASE.length; i++) {
		if(pwd.includes(ALPHABET_LOWERCASE[i])) {
			isIncludeLowerCase = true;
			break;
		}
	}
	if(!isIncludeLowerCase) return false;

	var isIncludeNumber = false;
	for(var i = 0; i < NUMBERS.length; i++) {
		if(pwd.includes(NUMBERS[i])) {
			isIncludeNumber = true;
			break;
		}
	}
	if(!isIncludeNumber) return false;

	var isIncludeSpecialChars = false;
	for(var i = 0; i < SPECIAL_CHARS.length; i++) {
		if(pwd.includes(SPECIAL_CHARS[i])) {
			isIncludeSpecialChars = true;
			break;
		}
	}
	if(!isIncludeSpecialChars) return false;

	return true;
}

/**
 * <input type='text' /> 요소의 keyup 이벤트에 핸들러로 붙여서, 표준 max-length 속성과
 * 비슷한 효과를 구현한다
 */
function fnKtTextElValidator(evt) {
	var jqEl = $(evt.target);

	// <input type='text' />요소가 아닐때는 동작하지 않는다
	if(!(jqEl.prop("tagName").toLowerCase() == "input" && jqEl.prop("type").toLowerCase() == "text"))
		return;

	// 숫자만 입력해야 하는 요소라면 숫자 이외의 값은 치환해서 없앤다
/*	var isOnlyNumber = jqEl[0].getAttribute("data-only-number");
	if(isOnlyNumber == "Y") {
		jqEl.val( jqEl.val().replace(/[^0-9]/g,'') );
	} */

	// 입력값에 제한이 있는 요소인지 확인한다
	var dataRestrictList = jqEl[0].getAttribute("data-restrict-list");
	if(dataRestrictList) {
		dataRestrictList = dataRestrictList.toLowerCase();
		var dataList = dataRestrictList.split("|");
		for(var i = 0; i < dataList.length; i++) {
			switch(dataList[i]) {
				case "hangul":
					dataList[i] = "ㄱ-ㅎ|ㅏ-ㅣ|가-힣";
					break;

				case "uppercase":
					dataList[i] = "A-Z";
					break;

				case "lowercase":
					dataList[i] = "a-z";
					break;

				case "number":
					dataList[i] = "0-9";
					break;

				case "specialchars":
					dataList[i] = "!@#$%^&*";
					break;

				default:
					dataList[i] = "";
			}
		}

		// 정규표현식 문자열
		var rawRegExp = dataList.join("|");
		// 문자열 중 오류를 일으킬법한 부분을 제거한다
		rawRegExp.replace(/\|\|/g, "|");
		if(rawRegExp.startsWith("|")) rawRegExp = rawRegExp.substring(0, rawRegExp.length - 1);
		if(rawRegExp.endsWith("|")) rawRegExp = rawRegExp.substring(0, rawRegExp.length - 1);

		// 정규표현식을 만든다
		var restrictRegex = new RegExp("[^" + rawRegExp + "]", "g");

		//jqEl.val(jqEl.val().replace(restrictRegex, ""));
		if(jqEl.val() != jqEl.val().replace(restrictRegex, "")) {
			jqEl.val(jqEl.val().replace(restrictRegex, ""));
		}
	}

	// maxLength 속성이 있다면 maxLength를 유사하게 구현한다
	var maxLength = jqEl.prop("maxLength");
	if(maxLength > 0) {
		if(jqEl.val().length > maxLength) {
			jqEl.val( jqEl.val().substring(0, maxLength) )
		}
	}
}

function fnCloseBtn(){
	console.log('서비스 가입을 종료하시겠습니까?');
}

$.fn.openPopup = function(_targetId, _isBgEvent){
	var target = $("#" + _targetId);
	var isBgEvent = (_isBgEvent == false)?false:true;

	//$('.popup_wrap').css({'display':'flex'});
	target.parents(".popup_wrap").css({'display':'flex'});

	target.fadeIn(function(){
		if(isBgEvent){
			target.parents('.popup_wrap').off('click').on({
				click:function(e){
					if(e.target === e.currentTarget){
						$.fn.closePopup(_targetId);
					}else{
					};
				}
			});
		}
	});
}

$.fn.closePopup = function( _targetId ){
	var target = $("#" + _targetId);

	//$('.popup_wrap').fadeOut();
	target.parents(".popup_wrap").fadeOut();
	target.fadeOut();
}

$.fn.setCalendar = function( _target, obj ){
	var obj = obj;
	var activeIdx = obj.activeIdx;

	$('.' + _target).find('.btn_day').each(function(idx){
		$(this).attr('data-date',   obj.month[idx] + '월 ' + obj.date[idx] + '일');

		if(idx == activeIdx){
			$(this).addClass('active');
		}else{
			$(this).removeClass('active');
		}
	});

}

// jquery Event regist
$(document).ready(function(evt) {
/* 	$("[data-type='dropDown'] a").on({
		click:function(e){
			var currentTarget = e.currentTarget || null;;
			var $parent;
			var isOpen;

			if( currentTarget != null){
				$parent = $(currentTarget).parent();
				isOpen = $parent.hasClass('open')

				if(isOpen){
					$(currentTarget).addClass('active').siblings().removeClass('active');
					$parent.removeClass('open');
				}else{
					$("[data-type='dropDown']").removeClass('open');
					$parent.addClass('open');
				}
			}
		}
	}); */

	$("[data-type='loginDropDown'] a").on({
		click:function(e){
			if($(e.target).hasClass('value')){
				$(this).next().show();
			}else{
				var txt = $(this).text();
				$(this).parents('.com_loginDropDown_inner_wrap').prev('.value').addClass('active').text(txt);
				$(this).parents('.com_loginDropDown_inner_wrap').hide();
			}
		}
	});
});
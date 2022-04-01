/*========================== xCaliper ==========================*/
/** service_id
홈런 초등 : Y29tLnhjYWxpcGVyLmhvbWVsZWFybg ==
홈런 중등 : Y29tLnhjYWxpcGVyLmhvbWVsZWFybi1tcw ==
*/
var RE_RUN_CNT = 5;
var RE_RUN_TIME = 1000;
XCaliper_SERVICE_ID = null;
function xInit(){
	try {
	
		if (EUSER_INFO.isSchoolingUser == true)
			XCaliper_SERVICE_ID = "Y29tLnhjYWxpcGVyLmhvbWVsZWFybi1tcw==";
		else
			XCaliper_SERVICE_ID = "Y29tLnhjYWxpcGVyLmhvbWVsZWFybg==";

		XCaliper.setApiServer("dev");
		user.set("OBJ_ID", EUSER_INFO.token); // Session ID (Token) 
		user.set("ACTOR_ID", EUSER_INFO.USER_ID);
		//관리교사 계정인 경우
		if (EUSER_INFO.LOGIN_ID && EUSER_INFO.LOGIN_ID.indexOf("^#") > -1)
			user.set("ACTOR_KIND_CD", "Teacher");
		else
			user.set("ACTOR_KIND_CD", "Student");

		user.set("ACTOR_LOGIN_ID", EUSER_INFO.LOGIN_ID);
		user.set("ACTOR_GRADE", EUSER_INFO.GRADE_GBN);
		user.set("ACTOR_STATUS", "ON_SERVICE");
		user.set("ACTOR_MEMBERSHIP", "Learner");

		user.set("TCHR_ID", EUSER_INFO.TEACHER_ID);
		user.set("TCHR_LOGIN_ID", EUSER_INFO.TEACHER_LOGIN_ID);
		user.set("SERVICE_ID", XCaliper_SERVICE_ID); //홈런 서비스 인증 ID 
	} catch (error) {
		console.error(error);
	}
}

/**
 * xCaliper 공통 정보 설정 및 전송 
 */
function xSendRequest(){
	
	try {
		
		intent.set("EDAPP_ID", location.hostname);
		intent.set("EDAPP_VERSION", APP_INFO.version);
		intent.set("EDAPP_NAME", APP_INFO.name);

		//홈런 앱인경우
		if (ECO_IS_KT == "N") {
			sendRequest(intent);
		}
		//KT홈스쿨 앱인경우
		else {

			intent.set("EXT_LOCATION", location.pathname);
			sendBroad(intent);
		}
	}
	catch (error) {
		console.error(error);
	}
}

var xCHK_COUNT = 0;
/**
 * 비동기로 xCaliper가 연동되어 연동 완료 여부 확인이 필요한 경우 실행
 * @param {연동 후 실행할 function} callback 
 */
function xSEND_CHECK(fnCallback, param) {

	if (xCHK_COUNT > 10){

		console.log(`xcaliper flag no changed [${fnCallback}][${param}]`);

		if (param)
			fnCallback(param, "Y");
		else
			fnCallback("Y");
		return;
	}

	xCHK_COUNT++;

	var sended = false;
	if (xcaliperSend != undefined){
		sended = xcaliperSend;
	}
	
	console.log(`xcaliper =========== [${sended}][${xCHK_COUNT}]`);
	//console.log(`typeof fnCallback : ${(typeof fnCallback)}`);
	if (!sended){

		if (!fnCallback && typeof fnCallback !== 'function'){

			console.log(`callback function undefined[${(typeof fnCallback)}]`);
			return false;
		}

		if(param)
			setInterval(xSEND_CHECK, 500, fnCallback, param);
		else
			setInterval(xSEND_CHECK, 500, fnCallback);
		return;
	}
	xcaliperSend = false;
	xCHK_COUNT = 0;
	if(param)
		fnCallback(param, "Y");
	else
		fnCallback("Y");
}

/**
 * 앱 종료시 호출 (사용안함)
 * @returns 
 */
function xCloseWebview() {
	
	try {

		XCaliper.setApiServer;
	}
	catch (error) {

		if (RE_RUN_CNT > 0) {
			console.log(`xCloseWebview - RE_RUN_CNT:${RE_RUN_CNT}`);
			RE_RUN_CNT--;
			setTimeout(xCloseWebview, RE_RUN_TIME);
			return;
		}
	}

	var page = location.pathname;
	var pageName = ES_PAGES[page];
	//정의된 페이지가 있는 경우
	if (pageName != null && pageName.length > 0) {

		xToolUseEvent("E", page, pageName);
	}
}

//로그인 xcaliper 이벤트
function xLogin() {
	try {

		XCaliper.setApiServer;
	}
	catch (error) {

		if (RE_RUN_CNT > 0) {
			console.log(`xLogin - RE_RUN_CNT:${RE_RUN_CNT}`);
			RE_RUN_CNT--;
			setTimeout(xLogin, RE_RUN_TIME);
			return;
		}
	}

	xInit();
	intent.set("EVENT_TYPE", "SessionEvent");
	intent.set("ACTION_TYPE", "LoggedIn");
	//intent.set("OBJ_TYPE", "AssignableDigitalResource");

	//KT홈스쿨 앱인경우
	if (ECO_IS_KT == "Y") {		
		intent.set("UNIQUE_ACTION", "UserLoggedIn");
	}

	intent.set("ACTOR_ID", EUSER_INFO.USER_ID);
	//관리교사 계정인 경우
	if (EUSER_INFO.LOGIN_ID && EUSER_INFO.LOGIN_ID.indexOf("^#") > -1)
		intent.set("ACTOR_KIND_CD", "Teacher");
	else
		intent.set("ACTOR_KIND_CD", "Student");

	intent.set("ACTOR_LOGIN_ID", EUSER_INFO.LOGIN_ID);
	intent.set("ACTOR_GRADE", EUSER_INFO.GRADE_GBN);
	intent.set("TCHR_ID", EUSER_INFO.TEACHER_ID);
	intent.set("TCHR_LOGIN_ID", EUSER_INFO.TEACHER_LOGIN_ID);
	intent.set("OBJ_ID", EUSER_INFO.token);
	intent.set("SERVICE_ID", XCaliper_SERVICE_ID);
	xSendRequest();
}

//로그아웃 xcaliper 이벤트
function xLogout() {
	//console.log(`XCaliper:${XCaliper}, RE_RUN_CNT:${RE_RUN_CNT}`);
	if (EUSER_INFO && EUSER_INFO.USER_ID && EUSER_INFO.USER_ID != ""){

		try {
			XCaliper.setApiServer;
		}
		catch (error) {

			if (RE_RUN_CNT > 0) {
				console.log(`xLogout - RE_RUN_CNT:${RE_RUN_CNT}`);
				RE_RUN_CNT--;
				setTimeout(xLogout, RE_RUN_TIME);
				return;
			}
		}
		xInit();
		intent.set("EVENT_TYPE", "SessionEvent");
		intent.set("ACTION_TYPE", "LoggedOut");
		//KT홈스쿨 앱인경우
		if (ECO_IS_KT == "Y") {
			intent.set("UNIQUE_ACTION", "UserLoggedOut");
		}
		xSendRequest();
	}
}

//로그인 타임아웃 xcaliper 이벤트
function xLoginTimeout() {
	try {

		XCaliper.setApiServer;
	}
	catch (error) {

		if (RE_RUN_CNT > 0) {
			console.log(`xLoginTimeout - RE_RUN_CNT:${RE_RUN_CNT}`);
			RE_RUN_CNT--;
			setTimeout(xLoginTimeout, RE_RUN_TIME);
			return;
		}
	}
	xInit();
	intent.set("EVENT_TYPE", "SessionEvent");
	intent.set("ACTION_TYPE", "TimedOut");
	//KT홈스쿨 앱인경우
	if (ECO_IS_KT == "Y") {
		intent.set("UNIQUE_ACTION", "UserTimedOut");
	}
	xSendRequest();
}

/**
 * 앱(목차?) 실행,종료 xcaliper 이벤트
 * @param {S:시작, E:종료} a_type 
 * @param {실행된 URL} url 
 * @param {앱이름} name 
 */
function xToolUseEvent(a_type, url, name) {
	try {

		XCaliper.setApiServer;
	}
	catch (error) {

		if (RE_RUN_CNT > 0) {
			console.log(`xToolUseEvent - RE_RUN_CNT:${RE_RUN_CNT}`);
			RE_RUN_CNT--;
			setTimeout(xToolUseEvent, RE_RUN_TIME);
			return;
		}
	}
	if ("S" == a_type)
		a_type = "Launched";
	else
		a_type = "Used";

	console.log(`xToolUseEvent - a_type[${a_type}],url[${url}],name[${name}]`);

	xInit();
	intent.set("EVENT_TYPE", "ToolUseEvent");
	intent.set("ACTION_TYPE", a_type);
	//KT홈스쿨 앱인경우
	if (ECO_IS_KT == "Y") {
		if ("S" == a_type)
			intent.set("UNIQUE_ACTION", "AppUsed");
		else
			intent.set("UNIQUE_ACTION", "AppEnded");
	}
	intent.set("OBJ_ID", location.hostname);
	intent.set("OBJ_NAME", name);
	intent.set("OBJ_VERSION", "1.0.0");
	xSendRequest();
}

/**
 * 메뉴/텝 이동 및 컨텐츠 실행 xcaliper 이벤트
 * @param {컨텐츠 이름 (학교공부 예복습)} name 
 * @param {컨텐츠ID(오늘의 학습의 경우 serviceId)} contentid
 * @param {컨텐츠단원 전체이름} contents_desc
 * @param {navi 종류 (오늘의학습:T, 메뉴이동:M, 컨텐츠실행:C)} objType
 * @param {application(pdf),audio,image,message (http/news),multipart,text (css,csv,html),video)} mediaType
 */
function xNaviEvent(name, contentid, contents_desc, objType, mediaType, OBJ_DEPTH_1, OBJ_DEPTH_2, OBJ_DEPTH_3, OBJ_DEPTH_4, OBJ_DEPTH_5) {
	try {

		XCaliper.setApiServer;
	}
	catch (error) {

		if (RE_RUN_CNT > 0) {
			console.log(`xNaviEvent - RE_RUN_CNT:${RE_RUN_CNT}`);
			RE_RUN_CNT--;
			setTimeout(xNaviEvent, RE_RUN_TIME);
			return;
		}
	}

	xInit();
	intent.set("EVENT_TYPE", "NavigationEvent");
	intent.set("ACTION_TYPE", "NavigatedTo");
	//KT홈스쿨 앱인경우
	if (ECO_IS_KT == "Y") {
		intent.set("UNIQUE_ACTION", "ReadingNavigatedTo");

		if (OBJ_DEPTH_1)
			intent.set("OBJ_DEPTH_1", OBJ_DEPTH_1);
		if (OBJ_DEPTH_2)
			intent.set("OBJ_DEPTH_2", OBJ_DEPTH_2);
		if (OBJ_DEPTH_3)
			intent.set("OBJ_DEPTH_3", OBJ_DEPTH_3);
		if (OBJ_DEPTH_4)
			intent.set("OBJ_DEPTH_4", OBJ_DEPTH_4);
		if (OBJ_DEPTH_5)
			intent.set("OBJ_DEPTH_5", OBJ_DEPTH_5);
	}
	
	var obj_id = location.protocol+"//"+location.hostname+location.pathname;
	obj_id += "." + Base64.encode(name);
	if(contentid) obj_id += "." + contentid;

	intent.set("OBJ_ID", obj_id);
	intent.set("OBJ_NAME", name);
	
	if ("T" == objType){//오늘의학습
		intent.set("OBJ_TYPE", "AssignableDigitalResource");
		if(mediaType && mediaType != "") intent.set("OBJ_MEDIA_TYPE", mediaType);
	}
	else if ("M" == objType){//메뉴이동
		intent.set("OBJ_TYPE", "DigitalResourceCollection");
	}
	else{//컨텐츠실행
		intent.set("OBJ_TYPE", "DigitalResource");
		if(mediaType && mediaType != "") intent.set("OBJ_MEDIA_TYPE", mediaType);
	}
	
	intent.set("OBJ_DESC", contents_desc);
	intent.set("OBJ_CONTENT_ID", contentid);

	xSendRequest();
}

/**
 * 메뉴/텝 이동 및 컨텐츠 실행 xcaliper 이벤트
 * xNaviEvent() 와 동일한 함수지만, 확장성을 위해서 파라미터를 js object로만 받는다
 * js object의 key는 xNaviEvent()의 파라미터 명과 동일하고, 여기에는 추가된 파라미터만 기입한다.
 * @param {이동하려는 URL} url
 */
function xNaviEvent2(params) {
	try {

		XCaliper.setApiServer;
	}
	catch (error) {

		if (RE_RUN_CNT > 0) {
			console.log(`xNaviEvent - RE_RUN_CNT:${RE_RUN_CNT}`);
			RE_RUN_CNT--;
			setTimeout(xNaviEvent, RE_RUN_TIME);
			return;
		}
	}

	// 오류 방어를 위한, 파라미터 초기화
	if(!params) {
		console.warn("param must provided");
		return;
	}
	if(!params.hasOwnProperty("name")) params["name"] = null;
	if(!params.hasOwnProperty("contentid")) params["contentid"] = null;
	if(!params.hasOwnProperty("contents_desc")) params["contents_desc"] = null;
	if(!params.hasOwnProperty("objType")) params["objType"] = null;
	if(!params.hasOwnProperty("mediaType")) params["mediaType"] = null;
	if(!params.hasOwnProperty("OBJ_DEPTH_1")) params["OBJ_DEPTH_1"] = null;
	if(!params.hasOwnProperty("OBJ_DEPTH_2")) params["OBJ_DEPTH_2"] = null;
	if(!params.hasOwnProperty("OBJ_DEPTH_3")) params["OBJ_DEPTH_3"] = null;
	if(!params.hasOwnProperty("OBJ_DEPTH_4")) params["OBJ_DEPTH_4"] = null;
	if(!params.hasOwnProperty("OBJ_DEPTH_5")) params["OBJ_DEPTH_5"] = null;
	if(!params.hasOwnProperty("url")) params["url"] = null;

	xInit();
	intent.set("EVENT_TYPE", "NavigationEvent");
	intent.set("ACTION_TYPE", "NavigatedTo");
	//KT홈스쿨 앱인경우
	if (ECO_IS_KT == "Y") {
		intent.set("UNIQUE_ACTION", "ReadingNavigatedTo");

		if (params.OBJ_DEPTH_1)
			intent.set("OBJ_DEPTH_1", params.OBJ_DEPTH_1);
		if (params.OBJ_DEPTH_2)
			intent.set("OBJ_DEPTH_2", params.OBJ_DEPTH_2);
		if (params.OBJ_DEPTH_3)
			intent.set("OBJ_DEPTH_3", params.OBJ_DEPTH_3);
		if (params.OBJ_DEPTH_4)
			intent.set("OBJ_DEPTH_4", params.OBJ_DEPTH_4);
		if (params.OBJ_DEPTH_5)
			intent.set("OBJ_DEPTH_5", params.OBJ_DEPTH_5);
	}
	
	var obj_id;
	if(params.url) {
		obj_id = params.url
	} else {
		obj_id = location.protocol+"//"+location.hostname+location.pathname;
	}
	obj_id += "." + Base64.encode(params.name);
	if(params.contentid) obj_id += + "." + params.contentid;

	intent.set("OBJ_ID", obj_id);
	intent.set("OBJ_NAME", params.name);
	
	if ("T" == params.objType){//오늘의학습
		intent.set("OBJ_TYPE", "AssignableDigitalResource");
		if(params.mediaType && params.mediaType != "") intent.set("OBJ_MEDIA_TYPE", params.mediaType);
	}
	else if ("M" == params.objType){//메뉴이동
		intent.set("OBJ_TYPE", "DigitalResourceCollection");
	}
	else{//컨텐츠실행
		intent.set("OBJ_TYPE", "DigitalResource");
		if(params.mediaType && params.mediaType != "") intent.set("OBJ_MEDIA_TYPE", params.mediaType);
	}
	
	intent.set("OBJ_DESC", params.contents_desc);
	intent.set("OBJ_CONTENT_ID", params.contentid);

	xSendRequest();
}




/**
 * 학습 시작, 종료, 완료 이벤트 처리
 * @param {0:시작, 1:종료, 2:완료 또는 타입 문자열} a_type 
 * @param {학습ID?} obj_id 
 * @param {오늘의 학습여부 ("Y","N") 또는 타입 문자열} objType
 * @param {학습제목} name 
 * @param {학습구분(S:교과, U:비교과 또는 종류 문자열)} kind
 * @param {','로 구분한 식별태그 문자열 목록} keyword 
 * @param {','로 구분한 학습정보(단원 명칭)} learn 
 * @param {application/mp4, application/ogg, application/mpeg4-generic, application/pdf, application/vnd.adobe.flash.movie, 
 * 				audio/3gpp, audio/mpeg, audio/ogg, audio/ac3, audio/aac, image/bmp, image/png, image/tiff, image/jpeg, message/http,
 * 				message/news multipart, multipart/form-data, multipart/voice-message, text/css, text/csv, text/html, video/3gpp,
 * 				video/JPEG, video/mp4, video/mpeg4-generic, video/ogg, video/vnd.youtube.yt} mediaType
 * @param {허용된 시도 횟수} attempts
 * @param {허용된 최대 점수} score
 * @param {허용된 제출 횟수} submits
 * @param {학습진행정도?} objProgressDay
 */
function xAssignEvent(a_type, obj_id, objType, name, kind, keyword, learn, mediaType, attempts, score, submits, objProgressDay) {
	try {

		XCaliper.setApiServer;
	}
	catch (error) {

		if (RE_RUN_CNT > 0) {
			console.log(`xRunCont - RE_RUN_CNT:${RE_RUN_CNT}`);
			RE_RUN_CNT--;
			setTimeout(xRunCont, RE_RUN_TIME);
			return;
		}
	}

	/* 임시로, 전달받은 값이 비어있지 않은 변수일 경우 true 반환하는 함수 */
	var fnIsSet = function(arg) { return ( (arg && arg != "") ? true : false); };

	//var objType = null;

	//AssignableDigitalResource:오늘의학습, DigitalResource:스스로학습
	if (objType == "Y")
		objType = "AssignableDigitalResource"; 
	else if(objType == "N")
		objType = "DigitalResource";

	if(a_type == 0)
		a_type = "Start";
	else if(a_type == 1)
		a_type = "Pause";
	else if(a_type == 2)
		a_type = "Completed";

	if (kind == "S")
		kind = "CourseSection";
	else if (kind == "U")
		kind = "Chapter";	

	xInit();
	intent.set("EVENT_TYPE", "AssignableEvent");
	intent.set("ACTION_TYPE", a_type);

	//KT홈스쿨 앱인경우
	if (ECO_IS_KT == "Y") {
		if (a_type == 0 || a_type.toLowerCase() == "started")
			intent.set("UNIQUE_ACTION", "AssignableStudyStarted");
		else if (a_type == 1 || a_type.toLowerCase() == "paused")
			intent.set("UNIQUE_ACTION", "AssignablePaused");
		else if (a_type == 2 || a_type.toLowerCase() == "completed")
			intent.set("UNIQUE_ACTION", "AssignableStudyCompleted");
	}

	if(fnIsSet(obj_id)) intent.set("OBJ_ID", obj_id);
	if(fnIsSet(objType)) intent.set("OBJ_TYPE", objType);
	if(fnIsSet(name)) intent.set("OBJ_NAME", name);
	if(fnIsSet(kind)) intent.set("OBJ_KIND", kind);
	if(fnIsSet(keyword)) intent.set("OBJ_KEYWORDS", keyword);
//	intent.set("OBJ_VERSION","1.0");
	if(fnIsSet(learn)) intent.set("OBJ_LEARN_OBJS", learn);
	if(fnIsSet(mediaType)) intent.set("OBJ_MEDIA_TYPE", mediaType);
	if(fnIsSet(attempts)) intent.set("OBJ_MAX_ATTEMPTS", attempts);
	if(fnIsSet(score)) intent.set("OBJ_MAX_SCORE", score);
	if(fnIsSet(submits)) intent.set("OBJ_MAX_SUBMITS", submits);
	if(fnIsSet(objProgressDay)) intent.set("OBJ_PROG_DAY", objProgressDay);
	xSendRequest();
}

const ES_PAGES = {
	"/kt/html/main/todayStudy.html":
		"오늘의 학습",
	"/kt/html/main/curriculumStudy.html":
		"교과학습",
	"/kt/html/main/testStudyP.html":
		"평가학습",
	"/kt/html/main/koreanStudy.html":
		"국어공부",
	"/kt/html/main/mathStudy.html":
		"수학공부",
	"/kt/html/main/englishStudy.html":
		"영어공부",
	"/kt/html/main/specialStudy.html":
		"특별학습",
	"/kt/html/videoedu/videoEducation.html":
		"화상교육",
	"/kt/html/mypage/mypage.html":
		"마이 페이지",
	"/kt/html/mypage/modifyInfo.html":
		"정보수정",
	"/kt/html/main/koreaCulture.html":
		"한국문화100",
	"/kt/html/main/homeTraining.html":
		"홈트레이닝 생활체조",
	"/kt/html/main/dailySound.html":
		"일상의소리",
};

/* xCaliper 수집 제외할 페이지들 */
const EX_PAGES = [
	"/kt/html/intro/selectProfile.html"
];

$(document).ready(function () {
	/**
	 * xCaliper 연동 시 현재 webpage의 이름을 조회 반환
	 * 없는 경우 정의 되지 않은 페이지로 처리
	 */
	var page = location.pathname;
	var pageName = ES_PAGES[page];

	// 현재 페이지가 제외 페이지인 경우 xCaliper 호출 안함
	if(false && !EX_PAGES.includes(page)) {
		//정의된 페이지가 없는 경우
		if (pageName == null || pageName.length == 0)
			pageName = page.substring(page.lastIndexOf("/"));

		xNaviEvent(pageName, "", pageName, "M");
	}

	// <a> 태그 전체에 xCaliper 이벤트를 붙인다
	$("a").each(function(idx, el) {
		// href 속성이 #로 시작하지 않는다면, 정상적인 링크로 보고 xCaliper 이벤트를 심는다
		if(!$(el).attr("href").startsWith("#")) {
			$(el).on("click", function(evt) {
				callAnchorxCaliper(el);
			});
		}
	});

	//초등인 경우 공통 이벤트 처리
	if (EUSER_INFO && EUSER_INFO.isSchoolingUser != true) {
		//초등 목차 tab menu 이동 xcaliper 처리
		$('.menu_top ul li').on('click dbclick touch', function () {

			xNaviEvent(pageName, "", `${pageName}>${$(this).text()}`, "M");
		});
	}
});
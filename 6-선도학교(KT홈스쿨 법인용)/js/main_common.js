const SUBJ_TAB_LIST = [
	{
		subj_nm: "국어",
		subj_tab: "tab_1",
		subj_css: "korean"
	},
	{
		subj_nm: "수학",
		subj_tab: "tab_2",
		subj_css: "math"
	},
	{
		subj_nm: "사회",
		subj_tab: "tab_3",
		subj_css: "society"
	},
	{
		subj_nm: "과학",
		subj_tab: "tab_4",
		subj_css: "science"
	},
	{
		subj_nm: "영어",
		subj_tab: "tab_5",
		subj_css: "english"
	},
	{
		subj_nm: "방학수학",
		subj_tab: "tab_6",
		subj_css: "math"
	},
	{
		subj_nm: "방학사회",
		subj_tab: "tab_7",
		subj_css: "society"
	},
	{
		subj_nm: "방학과학",
		subj_tab: "tab_8",
		subj_css: "combine"
	},
	{
		subj_nm: "통합",
		subj_tab: "tab_9",
		subj_css: "combine"
	}
];

/**
 * 오늘의 학습 달력 생성
 * @param {날짜이동 포인트} naviPoint 
 */
function fnMkMainCalendar(naviPoint) {

	var toDay = null;
	var isCMonth = false;
	if (naviPoint) {
		var cYear = parseInt($('#calendarMonthID').attr("cYear"), 10);
		var cMonth = parseInt($('#calendarMonthID').attr("cMonth"), 10) - 1;
		toDay = new Date(cYear, cMonth + naviPoint, 1);
		var rcDay = new Date();
		if (rcDay.getFullYear() == toDay.getFullYear() && rcDay.getMonth() == toDay.getMonth()) {
			toDay = rcDay;
			isCMonth = true;
		}
		naviPoint = false;
	}
	else {
		naviPoint = true;
		isCMonth = true;
		if (window.SEL_DATE)
			toDay = window.SEL_DATE;
		else
			toDay = new Date();
	}

	var firstDayOfWeek = new Date(toDay.getFullYear(), toDay.getMonth(), 1).getDay()// Sunday - Saturday : 0 - 6;
	var lastDay = new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0).getDate();
	var lastDayOfWeek = new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0).getDay();
	var prevLastDay = new Date(toDay.getFullYear(), toDay.getMonth(), 0).getDate();

	/*console.log("firstDayOfWeek : "+firstDayOfWeek);
	console.log("lastDay : "+lastDay);
	console.log("lastDayOfWeek : "+lastDayOfWeek);
	console.log("prevLastDay : "+prevLastDay);*/

	var cdStr = "";
	for (var n = 0; n < lastDay + firstDayOfWeek + (6 - lastDayOfWeek); n++) {

		if (n == 0 || n % 7 == 0)
			cdStr += '<tr>';

		if (firstDayOfWeek > n)
			cdStr += '	<td class="extMonth">' + (prevLastDay - (firstDayOfWeek - 1 - n)) + '</td>';
		else if (n - firstDayOfWeek >= lastDay)
			cdStr += '	<td class="extMonth">' + ((1 + n) - firstDayOfWeek - lastDay) + '</td>';
		else if (isCMonth && toDay.getDate() == (1 + (n - firstDayOfWeek)))
			cdStr += '	<td class="on" data-day="' + (1 + (n - firstDayOfWeek)) + '">' + (1 + (n - firstDayOfWeek)) + '</td>';
		else
			cdStr += '	<td>' + (1 + (n - firstDayOfWeek)) + '</td>';

		if (n % 7 == 6)
			cdStr += '</tr>';
	}
	if (lastDay + firstDayOfWeek + (6 - lastDayOfWeek) < 40) {
		cdStr += '<tr>';
		for (var n = 0; n < 7; n++) {

			cdStr += '	<td class="extMonth">' + ((36 + n) - firstDayOfWeek - lastDay) + '</td>';
		}
		cdStr += '</tr>';
	}


	var calTitle = $('#calendarMonthID').text();
	if (naviPoint) {
		calTitle = calTitle.replace(/N%/, (toDay.getFullYear()));
		calTitle = calTitle.replace(/N%/, (toDay.getMonth() + 1));
	}
	else {

		calTitle = calTitle.replace(/\d{4}([^\d]+)/ig, (toDay.getFullYear()) + "$1");
		calTitle = calTitle.replace(/(\d{4}[^\d]+)\d{1,2}([^\d]+)/ig, "$1" + (toDay.getMonth() + 1) + "$2");
	}

	$('#calendarMonthID').text(calTitle);
	$('#calendarMonthID').attr("cYear", toDay.getFullYear());
	$('#calendarMonthID').attr("cMonth", (toDay.getMonth() + 1));
	$('#mainCalDaysID').html(cdStr);
	$('#layers').css('display', 'flex');
	//setLanguage("ko", document.getElementById("mainTopNaviID"));

	$('#mainCalDaysID td').on("click", function () {

		$('#mainCalDaysID td').each(function () {

			$(this).removeAttr("data-day");
			$(this).removeClass("on");
		});

		$('#calendarMonthID').attr("cDate", $(this).text());
		$(this).attr("data-day", $(this).text());
		$(this).addClass("on");
	});
}

/**
 * 오늘의 학습 선택 시 컨텐츠 바로가기
 * @param {오늘의 학습 목록 인덱스} idx 
 */
function fnTodaySubj(idx) {

	var list = window.TODAYLIST;

	if (list[idx].course_div == "A") { //학교학습의 경우 연동

		var svc_flag = list[idx].svc_flag;
		var study_course_id = list[idx].study_course_id;
		var grade_gbn = list[idx].grade_gbn;
		var semester_gbn = list[idx].semester_gbn;
		var subj_viw_nm = list[idx].subj_viw_nm;
		var pre_subj_nm = list[idx].pre_subj_nm;

		//컨텐츠 생성 전 임시 코드 KBS
		svc_flag = "0";
		study_course_id = "16512";
		grade_gbn = "5";
		semester_gbn = "1";
		subj_viw_nm = "국어";
		pre_subj_nm = "국어";

		/* @param {*} svc_flag 
		 * @param {*} studyCourceId 
		 * @param {*} gradeDiv 
		 * @param {*} termCd 
		 * @param {*} subjViwNm 
		 * @param {*} preSubjNm 
		 */
		ifNativeRun("openStudyContents", svc_flag, study_course_id, grade_gbn, semester_gbn, subj_viw_nm, pre_subj_nm);
	}
	else {

		var le_svc_flag = list[idx].le_svc_flag;
		var point_svc_flag = list[idx].point_svc_flag;
		var pinpoint_svc_flag = list[idx].pinpoint_svc_flag;
		var category_no = list[idx].category_no;

		if (svc_flag != 1 && le_svc_flag != 1 && point_svc_flag != 1 && pinpoint_svc_flag != 1 && category_no) {

			if (category_no.indexOf("20014") > -1) {//받아쓰기

				openWebView("");
			}
			else if (category_no.indexOf("20014") > -1) {//받아쓰기

			}
		}
	}
}


//오류노트 목록 목록
window.EN_LIST = null;
//오류노트 목록 상세 이동
function fnGoErrorNoteDetail(idx) {

	var list = window.EN_LIST;
}

//최근 등록된 오류노트 목록 조회
function fnOpenErrorNote() {
	var cnt = 0;
	if ($('#errorNoteID').length > 0)
		cnt = $('#errorNoteID').text();
	var param = {
		count: cnt, 
		user_cd: EUSER_INFO.STUDENT_NO
	};

	$.postJSON('hexm', '/sigong/test/errNoteTopList.json', param, fnOpenErrorNoteOk, false, "POST");
}

//최근 등록된 오류노트 목록 출력
function fnOpenErrorNoteOk(reqData) {

	var html = null;
	if (reqData && reqData.resultCode == "0") {

		var list = reqData.testList;
		var subjTitle = null;
		var wt_dt = null;
		var remDt = 0;
		for (var n = 0; n < list.length; n++) {

			wt_dt = new Date(list[n].write_dt);
			remDt = 7 - parseInt((new Date() - wt_dt) / 1000 / 60 / 60 / 24, 10);
			if (remDt < 1) // 7일 이후에는 목록에서 제외
				continue;
			
			if (n == 0)
				html = `        <ul class="scroll transparent _scroll" style="height: 435px;">`;

			subjTitle = `${list[n].grade_div}-${list[n].term_cd} ${list[n].exam_nm}`;

			html += `          <li>`;
			html += `            <a href="#" onclick="fnGoErrorNoteDetail(${n});">`;
			html += `              <span class="date-wrap">`;
			html += `                <img src="../../img/element/main/ic_siren.png" alt="">`;
			html += `                <em class="date">${remDt}일 남음</em>`;
			html += `              </span>`;
			html += `              <span class="subject-wrap">`;
			html += `                <em class="badge-subject">${list[n].subj_viw_nm}</em>`;
			html += `              </span>`;
			html += `              <span class="tit-area">`;
			html += `                <em class="tit-sm">${subjTitle}</em>`;
			html += `                <em class="tit">${list[n].order_nm} ${list[n].study_course_nm}</em>`;
			html += `                <em class="badge-q"><em class="text">남은문제</em><em class="val">${list[n].wrong_cnt}</em></em>`;
			html += `              </span>`;
			html += `            </a>`;
			html += `          </li>`;
		}
		if (html != null){

			html += "</ul>";
			window.EN_LIST = list;
		}
	}

	if (html != null) {

		$('#openPopup').removeClass("popup_evaluation_results");
		$('#openPopup').addClass("popup_recent_incorrect_answer_note");
		$('.title-area .title').text("최근 등록된 풀어야 할 오답노트");
		$('.modal-content .btn-wrap').empty();
		$('.modal-content .btn-wrap').append('<a href="#" onclick="ifCallScheme(\'learningstatus://errnote\');">오답노트 전체보기</a>');
		$('.modal-content .list-wrap').empty();
		$('.modal-content .list-wrap').append(html);
		$('#openPopup').modal('show');
		$("._scroll").mCustomScrollbar();
	}
}


//선생님 채점결과 목록
window.TC_LIST = null;
//선생님 채점결과 상세 이동
function fnGoTeacherCheck(idx) {

	var list = window.TC_LIST;
}

//선생님 채점결과 조회
function fnOpenTeacherCheck() {
	var param = {
		user_cd: EUSER_INFO.STUDENT_NO
	};

	$.postJSON('hexm', '/sigong/test/testTopList.json', param, fnOpenTeacherCheckOk, false, "POST");
}

//선생님 채점결과 출력
function fnOpenTeacherCheckOk(reqData) {

	var html = null;
	if (reqData && reqData.resultCode == "0") {

		var list = reqData.testList;
		var date = null;
		var subjTitle = null;
		for (var n = 0; n < list.length; n++) {

			if (n == 0)
				html = `        <ul class="scroll transparent _scroll" style="height: 435px;">`;

			subjTitle = `${list[n].grade_div}-${list[n].term_cd} ${list[n].exam_nm}`;
			date = list[n].write_dt;
			date = date.replace(/\d{4}-(\d{2})-(\d{2})/, "$1월$2일");

			html += `          <li>`;
			html += `            <a href="#" onclick="fnGoTeacherCheck(${n});">`;
			html += `              <span class="date-wrap">`;
			html += `                <img src="../../img/element/main/popup_ev_img_completed.png" alt="">`;
			html += `                <em class="date">${date}</em>`;
			html += `              </span>`;
			html += `              <span class="subject-wrap">`;
			html += `                <em class="badge-subject">${list[n].subj_viw_nm}</em>`;
			html += `                <em class="step">${list[n].order_nm}</em>`;
			html += `              </span>`;
			html += `              <span class="tit-area">`;
			html += `                <em class="tit-sm">${subjTitle}</em>`;
			html += `                <em class="tit">${list[n].order_nm} ${list[n].study_course_nm}</em>`;
			html += `                <em class="badge-score">${list[n].score}</em>`;
			html += `              </span>`;
			html += `            </a>`;
			html += `          </li>`;
		}
		if (html != null)
			html += "</ul>";

		window.TC_LIST = list;
	}

	if (html == null) {

		html = '        <div class="empty">';
		html += '          <div class="img"><img src="../../img/element/main/popup_ev_img_empty.png" alt=""></div>';
		html += '          <div class="text">선생님께서 채점한 평가결과 중<br/>틀린 문제 다시 풀기를 할 평가지가 없습니다.</div>';
		html += '        </div>';
	}
	
	$('#openPopup').removeClass("popup_recent_incorrect_answer_note");
	$('#openPopup').addClass("popup_evaluation_results");
	$('.title-area .title').text("선생님이 채점한 평가 결과");
	$('.modal-content .btn-wrap').empty();
	$('.modal-content .btn-wrap').append('<a href="#" onclick="fnOpenTestList();">서술형 평가</a>');
	$('.modal-content .btn-wrap').append('<a href="#" onclick="fnOpenExamList();">성취도 평가</a>');
	$('.modal-content .list-wrap').empty();
	$('.modal-content .list-wrap').append(html);
	$('#openPopup').modal('show');
	$("._scroll").mCustomScrollbar();
} 

//서술형평가 바로가기
function fnOpenTestList() {

	openWebView(`/es/html/school/eTestList.html?tab=tab_5&grade=${EUSER_INFO.GRADE_GBN}&term=${EUSER_INFO.SEMESTER_GBN}`);
}

//성취도평가 바로가기
function fnOpenExamList() {

	openWebView(`/es/html/school/eExamList.html?tab=tab_5&grade=${EUSER_INFO.GRADE_GBN}&term=${EUSER_INFO.SEMESTER_GBN}`);
}

//출석체크 바로가기 (사용안함)
function fnAttendanceMap() {

	var attUrl = Global.A_URL("hstu", "/sigong/android/student/myroom/popup/AttendanceMapMain.do");
	attUrl += "?student_id=" + EUSER_INFO.STUDENT_NO + "&userr_id=" + EUSER_INFO.USER_ID;
	openWebView(attUrl);
}


//캐릭터이미지 set
function fnSetTodyaFeeling() {

	var crtNo = EUSER_INFO.TODAY_FEELING;

	var img = $(".profileIcon").children().children('img');
	img.attr('src', fnGetCharacterSrc(crtNo));

}

//캐릭터 설정하기 팝업
function openCharacter() {

	characterNo = EUSER_INFO.TODAY_FEELING;

	if ($("#introMath").length > 0) {
		$("#introMath").remove();
	}
	$(document.body).append('<div class="modal modal-big modal-info fade modal_character" id="introMath" data-backdrop="static" tabindex="-1" role="dialog" aria-modal="true">');

	includeHtml('#introMath', '../../html/main/eCharacter.html', function () {

		if (!$.isEmpty(onCharacter) && typeof onCharacter == "function") {
			onCharacter(characterNo);
		}
	});
}


//배너 조회
function fnGetBanner() {
	var param = {
		user_id: EUSER_INFO.USER_ID,
		isSchoolingUser: (!$.isEmpty(EUSER_INFO.frontSa)) ? "Y" : "N",
		grade: EUSER_INFO.GRADE_GBN,
		post_location: "04"
	};

	$.postJSON('eco', '/eco/api/app/bannerList', param, fnGetBannerOk, false, "POST");

}

//배너 데이터 세팅
function fnGetBannerOk(resData) {

	console.log(resData);

	if (resData != null && resData.errorCode == "0000") {

		var htmlStr = '';
		var bannerList = resData.bannerList;

		if (bannerList != null && bannerList.length > 0) {

			htmlStr += '<section class="bannerSection">';
			htmlStr += ' <div class="scrollXMandatory">';

			for (var i = 0; i < bannerList.length; i++) {
				htmlStr += '<img src="' + bannerList[i].image_url + '" alt="' + bannerList[i].title + '" onClick="openWebView(\'' + bannerList[i].action_url + '\')"/>';
			}

			htmlStr += ' </div>';
			htmlStr += ' <ul class="bannerIndicator">';
			for (var j = 0; j < bannerList.length; j++) {
				if (i == 0) {
					htmlStr += '<li class="on"></li>';
				} else {
					htmlStr += '<li></li>';
				}
			}
			htmlStr += ' </ul>';
			htmlStr += '</section>';

			$('#esAside').append(htmlStr);

			//배너 롤링
			$(".bannerSection > div").scrollEnd(function ($this) {
				var $dots = $this.siblings(".bannerIndicator");
				var scrollLeft = $this[0].scrollLeft;
				var itemWidth = $this.children().eq(0).width();
				var index = Math.round(scrollLeft / itemWidth);
				$dots.children().eq(index).addClass("on").siblings().removeClass("on");
			});

			setInterval(function () {
				$(".bannerSection div").nextSlide();
			}, 3000);
		}
	}
}

//오답노트 카운트 조회 api 호출 (사용페이지에서 fnGetErrorNoteOk 구현해야함)
function fnGetErrorNote() {

	var param = {
		grade: EUSER_INFO.GRADE_GBN,
		user_cd: EUSER_INFO.STUDENT_NO,
		term: EUSER_INFO.SEMESTER_GBN
	};
	$.postJSON('hexm', '/sigong/test/errNoteTopCount.json', param, fnGetErrorNoteOk, false);
}

//선택한 날짜 정보 저장
window.SEL_DATE = null;
/**
 * 달력 및 요일 선택 시 조회 조건 설정 (사용페이지에서 fnGetTodayOk 구현해야함)
 * @param {*} year 
 * @param {*} month 
 * @param {*} date 
 * @param {*} week 
 */
function fnGetToday(year, month, date, week) {

	var gToday = new Date();
	if (SEL_DATE != null)
		gToday = SEL_DATE;

	if (year)
		gToday.setFullYear(year);
	if (month)
		gToday.setMonth(month - 1);
	if (date)
		gToday.setDate(date);
	if (week) {

		//console.log("current day : " + gToday.format("yyyy-MM-dd"));
		var cwk = gToday.getDay();
		if (cwk == 0)
			cwk = 7;

		if (week == 0)
			gToday.setDate(gToday.getDate() - cwk);
		else if (week == 8)
			gToday.setDate(gToday.getDate() + (week - cwk));
		else {
			if (cwk > week)
				gToday.setDate(gToday.getDate() - (cwk - week));
			else if (cwk < week)
				gToday.setDate(gToday.getDate() + (week - cwk));
		}
	}
	else {
		week = gToday.getDay();
		if (week == 0)
			week = 7;
	}
	SEL_DATE = gToday;
	//console.log("cwk : "+ cwk+" ,week : " + week+" ,select day : " + gToday.format("yyyy-MM-dd"));

	var seltxt = $("#selectDayId").text();
	if (seltxt.indexOf("%") > -1) {

		seltxt = seltxt.replace(/N%/, gToday.getMonth() + 1);
		seltxt = seltxt.replace(/N%/, gToday.getDate());
	} else {

		seltxt = seltxt.replace(/\d{1,2}([^\d]+)/ig, (gToday.getMonth() + 1) + "$1");
		seltxt = seltxt.replace(/(\d{1,2}[^\d]+)\d{1,2}([^\d]+)/ig, "$1" + (gToday.getDate()) + "$2");
	}

	if (week == 0)
		week = 7;
	else if (week == 8)
		week = 1;

	$(".dateNav a[val]").each(function () {

		if ($(this).attr("val") != week) {
			$(this).removeClass("on");
			$(".dateNav a[val] span").remove();
		}
	});
	$(".dateNav a[val='" + week + "']").append("<span>" + seltxt + "</span>");
	$(".dateNav a[val='" + week + "']").addClass("on");

	var param = {
		user_id: EUSER_INFO.USER_ID,
		student_no: EUSER_INFO.STUDENT_NO,
		date: gToday.format("yyyy-MM-dd")
	};
	$.postJSON('eco', '/eco/api/btobMain', param, fnGetTodayOk, false);
}

//출석체크 링크 조회
function fnGetAttendanceInfo() {
	var param = {
		user_id: EUSER_INFO.USER_ID
	};

	// xCaliper 호출 가능하다면 호출한다
	if(typeof xNaviEvent2 == "function") {
		xNaviEvent2({
			name: "출석체크",
			content_desc: "출석체크",
			obj_type: "M"
		});
	}

	$.postJSON('hstu', '/sigong/android/student/widget/BannerInfo.json', param, fnGetAttendanceInfoOk, false, "POST");

}

//출석체크 링크 실행
function fnGetAttendanceInfoOk(resData) {

	console.log(resData);

	if (resData != null && resData.expUrl) {

		if(Global.isApp)
			ifCallScheme('BannerView://?webviewUrl='+resData.expUrl);
		else
			openWebView(resData.expUrl);
	}
}
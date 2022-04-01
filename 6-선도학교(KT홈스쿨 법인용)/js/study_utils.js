/**
 * 교과 관련 공통 함수
 */
//메인화면 오늘의 학습목록 과목 아이콘 css class 반환
function fnGetSubjIcon (subjNm){

	for (var n = 0; n < SUBJ_TAB_LIST.length; n++){

		if (subjNm == SUBJ_TAB_LIST[n].subj_nm) {

			return SUBJ_TAB_LIST[n].subj_css;
		}
	}
	return "";
}

//tab명으로 tab id 조회
function fnGetTabID(reqSubj) {

	for (var n = 0; n < SUBJ_TAB_LIST.length; n++) {

		if (reqSubj == SUBJ_TAB_LIST[n].subj_nm) {

			return SUBJ_TAB_LIST[n].subj_tab;
		}
	}
	return null;
}
//tab id로 tab명 조회
function fnGetTabName(tabId) {

	for (var n = 0; n < SUBJ_TAB_LIST.length; n++) {

		if (tabId == SUBJ_TAB_LIST[n].subj_tab) {

			return SUBJ_TAB_LIST[n].subj_nm;
		}
	}
	return null;
}

//tab id로 tab 메뉴 설정
function fnSetTabMenu(tabId, grade, term) {

	if (tabId.indexOf("tab") < 0)
		tabId = fnGetTabID(tabId);

	//console.log("tabId : " + tabId + ", grade : " + grade + ", term : " + term);
	//선택된 학년,학기에 속한 과목목록 설정
	var gtSubjList = false;
	for (var s = 0; s < SUBJ_LIST.length; s++) {

		if (SUBJ_LIST[s].grade == grade && SUBJ_LIST[s].term == term) {

			gtSubjList = SUBJ_LIST[s].subjList;
			break;
		}
	}

	var isDisplay = false;
	for (var n = 0; n < SUBJ_TAB_LIST.length; n++) {

		isDisplay = false;
		if (tabId == SUBJ_TAB_LIST[n].subj_tab) {

			$('#tabMenuID').attr("class", "wrap_school_study " + SUBJ_TAB_LIST[n].subj_css);
			$('#' + SUBJ_TAB_LIST[n].subj_tab).attr("class", "active");
			$('#' + SUBJ_TAB_LIST[n].subj_tab).css("display", "");
		}
		else{

			$('#' + SUBJ_TAB_LIST[n].subj_tab).removeAttr("class");
			for (var s = 0; s < gtSubjList.length; s++){

				//console.log("[" + gtSubjList[s].subj_nm + "] == [" + SUBJ_TAB_LIST[n].subj_nm + "] = " + (gtSubjList[s].subj_nm == SUBJ_TAB_LIST[n].subj_nm)) ;
				if (gtSubjList[s].subj_nm == SUBJ_TAB_LIST[n].subj_nm){

					isDisplay = true;
					break;
				}
			}
			if(!isDisplay)
				$('#' + SUBJ_TAB_LIST[n].subj_tab).css("display", "none");
			else
				$('#' + SUBJ_TAB_LIST[n].subj_tab).css("display", "");
		}
	}
}

//목록 상단의 선택된 학년학기 설정
function fnSetGradeTerm(grade, term){

	var gvalue = parseInt(grade, 10) * 2 -1;
	var dataValue = 0;
	if(term == 2)
		gvalue += 1;

	var tGrade = null;
	var tTerm = null;
	var tempText = null;
	$("#topGradeID li").each(function (){

		dataValue = $(this).attr("data-value");
		
		//학년학기 목록 설정
		tGrade = Math.round(dataValue / 2);
		tTerm = (dataValue % 2 == 0 ? 2 : 1);		
		tempText = $(this).text();
		tempText = tempText.replace(/N%/,tGrade);
		tempText = tempText.replace(/N%/, tTerm);
		$(this).text(tempText);

		//선택 학년학기 보기 설정
		if (dataValue == gvalue){

			$('#topGradeViewID').text($(this).text());
			$('#topGradeViewID').attr("data-value", gvalue);
		}
	});
}



function fnSchoolStudySort(l1, l2){
	
	var n1 = null;
	var n2 = null;

	var s1 = 0;
	var s2 = 0;
	var g1 = 0;
	var g2 = 0;
	var t1 = 0;
	var t2 = 0;

	var b1 = 0;
	var b2 = 0;

	var cret = 0;
	
	if ("국어" == l1.pre_subj_viw_nm ) {

		s1 = 1;
	} else if ("수학" == l1.pre_subj_viw_nm ) {

		s1 = 2;
	} else if ("사회" == l1.pre_subj_viw_nm ) {

		s1 = 3;
	} else if ("과학" == l1.pre_subj_viw_nm ) {

		s1 = 4;
	} else if ("영어" == l1.pre_subj_viw_nm ) {

		s1 = 5;
	} else if ("통합" == l1.pre_subj_viw_nm ) {

		s1 = 6;
	} else if ("방학수학" == l1.pre_subj_viw_nm ) {

		s1 = 7;
	} else if ("방학사회" == l1.pre_subj_viw_nm ) {

		s1 = 8;
	} else if ("방학과학" == l1.pre_subj_viw_nm ) {

		s1 = 9;
	}

	if ("국어" == l2.pre_subj_viw_nm ) {

		s2 = 1;
	} else if ("수학" == l2.pre_subj_viw_nm ) {

		s2 = 2;
	} else if ("사회" == l2.pre_subj_viw_nm ) {

		s2 = 3;
	} else if ("과학" == l2.pre_subj_viw_nm ) {

		s2 = 4;
	} else if ("영어" == l2.pre_subj_viw_nm ) {

		s2 = 5;
	} else if ("통합" == l2.pre_subj_viw_nm ) {

		s2 = 6;
	} else if ("방학수학" == l2.pre_subj_viw_nm ) {

		s2 = 7;
	} else if ("방학사회" == l2.pre_subj_viw_nm ) {

		s2 = 8;
	} else if ("방학과학" == l2.pre_subj_viw_nm ) {

		s2 = 9;
	}

	//System.out.println((String)l1.get("pre_subj_viw_nm ") + " =========================== " + s1);
	// 교과(S), 비교과(U) 비교 - 교과,비교과 순 정렬
	//    	s1 = (Integer)l1.get("sort");
	//    	s2 = (Integer)l2.get("sort");

	if (cret == 0) {

		g1 = l1.grade_div;
		g2 = l2.grade_div;
		if (g1 > g2)
			cret = 1;
		else if (g1 == g2)
			cret = 0;
		else
			cret = -1;

		if (cret == 0) {

			t1 = l1.term_cd;
			t2 = l2.term_cd;
			if (t1 > t2)
				cret = 1;
			else if (t1 == t2)
				cret = 0;
			else
				cret = -1;

			if (cret == 0) {

				if (s1 > s2)
					cret = 1;
				else if (s1 == s2)
					cret = 0;
				else
					cret = -1;
			}
		}
	}

	return cret;
}


function fnExamTestSort(l1, l2) {

	var n1 = null;
	var n2 = null;

	var s1 = 0;
	var s2 = 0;
	var g1 = 0;
	var g2 = 0;
	var t1 = 0;
	var t2 = 0;

	var b1 = 0;
	var b2 = 0;

	var cret = 0;

	if ("10010" == l1.exam_div) {//요점노트

		s1 = 1;
	} else if ("10001" == l1.exam_div) {//실력평가

		s1 = 2;
	} else if ("10013" == l1.exam_div) {//스피드퀴즈

		s1 = 3;
	} else if ("10002" == l1.exam_div) {//단원평가

		s1 = 4;
	} else if ("10007" == l1.exam_div) {//서술형평가

		s1 = 5;
	} else if ("10008" == l1.exam_div) {//시험대비특강

		s1 = 6;
	} else if ("10004" == l1.exam_div) {//족집게문제

		s1 = 7;
	} else if ("10012" == l1.exam_div) {//수행평가

		s1 = 8;
	} else if ("10005" == l1.exam_div) {//TOP SECRET

		s1 = 9;
	} else if ("10003" == l1.exam_div) {//성취도평가

		s1 = 10;
	} else if ("10011" == l1.exam_div) {//모의고사

		s1 = 11;
	}

	if ("10010" == l2.exam_div) {//요점노트

		s2 = 1;
	} else if ("10001" == l2.exam_div) {//실력평가

		s2 = 2;
	} else if ("10013" == l2.exam_div) {//스피드퀴즈

		s2 = 3;
	} else if ("10002" == l2.exam_div) {//단원평가

		s2 = 4;
	} else if ("10007" == l2.exam_div) {//서술형평가

		s2 = 5;
	} else if ("10008" == l2.exam_div) {//시험대비특강

		s2 = 6;
	} else if ("10004" == l2.exam_div) {//족집게문제

		s2 = 7;
	} else if ("10012" == l2.exam_div) {//수행평가

		s2 = 8;
	} else if ("10005" == l2.exam_div) {//TOP SECRET

		s2 = 9;
	} else if ("10003" == l2.exam_div) {//성취도평가

		s2 = 10;
	} else if ("10011" == l2.exam_div) {//모의고사

		s2 = 11;
	}

	if (cret == 0) {

		g1 = l1.grade_div;
		g2 = l2.grade_div;
		if (g1 > g2)
			cret = 1;
		else if (g1 == g2)
			cret = 0;
		else
			cret = -1;

		if (cret == 0) {

			t1 = l1.term_cd;
			t2 = l2.term_cd;
			if (t1 > t2)
				cret = 1;
			else if (t1 == t2)
				cret = 0;
			else
				cret = -1;

			if (cret == 0) {

				if (s1 > s2)
					cret = 1;
				else if (s1 == s2)
					cret = 0;
				else
					cret = -1;
			}
		}
	}
	return cret;
}
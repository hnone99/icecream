[상품몰] 마크업 개발
======================
# 1. 히스토리

## 211222-v1
0. 수정 및 추가사항
```
위키 협의 문서 참고
https://wiki.i-screamedu.com/x/SAXeAw
QA
#177 - 수정완료
#609 - 수정완료
```
1. 개발 수정 요청 사항 
```
WebContent\market\html\@마이페이지-상품문의.html
<!-- 211222 | 상품문의 리스트 이슈 cont-product-ask 클래스명 추가 -->
```
2. scss
```
WebContent\market\scss\components\page-modification
WebContent\market\css\style.css
WebContent\market\css\maps\style.css.map
```


## 211221-v1
0. 수정 및 추가사항
```
위키 협의 문서 참고
https://wiki.i-screamedu.com/x/SAXeAw
```
1. 개발 수정 요청 사항 
```
WebContent\market\html\@주문결제.html
<!-- 211221 | 주문 결제 페이지 iOS 스크롤 이슈 대응 new-body-wrapper 추가 -->
<body class="new-body-wrapper">
```
2. scss
```
WebContent\market\scss\components\page-modification
WebContent\market\css\style.css
WebContent\market\css\maps\style.css.map
```

## 211217-v1
0. 수정 및 추가사항
```
위키 협의 문서 참고
https://wiki.i-screamedu.com/x/SAXeAw
```
1. scss/css
```
WebContent\market\scss\components\page-modification
WebContent\market\css\style.css
WebContent\market\css\maps\style.css.map
```

## 211215-v1
1. 개발 수정 요청 사항
```
위키 협의 문서 참고
https://wiki.i-screamedu.com/x/SAXeAw
#709 iframe 엘리먼트를 <div>로 감싸고  class="iframe-wrap" 추가  
```
2. scss/css
```
WebContent\market\scss\components\page-modification
WebContent\market\css\style.css
WebContent\market\css\maps\style.css.map
```

## 211213-v1
0. 개발 수정 요청 사항
```
상세 페이지 비디오 슬라이드 .slick-track 넓이값 width: 872px; 삭제해주세요.
```
0. 수정 및 추가사항
```
슬릭 슬라이더 여백 및 넓이값 수정
https://jira.i-screamedu.com/browse/COM-1117
이용약관 홈런 홈페이지 디자인으로 변경
https://jira.i-screamedu.com/browse/HL-38412
```
1. html
```
WebContent\market\html\@이용약관.html
<!-- 211213 이용약관 -->
```
2. scss/css
```
WebContent\market\scss\components\page-modification\_sub.scss
WebContent\market\scss\components\page\_7-page-provisions.scss
WebContent\market\scss\components\page-mobile\_7-page-provisions.scss
WebContent\market\scss\style.scss
WebContent\market\css\style.css
WebContent\market\css\maps\style.css.map
```

## 211001-v1
0. 수정 및 추가사항
```
PC
69번 가상계좌 선택 시 콘 사용 불가 메시지
75번 오프라인체험상품 구매정보 입력 화면 라인 이슈
```
```
MO
29번 오프라인체험상품 구매정보 입력 화면 라인 이슈 - 모바일 대응
```
1. scss/css
```
WebContent\market\scss\components\page-modification\_sub.scss
WebContent\market\scss\components\page-modification\_mall.scss
WebContent\market\css\style.css
WebContent\market\css\maps\style.css.map
```


## 210930-v1
0. 수정 및 추가사항
```
PC
75번 오프라인체험상품 구매정보 입력 화면 라인 이슈
```
```
MO
26번 구매자 정보 우측에 [회원정보수정] 버튼 추가
```
1. html
```
order_payment.html
[D] 210930 회원정보수정 버튼 추가
[D] 210930 오프라인 체험상품일 경우 클래스명 추가
```
2. scss/css
```
WebContent\market\scss\components\page-modification\_sub.scss
WebContent\market\css\style.css
WebContent\market\css\maps\style.css.map
```


## 210928
0. 수정 및 추가사항
```
PC
69번 가상계좌 선택 시 콘 사용 불가 메시지
```
```
MO
4번 메인 메뉴 영역 스크롤바 삭제
9번 로그인하기 UI 이슈 수정
13번 btn 클래스명이 btn_echo로 사용되고 있어 재수정
24번 테이블 깨짐 현상 수정 block -> table-row
27번 검색어 입력 영역 이슈 수정
```
```
MO
스크립트가 중복 적용되어있습니다.
<script type="text/javascript" src="/market/js/main.js"></script>
위 경로가 적용되어 있어 인라인으로 들어간 내용은 삭제해주셔야 할 것 같습니다.
```
1. scss/css
```
WebContent\market\scss\components\page
WebContent\market\scss\components\page-mobile
WebContent\market\scss\components\page-mobile-320
WebContent\market\scss\components\page-modification
```

## 210924-v2
0. 수정 및 추가사항
```
PC
63번 나의 상품문의 리스트 이미지 사이즈 수정
64번 썸네일 외곽 라인 추가
```
```
MO
13번 이미지 안나오는 이슈
17번 상단 카테고리 5개 함께 노출 필요 - 여백 수정
```
1. scss/css
```
WebContent\market\scss\components\page
WebContent\market\scss\components\page-mobile
WebContent\market\scss\components\page-mobile-320
WebContent\market\scss\components\page-modification
```
2. js
```
WebContent\market\js\main.js (스크립트 내용 적용시켜주세요)
```
3. images
```
WebContent\market\images\eco-main
```


## 210924-v1
0. 수정 및 추가사항
```
PC
1번 이미지 오버시 사이즈 키우기
9번 패밀리사이트 영역 조정
10번 slick.min.js를 slick.js로 변경해주세요.
market 폴더 내 불필요한 css 파일 삭제
```
1. html
```
top_main.html
<!-- 210924 custom-select 클래스명 추가 -->
<!-- 210830 slick js 변경 -->
<script type="text/javascript" src="../js/slick.js"></script>
```
2. scss/css
```
WebContent\market\scss\components\page
WebContent\market\scss\components\page-mobile
WebContent\market\scss\components\page-mobile-320
WebContent\market\scss\components\page-modification
```
3. js
```
WebContent\market\js\slick.min.js (삭제)
WebContent\market\js\slick.js (추가)
WebContent\market\js\main.js (수정)
```

## 210909/210915
0. 수정 및 추가사항
```
모바일 480미만 해상도 디자인 수정 반영
```
```
https://docs.google.com/spreadsheets/d/1duoGVdhS5ozh-Ey9-7JGjjixuf_iiLgSL6Qz6UEbzh4/edit#gid=576485379
18번 실명인증화면 페이지 추가
```
```
아래 소스 삭제 필요합니다.
<link type="text/css" rel="stylesheet" href="/market/css/bootstrap.css">
<link type="text/css" rel="stylesheet" href="/market/css/fonts/fontAwesomepro.css">
```
1. html
```
pop_mypage_alert_name_certification.html
<!-- [D] 210909 실명인증 팝업 추가 -->
```

2. scss/css
```
scss\components
css\style.css
css\maps\style.css.map
```

3. images
```
_temp-new
eco-common
new
new-mobile
```


## 210901
0. 수정 및 추가사항
```
상단 GNB 삭제 및 수정
메인 슬라이더 삭제 및 수정
하단 footer 삭제 및 수정
ui-product-mall 클래스는 사용하지 않고 있습니다.
ui-new 클래스로만 감싸주세요.
```

1. html
```
top_main.html
top_main_search_1.html
top_main_search_2.html
top_main-notify-1.html
top_main-notify-2.html
<!-- 210830 상단 GNB 추가 -->
<!-- 210830 main-visual-wrap 삭제 -->
<!-- 210830 하단 footer 추가 -->
```
```
top_main.html
// [S] 210830 메인 슬라이드 추가
```
```
top_main_search_1.html
top_main_search_2.html
<!-- ##서브 검색창 영역 / 기존 소스 활용 -->
```
```
top_main-notify-1.html
top_main-notify-2.html
<!-- ##서브 알림창 -->
```
```
top_product-detail.html
top_cart.html
<!-- 210830 상단/하단 css추가 -->
<!-- 210830 상단 GNB 추가 -->
<!-- 210830 하단 footer 추가 -->
```

2. scss/css
```
scss
css\style.css
css\maps\style.css.map
```

3. images
```
_temp-new
eco-common
new
new-mobile
```

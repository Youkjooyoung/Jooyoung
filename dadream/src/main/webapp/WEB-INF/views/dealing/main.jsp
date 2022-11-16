<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<%
  request.setCharacterEncoding("UTF-8");
%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>부동산 메인</title>
    <!-- 제이쿼리 -->
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <!-- css -->
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <!--JS-->
    <script src="/js/dealingJS/main.js"></script>
     <!-- 글꼴 -->
     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
     <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
</head>

<body>
    <div id="main1">
        <!--아래 form 부분 중앙정렬 검토필요-->
        <ul class="search">
            <li>
                <form method="get" action="${contextPath}/map.do"><button type="submit" name="dl_Form"
                        value="all">전체</button></form>
            </li>
            <li>
                <form method="get" action="${contextPath}/map.do"><button type="submit" name="dl_Form"
                        value="아파트">아파트</button></form>
            </li>
            <li>
                <form method="get" action="${contextPath}/map.do"><button type="submit" name="dl_Form"
                        value="투룸">투룸+</button></form>
            </li>
            <li>
                <form method="get" action="${contextPath}/map.do"><button type="submit" name="dl_Form"
                        value="원룸">원룸</button></form>
            </li>
            <li>
                <form method="get" action="${contextPath}/map.do"><button type="submit" name="dl_Form"
                        value="오피스텔">오피스텔</button></form>
            </li>
            <li>
                <form method="get" action="${contextPath}/map.do"><button type="submit" name="dl_Form"
                        value="주택">주택</button></form>
            </li>
        </ul>
        <div id="search">
            <form method="get" action="${contextPath}/map.do" id="mapForm">
                <input class="dealingsearch" type="search" name="dl_Address" placeholder="검색어를 입력하세요." />
                <input class="MainSearch" type="submit" value="검색"></form>
            </form>
        </div>
    </div>

    <div id="main2">
        <form>
            <!-- 위치기반 API 추천매물 -->
            <h1 class="hereMe">현위치 추천 매물</h1>
            <div id="mainList"></div>
        </form>
    </div>

    <h1 class="Tip">부동산 가이드</h1>
    <div id="main4">
        <ul>
            <li class="a1" style="border-radius: 10px;">
                <a href="https://post.naver.com/viewer/postView.nhn?volumeNo=27011368&memberNo=2120568">
                    <p>허위매물방지 5계명</p>
                </a>
            </li>
            <li class="a2" style="border-radius: 10px;">
                <a href="https://post.naver.com/viewer/postView.nhn?volumeNo=25802095&memberNo=2120568">
                    <p>나에게 꼭 맞는 방 찾는 방법!!</p>
                </a>
            </li>
            <li class="a3" style="border-radius: 10px;">
                <a href="https://post.naver.com/viewer/postView.nhn?volumeNo=26067452&memberNo=2120568">
                    <p>알아두면 좋은 부동산 용어!!</p>
                </a>
            </li>
            <li class="a4" style="border-radius: 10px;">
                <a href="https://post.naver.com/viewer/postView.nhn?volumeNo=26596142&memberNo=2120568">
                    <p>임대차 계약서 작성 시!!</p>
                </a>
            </li>

            <!-- ' <form action="/dealingView.do?dl_Num='+item.dl_Num+'method="get" >' -->
        </ul>
    </div>

</body>

</html>
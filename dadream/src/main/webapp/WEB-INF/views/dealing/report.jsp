<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
  request.setCharacterEncoding("UTF-8");
%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <title>신고하기</title>

    <!--부트스트랩-->
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <!--CSS-->
	<link rel="stylesheet" href="/css/report.css">
    <!-- 글꼴 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
    <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
    <!--JS-->
    <script src="/js/dealingJS/report.js"></script>
</head>

<body>
    <h1>신고하기</h1>
    <hr>
    <form id="reform" method="post" name="reprot" action="${contextPath}/report.do">
        <div id="No">
            <h3 >매물 번호 : </h3>
            <input type="text" id="dl_Num" name="dl_Num" value="${dl_Num}" readonly>
        </div>
        <div id="title">
            <h3>제목 :</h3><input type="text" size="40" id="rp_Title" name="rp_Title" />
        </div>
        <div >
            <h3>내용 :
            <textarea rows="20" id="rp_Content" cols="65" name="rp_Content"  style="resize: none;"></textarea>
        </h3>
        </div>
        <div id="rpBtn">
            <button id="rep" type="button">신고하기</button>
        </div>
    </form>
</body>

</html>
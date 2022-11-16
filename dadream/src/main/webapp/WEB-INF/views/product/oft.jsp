<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"   isELIgnored="false"  %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"  %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var = "contextPath" value="${pageContext.request.contextPath}" />
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="/css/oft.css">
</head>
<body>
<div class="oftdiv">
<img src="image/orderf.png">
<div class="span">
<h1>주문이 완료 되었습니다.</h1>
<a href="${contextPath}/orderlist.do"><button type="button">주문목록 확인하기</button></a>
</div>
</div>
</body>
</html>
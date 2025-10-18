<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>Model2 MVC Shop</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" />
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/top.js"></script>
</head>

<body class="nv-top"
      data-ctx="${ctx}"
      data-kakao-client="<spring:eval expression='@commonProperties["kakao.clientId"]'/>"
      data-kakao-logout="<spring:eval expression='@commonProperties["kakao.logoutRedirectUri"]'/>">

  <!-- rightFrame에서 읽어가는 숨김 값 -->
  <input type="hidden" id="userIdForTop" value="${sessionScope.user != null ? sessionScope.user.userId : ''}"/>

  	<header class="nv-header">
		  	<h1 id="btnHome" class="nv-brand">
			  <span class="brand-mark-bg" role="img" aria-label="Model2 MVC Shop"></span>
			  <span class="brand-title">Model2 MVC Shop</span>
			</h1>	
		  <nav class="nv-auth"></nav>
	</header>
</body>
</html>

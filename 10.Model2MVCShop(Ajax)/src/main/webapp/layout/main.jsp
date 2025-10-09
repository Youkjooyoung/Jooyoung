<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>추천 상품</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css">

<!-- Slick CSS -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css"/>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css"/>
  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <!-- Slick JS -->
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
  <!-- 전용 JS -->
  <script src="${ctx}/javascript/main.js"></script>
</head>
<body data-ctx="${ctx}">
		  <div class="right-stage">
		    <div class="container home-main">
		      <div class="page-title">
		        <h2>추천 상품</h2>
		      </div>
		
		      <div class="product-slider"></div>
		    </div>
		  </div>
</body>
</html>

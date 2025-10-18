<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>Model2 MVC Shop</title>

  <!-- CSS: 네이버 공통만 -->
<link rel="stylesheet" href="${ctx}/css/naver-common.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/product-search.css"/>
<link rel="stylesheet" href="${ctx}/css/index-loading.css" />
<link rel="stylesheet" href="${ctx}/css/top-hover.css"/>
<link rel="icon" href="${ctx}/images/favicon.ico">

  <!-- CSP(예시: jQuery/Slick 허용) -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self' data: blob:;
  script-src  'self' 'unsafe-inline' 'unsafe-eval'
    http://localhost:8080
    https://code.jquery.com https://cdn.jsdelivr.net https://uicdn.toast.com
    https://t1.kakaocdn.net https://t1.daumcdn.net;
  style-src   'self' 'unsafe-inline' https://cdn.jsdelivr.net https://uicdn.toast.com;
  img-src     'self' data: blob: https://t1.kakaocdn.net https://cdn.jsdelivr.net;
  font-src    'self' https://cdn.jsdelivr.net;
  connect-src 'self';
  frame-src   'self'
              https://kauth.kakao.com https://accounts.google.com
              https://t1.daumcdn.net https://postcode.map.daum.net;
  upgrade-insecure-requests; 
">

  <!-- JS: 전역 로더 + 라우팅 -->
  <script src="https://code.jquery.com/jquery-3.6.1.min.js" ></script>
  <script>window.App = window.App || {}; App.ctx = function(){ return '${ctx}'; };</script>
  <script src="${ctx}/javascript/layout.js" defer></script>
  <script src="${ctx}/javascript/common-toast.js" ></script>
  <script src="${ctx}/javascript/top.js" defer></script>
  <script src="${ctx}/javascript/home.js" defer></script>
  <script src="${ctx}/javascript/left.js" defer></script>
  <script src="${ctx}/javascript/footer.js" defer></script>
  <script src="${ctx}/javascript/getProduct.js" defer></script>
  <script src="${ctx}/javascript/index-loading.js" defer></script>
</head>

<body class="nv-layout" data-ctx="${ctx}">

<!-- ===== 로딩 로고 영역 ===== -->
  <div id="loadingLogo">
	  	<div class="logo-wrap">
	    	<img src="${ctx}/images/uploadFiles/naver.png" alt="naver Logo" />
	    </div>
	    	<div class="brand-name">Model2 MVC Shop<br><small>MVC Inside, Simplicity Outside</small></div>
  </div>
  <!-- 상단 고정 -->
	<header id="topArea">
		<jsp:include page="/layout/top.jsp" />
	</header>

	<!-- 본문(좌 고정 + 우 동적) -->
	<main class="nv-body">
		<aside id="leftArea">
			<jsp:include page="/layout/left.jsp" />
		</aside>

		<!-- 메인 교체 타깃 -->
		<section id="mainArea">
			<jsp:include page="/layout/home.fragment.jsp" />
		</section>
	</main>

	<footer id="footerArea">
		<jsp:include page="/layout/footer.jsp" />
	</footer>

	<script>
		(function() {
			var entry = '<c:out value="${entry}" />';
			if (entry) {
				window.addEventListener('DOMContentLoaded', function() {
					if (window.__layout && __layout.loadMain) {
						__layout.loadMain(entry);
						// 주소창은 예쁜 URL로 바꾸고 싶다면 pushState
						var pretty = (new URL(window.location.href));
						// 이미 /product/updateProduct?prodNo=... 라면 pushState 생략 가능
					}
				});
			}
		})();
	</script>
</body>
</html>

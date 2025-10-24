<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>Model2 MVC Shop</title>

<!-- ✅ favicon -->
<link rel="icon" href="${ctx}/images/favicon.ico" />

<!-- ✅ 필수 CSS (기존 개별 CSS는 그대로 유지 가능) -->
<link rel="stylesheet" href="${ctx}/css/product-search.css" />
<link rel="stylesheet" href="${ctx}/css/index-loading.css" />
<link rel="stylesheet" href="${ctx}/css/top-hover.css" />
<link rel="stylesheet" href="${ctx}/css/updateUser.css" />

<!-- ✅ CSP (보안 정책: 절대 삭제 금지) -->
<meta http-equiv="Content-Security-Policy"
  content="
  default-src 'self' data: blob:;
  script-src  'self' 'unsafe-inline' 'unsafe-eval'
    http://localhost:8080
    https://code.jquery.com https://cdn.jsdelivr.net https://uicdn.toast.com
    https://t1.kakaocdn.net https://t1.daumcdn.net
    https://cdn.tailwindcss.com;
  style-src   'self' 'unsafe-inline' https://cdn.jsdelivr.net https://uicdn.toast.com;
  img-src     'self' data: blob: https://t1.kakaocdn.net https://cdn.jsdelivr.net;
  font-src    'self' https://cdn.jsdelivr.net;
  connect-src 'self';
  frame-src   'self'
              https://kauth.kakao.com https://accounts.google.com
              https://t1.daumcdn.net https://postcode.map.daum.net;
  upgrade-insecure-requests;
">

<!-- ✅ JS: 전역 로더 + 라우팅 (모두 유지) -->
<script src="${ctx}/javascript/app-core.js" defer></script>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script>window.App = window.App || {}; App.ctx = function(){ return '${ctx}'; };</script>
<script src="${ctx}/javascript/layout.js" defer></script>
<script src="${ctx}/javascript/common-toast.js"></script>
<script src="${ctx}/javascript/top.js" defer></script>
<script src="${ctx}/javascript/home.js" defer></script>
<script src="${ctx}/javascript/left.js" defer></script>
<script src="${ctx}/javascript/footer.js" defer></script>
<script src="${ctx}/javascript/getProduct.js" defer></script>
<script src="${ctx}/javascript/index-loading.js" defer></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          naver: {
            green: '#03c75a',
            dark: '#02b857',
            ink: '#079b48',
            gray: {
              50: '#f7f8f9',
              100: '#f0f2f4',
              200: '#e5e8eb',
              400: '#98a2b3'
            }
          }
        },
        borderRadius: { nv: '12px' },
        boxShadow: { nv: '0 4px 14px rgba(0,0,0,.06)' },
        fontFamily: { sans: ['Pretendard','Noto Sans KR','system-ui','sans-serif'] }
      }
    }
  }
</script>

<!-- ✅ Tailwind Components Layer (네이버 스타일 통합) -->
<style type="text/tailwindcss">
  @layer components {
    /* ===== Layout ===== */
    .nv-layout { @apply flex flex-col min-h-screen bg-white text-gray-900 font-sans; }
    .nv-body   { @apply flex flex-1 bg-white; }
    #leftArea  { @apply w-[220px] bg-naver-gray-50 border-r border-naver-gray-200 overflow-y-auto hidden md:block; }
    #mainArea  { @apply flex-1 p-6 overflow-auto bg-white; }
    #footerArea { @apply border-t border-naver-gray-100 py-4 text-center text-sm text-gray-500; }

    /* ===== Loading Logo ===== */
    #loadingLogo { @apply flex flex-col items-center justify-center h-screen text-center; }
    #loadingLogo .logo-wrap img { @apply w-20 h-20 mb-4; }
    #loadingLogo .brand-name { @apply text-naver-green font-extrabold text-xl; }
    #loadingLogo .brand-name small { @apply block text-gray-500 font-medium text-sm; }

    /* ===== Header ===== */
    #topArea { @apply bg-white border-b-2 border-naver-green shadow; }

    /* ===== Panel / Card ===== */
    .nv-panel  { @apply bg-white border border-naver-gray-100 rounded-nv shadow-nv; }
    .card      { @apply bg-white border border-naver-gray-100 rounded-nv shadow-nv; }
    .card-hd   { @apply bg-gradient-to-b from-[#f4fff8] to-white border-b border-naver-gray-100 p-5 text-lg font-extrabold; }
    .card-bd   { @apply p-6; }
    .card-ft   { @apply p-5 border-t border-naver-gray-100 bg-white; }

    /* ===== Form / Input ===== */
    .nv-input        { @apply w-full h-10 border border-naver-gray-200 rounded-nv px-3 focus:outline-none focus:ring-2 focus:ring-naver-green; }
    .nv-input.sel    { @apply w-24; }
    .nv-input.seg    { @apply w-32; }
    .readonly-text   { @apply inline-block min-h-10 leading-10 bg-naver-gray-50 border border-naver-gray-200 rounded-nv px-3 text-gray-700; }

    /* ===== Actions / Buttons ===== */
    .nv-actions      { @apply flex justify-end gap-3; }
    .nv-btn          { @apply h-10 px-4 rounded-[10px] font-bold border border-naver-gray-200 transition; }
    .nv-btn-ghost    { @apply bg-white text-gray-800 hover:bg-naver-gray-50; }
    .nv-btn-primary  { @apply bg-naver-green text-white border-naver-green hover:bg-naver-dark; }

    /* ===== Form Rows ===== */
    .form-row        { @apply grid grid-cols-[160px_1fr] items-center gap-4 py-2.5; }
    .form-l          { @apply font-semibold text-gray-800; }
    .form-v          { @apply text-gray-900; }
    .form-v-flex     { @apply flex items-center gap-2; }
    .form-v.sub      { @apply col-span-1 flex gap-2 mt-1.5; }
    .phone           { @apply flex items-center gap-2; }
    .dash            { @apply text-naver-gray-400; }

    /* ===== Responsive ===== */
  @media (max-width: 700px) {
  .form-row { @apply grid-cols-1; }
  .nv-actions { @apply flex-col items-stretch; }
  .nv-input.sel, .nv-input.seg { @apply w-full; }
  #leftArea { @apply hidden; }
  #mainArea { @apply p-4; }
	}
  }
</style>
</head>

<body class="nv-layout" data-ctx="${ctx}">

	<!-- ===== 로딩 로고 영역 ===== -->
	<div id="loadingLogo">
		<div class="logo-wrap">
			<img src="${ctx}/images/uploadFiles/naver.png" alt="naver Logo" />
		</div>
		<div class="brand-name">
			Model2 MVC Shop<br>
			<small>MVC Inside, Simplicity Outside</small>
		</div>
	</div>

	<!-- ===== 상단 고정 ===== -->
	<header id="topArea">
		<jsp:include page="/layout/top.jsp" />
	</header>

	<!-- ===== 본문(좌 고정 + 우 동적) ===== -->
	<main class="nv-body">
		<aside id="leftArea">
			<jsp:include page="/layout/left.jsp" />
		</aside>

		<!-- 메인 교체 타깃 -->
		<section id="mainArea">
			<jsp:include page="/layout/home.fragment.jsp" />
		</section>
	</main>

	<!-- ===== 하단 ===== -->
	<footer id="footerArea">
		<jsp:include page="/layout/footer.jsp" />
	</footer>

	<!-- ===== 초기 로드 스크립트 ===== -->
	<script>
	  (function(){
	    const entry = `<c:out value="${entry}" escapeXml="false" />`.trim();
	    if (entry) {
	      window.addEventListener('DOMContentLoaded', function () {
	        if (window.__layout && __layout.loadMain) __layout.loadMain(entry);
	      });
	    }
	  })();
	</script>

</body>
</html>

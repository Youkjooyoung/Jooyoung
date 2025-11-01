<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>Model2 MVC Shop</title>
<link rel="icon" href="${ctx}/images/favicon.ico" />
<meta http-equiv="Content-Security-Policy"
	content="
      default-src 'self' data: blob:;
      script-src  'self' 'unsafe-inline' 'unsafe-eval'
        http://localhost:8080
        https://code.jquery.com
        https://cdn.tailwindcss.com
        https://cdn.jsdelivr.net;
      style-src   'self' 'unsafe-inline'
        https://cdn.tailwindcss.com
        https://fonts.googleapis.com
        https://cdn.jsdelivr.net;
      img-src     'self' data: blob:;
      font-src    'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net;">
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          naver: {
            green: '#03c75a',
            dark: '#02b857',
            ink: '#079b48',
            gray: { 50:'#f7f8f9', 100:'#f0f2f4', 200:'#e5e8eb', 400:'#98a2b3' }
          }
        },
        borderRadius: { nv: '12px' },
        boxShadow: { nv: '0 4px 14px rgba(0,0,0,.06)' },
        fontFamily: { sans: ['Pretendard','Noto Sans KR','system-ui','sans-serif'] }
      }
    }
  }
</script>
<style type="text/tailwindcss">
  @layer components {
    .nv-layout { @apply flex flex-col min-h-screen bg-white text-gray-900 font-sans; }
    .nv-body   { @apply flex flex-1 bg-white; }
    #leftArea  { @apply w-[220px] bg-naver-gray-50 border-r border-naver-gray-200 overflow-y-auto hidden md:block; }
    #mainArea  { @apply flex-1 p-6 overflow-auto bg-white; }
    #footerArea{ @apply border-t border-naver-gray-100 py-4 text-center text-sm text-gray-500; }
    #topArea   { @apply bg-white border-b-2 border-naver-green shadow; }
    .nv-panel  { @apply bg-white border border-naver-gray-100 rounded-nv shadow-nv; }
    .card      { @apply bg-white border border-naver-gray-100 rounded-nv shadow-nv; }
    .card-hd   { @apply bg-gradient-to-b from-[#f4fff8] to-white border-b border-naver-gray-100 p-5 text-lg font-extrabold; }
    .card-bd   { @apply p-6; }
    .card-ft   { @apply p-5 border-t border-naver-gray-100 bg-white; }
    .nv-input       { @apply w-full h-10 border border-naver-gray-200 rounded-nv px-3 focus:outline-none focus:ring-2 focus:ring-naver-green; }
    .nv-input.sel   { @apply w-24; }
    .nv-input.seg   { @apply w-32; }
    .readonly-text  { @apply inline-block min-h-10 leading-10 bg-naver-gray-50 border border-naver-gray-200 rounded-nv px-3 text-gray-700; }
    .nv-actions     { @apply flex justify-end gap-3; }
    .nv-btn         { @apply h-10 px-4 rounded-[10px] font-bold border border-naver-gray-200 transition; }
    .nv-btn-ghost   { @apply bg-white text-gray-800 hover:bg-naver-gray-50; }
    .nv-btn-primary { @apply bg-naver-green text-white border-naver-green hover:bg-naver-dark; }
    .form-row    { @apply grid grid-cols-[160px_1fr] items-center gap-4 py-2.5; }
    .form-l      { @apply font-semibold text-gray-800; }
    .form-v      { @apply text-gray-900; }
    .form-v-flex { @apply flex items-center gap-2; }
    .form-v.sub  { @apply col-span-1 flex gap-2 mt-1.5; }
    .phone       { @apply flex items-center gap-2; }
    .dash        { @apply text-naver-gray-400; }
    .nv-narrow { @apply max-w-[880px] mx-auto; }
    @media (max-width: 700px) {
      .form-row { @apply grid-cols-1; }
      .nv-actions { @apply flex-col items-stretch; }
      .nv-input.sel, .nv-input.seg { @apply w-full; }
      #leftArea { @apply hidden; }
      #mainArea { @apply p-4; }
    }
    .swiper, .swiper-wrapper, .swiper-slide { @apply h-auto !important; }
  }
</style>
</head>

<body class="nv-layout" data-ctx="${ctx}"
	data-entry="${ctx}/layout/home.jsp [data-page=home]:first">
	<header id="topArea"><jsp:include page="/layout/top.jsp" /></header>
	<main class="nv-body">
		<aside id="leftArea"><jsp:include page="/layout/left.jsp" /></aside>
		<section id="mainArea"><jsp:include page="/layout/home.jsp" /></section>
	</main>
	<footer id="footerArea"><jsp:include page="/layout/footer.jsp" /></footer>
	<noscript>본 서비스는 자바스크립트가 필요합니다.</noscript>
	<script defer src="${ctx}/javascript/layout.js"></script>
</body>
</html>

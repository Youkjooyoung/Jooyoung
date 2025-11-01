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
    font-src    'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net;
    connect-src 'self' https://cdn.jsdelivr.net https://cdn.tailwindcss.com;">
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
<link rel="stylesheet" href="${ctx}/css/tw-override.css" />
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: { naver:{green:'#03c75a',dark:'#02b857',ink:'#079b48'}, 'naver-gray':{50:'#f7f8f9',100:'#f0f2f4',200:'#e5e8eb',400:'#98a2b3'} },
        borderRadius:{ nv:'12px' },
        boxShadow:{ nv:'0 4px 14px rgba(0,0,0,.06)' },
        fontFamily:{ sans:['Pretendard','Noto Sans KR','system-ui','sans-serif'] }
      }
    }
  }
</script>
</head>
<body class="min-h-screen flex flex-col bg-white text-gray-900 font-sans"
      data-ctx="${ctx}"
      data-role="${sessionScope.user != null ? sessionScope.user.role : ''}"
      data-login="${sessionScope.user != null ? '1' : '0'}"
      data-entry="${entry}">
  <header class="bg-white border-b-2 border-[#03c75a] shadow-sm relative z-[100]">
    <div class="max-w-[1100px] mx-auto h-[64px] px-4 flex items-center justify-between">
      <div id="btnHome" class="flex items-center gap-3 cursor-pointer select-none" role="button" tabindex="0">
        <span class="w-7 h-7 rounded-lg bg-[url('${ctx}/images/uploadFiles/naver.png')] bg-no-repeat bg-center bg-contain"></span>
        <span class="font-extrabold text-[18px] text-[#03c75a]">Model2 MVC Shop</span>
      </div>
      <div class="flex items-center gap-4 relative">
        <div class="nv-auth flex items-center gap-3"></div>
        <button id="btnMainMenu" class="h-9 px-3 rounded-[10px] font-bold border border-gray-300 hover:bg-gray-50">메뉴</button>
        <div id="menuDropdown"
             class="hidden absolute right-0 top-[48px] w-[200px] bg-white border border-gray-200 rounded-[12px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] z-[120]">
          <div class="px-4 py-3 cursor-pointer hover:bg-gray-50 font-semibold text-gray-800" data-nav="purchaseList" tabindex="0" role="button">구매 내역</div>
          <div class="px-4 py-3 cursor-pointer hover:bg-gray-50 font-semibold text-gray-800" data-nav="myInfo" tabindex="0" role="button">내 정보</div>
        </div>
      </div>
    </div>
  </header>
  <main class="flex-1 max-w-[1100px] mx-auto px-4 py-8 w-full">
    <section id="mainArea">
      <jsp:include page="/layout/home.jsp" />
    </section>
  </main>
  <jsp:include page="/layout/footer.jsp" />
  <script defer src="${ctx}/javascript/top.js"></script>
  <script defer src="${ctx}/javascript/layout.js"></script>
  <script defer src="${ctx}/javascript/home.js"></script>
  <script defer src="${ctx}/javascript/footer.js"></script>
</body>
</html>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>Model2 MVC Shop</title>
<script src="https://code.jquery.com/jquery-3.6.1.min.js" defer></script>
<script src="${ctx}/javascript/layout.js" defer></script>
<script>window.App=window.App||{};App.ctx=function(){return '${ctx}';};</script>
<style>
.nv-aside,#leftArea,.left-menu{position:relative;z-index:1000;pointer-events:auto}
#appMain,#mainArea{position:relative;z-index:1}
#appMain.loading::after,#mainArea.loading::after{content:"";position:absolute;inset:0;background:rgba(255,255,255,.4);pointer-events:none}
.nv-dp-mask,.dlg-mask{pointer-events:none}
.dlg-mask:not(.hidden){pointer-events:auto}
.nv-narrow{max-width:880px;margin-left:auto;margin-right:auto}
</style>
</head>
<body class="nv-shell min-h-screen flex flex-col bg-white" data-ctx="${ctx}">
  <header class="nv-header shadow-nv border-b border-naver-green z-50">
    <jsp:include page="/layout/top.jsp" />
  </header>
  <div class="nv-body flex flex-1 min-h-[calc(100vh-120px)]">
    <main id="appMain" role="main" aria-live="polite" class="flex-1 bg-white p-6">
      <jsp:include page="/layout/home.jsp" />
    </main>
  </div>
  <footer class="nv-footer border-t border-naver-gray-200 bg-naver-gray-50">
    <jsp:include page="/layout/footer.jsp" />
  </footer>
  <noscript>본 서비스는 자바스크립트가 필요합니다.</noscript>
</body>
</html>

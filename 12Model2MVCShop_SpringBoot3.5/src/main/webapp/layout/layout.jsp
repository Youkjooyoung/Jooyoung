<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>Model2 MVC Shop</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
<script src="https://code.jquery.com/jquery-3.6.1.min.js" defer></script>
<script src="${ctx}/javascript/layout.js" defer></script>
<script src="${ctx}/javascript/left.js" defer></script>
  <script>
    window.App = window.App || {};
    App.ctx = function(){ return '${ctx}'; };
  </script>
  
  <style>
  /* 좌측 메뉴가 항상 클릭 가능하도록 레이어 우선순위 고정 */
  .nv-aside, #leftArea, .left-menu { position: relative; z-index: 1000; pointer-events: auto; }
  #appMain, #mainArea { position: relative; z-index: 1; }

  /* 만약 로딩 오버레이가 전체를 덮는 경우를 방지: 메인 컨텐츠에만 국한 */
  #appMain.loading, #mainArea.loading { position: relative; }
  #appMain.loading::after, #mainArea.loading::after {
    content: "";
    position: absolute; inset: 0;
    background: rgba(255,255,255,.4);
    /* 클릭 막지 않도록 */
    pointer-events: none;
  }

  /* 혹시 남아있는 마스크/모달이 투명하게 덮고 있었다면 클릭 통과 */
  .nv-dp-mask, .dlg-mask { pointer-events: none; }
  .dlg-mask:not(.hidden) { pointer-events: auto; } /* 실제로 보일 때만 이벤트 받도록 */
</style>
</head>

<body class="nv-shell" data-ctx="${ctx}">
  <header class="nv-header">
    <!-- top / fragment 전용 -->
    <jsp:include page="/layout/top.jsp" />
  </header>

  <div class="nv-body">
    <aside class="nv-aside">
      <!-- left / fragment 전용 -->
      <jsp:include page="/layout/left.jsp" />
    </aside>

    <!-- ✅ 메인만 Ajax로 교체 -->
    <main id="appMain" role="main" aria-live="polite">
      <jsp:include page="/layout/home.fragment.jsp"/>
    </main>
  </div>

  <footer class="nv-footer">
    <jsp:include page="/layout/footer.jsp"/>
  </footer>

  <noscript>본 서비스는 자바스크립트가 필요합니다.</noscript>
</body>
</html>

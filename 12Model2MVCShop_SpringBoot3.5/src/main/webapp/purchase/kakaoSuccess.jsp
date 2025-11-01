<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>결제 성공 - Model2 MVC Shop</title>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
</head>
<body>

<!-- ✅ 공통 헤더 -->
<jsp:include page="/layout/top.jsp"/>

<!-- ✅ 메인 레이아웃 -->
<main class="nv-container flex">

  <!-- ✅ 본문 컨텐츠 -->
  <section class="nv-content">
    <div class="container panel" style="max-width:720px; margin:40px auto; text-align:center;">
      <div class="nv-check-icon" style="font-size:48px;">✅</div>
      <h2 class="nv-title" style="margin-top:16px;">결제가 성공적으로 완료되었습니다!</h2>

      <div class="nv-summary-box" style="margin-top:24px; text-align:left; line-height:1.6;">
        <p><strong>주문번호 :</strong> ${info.partner_order_id}</p>
        <p><strong>상품명 :</strong> ${info.item_name}</p>
        <p><strong>결제금액 :</strong>
          <fmt:formatNumber value="${info.amount.total}" type="number"/>원
        </p>
      </div>

      <div class="nv-btn-box" style="margin-top:40px; display:flex; justify-content:center; gap:12px;">
        <button type="button" class="nv-btn-primary"
                onclick="location.href='${ctx}/purchase/listPurchase'">
          🧾 구매내역 보기
        </button>
        <button type="button" class="nv-btn-default"
                onclick="location.href='${ctx}/index.jsp'">
          🏠 메인으로 돌아가기
        </button>
      </div>
    </div>
  </section>
</main>

<!-- ✅ 공통 푸터 -->
<jsp:include page="/layout/footer.jsp"/>

<!-- ✅ 독립 JSP용 스크립트 -->
<script>
  $(function(){
    if (typeof window.__layout === 'undefined') {
      console.log('[KakaoSuccess] SPA context 복구 중...');
      $.getScript('${ctx}/javascript/layout.js')
        .done(() => console.log('[KakaoSuccess] layout.js reloaded'));
    }
  });
</script>

</body>
</html>

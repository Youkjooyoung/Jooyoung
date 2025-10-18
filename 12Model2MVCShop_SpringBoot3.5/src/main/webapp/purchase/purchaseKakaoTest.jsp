<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>카카오페이 테스트 결제</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" />
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/purchaseKakaoTest.js"></script>
</head>

<body class="nv-container" data-ctx="${ctx}">
  <div class="container">
    <div class="page-title">
      <h2>💳 카카오페이 테스트 결제</h2>
    </div>

    <div class="form-section">
      <table class="nv-table">
        <tr>
          <th>상품명</th>
          <td><input type="text" id="itemName" class="input-text" value="테스트상품" /></td>
        </tr>
        <tr>
          <th>수량</th>
          <td><input type="number" id="quantity" class="input-text" value="1" min="1" /></td>
        </tr>
        <tr>
          <th>결제금액</th>
          <td><input type="number" id="totalAmount" class="input-text" value="1000" min="100" step="100" /></td>
        </tr>
      </table>
    </div>

    <div class="btn-area" style="margin-top:20px; text-align:center;">
      <!-- ✅ 결제 버튼 -->
      <span id="btnKakaoPay" class="btn-green btn-lg btn-pill">카카오페이로 결제하기</span>
    </div>
  </div>
</body>
</html>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 등록</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <link rel="stylesheet" href="${ctx}/css/addPurchase-modal.css"/>
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/addPurchase.js"></script>
</head>
<body data-ctx="${ctx}">
<div class="container">
  <div class="page-title">
    <h2>구매 등록</h2>
  </div>

  <form name="purchaseForm">
    <input type="hidden" name="purchaseProd.prodNo" value="${empty p ? param.prodNo : p.prodNo}" />

    <!-- 상품 정보 -->
    <table class="form-table">
      <tr><th>상품번호</th><td>${empty p ? param.prodNo : p.prodNo}</td></tr>
      <tr><th>상품명</th><td><c:out value="${empty p ? param.prodName : p.prodName}"/></td></tr>
      <tr>
        <th>상세내용</th>
        <td>
          <c:set var="detailText" value="${empty p ? param.prodDetail : p.prodDetail}"/>
          ${fn:replace(fn:replace(detailText, '<p>', ''), '</p>', '')}
        </td>
      </tr>
      <tr><th>등록일자</th><td><c:out value="${empty p ? param.regDate : p.regDate}"/></td></tr>
      <tr><th>가격</th><td><fmt:formatNumber value="${p.price}" type="number"/> 원</td></tr>
      <tr><th>제조일자</th><td><c:out value="${empty p ? param.manuDate : p.manuDate}"/></td></tr>
    </table>

    <!-- 주문 정보 -->
    <table class="form-table">
      <tr><th>구매자 ID</th><td>${sessionScope.user.userId}</td></tr>
      <tr>
        <th>결제수단</th>
        <td>
          <select name="paymentOption" class="input-text" required>
            <option value="">-- 선택 --</option>
            <option value="CAR">카드</option>
            <option value="CAS">현금</option>
          </select>
        </td>
      </tr>
      <tr><th>수령인</th><td><input type="text" name="receiverName" class="input-text" required/></td></tr>
      <tr><th>연락처</th><td><input type="tel" name="receiverPhone" placeholder="01012345678" class="input-text" required/></td></tr>
      <tr><th>배송주소</th><td><input type="text" name="divyAddr" class="input-text"/></td></tr>
      <tr><th>희망배송일</th><td><input type="date" name="divyDate" class="input-text" required/></td></tr>
      <tr><th>요청사항(선택)</th><td><textarea name="divyRequest" rows="5" class="input-text"></textarea></td></tr>
    </table>

    <div class="btn-area">
      <button type="button" class="btn-green" id="btnSubmit">주문 등록</button>
      <button type="button" class="btn-gray" id="btnCancel">취소</button>
    </div>
  </form>
</div>

<!-- 구매 확인 모달 -->
<div id="confirmModal" class="modal" style="display:none;">
  <div class="modal-content">
    <p>입력하신 구매정보로 주문을 진행하시겠습니까?</p>
    <div class="btn-area">
      <button type="button" id="btnConfirm" class="btn-green">확인</button>
      <button type="button" id="btnClose" class="btn-gray">취소</button>
    </div>
  </div>
</div>

</body>
</html>

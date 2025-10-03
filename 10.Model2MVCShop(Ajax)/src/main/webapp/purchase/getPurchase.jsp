<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 상세</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <!-- jQuery & 외부 JS -->
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/getPurchase.js"></script>
  <script src="${ctx}/javascript/cancel-order.js"></script>
</head>
<body data-ctx="${ctx}">
<div class="container two-col">

  <!-- 왼쪽: 주문/구매 상세 -->
  <div class="col-left">
    <div class="page-title"><h2>구매 상세</h2></div>

    <table class="form-table">
      <tr><th>주문번호</th><td>${purchase.tranNo}</td></tr>
      <tr><th>상품번호</th><td>${purchase.purchaseProd.prodNo}</td></tr>
      <tr><th>상품명</th><td>${purchase.purchaseProd.prodName}</td></tr>
      <tr><th>가격</th><td><fmt:formatNumber value="${purchase.purchaseProd.price}" type="number"/> 원</td></tr>
      <tr><th>구매자</th><td>${purchase.buyer.userId}</td></tr>
      <tr><th>결제수단</th><td>${purchase.paymentOption}</td></tr>
      <tr>
        <th>주문상태</th>
        <td>
          <c:choose>
            <c:when test="${purchase.tranCode == '001'}">주문완료</c:when>
            <c:when test="${purchase.tranCode == '002'}">배송중</c:when>
            <c:when test="${purchase.tranCode == '003'}">배송완료</c:when>
            <c:when test="${purchase.tranCode == '004'}"><span class="text-red">취소됨</span></c:when>
          </c:choose>
        </td>
      </tr>
      <tr><th>주문일</th><td><fmt:formatDate value="${purchase.orderDate}" pattern="yyyy-MM-dd"/></td></tr>
      <tr><th>배송일</th><td>${purchase.divyDate}</td></tr>
      <tr><th>수령인</th><td>${purchase.receiverName}</td></tr>
      <tr><th>연락처</th><td>${purchase.formattedReceiverPhone}</td></tr>
      <tr>
        <th>배송주소</th>
        <td>
          ${purchase.zipcode} ${purchase.divyAddr}<br/>
          <c:out value="${purchase.addrDetail}"/>
        </td>
      </tr>
      <tr><th>요청사항</th>
        <td><c:out value="${purchase.divyRequest != null ? purchase.divyRequest : '요청사항이 없습니다.'}"/></td>
      </tr>
    </table>

    <!-- 버튼 영역 -->
    <div class="btn-area">
      <c:if test="${purchase.tranCode == '001'}">
        <button type="button" class="btn-green" id="btnEdit" data-tranno="${purchase.tranNo}">수정</button>
        <button type="button" class="btn-gray" id="btnCancel" data-tranno="${purchase.tranNo}" data-url="${ctx}/purchase/${purchase.tranNo}/cancel">구매취소</button>
      </c:if>
      <c:if test="${purchase.tranCode == '002'}">
        <button type="button" class="btn-green" id="btnConfirm" data-tranno="${purchase.tranNo}" data-prodno="${purchase.purchaseProd.prodNo}">물품수령</button>
      </c:if>
      <c:if test="${purchase.tranCode == '003'}"><span class="text-green">구매가 완료되었습니다.</span></c:if>
      <c:if test="${purchase.tranCode == '004'}"><span class="text-red">해당 주문은 취소되었습니다.</span></c:if>
    </div>
  </div>

  <!-- 오른쪽: 상품 이미지 -->
  <div class="col-right">
    <div class="page-title"><h2>상품 이미지</h2></div>
    <div class="img-grid">
      <c:choose>
        <c:when test="${not empty productImages}">
          <c:forEach var="img" items="${productImages}">
            <div class="img-box">
              <img src="${ctx}/upload/${img.fileName}" 
                   alt="${purchase.purchaseProd.prodName}" 
                   class="img-existing"/>
            </div>
          </c:forEach>
        </c:when>
        <c:otherwise>
          <p class="text-muted">등록된 이미지가 없습니다.</p>
        </c:otherwise>
      </c:choose>
    </div>
  </div>
</div>
</body>
</html>

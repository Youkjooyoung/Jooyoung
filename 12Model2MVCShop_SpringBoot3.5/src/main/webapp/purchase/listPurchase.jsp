<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 내역</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/naver-common.css"/>
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/listPurchase.js"></script>
  <script src="${ctx}/javascript/cancel-order.js"></script>
</head>
<body data-ctx="${ctx}">
<div class="container" data-page="purchase-list">
  <div class="page-title"><h2>구매 내역</h2></div>

  <table class="list-table">
    <thead>
  <tr>
    <th>No</th>
    <th>상품명</th>
    <th>수량</th>
    <th>총 금액</th>
    <th>주문일자</th>
    <th>상태</th>
  </tr>
</thead>
<tbody>
  <c:forEach var="p" items="${list}" varStatus="st">
    <tr>
      <td>${st.index + 1}</td>
      <td>
        <span class="purchase-link" data-tranno="${p.tranNo}">
          ${p.purchaseProd.prodName}
        </span>
      </td>

      <!-- 수량 -->
      <td><fmt:formatNumber value="${p.qty}" type="number"/> 개</td>

      <!-- 총 결제금액: paymentAmount가 0이면(구버전 주문 대비) 단가*수량으로 폴백 -->
      <td>
        <c:choose>
          <c:when test="${p.paymentAmount ne 0}">
            <fmt:formatNumber value="${p.paymentAmount}" type="number"/> 원
          </c:when>
          <c:otherwise>
            <fmt:formatNumber value="${p.purchaseProd.price * (p.qty == 0 ? 1 : p.qty)}" type="number"/> 원
          </c:otherwise>
        </c:choose>
      </td>

      <td><fmt:formatDate value="${p.orderDate}" pattern="yyyy-MM-dd"/></td>
      <td>
        <c:choose>
          <c:when test="${p.tranCode == '001'}">주문완료</c:when>
          <c:when test="${p.tranCode == '002'}">물품수령대기
            <button type="button" class="btn-green btn-confirm"
                    data-tranno="${p.tranNo}" data-prodno="${p.purchaseProd.prodNo}">
              수령확인
            </button>
          </c:when>
          <c:when test="${p.tranCode == '003'}">배송완료</c:when>
          <c:when test="${p.tranCode == '004'}"><span class="text-red">주문취소요청</span></c:when>
          <c:when test="${p.tranCode == '005'}"><span class="text-red">주문취소완료</span></c:when>
          <c:otherwise>-</c:otherwise>
        </c:choose>
      </td>
    </tr>
  </c:forEach>
</tbody>
  </table>
</div>
</body>
</html>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 내역</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/listPurchase.js"></script>
  <script src="${ctx}/javascript/cancel-order.js"></script>
</head>
<body data-ctx="${ctx}">
<div class="container">

  <div class="page-title">
    <h2>구매 내역</h2>
  </div>

  <table class="list-table">
    <thead>
      <tr>
        <th>No</th>
        <th>상품명</th>
        <th>가격</th>
        <th>주문일자</th>
        <th>상태</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="p" items="${list}" varStatus="st">
        <tr>
          <td>${st.index + 1}</td>
          <td>
            <span class="purchase-link" data-tranno="${p.tranNo}">${p.purchaseProd.prodName}</span>
          </td>
          <td><fmt:formatNumber value="${p.purchaseProd.price}" type="number"/> 원</td>
          <td><fmt:formatDate value="${p.orderDate}" pattern="yyyy-MM-dd"/></td>
          		<td>
					  <c:choose>
					    <c:when test="${p.tranCode == '001'}">주문완료</c:when>
					    <c:when test="${p.tranCode == '002'}">물품수령대기
					      <button type="button" class="btn-green btn-confirm"data-tranno="${p.tranNo}" data-prodno="${p.purchaseProd.prodNo}">수령확인</button>
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

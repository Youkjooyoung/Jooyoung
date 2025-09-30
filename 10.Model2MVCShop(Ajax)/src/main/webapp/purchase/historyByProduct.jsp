<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>주문내역 - ${prodNo}</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
</head>
<body data-ctx="${ctx}">
<div class="container">

  <div class="page-title">
    <h2>상품번호 ${prodNo} - 주문내역</h2>
  </div>

  <table class="list-table">
    <thead>
      <tr>
        <th>거래번호</th>
        <th>상태</th>
        <th>취소사유</th>
        <th>주문일자</th>
        <th>취소일자</th>
        <th>구매자ID</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="p" items="${list}">
        <tr>
          <td>${p.tranNo}</td>
          <td>
            <c:choose>
              <c:when test="${p.tranCode == '001'}">주문완료</c:when>
              <c:when test="${p.tranCode == '002'}">배송중</c:when>
              <c:when test="${p.tranCode == '003'}">배송완료</c:when>
              <c:when test="${p.tranCode == '004'}"><span class="text-red">취소요청</span></c:when>
              <c:when test="${p.tranCode == '005'}"><span class="text-red">취소확인</span></c:when>
              <c:otherwise>-</c:otherwise>
            </c:choose>
          </td>
          <td><c:out value="${empty p.cancelReason ? '-' : p.cancelReason}"/></td>
          <td><c:if test="${p.orderDate != null}"><fmt:formatDate value="${p.orderDate}" pattern="yyyy-MM-dd"/></c:if></td>
          <td><c:if test="${p.cancelDate != null}"><fmt:formatDate value="${p.cancelDate}" pattern="yyyy-MM-dd"/></c:if></td>
          <td><c:out value="${empty p.buyer or empty p.buyer.userId ? '-' : p.buyer.userId}"/></td>
        </tr>
      </c:forEach>
      <c:if test="${empty list}">
        <tr><td colspan="6">주문내역이 없습니다.</td></tr>
      </c:if>
    </tbody>
  </table>

  <div class="btn-area">
    <button type="button" class="btn-gray btn-close" onclick="window.close();">닫기</button>
  </div>

</div>
</body>
</html>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<h2>구매 상세</h2>

<h3>주문 정보</h3>
<ul>
  <li>주문번호 : ${purchase.tranNo}</li>
  <li>상품번호 : ${purchase.purchaseProd.prodNo}</li>
  <li>상품명 : ${purchase.purchaseProd.prodName}</li>
  <li>가격 : <fmt:formatNumber value="${purchase.purchaseProd.price}" type="number"/> 원</li>
  <li>구매자 : ${purchase.buyer.userId}</li>
  <li>결제수단 : ${purchase.paymentOption}</li>
  <li>주문상태 :
    <c:choose>
      <c:when test="${purchase.tranCode == '001'}">주문완료</c:when>
      <c:when test="${purchase.tranCode == '002'}">배송중</c:when>
      <c:when test="${purchase.tranCode == '003'}">배송완료</c:when>
      <c:when test="${purchase.tranCode == '004'}"><span style="color:red;">취소됨</span></c:when>
    </c:choose>
  </li>
  <li>주문일 : <fmt:formatDate value="${purchase.orderDate}" pattern="yyyy-MM-dd"/></li>
  <li>배송일 : ${purchase.divyDate}</li>
</ul>

<h3>수령인/배송</h3>
<ul>
  <li>수령인 : ${purchase.receiverName}</li>
  <li>연락처 : ${purchase.receiverPhone}</li>
  <li>배송 주소 : ${purchase.divyAddr}</li>
  <li>요청사항 : <c:out value="${purchase.divyRequest != null ? purchase.divyRequest : '요청사항이 없습니다.'}"/></li>
</ul>

<div style="margin-top:10px;">
  <!-- 주문완료 상태일 때 : 수정 / 취소 버튼 -->
  <c:if test="${purchase.tranCode == '001'}">
    <a href="<c:url value='/purchase/updatePurchase?tranNo=${purchase.tranNo}'/>">수정</a>
    &nbsp;
    <form action="<c:url value='/purchase/cancelPurchase'/>" method="post" style="display:inline;">
      <input type="hidden" name="tranNo" value="${purchase.tranNo}"/>
      <button type="submit">구매취소</button>
    </form>
  </c:if>

  <!-- 배송중 상태일 때 : 수령 버튼 -->
  <c:if test="${purchase.tranCode == '002'}">
    <form action="<c:url value='/purchase/confirmReceive'/>" method="post" style="display:inline;">
      <input type="hidden" name="tranNo" value="${purchase.tranNo}"/>
      <input type="hidden" name="prodNo" value="${purchase.purchaseProd.prodNo}"/>
      <button type="submit">물품수령</button>
    </form>
  </c:if>

  <!-- 배송완료 상태일 때 -->
  <c:if test="${purchase.tranCode == '003'}">
    <span style="color:green;">구매가 완료되었습니다.</span>
  </c:if>

  <!-- 취소 상태일 때 -->
  <c:if test="${purchase.tranCode == '004'}">
    <span style="color:red;">해당 주문은 취소되었습니다.</span>
  </c:if>
</div>

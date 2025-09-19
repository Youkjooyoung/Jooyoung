<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<h2>구매내역</h2>

<table border="0" cellpadding="6" cellspacing="0">
  <thead>
    <tr>
      <th>No</th>
      <th>상품명</th>
      <th>가격</th>
      <th>주문일자</th>
      <th>상태</th>
      <th>구매정보 수정</th>
    </tr>
  </thead>
  <tbody>
  <c:forEach var="p" items="${list}" varStatus="st">
    <tr>
      <td>${st.index + 1}</td>
      <td>
	        <a href="<c:url value='/purchase/getPurchase?tranNo=${p.tranNo}'/>">
	          ${p.purchaseProd.prodName}
	        </a>
      </td>
      <td>${p.purchaseProd.prodName}</td>
      <td><fmt:formatNumber value="${p.purchaseProd.price}" type="number"/> 원</td>
      <td><fmt:formatDate value="${p.orderDate}" pattern="yyyy-MM-dd"/></td>
      <td>
  <c:choose>
    <c:when test="${p.tranCode == '001'}">
      주문완료
      <!-- 주문완료 상태일 때만 취소 버튼 노출 -->
      <form action="<c:url value='/purchase/cancelPurchase'/>" method="post" style="display:inline;">
        <input type="hidden" name="tranNo" value="${p.tranNo}"/>
        <button type="submit">구매취소</button>
      </form>
    </c:when>
    <c:when test="${p.tranCode == '002'}">배송중</c:when>
    <c:when test="${p.tranCode == '003'}">배송완료</c:when>
    <c:when test="${p.tranCode == '004'}">
      <span style="color:red;">취소됨</span>
    </c:when>
  </c:choose>
</td>
      <td>
        <!-- 배송 전(001) : 수정 가능 -->
        <c:if test="${p.tranCode == '001'}">
          <a href="<c:url value='/purchase/updatePurchase?tranNo=${p.tranNo}'/>">수정</a>
        </c:if>

        <!-- 배송 중(002) : 수령 버튼 -->
        <c:if test="${p.tranCode == '002'}">
          <form action="<c:url value='/purchase/confirmReceive'/>" method="post" style="display:inline;">
            <input type="hidden" name="tranNo" value="${p.tranNo}"/>
            <input type="hidden" name="prodNo" value="${p.purchaseProd.prodNo}"/>
            <button type="submit">물품수령</button>
          </form>
        </c:if>
      </td>
    </tr>
  </c:forEach>
  </tbody>
</table>

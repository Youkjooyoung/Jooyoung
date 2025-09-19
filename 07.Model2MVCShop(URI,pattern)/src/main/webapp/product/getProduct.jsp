<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<h2>상품 상세</h2>

<table border="0" cellpadding="6" cellspacing="0">
  <tr><th>상품번호</th><td>${product.prodNo}</td></tr>
  <tr><th>상품명</th><td>${product.prodName}</td></tr>
  <tr><th>상세 설명</th><td>${product.prodDetail}</td></tr>
  <tr><th>가격</th><td><fmt:formatNumber value="${product.price}" type="number"/> 원</td></tr>
  <tr><th>제조일자</th><td>${product.manuDate}</td></tr>
  <tr><th>등록일자</th><td>${product.regDate}</td></tr>
	  <tr>
			  <th>이미지</th>
			  <td>
			    <c:forEach var="img" items="${productImages}">
			      <img src="${pageContext.request.contextPath}/images/uploadFiles/${img.fileName}"
			           alt="${product.prodName}" style="max-width:200px; height:auto; margin:5px;"/>
			    </c:forEach>
			  </td>
	</tr>
</table>

<c:choose>
  <c:when test="${not empty latestCode}">
    <p style="color:#e74c3c;font-weight:bold;">해당상품은 품절된 상태입니다.</p>
    <%-- <p>
      상태 :
      <c:choose>
        <c:when test="${latestCode == '001'}">재고없음</c:when>
        <c:when test="${latestCode == '002'}">배송중</c:when>
        <c:when test="${latestCode == '003'}">배송완료</c:when>
      </c:choose>
    </p> --%>
  </c:when>
  <c:otherwise>
    <!-- 판매자(관리자)는 구매 불가, 일반 유저만 구매 버튼 -->
    <c:if test="${!(sessionScope.user != null && sessionScope.user.role == 'admin')}">
      <form action="<c:url value='/purchase/addPurchase'/>" method="get">
        <input type="hidden" name="prodNo" value="${product.prodNo}"/>
        <button type="submit">구매하기</button>
      </form>
    </c:if>
  </c:otherwise>
</c:choose>
		<c:if test="${sessionScope.user != null && sessionScope.user.role == 'admin'}">
		  <!-- 상품수정 버튼 -->
		  <form action="${pageContext.request.contextPath}/product/updateProduct" method="get" style="display:inline;">
		    <input type="hidden" name="prodNo" value="${product.prodNo}"/>
		    <button type="submit">상품수정</button>
		  </form>
		  
		  <!-- 상품삭제 버튼 (구매이력 없는 경우만 표시) -->
		  <c:if test="${empty latestCode}">
		    <form action="${pageContext.request.contextPath}/product/deleteProduct" method="post" style="display:inline;"
		          onsubmit="return confirm('정말 이 상품을 삭제하시겠습니까?');">
		      <input type="hidden" name="prodNo" value="${product.prodNo}"/>
		      <button type="submit" style="color:red;">상품삭제</button>
		    </form>
		  </c:if>
		</c:if>

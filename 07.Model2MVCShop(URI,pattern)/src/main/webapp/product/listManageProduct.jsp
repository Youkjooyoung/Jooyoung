<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<html>
<head>
<title>판매상품 관리</title>
<link href="${ctx}/css/list.css" rel="stylesheet">
</head>
<body>

	<h2>판매상품 관리</h2>

	<table>
		<tr>
			<th>번호</th>
			<th>상품명</th>
			<th>가격</th>
			<th>등록일자</th>
			<th>상태</th>
			<th>관리</th>
		</tr>

		<c:forEach var="product" items="${list}">
			<tr>
				<td>${product.prodNo}</td>
				<td><a href="${ctx}/product/getProduct?prodNo=${product.prodNo}">${product.prodName}</a></td>
				<td><fmt:formatNumber value="${product.price}" type="number"/> 원</td>
				<td>${product.manuDate}</td>

				<!-- 상태 -->
				<td>
				  <c:choose>
				    <c:when test="${not empty latestCodeMap[product.prodNo]}">재고없음</c:when>
				    <c:otherwise>판매중</c:otherwise>
				  </c:choose>
				</td>

				 <td>
					  <!-- 배송 상태 -->
					  <c:choose>
					    <c:when test="${latestCodeMap[product.prodNo] == '001'}">
					      <a href="${ctx}/purchase/updateTranCodeByProd?prodNo=${product.prodNo}&tranCode=002">배송하기</a>
					    </c:when>
					    <c:when test="${latestCodeMap[product.prodNo] == '002'}">배송중</c:when>
					    <c:when test="${latestCodeMap[product.prodNo] == '003'}">배송완료</c:when>
					    <c:otherwise>판매중</c:otherwise>
					  </c:choose>
					</td>
			</tr>
		</c:forEach>
	</table>

	<br />

	<!-- 페이징 네비게이션 -->
	<div class="pagination">
		<c:if test="${resultPage.beginUnitPage > 1}">
			<a href="${ctx}/product/listProduct?menu=manage&currentPage=1">«</a>
			<a href="${ctx}/product/listProduct?menu=manage&currentPage=${resultPage.beginUnitPage-1}">&lt;</a>
		</c:if>

		<c:forEach var="i" begin="${resultPage.beginUnitPage}" end="${resultPage.endUnitPage}">
			<c:choose>
				<c:when test="${i == resultPage.currentPage}">
					<strong>[${i}]</strong>
				</c:when>
				<c:otherwise>
					<a href="${ctx}/product/listProduct?menu=manage&currentPage=${i}">[${i}]</a>
				</c:otherwise>
			</c:choose>
		</c:forEach>

		<c:if test="${resultPage.endUnitPage < resultPage.maxPage}">
			<a href="${ctx}/product/listProduct?menu=manage&currentPage=${resultPage.endUnitPage+1}">&gt;</a>
			<a href="${ctx}/product/listProduct?menu=manage&currentPage=${resultPage.maxPage}">&raquo;</a>
		</c:if>
	</div>

</body>
</html>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<html>
<head>
<title>상품 검색</title>
<link href="${ctx}/css/list.css" rel="stylesheet">
</head>
<body>

	<h2>상품 검색</h2>

	<!-- 검색 영역 -->
	<form action="${ctx}/product/listProduct" method="get">
		<select name="searchCondition">
			<option value="0" ${search.searchCondition == "0" ? "selected" : ""}>전체</option>
			<%-- <option value="prodNo" ${search.searchCondition == "prodNo" ? "selected" : ""}>상품번호</option> --%>
			<option value="prodName" ${search.searchCondition == "prodName" ? "selected" : ""}>상품명</option>
			<option value="prodDetail" ${search.searchCondition == "prodDetail" ? "selected" : ""}>상세설명</option>
		</select>
		<input type="text" name="searchKeyword" value="${search.searchKeyword}" placeholder="검색어 입력"/>
		페이지크기: 
		<input type="text" name="pageSize" value="${search.pageSize}" size="3"/>
		<input type="submit" value="검색"/>
		<a href="${ctx}/product/listProduct">전체보기</a>
	</form>

	<br/>

	<!-- 상품 목록 -->
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
				<td>
					<a href="${ctx}/product/getProduct?prodNo=${product.prodNo}">${product.prodName}</a>
				</td>
				<td><fmt:formatNumber value="${product.price}" type="number"/> 원</td>
				<td>${product.manuDate}</td>

				<!-- 상태: 판매중/재고없음 -->
				<td>
				  <c:choose>
				    <c:when test="${not empty latestCodeMap[product.prodNo]}">재고없음</c:when>
				    <c:otherwise>판매중</c:otherwise>
				  </c:choose>
				</td>

				<!-- 구매자용 관리 -->
					<td>
					  <c:choose>
					    <c:when test="${sessionScope.user.role == 'admin'}">
					      -
					    </c:when>
					    <c:otherwise>
					      <c:choose>
					        <c:when test="${empty latestCodeMap[product.prodNo]}">
					          <a href="/purchase/addPurchase?prodNo=${product.prodNo}">구매하기</a>
					        </c:when>
					        <c:otherwise>-</c:otherwise>
					      </c:choose>
					    </c:otherwise>
					  </c:choose>
					</td>
			</tr>
		</c:forEach>
	</table>

	<br/>

	<!-- 페이징 네비게이션 -->
	<div class="pagination">
		<c:if test="${resultPage.beginUnitPage > 1}">
			<a href="listProduct?currentPage=1&searchCondition=${search.searchCondition}&searchKeyword=${search.searchKeyword}">&laquo;</a>
			<a href="listProduct?currentPage=${resultPage.beginUnitPage-1}&searchCondition=${search.searchCondition}&searchKeyword=${search.searchKeyword}">&lt;</a>
		</c:if>

		<c:forEach var="i" begin="${resultPage.beginUnitPage}" end="${resultPage.endUnitPage}">
			<c:choose>
				<c:when test="${i == resultPage.currentPage}">
					<strong>[${i}]</strong>
				</c:when>
				<c:otherwise>
					<a href="listProduct?currentPage=${i}&searchCondition=${search.searchCondition}&searchKeyword=${search.searchKeyword}">[${i}]</a>
				</c:otherwise>
			</c:choose>
		</c:forEach>

		<c:if test="${resultPage.endUnitPage < resultPage.maxPage}">
			<a href="listProduct?currentPage=${resultPage.endUnitPage+1}&searchCondition=${search.searchCondition}&searchKeyword=${search.searchKeyword}">&gt;</a>
			<a href="listProduct?currentPage=${resultPage.maxPage}&searchCondition=${search.searchCondition}&searchKeyword=${search.searchKeyword}">&raquo;</a>
		</c:if>
	</div>

</body>
</html>

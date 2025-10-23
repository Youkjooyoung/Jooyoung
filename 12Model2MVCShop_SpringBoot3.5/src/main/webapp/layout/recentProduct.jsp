<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>최근 본 상품</title>
<link rel="stylesheet" href="${ctx}/css/naver-common.css" />
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script src="${ctx}/javascript/app-core.js"></script>
<script src="${ctx}/javascript/recentProduct.js"></script>
</head>
<body data-ctx="${ctx}" class="bg-naver-gray-50 min-h-screen">
	<div
		class="container mx-auto py-10 px-6 bg-white rounded-nv shadow-nv mt-10">
		<div class="page-title mb-6">
			<h2 class="text-2xl font-extrabold text-naver-green">최근 본 상품</h2>
		</div>
		<table
			class="min-w-full border-t border-naver-gray-100 text-center text-sm">
			<thead class="bg-naver-gray-50 border-b border-naver-gray-200">
				<tr>
					<th class="py-3">No</th>
					<th>상품명</th>
					<th>가격</th>
					<th>등록일자</th>
					<th>상태</th>
				</tr>
			</thead>
			<tbody>
				<c:if test="${empty sessionScope.recentList}">
					<tr>
						<td colspan="5" class="py-6 text-gray-500">최근 본 상품이 없습니다.</td>
					</tr>
				</c:if>

				<c:forEach var="p" items="${sessionScope.recentList}" varStatus="st">
					<tr class="hover:bg-naver-gray-50 border-b border-naver-gray-100">
						<td class="py-2">${st.index + 1}</td>
						<td><span class="recent-item text-naver-green cursor-pointer"
							role="link" tabindex="0" data-prodno="${p.prodNo}"
							data-filename="${p.fileName}"> ${p.prodName} </span></td>
						<td class="text-right pr-3"><c:choose>
								<c:when test="${not empty p.price}">
									<fmt:formatNumber value="${p.price}" type="number" /> 원
            </c:when>
								<c:otherwise>-</c:otherwise>
							</c:choose></td>
						<td><c:choose>
								<c:when test="${not empty p.regDate}">
									<fmt:formatDate value="${p.regDate}" pattern="yyyy.MM.dd" />
								</c:when>
								<c:otherwise>-</c:otherwise>
							</c:choose></td>
						<td><span class="text-naver-green font-semibold">판매중</span></td>
					</tr>
				</c:forEach>
			</tbody>
		</table>

		<div id="hoverThumb" class="mt-6"></div>

	</div>
</body>
</html>
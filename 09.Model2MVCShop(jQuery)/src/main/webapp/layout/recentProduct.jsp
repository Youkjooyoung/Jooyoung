<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<html>
<head>
<title>최근 본 상품</title>
<!-- 공통 CSS -->
<link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css">
<!-- 최근 본 상품 전용 CSS -->
<link rel="stylesheet" href="${ctx}/css/recentProduct.css"
	type="text/css">

<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
</head>
<body>
	<h2 class="recent-title">최근 본 상품</h2>

	<c:if test="${empty sessionScope.recentList}">
		<p class="no-data">최근 본 상품이 없습니다.</p>
	</c:if>

	<c:if test="${not empty sessionScope.recentList}">
		<ul class="recent-list">
			<c:forEach var="prod" items="${sessionScope.recentList}">
				<li><a href="${ctx}/product/getProduct?prodNo=${prod.prodNo}"
					data-filename="${prod.fileName}"> ${prod.prodName} </a></li>
			</c:forEach>
		</ul>
	</c:if>

	<!-- hover 시 표시될 미리보기 -->
	<div id="preview-box">
		<img id="preview-img" src="" />
	</div>

	<script>
		const ctx = "${ctx}";
	</script>
	<script src="${ctx}/javascript/recentProduct.js"></script>

</body>
</html>

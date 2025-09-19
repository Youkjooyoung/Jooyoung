<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>구매 수정 결과</title>
<link rel="stylesheet" href="${ctx}/css/purchase.css" />
</head>
<body>
	<header>
		<h1>구매 수정 결과</h1>
		<nav>
			<a href="<c:url value='/listPurchase.do'/>">목록</a>
			<c:if test="${not empty purchase}">
				<a
					href="<c:url value='/getPurchase.do'><c:param name='tranNo' value='${purchase.tranNo}'/></c:url>">상세로
					이동</a>
			</c:if>
		</nav>
	</header>

	<main>
		<c:choose>
			<c:when test="${empty purchase}">
				<p>수정된 정보가 없습니다.</p>
			</c:when>
			<c:otherwise>
				<p>
					주문번호 <strong>${purchase.tranNo}</strong> 의 정보가 수정되었습니다.
				</p>
			</c:otherwise>
		</c:choose>
	</main>
</body>
</html>

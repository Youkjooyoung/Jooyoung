<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<html>
<head>
    <title>최근 본 상품</title>
</head>
<body>
    <h2>최근 본 상품</h2>

    <c:if test="${empty sessionScope.recentList}">
        <p>최근 본 상품이 없습니다.</p>
    </c:if>

    <c:if test="${not empty sessionScope.recentList}">
        <ul>
            <c:forEach var="prod" items="${sessionScope.recentList}">
                <li>
                    <a href="${ctx}/product/getProduct?prodNo=${prod.prodNo}"> ${prod.prodName}</a>
                </li>
            </c:forEach>
        </ul>
    </c:if>
</body>
</html>

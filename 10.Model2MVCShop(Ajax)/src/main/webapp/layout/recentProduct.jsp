<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>최근 본 상품</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/recentProduct.js"></script>
</head>

<body data-ctx="${ctx}">
<div class="container">

  <div class="page-title"><h2>최근 본 상품</h2></div>

  <table class="list-table">
    <thead>
      <tr><th>No</th><th>상품명</th><th>가격</th><th>등록일자</th><th>상태</th></tr>
    </thead>
    <tbody>
      <c:if test="${empty sessionScope.recentList}">
        <tr><td colspan="5" style="text-align:center; padding:20px;">최근 본 상품이 없습니다.</td></tr>
      </c:if>

      <c:forEach var="p" items="${sessionScope.recentList}" varStatus="st">
        <tr>
          <td>${st.index + 1}</td>
          <td>
            <span class="recent-item" role="link" tabindex="0" data-prodno="${p.prodNo}" data-filename="${p.fileName}">${p.prodName}</span>
          </td>
          <td style="text-align:right;">
            <c:choose>
              <c:when test="${not empty p.price}"><fmt:formatNumber value="${p.price}" type="number"/> 원</c:when>
              <c:otherwise>-</c:otherwise>
            </c:choose>
          </td>
          <td>
            <c:choose>
              <c:when test="${not empty p.regDate}"><fmt:formatDate value="${p.regDate}" pattern="yyyyMMdd"/></c:when>
              <c:otherwise>-</c:otherwise>
            </c:choose>
          </td>
          <td>판매중</td>
        </tr>
      </c:forEach>
    </tbody>
  </table>

  <div id="hoverThumb"></div>

</div>
</body>
</html>

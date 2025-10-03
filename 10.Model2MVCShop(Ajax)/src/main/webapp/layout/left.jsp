<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>Model2 MVC Shop</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" />
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/left.js"></script>
</head>

<body class="nv-left" data-ctx="${ctx}">
  <div class="left-menu">

    <!-- 앱 설정 그룹 -->
    <div class="menu-group">
      <div class="menu-title">내 정보</div>
      <ul class="menu">
        <c:if test="${!empty sessionScope.user}">
          <li class="Depth03" data-nav="myInfo">개인정보조회</li>
        </c:if>
        <c:if test="${not empty sessionScope.user && sessionScope.user.role == 'admin'}">
          <li class="Depth03" data-nav="userList">회원정보조회</li>
        </c:if>
      </ul>
    </div>

    <!-- 상품 설정 그룹 -->
    <div class="menu-group">
      <div class="menu-title">상품</div>
      <ul class="menu">
        <c:if test="${not empty sessionScope.user && sessionScope.user.role == 'admin'}">
          <li class="Depth03" data-nav="addProduct">판매상품등록</li>
          <li class="Depth03" data-nav="manageProduct">판매상품관리</li>
        </c:if>
        <li class="Depth03" data-nav="searchProduct">상품 검색</li>
      </ul>
    </div>

    <!-- 구매/최근 그룹 -->
    <div class="menu-group">
      <div class="menu-title">사용자</div>
      <ul class="menu">
        <c:if test="${not empty sessionScope.user && sessionScope.user.role == 'user'}">
          <li class="Depth03" data-nav="myPurchase">구매이력조회</li>
        </c:if>
        <li class="Depth03" data-nav="recent">최근 본 상품</li>
      </ul>
    </div>

  </div>
</body>
</html>

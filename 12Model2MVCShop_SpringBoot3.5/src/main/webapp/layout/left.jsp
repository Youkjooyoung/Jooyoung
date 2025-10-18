<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<div class="left-menu" data-ctx="${ctx}">
  <!-- 내 정보 -->
  <div class="menu-group">
    <div class="menu-title">내 정보</div>
    <ul class="menu">
      <c:if test="${!empty sessionScope.user}">
        <li class="Depth03" data-nav="myInfo" role="button" tabindex="0">개인정보조회</li>
      </c:if>
      <c:if test="${not empty sessionScope.user && sessionScope.user.role == 'admin'}">
        <li class="Depth03" data-nav="userList" role="button" tabindex="0">회원정보조회</li>
      </c:if>
    </ul>
  </div>

  <!-- 상품 -->
  <div class="menu-group">
    <div class="menu-title">상품</div>
    <ul class="menu">
      <c:if test="${not empty sessionScope.user && sessionScope.user.role == 'admin'}">
        <li class="Depth03" data-nav="addProduct" role="button" tabindex="0">판매상품등록</li>
        <li class="Depth03" data-nav="manageProduct" role="button" tabindex="0">판매상품관리</li>
      </c:if>
      <li class="Depth03" data-nav="searchProduct" role="button" tabindex="0">상품 검색</li>
    </ul>
  </div>

  <!-- 사용자 -->
  <div class="menu-group">
    <div class="menu-title">사용자</div>
    <ul class="menu">
      <c:if test="${not empty sessionScope.user && sessionScope.user.role == 'user'}">
        <li class="Depth03" data-nav="purchaseList" role="button" tabindex="0">구매이력조회</li>
        <li class="Depth03" data-nav="cart" role="button" tabindex="0">나의 장바구니</li>
      </c:if>
      <li class="Depth03" data-nav="recent" role="button" tabindex="0">최근 본 상품</li>
    </ul>
  </div>
</div>

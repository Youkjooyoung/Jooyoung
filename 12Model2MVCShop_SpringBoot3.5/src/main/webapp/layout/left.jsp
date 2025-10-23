<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!-- =========================
     🟩 좌측 네비게이션 (Tailwind)
     ========================= -->
<div class="left-menu w-full bg-naver-gray-50 border-r border-naver-gray-200 text-[15px] font-medium"
     data-ctx="${ctx}">

  <!-- 내 정보 -->
  <div class="menu-group border-b border-naver-gray-200 py-3">
    <div class="menu-title px-5 mb-1 text-gray-600 font-semibold text-[15px]">내 정보</div>
    <ul class="menu list-none m-0 p-0">
      <c:if test="${!empty sessionScope.user}">
        <li class="Depth03 px-5 py-2 cursor-pointer hover:bg-naver-gray-100 hover:text-naver-green transition"
            data-nav="myInfo" role="button" tabindex="0">개인정보조회</li>
      </c:if>
      <c:if test="${not empty sessionScope.user && sessionScope.user.role == 'admin'}">
        <li class="Depth03 px-5 py-2 cursor-pointer hover:bg-naver-gray-100 hover:text-naver-green transition"
            data-nav="userList" role="button" tabindex="0">회원정보조회</li>
      </c:if>
    </ul>
  </div>

  <!-- 상품 -->
  <div class="menu-group border-b border-naver-gray-200 py-3">
    <div class="menu-title px-5 mb-1 text-gray-600 font-semibold text-[15px]">상품</div>
    <ul class="menu list-none m-0 p-0">
      <c:if test="${not empty sessionScope.user && sessionScope.user.role == 'admin'}">
        <li class="Depth03 px-5 py-2 cursor-pointer hover:bg-naver-gray-100 hover:text-naver-green transition"
            data-nav="addProduct" role="button" tabindex="0">판매상품등록</li>
        <li class="Depth03 px-5 py-2 cursor-pointer hover:bg-naver-gray-100 hover:text-naver-green transition"
            data-nav="manageProduct" role="button" tabindex="0">판매상품관리</li>
      </c:if>
      <li class="Depth03 px-5 py-2 cursor-pointer hover:bg-naver-gray-100 hover:text-naver-green transition"
          data-nav="searchProduct" role="button" tabindex="0">상품 검색</li>
    </ul>
  </div>

  <!-- 사용자 -->
  <div class="menu-group border-b border-naver-gray-200 py-3">
    <div class="menu-title px-5 mb-1 text-gray-600 font-semibold text-[15px]">사용자</div>
    <ul class="menu list-none m-0 p-0">
      <c:if test="${not empty sessionScope.user && sessionScope.user.role == 'user'}">
        <li class="Depth03 px-5 py-2 cursor-pointer hover:bg-naver-gray-100 hover:text-naver-green transition"
            data-nav="purchaseList" role="button" tabindex="0">구매이력조회</li>
        <li class="Depth03 px-5 py-2 cursor-pointer hover:bg-naver-gray-100 hover:text-naver-green transition"
            data-nav="cart" role="button" tabindex="0">나의 장바구니</li>
      </c:if>
      <li class="Depth03 px-5 py-2 cursor-pointer hover:bg-naver-gray-100 hover:text-naver-green transition"
          data-nav="recentPopup" role="button" tabindex="0">최근 본 상품</li>
    </ul>
  </div>
</div>

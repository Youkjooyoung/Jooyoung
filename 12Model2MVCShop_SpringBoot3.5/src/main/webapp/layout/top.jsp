<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!-- =========================
     🟩 상단 네비게이션 (Tailwind)
     ========================= -->
<div class="nv-header flex items-center justify-between h-[70px] px-6 bg-white border-b-2 border-naver-green shadow-sm"
     data-ctx="${ctx}">
  
  <!-- 현재 로그인 사용자 -->
  <input type="hidden" id="userIdForTop"
         value="${sessionScope.user != null ? sessionScope.user.userId : ''}" />

  <!-- 브랜드 -->
  <h1 id="btnHome"
      class="nv-brand flex items-center gap-3 cursor-pointer select-none"
      role="button" tabindex="0" aria-label="홈으로">
    <span class="brand-mark-bg w-10 h-10 bg-[url('${ctx}/images/uploadFiles/naver.png')] bg-center bg-contain bg-no-repeat"
          role="img" aria-label="Model2 MVC Shop"></span>
    <span class="brand-title text-2xl font-extrabold text-naver-green hover:text-naver-dark transition">
      Model2 MVC Shop
    </span>
  </h1>

  <!-- 로그인 / 회원가입 / 로그아웃 -->
  <nav class="nv-auth flex items-center gap-2 text-sm"></nav>
</div>

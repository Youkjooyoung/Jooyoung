<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<link rel="stylesheet" href="${ctx}/css/footer.css" />

<div class="nv-footer">
  <div class="nv-footer-inner container" data-ctx="${ctx}">

    <!-- 브랜드 섹션 -->
    <div class="footer-col">
      <div class="footer-title">Model2 MVC Shop</div>
      <div class="footer-text">Smart Code, Better Shopping</div>
      <div class="footer-text">MVC Inside, Simplicity Outside</div>
    </div>

    <!-- 고객센터 -->
    <div class="footer-col">
      <div class="footer-title">고객센터</div>
      <ul class="footer-list">
        <li><span class="link-like" data-footer-nav="faq">FAQ</span></li>
        <li><span class="link-like" data-footer-nav="notice">공지사항</span></li>
        <li><span class="link-like" data-footer-nav="policy">이용약관</span></li>
        <li><span class="link-like" data-footer-nav="privacy">개인정보처리방침</span></li>
      </ul>
    </div>

    <!-- 문의/운영정보 -->
    <div class="footer-col">
      <div class="footer-title">문의</div>
      <div class="footer-text">이메일: support@example.com</div>
      <div class="footer-text">운영시간: 10:00 ~ 18:00 (주말/공휴일 제외)</div>
    </div>

  </div>

	<div class="footer-bottom">
   		 © ${year} Model2 MVC Shop. All rights reserved.
  	</div>
</div>

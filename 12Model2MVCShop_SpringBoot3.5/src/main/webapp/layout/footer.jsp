<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="year" value="<%=java.time.Year.now()%>" />
<footer class="nv-footer border-t border-gray-200 bg-white">
  <div class="max-w-[1100px] mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 text-sm text-gray-700">
      <div class="space-y-1">
        <div class="text-naver-green font-bold text-lg">Model2 MVC Shop</div>
        <div class="text-gray-600">Smart Code, Better Shopping</div>
        <div class="text-gray-600">MVC Inside, Simplicity Outside</div>
      </div>
      <div>
        <div class="text-naver-green font-bold mb-2">고객센터</div>
        <ul class="space-y-1 text-gray-700">
          <li><span class="cursor-pointer hover:text-naver-green" data-footer-nav="faq">FAQ</span></li>
          <li><span class="cursor-pointer hover:text-naver-green" data-footer-nav="notice">공지사항</span></li>
          <li><span class="cursor-pointer hover:text-naver-green" data-footer-nav="policy">이용약관</span></li>
          <li><span class="cursor-pointer hover:text-naver-green" data-footer-nav="privacy">개인정보처리방침</span></li>
        </ul>
      </div>
      <div class="space-y-1">
        <div class="text-naver-green font-bold mb-2">문의</div>
        <div>이메일: support@example.com</div>
        <div>운영시간: 10:00 ~ 18:00 (주말/공휴일 제외)</div>
      </div>
    </div>
    <div class="text-center text-xs text-gray-500 border-t border-gray-200 py-3 bg-naver-gray-50">
      © ${year} Model2 MVC Shop. All rights reserved.
    </div>
  </div>
</footer>

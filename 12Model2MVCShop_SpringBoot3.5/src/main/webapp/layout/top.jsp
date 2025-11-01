<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<div class="bg-white border-b-2 border-[#03c75a]">
  <div class="max-w-[1100px] mx-auto h-[64px] px-4 flex items-center justify-between">
    <div id="btnHome" class="flex items-center gap-3 cursor-pointer select-none" role="button" tabindex="0" aria-label="홈">
      <span class="w-7 h-7 rounded-lg bg-[url('${ctx}/images/uploadFiles/naver.png')] bg-center bg-contain bg-no-repeat"></span>
      <span class="text-[18px] font-extrabold text-[#03c75a]">Model2 MVC Shop</span>
    </div>

    <div class="flex items-center gap-5">
      <div class="nv-auth flex items-center gap-4"></div>
      <button id="btnMainMenu" type="button" class="h-9 px-4 rounded-[10px] font-bold border border-gray-300">메뉴</button>
    </div>
  </div>
</div>

<div id="menuDropdown" class="fixed top-[60px] right-[24px] w-[220px] bg-white border border-gray-200 rounded-[12px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] hidden z-[9999]">
  <ul class="py-2">
    <li class="px-4 py-2 hover:bg-gray-50 cursor-pointer" data-nav="purchaseList">구매 내역</li>
    <li class="px-4 py-2 hover:bg-gray-50 cursor-pointer" data-nav="myInfo">내 정보</li>
  </ul>
</div>

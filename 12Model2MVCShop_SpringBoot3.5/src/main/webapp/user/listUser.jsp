<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>회원 목록 | Model2 MVC Shop</title>
<link rel="icon" href="${ctx}/images/favicon.ico" />

<meta http-equiv="Content-Security-Policy"
  content="
  default-src 'self' data: blob:;
  script-src  'self' 'unsafe-inline' 'unsafe-eval'
    http://localhost:8080
    https://code.jquery.com
    https://cdn.tailwindcss.com
    https://cdn.jsdelivr.net
    https://kauth.kakao.com
    https://accounts.google.com
    https://apis.google.com
    https://www.gstatic.com
    https://t1.daumcdn.net;
  style-src   'self' 'unsafe-inline'
    https://cdn.tailwindcss.com
    https://fonts.googleapis.com
    https://cdn.jsdelivr.net;
  img-src     'self' data: blob:
    https://t1.kakaocdn.net
    https://t1.daumcdn.net
    https://www.gstatic.com
    https://ssl.gstatic.com
    https://www.svgrepo.com;
  font-src    'self' https://fonts.gstatic.com;
  connect-src 'self';
  frame-src   'self'
    https://kauth.kakao.com
    https://accounts.google.com
    https://t1.daumcdn.net
    https://postcode.map.daum.net;
  upgrade-insecure-requests;
">
<script src="${ctx}/javascript/tw-naver.js"></script>
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script>window.App=window.App||{};App.ctx=()=>'${ctx}';</script>
<script src="${ctx}/javascript/left.js" defer></script>
<script src="${ctx}/javascript/listUser.js" defer></script>
</head>

<body class="font-sans bg-white text-gray-900 min-h-screen" data-ctx="${ctx}">
<header class="w-full bg-white border-b-2 border-[#03c75a] flex flex-row items-start justify-between px-4 py-3 text-sm">
  <div class="flex flex-row items-center gap-2">
    <div class="w-8 h-8 rounded-xl bg-[#03c75a] text-white font-extrabold text-[0.9rem] flex items-center justify-center"><span class="text-xl leading-none">🏬</span></div>
    <div class="text-xl font-extrabold text-[#03c75a] leading-none">Model2 MVC Shop</div>
  </div>
  <div class="flex flex-row items-center gap-3">
    <div class="text-[0.85rem] font-medium text-[#03c75a]" data-header-greeting></div>
    <button type="button" data-role="logout" class="h-9 px-3 rounded-[10px] bg-[#03c75a] text-white font-bold text-[0.8rem] hover:bg-[#02b857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03c75a] transition leading-none">로그아웃</button>
  </div>
</header>

<div class="w-full max-w-[1000px] mx-auto flex flex-row">
  <aside class="w-[220px] bg-white border-r border-gray-200 text-[0.9rem] leading-[1.4]">
    <div class="flex flex-col">
      <div class="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900">내 정보</div>
      <div class="px-4 py-3 border-b border-gray-200 text-gray-700 cursor-pointer hover:bg-[#f7f8f9]" data-nav="myInfo" data-href="${ctx}/user/myInfo" role="button" tabindex="0">개인정보조회</div>
      <div class="px-4 py-3 border-b border-gray-200 text-[#03c75a] font-semibold bg-[#f7f8f9]" data-nav="userList" data-href="${ctx}/user/listUser" role="button" tabindex="0">회원정보조회</div>
    </div>
    <div class="flex flex-col mt-4 border-t border-gray-200">
      <div class="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900">상품</div>
      <div class="px-4 py-3 border-b border-gray-200 text-gray-700 cursor-pointer hover:bg-[#f7f8f9]" data-nav="addProduct" data-href="${ctx}/product/addProductView" role="button" tabindex="0">판매상품등록</div>
      <div class="px-4 py-3 border-b border-gray-200 text-gray-700 cursor-pointer hover:bg-[#f7f8f9]" data-nav="manageProduct" data-href="${ctx}/product/manageProduct" role="button" tabindex="0">판매상품관리</div>
      <div class="px-4 py-3 border-b border-gray-200 text-gray-700 cursor-pointer hover:bg-[#f7f8f9]" data-nav="searchProduct" data-href="${ctx}/product/listProduct" role="button" tabindex="0">상품 검색</div>
    </div>
  </aside>

  <main class="flex-1 bg-white p-6 flex justify-center">
    <section class="w-full max-w-[980px] bg-white rounded-[20px] border border-[#e5e8eb] shadow-[0_30px_80px_rgba(0,0,0,0.07)] p-8" data-page="user-list" data-view="user-list">
      <div class="flex flex-col gap-6 mb-8">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#03c75a]/10 flex items-center justify-center shadow-[0_16px_40px_rgba(3,199,90,0.25)]">
              <img src="${ctx}/images/uploadFiles/naver.png" alt="logo" class="w-7 h-7 object-contain" />
            </div>
            <div>
              <div class="text-[1.25rem] font-extrabold text-gray-900 leading-tight">회원 목록</div>
              <div class="text-[0.8rem] text-gray-500 font-medium leading-tight">Model2 MVC Shop 관리자용</div>
            </div>
          </div>
          <div class="flex gap-2 flex-wrap">
            <select id="searchCondition" class="h-11 rounded-[10px] border border-[#e5e8eb] px-3 text-[0.9rem] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a] appearance-none">
              <option value="0">회원ID</option>
              <option value="1">회원명</option>
            </select>
            <input type="text" id="searchKeyword" class="h-11 rounded-[10px] border border-[#e5e8eb] px-3 text-[0.9rem] flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="검색어 입력" />
            <button id="btnSearch" class="h-11 rounded-[10px] bg-[#03c75a] hover:bg-[#02b857] text-white font-bold text-[0.9rem] px-4 shadow-[0_16px_40px_rgba(3,199,90,0.45)] transition">검색</button>
          </div>
        </div>
        <div class="w-full h-px bg-[#e5e8eb]"></div>
      </div>

      <div class="overflow-x-auto rounded-[12px] border border-[#e5e8eb]">
        <table class="w-full text-left text-[0.9rem] text-gray-800">
          <thead class="bg-[#f7f8f9] border-b border-[#e5e8eb]">
            <tr class="text-gray-600 text-[0.8rem] font-semibold">
              <th class="py-3 px-4 w-[60px] text-center">No</th>
              <th class="py-3 px-4">ID</th>
              <th class="py-3 px-4">이름</th>
              <th class="py-3 px-4">이메일</th>
            </tr>
          </thead>
          <tbody id="userList" class="divide-y divide-[#e5e8eb] bg-white"></tbody>
        </table>
      </div>

      <div id="pagination" class="flex justify-center flex-wrap gap-2 mt-8 text-[0.85rem]"></div>
      <div id="nvToastHost"></div>
    </section>
  </main>
</div>
</body>
</html>

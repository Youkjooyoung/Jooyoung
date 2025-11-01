<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>내 정보 | Model2 MVC Shop</title>
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
</head>

<body data-ctx="${ctx}" class="font-sans bg-white text-gray-900 flex flex-col min-h-screen">
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

<div class="flex flex-1 w-full">
  <div class="w-full max-w-[1000px] mx-auto flex flex-row flex-1">
    <aside class="w-[220px] bg-white border-r border-gray-200 text-[0.9rem] leading-[1.4]">
      <div class="flex flex-col">
        <button type="button" class="text-left w-full px-4 py-3 border-b border-gray-200 hover:bg-[#f7f8f9] font-semibold text-gray-900">내 정보</button>
        <button type="button" class="text-left w-full px-4 py-3 border-b border-gray-200 hover:bg-[#f7f8f9] text-gray-700">개인정보조회</button>
        <button type="button" class="text-left w-full px-4 py-3 border-b border-gray-200 hover:bg-[#f7f8f9] text-gray-700">회원정보변경</button>
      </div>
      <div class="flex flex-col mt-4 border-t border-gray-200">
        <button type="button" class="text-left w-full px-4 py-3 border-b border-gray-200 hover:bg-[#f7f8f9] font-semibold text-gray-900">상품</button>
        <button type="button" class="text-left w-full px-4 py-3 border-b border-gray-200 hover:bg-[#f7f8f9] text-gray-700">판매상품등록</button>
        <button type="button" class="text-left w-full px-4 py-3 border-b border-gray-200 hover:bg-[#f7f8f9] text-gray-700">판매상품관리</button>
        <button type="button" class="text-left w-full px-4 py-3 border-b border-gray-200 hover:bg-[#f7f8f9] text-gray-700">상품 검색</button>
      </div>
      <div class="flex flex-col mt-4 border-t border-gray-200">
        <button type="button" class="text-left w-full px-4 py-3 border-b border-gray-200 hover:bg-[#f7f8f9] font-semibold text-gray-900">사용자</button>
        <button type="button" class="text-left w-full px-4 py-3 border-b border-gray-200 hover:bg-[#f7f8f9] text-gray-700">최근 본 상품</button>
      </div>
    </aside>

    <main class="flex-1 bg-white p-6 flex justify-center">
      <section data-page="user-detail" class="w-full max-w-[480px] bg-white rounded-[20px] border border-[#e5e8eb] shadow-[0_30px_80px_rgba(0,0,0,0.07)] p-8">
        <div class="flex flex-col items-center text-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-[#03c75a] text-white font-extrabold text-lg flex items-center justify-center"><span class="text-2xl leading-none">🏬</span></div>
          <div class="mt-4 text-[1.4rem] font-extrabold text-gray-900 leading-tight">내 정보</div>
        </div>
        <div id="userInfo" class="text-[15px] leading-7">
          <div class="flex justify-between border-b border-[#e5e8eb] py-2"><span class="font-semibold text-gray-600">아이디</span><span data-field="userId" class="font-bold text-gray-900"></span></div>
          <div class="flex justify-between border-b border-[#e5e8eb] py-2"><span class="font-semibold text-gray-600">이름</span><span data-field="userName" class="text-gray-900"></span></div>
          <div class="flex justify-between border-b border-[#e5e8eb] py-2"><span class="font-semibold text-gray-600">이메일</span><span data-field="email" class="text-gray-900 break-all text-right"></span></div>
          <div class="flex justify-between border-b border-[#e5e8eb] py-2"><span class="font-semibold text-gray-600">주소</span><span data-field="addr" class="text-gray-900 text-right break-words max-w-[260px]"></span></div>
          <div class="flex justify-between border-b border-[#e5e8eb] py-2"><span class="font-semibold text-gray-600">전화번호</span><span data-field="phone" class="text-gray-900"></span></div>
          <div class="flex justify-between border-b border-[#e5e8eb] py-2"><span class="font-semibold text-gray-600">가입일</span><span data-field="regDate" class="text-gray-900"></span></div>
        </div>
        <div class="flex justify-center gap-4 mt-8">
          <button type="button" data-role="edit" class="bg-[#03c75a] text-white font-bold h-10 px-6 rounded-[10px] text-[0.9rem] hover:bg-[#02b857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03c75a] transition">개인정보 수정</button>
          <button type="button" data-role="back" class="border border-[#e5e8eb] bg-white text-gray-800 font-semibold h-10 px-6 rounded-[10px] text-[0.9rem] hover:bg-[#f7f8f9] transition">뒤로가기</button>
        </div>
        <div id="nvToastHost"></div>
      </section>
    </main>
  </div>
</div>

<script src="${ctx}/javascript/getUser.js"></script>
</body>
</html>

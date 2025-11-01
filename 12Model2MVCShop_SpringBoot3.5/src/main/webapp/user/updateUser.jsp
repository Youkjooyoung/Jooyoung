<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>회원정보수정 | Model2 MVC Shop</title>
<link rel="icon" href="${ctx}/images/favicon.ico" />
<meta http-equiv="Content-Security-Policy"
  content="
  default-src 'self' data: blob:;
  script-src  'self' 'unsafe-inline' 'unsafe-eval'
    http://localhost:8080
    https://code.jquery.com
    https://cdn.tailwindcss.com
    https://cdn.jsdelivr.net
    https://t1.daumcdn.net
    https://kauth.kakao.com
    https://accounts.google.com
    https://apis.google.com
    https://www.gstatic.com;
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
    https://t1.daumcdn.net
    https://postcode.map.daum.net;
  upgrade-insecure-requests;
">
<script src="${ctx}/javascript/tw-naver.js"></script>
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
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

<div class="w-full max-w-[1000px] mx-auto flex justify-center">
  <main class="flex-1 bg-white p-6 flex justify-center">
    <section class="w-full max-w-[480px] bg-white rounded-[20px] border border-[#e5e8eb] shadow-[0_30px_80px_rgba(0,0,0,0.07)] p-8" data-page="user-update" data-view="user-update" data-ctx="${ctx}">
      <div class="flex flex-col items-center text-center mb-8">
        <div class="w-12 h-12 rounded-xl bg-[#03c75a] text-white font-extrabold text-lg flex items-center justify-center"><span class="text-2xl leading-none">🏬</span></div>
        <div class="mt-4 text-[1.3rem] font-extrabold text-gray-900 leading-tight">회원정보수정</div>
      </div>

      <form id="updateUserForm" class="space-y-6" autocomplete="off">
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 block">아이디</label>
          <input type="text" name="userId" value="${user.userId}" readonly="readonly" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] bg-[#f7f8f9] text-gray-700 px-3 text-[0.95rem] leading-none focus:outline-none" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 block">이름</label>
          <input type="text" name="userName" value="${user.userName}" readonly="readonly" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] bg-[#f7f8f9] text-gray-700 px-3 text-[0.95rem] leading-none focus:outline-none" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 block">우편번호</label>
          <div class="flex gap-2">
            <input type="text" name="zipCode" id="zipCode" value="${user.zipcode}" readonly="readonly" class="h-11 w-[7rem] rounded-[12px] border border-[#e5e8eb] bg-[#f7f8f9] text-gray-700 px-3 text-[0.95rem] leading-none focus:outline-none" placeholder="우편번호" />
            <button type="button" data-role="addr-search" class="flex-1 h-11 rounded-[10px] bg-[#03c75a] text-white font-bold text-[0.9rem] px-4 hover:bg-[#02b857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03c75a] transition">주소검색</button>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 block">기본 주소</label>
          <input type="text" name="addr1" id="addr1" value="${user.addr}" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] bg-[#f7f8f9] text-gray-700 px-3 text-[0.95rem] leading-none focus:outline-none" placeholder="기본 주소" readonly="readonly" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 block">상세 주소</label>
          <input type="text" name="addr2" id="addr2" value="${user.addrDetail}" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="상세 주소를 입력하세요" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 block">휴대전화번호</label>
          <div class="flex items-center gap-2">
            <select name="phone1" id="phone1" class="h-11 w-[5rem] rounded-[12px] border border-[#e5e8eb] pl-3 pr-8 text-[0.95rem] leading-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a] appearance-none">
              <option value="010" <c:if test="${user.phone1 eq '010'}">selected="selected"</c:if>>010</option>
              <option value="011" <c:if test="${user.phone1 eq '011'}">selected="selected"</c:if>>011</option>
              <option value="016" <c:if test="${user.phone1 eq '016'}">selected="selected"</c:if>>016</option>
              <option value="017" <c:if test="${user.phone1 eq '017'}">selected="selected"</c:if>>017</option>
              <option value="018" <c:if test="${user.phone1 eq '018'}">selected="selected"</c:if>>018</option>
              <option value="019" <c:if test="${user.phone1 eq '019'}">selected="selected"</c:if>>019</option>
            </select>
            <input type="text" name="phone2" id="phone2" maxlength="4" value="${user.phone2}" class="h-11 w-[4.5rem] rounded-[12px] border border-[#e5e8eb] px-2 text-[0.95rem] leading-none text-center focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="1234" />
            <input type="text" name="phone3" id="phone3" maxlength="4" value="${user.phone3}" class="h-11 w-[4.5rem] rounded-[12px] border border-[#e5e8eb] px-2 text-[0.95rem] leading-none text-center focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="5678" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 block">이메일</label>
          <input type="text" name="email" id="email" value="${user.email}" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="example@domain.com" />
        </div>

        <div class="flex justify-center gap-4 pt-4">
          <button type="button" data-role="cancel" class="h-11 px-8 rounded-[10px] border border-[#e5e8eb] bg-white text-gray-800 font-semibold text-[0.9rem] hover:bg-[#f7f8f9] transition">취소</button>
          <button type="button" data-role="save" class="h-11 px-8 rounded-[10px] font-bold text-[0.9rem] text-white bg-[#03c75a] hover:bg-[#02b857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03c75a] transition">저장</button>
        </div>
      </form>
      <div id="nvToastHost"></div>
    </section>
  </main>
</div>

<script src="${ctx}/javascript/updateUser.js"></script>
</body>
</html>

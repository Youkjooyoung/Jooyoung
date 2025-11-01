<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>회원가입 | Model2 MVC Shop</title>
<link rel="icon" href="${ctx}/images/favicon.ico" />

<meta http-equiv="Content-Security-Policy"
  content="
  default-src 'self' data: blob:;
  script-src  'self' 'unsafe-inline' 'unsafe-eval'
    http://localhost:8080
    https://code.jquery.com
    https://cdn.tailwindcss.com
    https://cdn.jsdelivr.net
    https://t1.daumcdn.net;
  style-src   'self' 'unsafe-inline'
    https://cdn.tailwindcss.com
    https://fonts.googleapis.com
    https://cdn.jsdelivr.net;
  img-src     'self' data: blob:;
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
<script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
</head>

<body class="font-sans bg-gradient-to-b from-white via-gray-50 to-[#f0fff5] flex justify-center items-center min-h-screen p-6" data-ctx="${ctx}">
  <div class="bg-white w-full max-w-[480px] rounded-[20px] border border-[#e5e8eb] shadow-[0_30px_80px_rgba(0,0,0,0.07)] p-8" data-page="user-add">
    <div class="text-center mb-8">
      <div class="flex justify-center mb-4">
        <div class="w-12 h-12 rounded-xl bg-[#03c75a] text-white font-extrabold text-lg flex items-center justify-center">
          <span class="text-2xl leading-none">🏬</span>
        </div>
      </div>
      <div class="text-[1.3rem] font-extrabold text-[#03c75a] leading-tight">회원가입</div>
      <div class="text-[0.8rem] text-gray-500 mt-1 font-medium">Model2 MVC Shop</div>
    </div>

    <form id="addUserForm" autocomplete="off" class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 block">아이디</label>
        <div class="flex items-center gap-2">
          <input type="text" name="userId" class="flex-1 h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="영문/숫자 5~10자" />
          <div class="text-[12px] font-semibold min-w-[60px] text-center leading-tight" data-feedback-for="userId"></div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 block">비밀번호</label>
        <input type="password" name="password" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="영문+숫자+특수문자 8~20자" />
        <div class="text-[12px] font-semibold leading-tight" data-feedback-for="password"></div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 block">비밀번호 확인</label>
        <input type="password" name="password2" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="비밀번호 재입력" />
        <div class="text-[12px] font-semibold leading-tight" data-feedback-for="password2"></div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 block">이름</label>
        <input type="text" name="userName" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="이름 입력" />
        <div class="text-[12px] font-semibold leading-tight" data-feedback-for="userName"></div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 block">주소</label>
        <div class="flex gap-2 mb-2">
          <input type="text" name="zipcode" class="h-11 w-[7rem] rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none bg-[#f7f8f9] text-gray-700 focus:outline-none" placeholder="우편번호" readonly />
          <button type="button" data-role="addr-search" class="flex-1 h-11 rounded-[10px] bg-[#03c75a] text-white font-bold text-[0.9rem] px-4 hover:bg-[#02b857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03c75a] transition">주소검색</button>
        </div>
        <input type="text" name="addr" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none mb-2 bg-[#f7f8f9] text-gray-700 focus:outline-none" placeholder="기본 주소" readonly />
        <input type="text" name="addrDetail" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="상세 주소 입력" />
        <div class="text-[12px] font-semibold leading-tight" data-feedback-for="addrAll"></div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 block">휴대전화번호</label>
        <div class="flex items-center gap-2">
          <div class="relative">
            <select name="phone1" class="h-11 w-[5rem] rounded-[12px] border border-[#e5e8eb] pl-3 pr-8 text-[0.95rem] leading-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a] appearance-none [appearance:none] [-webkit-appearance:none] [-moz-appearance:none]">
              <option>010</option><option>011</option><option>016</option><option>018</option><option>019</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
          <input type="text" name="phone2" maxlength="4" class="h-11 w-[4.5rem] rounded-[12px] border border-[#e5e8eb] px-2 text-[0.95rem] leading-none text-center focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="1234" />
          <input type="text" name="phone3" maxlength="4" class="h-11 w-[4.5rem] rounded-[12px] border border-[#e5e8eb] px-2 text-[0.95rem] leading-none text-center focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="5678" />
        </div>
        <div class="text-[12px] font-semibold leading-tight" data-feedback-for="phone"></div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 block">이메일</label>
        <div class="flex items-center gap-2">
          <input type="text" name="emailLocal" class="flex-1 h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="example" />
          <span class="text-gray-500 font-semibold">@</span>
          <select name="emailDomainSelect" class="flex-none h-11 w-[8rem] rounded-[12px] border border-[#e5e8eb] pl-3 pr-8 text-[0.85rem] leading-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a] appearance-none [appearance:none] [-webkit-appearance:none] [-moz-appearance:none] relative">
            <option value="">직접입력</option><option value="naver.com">naver.com</option><option value="daum.net">daum.net</option><option value="gmail.com">gmail.com</option><option value="outlook.com">outlook.com</option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none -ml-8 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </div>
        <input type="text" name="emailDomainCustom" class="w-full h-11 rounded-[12px] border border-[#e5e8eb] px-3 text-[0.9rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="도메인을 직접 입력하세요 (예: mycompany.com)" />
        <input type="hidden" name="fullEmail" />
        <div class="text-[12px] font-semibold leading-tight" data-feedback-for="email"></div>
      </div>

      <div class="flex justify-center gap-4 pt-4">
        <button type="button" id="btnAddUser" class="h-11 px-8 rounded-[10px] font-bold text-[0.9rem] text-white bg-[#03c75a] hover:bg-[#02b857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03c75a] transition disabled:bg-gray-300 disabled:text-white disabled:shadow-none disabled:cursor-not-allowed" disabled>가입하기</button>
        <button type="button" id="btnCancel" class="h-11 px-8 rounded-[10px] border border-[#e5e8eb] bg-white text-gray-800 font-semibold text-[0.9rem] hover:bg-[#f7f8f9] transition">취소</button>
      </div>
    </form>
  </div>

<script src="${ctx}/javascript/addUser.js"></script>
</body>
</html>

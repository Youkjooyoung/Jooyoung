<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>로그인 | Model2 MVC Shop</title>
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

<body class="relative min-h-screen flex items-center justify-center font-sans bg-gradient-to-br from-[rgba(3,199,90,0.06)] via-white to-[rgba(3,199,90,0.02)] overflow-hidden" data-ctx="${ctx}" data-kakao-client="YOUR_KAKAO_CLIENT_ID" data-google-client="YOUR_GOOGLE_CLIENT_ID">
<div class="pointer-events-none absolute inset-0">
  <div class="absolute left-[5%] top-[10%] w-[280px] h-[280px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(3,199,90,0.45),transparent_70%)]"></div>
  <div class="absolute right-[10%] bottom-[10%] w-[200px] h-[200px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.08),transparent_70%)]"></div>
</div>

<div class="relative z-10 w-full max-w-[380px] bg-white rounded-[20px] border border-[rgba(152,162,179,.3)] shadow-[0_30px_80px_rgba(0,0,0,0.12)] p-8">
  <div class="flex flex-col items-center text-center mb-8">
    <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-[#03c75a] text-white font-extrabold text-lg"><span class="text-2xl leading-none">🏬</span></div>
    <div class="mt-4 text-[1.1rem] font-extrabold text-[#03c75a] flex items-center gap-1"><span>💚 LOGIN 💚</span></div>
  </div>

  <form id="loginForm" class="space-y-5">
    <div class="space-y-2">
      <label class="text-sm font-semibold text-gray-700">아이디</label>
      <input type="text" id="userId" name="userId" class="w-full h-12 border border-[#e5e8eb] rounded-[12px] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="아이디를 입력하세요" />
    </div>
    <div class="space-y-2">
      <label class="text-sm font-semibold text-gray-700">비밀번호</label>
      <input type="password" id="password" name="password" class="w-full h-12 border border-[#e5e8eb] rounded-[12px] px-3 text-[0.95rem] leading-none focus:outline-none focus:ring-2 focus:ring-[#03c75a] focus:border-[#03c75a]" placeholder="비밀번호를 입력하세요" />
    </div>
    <div class="flex items-center justify-between pt-2 text-[0.8rem]">
      <div class="flex items-center gap-2 text-gray-600">
        <input type="checkbox" id="rememberId" class="w-4 h-4 rounded border border-[#e5e8eb] text-[#03c75a] focus:ring-[#03c75a]" />
        <label for="rememberId" class="text-gray-600 font-medium select-none">아이디 저장</label>
      </div>
      <div class="text-[0.8rem] text-gray-400 font-medium">보안접속</div>
    </div>
    <div class="grid grid-cols-2 gap-3 pt-4">
      <button type="button" id="btnLoginSubmit" class="w-full h-12 rounded-[10px] bg-[#03c75a] text-white font-bold text-[0.95rem] flex items-center justify-center hover:bg-[#02b857] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03c75a] transition">로그인</button>
      <button type="button" id="btnGoJoin" class="w-full h-12 rounded-[10px] border border-[#e5e8eb] bg-white text-gray-800 font-semibold text-[0.95rem] hover:bg-[#f7f8f9] transition">회원가입</button>
    </div>
  </form>

  <div class="flex items-center gap-3 text-[0.7rem] text-gray-400 font-medium my-8">
    <div class="flex-1 h-px bg-[#e5e8eb]"></div><div>또는 SNS로 로그인</div><div class="flex-1 h-px bg-[#e5e8eb]"></div>
  </div>

  <div class="flex flex-col gap-3">
    <button type="button" id="btnKakao" class="w-full flex items-center justify-center gap-2 h-11 rounded-full bg-[#FEE500] text-gray-900 font-bold text-[0.8rem] shadow hover:brightness-95 transition">
      <img src="${ctx}/images/uploadFiles/kakao_icon.png" alt="Kakao" class="w-5 h-5" /><span>카카오로 로그인</span>
    </button>
    <button type="button" id="btnGoogle" class="w-full flex items-center justify-center gap-2 h-11 rounded-full border border-[#e5e8eb] bg-white text-gray-700 font-semibold text-[0.8rem] shadow hover:bg-[#f7f8f9] transition">
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" /><span>Google 계정으로 로그인</span>
    </button>
  </div>

  <div class="text-center mt-10 text-[0.7rem] leading-relaxed text-gray-400">Model2 MVC Shop © 2025</div>
</div>

<script src="${ctx}/javascript/login.js"></script>
</body>
</html>

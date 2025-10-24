<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>로그인</title>

<!-- ✅ Tailwind CDN -->
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          naver: '#03c75a',
          'naver-dark': '#02b150',
          kakao: '#FEE500',
          google: '#4285F4'
        },
        borderRadius: { nv: '0.5rem' },
        boxShadow: { nv: '0 6px 18px rgba(0,0,0,.08)' }
      }
    }
  }
</script>

<!-- ✅ jQuery -->
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>

</head>
<body class="bg-gray-50 flex justify-center items-center min-h-screen" 
      data-ctx="${ctx}"
      data-kakao-client="YOUR_KAKAO_CLIENT_ID"
      data-google-client="YOUR_GOOGLE_CLIENT_ID">

  <div class="bg-white rounded-nv shadow-nv p-8 w-full max-w-md">

    <!-- 로고 -->
    <div class="text-center mb-8">
      <img src="${ctx}/images/uploadFiles/naver.png" alt="Naver Logo"
           class="w-16 mx-auto mb-4">
      <h1 class="text-2xl font-extrabold text-naver">&#128525;LOGIN&#128525;</h1>
    </div>

    <!-- 로그인 폼 -->
    <form id="loginForm" class="space-y-5">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">아이디</label>
        <input type="text" id="userId" name="userId"
               class="w-full h-11 border border-gray-300 rounded-nv px-3 focus:border-naver focus:ring focus:ring-naver/20"
               placeholder="아이디를 입력하세요" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">비밀번호</label>
        <input type="password" id="password" name="password"
               class="w-full h-11 border border-gray-300 rounded-nv px-3 focus:border-naver focus:ring focus:ring-naver/20"
               placeholder="비밀번호를 입력하세요" />
      </div>

      <!-- 버튼 -->
      <div class="flex justify-between pt-4">
        <button type="button" id="btnLoginSubmit"
                class="bg-naver hover:bg-naver-dark text-white font-bold h-11 px-6 rounded-nv transition">
          로그인
        </button>
        <button type="button" id="btnGoJoin"
                class="border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold h-11 px-6 rounded-nv transition">
          회원가입
        </button>
      </div>
    </form>

    <!-- ✅ 소셜 로그인 영역 -->
    <div class="mt-10 flex flex-col gap-3">
      <!-- 카카오 -->
      <button type="button" id="btnKakao"
              class="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:brightness-95 h-11 rounded-full shadow text-gray-900 font-bold text-sm transition">
        <img src="${ctx}/images/uploadFiles/kakao_icon.png" alt="Kakao"
             class="w-5 h-5" /> 카카오로 로그인
      </button>

      <!-- 구글 -->
      <button type="button" id="btnGoogle"
              class="w-full flex items-center justify-center gap-3 bg-white h-11 rounded-full border border-gray-300 shadow-sm hover:bg-gray-50 transition">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg"
             alt="Google" class="w-5 h-5" />
        <span class="text-gray-700 font-semibold text-sm">Google 계정으로 로그인</span>
      </button>
    </div>

    <!-- 푸터 -->
    <div class="text-center mt-8 text-xs text-gray-400">
      Model2 MVC Shop © 2025
    </div>
  </div>

  <!-- ✅ JS 분리 로드 -->
  <script src="${ctx}/javascript/login.js" defer></script>

</body>
</html>

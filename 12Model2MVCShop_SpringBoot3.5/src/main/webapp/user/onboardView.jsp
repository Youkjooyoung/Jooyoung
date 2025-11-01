<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>회원정보 보완</title>

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
<script src="${ctx}/javascript/user-onboard.js" defer></script>
</head>

<body class="bg-naver-gray-50 flex justify-center items-center min-h-screen">
  <main class="bg-white shadow-nv rounded-nv p-8 w-full max-w-xl">
    <h2 class="text-xl font-bold text-naver-green mb-6 text-center">필수 정보 입력</h2>
    <form id="onboardForm" class="space-y-4">
      <div><label class="font-semibold block">이름</label><input type="text" id="userName" class="border rounded-nv px-3 h-10 w-full" value="${sessionScope.user.userName}"></div>
      <div><label class="font-semibold block">이메일</label><input type="text" id="email" class="border rounded-nv px-3 h-10 w-full" value="${sessionScope.user.email}"></div>
      <div><label class="font-semibold block">전화번호</label><input type="text" id="phone" class="border rounded-nv px-3 h-10 w-full" placeholder="010-1234-5678"></div>
      <div><label class="font-semibold block">주소</label><input type="text" id="addr" class="border rounded-nv px-3 h-10 w-full" placeholder="기본 주소"></div>
      <div class="flex justify-center gap-3 pt-4">
        <button type="button" id="btnSave" class="bg-naver-green text-white px-6 h-10 rounded-nv">저장</button>
        <button type="button" id="btnCancel" class="border border-gray-300 px-6 h-10 rounded-nv">취소</button>
      </div>
    </form>
  </main>
</body>
</html>

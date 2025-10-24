<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>내 정보</title>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          naver: '#03c75a',
          'naver-dark': '#02b150'
        },
        borderRadius: { nv: '0.5rem' },
        boxShadow: { nv: '0 6px 18px rgba(0,0,0,.08)' }
      }
    }
  }
</script>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script src="${ctx}/javascript/getUser.js" defer></script>
</head>

<body data-ctx="${ctx}" class="bg-gray-50 flex justify-center items-center min-h-screen">

  <div data-page="user-detail"
       class="bg-white rounded-nv shadow-nv p-8 w-full max-w-lg">
    <div class="text-center mb-8">
      <img src="${ctx}/images/uploadFiles/naver.png" alt="Logo" class="w-16 mx-auto mb-3">
      <h2 class="text-2xl font-extrabold text-naver">내 정보</h2>
    </div>

    <!-- 사용자 정보 영역 -->
    <div id="userInfo" class="space-y-4 text-[15px] leading-7">
      <div class="flex justify-between border-b pb-2">
        <span class="font-semibold text-gray-600">아이디</span>
        <span data-field="userId" class="font-bold text-gray-900"></span>
      </div>
      <div class="flex justify-between border-b pb-2">
        <span class="font-semibold text-gray-600">이름</span>
        <span data-field="userName"></span>
      </div>
      <div class="flex justify-between border-b pb-2">
        <span class="font-semibold text-gray-600">이메일</span>
        <span data-field="email"></span>
      </div>
      <div class="flex justify-between border-b pb-2">
        <span class="font-semibold text-gray-600">주소</span>
        <span data-field="addr" class="text-right"></span>
      </div>
      <div class="flex justify-between border-b pb-2">
        <span class="font-semibold text-gray-600">전화번호</span>
        <span data-field="phone"></span>
      </div>
      <div class="flex justify-between border-b pb-2">
        <span class="font-semibold text-gray-600">가입일</span>
        <span data-field="regDate"></span>
      </div>
    </div>

    <!-- 버튼 영역 -->
    <div class="flex justify-center gap-4 mt-8">
      <button type="button" data-role="edit"
              class="bg-naver hover:bg-naver-dark text-white font-bold h-10 px-6 rounded-nv transition">
        수정하기
      </button>
      <button type="button" data-role="back"
              class="border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold h-10 px-6 rounded-nv transition">
        뒤로가기
      </button>
    </div>

    <div id="nvToastHost"></div>
  </div>

</body>
</html>

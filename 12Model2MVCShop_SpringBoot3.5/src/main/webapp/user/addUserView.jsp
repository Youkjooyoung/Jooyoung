<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>회원가입</title>

<!-- ✅ Tailwind CDN -->
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          naver: '#03c75a',
          'naver-dark': '#02b150',
        },
        borderRadius: { nv: '0.75rem' },
        boxShadow: { nv: '0 8px 24px rgba(0,0,0,.08)' },
      },
    },
  };
</script>

<!-- ✅ jQuery -->
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<!-- ✅ Kakao 주소 API -->
<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>

<!-- ✅ 별도 JS -->
<script src="${ctx}/javascript/addUser.js" defer></script>

</head>

<body class="bg-gradient-to-b from-white via-gray-50 to-green-50 flex justify-center items-center min-h-screen">

  <!-- 🌿 회원가입 카드 -->
  <div class="bg-white shadow-nv rounded-nv w-full max-w-lg p-10">

    <!-- 헤더 -->
    <div class="text-center mb-8">
      <div class="flex justify-center mb-3">
        <div class="w-16 h-16 bg-naver/10 rounded-full flex items-center justify-center">
          <img src="${ctx}/images/uploadFiles/naver.png" alt="Logo" class="w-10 h-10" />
        </div>
      </div>
      <h2 class="text-3xl font-extrabold text-naver mb-1">회원가입</h2>
    </div>

    <!-- 폼 -->
    <form id="addUserForm" autocomplete="off" class="space-y-5">
      <!-- 아이디 -->
			<div>
				<label class="block text-sm font-semibold text-gray-700 mb-1">아이디</label>
				<div class="flex items-center gap-2">
					<input type="text" id="userId" name="userId"
						placeholder="중복확인 후 입력"
						class="flex-1 border border-gray-300 rounded-lg px-3 h-[44px] focus:ring-2 focus:ring-naver/30 focus:border-naver transition"
						readonly>
					<button type="button" id="btnCheckDup"
						class="shrink-0 bg-white border border-naver text-naver font-semibold px-4 h-[44px] leading-[44px] rounded-lg hover:bg-naver hover:text-white transition whitespace-nowrap">
						중복확인</button>
				</div>
			</div>

			<!-- 비밀번호 -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">비밀번호</label>
        <input type="password" name="password"
               class="w-full h-11 border border-gray-300 rounded-nv px-3 focus:ring-2 focus:ring-naver/30 focus:border-naver transition"
               placeholder="비밀번호를 입력하세요">
      </div>

      <!-- 비밀번호 확인 -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">비밀번호 확인</label>
        <input type="password" name="password2"
               class="w-full h-11 border border-gray-300 rounded-nv px-3 focus:ring-2 focus:ring-naver/30 focus:border-naver transition"
               placeholder="비밀번호를 다시 입력하세요">
      </div>

      <!-- 이름 -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">이름</label>
        <input type="text" name="userName"
               class="w-full h-11 border border-gray-300 rounded-nv px-3 focus:ring-2 focus:ring-naver/30 focus:border-naver transition"
               placeholder="이름을 입력하세요">
      </div>

      <!-- 주소 -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">주소</label>
        <div class="flex gap-2 mb-2">
          <input type="text" id="postcode"
                 class="border border-gray-300 rounded-nv px-3 h-11 flex-1 focus:border-naver focus:ring focus:ring-naver/20"
                 placeholder="우편번호" readonly>
          <button type="button" id="btnFindAddr"
                  class="bg-naver hover:bg-naver-dark text-white font-semibold px-4 h-11 rounded-nv transition">
            주소검색
          </button>
        </div>
        <input type="text" id="addr" name="addr"
               class="w-full h-11 border border-gray-300 rounded-nv px-3 mb-2 focus:border-naver focus:ring focus:ring-naver/20"
               placeholder="기본 주소" readonly>
        <input type="text" id="addrDetail" name="addrDetail"
               class="w-full h-11 border border-gray-300 rounded-nv px-3 focus:border-naver focus:ring focus:ring-naver/20"
               placeholder="상세 주소 입력">
      </div>

      	<!-- 휴대전화 -->
		<div>
		  <label class="block text-sm font-semibold text-gray-700 mb-1">휴대전화번호</label>
		  <div class="flex items-center gap-2">
		    <!-- Select 영역 -->
		    <div class="relative">
		      <select name="phone1"
		        class="border border-gray-300 rounded-lg pl-3 pr-8 h-[44px] text-gray-700 text-[15px]
		               focus:border-naver focus:ring-1 focus:ring-naver/20
		               leading-none
		               appearance-none
		               [appearance:none] [-webkit-appearance:none] [-moz-appearance:none]
		               [background-image:none] [background:none]">
		        <option>010</option>
		        <option>011</option>
		        <option>016</option>
		        <option>018</option>
		        <option>019</option>
		      </select>
		
		      <!-- 우리가 직접 만든 화살표 -->
		      <svg xmlns="http://www.w3.org/2000/svg"
		        class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
		        fill="none" viewBox="0 0 24 24" stroke="currentColor">
		        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
		              d="M19 9l-7 7-7-7" />
		      </svg>
		    </div>
		
		    <!-- 나머지 번호 입력 -->
		    <input type="text" name="phone2" maxlength="4"
		      class="border border-gray-300 rounded-lg px-3 h-[44px] w-24 focus:border-naver focus:ring focus:ring-naver/20 text-center text-[15px]">
		    <input type="text" name="phone3" maxlength="4"
		      class="border border-gray-300 rounded-lg px-3 h-[44px] w-24 focus:border-naver focus:ring focus:ring-naver/20 text-center text-[15px]">
		  </div>
		</div>

			<!-- 이메일 (자동완성 포함) -->
      <div class="relative">
        <label class="block text-sm font-semibold text-gray-700 mb-1">이메일</label>
        <input type="text" id="email" name="email"
               class="w-full h-11 border border-gray-300 rounded-nv px-3 focus:ring-2 focus:ring-naver/30 focus:border-naver transition"
               placeholder="example@naver.com" autocomplete="off">
        <ul id="emailSuggestions"
            class="absolute z-50 w-full bg-white border border-gray-200 rounded-md mt-1 hidden shadow">
        </ul>
      </div>

      <!-- 버튼 -->
      <div class="flex justify-center gap-3 pt-6">
        <button type="button" id="btnAddUser"
                class="bg-naver hover:bg-naver-dark text-white font-bold px-8 h-11 rounded-nv shadow transition">
          가입하기
        </button>
        <button type="reset"
                class="border border-gray-300 text-gray-700 font-semibold px-8 h-11 rounded-nv hover:bg-gray-100 transition">
          취소
        </button>
      </div>
    </form>
  </div>

  <!-- ✅ 이메일 자동완성 + 주소검색 JS -->
  <script>
    // ===== 카카오 주소검색 =====
    $('#btnFindAddr').on('click', function() {
      new daum.Postcode({
        oncomplete: function(data) {
          $('#postcode').val(data.zonecode);
          $('#addr').val(data.address);
          $('#addrDetail').focus();
        }
      }).open();
    });

    // ===== 이메일 자동완성 =====
    const domains = ['naver.com', 'gmail.com', 'daum.net', 'hanmail.net', 'outlook.com'];
    const $email = $('#email');
    const $suggest = $('#emailSuggestions');

    $email.on('input', function() {
      const val = $(this).val();
      const [name, domain] = val.split('@');
      if (!name) return $suggest.addClass('hidden');

      let list = domains
        .filter(d => !domain || d.startsWith(domain))
        .map(d => `${name}@${d}`);

      if (list.length === 0) return $suggest.addClass('hidden');

      $suggest.html(list.map(e => `<li class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">${e}</li>`).join(''))
               .removeClass('hidden');
    });

    $suggest.on('click', 'li', function() {
      $email.val($(this).text());
      $suggest.addClass('hidden');
    });

    $(document).on('click', function(e) {
      if (!$(e.target).closest('#email, #emailSuggestions').length)
        $suggest.addClass('hidden');
    });
  </script>
</body>
</html>

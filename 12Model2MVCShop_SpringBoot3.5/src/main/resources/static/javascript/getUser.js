// /javascript/getUser.js
(($, w, d) => {
  'use strict';
  if (!$) return;

  const ctx = () => $('body').data('ctx') || $('[data-page="user-detail"]').data('ctx') || '';

  // ✅ 간단 토스트 메시지
  const nvToast = (msg, type = 'info') => {
    const color =
      type === 'success' ? 'bg-naver text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-gray-800 text-white';
    const toast = $('<div>')
      .addClass(`fixed bottom-10 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-md text-sm font-semibold ${color} opacity-0 transition-all duration-300`)
      .text(msg)
      .appendTo('body');
    setTimeout(() => toast.addClass('opacity-100'), 10);
    setTimeout(() => toast.removeClass('opacity-100').addClass('opacity-0'), 2000);
    setTimeout(() => toast.remove(), 2300);
  };

  // ✅ 사용자 정보 로드
  const loadUser = () => {
    const $wrap = $('[data-page="user-detail"]');
    if (!$wrap.length) return;

    $.ajax({
      url: `${ctx()}/user/json/getUser`,
      method: 'GET',
      dataType: 'json',
      success: (user) => {
        if (!user) {
          nvToast('로그인이 필요합니다.', 'error');
          setTimeout(() => (location.href = `${ctx()}/user/loginView.jsp`), 1000);
          return;
        }

        // 데이터 매핑
        Object.keys(user).forEach((key) => {
          const $target = $wrap.find(`[data-field="${key}"]`);
          if ($target.length) {
            let val = user[key] || '';
            // 날짜 포맷 자동 변환
            if (key === 'regDate' && val) {
              val = new Date(val).toLocaleDateString('ko-KR');
            }
            $target.text(val);
          }
        });
      },
      error: (xhr, status, err) => {
        console.error('회원정보 조회 실패:', err);
        nvToast('회원정보를 불러오지 못했습니다.', 'error');
      }
    });
  };

  // ✅ 수정 페이지 이동
  const goEdit = () => {
    const userId = $('[data-field="userId"]').text().trim();
    if (!userId) return;
    const target = `${ctx()}/user/updateUser?userId=${encodeURIComponent(userId)}`;
    location.href = target;
  };

  // ✅ 뒤로가기
  const goBack = () => {
    const ref = document.referrer;
    const mainPage = `${ctx()}/index.jsp`;
    const loginPage = `${ctx()}/user/loginView.jsp`;

    if (ref && ref.includes(window.location.origin)) {
      location.href = ref;
    } else {
      $.ajax({
        url: `${ctx()}/user/json/getUser`,
        method: 'GET',
        dataType: 'json',
        success: (user) => {
          if (user) location.href = mainPage;
          else location.href = loginPage;
        },
        error: () => (location.href = loginPage)
      });
    }
  };
})(window.jQuery, window, document);

/* /javascript/index-loading.js */
(($, w, d) => {
  'use strict';
  if (!$) return;

  $(function() {
    const $logoScreen = $('#loadingLogo');
    const $header = $('#topArea');
    const $main = $('main');
    const $footer = $('#footerArea');

    const ctx = $('body').data('ctx') || '';
    const path = location.pathname;

    // ▶ 메인 홈 판단
    const isHome =
      path === ctx + '/' ||
      path === ctx + '/home' ||
      path === ctx + '/index.jsp' ||
      path.endsWith('/layout/home.fragment.jsp');

    // ▶ 이미 본 적 있는지 확인
    const shownOnce = sessionStorage.getItem('nvLogoShown') === '1';

    // 홈이 아니거나 이미 한 번 본 적 있으면 즉시 본문만 표시
    if (!isHome || shownOnce) {
      $logoScreen.hide();
      $header.show();
      $main.show();
      $footer.show();
      return;
    }

    // ▶ 처음 방문 시만 실행
    setTimeout(() => {
      $logoScreen.addClass('fade-out');

      // 1초 후 실제 전환
      setTimeout(() => {
        $logoScreen.hide();
        $header.fadeIn(600);
        $main.fadeIn(800);
        $footer.fadeIn(800);

        // ✅ 세션에 '이미 봄' 기록
        sessionStorage.setItem('nvLogoShown', '1');
      }, 1000);
    }, 3200);
  });

})(window.jQuery, window, document);

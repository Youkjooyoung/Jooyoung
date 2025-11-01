/* /javascript/listPurchase.js */
(function (w, d, $) {
  'use strict';
  if (!$) return;

  const S = '#mainArea [data-page="purchase-list"], #appMain [data-page="purchase-list"]';
  const ctx = () => (w.App && App.ctx ? App.ctx() : ($('body').data('ctx') || ''));

  function nav(urlOrPartial) {
    // fragment 주면 Ajax, 아니면 전체 이동
    if (w.__layout && __layout.loadMain && (urlOrPartial.indexOf(' ') > -1 || /\.fragment\.jsp(\?|$)/.test(urlOrPartial))) {
      __layout.loadMain(urlOrPartial);
    } else if (w.App && App.go) {
      App.go(urlOrPartial);
    } else {
      location.href = urlOrPartial.startsWith(ctx()) ? urlOrPartial : (ctx() + urlOrPartial);
    }
  }

  function init() {
    const $view = $(S).first();
    if (!$view.length) return;

    // 행/제목 클릭 → 구매상세
    $(d).off('.lpurch');
    $(d).on('click.lpurch', '[data-tranno], .purchase-link', function (e) {
      e.preventDefault();
      const tranNo = $(this).data('tranno') || $(this).closest('[data-tranno]').data('tranno');
      if (!tranNo) return;

      const full = `${ctx()}/purchase/getPurchase?tranNo=${encodeURIComponent(tranNo)}`;
      const partial = `${full} .container:first`;
      if (w.__layout && __layout.loadMain) __layout.loadMain(partial); else location.href = full;
    });

    // 페이징/정렬/검색 등은 서버 렌더를 그대로 사용한다면 별도 JS 불필요.
    // 필요 시 data-href를 이용하도록 통합:
    $(d).on('click.lpurch', '[data-href]', function (e) {
      e.preventDefault();
      const href = this.getAttribute('data-href');
      if (href) nav(href);
    });
  }

  $(d).on('view:afterload', (_e, payload) => { if (payload && payload.page === 'purchase-list') init(); });
  $(() => { if ($(S).length) init(); });

})(window, document, window.jQuery);

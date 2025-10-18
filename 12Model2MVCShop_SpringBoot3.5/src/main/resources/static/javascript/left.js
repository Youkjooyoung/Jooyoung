// /javascript/left.js
(function (w, d, $) {
  'use strict';
  if (!$) return;

  $(function () {
    // 좌측 메뉴 클릭 → 레이아웃 내 Ajax 네비게이션 사용
    $(d).on('click', '.left-menu [data-nav]', function (e) {
      e.preventDefault();

      const code = this.dataset.nav || $(e.target).closest('[data-nav]').data('nav');

      if (w.__layout && typeof w.__layout.navigate === 'function') {
        w.__layout.navigate(code);
      } else {
        // 기존 fallback 그대로
        const ctx = $('body').data('ctx') || '';
        const map = {
          home:          ctx + '/layout/home.fragment.jsp',
          searchProduct: ctx + '/product/listProduct.fragment.jsp',
          manageProduct: ctx + '/product/listProduct?menu=manage .container:first',
          addProduct:    ctx + '/product/addProductView.jsp .container:first',
          myInfo:        ctx + '/user/getUser.jsp',
          userList:      ctx + '/user/listUser.jsp',
          login:         ctx + '/user/loginView.jsp',
          join:          ctx + '/user/addUserView.jsp',
		  purchaseList:  ctx + '/purchase/listPurchase.jsp',
		  cart:          ctx + '/purchase/cart.jsp',
          recentPopup:   ctx + '/layout/recentProduct.jsp'
        };
        const next = map[code];
        location.href = next || (ctx + '/index.jsp');
      }
    });

    // 키보드 접근성
    $(d).on('keydown', '.left-menu [data-nav]', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) $(this).trigger('click');
    });
  });
})(window, document, window.jQuery);

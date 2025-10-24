// /javascript/left.js
((w, d, $) => {
	'use strict';
	if (!$) return;

	$(() => {
		const ctx = $('body').data('ctx') || '';
		const routes = {
			home: `${ctx}/layout/home.fragment.jsp`,
			searchProduct: `${ctx}/product/listProduct.fragment.jsp .container:first`,
			manageProduct: `${ctx}/product/listManageProduct.jsp .container:first`,
			addProduct: `${ctx}/product/addProductView?embed=1 .container:first`,
			myInfo: `${ctx}/user/myInfo?embed=1 [data-page=user-detail]:first`,
			userList: `${ctx}/user/listUser?embed=1 .container:first`,
			login: `${ctx}/user/loginView.jsp`,
			join: `${ctx}/user/addUserView.jsp?embed=1 .container:first`,
			purchaseList: `${ctx}/purchase/listPurchase?embed=1 .container:first`,
			cart: `${ctx}/purchase/cart.jsp?embed=1 .nv-panel:first`,
			recentPopup: `${ctx}/layout/recentProduct.jsp`
		};

		const go = (code) => {
			const url = routes[code];
			if (!url) return;
			if (w.__layout && typeof w.__layout.loadMain === 'function') w.__layout.loadMain(url);
			else location.href = url.split(' ')[0];
		};

		$(d).on('click', '.left-menu [data-nav]', (e) => {
			e.preventDefault();
			const $t = $(e.target).closest('[data-nav]');
			const code = $t.data('nav');
			go(code);
		});

		$(d).on('keydown', '.left-menu [data-nav]', (e) => {
			if (e.key === 'Enter' || e.keyCode === 13) $(e.currentTarget).trigger('click');
		});
	});
})(window, document, window.jQuery);
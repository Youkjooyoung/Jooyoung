// /javascript/listPurchase.js
(function($, w, d) {
	'use strict';
	if (!$) return;

	const ctx = () => App.ctx();

	// 구매 상세 이동
	$(d).on('click', '.purchase-link', function() {
		const no = $(this).data('tranno');
		if (!no) return;
		App.go(App.ctx() + '/purchase/' + no);
	});

	// 수령 확인
	$(d).on('click', '.btn-confirm', function() {
		const no = $(this).data('tranno');
		const prodNo = $(this).data('prodno');

		if (!no || !prodNo) return;

		if (!confirm('물품을 수령하셨습니까?')) return;

		$.post(`${ctx()}/purchase/${no}/confirm`, { prodNo })
			.done(() => {
				location.reload();
			})
			.fail(() => {
				alert('처리 중 오류가 발생했습니다.');
			});
	});
})(jQuery, window, document);

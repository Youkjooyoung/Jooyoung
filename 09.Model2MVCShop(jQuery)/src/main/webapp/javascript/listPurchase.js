// /javascript/listPurchase.js
(function($, w, d) {
	'use strict'; if (!$) return;

	var ctx = function() { return App.ctx(); };

	// 구매 상세 이동
	$(d).on('click', '.purchase-link', function() {
		var no = $(this).data('tranno'); if (no) w.location.href = ctx() + '/purchase/' + no;
	});

	// 수령 확인
	$(d).on('click', '.btn-confirm', function() {
		var no = $(this).data('tranno'), prodNo = $(this).data('prodno');
		if (!no || !prodNo) return;
		if (!confirm('물품을 수령하셨습니까?')) return;
		$.post(ctx() + '/purchase/' + no + '/confirm', { prodNo: prodNo })
			.done(function() { location.reload(); })
			.fail(function() { alert('처리 중 오류가 발생했습니다.'); });
	});
})(jQuery, window, document);

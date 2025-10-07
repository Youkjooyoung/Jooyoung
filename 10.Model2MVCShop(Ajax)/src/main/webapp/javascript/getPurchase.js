// /javascript/getPurchase.js
(function($, w, d) {
	'use strict'; if (!$) return;

	var ctx = function() { return App.ctx(); };

	// 수정 화면
	$(d).on('click', '#btnEdit', function(e) {
		e.preventDefault();
		var tranNo = $(this).data('tranno');
		if (tranNo) w.location.href = ctx() + '/purchase/' + tranNo + '/edit';
	});

	// 구매 취소
	$(d).on('click', '#btnCancel', function(e) {
		e.preventDefault();
		var tranNo = $(this).data('tranno');
		if (!tranNo) return;
		if (!confirm('정말로 구매를 취소하시겠습니까?')) return;
		App.post('/purchase/' + tranNo + '/cancel');
	});

	// 수령 확인
	$(d).on('click', '#btnConfirm', function(e) {
		e.preventDefault();
		var tranNo = $(this).data('tranno'), prodNo = $(this).data('prodno');
		if (!tranNo || !prodNo) return;
		App.post('/purchase/' + tranNo + '/confirm', { prodNo: prodNo });
	});
})(jQuery, window, document);

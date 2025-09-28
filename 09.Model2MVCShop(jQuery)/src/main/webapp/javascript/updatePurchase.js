// /javascript/updatePurchase.js
(function(w, d, $) {
	'use strict'; if (!$) return;

	$(function() {
		// 저장
		$(d).on('click', '#btnUpdate', function(e) {
			e.preventDefault();

			var $f = $('form[name="purchaseForm"]');
			var tranNo = $.trim($f.find('[name="tranNo"]').val());
			if (!tranNo) { alert('거래번호가 없습니다.'); return; }

			// 규칙: form에는 method/action 없음 ⇒ JS에서만 지정
			var form = $f[0];
			form.action = App.ctx() + '/purchase/update';
			form.method = 'post';

			// 날짜/숫자 형식 보정(필요 시)
			var $divyDate = $f.find('[name="divyDate"]');
			if ($.trim($divyDate.val())) {
				$divyDate.val($.trim($divyDate.val())); // 서버가 'YYYY-MM-DD' 받도록 유지
			}

			form.submit();
		});

		// 취소
		$(d).on('click', '#btnCancel', function(e) {
			e.preventDefault();
			var tranNo = $('form[name="purchaseForm"]').find('[name="tranNo"]').val();
			if (tranNo) w.location.href = App.ctx() + '/purchase/' + encodeURIComponent(tranNo);
			else history.back();
		});
	});
})(window, document, window.jQuery);

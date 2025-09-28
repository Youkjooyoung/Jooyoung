// /javascript/addPurchase.js
(function($, w, d) {
	'use strict'; if (!$) return;

	$(function() {
		var ctx = App.ctx();

		$('#btnSubmit').on('click', function(e) {
			e.preventDefault();
			// form 태그에는 method/action 없음(규칙) — JS에서만 지정
			var form = d.purchaseForm;
			form.action = ctx + '/purchase/add';
			form.method = 'post';
			form.submit();
		});

		$('#btnCancel').on('click', function(e) {
			e.preventDefault();
			App.go('/product/listProduct');
		});
	});
})(jQuery, window, document);

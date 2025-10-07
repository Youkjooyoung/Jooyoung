// /javascript/getProduct.js
(function(w, d, $) {
	'use strict'; if (!$) { return; }

	function getNo(el) { return el.dataset ? el.dataset.prodno : $(el).data('prodno'); }

	// 구매하기
	$(d).on('click', '.btn-purchase', function(e) {
		e.preventDefault();
		var no = getNo(this); if (!no) return;
		App.go('/purchase/add', { prodNo: no });
	});

	// 수정(관리)
	$(d).on('click', '.btn-edit', function(e) {
		e.preventDefault();
		var no = getNo(this); if (!no) return;
		App.go('/product/updateProduct', { prodNo: no });
	});

	// 삭제(관리)
	$(d).on('click', '.btn-delete', function(e) {
		e.preventDefault();
		var $btn = $(this), no = getNo(this); if (!no) return;
		if (!confirm('정말 삭제하시겠습니까?')) return;
		App.lock($btn, function() { App.post('/product/deleteProduct', { prodNo: no }); });
	});
})(window, document, window.jQuery);

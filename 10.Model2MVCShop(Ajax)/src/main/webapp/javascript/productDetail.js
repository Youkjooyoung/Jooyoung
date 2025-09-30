// /javascript/productDetail.js
(function($, d) {
	'use strict'; if (!$) return;

	$(d).on('submit', '.delete-form', function(e) {
		if (!confirm('정말 이 상품을 삭제하시겠습니까?')) e.preventDefault();
	});
})(jQuery, document);

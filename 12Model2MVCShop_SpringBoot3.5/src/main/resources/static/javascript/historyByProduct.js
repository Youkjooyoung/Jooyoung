// /javascript/cancelReason.js
((w, $) => {
	'use strict';
	if (!$) return;

	$(() => {
		$('.cancel-reason').each((_, el) => {
			const $el = $(el);
			const tranNo = $el.data('tranno');
			const reason = localStorage.getItem(`cancelReason:${tranNo}`);
			$el.text(reason && $.trim(reason) ? reason : '-');
		});
	});

	$(d).on('click', '.btn-close', (e) => {
		e.preventDefault();
		w.close();
	});
})(window, window.jQuery);

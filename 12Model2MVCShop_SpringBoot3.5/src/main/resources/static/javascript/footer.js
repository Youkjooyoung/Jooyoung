// /javascript/footer.js
(function(w, d, $) {
	'use strict';
	if (!$) return;

	const ctx = () => $('body').data('ctx') || '';

	// footer 링크 클릭/Enter → __layout.navigate(code)
	$(d).on('click', '[data-footer-nav]', function(e) {
		e.preventDefault();
		const code = this.getAttribute('data-footer-nav');
		if (!code) return;

		if (w.__layout && typeof w.__layout.navigate === 'function') {
			w.__layout.navigate(code);
		} else {
			// 레이아웃이 아직 준비 전인 극초기 진입 대비(희귀)
			const fallback = {
				faq: ctx() + '/support/faq.jsp',
				notice: ctx() + '/support/notice.jsp',
				policy: ctx() + '/support/policy.jsp',
				privacy: ctx() + '/support/privacy.jsp'
			}[code];
			if (fallback) w.location.href = fallback;
		}
	});

	// 접근성: Enter 키 지원
	$(d).on('keydown', '[data-footer-nav]', function(e) {
		if (e.key === 'Enter' || e.keyCode === 13) $(this).trigger('click');
	});
})(window, document, window.jQuery);

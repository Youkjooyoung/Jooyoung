((w, d, $) => {
	'use strict'; if (!$) return;
	const goPage = ($it) => {
		const code = $it.data('nav');
		const href = $it.data('href');
		if (w.__layout?.go && code) {
			w.__layout.go(code);
			return;
		}
		if (href) w.location.href = href;
	};
	$(() => {
		const sel = '.left-menu [data-nav]';
		$(d).on('click', sel, (e) => {
			e.preventDefault();
			goPage($(e.currentTarget)
			);
		}
		);
		$(d).on('keydown', sel,
			(e) => {
				if (e.key === 'Enter' || e.keyCode === 13) {
					e.preventDefault();
					goPage($(e.currentTarget));
				}
			}
		);
	}
	);
})(window, document, window.jQuery);
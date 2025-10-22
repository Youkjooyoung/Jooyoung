(($, w, d) => {
	'use strict';
	if (!$) return;
	const ctx = () => $('body').data('ctx') || '';

	const goEdit = () => {
		const $w = $('.profile-wrap[data-page="user-detail"]').first();
		if (!$w.length) return;
		const userId = $w.data('userId');
		if (!userId) return;
		const pretty = `${ctx()}/user/updateUser?userId=${encodeURIComponent(userId)}`;
		const partial = `${pretty}&embed=1 [data-page=user-update]:first`;
		if (w.__layout?.loadMain) {
			w.__layout.loadMain(partial);
			if (history?.pushState) history.pushState({ pretty, partial }, '', pretty);
		} else {
			w.location.href = pretty;
		}
	};

	const goBack = () => {
		if (history.length > 1) { history.back(); return; }
		const pretty = `${ctx()}/index.jsp`;
		w.location.href = pretty;
	};

	const markCopied = ($el) => { $el.addClass('copied'); setTimeout(() => $el.removeClass('copied'), 1200); };
	const copyFallback = (text, $el) => { const ta = d.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; d.body.appendChild(ta); ta.focus(); ta.select(); try { d.execCommand('copy'); } catch (e) { } d.body.removeChild(ta); markCopied($el); };
	const copyText = (text, $el) => { if (!text) return; if (w.isSecureContext && navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => markCopied($el)).catch(() => copyFallback(text, $el)); else copyFallback(text, $el); };

	$(() => {
		$(d).on('click', '[data-role="edit"]', (e) => { e.preventDefault(); goEdit(); });
		$(d).on('click', '[data-role="back"]', (e) => { e.preventDefault(); goBack(); });
		$(d).on('click', '.copyable', function() { const $t = $(this); const text = $t.attr('data-copy') || $t.text().trim(); copyText(text, $t); });
	});
})(window.jQuery, window, document);

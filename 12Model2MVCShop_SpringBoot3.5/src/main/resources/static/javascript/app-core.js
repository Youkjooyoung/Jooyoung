/* /javascript/app-core.js */
(function(w, d, $) {
	'use strict';
	if (!$) return;

	// ------------------------------
	// 1. 기본 유틸
	// ------------------------------
	function ctx() {
		return $('body').data('ctx') || $('base').attr('href') || '';
	}
	function qs(p) {
		return $.param(p || {});
	}
	function go(path, p) {
		w.location.href =
			ctx() + path + (p && Object.keys(p).length ? '?' + qs(p) : '');
	}
	function post(path, p) {
		const $f = $('<form>').css('display', 'none');
		$f.attr({ action: ctx() + path, method: 'post' });
		$.each(p || {}, function(k, v) {
			$('<input type="hidden">').attr({ name: k, value: v }).appendTo($f);
		});
		$(d.body).append($f);
		$f.trigger('submit');
	}
	function ajaxPost(url, data) {
		return $.ajax({ url: ctx() + url, type: 'POST', data: data || {} });
	}
	function popup(url, name, feat) {
		const u = /^https?:\/\//i.test(url) ? url : ctx() + url;
		let wn;
		try {
			wn = w.open(
				u,
				name || '_blank',
				feat || 'width=900,height=650,scrollbars=yes,resizable=yes'
			);
		} catch (e) { }
		if (!wn || wn.closed || typeof wn.closed === 'undefined') {
			w.location.assign(u);
		} else {
			try {
				wn.focus();
			} catch (_) { }
		}
		return wn;
	}
	function digits(s) {
		return (s || '').replace(/\D/g, '');
	}
	function lock($btn, fn) {
		if ($btn.prop('disabled')) return;
		$btn.prop('disabled', true);
		try {
			fn && fn();
		} finally {
			setTimeout(function() {
				$btn.prop('disabled', false);
			}, 300);
		}
	}
	function esc(s) {
		return (s == null ? '' : String(s)).replace(/[&<>"']/g, function(m) {
			return {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
			}[m];
		});
	}
	function fmtPrice(n) {
		const x = typeof n === 'number' ? n : parseInt(n, 10);
		if (isNaN(x)) return '0';
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	function fmtDate(s) {
		if (!s) return '';
		const m = String(s).match(/^(\d{4})[-/]?(\d{2})[-/]?(\d{2})/);
		if (m) return m[1] + '-' + m[2] + '-' + m[3];
		try {
			const d2 = new Date(s);
			if (!isNaN(d2.getTime())) {
				const y = d2.getFullYear();
				const mo = ('0' + (d2.getMonth() + 1)).slice(-2);
				const da = ('0' + d2.getDate()).slice(-2);
				return y + '-' + mo + '-' + da;
			}
		} catch (_) { }
		return s;
	}
	function noimg(e) {
		if (!e || !e.target) return;
		const img = e.target;
		img.onerror = null;
		const fallback = ctx() + '/images/noimg.png';
		const svg =
			'data:image/svg+xml;utf8,' +
			encodeURIComponent(
				'<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#adb5bd">no image</text></svg>'
			);
		img.src = fallback;
		setTimeout(function() {
			if (!img.complete || !img.naturalWidth) img.src = svg;
		}, 0);
	}
	function debounce(fn, wait) {
		let t;
		return function() {
			const c = this,
				a = arguments;
			clearTimeout(t);
			t = setTimeout(function() {
				fn.apply(c, a);
			}, wait || 250);
		};
	}

	// ------------------------------
	// 2. 기존 App 객체 등록
	// ------------------------------
	w.App = {
		ctx: ctx,
		qs: qs,
		go: go,
		post: post,
		ajaxPost: ajaxPost,
		popup: popup,
		digits: digits,
		lock: lock,
		esc: esc,
		fmtPrice: fmtPrice,
		fmtDate: fmtDate,
		noimg: noimg,
		debounce: debounce,
	};
})(window, document, window.jQuery);

// ------------------------------
// 3. 추가/보강 (Ajax 대응 App.go + data-href)
// ------------------------------
window.App = window.App || {};
(function(w, d, $) {
	'use strict';

	const ctx = () => $('body').data('ctx') || '';
	App.ctx = ctx;

	// Ajax 전용 이동(프래그먼트이면 Ajax, 아니면 전체 리로드)
	App.go = (url, { push = true } = {}) => {
		if (!url) return;
		const canAjax = /\.fragment\.jsp(\?|$)/.test(url);
		if (canAjax && w.__layout && typeof w.__layout.loadMain === 'function') {
			// Ajax fragment 로드
			w.__layout.loadMain(url);
			if (push && w.history && w.history.pushState) {
				w.history.pushState({ url }, '', url);
			}
		} else {
			// 일반 이동
			w.location.href = ctx() + url;
		}
	};

	// data-href 통합 클릭 핸들러 (앵커 태그 미사용 정책 대응)
	$(d).on('click', '[data-href]', function(e) {
		e.preventDefault();
		const href = this.getAttribute('data-href');
		if (!href) return;
		App.go(href);
	});
})(window, document, window.jQuery);

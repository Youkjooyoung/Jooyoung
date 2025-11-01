// /javascript/recentProduct.js
(($, w, d) => {
	'use strict';
	if (!$) return;

	const CTX = $('body').data('ctx') || '';
	const BASE_PATHS = ['/upload/uploadFiles/', '/upload/'];  // 서버 실제 경로 우선순위
	const NOIMG = `${CTX}/images/noimage.gif`;

	let $box = $('#preview-box');
	let $img = $('#preview-img');

	// ===== preview-box 동적 생성 =====
	if (!$box.length) {
		$box = $('<div/>', { id: 'preview-box', 'aria-hidden': 'true' }).appendTo('body');
		$img = $('<img/>', { id: 'preview-img', alt: '상품 이미지 미리보기' }).appendTo($box);
	}

	// ===== 스타일 (Fallback 용) =====
	$box.css({
		position: 'absolute',
		display: 'none',
		zIndex: 99999,
		background: '#fff',
		border: '1px solid #ddd',
		padding: 4,
		boxShadow: '0 2px 6px rgba(0,0,0,.15)',
		borderRadius: 4
	});

	$img.css({
		maxWidth: 220,
		maxHeight: 220,
		display: 'block'
	});

	// ===== 유틸: 경로 인코딩 =====
	const encPath = (p = '') => p.replace(/[^/]+/g, s => encodeURIComponent(s));

	// ===== 파일명 → URL 후보 리스트 =====
	const urls = (name = '') => {
		if (!name) return [];
		if (/^https?:\/\//i.test(name)) return [name];
		if (name.startsWith('/')) return [`${CTX}${encPath(name.replace(/^\//, ''))}`];
		const encoded = encPath(name);
		return BASE_PATHS.map(base => `${CTX}${base}${encoded}`);
	};

	// ===== 이미지 표시 =====
	const show = (name, e) => {
		const list = urls(name);
		let idx = 0;

		const showBox = () => {
			$box.show().css({ left: e.pageX + 14, top: e.pageY + 14 });
		};

		const tryNext = () => {
			$img.off()
				.one('error', () => {
					idx++;
					if (idx < list.length) {
						tryNext();
					} else {
						$img.attr('src', NOIMG);
						showBox();
					}
				})
				.one('load', showBox)
				.attr('src', list[idx] || NOIMG);
		};
		tryNext();
	};

	// ===== 이벤트 바인딩 =====
	$(d)
		.on('mouseenter', '.recent-item', (e) => {
			const $el = $(e.currentTarget);
			show($el.data('filename'), e);
		})
		.on('mousemove', '.recent-item', (e) => {
			$box.css({ left: e.pageX + 14, top: e.pageY + 14 });
		})
		.on('mouseleave', '.recent-item', () => {
			$box.hide();
		})
		.on('click', '.recent-item', (e) => {
			const prodNo = $(e.currentTarget).data('prodno');
			if (!prodNo) return;
			if (w.App?.go) {
				w.App.go('/product/getProduct', { prodNo });
			} else {
				location.href = `${CTX}/product/getProduct?${$.param({ prodNo })}`;
			}
		})
		.on('keydown', '.recent-item', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				$(e.currentTarget).trigger('click');
			}
		});

	// ===== 네임스페이스화 (App.recent) =====
	w.App = w.App || {};
	w.App.recent = {
		showPreview: (fileName, e) => show(fileName, e),
		hidePreview: () => $box.hide()
	};

})(jQuery, window, document);

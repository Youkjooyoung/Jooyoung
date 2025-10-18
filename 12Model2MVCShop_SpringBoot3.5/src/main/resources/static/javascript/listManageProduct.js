// /javascript/listManageProduct.js (교체)
(($, w, d) => {
	'use strict';
	if (!$) return;

	const S = '#mainArea [data-page="product-manage"]';
	const ctx = () => $('body').data('ctx') || '';

	const useLoad = (url) => {
		if (w.__layout?.loadMain) {
			w.__layout.loadMain(url);
		} else {
			// 완전 새로고침(폴백)
			location.href = url.replace(' .container:first', '');
		}
	};

	// 화면이 로드될 때마다 한 번만(네임스페이스 .pm)
	const bindOnce = () => {
		$(d).off('.pm');

		// 검색
		$(d).on('click.pm', `${S} #btnSearch`, () => {
			const cond = $(`${S} #searchCondition`).val() || '0';
			const kw = $(`${S} #searchKeyword`).val() || '';
			useLoad(`${ctx()}/product/listProduct?menu=manage&searchCondition=${encodeURIComponent(cond)}&searchKeyword=${encodeURIComponent(kw)} .container:first`);
		});

		// 자동완성 + 엔터검색
		$(d).on('keyup.pm', `${S} #searchKeyword`, (e) => {
			const $list = $(`${S} #acList`);
			const cond = $(`${S} #searchCondition`).val();
			const kw = $(e.currentTarget).val();

			if (e.key === 'Enter') { $(`${S} #btnSearch`).trigger('click'); return; }

			if (!kw || kw.length < 2) { $list.empty().hide(); return; }

			$.getJSON(`${ctx()}/api/products/suggest`, { type: cond, keyword: kw })
				.done(res => {
					$list.empty();
					if (res?.items?.length) {
						res.items.forEach(t => $('<div class="ac-item"/>').text(t).appendTo($list));
						$list.show();
					} else {
						$list.hide();
					}
				})
				.fail(() => $list.hide());
		});

		$(d).on('click.pm', `${S} #acList .ac-item`, (e) => {
			$(`${S} #searchKeyword`).val($(e.currentTarget).text());
			$(`${S} #acList`).empty().hide();
			$(`${S} #btnSearch`).trigger('click');
		});

		// 정렬
		$(d).on('click.pm', `${S} .sort-btn`, (e) => {
			const sort = $(e.currentTarget).data('sort') || '';
			const cond = $(`${S} #searchCondition`).val() || '0';
			const kw = $(`${S} #searchKeyword`).val() || '';
			useLoad(`${ctx()}/product/listProduct?menu=manage&searchCondition=${encodeURIComponent(cond)}&searchKeyword=${encodeURIComponent(kw)}&sort=${encodeURIComponent(sort)} .container:first`);
		});

		// ✅ 상세보기(프래그먼트로 로드)
		$(d).on('click.pm', `${S} .btn-detail`, (e) => {
			const no = $(e.currentTarget).data('prodno');
			if (!no) return;
			useLoad(`${ctx()}/product/getProduct?prodNo=${encodeURIComponent(no)} .container:first`);
		});

		// 주문내역 모달(필요 시 동일 패턴으로 유지)
		$(d).on('click.pm', `${S} .btn-order-history`, (e) => {
			const no = $(e.currentTarget).data('prodno');
			if (!no) return;
			const $modal = $(`${S} #historyModal`);
			const $iframe = $modal.find('iframe');
			$iframe.attr('src', `${ctx()}/purchase/product/${encodeURIComponent(no)}/history?t=${Date.now()}`);
			$modal.removeClass('hidden').show();
			$('body').addClass('no-scroll');
		});
		$(d).on('click.pm', `${S} .dlg-close`, () => {
			const $modal = $(`${S} #historyModal`);
			$modal.find('iframe').attr('src', 'about:blank');
			$modal.addClass('hidden').hide();
			$('body').removeClass('no-scroll');
		});
		$(d).on('keydown.pm', (e) => { if (e.key === 'Escape') $(`${S} .dlg-close`).click(); });
	};

	// 처음/이후 모두 동작
	$(d).on('view:afterload', (_e, p) => { if (p?.page === 'product-manage') bindOnce(); });
	$(() => { if ($(S).length) bindOnce(); });
})(jQuery, window, document);

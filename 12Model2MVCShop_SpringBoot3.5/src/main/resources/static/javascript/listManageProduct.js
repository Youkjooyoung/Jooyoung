// /javascript/listManageProduct.js
(($, w, d) => {
	'use strict';
	if (!$) return;

	/** ───────────────── 공통 유틸 ───────────────── */
	// 페이지 섹션(한 개만) : 부모 id(#mainArea/#appMain) 유무와 무관하게 잡음
	const ROOT_SEL = '[data-page="product-manage"]';
	const getRoot = () => $(ROOT_SEL).first();

	// 컨텍스트 경로 : body → 섹션 data-ctx → 전역 상수 순서로 폴백
	const ctx = () =>
		$('body').data('ctx') ||
		getRoot().data('ctx') ||
		(w.APP_CTX || '');

	// 주문내역 모달 로딩 상태
	let historyLoading = false;

	/** ───────────────── 모달 열고/닫기 ───────────────── */
	const closeModal = () => {
		const $root = getRoot();
		if (!$root.length) return;
		const $modal = $root.find('#historyModal');
		const $iframe = $modal.find('iframe');
		$iframe.off('load.pm').removeAttr('src');
		$modal.addClass('hidden').hide().attr('aria-hidden', 'true');
		$('body').removeClass('no-scroll');
		historyLoading = false;
	};

	/** ───────────────── 레이아웃 로더 ───────────────── */
	const useLoad = (url) => {
		// 화면 전환 때 모달은 항상 정리
		closeModal();
		if (w.__layout?.loadMain) {
			w.__layout.loadMain(url);                          // 프래그먼트 로드
		} else {
			location.href = url.replace(' .container:first', ''); // 폴백 : 풀 리다이렉트
		}
	};

	/** ───────────────── 검색/페이지 이동 ───────────────── */
	const buildQuery = (extra = {}) => {
		const $root = getRoot();
		const condSel = String($root.find('#searchCondition').val() || '0');
		const cond = ['0', 'prodName', 'prodDetail'].includes(condSel) ? condSel : '0';
		const kw = String($root.find('#searchKeyword').val() || '').trim();
		return {
			menu: 'manage',
			searchCondition: cond,
			searchKeyword: kw,
			...extra
		};
	};

	const toQS = (obj) =>
		Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');

	const doSearch = () => {
		const qs = toQS(buildQuery());
		const url = `${ctx()}/product/listProduct?${qs} .container:first`;
		useLoad(url);
	};

	const goPage = (page) => {
		const qs = toQS(buildQuery({ currentPage: String(page || 1) }));
		const url = `${ctx()}/product/listProduct?${qs} .container:first`;
		useLoad(url);
	};

	// pageNavigator.jsp가 호출하는 전역 함수 (필수)
	w.fncGetUserList = (p) => { goPage(p); };

	// a[href="javascript:fncGetUserList('n')"] 클릭도 안전하게 가로채기
	const interceptPagination = () => {
		$(d).off('click.lpm-pg').on(
			'click.lpm-pg',
			`${ROOT_SEL} .pagination a, ${ROOT_SEL} .pager a`,
			function(e) {
				const href = $(this).attr('href') || '';
				const m = href.match(/fncGetUserList\(['"]?(\d+)['"]?\)/);
				if (m) { e.preventDefault(); goPage(m[1]); }
			}
		);
	};

	/** ───────────────── 자동완성 ───────────────── */
	const bindAutocomplete = () => {
		const $root = getRoot();
		if (!$root.length) return;

		const $kw = $root.find('#searchKeyword');
		const $list = $root.find('#acList');

		const debounce = w.App?.debounce || ((fn, t = 150) => {
			let to; return (...a) => { clearTimeout(to); to = setTimeout(() => fn(...a), t); };
		});

		const requestAC = debounce(() => {
			const cond = String($root.find('#searchCondition').val() || 'prodName');
			const kw = String($kw.val() || '').trim();
			if (kw.length < 2) { $list.empty().hide(); return; }

			$.getJSON(`${ctx()}/api/products/suggest`, { type: cond, keyword: kw })
				.done((res) => {
					const items = res?.items || [];
					if (!items.length) { $list.empty().hide(); return; }
					const esc = (w.App?.esc) || ((t) => String(t).replace(/[<>&"]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[s])));
					$list.html(items.map(t => `<div class="ac-item">${esc(t)}</div>`).join(''))
						.show().width($kw.outerWidth());
				})
				.fail(() => $list.empty().hide());
		}, 120);

		$root.off('.ac')
			.on('input.ac focus.ac', '#searchKeyword', requestAC)
			.on('blur.ac', '#searchKeyword', () => setTimeout(() => $list.hide(), 150))
			.on('mousedown.ac', '#acList .ac-item', function() {
				$kw.val($(this).text());
				$list.empty().hide();
				doSearch();
			});
	};

	/** ───────────────── 주문내역 모달 ───────────────── */
	const looksLikeError = (doc) => {
		try {
			const text = doc?.body?.textContent || '';
			return /default Exception page|No static resource|\/common\/error\.jsp/i.test(text);
		} catch { return false; }
	};

	const openHistory = (prodNo) => {
		if (!prodNo || historyLoading) return;
		const $root = getRoot();
		if (!$root.length) return;
		const $modal = $root.find('#historyModal');
		const $iframe = $modal.find('iframe');

		const base = ctx();
		const candidates = [
			`${base}/purchase/listPurchase?${toQS({ menu: 'manage', currentPage: 1, searchCondition: 'prodNo', searchKeyword: prodNo })}`,
			`${base}/purchase/listPurchase?${toQS({ menu: 'manage', currentPage: 1, prodNo })}`,
			`${base}/purchase/listPurchaseByProduct?${toQS({ currentPage: 1, prodNo })}`,
			`${base}/purchase/list?${toQS({ currentPage: 1, prodNo })}`,
			`${base}/purchase/orderHistory?${toQS({ currentPage: 1, prodNo })}`,
			`${base}/purchase/product/${encodeURIComponent(prodNo)}/history?${toQS({ currentPage: 1 })}`
		];

		const tryLoad = (i) => {
			if (i >= candidates.length) {
				historyLoading = false;
				const fb = `${base}/purchase/listPurchase?menu=manage&currentPage=1&searchCondition=prodNo&searchKeyword=${encodeURIComponent(prodNo)}`;
				(w.App?.popup ? w.App.popup(fb) : window.open(fb, '_blank'));
				return;
			}
			historyLoading = true;

			const url = candidates[i] + (candidates[i].includes('?') ? '&' : '?') + 't=' + Date.now();

			$iframe.off('load.pm').on('load.pm', () => {
				const doc = $iframe[0].contentDocument || $iframe[0].contentWindow?.document || null;
				if (looksLikeError(doc)) {
					tryLoad(i + 1);                   // 다음 후보로 폴백
				} else {
					historyLoading = false;           // 성공
					$modal.removeClass('hidden').show().attr('aria-hidden', 'false');
					$('body').addClass('no-scroll');
				}
			});

			$iframe.attr('src', url);
		};

		tryLoad(0);
	};

	/** ───────────────── 이벤트 바인딩 ───────────────── */
	const bindOnce = () => {
		$(d).off('.lpm');

		// 검색
		$(d).on('click.lpm', `${ROOT_SEL} #btnSearch`, (e) => { e.preventDefault(); doSearch(); });
		$(d).on('keydown.lpm', `${ROOT_SEL} #searchKeyword`, (e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });

		// 정렬
		$(d).on('click.lpm', `${ROOT_SEL} .sort-btn`, (e) => {
			e.preventDefault();
			const { searchCondition, searchKeyword } = buildQuery();
			const sort = String($(e.currentTarget).data('sort') || '');
			const url = `${ctx()}/product/listProduct?${toQS({ menu: 'manage', searchCondition, searchKeyword, sort })} .container:first`;
			useLoad(url);
		});

		// 상세
		$(d).on('click.lpm', `${ROOT_SEL} .btn-detail`, (e) => {
			e.preventDefault();
			const no = $(e.currentTarget).data('prodno');
			if (!no) return;
			useLoad(`${ctx()}/product/getProduct?prodNo=${encodeURIComponent(no)} .container:first`);
		});

		// 주문내역
		$(d).on('click.lpm', `${ROOT_SEL} .btn-order-history`, (e) => {
			e.preventDefault();
			const $btn = $(e.currentTarget);
			if ($btn.prop('disabled') || historyLoading) return;
			$btn.prop('disabled', true);
			setTimeout(() => $btn.prop('disabled', false), 600);
			const no = $btn.data('prodno');
			if (!no) return;
			openHistory(no);
		});

		// 모달 닫기(버튼/배경/Esc)
		$(d).on('click.lpm', `${ROOT_SEL} .dlg-close`, (e) => { e.preventDefault(); closeModal(); });
		$(d).on('mousedown.lpm', `${ROOT_SEL} #historyModal`, (e) => { if (!$(e.target).closest('.dlg').length) closeModal(); });
		$(d).on('keydown.lpm', (e) => { if (e.key === 'Escape') closeModal(); });

		// 자동완성/페이지네비
		bindAutocomplete();
		interceptPagination();
	};

	// 레이아웃이 SPA 로더를 쓸 때
	$(d).on('view:afterload.lpm', (_e, p) => { if (p?.page === 'product-manage') bindOnce(); });
	// 일반 페이지 로드
	$(() => { if (getRoot().length) bindOnce(); });

})(jQuery, window, document);

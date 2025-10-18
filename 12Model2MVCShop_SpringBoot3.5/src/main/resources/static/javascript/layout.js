// /javascript/layout.js
(function(w, d, $) {
	'use strict';
	if (!$) return;

	// --- 공용 스크립트 로더 (중복 로딩 방지) ---
	const loadScriptOnce = (src, key) => {
		const k = key || src;
		if (d.querySelector(`script[data-js-key="${k}"]`)) return $.Deferred().resolve().promise();
		const df = $.Deferred();
		const s = d.createElement('script');
		s.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'v=' + Date.now();
		s.defer = true;
		s.setAttribute('data-js-key', k);
		s.onload = () => df.resolve();
		s.onerror = () => df.reject();
		d.head.appendChild(s);
		return df.promise();
	};

	// --- 라우트(프래그먼트는 *.fragment.jsp 권장) ---
	const buildRoutes = (ctx) => ({
		home: () => ({ pretty: ctx + '/home', partial: ctx + '/layout/home.fragment.jsp' }),
		// 상품
		searchProduct: () => ({ pretty: ctx + '/product/listProduct', partial: ctx + '/product/listProduct.fragment.jsp' }),
		manageProduct: () => ({ pretty: ctx + '/product/listProduct?menu=manage', partial: ctx + '/product/listProduct?menu=manage .container:first' }),
		addProduct: () => ({ pretty: ctx + '/product/addProduct', partial: ctx + '/product/addProductView.jsp .container:first' }),
		editProduct: (no) => ({
			pretty: ctx + `/product/updateProduct?prodNo=${encodeURIComponent(no)}`,
			partial: ctx + `/product/updateProduct?prodNo=${encodeURIComponent(no)} .container:first`
		}),
		// 사용자
		myInfo: () => ({ pretty: ctx + '/user/me', partial: ctx + '/user/getUser.jsp' }),
		userList: () => ({ pretty: ctx + '/user/list', partial: ctx + '/user/listUser.jsp' }),
		login: () => ({ pretty: ctx + '/login', partial: ctx + '/user/loginView.jsp' }),
		join: () => ({ pretty: ctx + '/join', partial: ctx + '/user/addUserView.jsp' }),
		// 구매/카트
		purchaseList: () => ({ pretty: ctx + '/purchase/list', partial: ctx + '/purchase/listPurchase.jsp .container:first' }),
		cart: () => ({ pretty: ctx + '/cart', partial: ctx + '/purchase/cart.jsp .container:first' }),
		// 팝업/고객센터
		recentPopup: () => ({ pretty: ctx + '/recent', partial: ctx + '/layout/recentProduct.jsp' }),
		faq: () => ({ pretty: ctx + '/support/faq', partial: ctx + '/support/faq.jsp .container:first' }),
		notice: () => ({ pretty: ctx + '/support/notice', partial: ctx + '/support/notice.jsp .container:first' }),
		policy: () => ({ pretty: ctx + '/support/policy', partial: ctx + '/support/policy.jsp .container:first' }),
		privacy: () => ({ pretty: ctx + '/support/privacy', partial: ctx + '/support/privacy.jsp .container:first' }),
	});

	// --- 페이지별 전용 JS 매핑 ---
	const buildPageJs = (ctx) => ({
		'home': [],
		'product-search': [ctx + '/javascript/listProduct.js'],
		'product-manage': [ctx + '/javascript/listManageProduct.js'],
		'product-add': [ctx + '/javascript/addProduct.js'],
		'product-detail': [ctx + '/javascript/getProduct.js'],
		'product-update': [
			'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js',
			'https://cdn.jsdelivr.net/npm/flatpickr',
			'https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/ko.js',
			ctx + '/javascript/updateProduct.js'
		],
		'purchase-add': [ctx + '/javascript/addPurchase.js'],
		'purchase-list': [ctx + '/javascript/listPurchase.js', ctx + '/javascript/cancel-order.js'],
		'cart': [ctx + '/javascript/cart.js'],
		'user-myinfo': [],
		'user-list': []
	});

	const buildPageUrlJs = (ctx) => ({
		'/purchase/listPurchase.jsp': [
			ctx + '/javascript/app-core.js',
			ctx + '/javascript/listPurchase.js',
			ctx + '/javascript/cancel-order.js'
		],
		'/purchase/cart.jsp': [
			ctx + '/javascript/app-core.js',
			ctx + '/javascript/cart.js'
		]
	});

	// --- 메인 영역 로더 ---
	const loadMain = (url) => {
		const $main = $('#mainArea, #appMain');
		if (!$main.length || !url) return;

		const rawUrl = String(url).split(' ')[0];

		$main.attr('data-loading', '1').addClass('loading');
		$main.load(url, function(_res, status, xhr) {
			$main.removeAttr('data-loading').removeClass('loading');
			if (status === 'error') {
				if (xhr && (xhr.status === 401 || xhr.status === 403)) {
					location.href = (CTX || '') + '/user/loginView.jsp';
					return;
				}
				$main.html('<div class="error-box">⚠ 컨텐츠를 불러오지 못했습니다.</div>');
				return;
			}
			const $page = $main.find('[data-page]').first();
			const pageKey = ($page.attr('data-page') || '').trim();

			let list = (PAGE_JS[pageKey] || []).slice();
			if (!list.length) {

				const urlJs = PAGE_URL_JS || {};
				const hit = Object.keys(urlJs).find(k => rawUrl.indexOf(k) > -1);
				if (hit) list = urlJs[hit];
			}
			let chain = $.Deferred().resolve().promise();
			list.forEach((src) => { chain = chain.then(() => loadScriptOnce(src, src)); });

			chain.always(() => {
				$main.scrollTop(0);
				$(d).trigger('view:afterload', { page: pageKey, $main });
			});
		});
	};

	// --- 코드/URL 모두 지원하는 go ---
	const go = (codeOrUrl) => {
		const r = ROUTE[codeOrUrl];
		const meta = (typeof r === 'function') ? r() : null;
		// 코드 네비게이션인 경우
		if (meta && meta.partial && meta.pretty) {
			loadMain(meta.partial);
			if (w.history && w.history.pushState) {
				w.history.pushState({ pretty: meta.pretty, partial: meta.partial }, '', meta.pretty);
			}
			return;
		}
		// URL 직접 전달 시에는 기존 로직 유지
		const url = String(codeOrUrl);
		const isPartial = /\.fragment\.jsp(\?|$)/.test(url) || url.indexOf(' ') > -1;
		if (isPartial) {
			loadMain(url);
			if (w.history && w.history.pushState) {
				const pretty = url.replace(/\.fragment\.jsp(\?|$)/, '$1').split(' ')[0]; // /foo/bar.fragment.jsp → /foo/bar
				w.history.pushState({ pretty, partial: url }, '', pretty);
			}
		} else {
			w.location.href = url;
		}
	};

	// --- popstate: 뒤/앞으로 지원 ---
	const onPopState = (e) => {
		const st = e.state;
		if (st && st.partial) {
			loadMain(st.partial);
		} else {
			const p = location.pathname + location.search;
			const PRETTY_TO_PARTIAL = {};
			PRETTY_TO_PARTIAL[ROUTE.searchProduct().pretty] = ROUTE.searchProduct().partial;
			PRETTY_TO_PARTIAL[ROUTE.manageProduct().pretty] = ROUTE.manageProduct().partial;
			const hit = PRETTY_TO_PARTIAL[p];
			if (hit) loadMain(hit);
		}
	};

	// ─────────────────────────────────────────────────────────────
	const CTX = $('body').data('ctx') || '';
	const ROUTE = buildRoutes(CTX);
	const PAGE_JS = buildPageJs(CTX);
	const PAGE_URL_JS = buildPageUrlJs(CTX);
	// 외부 export
	w.__layout = w.__layout || {};
	w.__layout.loadMain = loadMain;
	w.__layout.navigate = (code) => {
		if (code === 'recent') {
			const f = ['left=120', 'top=80', 'width=1100', 'height=800', 'scrollbars=yes', 'resizable=yes'].join(',');
			const r = ROUTE.recentPopup();
			const url = (typeof r === 'string') ? r : (r?.partial || r?.pretty || '');
			if (!url) { console.warn('[recent] URL not resolved'); return; }
			w.open(url, 'recentProducts', f);
			return;
		}
		go(code);
	};
	// URL 직접 이동도 지원
	w.__layout.go = go;

	// 상단 브랜드(홈)
	$(d).on('click', '#btnHome', () => w.__layout.navigate('home'));

	// 좌측/전역 data-nav 버튼
	$(d).on('click', '[data-nav]', function(e) {
		e.preventDefault();
		const code = this.getAttribute('data-nav');
		if (code) w.__layout.navigate(code);
	});

	// 브라우저 뒤/앞으로
	if (w.history && w.history.pushState) {
		w.addEventListener('popstate', onPopState);
		const path = w.location.pathname + w.location.search;
		const R = ROUTE;
		const P2 = {};
		P2[R.searchProduct().pretty] = R.searchProduct().partial;
		P2[R.manageProduct().pretty] = R.manageProduct().partial;
		const part = P2[path];
		if (part) {
			w.history.replaceState({ pretty: path, partial: part }, '', path);
		}
	}

})(window, document, window.jQuery);

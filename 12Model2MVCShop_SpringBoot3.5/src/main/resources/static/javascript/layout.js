(function(w, d, $) {
	'use strict';
	if (!$) return;

	const CTX = $('body').data('ctx') || '';
	const $MAIN = $('#mainArea, #appMain');

	const ctx = () => CTX;

	const loadScriptOnce = (src, key) => {
		const k = key || src;
		if (d.querySelector(`script[data-js-key="${k}"]`)) return $.Deferred().resolve().promise();
		const df = $.Deferred();
		const s = d.createElement('script');
		s.src = src + (src.includes('?') ? '&' : '?') + 'v=' + Date.now();
		s.defer = true;
		s.setAttribute('data-js-key', k);
		s.onload = () => df.resolve();
		s.onerror = () => df.reject();
		d.head.appendChild(s);
		return df.promise();
	};

	const loadCssOnce = (href, key) => {
		const k = key || href;
		if (d.querySelector(`link[data-css-key="${k}"]`)) return $.Deferred().resolve().promise();
		const df = $.Deferred();
		const l = d.createElement('link');
		l.rel = 'stylesheet';
		l.href = href + (href.includes('?') ? '&' : '?') + 'v=' + Date.now();
		l.setAttribute('data-css-key', k);
		l.onload = () => df.resolve();
		l.onerror = () => df.reject();
		d.head.appendChild(l);
		return df.promise();
	};

	const ROUTE = {
	  home: () => ({
	    pretty: ctx() + '/home',
	    partial: ctx() + '/layout/home.fragment.jsp'
	  }),

	  myInfo: () => ({
	    pretty: ctx() + '/user/myInfo',
	    partial: ctx() + '/user/myInfo?embed=1 [data-page=user-detail]:first'
	  }),

	  // ✅ 상품검색 (fragment 직접 호출)
	  searchProduct: () => ({
	    pretty: ctx() + '/product/listProduct.fragment.jsp',
	    partial: ctx() + '/product/listProduct.fragment.jsp .container:first'
	  }),

	  // ✅ 판매상품관리 (관리 전용 JSP)
	  manageProduct: () => ({
	    pretty: ctx() + '/product/listManageProduct.jsp',
	    partial: ctx() + '/product/listManageProduct.jsp .container:first'
	  }),

	  addProduct: () => ({
	    pretty: ctx() + '/product/addProductView.jsp',
	    partial: ctx() + '/product/addProductView.jsp .container:first'
	  }),

	  editProduct: (no) => ({
	    pretty: ctx() + `/product/updateProduct.jsp?prodNo=${encodeURIComponent(no)}`,
	    partial: ctx() + `/product/updateProduct.jsp?prodNo=${encodeURIComponent(no)} .container:first`
	  }),

	  productDetail: (no) => ({
	    pretty: ctx() + `/product/getProduct.jsp?prodNo=${encodeURIComponent(no)}`,
	    partial: ctx() + `/product/getProduct.jsp?prodNo=${encodeURIComponent(no)} .container:first`
	  }),

	  purchaseList: () => ({
	    pretty: ctx() + '/purchase/listPurchase.jsp',
	    partial: ctx() + '/purchase/listPurchase.jsp .container:first'
	  }),

	  cart: () => ({
	    pretty: ctx() + '/purchase/cart.jsp',
	    partial: ctx() + '/purchase/cart.jsp .container:first'
	  })
	};

	const PAGE_CSS = {
		'user-detail': [ctx() + '/css/getUser.css']
	};

	const PAGE_JS = {
		'home': [],
		'user-detail': [ctx() + '/javascript/getUser.js'],
		'user-update': [ctx() + '/javascript/updateUser.js'],
		'product-search': [ctx() + '/javascript/listProduct.js'],
		'product-manage': [ctx() + '/javascript/listManageProduct.js'],
		'product-add': [ctx() + '/javascript/addProduct.js'],
		'product-detail': [ctx() + '/javascript/getProduct.js'],
		'product-update': [
			'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js',
			'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js',
			'https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/ko.js',
			ctx() + '/javascript/updateProduct.js'
		],
		'purchase-add': [ctx() + '/javascript/addPurchase.js'],
		'purchase-list': [ctx() + '/javascript/app-core.js', ctx() + '/javascript/listPurchase.js', ctx() + '/javascript/cancel-order.js'],
		'purchase-detail': [ctx() + '/javascript/app-core.js', ctx() + '/javascript/getPurchase.js'],
		'cart': [ctx() + '/javascript/app-core.js', ctx() + '/javascript/cart.js']
	};

	const PAGE_URL_JS = {
		'/purchase/list': [ctx() + '/javascript/app-core.js', ctx() + '/javascript/listPurchase.js', ctx() + '/javascript/cancel-order.js'],
		'/purchase/listPurchase.jsp': [ctx() + '/javascript/app-core.js', ctx() + '/javascript/listPurchase.js', ctx() + '/javascript/cancel-order.js'],
		'/purchase/cart.jsp': [ctx() + '/javascript/app-core.js', ctx() + '/javascript/cart.js'],
		'/purchase/getPurchase': [ctx() + '/javascript/app-core.js', ctx() + '/javascript/getPurchase.js'],
		'/user/myInfo': [ctx() + '/javascript/getUser.js']
	};

	function loadMain(url) {
		if (!$MAIN.length || !url) return;
		const rawUrl = String(url).split(' ')[0];
		$MAIN.attr('data-loading', '1').addClass('loading');
		$MAIN.load(url, function(_res, status, xhr) {
			$MAIN.removeAttr('data-loading').removeClass('loading');
			if (status === 'error') {
				if (xhr && (xhr.status === 401 || xhr.status === 403)) {
					w.location.href = ctx() + '/user/loginView.jsp';
					return;
				}
				$MAIN.html('<div class="error-box">⚠ 컨텐츠를 불러오지 못했습니다.</div>');
				return;
			}
			const $page = $MAIN.find('[data-page]').first();
			const pageKey = ($page.attr('data-page') || '').trim();
			let cssList = (PAGE_CSS[pageKey] || []).slice();
			let jsList = (PAGE_JS[pageKey] || []).slice();
			if (!jsList.length) {
				const hit = Object.keys(PAGE_URL_JS).find(k => rawUrl.indexOf(k) > -1);
				if (hit) jsList = PAGE_URL_JS[hit].slice();
			}
			let chain = $.Deferred().resolve().promise();
			cssList.forEach(href => { chain = chain.then(() => loadCssOnce(href, href)); });
			jsList.forEach(src => { chain = chain.then(() => loadScriptOnce(src, src)); });
			chain.always(() => {
				$MAIN.scrollTop(0);
				$(d).trigger('view:afterload', { page: pageKey, $main: $MAIN });
			});
		});
	}

	function go(codeOrUrl) {
		const r = ROUTE[codeOrUrl];
		const meta = (typeof r === 'function') ? r() : null;
		if (meta && meta.partial && meta.pretty) {
			loadMain(meta.partial);
			if (w.history && w.history.pushState) {
				w.history.pushState({ pretty: meta.pretty, partial: meta.partial }, '', meta.pretty);
			}
			return;
		}
		const url = String(codeOrUrl || '');
		const isPartial = /\.fragment\.jsp(\?|$)/.test(url) || url.indexOf(' ') > -1;
		if (isPartial) {
			loadMain(url);
			if (w.history && w.history.pushState) {
				const pretty = url.replace(/\.fragment\.jsp(\?|$)/, '$1').split(' ')[0];
				w.history.pushState({ pretty, partial: url }, '', pretty);
			}
		} else {
			w.location.href = url.startsWith(ctx()) ? url : (ctx() + url);
		}
	}

	function onPopState(e) {
	  const st = e.state;
	  if (st && st.partial) { loadMain(st.partial); return; }
	  const path = location.pathname + location.search;
	  const map = {};
	  map[ROUTE.searchProduct().pretty] = ROUTE.searchProduct().partial;
	  map[ROUTE.manageProduct().pretty] = ROUTE.manageProduct().partial;
	  map[ROUTE.purchaseList().pretty] = ROUTE.purchaseList().partial;
	  map[ROUTE.myInfo().pretty] = ROUTE.myInfo().partial;

	  if (map[path]) { loadMain(map[path]); return; }

	  if (path.indexOf(ctx() + '/user/updateUser') === 0) {
	    const sep = path.includes('?') ? '&' : '?';
	    loadMain(path + sep + 'embed=1 [data-page=user-update]:first');
	    return;
	  }
	}

	w.__layout = w.__layout || {};
	w.__layout.loadMain = loadMain;
	w.__layout.go = go;
	w.__layout.navigate = (code) => go(code);

	$(d).on('click', '#btnHome', (e) => { e.preventDefault(); go('home'); });
	$(d).on('click', '[data-nav]', function(e) { e.preventDefault(); const code = this.getAttribute('data-nav'); if (code) go(code); });

	if (w.history && w.history.pushState) {
		w.addEventListener('popstate', onPopState);
		const path = w.location.pathname + w.location.search;
		const R = ROUTE;
		const map = {};
		map[R.searchProduct().pretty] = R.searchProduct().partial;
		map[R.manageProduct().pretty] = R.manageProduct().partial;
		map[R.purchaseList().pretty] = R.purchaseList().partial;
		map[R.myInfo().pretty] = R.myInfo().partial;
		if (map[path]) {
			w.history.replaceState({ pretty: path, partial: map[path] }, '', path);
		}
	}
})(window, document, window.jQuery);

/* /javascript/layout.js */
(function (w, d, $) {
  'use strict';
  if (!$) return;

  // ─────────────────────────────────────────────
  // 공통
  // ─────────────────────────────────────────────
  const CTX = $('body').data('ctx') || '';
  const $MAIN = $('#mainArea, #appMain');

  const ctx = () => CTX;

  const loadScriptOnce = (src, key) => {
    const k = key || src;
    if (d.querySelector(`script[data-js-key="${k}"]`)) {
      return $.Deferred().resolve().promise();
    }
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

  // 라우트(코드 네비게이션)
  const ROUTE = {
    home: () => ({ pretty: ctx() + '/home', partial: ctx() + '/layout/home.fragment.jsp' }),

    // product
    searchProduct: () => ({ pretty: ctx() + '/product/listProduct', partial: ctx() + '/product/listProduct.fragment.jsp' }),
    manageProduct: () => ({ pretty: ctx() + '/product/listProduct?menu=manage', partial: ctx() + '/product/listProduct?menu=manage .container:first' }),
    addProduct: () => ({ pretty: ctx() + '/product/addProduct', partial: ctx() + '/product/addProductView.jsp .container:first' }),
    editProduct: (no) => ({ pretty: ctx() + `/product/updateProduct?prodNo=${encodeURIComponent(no)}`, partial: ctx() + `/product/updateProduct?prodNo=${encodeURIComponent(no)} .container:first` }),
    productDetail: (no) => ({ pretty: ctx() + `/product/getProduct?prodNo=${encodeURIComponent(no)}`, partial: ctx() + `/product/getProduct?prodNo=${encodeURIComponent(no)} .container:first` }),

    // purchase
    purchaseList: () => ({ pretty: ctx() + '/purchase/list', partial: ctx() + '/purchase/list .container:first' }),
    cart: () => ({ pretty: ctx() + '/cart', partial: ctx() + '/purchase/cart.jsp .container:first' }),
  };

  // 페이지 키 → 필요한 JS
  const PAGE_JS = {
    'home'            : [],
    'product-search'  : [ctx() + '/javascript/listProduct.js'],
    'product-manage'  : [ctx() + '/javascript/listManageProduct.js'],
    'product-add'     : [ctx() + '/javascript/addProduct.js'],
    'product-detail'  : [ctx() + '/javascript/getProduct.js'],
    'product-update'  : [
      'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js',
      'https://cdn.jsdelivr.net/npm/flatpickr',
      'https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/ko.js',
      ctx() + '/javascript/updateProduct.js'
    ],
    'purchase-add'    : [ctx() + '/javascript/addPurchase.js'],
    'purchase-list'   : [ctx() + '/javascript/app-core.js', ctx() + '/javascript/listPurchase.js', ctx() + '/javascript/cancel-order.js'],
    'purchase-detail' : [ctx() + '/javascript/app-core.js', ctx() + '/javascript/getPurchase.js'],
    'cart'            : [ctx() + '/javascript/app-core.js', ctx() + '/javascript/cart.js'],
  };

  // URL 패턴 매핑(페이지 키 판별이 어려운 경우 보조)
  const PAGE_URL_JS = {
    '/purchase/list'           : [ctx() + '/javascript/app-core.js', ctx() + '/javascript/listPurchase.js', ctx() + '/javascript/cancel-order.js'],
    '/purchase/listPurchase.jsp': [ctx() + '/javascript/app-core.js', ctx() + '/javascript/listPurchase.js', ctx() + '/javascript/cancel-order.js'],
    '/purchase/cart.jsp'       : [ctx() + '/javascript/app-core.js', ctx() + '/javascript/cart.js'],
    '/purchase/getPurchase'    : [ctx() + '/javascript/app-core.js', ctx() + '/javascript/getPurchase.js']
  };

  // ─────────────────────────────────────────────
  // 메인 로드 (fragment or selector 지원)
  // ─────────────────────────────────────────────
  function loadMain(url) {
    if (!$MAIN.length || !url) return;

    const rawUrl = String(url).split(' ')[0];
    $MAIN.attr('data-loading', '1').addClass('loading');
    $MAIN.load(url, function (_res, status, xhr) {
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

      // 필요 스크립트 결정
      let jsList = (PAGE_JS[pageKey] || []).slice();
      if (!jsList.length) {
        const hit = Object.keys(PAGE_URL_JS).find(k => rawUrl.indexOf(k) > -1);
        if (hit) jsList = PAGE_URL_JS[hit].slice();
      }

      let chain = $.Deferred().resolve().promise();
      jsList.forEach(src => { chain = chain.then(() => loadScriptOnce(src, src)); });

      chain.always(() => {
        $MAIN.scrollTop(0);
        $(d).trigger('view:afterload', { page: pageKey, $main: $MAIN });
      });
    });
  }

  // ─────────────────────────────────────────────
  // go : 코드/URL 전부 지원
  // ─────────────────────────────────────────────
  function go(codeOrUrl) {
    // 코드 네비게이션
    const r = ROUTE[codeOrUrl];
    const meta = (typeof r === 'function') ? r() : null;
    if (meta && meta.partial && meta.pretty) {
      loadMain(meta.partial);
      if (w.history && w.history.pushState) {
        w.history.pushState({ pretty: meta.pretty, partial: meta.partial }, '', meta.pretty);
      }
      return;
    }

    // URL
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

  // popstate
  function onPopState(e) {
    const st = e.state;
    if (st && st.partial) {
      loadMain(st.partial);
      return;
    }
    const path = location.pathname + location.search;
    const map = {};
    map[ROUTE.searchProduct().pretty] = ROUTE.searchProduct().partial;
    map[ROUTE.manageProduct().pretty] = ROUTE.manageProduct().partial;
    map[ROUTE.purchaseList().pretty] = ROUTE.purchaseList().partial;

    if (map[path]) loadMain(map[path]);
  }

  // ─────────────────────────────────────────────
  // export + 이벤트
  // ─────────────────────────────────────────────
  w.__layout = w.__layout || {};
  w.__layout.loadMain = loadMain;
  w.__layout.go = go;
  w.__layout.navigate = (code) => go(code);

  // 상단/좌측 내비
  $(d).on('click', '#btnHome', (e) => { e.preventDefault(); go('home'); });
  $(d).on('click', '[data-nav]', function (e) {
    e.preventDefault();
    const code = this.getAttribute('data-nav');
    if (code) go(code);
  });

  // 브라우저 뒤/앞
  if (w.history && w.history.pushState) {
    w.addEventListener('popstate', onPopState);

    const path = w.location.pathname + w.location.search;
    const R = ROUTE;
    const map = {};
    map[R.searchProduct().pretty] = R.searchProduct().partial;
    map[R.manageProduct().pretty] = R.manageProduct().partial;
    map[R.purchaseList().pretty] = R.purchaseList().partial;

    if (map[path]) {
      w.history.replaceState({ pretty: path, partial: map[path] }, '', path);
    }
  }
})(window, document, window.jQuery);

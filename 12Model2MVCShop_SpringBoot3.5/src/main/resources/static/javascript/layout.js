(function(w, d, $){
  'use strict';
  if(!$) return;

  const CTX = $('body').data('ctx') || '';
  const $MAIN = $('#mainArea');

  const loadOnce = (url, key, isCss) => {
    const k = key || url;
    const sel = isCss ? `link[data-key="${k}"]` : `script[data-key="${k}"]`;
    if (d.querySelector(sel)) return $.Deferred().resolve().promise();
    const df = $.Deferred();
    const el = d.createElement(isCss ? 'link' : 'script');
    if (isCss){ el.rel='stylesheet'; el.href=url; } else { el.src=url; el.defer=true; }
    el.setAttribute('data-key', k);
    el.onload=()=>df.resolve();
    el.onerror=()=>df.reject();
    d.head.appendChild(el);
    return df.promise();
  };

  const PAGE_JS = {
    'home': [CTX+'/javascript/home.js'],
    'user-detail': [CTX+'/javascript/getUser.js'],
    'user-update': [CTX+'/javascript/updateUser.js'],
    'product-list': [CTX+'/javascript/listProduct.js'],
    'product-manage': [CTX+'/javascript/listManageProduct.js'],
    'product-detail': [CTX+'/javascript/getProduct.js'],
    'product-update': [
      'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js',
      'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js',
      'https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/ko.js',
      CTX+'/javascript/updateProduct.js'
    ],
    'purchase-add': [CTX+'/javascript/app-core.js', CTX+'/javascript/addPurchase.js'],
    'purchase-list': [CTX+'/javascript/app-core.js', CTX+'/javascript/listPurchase.js', CTX+'/javascript/cancel-order.js'],
    'purchase-detail': [CTX+'/javascript/app-core.js', CTX+'/javascript/getPurchase.js'],
    'cart': [CTX+'/javascript/app-core.js', CTX+'/javascript/cart.js']
  };

  const toPartial = (href, frag) => {
    const u = String(href || '');
    const sel = String(frag || '[data-page]:first');
    const j = u.indexOf('?') >= 0 ? '&' : '?';
    return `${u}${j}embed=1 ${sel}`;
  };

  function afterLoad(pageKey){
    $MAIN.scrollTop(0);
    $(d).trigger('view:afterload', { page: pageKey, $main: $MAIN });
  }

  function loadMain(url){
    if (!$MAIN.length || !url) return;
    $MAIN.attr('data-loading','1').addClass('loading').html(
      '<div class="w-full flex justify-center items-center py-16 text-gray-500 text-sm select-none"><div class="animate-pulse flex flex-col items-center gap-3"><div class="w-12 h-12 rounded-xl bg-[#03c75a]/10 shadow-[0_16px_40px_rgba(3,199,90,0.25)]"></div><div class="text-gray-400 font-medium">로딩중...</div></div></div>'
    );

    const parts = url.split(' ');
    const href = parts[0];
    const frag = parts.slice(1).join(' ') || '[data-page]:first';

    $.ajax({
      url: href,
      method: 'GET',
      dataType: 'html',
      headers: {'X-Requested-With':'XMLHttpRequest'}
    }).done((html) => {
      const $tmp = $('<div>').append($.parseHTML(html, document, true));
      const $sel = $tmp.find(frag);
      if (!$sel.length){
        $MAIN.removeAttr('data-loading').removeClass('loading').html('<div class="p-10 text-center text-red-500 font-semibold text-sm">컨텐츠를 찾지 못했습니다.</div>');
        return;
      }
      $sel.find('script').remove();
      $MAIN.removeAttr('data-loading').removeClass('loading').empty().append($sel);
      const $page = $MAIN.find('[data-page]').first();
      const key = ($page.attr('data-page')||'').trim();
      let chain = $.Deferred().resolve().promise();
      (PAGE_JS[key]||[]).forEach(src => chain = chain.then(()=> loadOnce(src, src, false)));
      chain.always(()=> afterLoad(key));
    }).fail((xhr) => {
      $MAIN.removeAttr('data-loading').removeClass('loading');
      if (xhr && (xhr.status===401 || xhr.status===403)){ w.location.href = CTX + '/user/loginView.jsp'; return; }
      $MAIN.html('<div class="p-10 text-center text-red-500 font-semibold text-sm">컨텐츠를 불러오지 못했습니다.</div>');
    });
  }

  function pushAndLoad(pretty, partial){
    if (history.pushState) history.pushState({ pretty, partial }, '', pretty);
    loadMain(partial);
  }

  function navigate(href, opts={}){
    const frag = opts.frag || '[data-page]:first';
    const partial = toPartial(href, frag);
    pushAndLoad(href, partial);
  }

  w.addEventListener('popstate', function(e){
    const st = e.state;
    if (st && st.partial) { loadMain(st.partial); return; }
    location.reload();
  });

  $(function(){
    const entry = $('body').data('entry');
    if (history && history.replaceState){
      history.replaceState({ pretty: location.pathname+location.search, partial: entry }, '', location.pathname+location.search);
      if (entry) loadMain(entry);
    }
  });

  w.__layout = w.__layout || {};
  w.__layout.loadMain = loadMain;
  w.__layout.navigate = navigate;
})(window, document, window.jQuery);

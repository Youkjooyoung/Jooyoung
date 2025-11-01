(($, w, d) => {
  'use strict';
  if (!$) return;

  const ROOT_SEL = '[data-page="product-manage"]';
  const getRoot = () => $(ROOT_SEL).first();
  const ctx = () => $('body').data('ctx') || getRoot().data('ctx') || (w.APP_CTX || '');
  let historyLoading = false;

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

  const useLoad = (url) => {
    closeModal();
    if (w.__layout?.loadMain) w.__layout.loadMain(url);
    else location.href = url.replace(' .container:first', '');
  };

  const buildQuery = (extra = {}) => {
    const $root = getRoot();
    const condSel = String($root.find('#searchCondition').val() || '0');
    const cond = ['0', 'prodName', 'prodDetail'].includes(condSel) ? condSel : '0';
    const kw = String($root.find('#searchKeyword').val() || '').trim();
    return { menu: 'manage', searchCondition: cond, searchKeyword: kw, ...extra };
  };

  const toQS = (obj) => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');

  const doSearch = () => {
    const qs = toQS(buildQuery());
    const url = `${ctx()}/product/listProduct?${qs} [data-page=product-list]:first`;
    useLoad(url);
  };

  const goPage = (page) => {
    const qs = toQS(buildQuery({ currentPage: String(page || 1) }));
    const url = `${ctx()}/product/listProduct?${qs} [data-page=product-list]:first`;
    useLoad(url);
  };

  w.fncGetUserList = (p) => { goPage(p); };

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

  const bindAutocomplete = () => {
    const $root = getRoot();
    if (!$root.length) return;
    const $kw = $root.find('#searchKeyword');
    const $list = $root.find('#acList');
    const debounce = w.App?.debounce || ((fn, t = 150) => { let to; return (...a) => { clearTimeout(to); to = setTimeout(() => fn(...a), t); }; });

    const requestAC = debounce(() => {
      const cond = String($root.find('#searchCondition').val() || 'prodName');
      const kw = String($kw.val() || '').trim();
      if (kw.length < 2) { $list.empty().hide(); return; }
      $.getJSON(`${ctx()}/api/products/suggest`, { type: cond, keyword: kw })
        .done((res) => {
          const items = res?.items || [];
          if (!items.length) { $list.empty().hide(); return; }
          const esc = (w.App?.esc) || ((t) => String(t).replace(/[<>&"]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[s])));
          $list.html(items.map(t => `<div class="ac-item">${esc(t)}</div>`).join('')).show().width($kw.outerWidth());
        })
        .fail(() => $list.empty().hide());
    }, 120);

    $root.off('.ac')
      .on('input.ac focus.ac', '#searchKeyword', requestAC)
      .on('blur.ac', '#searchKeyword', () => setTimeout(() => $list.hide(), 150))
      .on('mousedown.ac', '#acList .ac-item', function(){ $kw.val($(this).text()); $list.empty().hide(); doSearch(); });
  };

  const looksLikeError = (doc) => {
    try { const text = doc?.body?.textContent || ''; return /default Exception page|No static resource|\/common\/error\.jsp/i.test(text); }
    catch { return false; }
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
      `${base}/purchase/listPurchaseByProduct?${toQS({ currentPage: 1, prodNo })}`
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
        if (looksLikeError(doc)) tryLoad(i + 1);
        else { historyLoading = false; $modal.removeClass('hidden').show().attr('aria-hidden', 'false'); $('body').addClass('no-scroll'); }
      });
      $iframe.attr('src', url);
    };
    tryLoad(0);
  };

  const bindOnce = () => {
    $(d).off('.lpm');
    $(d).on('click.lpm', `${ROOT_SEL} #btnSearch`, (e) => { e.preventDefault(); doSearch(); });
    $(d).on('keydown.lpm', `${ROOT_SEL} #searchKeyword`, (e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });

    $(d).on('click.lpm', `${ROOT_SEL} .sort-btn`, (e) => {
      e.preventDefault();
      const { searchCondition, searchKeyword } = buildQuery();
      const sort = String($(e.currentTarget).data('sort') || '');
      const url = `${ctx()}/product/listProduct?${toQS({ menu: 'manage', searchCondition, searchKeyword, sort })} [data-page=product-list]:first`;
      useLoad(url);
    });

    $(d).on('click.lpm', `${ROOT_SEL} .btn-detail`, (e) => {
      e.preventDefault();
      const no = $(e.currentTarget).data('prodno');
      if (!no) return;
      useLoad(`${ctx()}/product/getProduct?prodNo=${encodeURIComponent(no)} [data-page=product-detail]:first`);
    });

    $(d).on('click.lpm', `${ROOT_SEL} .btn-order-history`, (e) => {
      e.preventDefault();
      const $btn = $(e.currentTarget);
      if ($btn.prop('disabled') || historyLoading) return;
      $btn.prop('disabled', true); setTimeout(() => $btn.prop('disabled', false), 600);
      const no = $btn.data('prodno'); if (!no) return;
      openHistory(no);
    });

    $(d).on('click.lpm', `${ROOT_SEL} .dlg-close`, (e) => { e.preventDefault(); closeModal(); });
    $(d).on('mousedown.lpm', `${ROOT_SEL} #historyModal`, (e) => { if (!$(e.target).closest('.dlg').length) closeModal(); });
    $(d).on('keydown.lpm', (e) => { if (e.key === 'Escape') closeModal(); });

    bindAutocomplete();
    interceptPagination();
  };

  $(d).on('view:afterload.lpm', (_e, p) => { if (p?.page === 'product-manage') bindOnce(); });
  $(() => { if (getRoot().length) bindOnce(); });
})(jQuery, window, document);

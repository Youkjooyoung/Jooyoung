(($, w, d) => {
  'use strict';
  if (!$) return;

  const ctx = () => $('body').data('ctx') || '';
  const NS = '.lp';
  let state = { view: 'list', page: 1, pageSize: 10, minPrice: 0, maxPrice: 2000000, cond: '0', kw: '', sort: '', loading: false, done: false };

  const apiUrl = (p) => ctx() + '/api/products?' + $.param({ ...(p || {}), _: Date.now() });
  const acUrl = (type, kw) => ctx() + '/api/products/suggest?' + $.param({ type, keyword: $.trim(kw || ''), _: Date.now() });

  const fmt = (n) => Number(n || 0).toLocaleString('ko-KR');
  const isAdmin = () => String($('body').data('role') || '').toUpperCase() === 'ADMIN';
  const NO_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="160"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#999">no image</text></svg>`);

  const loadProducts = () => {
    if (state.loading || state.done) return;
    state.loading = true;
    $('#infiniteLoader').show(); $('#endOfList').hide();

    const params = {
      currentPage: state.page,
      pageSize: state.pageSize,
      searchCondition: state.cond,
      searchKeyword: state.kw,
      sort: state.sort,
      minPrice: state.minPrice,
      maxPrice: state.maxPrice
    };

    $.getJSON(apiUrl(params))
      .done((res) => {
        const list = res?.list || [];
        if (!list.length && state.page === 1) {
          $('#listBody, #gridBody').html('<tr><td colspan="7" class="text-center text-gray-400 p-4">검색 결과가 없습니다.</td></tr>');
          $('#infiniteLoader').hide();
          return;
        }
        render(list);
        state.page++;
        state.done = !(res.hasNext ?? list.length === state.pageSize);
      })
      .fail(() => {
        if (state.page === 1) $('#listBody').html('<tr><td colspan="7" class="text-center text-red-400 p-4">불러오기 실패</td></tr>');
      })
      .always(() => {
        state.loading = false;
        $('#infiniteLoader').hide();
        if (state.done) $('#endOfList').show();
      });
  };

  const render = (list) => {
    const $list = $('#listBody');
    const $grid = $('#gridBody');
    const html = list.map((p) => {
      const img = p.fileName ? `${ctx()}/upload/${p.fileName}` : NO_IMG;
      const soldOut = Number(p.stockQty || 0) <= 0;
      const btn = soldOut
        ? `<button class="bg-gray-300 text-gray-600 font-semibold px-3 py-1 rounded" disabled>품절</button>`
        : !isAdmin()
          ? `<button class="bg-naver hover:bg-naver-dark text-white font-semibold px-3 py-1 rounded btn-buy" data-prodno="${p.prodNo}">구매</button>`
          : '';
      if (state.view === 'list') {
        return `
          <tr class="hover:bg-gray-50" data-prodno="${p.prodNo}">
            <td class="p-3 text-center">${p.prodNo}</td>
            <td class="p-3 font-bold text-naver cursor-pointer prod-link">${p.prodName}</td>
            <td class="p-3">${fmt(p.price)} 원</td>
            <td class="p-3">${p.manuDate || ''}</td>
            <td class="p-3">${p.viewCount || 0}</td>
            <td class="p-3">${soldOut ? '<span class="text-red-500">품절</span>' : '판매중'}</td>
            <td class="p-3">${btn}</td>
          </tr>`;
      } else {
        return `
          <div class="bg-white shadow-card rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer prod-link" data-prodno="${p.prodNo}">
            <img src="${img}" alt="${p.prodName}" class="w-full h-48 object-cover">
            <div class="p-4">
              <div class="font-bold text-gray-900 truncate">${p.prodName}</div>
              <div class="text-naver font-semibold mt-1">${fmt(p.price)} 원</div>
              <div class="text-xs text-gray-500 mt-1">${p.manuDate || ''} · 조회 ${p.viewCount || 0}</div>
            </div>
            <div class="px-4 pb-4">${btn}</div>
          </div>`;
      }
    }).join('');

    if (state.view === 'list') $list.append(html);
    else $grid.append(html);
  };

  const reset = () => {
    state.page = 1; state.done = false;
    $('#listBody, #gridBody').empty(); loadProducts();
  };

  const syncSlider = () => {
    const min = +$('#rMin').val(), max = +$('#rMax').val();
    if (min > max) $('#rMin').val(max - 5000);
    $('#priceMinView').text(fmt($('#rMin').val()));
    $('#priceMaxView').text(fmt($('#rMax').val()));
    const pctMin = (min / 2000000) * 100, pctMax = (max / 2000000) * 100;
    $('#priceBar').css({ left: pctMin + '%', width: (pctMax - pctMin) + '%' });
  };

  const toggleView = (v) => {
    state.view = v;
    if (v === 'list') { $('#gridBody').addClass('hidden'); $('#listTableWrap').show(); }
    else { $('#listTableWrap').hide(); $('#gridBody').removeClass('hidden'); }
    $('.seg-btn').removeClass('bg-naver text-white').addClass('bg-gray-200 text-gray-700');
    if (v === 'list') $('#btnListView').addClass('bg-naver text-white');
    else $('#btnThumbView').addClass('bg-naver text-white');
    reset();
  };

  const bindAutoComplete = () => {
    const $kw = $('#searchKeyword');
    const $ac = $('#acList');
    let xhr = null;
    const renderAC = (items) => {
      if (!items.length) return $ac.hide();
      $ac.html(items.map((v) => `<div class="px-3 py-2 hover:bg-naver hover:text-white cursor-pointer">${v}</div>`).join('')).show();
    };
    $kw.on('input focus', () => {
      const v = $kw.val().trim(); if (!v) return $ac.hide();
      if (xhr && xhr.readyState !== 4) xhr.abort();
      const tSel = $('#searchCondition').val() || 'prodName';
      xhr = $.getJSON(acUrl(tSel, v)).done((res) => renderAC(res.items || []));
    });
    $ac.on('mousedown', 'div', function() {
      $kw.val($(this).text()); $ac.hide(); reset();
    });
    $(d).on('click', (e) => { if (!$(e.target).closest('#acList, #searchKeyword').length) $ac.hide(); });
  };

  const bindEvents = () => {
    $('#btnSearch').on('click', () => {
      state.kw = $('#searchKeyword').val().trim();
      state.cond = $('#searchCondition').val();
      state.minPrice = +$('#rMin').val();
      state.maxPrice = +$('#rMax').val();
      reset();
    });

    $('#btnAll').on('click', () => {
      $('#searchKeyword').val('');
      $('#rMin').val(0); $('#rMax').val(2000000);
      syncSlider(); reset();
    });

    $('#rMin,#rMax').on('input', syncSlider);

    $('#btnListView').on('click', () => toggleView('list'));
    $('#btnThumbView').on('click', () => toggleView('thumb'));

    $(d).on('click', '.prod-link', function() {
      const no = $(this).closest('[data-prodno]').data('prodno');
      location.href = `${ctx()}/product/getProduct?prodNo=${no}`;
    });

    $(d).on('click', '.btn-buy', function() {
      const no = $(this).data('prodno');
      location.href = `${ctx()}/purchase/addPurchase?prodNo=${no}`;
    });

    $(w).on('scroll', () => {
      if ($(window).scrollTop() + $(window).height() + 200 >= $(document).height()) loadProducts();
    });
  };

  $(() => {
    syncSlider();
    bindEvents();
    bindAutoComplete();
    loadProducts();
  });
})(jQuery, window, document);

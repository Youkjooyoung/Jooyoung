((w, d, $) => {
  'use strict';
  if (!$) return;

  const ensureSwiper = (cb) => {
    if (w.Swiper) { cb(); return; }
    const css = d.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    d.head.appendChild(css);
    const js = d.createElement('script');
    js.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    js.onload = cb;
    d.head.appendChild(js);
  };

  const noimg = () => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='360'><rect width='100%' height='100%' fill='#f8f9fa'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='#adb5bd'>no image</text></svg>`;
    return "this.onerror=null;this.src='data:image/svg+xml;utf8,"+encodeURIComponent(svg)+"';";
  };

  const card = (p, ctx, onerr) => {
    const file = p.fileName ? encodeURIComponent(p.fileName) : 'noimage.png';
    const src = `${ctx}/images/uploadFiles/${file}`;
    return `
      <div class="select-none border border-naver-gray-100 rounded-[12px] shadow-nv p-3 cursor-pointer" data-prodno="${p.prodNo||''}">
        <img class="w-full aspect-[4/3] object-cover rounded-[10px] border border-naver-gray-100" src="${src}" alt="${p.prodName||''}" onerror="${onerr}">
        <div class="mt-2 text-sm font-semibold text-gray-900 truncate">${p.prodName||''}</div>
        <div class="text-sm text-gray-600">${(p.price||0).toLocaleString('ko-KR')}원</div>
      </div>`;
  };

  const loadGrid = ($grid, url) => {
    const CTX = $('body').data('ctx') || '';
    const onerr = noimg();
    $grid.empty().append('<div class="col-span-full text-gray-500">로딩 중...</div>');
    $.getJSON(url).done((res) => {
      const list = res?.list || [];
      $grid.empty();
      list.slice(0, 8).forEach(p => $grid.append(card(p, CTX, onerr)));
    }).fail(() => {
      $grid.empty().append('<div class="col-span-full text-red-500">데이터를 불러오지 못했습니다.</div>');
    });
    $grid.off('click').on('click', '[data-prodno]', function(){
      const CTX2 = $('body').data('ctx') || '';
      const no = $(this).attr('data-prodno');
      const pretty = `${CTX2}/product/getProduct?prodNo=${encodeURIComponent(no)}`;
      const partial = `${pretty} .container:first`;
      if (w.__layout?.loadMain) { w.__layout.loadMain(partial); if (history.pushState) history.pushState({view:'product-detail', prodNo:no, partial}, '', pretty); }
      else w.location.href = pretty;
    });
  };

  const initHome = ($root) => {
    const CTX = $('body').data('ctx') || '';
    const $host = $root.find('.product-slider');
    if ($host.data('inited')) return;
    $host.data('inited', 1).empty();

    $.getJSON(`${CTX}/api/products?currentPage=1&pageSize=12`).done((res) => {
      const list = res?.list || [];
      if (!list.length) { $host.append('<p class="text-gray-500">추천 상품이 없습니다.</p>'); return; }

      const $container = $('<div class="swiper"></div>');
      const $wrapper = $('<div class="swiper-wrapper"></div>');
      const onerr = noimg();

      list.forEach((p) => {
        const file = p.fileName ? encodeURIComponent(p.fileName) : 'noimage.png';
        const src = `${CTX}/images/uploadFiles/${file}`;
        const $slide = $(`
          <div class="swiper-slide select-none" data-prodno="${p.prodNo||''}">
            <div class="flex flex-col items-center">
              <img class="w-full max-w-[240px] aspect-[4/3] object-cover rounded-[12px] border border-naver-gray-100"
                   src="${src}" alt="${p.prodName||''}" onerror="${onerr}">
              <div class="mt-2 text-center w-full max-w-[240px]">
                <div class="text-sm font-semibold text-gray-900 truncate">${p.prodName||''}</div>
                <div class="text-sm text-gray-600">${(p.price||0).toLocaleString('ko-KR')}원</div>
              </div>
            </div>
          </div>`);
        $wrapper.append($slide);
      });

      const $prev = $('<div class="swiper-button-prev"></div>');
      const $next = $('<div class="swiper-button-next"></div>');
      const $dots = $('<div class="swiper-pagination"></div>');
      $container.append($wrapper, $prev, $next, $dots);
      $host.append($container);

      $host.on('click', '.swiper-slide', function(){
        const no = $(this).attr('data-prodno');
        const pretty = `${CTX}/product/getProduct?prodNo=${encodeURIComponent(no)}`;
        const partial = `${pretty} .container:first`;
        if (w.__layout?.loadMain) { w.__layout.loadMain(partial); if (history.pushState) history.pushState({view:'product-detail', prodNo:no, partial}, '', pretty); }
        else w.location.href = pretty;
      });

      ensureSwiper(() => {
        new w.Swiper($container[0], {
          loop: true,
          speed: 450,
          autoplay: { delay: 4500, disableOnInteraction: false },
          slidesPerView: 4,
          spaceBetween: 16,
          navigation: { nextEl: $next[0], prevEl: $prev[0] },
          pagination: { el: $dots[0], clickable: true },
          breakpoints: { 0:{slidesPerView:1,spaceBetween:12},600:{slidesPerView:2,spaceBetween:14},900:{slidesPerView:3,spaceBetween:16},1280:{slidesPerView:4,spaceBetween:16} }
        });
      });
    }).fail(() => $host.append('<p class="text-red-500">추천 상품을 불러오지 못했습니다.</p>'));

    const chips = ['전체','디지털','패션','생활','레저','도서','식품'];
    const $chipRow = $('#chipRow').empty();
    chips.forEach((c, i) => {
      const id = i===0 ? 'chip-all' : `chip-${i}`;
      $chipRow.append(`<button id="${id}" type="button" class="h-9 px-3 rounded-full border border-naver-gray-200 bg-white hover:bg-naver-gray-50">${c}</button>`);
    });
    const base = `${CTX}/api/products`;
    const $chipGrid = $('#chipGrid'), $reviewGrid = $('#reviewGrid'), $newGrid = $('#newGrid');
    loadGrid($chipGrid, `${base}?currentPage=1&pageSize=8`);
    loadGrid($reviewGrid, `${base}/reviewTop?pageSize=8`);
    loadGrid($newGrid, `${base}/newest?pageSize=8`);

    $chipRow.off('click').on('click', 'button', function(){
      const name = $(this).text();
      if (name === '전체') loadGrid($chipGrid, `${base}?currentPage=1&pageSize=8`);
      else loadGrid($chipGrid, `${base}?category=${encodeURIComponent(name)}&pageSize=8`);
    });
  };

  $(d).on('view:afterload', (_e, payload) => {
    const $main = payload?.$main ? payload.$main : $('#mainArea');
    const $home = $main.find('[data-page="home"]');
    if ($home.length) initHome($home);
  });

  $(() => {
    const $home = $('#mainArea').find('[data-page="home"]');
    if ($home.length) initHome($home);
  });
})(window, document, window.jQuery);

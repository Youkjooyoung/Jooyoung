// /javascript/home.js (Swiper + SPA pushState 버전)
((w, d, $) => {
  'use strict';
  if (!$) return;

  const ensureSwiperThen = (init) => {
    if (w.Swiper) { init(); return; }
    const add = (el) => d.head.appendChild(el);

    const css = d.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    add(css);

    const js = d.createElement('script');
    js.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    js.onload = init;
    add(js);
  };

  const buildNoImageOnError = () => {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">
         <rect width="100%" height="100%" fill="#f8f9fa"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
               font-family="Arial" font-size="16" fill="#adb5bd">no image</text>
       </svg>`;
    return "this.onerror=null;this.src='data:image/svg+xml;utf8," + encodeURIComponent(svg) + "';";
  };

  const initHome = ($root) => {
    const CTX = $('body').data('ctx') || '';
    const $host = $root.find('.product-slider');
    if (!$host.length) return;

    $host.empty();

    $.getJSON(`${CTX}/api/products?currentPage=1&pageSize=12`)
      .done((res) => {
        const list = (res && res.list) || [];
        if (!list.length) {
          $host.append('<p class="text-gray-500">추천 상품이 없습니다.</p>');
          return;
        }

        const $container = $('<div class="swiper select-none"></div>');
        const $wrapper   = $('<div class="swiper-wrapper"></div>');
        const onerr      = buildNoImageOnError();

        list.forEach((p) => {
          const file = p.fileName ? encodeURIComponent(p.fileName) : 'noimage.png';
          const src  = `${CTX}/images/uploadFiles/${file}`;
          const $slide = $(`
            <div class="swiper-slide" data-prodno="${p.prodNo || ''}">
              <div class="h-full flex flex-col items-center justify-start">
                <img class="w-full aspect-[4/3] object-cover rounded-nv border border-naver-gray-100"
                     src="${src}" alt="${p.prodName || ''}" onerror="${onerr}">
                <div class="mt-3 w-full text-center">
                  <div class="text-sm font-semibold text-gray-900 truncate">${p.prodName || ''}</div>
                  <div class="text-sm text-gray-600">${(p.price||0).toLocaleString('ko-KR')}원</div>
                </div>
              </div>
            </div>
          `);
          $wrapper.append($slide);
        });

        const $navPrev = $('<div class="swiper-button-prev"></div>');
        const $navNext = $('<div class="swiper-button-next"></div>');
        const $dots    = $('<div class="swiper-pagination"></div>');

        $container.addClass('h-auto');
        $container.append($wrapper, $navPrev, $navNext, $dots);
        $host.append($container);

        // 🟩 카드 클릭 → 상세 Ajax + pushState
        $host.on('click', '.swiper-slide', function () {
          const no  = $(this).attr('data-prodno');
          const pretty = `${CTX}/product/getProduct?prodNo=${encodeURIComponent(no)}`;
          const partial = `${pretty} .container:first`;

          if (w.__layout && __layout.loadMain) {
            __layout.loadMain(partial);
            if (w.history && w.history.pushState) {
              w.history.pushState({ view: 'product-detail', prodNo: no, partial }, '', pretty);
            }
          } else {
            w.location.href = pretty;
          }
        });

        ensureSwiperThen(() => {
          new w.Swiper($container[0], {
            loop: true,
            speed: 450,
            autoplay: { delay: 4500, disableOnInteraction: false },
            slidesPerView: 4,
            spaceBetween: 16,
            grabCursor: true,
            navigation: { nextEl: $navNext[0], prevEl: $navPrev[0] },
            pagination: { el: $dots[0], clickable: true },
            breakpoints: {
              0:    { slidesPerView: 1, spaceBetween: 12 },
              600:  { slidesPerView: 2, spaceBetween: 14 },
              900:  { slidesPerView: 3, spaceBetween: 16 },
              1280: { slidesPerView: 4, spaceBetween: 16 }
            }
          });
        });
      })
      .fail(() => {
        $host.append('<p class="text-red-500">추천 상품을 불러오지 못했습니다.</p>');
      });
  };

  // 🟩 popstate 복원 (뒤로가기/앞으로가기)
  w.addEventListener('popstate', (e) => {
    const CTX = $('body').data('ctx') || '';
    const state = e.state;
    if (!state) {
      // 홈 복귀
      if (w.__layout && __layout.loadMain) {
        __layout.loadMain(`${CTX}/layout/home.jsp [data-page=home]:first`);
      }
      return;
    }

    if (state.view === 'product-detail') {
      if (w.__layout && __layout.loadMain) {
        __layout.loadMain(state.partial);
      }
      return;
    }
  });

  // 레이아웃 훅
  $(d).on('view:afterload', (_e, payload) => {
    const $main = (payload && payload.$main) ? payload.$main : $('#mainArea');
    const $home = $main.find('[data-page="home"], [data-view="home"]');
    if ($home.length) initHome($home);
  });

  // 최초 진입
  $(() => {
    const $home = $('#mainArea').find('[data-page="home"], [data-view="home"]');
    if ($home.length) initHome($home);
  });
})(window, document, window.jQuery);

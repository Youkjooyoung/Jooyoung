// getProduct.js
(function ($, w, d) {
  'use strict';
  if (!$) return;

  // SPA(partial) / full reload 모두에서 동작
  function boot($scope) {
    const $root = ($scope && $scope.length) ? $scope : $('#mainArea [data-page="product-detail"], .product-detail-wrap');
    if (!$root.length) return;

    const CTX = $('body').data('ctx') || $root.closest('body').data('ctx') || '';
    const prodNo = String($root.data('prodno') || '');

    // 썸네일 클릭 → 메인 이미지 교체
    const $main = $root.find('#mainImg');
    const $thumbs = $root.find('#thumbList');
    if ($main.length && $thumbs.length) {
      $thumbs.off('click.getprod').on('click.getprod', 'img', function () {
        const src = this.getAttribute('src');
        if (src) {
          $main.attr('src', src);
          $thumbs.find('img').removeClass('active');
          this.classList.add('active');
        }
      });
    }

    // 구매하기(앵커) : __layout 이 있으면 partial 로, 없으면 기본 이동
    $root.off('click.buy').on('click.buy', 'a.js-buy', function (e) {
      const url = this.getAttribute('href');
      const embed = this.getAttribute('data-embed') === '1';
      if (embed && w.__layout && typeof __layout.loadMain === 'function') {
        e.preventDefault();
        __layout.loadMain(`${url}&embed=1 .container:first`);
        if (w.history && w.history.pushState) {
          w.history.pushState({ pretty: url, partial: `${url}&embed=1 .container:first` }, '', url);
        }
      }
    });

    // 장바구니: 필요시 AJAX 처리로 확장 가능. 기본은 링크 이동 유지
    $root.off('click.cart').on('click.cart', 'a.js-cart', function (e) {
      // 확장 포인트
    });

    // (옵션) 서버가 이미 그려줬지만, API 기반으로 보강하고 싶다면 아래 주석을 참고
    // fetchDetailAndEnhance(CTX, prodNo, $root);
  }

  // API 보강용(선택)
  function fetchDetailAndEnhance(CTX, prodNo, $root) {
    if (!CTX || !prodNo) return;
    $.getJSON(`${CTX}/api/products/${encodeURIComponent(prodNo)}`)
      .done((p) => {
        if (!p) return;
        // 이름/가격/재고/설명/메타 등 서버 렌더 내용을 덮어써 최신화
        $root.find('.prod-name').text(p.prodName || '');
        $root.find('.prod-price').text(`${Number(p.price || 0).toLocaleString('ko-KR')}원`);
        const stock = Number(p.stockQty || 0);
        $root.attr('data-stock', stock);
        $root.find('.prod-status').html(
          stock > 0 ? `<span class="badge badge-green">재고 ${stock}개</span>`
                    : `<span class="badge badge-red">품절</span>`
        );
        if (p.prodDetail) $root.find('.prod-desc').html(p.prodDetail);

        // 이미지 갱신
        $.getJSON(`${CTX}/api/products/${encodeURIComponent(prodNo)}/images`)
          .done((imgs = []) => {
            const $thumbs = $root.find('#thumbList').empty();
            if (!imgs.length) {
              $thumbs.append(`<img src="${CTX}/images/uploadFiles/noimage.png" class="active" alt="이미지 없음">`);
              return;
            }
            imgs.forEach((it, i) => {
              const c = i === 0 ? 'active' : '';
              $thumbs.append(`<img src="${CTX}/images/uploadFiles/${encodeURIComponent(it.fileName)}" class="${c}" alt="썸네일 ${i + 1}">`);
            });
            // 첫 장을 메인으로
            const first = imgs[0] && imgs[0].fileName
              ? `${CTX}/images/uploadFiles/${encodeURIComponent(imgs[0].fileName)}`
              : `${CTX}/images/uploadFiles/noimage.png`;
            $root.find('#mainImg').attr('src', first);
          });
      });
  }

  // ① 풀 리로드
  $(function () { boot(); });

  // ② SPA(Fragment) 교체 후
  $(d).on('view:afterload', function (_e, payload) {
    if (payload && payload.page === 'product-detail') {
      boot(payload.$main || $('#mainArea'));
    }
  });

})(jQuery, window, document);

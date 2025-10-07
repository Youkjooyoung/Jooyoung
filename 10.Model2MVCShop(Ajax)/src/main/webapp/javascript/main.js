// /javascript/main.js
(function (w, d, $) {
  'use strict';
  if (!$) return;

  $(function () {
    var CTX = $('body').data('ctx') || '';
    var $slider = $('.product-slider');

    $.ajax({
      url: CTX + '/api/products/list',
      method: 'GET',
      dataType: 'json'
    }).done(function (res) {
      if (!(res && res.list && res.list.length)) {
        $slider.append('<p class="text-muted">추천 상품이 없습니다.</p>');
        return;
      }

      // 카드 DOM 추가
      $.each(res.list, function (i, p) {
        var card = $(
          '<div class="product-card">\
             <img src="'+ CTX + '/upload/' + (p.fileName || '') + '" alt="'+ (p.prodName || '상품') +'"/>\
             <div class="name">'+ (p.prodName || '') +'</div>\
             <div class="price">'+ (p.price ? p.price.toLocaleString() + '원' : '') +'</div>\
           </div>'
        );
        $slider.append(card);
      });

      // 상태 플래그
      var wasSwipe = false;
      var lastSwipeDir = null;
      var wheelLock = false;

      // slick 초기화
      $slider.on('init', function (event, slick) {
        // 휠 이벤트는 .slick-list에 거는게 제일 안정적
        var $list = $(slick.$list);

        var wheelHandler = function (e) {
          // 여러 브라우저 이벤트 호환
          var oe = e.originalEvent || e;
          var deltaY = oe.deltaY || (-oe.wheelDelta) || oe.detail;

          // 한 번에 연속 호출 방지
          if (wheelLock) {
            e.preventDefault && e.preventDefault();
            return;
          }
          wheelLock = true;
          setTimeout(function () { wheelLock = false; }, 250);

          // 현재 인덱스 -> 3장 이동
          var cur = $slider.slick('slickCurrentSlide');
          var step = (deltaY > 0 ? +2 : -2);
          $slider.slick('slickGoTo', cur + step);

          e.preventDefault && e.preventDefault();
          return false;
        };

        // jQuery + native 둘 다 등록 (passive 제어용)
        $list.on('wheel DOMMouseScroll mousewheel', wheelHandler);
        if ($list[0] && $list[0].addEventListener) {
          $list[0].addEventListener('wheel', wheelHandler, { passive: false });
        }
      });

      $slider.slick({
        centerMode: true,
        /*centerPadding: '10px',*/
        slidesToShow: 3,
        slidesToScroll: 1,     // 기본 이동 1장 (스와이프/휠은 커스텀으로 다중 이동 처리)
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        dots: true,
        waitForAnimate: false, // 애니메이션 중에도 명령 처리
        responsive: [
          { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 }},
          { breakpoint: 900,  settings: { slidesToShow: 2, slidesToScroll: 1 }},
          { breakpoint: 600,  settings: { slidesToShow: 1, slidesToScroll: 1 }}
        ]
      });

      // slick 기본 스와이프(1장) 후에 한 장 더 이동해서 총 2장
      $slider.on('swipe', function (event, slick, direction) {
        wasSwipe = true;
        lastSwipeDir = direction; // 'left' or 'right'
      });

      $slider.on('afterChange', function () {
        if (!wasSwipe) return;
        wasSwipe = false;

        var cur = $slider.slick('slickCurrentSlide');
        var step = (lastSwipeDir === 'left') ? +1 : -1; // 이미 1장 이동된 상태에서 추가 1장
        $slider.slick('slickGoTo', cur + step);
      });

    }).fail(function (xhr) {
      console.error('상품 불러오기 실패:', xhr.status);
      $slider.append('<p class="text-red">상품을 불러오지 못했습니다.</p>');
    });
  });

})(window, document, window.jQuery);

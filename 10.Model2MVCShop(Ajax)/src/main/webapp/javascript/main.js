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

      //  카드 DOM 추가 (prodNo 속성 포함)
      $.each(res.list, function (i, p) {
        var prodNo = p.prodNo || '';
        var fileName = p.fileName || '';
        var prodName = p.prodName || '';
        var price = p.price ? p.price.toLocaleString() + '원' : '';

        var card = $(
          '<div class="product-card" data-prodno="' + prodNo + '">\
             <img src="' + CTX + '/upload/' + fileName + '" alt="' + prodName + '"/>\
             <div class="name">' + prodName + '</div>\
             <div class="price">' + price + '</div>\
           </div>'
        );
        $slider.append(card);
      });

      // 상품 클릭 → 상세보기 이동
      $slider.on('click', '.product-card', function () {
        var prodNo = $(this).data('prodno');
        if (!prodNo) return;
        w.location.href = CTX + '/product/getProduct?prodNo=' + prodNo;
      });

      // ================= slick 초기화 =================
      var wasSwipe = false;
      var lastSwipeDir = null;
      var wheelLock = false;

      $slider.on('init', function (event, slick) {
        var $list = $(slick.$list);

        var wheelHandler = function (e) {
          var oe = e.originalEvent || e;
          var deltaY = oe.deltaY || (-oe.wheelDelta) || oe.detail;
          if (wheelLock) {
            e.preventDefault && e.preventDefault();
            return;
          }
          wheelLock = true;
          setTimeout(function () { wheelLock = false; }, 250);

          var cur = $slider.slick('slickCurrentSlide');
          var step = (deltaY > 0 ? +2 : -2);
          $slider.slick('slickGoTo', cur + step);
          e.preventDefault && e.preventDefault();
          return false;
        };

        $list.on('wheel DOMMouseScroll mousewheel', wheelHandler);
        if ($list[0] && $list[0].addEventListener) {
          $list[0].addEventListener('wheel', wheelHandler, { passive: false });
        }
      });

      $slider.slick({
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        dots: true,
        waitForAnimate: false,
        responsive: [
          { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 }},
          { breakpoint: 900,  settings: { slidesToShow: 2, slidesToScroll: 1 }},
          { breakpoint: 600,  settings: { slidesToShow: 1, slidesToScroll: 1 }}
        ]
      });

      // 스와이프 후 추가 이동 처리
      $slider.on('swipe', function (event, slick, direction) {
        wasSwipe = true;
        lastSwipeDir = direction;
      });

      $slider.on('afterChange', function () {
        if (!wasSwipe) return;
        wasSwipe = false;
        var cur = $slider.slick('slickCurrentSlide');
        var step = (lastSwipeDir === 'left') ? +1 : -1;
        $slider.slick('slickGoTo', cur + step);
      });

    }).fail(function (xhr) {
      console.error('상품 불러오기 실패:', xhr.status);
      $slider.append('<p class="text-red">상품을 불러오지 못했습니다.</p>');
    });
  });

})(window, document, window.jQuery);

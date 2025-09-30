/* recentProduct.js */
(function(w, $) {
  'use strict';
  if (!$) return;

  var C = $('body').data('ctx') || '',
      BASE = ['/upload/uploadFiles/', '/upload/'],   // 서버 실제 경로 순서대로
      NOIMG = C + '/images/noimage.gif',
      $box = $('#preview-box'),
      $img = $('#preview-img');

  // preview-box 동적 생성 (없으면)
  if (!$box.length) {
    $box = $('<div id="preview-box" aria-hidden="true"/>').appendTo('body');
    $img = $('<img id="preview-img" alt="상품 이미지 미리보기">').appendTo($box);
  }

  // 스타일 적용
  $box.css({
    position: 'absolute',
    display: 'none',
    zIndex: 99999,
    background: '#fff',
    border: '1px solid #ddd',
    padding: 4,
    boxShadow: '0 2px 6px rgba(0,0,0,.15)',
    borderRadius: 4
  });
  $img.css({
    maxWidth: 220,
    maxHeight: 220,
    display: 'block'
  });

  // 경로 인코딩
  function encPath(p) {
    return (p || '').replace(/[^\/]+/g, function(s) { return encodeURIComponent(s); });
  }

  // 파일명 → 가능한 URL 후보
  function urls(name) {
    if (!name) return [];
    if (/^https?:\/\//i.test(name)) return [name];
    if (name.charAt(0) === '/') return [C + encPath(name.replace(/^\//, ''))];
    name = encPath(name);
    return $.map(BASE, function(b) { return C + b + name; });
  }

  // 이미지 출력
  function show(name, e) {
    var list = urls(name), i = 0;
    function ok() {
      $box.show().css({ left: e.pageX + 14, top: e.pageY + 14 });
    }
    function next() {
      $img.off()
        .one('error', function() { (++i < list.length) ? next() : ($img.attr('src', NOIMG), ok()); })
        .one('load', ok)
        .attr('src', list[i] || NOIMG);
    }
    next();
  }

  // 이벤트 바인딩
  $(document)
    .on('mouseenter', '.recent-item', function(e) {
      show($(this).data('filename'), e);
    })
    .on('mousemove', '.recent-item', function(e) {
      $box.css({ left: e.pageX + 14, top: e.pageY + 14 });
    })
    .on('mouseleave', '.recent-item', function() {
      $box.hide();
    })
    .on('click', '.recent-item', function() {
      location.href = C + '/product/getProduct?' + $.param({ prodNo: $(this).data('prodno') });
    })
    .on('keydown', '.recent-item', function(e) {
      if (e.which === 13 || e.which === 32) { // Enter / Space
        e.preventDefault();
        $(this).click();
      }
    });

})(window, jQuery);

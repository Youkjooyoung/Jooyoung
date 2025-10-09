(function (w, d, $) {
  'use strict';
  if (!$) return;

  var editor = null;

  // ---- date utils ----
  function z2(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(y, m, d) { return y + '-' + z2(m) + '-' + z2(d); }
  function parseYmd(v) {
    var t = String(v || '').replace(/\D/g, '');
    if (t.length !== 8) return null;
    var y = +t.slice(0, 4), m = +t.slice(4, 6) - 1, d = +t.slice(6, 8);
    var dt = new Date(y, m, d);
    return (dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d) ? dt : null;
  }

  function setISO($input, iso) {
    $input.val(iso);
    var $hidden = $('#manuDateHidden');
    if ($hidden.length) {
      $hidden.val(iso.replace(/-/g, ''));
    }
  }

  function closePicker() {
    $('.nv-datepicker,.nv-dp-mask').remove();
    $(d).off('keydown.nvdp');
  }

  // ---- datepicker (네이버 스타일) ----
  function grid(base, selISO) {
    var y = base.getFullYear(), m = base.getMonth();
    var f = new Date(y, m, 1), s = new Date(y, m, 1 - f.getDay());
    var days = ['일', '월', '화', '수', '목', '금', '토'];
    var html = '<div class="nv-dp-grid">';
    for (var i = 0; i < 7; i++) html += '<div class="nv-dp-cell is-dow">' + days[i] + '</div>';
    var t = new Date(), tISO = ymd(t.getFullYear(), t.getMonth() + 1, t.getDate());
    for (var r = 0; r < 6; r++) {
      for (var c = 0; c < 7; c++) {
        var cur = new Date(s.getFullYear(), s.getMonth(), s.getDate() + r * 7 + c);
        var iso = ymd(cur.getFullYear(), cur.getMonth() + 1, cur.getDate());
        var cls = 'nv-dp-cell' +
          (cur.getMonth() !== m ? ' is-muted' : '') +
          (iso === tISO ? ' is-today' : '') +
          (iso === selISO ? ' is-sel' : '');
        html += '<div class="' + cls + '" data-iso="' + iso + '" role="button" tabindex="0">' + cur.getDate() + '</div>';
      }
    }
    html += '</div>';
    return html;
  }

  function openPicker($input) {
    if (!$input || !$input.length) return;
    closePicker();

    var sel = $input.val();
    var base = parseYmd(sel) || new Date();

    var $mask = $('<div class="nv-dp-mask"></div>').appendTo('body');
    var $dp = $('<div class="nv-datepicker" role="dialog" aria-label="날짜 선택"></div>').appendTo('body');
    var $ttl = $('<div class="nv-dp-title"></div>');
    var $prev = $('<button type="button" class="nv-dp-btn" aria-label="이전 달">&lt;</button>');
    var $today = $('<button type="button" class="nv-dp-btn" aria-label="오늘">오늘</button>');
    var $next = $('<button type="button" class="nv-dp-btn" aria-label="다음 달">&gt;</button>');
    var $nav = $('<div class="nv-dp-hd"></div>').append($prev, $today, $next);
    $dp.append($nav, $ttl);

    function render() {
      $ttl.text(base.getFullYear() + '년 ' + (base.getMonth() + 1) + '월');
      $dp.find('.nv-dp-grid').remove();
      $dp.append(grid(base, sel));
    }

    var rect = $input[0].getBoundingClientRect();
    var left = rect.left + (w.pageXOffset || d.documentElement.scrollLeft || 0);
    var top = rect.bottom + (w.pageYOffset || d.documentElement.scrollTop || 0) + 6;

    $dp.css({
      position: 'absolute', left: left + 'px', top: top + 'px',
      zIndex: 9999, background: '#fff',
      border: '1px solid #e5e8eb', borderRadius: '10px',
      boxShadow: '0 3px 10px rgba(0,0,0,.1)', padding: '12px', width: '320px'
    });

    $prev.on('click', function () { base = new Date(base.getFullYear(), base.getMonth() - 1, 1); render(); });
    $next.on('click', function () { base = new Date(base.getFullYear(), base.getMonth() + 1, 1); render(); });
    $today.on('click', function () {
      var t = new Date();
      base = new Date(t.getFullYear(), t.getMonth(), 1);
      render();
    });

    $dp.on('click', '.nv-dp-cell:not(.is-dow)', function () {
      sel = $(this).data('iso');
      setISO($input, sel);
      closePicker();
    });

    $mask.on('click', closePicker);
    $(d).on('keydown.nvdp', function (e) { if (e.which === 27) closePicker(); });
    render();
  }

  // ---- 이벤트 바인딩 ----
  $(d).on('focus', '#manuDate', function () { openPicker($(this)); });
  $(d).on('click', '.nv-cal-btn', function () { openPicker($('#manuDate')); });
  $(d).on('change blur', '#manuDate', function () {
    var dt = parseYmd($(this).val());
    if (dt) setISO($(this), ymd(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()));
  });

  // ---- price format ----
  $(d).off('keyup.price').on('keyup.price', '#price', function () {
    var raw = this.value.replace(/[^\d]/g, '');
    this.value = raw ? Number(raw).toLocaleString('ko-KR') : '';
  });

  // ---- image preview ----
  $(d).on('change', '#uploadFiles', function () {
    var $preview = $('#preview-container');
    $preview.empty();
    var files = this.files;
    if (!files || !files.length) return;

    $.each(files, function (i, f) {
      if (!f.type.match(/^image\//)) return;
      var fr = new FileReader();
      fr.onload = function (e) {
        var $thumb = $('<div class="thumb"><img><button type="button" title="삭제">&times;</button></div>');
        $thumb.find('img').attr('src', e.target.result);
        $thumb.find('button').on('click', function () { $thumb.remove(); });
        $preview.append($thumb);
      };
      fr.readAsDataURL(f);
    });
  });

  // ---- submit via REST ----
  var CTX = ($('body').data('ctx') || '');

  if (w.toastui && $('#editor').length) {
    editor = new toastui.Editor({
      el: d.querySelector('#editor'),
      height: '300px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      placeholder: '상품 상세내용을 입력하세요.'
    });
  }

  $('#btnAdd').on('click', function (e) {
    e.preventDefault();

    // --- 값 추출 ---
    var name = $('#prodName').val().trim();
    var detail = editor && editor.getHTML ? editor.getHTML().trim() : '';
    var manu = $('#manuDate').val().trim();
    var priceRaw = $('#price').val().replace(/[^\d]/g, '');
    var stockQty = $('#stockQty').val().trim();
    var files = $('#uploadFiles')[0].files;

    var plainDetail = $('<div>').html(detail).text().trim();
    var detailLength = plainDetail.length;

    // --- 검증 로직 ---
    if (!name) { alert('상품명을 입력하세요.'); return; }
    if (!detail || detailLength < 20) { alert('상품상세정보를 최소 20자 이상 입력하세요.'); return; }
    if (!manu) { alert('제조일자를 선택하세요.'); return; }
    if (!priceRaw) { alert('가격을 입력하세요.'); return; }
    if (parseInt(priceRaw, 10) <= 0) { alert('가격은 0보다 커야 합니다.'); return; }
    if (!stockQty || isNaN(stockQty) || parseInt(stockQty, 10) <= 0) {
      alert('재고수량을 1개 이상 입력하세요.');
      return;
    }
    if (!files || files.length === 0) { alert('대표 이미지를 1개 이상 첨부하세요.'); return; }

    if (!confirm('상품을 등록하시겠습니까?')) return;

    var fd = new FormData();
    fd.append('prodName', name);
    fd.append('prodDetail', detail);
    fd.append('manuDate', manu.replace(/\D/g, '').slice(0, 8));
    fd.append('price', priceRaw);
    fd.append('stockQty', stockQty);
    for (var i = 0; i < files.length; i++) fd.append('uploadFiles', files[i]);

    $.ajax({
      url: CTX + '/api/products',
      method: 'POST',
      data: fd,
      processData: false,
      contentType: false
    }).done(function (p) {
      if (p && p.prodNo) {
        location.href = CTX + '/product/getProduct?prodNo=' + p.prodNo;
      } else {
        alert('등록은 되었으나 상품번호를 받지 못했습니다. 목록으로 이동합니다.');
        location.href = CTX + '/product/listProduct';
      }
    }).fail(function (xhr) {
      alert('등록 실패 (' + xhr.status + ')');
    });
  });

})(window, document, window.jQuery);

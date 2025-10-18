(function (w, d, $) {
  'use strict';
  if (!$) return;

  var $body = $('body');
  var ctx = $body.data('ctx') || '';

  // ===== 검색 =====
  $('#btnSearch').on('click', function () {
    var cond = $('#searchCondition').val() || '0';
    var kw = $('#searchKeyword').val() || '';
    location.href =
      ctx + '/product/listProduct?menu=manage' +
      '&searchCondition=' + encodeURIComponent(cond) +
      '&searchKeyword=' + encodeURIComponent(kw);
  });

  // 엔터 검색 + 자동완성
  $('#searchKeyword').on('keyup', function (e) {
    if (e.keyCode === 13) {
      $('#btnSearch').click();
      return;
    }
    // ===== 자동완성 =====
    var cond = $('#searchCondition').val();
    var kw = $(this).val();
    var $list = $('#acList');

    if (!kw || kw.length < 2) {
      $list.empty().hide();
      return;
    }

    $.getJSON(ctx + '/api/products/suggest', { type: cond, keyword: kw })
      .done(function (res) {
        $list.empty();
        if (res && res.items && res.items.length) {
          $.each(res.items, function (i, txt) {
            $('<div/>').addClass('ac-item').text(txt).appendTo($list);
          });
          $list.show();
        } else {
          $list.hide();
        }
      });
  });

  // 자동완성 선택 → 입력 + 검색
  $('#acList').on('click', '.ac-item', function () {
    $('#searchKeyword').val($(this).text());
    $('#acList').empty().hide();
    $('#btnSearch').click();
  });

  // ===== 정렬 =====
  $('.sort-btn').on('click', function () {
    var sort = $(this).data('sort') || '';
    var cond = $('#searchCondition').val() || '0';
    var kw = $('#searchKeyword').val() || '';
    location.href =
      ctx + '/product/listProduct?menu=manage' +
      '&searchCondition=' + encodeURIComponent(cond) +
      '&searchKeyword=' + encodeURIComponent(kw) +
      '&sort=' + encodeURIComponent(sort);
  });

  // ===== 상세보기 =====
  $(d).on('click', '.btn-detail', function () {
    var no = $(this).data('prodno');
    if (no) {
      location.href = ctx + '/product/getProduct?prodNo=' + encodeURIComponent(no);
    }
  });
  
  w.addEventListener('message', function (ev) {
    try {
      if (ev && ev.data && (ev.data.type === 'status-updated' || ev.data.type === 'ack-complete')) {
        location.reload();
      }
    } catch (e) {}
  });
  
  // ===== 주문내역 모달 =====
  var $modal = $('#historyModal');
  var $iframe = $modal.find('iframe');

  // 열기
  $(d).on('click', '.btn-order-history', function () {
    var no = $(this).data('prodno');
    if (!no) return;
    var src = ctx + '/purchase/product/' + encodeURIComponent(no) + '/history?t=' + Date.now();
    $iframe.attr('src', src);
    $modal.removeClass('hidden').show();
    $body.addClass('no-scroll');
  });

  // 닫기
  $('.dlg-close').on('click', closeModal);
  $(d).on('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    $modal.hide().addClass('hidden');
    // iframe 정리
    $iframe.attr('src', 'about:blank');
    $body.removeClass('no-scroll');
  }

  // ===== 취소사유(버튼 data-reason만 알림) =====
  $(d).on('click', '.btn-cancel-reason', function () {
    var reason = $(this).data('reason');
    alert('취소 사유: ' + (reason && String(reason).trim() ? reason : '사유 없음'));
  });

  w.addEventListener('message', function (ev) {
    try {
      if (ev && ev.data && ev.data.type === 'ack-complete') {
        location.reload();
      }
    } catch (e) { /* no-op */ }
  });

  // ===== 페이지 이동(네비게이터에서 호출) =====
  w.fncGetUserList = function (pageNo) {
    var cond = $('#searchCondition').val() || '0';
    var kw = $('#searchKeyword').val() || '';
    var sort = (new URL(location.href)).searchParams.get('sort') || '';
    location.href =
      ctx + '/product/listProduct?menu=manage' +
      '&currentPage=' + encodeURIComponent(pageNo) +
      '&searchCondition=' + encodeURIComponent(cond) +
      '&searchKeyword=' + encodeURIComponent(kw) +
      '&sort=' + encodeURIComponent(sort);
  };

})(window, document, window.jQuery);

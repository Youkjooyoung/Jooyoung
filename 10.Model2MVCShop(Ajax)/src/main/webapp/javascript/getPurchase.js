// 구매상세 - 구매등록 화면과 동일한 이미지 UX + 동작
(function ($, w, d) {
  'use strict'; if (!$) return;

  const ctx = () => (w.App && w.App.ctx ? w.App.ctx() : ($('body').data('ctx') || ''));

  // ---------------------------
  // 이미지 그리드 : 더보기/접기
  // ---------------------------
  $(function () {
    const $grid = $('#imgGrid');
    const $moreBtn = $('#btnImgMore');
    if (!$grid.length || !$moreBtn.length) return;

    // 초기: 6장 초과일 때만 버튼 노출 + 접힘 상태 클래스 부여
    const $items = $grid.find('.img-box');
    if ($items.length > 6) {
      $moreBtn.show();
      // 접힘 상태를 클래스와 스타일 둘 다로 잡아준다(테마/CSS 차이 대비)
      $grid.addClass('is-collapsed').attr('data-collapsed', 'true')
           .css({ maxHeight: '', overflow: '' }); // 혹시 남아있던 인라인 제거
      // 7번째부터 숨김
      $items.each(function (i) { if (i >= 6) $(this).addClass('is-hidden').hide(); });
    } else {
      $moreBtn.hide();
    }

    $moreBtn.on('click', function () {
      const collapsed = $grid.attr('data-collapsed') === 'true';

      if (collapsed) {
        // ▶ 펼치기
        $grid.attr('data-collapsed', 'false').removeClass('is-collapsed')
             .css({ maxHeight: 'none', overflow: 'visible' }); // 확실히 풀기
        $grid.find('.img-box.is-hidden').removeClass('is-hidden').show(); // 아이템 표시
        $(this).text($(this).data('less-text') || '이미지 접기');
      } else {
        // ▶ 접기(처음 6장만 표시)
        $grid.attr('data-collapsed', 'true').addClass('is-collapsed')
             .css({ maxHeight: '', overflow: '' }); // 접힘 스타일 원복(테마가 있으면 적용됨)
        $grid.find('.img-box').each(function (i) {
          if (i >= 6) $(this).addClass('is-hidden').hide(); else $(this).show();
        });
        $(this).text($(this).data('more-text') || '이미지 더보기');
        // 접을 땐 그리드 상단으로 살짝 스크롤 보정
        $('html,body').animate({ scrollTop: $grid.offset().top - 80 }, 200);
      }
    });
  });

  // ---------------------------
  // 라이트박스 (등록화면과 동일)
  // ---------------------------
  let lbList = [], lbIdx = 0;
  function openLB(idx) {
    if (!lbList.length) return;
    lbIdx = (idx + lbList.length) % lbList.length;
    $('#lbImg').attr('src', lbList[lbIdx]);
    $('#imgLightbox').css('display', 'flex').hide().fadeIn(120);
  }
  function closeLB() { $('#imgLightbox').fadeOut(120); }

  $(d).on('click', '.img-box', function () {
    lbList = $('.img-box img').map(function () { return $(this).attr('src'); }).get();
    openLB($(this).index());
  });
  $(d).on('keydown', function (e) {
    if ($('#imgLightbox').is(':visible')) {
      if (e.key === 'Escape') return closeLB();
      if (e.key === 'ArrowLeft') return $('[data-role=lb-prev]').click();
      if (e.key === 'ArrowRight') return $('[data-role=lb-next]').click();
    }
  });
  $(d).on('click', '[data-role=lb-prev]', function () { openLB(lbIdx - 1); });
  $(d).on('click', '[data-role=lb-next]', function () { openLB(lbIdx + 1); });
  $(d).on('click', '[data-role=lb-close]', closeLB);
  $('#imgLightbox').on('click', function (e) { if (e.target === this) closeLB(); });

  // ---------------------------
  // 주문 버튼 동작 (컨트롤러 매핑 그대로)
  // ---------------------------
  // 수정
  $(d).on('click', '#btnEdit', function (e) {
    e.preventDefault();
    const tranNo = $(this).data('tranno');
    if (tranNo) w.location.href = ctx() + '/purchase/' + tranNo + '/edit';
  });

  // 취소 모달
  let cancelTranNo = null;
  $(d).on('click', '#btnCancel', function (e) {
    e.preventDefault();
    cancelTranNo = $(this).data('tranno') || null;
    if (!cancelTranNo) return;
    $('#dlg-cancel').css('display', 'flex').hide().fadeIn(120);
  });
  $(d).on('click', '[data-role=close-cancel]', function () { $('#dlg-cancel').fadeOut(120); });
  $(d).on('click', '[data-role=ok-cancel]', function () {
    if (!cancelTranNo) return;
    App.post('/purchase/' + cancelTranNo + '/cancel');
  });

  // 수령 확인 모달
  let confirmInfo = { tranNo: null, prodNo: null };
  $(d).on('click', '#btnConfirm', function (e) {
    e.preventDefault();
    confirmInfo.tranNo = $(this).data('tranno') || null;
    confirmInfo.prodNo = $(this).data('prodno') || null;
    if (!confirmInfo.tranNo || !confirmInfo.prodNo) return;
    $('#dlg-confirm').css('display', 'flex').hide().fadeIn(120);
  });
  $(d).on('click', '[data-role=close-confirm]', function () { $('#dlg-confirm').fadeOut(120); });
  $(d).on('click', '[data-role=ok-confirm]', function () {
    if (!confirmInfo.tranNo) return;
    App.post('/purchase/' + confirmInfo.tranNo + '/confirm', { prodNo: confirmInfo.prodNo });
  });

})(jQuery, window, document);

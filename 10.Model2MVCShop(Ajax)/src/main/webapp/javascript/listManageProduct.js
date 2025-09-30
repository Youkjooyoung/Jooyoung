(function(w, $, d) {
  'use strict';
  if (!$) return;

  function ctx() {
    return (w.App && App.ctx ? App.ctx() : $('body').data('ctx') || '');
  }

  // -------------------------------
  // 취소사유 모달
  // -------------------------------
  function ensureReasonModal() {
    var $dlg = $('#reasonViewDlg');
    if ($dlg.length) return $dlg;
    $dlg = $(
      '<div id="reasonViewDlg" class="dlg-mask" role="dialog" aria-modal="true" aria-label="취소 사유">'+
        '<div class="dlg">'+
          '<div class="dlg-hd">취소 사유</div>'+
          '<div class="dlg-bd"><div class="reason-ct" style="white-space:pre-wrap;min-height:80px;"></div></div>'+
          '<div class="dlg-ft"><button type="button" class="ct_btn01 dlg-close">닫기</button></div>'+
        '</div>'+
      '</div>'
    ).appendTo('body');
    return $dlg;
  }

  // -------------------------------
  // 주문내역 모달
  // -------------------------------
  function ensureHistoryModal() {
    var $dlg = $('#historyModal');
    if ($dlg.length) return $dlg;
    $dlg = $(
      '<div id="historyModal" class="dlg-mask" role="dialog" aria-modal="true" aria-label="주문내역">'+
        '<div class="dlg dlg-lg">'+
          '<div class="dlg-hd">주문내역</div>'+
          '<div class="dlg-bd"><iframe class="dlg-iframe" title="주문내역" style="width:100%;height:520px;border:0;"></iframe></div>'+
          '<div class="dlg-ft"><button type="button" class="ct_btn01 dlg-close">닫기</button></div>'+
        '</div>'+
      '</div>'
    ).appendTo('body');
    return $dlg;
  }

  // -------------------------------
  // 이벤트 바인딩
  // -------------------------------

  // 상품 상세 이동
  $(d).on('click','.prod-link', function(e){
    e.preventDefault();
    var no = $(this).data('prodno');
    if (no) App.go('/product/getProduct', { prodNo:no });
  });

  // 배송상태 변경
  $(d).on('click','.btn-ship', function(e){
    e.preventDefault();
    var no = $(this).data('prodno'), code = $(this).data('trancode');
    if (!no || !code) return;
    App.ajaxPost('/purchase/product/' + no + '/status', { tranCode: code })
      .done(function(){ location.reload(); })
      .fail(function(x){ alert('상태 변경 실패: ' + x.status); });
  });

  // 취소확인 (004 → 005)
  $(d).on('click','.btn-ack-cancel', function(e){
    e.preventDefault();
    var no = $(this).data('prodno');
    if (!no) return;
    if (!confirm('이 주문의 취소를 확인 처리하시겠습니까?')) return;
    App.ajaxPost('/purchase/product/' + no + '/status', { tranCode:'005' })
      .done(function(){ location.reload(); })
      .fail(function(x){ alert('취소확인 실패: ' + x.status); });
  });

  // 주문내역 모달
  $(d).on('click','.btn-order-history', function(e){
    e.preventDefault();
    var no = $(this).data('prodno');
    if (!no) return;

    var url = ctx() + '/purchase/product/' + encodeURIComponent(no) + '/history';
    var $dlg = ensureHistoryModal();
    var $frame = $dlg.find('iframe');

    $frame.off('load').on('load', function(){
      try {
        var $doc = $(this.contentDocument || this.contentWindow.document);
        $doc.find('.btn-close').hide(); // 내부 닫기버튼 숨김
      } catch(_){}
    });

    $frame.attr('src', url);
    $dlg.show();
  });

  // 취소사유 모달
  $(d).on('click','.btn-reason', function(e){
    e.preventDefault();
    var $btn = $(this);
    var txt = ($btn.data('reason') || '').toString().trim();

    // fallback: tranNo 기반 localStorage / cookie 조회
    if (!txt) {
      var tranNo = $btn.data('tranno') || $btn.closest('tr').data('tranno');
      if (tranNo) {
        try { txt = localStorage.getItem('cr:'+tranNo) || ''; } catch(_){}
        if (!txt) {
          var m = document.cookie.match(new RegExp('(?:^|; )cr_'+tranNo+'=([^;]*)'));
          txt = m ? decodeURIComponent(m[1]) : '';
        }
      }
    }

    if (!txt) txt = '(저장된 사유가 없습니다)';
    var $dlg = ensureReasonModal();
    $dlg.find('.reason-ct').text(txt);
    $dlg.show();
  });

  // 모든 모달 닫기 (공용)
  $(d).on('click','.dlg-close', function(){
    $(this).closest('.dlg-mask').hide().find('iframe').attr('src','about:blank');
  });

  // Hover 썸네일
  var $hover = $('#hoverThumb');
  if (!$hover.length) {
    $hover = $('<div id="hoverThumb" style="display:none;position:absolute;border:1px solid #ccc;background:#fff;padding:5px;z-index:999;"></div>');
    $('body').append($hover);
  }
  $(d).on('mouseenter','.prod-link', function(e){
    var name = $(this).data('filename'); if (!name) return;
    var src = ctx() + '/upload/uploadFiles/' + encodeURIComponent(name);
    $hover.html("<img src='"+src+"' width='150' height='150' alt='thumbnail'/>")
          .css({ top:e.pageY+15, left:e.pageX+15, display:'block' });
  }).on('mousemove','.prod-link', function(e){
    $hover.css({ top:e.pageY+15, left:e.pageX+15 });
  }).on('mouseleave','.prod-link', function(){
    $hover.hide().empty();
  });

  // 페이징
  $(d).on('click', '.pagination .page-link', function(e){
    e.preventDefault();
    var $t = $(this);
    if ($t.hasClass('disabled')) return;
    var p = $t.data('page') || parseInt($.trim($t.text()), 10) || 1;
    if (typeof w.fncGetUserList === 'function') w.fncGetUserList(p);
  });

  // pageNavigator.jsp 에서 호출
  w.fncGetUserList = function(page){
    App.go('/product/listProduct', {
      currentPage: page || 1,
      menu: $('#menu').val() || 'manage',
      sort: $('#sort').val() || ''
    });
  };

})(window, window.jQuery, document);

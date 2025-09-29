// /javascript/listManageProduct.js
(function(w, $) {
  'use strict'; if (!$) return;

  function C(){ return (w.App && App.ctx ? App.ctx() : $('body').data('ctx') || ''); }

  // 주문내역 모달
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
    $dlg.on('click', '.dlg-close', function(){
      $dlg.hide().find('iframe').attr('src','about:blank');
    });
    return $dlg;
  }

  // 상품상세
  $(document).off('click','.prod-link').on('click','.prod-link', function(e){
    e.preventDefault(); e.stopPropagation();
    var no = $(this).data('prodno');
    if (no) App.go('/product/getProduct', { prodNo:no });
  });

  // 배송상태 변경
  $(document).off('click','.btn-ship').on('click','.btn-ship', function(e){
    e.preventDefault(); e.stopPropagation();
    var no = $(this).data('prodno'), code = $(this).data('trancode');
    if (!no || !code) return;
    App.ajaxPost('/purchase/product/' + no + '/status', { tranCode: code })
      .done(function(){ location.reload(); })
      .fail(function(x){ alert('상태 변경 실패: ' + x.status); });
  });

  // 취소확인(004→005)
  $(document).off('click','.btn-ack-cancel').on('click','.btn-ack-cancel', function(e){
    e.preventDefault(); e.stopPropagation();
    var no = $(this).data('prodno'); if (!no) return;
    if (!confirm('이 주문의 취소를 확인 처리하시겠습니까?')) return;
    App.ajaxPost('/purchase/product/' + no + '/status', { tranCode:'005' })
      .done(function(){ location.reload(); })
      .fail(function(x){ alert('취소확인 실패: ' + x.status); });
  });

  // 주문내역 모달 (페이지 이동 방지)
  $(document).off('click','.btn-order-history').on('click','.btn-order-history', function(e){
    e.preventDefault(); e.stopPropagation();
    var no = $(this).data('prodno'); if (!no) return;
    var url = C() + '/purchase/product/' + encodeURIComponent(no) + '/history';
    var $dlg = ensureHistoryModal();
    var $frame = $dlg.find('iframe');

    $frame.off('load').on('load', function(){
      try{
        var $doc = $(this.contentDocument || this.contentWindow.document);
        // 팝업 내부 닫기버튼은 모달에 맡기므로 숨김
        $doc.find('.btn-close').hide();
      }catch(_){}
    });

    $frame.attr('src', url);
    $dlg.show();
  });

  // Hover 썸네일
  var $hover = $('#hoverThumb');
  if (!$hover.length) {
    $hover = $('<div id="hoverThumb" style="display:none;position:absolute;border:1px solid #ccc;background:#fff;padding:5px;z-index:999;"></div>');
    $('body').append($hover);
  }
  $(document).on('mouseenter','.prod-link', function(e){
    var name = $(this).data('filename'); if (!name) return;
    var src = C() + '/upload/uploadFiles/' + encodeURIComponent(name);
    $hover.html("<img src='"+src+"' width='150' height='150' alt='thumbnail'/>")
          .css({ top:e.pageY+15, left:e.pageX+15, display:'block' });
  }).on('mousemove','.prod-link', function(e){
    $hover.css({ top:e.pageY+15, left:e.pageX+15 });
  }).on('mouseleave','.prod-link', function(){
    $hover.hide().empty();
  });

  // 페이징 클릭
  $(document).on('click', '.pagination .page-link', function(e){
    e.preventDefault(); e.stopPropagation();
    var $t = $(this);
    if ($t.hasClass('disabled')) return;
    var p = $t.data('page');
    if (!p){
      var n = parseInt($.trim($t.text()).replace(/\D/g,''), 10);
      p = isNaN(n) ? 1 : n;
    }
    if (typeof w.fncGetUserList === 'function') w.fncGetUserList(p);
  });

  // pageNavigator.jsp에서 호출하는 함수(복구)
  w.fncGetUserList = function(page){
    App.go('/product/listProduct', {
      currentPage: page || 1,
      menu: $('#menu').val() || 'manage',
      sort: $('#sort').val() || ''
    });
  };

})(window, window.jQuery);

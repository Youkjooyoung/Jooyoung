// /javascript/cancel-order.js
(function(w,d){
  'use strict';
  var $ = w.jQuery; if(!$) return;

  function C(){ return (w.App && App.ctx ? App.ctx() : d.body.getAttribute('data-ctx') || ''); }
  function setCookie(k,v,days){
    var ex = new Date(); ex.setDate(ex.getDate() + (days||365));
    document.cookie = k + '=' + encodeURIComponent(v) + '; path=/; expires=' + ex.toUTCString();
  }

  function ensureDialog(){
    var $dlg = $('#cancelReasonDialog');
    if ($dlg.length) return $dlg;
    var html =
      '<div id="cancelReasonDialog" class="dlg-mask" role="dialog" aria-modal="true" aria-label="주문 취소 사유">'+
        '<div class="dlg">'+
          '<div class="dlg-hd">주문 취소 사유</div>'+
          '<div class="dlg-bd">'+
            '<textarea class="dlg-txt" placeholder="취소 사유를 입력하세요(필수)" rows="6" style="width:100%;"></textarea>'+
          '</div>'+
          '<div class="dlg-ft">'+
            '<button type="button" class="ct_btn01 dlg-ok">확인</button>'+
            '<button type="button" class="ct_btn01 dlg-cancel">닫기</button>'+
          '</div>'+
        '</div>'+
      '</div>';
    return $(html).appendTo('body');
  }

  function openCancelDialog(tranNo, onDone){
    var $dlg = ensureDialog(), $txt = $dlg.find('.dlg-txt');
    try { $txt.val(localStorage.getItem('cr:'+tranNo) || ''); } catch(_){}
    $dlg.show();

    $dlg.off('click.dlg')
      .on('click.dlg','.dlg-cancel',function(){ $dlg.hide(); })
      .on('click.dlg','.dlg-ok',function(){
        var reason = $.trim($txt.val());
        if (!reason){ alert('취소 사유를 입력해 주세요.'); $txt.focus(); return; }
        try { localStorage.setItem('cr:'+tranNo, reason); } catch(_){}
        setCookie('cr_'+tranNo, reason, 365);
        $dlg.hide();
        onDone && onDone(reason);
      });
  }

  // 규칙: form method/action 없음 → JS에서만 생성
  function postCancel(url, data){
    var $f = $('<form>').css('display','none');
    $f.attr({ action:url, method:'post' });
    $.each(data||{}, function(k,v){ $('<input type="hidden">').attr({name:k, value:v}).appendTo($f); });
    $(d.body).append($f);
    $f[0].submit();
  }

  $(function(){
    $(d).off('click', '#btnCancel').on('click', '#btnCancel', function(e){
      e.preventDefault(); e.stopPropagation();
      var tranNo = $(this).data('tranno') || $(this).data('tranNo');
      var url    = $(this).data('url')    || (C() + '/purchase/' + encodeURIComponent(tranNo) + '/cancel');
      if (!tranNo){ alert('거래번호가 없습니다.'); return; }

      openCancelDialog(tranNo, function(){
        if (!w.confirm('주문을 정말 취소하시겠습니까?')) return;
        var reason = (function(){
          var r = '';
          try { r = localStorage.getItem('cr:'+tranNo) || ''; } catch(_){}
          return r;
        })();
        postCancel(url, { reason: reason });
      });
    });
  });
})(window, document);

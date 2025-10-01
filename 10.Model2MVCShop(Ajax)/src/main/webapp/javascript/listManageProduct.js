(function (w, $, d) {
  'use strict';
  if (!w.jQuery) return;

  var CTX = $('body').data('ctx') || '';
  var $doc = $(d);

  // ===== 유틸 =====
  var esc = function(s){ return (s==null?'':String(s)).replace(/[&<>"']/g, function(m){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];}); };
  var fmtPrice = function(n){ return (n==null)?'-':String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  var fmtDate = function(s){ if(!s) return ''; s=String(s).replace(/[^0-9]/g,''); return (s.length===8)? (s.substr(0,4)+'-'+s.substr(4,2)+'-'+s.substr(6,2)) : s; };
  w.latestInfoOf = function(map, no){ if(!map) return {}; var k=no, k2=String(no); return map[k]||map[k2]||{}; };

  // ===== 상태 라벨 =====
  var statusLabel = {
    '':     '판매중',
    '001':  '재고없음',
    '002':  '재고없음',
    '003':  '배송완료',
    '004':  '<span class="text-red">취소요청</span>',
    '005':  '취소확인'
  };

  // ===== 버튼들 =====
  function orderBtns(prodNo){
    return '<div class="btn-group"><button type="button" class="btn-gray btn-order-history" data-prodno="'+prodNo+'">주문내역</button></div>';
  }
  function cancelBtns(info, prodNo){
    var reason = esc(info.cancelReason||'');
    return '<div class="btn-group">'
         + '<button type="button" class="btn-green btn-reason" data-reason="'+reason+'">사유보기</button>'
         + '<button type="button" class="btn-green btn-ack-cancel" data-prodno="'+prodNo+'">취소확인</button>'
         + '<button type="button" class="btn-gray btn-order-history" data-prodno="'+prodNo+'">주문내역</button>'
         + '</div>';
  }
  function shipCellBy(code, prodNo){
    if (code==='001') return '<button type="button" class="btn-green btn-ship" data-prodno="'+prodNo+'" data-trancode="002">배송하기</button>';
    if (code==='002') return '배송중';
    if (code==='003') return '배송완료';
    return '-';
  }

  // ===== 행 렌더러 (공용으로 export) =====
  w.renderRow = function(p, info){
    var code = info.tranCode || p.tranStatusCode || '';
    var buyerId = (code==='004'||code==='005') ? '-' : (info.buyerId || p.buyerId || '-');
    var buyDate = (code==='004'||code==='005') ? '-' : (info.orderDate || p.buyDate || '-');
    var statusCell = (code==='004') ? (statusLabel[code] + ' ' + cancelBtns(info, p.prodNo))
                                    : (statusLabel[code] || statusLabel['']) + ' ' + orderBtns(p.prodNo);
    return '<tr data-prodno="'+p.prodNo+'">'
         +   '<td>'+p.prodNo+'</td>'
         +   '<td><span class="prod-link" data-prodno="'+p.prodNo+'" data-filename="'+esc(p.fileName||'')+'">'+esc(p.prodName)+'</span></td>'
         +   '<td>'+fmtPrice(p.price)+' 원</td>'
         +   '<td>'+fmtDate(p.manuDate || p.formattedManuDate || '')+'</td>'
         +   '<td>'+esc(buyerId)+'</td>'
         +   '<td>'+fmtDate(buyDate)+'</td>'
         +   '<td>'+statusCell+'</td>'
         +   '<td>'+shipCellBy(code, p.prodNo)+'</td>'
         + '</tr>';
  };

  // ===== 모달 =====
  function ensureReasonModal(){
    var $dlg = $('#reasonViewDlg');
    if ($dlg.length) return $dlg;
    return $('<div id="reasonViewDlg" class="dlg-mask" role="dialog" aria-modal="true" aria-label="취소 사유">'
      +  '<div class="dlg">'
      +    '<div class="dlg-hd">취소 사유</div>'
      +    '<div class="dlg-bd"><div class="reason-ct" style="white-space:pre-wrap;min-height:80px;"></div></div>'
      +    '<div class="dlg-ft"><button type="button" class="ct_btn01 dlg-close">닫기</button></div>'
      +  '</div>'
      +'</div>').appendTo('body');
  }
  function ensureHistoryModal(){ return $('#historyModal'); }

  // ===== 이벤트 바인딩 =====
  $doc.on('click','.prod-link', function(e){
    e.preventDefault();
    var no=$(this).data('prodno');
    if(no){ App.go('/product/getProduct', { prodNo:no }); }
  });

  $doc.on('click','.btn-ship', function(e){
    e.preventDefault();
    var no=$(this).data('prodno'), code=$(this).data('trancode'); if(!no||!code) return;
    $.post(CTX+'/purchase/product/'+no+'/status', { tranCode:code })
      .done(function(){ location.reload(); })
      .fail(function(x){ alert('상태 변경 실패: '+x.status); });
  });

  $doc.on('click','.btn-ack-cancel', function(e){
    e.preventDefault();
    var no=$(this).data('prodno'); if(!no) return;
    if(!confirm('이 주문의 취소를 확인 처리하시겠습니까?')) return;
    $.post(CTX+'/purchase/product/'+no+'/status', { tranCode:'005' })
      .done(function(){ location.reload(); })
      .fail(function(x){ alert('취소확인 실패: '+x.status); });
  });

  $doc.on('click','.btn-order-history', function(e){
    e.preventDefault();
    var no=$(this).data('prodno'); if(!no) return;
    var $dlg=ensureHistoryModal(), $frame=$dlg.find('iframe');
    $frame.off('load').on('load', function(){ try{ $(this.contentDocument||this.contentWindow.document).find('.btn-close').hide(); }catch(_){ } });
    $frame.attr('src', CTX + '/purchase/product/' + encodeURIComponent(no) + '/history');
    $dlg.show();
  });

  $doc.on('click','.btn-reason', function(e){
    e.preventDefault();
    var txt = String($(this).data('reason')||'').trim() || '(저장된 사유가 없습니다)';
    var $dlg = ensureReasonModal(); $dlg.find('.reason-ct').text(txt); $dlg.show();
  });

  $doc.on('click','.dlg-close', function(){ $(this).closest('.dlg-mask').hide().find('iframe').attr('src','about:blank'); });

})(window, window.jQuery, document);

(function (w, $, d) {
  'use strict';

  // jQuery 보장
  if (!w.jQuery) { console.error('jQuery not loaded'); return; }

  var CTX = $('body').data('ctx') || '';
  
  function q(params){
    return (CTX || '') + '/api/products?' + $.param(params);
  }

  // === DOM 캐시 ===
  var $body   = $('#listBody');
  var $loader = $('#infiniteLoader');
  var $eol    = $('#endOfList');

  var state = { page:1, pageSize:10, loading:false, done:false, cond:'0', kw:'', sort:'' };

  function esc(s){ return (s==null?'':String(s)).replace(/[&<>"']/g, function(m){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];}); }
  function fmtPrice(n){ return (n==null)?'-':String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function latestInfoOf(map, prodNo){ if(!map) return {}; var k=prodNo, k2=String(prodNo); return map[k]||map[k2]||{}; }
  function fmtDate(s) {
    if (!s) return '';
    s = String(s).replace(/[^0-9]/g, ''); // 숫자만
    if (s.length===8) {
      return s.substring(0,4)+'-'+s.substring(4,6)+'-'+s.substring(6,8);
    }
    return s;
  }

  // ========= 행 렌더러 =========
  function renderRow(p, info){
    var code = info.tranCode || p.tranStatusCode || '';
    var buyerId = (code==='004'||code==='005') ? '-' : (info.buyerId || p.buyerId || '-');
    var buyDate = (code==='004'||code==='005') ? '-' : (info.orderDate || p.buyDate || '-');
    var statusCell = '판매중 <div class="btn-group"><button type="button" class="btn-gray btn-order-history" data-prodno="'+p.prodNo+'">주문내역</button></div>';
    if (code==='001'||code==='002') statusCell = '재고없음 <div class="btn-group"><button type="button" class="btn-gray btn-order-history" data-prodno="'+p.prodNo+'">주문내역</button></div>';
    if (code==='003') statusCell = '배송완료 <div class="btn-group"><button type="button" class="btn-gray btn-order-history" data-prodno="'+p.prodNo+'">주문내역</button></div>';
    if (code==='004') statusCell = '<span class="text-red">취소요청</span> <div class="btn-group"><button type="button" class="btn-green btn-reason" data-reason="'+esc(info.cancelReason||'')+'">사유보기</button> <button type="button" class="btn-green btn-ack-cancel" data-prodno="'+p.prodNo+'">취소확인</button> <button type="button" class="btn-gray btn-order-history" data-prodno="'+p.prodNo+'">주문내역</button></div>';

    var shipCell = '-';
    if (code==='001') shipCell = '<button type="button" class="btn-green btn-ship" data-prodno="'+p.prodNo+'" data-trancode="002">배송하기</button>';
    if (code==='002') shipCell = '배송중';
    if (code==='003') shipCell = '배송완료';

    return '<tr data-prodno="'+p.prodNo+'">' +
           '<td>'+p.prodNo+'</td>' +
           '<td><span class="prod-link" data-prodno="'+p.prodNo+'" data-filename="'+esc(p.fileName||'')+'">'+esc(p.prodName)+'</span></td>' +
           '<td>'+fmtPrice(p.price)+' 원</td>' +
           '<td>'+fmtDate(p.manuDate || p.formattedManuDate || '')+'</td>' +
           '<td>'+esc(buyerId)+'</td>' +
           '<td>'+fmtDate(buyDate)+'</td>' +
           '<td>'+statusCell+'</td>' +
           '<td>'+shipCell+'</td>' +
           '</tr>';
  }

  // ========= 목록 로딩 =========
  function loadNext(){
    if (state.loading || state.done) return;
    state.loading = true;
    $loader.show(); $eol.hide();

    var params = {
      currentPage: state.page, pageSize: state.pageSize,
      searchCondition: state.cond, searchKeyword: state.kw, sort: state.sort
    };

    console.log('[list] GET', q(params));

    $.getJSON(q(params))
      .done(function(res){
        var list = res.list || [];
        var infoMap = res.latestInfoMap || res.latestInfo || {};
        if (!list.length){
          state.done = true;
          if (state.page===1) $body.empty();
          $eol.show(); return;
        }
        var html='';
        for (var i=0;i<list.length;i++){
          var p=list[i], info=latestInfoOf(infoMap, p.prodNo);
          html += renderRow(p, info);
        }
        $body.append(html);
        state.page += 1;
        if (list.length < state.pageSize){ state.done = true; $eol.show(); }
      })
      .fail(function(x){
        console.error('[list] FAIL', x.status, x);
        alert('목록을 불러오지 못했습니다. ('+(x.status||'')+')');
      })
      .always(function(){ state.loading=false; $loader.hide(); });
  }

  // ========= 검색 리셋 =========
  function resetAndSearch(){
    state.page=1; state.loading=false; state.done=false;
    state.cond=$('#searchCondition').val()||'0';
    state.kw=$.trim($('#searchKeyword').val()||'');
    state.sort=$('#sort').val()||'';
    $body.empty();
    loadNext();
  }

  // ========= 초기화 =========
  function init(){
      if (init._done) return; init._done = true;
      console.log('[list] init CTX=', CTX);
      resetAndSearch();
    }
	
	$(init);

  // ========= 스크롤 이벤트 =========
  $(w).on('scroll', function(){
    if (state.loading || state.done) return;
    var threshold = 300;
    var atBottom = (w.innerHeight + w.scrollY) >= (d.body.offsetHeight - threshold);
    if (atBottom) loadNext();
  });

  // ========= 검색/정렬 이벤트 =========
  $(d)
    .on('click', '#btnSearch', function(e){ e.preventDefault(); resetAndSearch(); })
    .on('click', '#btnAll', function(e){
      e.preventDefault();
      $('#searchCondition').val('0');
      $('#searchKeyword').val('');
      $('#sort').val('');
      resetAndSearch();
    })
    .on('click', '.sort-btn', function(){
      $('#sort').val($(this).data('sort')||'');
      resetAndSearch();
    });

  // ========= 자동완성 =========
  var $ac = $('#acList');
  var pendingAC = null;
  var acIndex = -1;
  function hideAC(){ $ac.hide().empty(); acIndex = -1; }
  function showAC(items){
    if (!items || !items.length) { hideAC(); return; }
    var html = items.map(function(s, i){
      return '<div class="ac-item'+(i===0?' active':'')+'" role="option">'+esc(s)+'</div>';
    }).join('');
    $ac.html(html).show(); acIndex = 0;
  }
  function fetchAC() {
    var cond = $('#searchCondition').val();
    var kw = $.trim($('#searchKeyword').val()||'');
    if (cond==='0' || kw.length===0) { hideAC(); return; }
    if (pendingAC) pendingAC.abort();
    pendingAC = $.ajax({
      url: CTX + '/api/products/suggest',
      data: { type: cond, keyword: kw },
      dataType: 'json'
    }).done(function(res){
      showAC(res.items || res);
    }).always(function(){ pendingAC = null; });
  }
  $(d)
    .on('input focus', '#searchKeyword', function(){ fetchAC(); })
    .on('keydown', '#searchKeyword', function(e){
      if ($ac.is(':visible')) {
        var $items = $ac.find('.ac-item');
        if (e.which===40) { e.preventDefault(); acIndex=(acIndex+1)%$items.length; $items.removeClass('active').eq(acIndex).addClass('active'); }
        else if (e.which===38) { e.preventDefault(); acIndex=(acIndex-1+$items.length)%$items.length; $items.removeClass('active').eq(acIndex).addClass('active'); }
        else if (e.which===13) { e.preventDefault(); if (acIndex>=0){ $('#searchKeyword').val($items.eq(acIndex).text()); hideAC(); $('#btnSearch').click(); } }
        else if (e.which===27) { hideAC(); }
      } else if (e.which===13) { e.preventDefault(); $('#btnSearch').click(); }
    })
    .on('click', '.ac-item', function(){ $('#searchKeyword').val($(this).text()); hideAC(); $('#btnSearch').click(); })
    .on('click', function(e){ if (!$(e.target).closest('.ac-wrap').length) hideAC(); });

  // ========= modals/helpers kept =========
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
  function ensureHistoryModal() {
    var $dlg = $('#historyModal');
    return $dlg.length ? $dlg : $('#historyModal'); // 이미 JSP에 존재
  }

  // ========= events =========
  // 최초 로드
  $(function(){
    resetAndSearch();
  });

  // 스크롤 바닥 근처 → 다음 페이지
  $(w).on('scroll', function(){
    if (state.loading || state.done) return;
    var threshold = 300;
    var atBottom = (w.innerHeight + w.scrollY) >= (d.body.offsetHeight - threshold);
    if (atBottom) loadNext();
  });

  // 검색/정렬
  $(d)
    .on('click', '#btnSearch', function(e){ e.preventDefault(); resetAndSearch(); })
    .on('click', '#btnAll', function(e){
      e.preventDefault();
      $('#searchCondition').val('0');
      $('#searchKeyword').val('');
      $('#sort').val('');
      resetAndSearch();
    })
    .on('click', '.sort-btn', function(){
      $('#sort').val($(this).data('sort')||'');
      resetAndSearch();
    });

  // 자동완성
  $(d)
    .on('input', '#searchKeyword', function(){ fetchAC(); })
    .on('focus', '#searchKeyword', function(){ fetchAC(); })
    .on('keydown', '#searchKeyword', function(e){
      if ($ac.is(':visible')) {
        var $items = $ac.find('.ac-item');
        if (e.which===40) { // down
          e.preventDefault();
          acIndex = (acIndex+1) % $items.length;
          $items.removeClass('active').eq(acIndex).addClass('active');
        } else if (e.which===38) { // up
          e.preventDefault();
          acIndex = (acIndex-1 + $items.length) % $items.length;
          $items.removeClass('active').eq(acIndex).addClass('active');
        } else if (e.which===13) { // enter
          e.preventDefault();
          if (acIndex>=0) {
            var v = $items.eq(acIndex).text();
            $('#searchKeyword').val(v);
            hideAC();
            $('#btnSearch').click();
          }
        } else if (e.which===27) { // esc
          hideAC();
        }
      } else if (e.which===13) {
        e.preventDefault();
        $('#btnSearch').click();
      }
    })
    .on('click', '.ac-item', function(){
      $('#searchKeyword').val($(this).text());
      hideAC();
      $('#btnSearch').click();
    })
    .on('click', function(e){
      if (!$(e.target).closest('.ac-wrap').length) hideAC();
    });

  // 상품 상세
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
    var url = CTX + '/purchase/product/' + encodeURIComponent(no) + '/history';
    var $dlg = ensureHistoryModal();
    var $frame = $dlg.find('iframe');
    $frame.off('load').on('load', function(){
      try {
        var $doc = $(this.contentDocument || this.contentWindow.document);
        $doc.find('.btn-close').hide();
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
    if (!txt) txt = '(저장된 사유가 없습니다)';
    var $dlg = ensureReasonModal();
    $dlg.find('.reason-ct').text(txt);
    $dlg.show();
  });

  // 공용 닫기
  $(d).on('click','.dlg-close', function(){
    $(this).closest('.dlg-mask').hide().find('iframe').attr('src','about:blank');
  });

  // Hover 썸네일
  (function(){
    var $hover = $('#hoverThumb');
    if (!$hover.length) {
      $hover = $('<div id="hoverThumb" style="display:none;position:absolute;border:1px solid #ccc;background:#fff;padding:5px;z-index:999;"></div>');
      $('body').append($hover);
    }
    $(d).on('mouseenter','.prod-link', function(e){
      var name = $(this).data('filename'); if (!name) return;
      var src = CTX + '/upload/uploadFiles/' + encodeURIComponent(name);
      $hover.html("<img src='"+src+"' width='150' height='150' alt='thumbnail'/>")
            .css({ top:e.pageY+15, left:e.pageX+15, display:'block' });
    }).on('mousemove','.prod-link', function(e){
      $hover.css({ top:e.pageY+15, left:e.pageX+15 });
    }).on('mouseleave','.prod-link', function(){
      $hover.hide().empty();
    });
  })();

})(window, window.jQuery, document);

// /javascript/listProductView.js
(function (w, d) {
  'use strict';
  var $ = w.jQuery || w.$;
  if (!$) return;

  // ===== 뷰 상태 =====
  var viewMode = 'list';
  w.getViewMode = function(){ return viewMode; };
  w.setViewMode = function(mode){ viewMode = mode || 'list'; };

  // ===== 상태 표시 =====
  function statusOf(code){
    return (code==='001'||code==='002')?'재고없음'
         :(code==='003')?'배송완료'
         :(code==='004')?'취소대기':'판매중';
  }
  function codeOf(p, info){ return (info&&(info.tranCode||info.tranStatusCode))||p.tranStatusCode||''; }

  // ===== 리스트 뷰 =====
  function renderRowList(p, info){
    var status = statusOf(codeOf(p,info));
    var userRole = String($('body').data('role') || '').toUpperCase(); // ADMIN 판별

    var buyBtn = '-';
    if (status === '판매중' && userRole !== 'ADMIN'){
      buyBtn = '<button class="btn-green btn-buy" data-prodno="'+p.prodNo+'">구매하기</button>';
    }

    return ''+
      '<tr data-prodno="'+p.prodNo+'">'+
      '  <td>'+p.prodNo+'</td>'+
      '  <td><span class="prod-link" data-prodno="'+p.prodNo+'">'+p.prodName+'</span></td>'+
      '  <td>'+p.price+' 원</td>'+
      '  <td>'+p.formattedManuDate+'</td>'+
      '  <td>'+(p.viewCount||0)+'</td>'+
      '  <td>'+status+'</td>'+
      '  <td>'+buyBtn+'</td>'+
      '</tr>';
  }

  // ===== 썸네일 뷰 =====
  function renderRowThumb(p, info){
    var status = statusOf(codeOf(p,info));
    var userRole = String($('body').data('role') || '').toUpperCase();

    var buyBtn = '';
    if (status === '판매중' && userRole !== 'ADMIN'){
      buyBtn = '<button class="btn-green btn-buy" data-prodno="'+p.prodNo+'">구매하기</button>';
    }

    var img = App.ctx()+'/upload/'+encodeURIComponent(p.fileName||'noimg.png');

    return ''+
      '<div class="thumb-card" data-prodno="'+p.prodNo+'">'+
      '  <div class="thumb-img-wrap"><img src="'+img+'" alt="'+p.prodName+'" class="thumb-img"></div>'+
      '  <div class="thumb-info">'+
      '    <div class="thumb-name prod-link" data-prodno="'+p.prodNo+'">'+p.prodName+'</div>'+
      '    <div class="thumb-price">'+p.price+' 원</div>'+
      '    <div class="thumb-meta"><span>'+p.formattedManuDate+'</span><span>'+status+'</span></div>'+
           (buyBtn ? '<div class="thumb-actions">'+buyBtn+'</div>' : '')+
      '  </div>'+
      '</div>';
  }

  // 외부 노출
  w.renderRow    = function(p,info){ return (viewMode==='list')?renderRowList(p,info):renderRowThumb(p,info); };
  w.latestInfoOf = function(map,no){ return (map&&(map[no]||map[String(no)]))||{}; };

  // 뷰 전환
  function switchTo(mode){
    if (viewMode===mode) return;
    viewMode = mode || 'list';
    if (mode==='list'){ $('#gridBody').hide(); $('#listTableWrap').show(); }
    else { $('#listTableWrap').hide(); $('#gridBody').show(); }
    $('#listBody,#gridBody').empty();
    w.listResetAndSearch && w.listResetAndSearch();
  }

  $(function(){
    $('#btnListView').on('click', function(){ switchTo('list'); });
    $('#btnThumbView').on('click', function(){ switchTo('thumb'); });
  });

  // 공통 액션
  $(d).on('click','.prod-link',function(){
    var no=$(this).data('prodno'); 
    if(no) App.go('/product/getProduct',{prodNo:no});
  });
  $(d).on('click','.btn-buy', function(){
    var no=$(this).data('prodno'); 
    if(no) App.go('/purchase/add',{prodNo:no});
  });

})(window, document);

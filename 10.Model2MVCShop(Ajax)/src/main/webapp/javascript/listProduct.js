// /javascript/listProduct.js
(function (w, d) {
  'use strict';
  var $ = w.jQuery;
  if (!$) return;

  // ===== 뷰 상태 =====
  var viewMode = 'list';
  w.getViewMode = function(){ return viewMode; };
  w.setViewMode = function(mode){ viewMode = mode || 'list'; };

  // ===== 표시 유틸 =====
  function statusOf(code){
    return (code==='001'||code==='002')?'재고없음'
         :(code==='003')?'배송완료'
         :(code==='004')?'취소대기':'판매중';
  }
  function codeOf(p, info){ return (info&&(info.tranCode||info.tranStatusCode))||p.tranStatusCode||''; }

  // ===== 렌더러 =====
  function renderRowList(p, info){
    var status = statusOf(codeOf(p,info));
    var userRole = $('body').data('role');   // 사용자 권한 가져오기

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

  function renderRowThumb(p, info){
    var status = statusOf(codeOf(p,info));
    var userRole = $('body').data('role');

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

  // 외부로 내보내기 (listCommon.js가 사용)
  w.renderRow    = function(p,info){ return (viewMode==='list')?renderRowList(p,info):renderRowThumb(p,info); };
  w.latestInfoOf = function(map,no){ return (map&&(map[no]||map[String(no)]))||{}; };

  function switchTo(mode){
    if (viewMode===mode) return;
    viewMode = mode || 'list';
    if (mode==='list'){ $('#gridBody').hide(); $('#listTableWrap').show(); }
    else { $('#listTableWrap').hide(); $('#gridBody').show(); }
    $('#listBody,#gridBody').empty();
    w.listResetAndSearch && w.listResetAndSearch();
  }

  // ===== 자동완성 =====
  $(function(){
    $('#btnListView').on('click', function(){ switchTo('list'); });
    $('#btnThumbView').on('click', function(){ switchTo('thumb'); });

    var $kw = $('#searchKeyword'), $ac = $('#acList');
    var active=-1, lastXhr=null, timer=null;

    function renderAC(items){
      if (!items || !items.length){ $ac.hide(); return; }
      var html = items.map(function(v,i){
        return '<div class="ac-item'+(i===active?' active':'')+'" data-v="'+v+'">'+v+'</div>';
      }).join('');
      $ac.html(html).show();
    }
    function fetchAC(val){
      var cond = $('#searchCondition').val();
      var type = (cond==='0') ? 'prodName' : cond;
      if (lastXhr && lastXhr.readyState!==4){ try{ lastXhr.abort(); }catch(_){ } }
      lastXhr = $.ajax({
        url: App.ctx() + '/api/products/suggest',
        type:'GET', dataType:'json', cache:false,
        data:{ type:type, keyword:val }
      }).done(function(res){ renderAC((res&&res.items)||[]); })
        .fail(function(){ $ac.hide(); });
    }

    $kw.on('input', function(){
      var v = $.trim(this.value);
      if (!v){ $ac.hide(); return; }
      active=-1; clearTimeout(timer);
      timer = setTimeout(function(){ fetchAC(v); }, 150);
    });

    $kw.on('keydown', function(e){
      if (!$ac.is(':visible')) return;
      var $it = $ac.find('.ac-item'); if(!$it.length) return;
      if (e.keyCode===40){ active=(active+1)%$it.length; }
      else if (e.keyCode===38){ active=(active<=0?$it.length-1:active-1); }
      else if (e.keyCode===13){
        if(active>=0){ $kw.val($it.eq(active).data('v')); $ac.hide(); w.listResetAndSearch&&w.listResetAndSearch(); }
        e.preventDefault(); return false;
      } else if (e.keyCode===27){ $ac.hide(); }
      $it.removeClass('active').eq(active).addClass('active');
    });

    $ac.on('click','.ac-item',function(){
      $kw.val($(this).data('v')); $ac.hide();
      w.listResetAndSearch && w.listResetAndSearch();
    });

    $(d).on('click', function(ev){
      if (!$(ev.target).closest('.ac-wrap').length) $ac.hide();
    });
  });

  // ===== 공통 액션 =====
  $(d).on('click','.prod-link',function(){
    var no=$(this).data('prodno'); if(no) App.go('/product/getProduct',{prodNo:no});
  });
  $(d).on('click','.btn-buy', function(){
    var no=$(this).data('prodno'); if(no) App.go('/purchase/add',{prodNo:no});
  });

})(window, document);

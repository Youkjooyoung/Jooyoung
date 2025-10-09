/* /javascript/listProduct.js */
(function(w, d, $){
  'use strict'; if(!$) return;

  // poly util
  if(!w.App) w.App={};
  App.debounce = App.debounce || function(fn, ms){ var t; return function(){ var a=arguments,c=this; clearTimeout(t); t=setTimeout(function(){ fn.apply(c,a); }, ms||0); }; };
  App.esc = App.esc || function(s){ s=(s==null?'':String(s)); return s.replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&gt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); };
  App.digits = App.digits || function(s){ return String(s||'').replace(/\D+/g,''); };

  var CTX=null; function C(){ return CTX || (CTX=($('body').data('ctx')||'')); }

  var $list,$grid,$load,$eol,$sentinel;
  var io=null, paused=false;

  var state={page:1,pageSize:10,loading:false,done:false,cond:'0',kw:'',sort:'',minPrice:null,maxPrice:null};
  var view='list';
  var listXhr=null;

  function renderRowList(p){
    var role=String($('body').data('role')||'').toUpperCase();
    var buyBtn=(role!=='ADMIN')? '<button type="button" class="btn-green btn-buy" data-prodno="'+p.prodNo+'">구매하기</button>' : '-';
    return ''+
      '<tr data-prodno="'+p.prodNo+'">'+
        '<td>'+p.prodNo+'</td>'+
        '<td><span class="prod-link" data-prodno="'+p.prodNo+'">'+App.esc(p.prodName)+'</span></td>'+
        '<td>'+Number(p.price||0).toLocaleString('ko-KR')+' 원</td>'+
        '<td>'+(p.formattedManuDate||p.manuDate||'')+'</td>'+
        '<td>'+(p.viewCount||0)+'</td>'+
        '<td>판매중</td>'+
        '<td>'+buyBtn+'</td>'+
      '</tr>';
  }
  function thumbImg(p){
    var ph = 'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#adb5bd">no image</text></svg>');
    return p.fileName ? (C()+'/upload/'+encodeURIComponent(p.fileName)) : ph;
  }
  function renderRowThumb(p){
    var role=String($('body').data('role')||'').toUpperCase();
    var buyBtn=(role!=='ADMIN')? '<button type="button" class="btn-green btn-buy" data-prodno="'+p.prodNo+'">구매하기</button>' : '';
    return ''+
      '<div class="thumb-card" data-prodno="'+p.prodNo+'">'+
        '<div class="thumb-img-wrap">'+
          '<img class="thumb-img prod-link" src="'+thumbImg(p)+'" alt="'+App.esc(p.prodName)+'" data-prodno="'+p.prodNo+'" onerror="App.noimg(event)">'+
        '</div>'+
        '<div class="thumb-info">'+
          '<div class="thumb-name prod-link" data-prodno="'+p.prodNo+'">'+App.esc(p.prodName)+'</div>'+
          '<div class="thumb-price">'+Number(p.price||0).toLocaleString('ko-KR')+' 원</div>'+
          '<div class="thumb-meta"><span>'+(p.formattedManuDate||p.manuDate||'')+'</span><span>판매중</span></div>'+
          (buyBtn?'<div class="thumb-actions">'+buyBtn+'</div>':'')+
        '</div>'+
      '</div>';
  }
  function renderRow(p){ return (view==='thumb'?renderRowThumb(p):renderRowList(p)); }

  function pick(){
    $list=$('#listBody'); $grid=$('#gridBody'); $load=$('#infiniteLoader'); $eol=$('#endOfList');
    $sentinel = $('#infiniteSentinel');
    if(!$sentinel.length){ $sentinel=$('<div id="infiniteSentinel" style="height:1px;"></div>'); (view==='thumb'?$grid:$list).after($sentinel); }
  }

  function apiUrl(p){ return C()+'/api/products/list?'+$.param($.extend({},p,{_:Date.now()})); }
  function append(list){
    var html=$.map(list, renderRow).join('');
    if(!html) return;
    (view==='thumb'?$grid:$list).append(html);
    if($sentinel && $sentinel.length){ $sentinel.detach(); (view==='thumb'?$grid:$list).after($sentinel); }
  }

  function pause(){ paused=true; } function resume(){ paused=false; }
  function hasNext(res,len){
    if(!res) return len===state.pageSize;
    if(typeof res.hasNext!=='undefined') return !!res.hasNext;
    if(typeof res.last!=='undefined') return !res.last;
    if(typeof res.isLast!=='undefined') return !res.isLast;
    var total = parseInt(res.totalCount||res.total,10);
    if(!isNaN(total)) return (state.page*state.pageSize)<total;
    return len===state.pageSize;
  }

  function load(){
    if(state.loading||state.done||paused) return;
    try{ if(listXhr && listXhr.readyState!==4) listXhr.abort(); }catch(_){}
    state.loading=true; pause(); $load.text('불러오는 중...').show(); $eol.hide();

    var p={
      currentPage:state.page,
      pageSize:state.pageSize,
      searchCondition:state.cond,
      searchKeyword:state.kw,
      sort:state.sort
    };
    if(state.minPrice!=null) p.minPrice=state.minPrice;
    if(state.maxPrice!=null) p.maxPrice=state.maxPrice;

    listXhr=$.getJSON(apiUrl(p)).done(function(res){
      var list=(res&&res.list)?res.list:[];
      if(!list.length){
        if(state.page===1){ $list.empty(); $grid.empty(); $eol.text('검색 결과가 없습니다.'); }
        state.done=true; $eol.show(); return;
      }
      append(list);
      state.page++;
      state.done=!hasNext(res,list.length);
      state.done && $eol.show();
    }).fail(function(x){
      if(x && x.statusText==='abort') return;
      console.error(x);
      if(state.page===1){ state.done=true; $eol.text('목록을 불러오지 못했습니다.').show(); }
    }).always(function(){
      state.loading=false; resume(); $load.hide();
    });
  }

  var tryLoad=App.debounce(function(){ if(!state.loading && !state.done){ load(); } },120);

  function observe(){
    $(w).off('.inf').on('scroll.inf resize.inf', tryLoad);
    if(io){ try{ io.disconnect(); }catch(_){ } io=null; }
    try{
      io=new IntersectionObserver(function(ents){
        if(paused||state.loading||state.done) return;
        if(ents.some(function(e){return e.isIntersecting;})) load();
      },{root:null, rootMargin:'240px 0px 240px 0px', threshold:0.01});
      if($sentinel[0]) io.observe($sentinel[0]);
    }catch(_){ /* 스크롤만 */ }
    load();
  }

  function reset(){
    pick();
    state.page=1; state.done=false; state.loading=false;
    state.cond=$('#searchCondition').val()||'0';
    state.kw=$.trim($('#searchKeyword').val()||'');
    state.sort=$('#sort').val()||'';
    var min = App.digits($('#minPrice').val()); state.minPrice = min?parseInt(min,10):null;
    var max = App.digits($('#maxPrice').val()); state.maxPrice = max?parseInt(max,10):null;
    $list.empty(); $grid.empty(); $eol.hide(); $load.hide();
    observe();
  }

  // init
  $(function(){
    CTX=App.ctx ? App.ctx() : ($('body').data('ctx')||'');
    pick();

    $('#btnListView').on('click',function(){ if(view!=='list'){ view='list'; $('#gridBody').hide(); $('#listTableWrap').show(); reset(); } });
    $('#btnThumbView').on('click',function(){ if(view!=='thumb'){ view='thumb'; $('#listTableWrap').hide(); $('#gridBody').show(); reset(); } });

    $('#btnSearch').on('click', reset);
    $('#btnAll').on('click', function(){
      $('#searchCondition').val('0'); $('#searchKeyword').val('');
      $('#sort').val(''); $('#minPrice').val(''); $('#maxPrice').val('');
      reset();
    });

    // 정렬
    $(d).on('click','.sort-btn',function(){
      $('.sort-btn').removeClass('active');
      $(this).addClass('active');
      $('#sort').val($(this).data('sort')||'');
      reset();
    });

    // 가격 필터 입력 엔터
    $('#minPrice,#maxPrice').on('keydown',function(e){ if(e.keyCode===13) reset(); });

    // 자동완성
    var $kw=$('#searchKeyword'), $box=$('#acList'), acSel=-1, acXhr=null, MIN=1;
    function acUrl(){
      var type = $('#searchCondition').val()||'prodName';
      var t = (type==='prodDetail')?'prodDetail':'prodName';
      return C()+'/api/products/suggest?'+$.param({type:t, keyword:$.trim($kw.val()||'') , _:Date.now()});
    }
    function renderAC(items){
      if(!items||!items.length){ $box.empty().hide(); return; }
      var html=items.slice(0,10).map(function(v,i){ return '<div class="ac-item'+(i===acSel?' active':'')+'" data-i="'+i+'">'+App.esc(v)+'</div>'; }).join('');
      $box.html(html).show().width($kw.outerWidth());
    }
    var fetchAC=App.debounce(function(){
      var v=$.trim($kw.val()||''); if(v.length<MIN){ $box.empty().hide(); return; }
      try{ if(acXhr && acXhr.readyState!==4) acXhr.abort(); }catch(_){}
      acXhr=$.getJSON(acUrl()).done(function(res){ renderAC((res&&res.items)||[]); acSel=-1; });
    },120);

    $kw.on('input focus', fetchAC)
       .on('blur', function(){ setTimeout(function(){ $box.hide(); },150); })
       .on('keydown', function(e){
         var max=$box.children().length-1; if(max<0) return;
         if(e.key==='ArrowDown'){ acSel=Math.min(max, acSel+1); $box.children().removeClass('active').eq(acSel).addClass('active'); e.preventDefault(); }
         else if(e.key==='ArrowUp'){ acSel=Math.max(0, acSel-1); $box.children().removeClass('active').eq(acSel).addClass('active'); e.preventDefault(); }
         else if(e.key==='Enter'){ if(acSel>=0){ $kw.val($box.children().eq(acSel).text()); $box.hide(); reset(); e.preventDefault(); } }
         else if(e.key==='Escape'){ $box.hide(); }
       });

    $(d).on('mousedown','.ac-item',function(){ $kw.val($(this).text()); $box.hide(); reset(); });

    // 이동/구매
    $(d).on('click','.prod-link',function(){ App.go('/product/getProduct',{prodNo:$(this).data('prodno')}); });
    $(d).on('click','.btn-buy',function(){ App.go('/purchase/add',{prodNo:$(this).data('prodno')}); });

    reset();
  });
})(window, document, window.jQuery);

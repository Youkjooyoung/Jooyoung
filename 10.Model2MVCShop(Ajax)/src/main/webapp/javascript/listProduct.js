(function(w, d, $){
  'use strict';
  if(!$) return;

  // ---- 안전 폴백(App 유틸이 없을 때만) ----
  if(!w.App) w.App = {};
  if(!App.debounce){
    App.debounce = function(fn, ms){
      var t; return function(){ var a=arguments, c=this;
        clearTimeout(t); t = setTimeout(function(){ fn.apply(c,a); }, ms||0);
      };
    };
  }
  if(!App.esc){
    App.esc = function(s){ s=(s==null?'':String(s));
      return s.replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});
    };
  }
  if(!App.digits){
    App.digits = function(s){ return String(s||'').replace(/\D+/g,''); };
  }

  // ===== CTX =====
  var CTX = null;
  function getCTX(){ return CTX || (CTX = App.ctx()); }

  var $list, $grid, $load, $eol, io = null, observerPaused = false, scrollRoot = null, $sentinel = null;

  // ===== 상태 =====
  var state = { page:1, pageSize:10, loading:false, done:false, cond:'0', kw:'', sort:'' };
  var viewMode = 'list';
  var failCount = 0;

  // 초기 프리로드 제한(1이면 총 2페이지까지 미리 로드)
  var preloadCount = 0, MAX_PRELOAD = 1;

  // 진행 중 목록 요청 핸들(조건 변경 시 abort)
  var listXhr = null;

  // ========== 스크롤 컨테이너 탐지 ==========
  function findScrollContainer(el){
    var p = el && el.parentElement;
    while(p){
      var s = w.getComputedStyle(p);
      if(/auto|scroll/i.test(s.overflowY)) return p;
      p = p.parentElement;
    }
    return null;
  }
  function getDocHeight(root){ return root ? root.scrollHeight : Math.max(d.body.scrollHeight, d.documentElement.scrollHeight); }
  function getViewportHeight(root){ return root ? root.clientHeight : (w.innerHeight || d.documentElement.clientHeight); }

  // 자동완성 대상 안전확보
  function ensureACTargets(){
    if(!$kw  || !$kw.length)  $kw  = $('#searchKeyword');
    if(!$box || !$box.length) $box = $('#acList');
  }

  // ========== 렌더링 ==========
  function renderRowList(p){
    var role = String($('body').data('role')||'').toUpperCase();
    var buyBtn = (role!=='ADMIN')
      ? '<button type="button" class="btn-green btn-buy" data-prodno="'+p.prodNo+'">구매하기</button>' : '-';
    return ''+
      '<tr data-prodno="'+p.prodNo+'">'+
      '  <td>'+p.prodNo+'</td>'+
      '  <td><span class="prod-link" data-prodno="'+p.prodNo+'">'+App.esc(p.prodName)+'</span></td>'+
      '  <td>'+App.fmtPrice(p.price)+' 원</td>'+
      '  <td>'+(p.formattedManuDate||App.fmtDate(p.manuDate))+'</td>'+
      '  <td>'+(p.viewCount||0)+'</td>'+
      '  <td>판매중</td>'+
      '  <td>'+buyBtn+'</td>'+
      '</tr>';
  }
  function renderRowThumb(p){
    var role = String($('body').data('role')||'').toUpperCase();
    var buyBtn = (role!=='ADMIN') ? '<button type="button" class="btn-green btn-buy" data-prodno="'+p.prodNo+'">구매하기</button>' : '';

    var placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">'+
      '<rect width="100%" height="100%" fill="#f8f9fa"/>'+
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" '+
      'font-family="Arial" font-size="16" fill="#adb5bd">no image</text></svg>'
    );

    var img = p.fileName ? (getCTX() + '/upload/' + encodeURIComponent(p.fileName)) : placeholder;

    return ''+
      '<div class="thumb-card" data-prodno="'+p.prodNo+'">'+
      '  <div class="thumb-img-wrap">'+
      '    <img src="'+img+'" alt="'+App.esc(p.prodName)+'" class="thumb-img prod-link" data-prodno="'+p.prodNo+'" onerror="App.noimg(event)">'+
      '  </div>'+
      '  <div class="thumb-info">'+
      '    <div class="thumb-name prod-link" data-prodno="'+p.prodNo+'">'+App.esc(p.prodName)+'</div>'+
      '    <div class="thumb-price">'+App.fmtPrice(p.price)+' 원</div>'+
      '    <div class="thumb-meta"><span>'+(p.formattedManuDate||App.fmtDate(p.manuDate))+'</span><span>판매중</span></div>'+
           (buyBtn?'<div class="thumb-actions">'+buyBtn+'</div>':'')+
      '  </div>'+
      '</div>';
  }
  function renderRow(p){ return (viewMode==='thumb' ? renderRowThumb(p) : renderRowList(p)); }

  // ========== 뷰 전환 ==========
  function switchTo(mode){
    if(viewMode===mode) return;
    viewMode = mode;
    if(mode==='list'){ $('#gridBody').hide(); $('#listTableWrap').show(); }
    else { $('#listTableWrap').hide(); $('#gridBody').show(); }
    $(window).scrollTop(0);
    resetAndSearch();
  }

  // ========== 목록/무한 스크롤 ==========
  function pickDom(){
    $list = $('#listBody');
    $grid = $('#gridBody');
    $load = $('#infiniteLoader');
    $eol  = $('#endOfList');
    scrollRoot = findScrollContainer($('#listTableWrap')[0] || $('#gridBody')[0]) || d.documentElement;

    // 하단 센티넬 생성/보장
    $sentinel = $('#infiniteSentinel');
    if(!$sentinel.length){
      $sentinel = $('<div id="infiniteSentinel" style="height:1px;"></div>');
      (viewMode==='thumb' ? $grid : $list).after($sentinel);
    }

    // 자동완성 박스 폭 동기화
    ensureACTargets();
    if($kw && $kw.length && $box && $box.length){ $box.width($kw.outerWidth()); }
  }

  function q(p){
    var o = $.extend({}, p, { _: Date.now() });
    return getCTX()+'/api/products?'+$.param(o);
  }

  function appendRows(list){
    var html = $.map(list, renderRow).join('');
    if(!html) return;
    (viewMode==='thumb' ? $grid : $list).append(html);

    // 센티넬을 컨테이너 뒤에 유지
    if($sentinel && $sentinel.length){
      $sentinel.detach();
      (viewMode==='thumb' ? $grid : $list).after($sentinel);
    }
  }

  function pauseObserver(){ observerPaused = true; }
  function resumeObserver(){ observerPaused = false; }

  function hasNextFromResponse(res, listLen){
    if(!res) return (listLen === state.pageSize);
    if(typeof res.hasNext !== 'undefined') return !!res.hasNext;
    if(typeof res.last !== 'undefined')    return !res.last;
    if(typeof res.isLast !== 'undefined')  return !res.isLast;
    var total = parseInt(res.totalCount || res.total, 10);
    if(!isNaN(total)) return (state.page * state.pageSize) < total;
    if(res.pagination){
      if(typeof res.pagination.totalPages !== 'undefined'){
        var tp = parseInt(res.pagination.totalPages,10);
        if(!isNaN(tp)) return state.page < tp;
      }
    }
    return (listLen === state.pageSize);
  }

  function loadNext(){
    if(state.loading || state.done || observerPaused) return;

    // 진행 중 목록 요청이 있으면 취소
    try{ if(listXhr && listXhr.readyState !== 4) listXhr.abort(); }catch(_){}

    state.loading = true; pauseObserver();

    $load && $load.text('불러오는 중...').show();
    $eol && $eol.hide();

    var params = {
       currentPage: state.page,
       pageSize: state.pageSize,
       searchCondition: state.cond,
       searchKeyword: state.kw,
       sort: state.sort
    };
    if (state.minPrice != null) params.minPrice = state.minPrice;
    if (state.maxPrice != null) params.maxPrice = state.maxPrice;

    listXhr = $.getJSON(q(params)).done(function(res){
      failCount = 0;
      var list = (res && res.list) ? res.list : [];

      if(!list.length){
        if(state.page===1){
          $list.empty(); $grid.empty();
          $eol && $eol.text('검색 결과가 없습니다.');
        }
        state.done = true;
        $eol && $eol.show();
        return;
      }

      appendRows(list);
      state.page++;

      var hasNext = hasNextFromResponse(res, list.length);
      state.done = !hasNext;
      state.done && $eol && $eol.show();

      ensureFill();
    }).fail(function(x){
      if(x && x.statusText === 'abort') return; // 정상 취소
      console.error('목록 로드 실패', x);
      failCount++;
      if(state.page===1 || failCount>=3){
        state.done = true;
        $eol && $eol.text('목록을 불러오지 못했습니다. 잠시 후 다시 시도하세요.').show();
      }
    }).always(function(){
      state.loading = false; resumeObserver();
      $load && $load.hide();
    });
  }

  function nearBottom(px) {
    var root = scrollRoot;
    if(root){
      return (root.scrollTop + root.clientHeight + (px||200)) >= root.scrollHeight;
    }
    var scrollTop  = $(w).scrollTop();
    var winH       = $(w).height();
    var docH       = Math.max(d.body.scrollHeight, d.documentElement.scrollHeight);
    return (scrollTop + winH + (px||200)) >= docH;
  }

  // 스크롤/리사이즈 디바운스
  var tryLoadByScroll = App.debounce(function () {
    if (state.loading || state.done) return;
    if (nearBottom(240)) loadNext();
  }, 120);

  function startObserver(){
    $(w).off('.infinite')
        .on('scroll.infinite', tryLoadByScroll)
        .on('resize.infinite', function(){
          ensureACTargets();
          if($kw && $kw.length && $box && $box.length){ $box.width($kw.outerWidth()); }
          tryLoadByScroll();
        });

    // IntersectionObserver로 하단 감지(지원 시)
    if(io){ try{ io.disconnect(); }catch(_){ } io = null; }
    try{
      io = new IntersectionObserver(function(entries){
        if(observerPaused || state.loading || state.done) return;
        var vis = entries.some(function(e){ return e.isIntersecting; });
        if(vis) loadNext();
      }, {
        root: findScrollContainer($('#listTableWrap')[0] || $('#gridBody')[0]) || null,
        rootMargin: '240px 0px 240px 0px',
        threshold: 0.01
      });
      if($sentinel && $sentinel[0]) io.observe($sentinel[0]);
    }catch(_){
      // 미지원이면 스크롤 폴백만 사용
    }

    loadNext();
  }

  function ensureFill(){
    setTimeout(function(){
      if (!state.loading && !state.done && nearBottom(0)) {
        if(preloadCount < MAX_PRELOAD){
          preloadCount++;
          loadNext();
        }
      }
    }, 400);
  }

  function resetAndSearch(){
    pickDom();
    state.page=1; state.done=false; failCount=0; preloadCount=0;

    state.cond=$('#searchCondition').val()||'0';
    state.kw=$.trim($('#searchKeyword').val()||'');
    state.sort=$('#sort').val()||'';
    state.minPrice = intVal($('#minPrice'));
    state.maxPrice = intVal($('#maxPrice'));

    $list.empty(); $grid.empty();
    $eol && $eol.hide();
    $load && $load.hide();

    if(io){ try{ io.disconnect(); }catch(_){ } io=null; }

    state.loading = false;
    startObserver();
  }

  // ========== 자동완성 ==========
  var MIN_AC_LEN = 1;
  var composing = false, acSel = -1, acXhr = null;
  var COMPOSE_FETCH = true;
  var $kw, $box;
  var _lastACSig = '';

  function acUrl(){
    ensureACTargets();
    var typeSel = $('#searchCondition').val() || 'prodName';
    var t = (typeSel === 'prodDetail') ? 'prodDetail' : 'prodName';
    var kw = $.trim($kw.val() || '');
    return getCTX() + '/api/products/suggest?type=' + encodeURIComponent(t) +
                      '&keyword=' + encodeURIComponent(kw) + '&_=' + Date.now();
  }
  function renderAC(items){
    if(!items || !items.length){ $box.empty().hide(); return; }
    var html = items.map(function(txt, i){
      return '<div class="ac-item'+(i===acSel?' active':'')+'" data-i="'+i+'">'+App.esc(txt)+'</div>';
    }).join('');
    $box.html(html).show();
  }
  function chooseAC(i){
    var $it = $box.children().eq(i);
    if(!$it.length) return;
    $kw.val($it.text());
    $box.hide();
    resetAndSearch();
  }

  var fetchAC = App.debounce(function(){
    ensureACTargets();
    if(!COMPOSE_FETCH && composing) return;
    var kw = $.trim($kw.val()||'');
    if(kw.length < MIN_AC_LEN){ $box.empty().hide(); return; }

    var typeSel = $('#searchCondition').val() || 'prodName';
    var sig = (typeSel==='prodDetail'?'D:':'N:') + kw;
    if (_lastACSig === sig) { return; }
    _lastACSig = sig;

    try { if(acXhr && acXhr.readyState !== 4) acXhr.abort(); } catch(_){}
    acXhr = $.getJSON(acUrl())
      .done(function(res){
        var items = (res && res.items) ? res.items : [];
        items = Array.from(new Set(items)).slice(0,10);
        acSel = -1;
        renderAC(items);
      })
      .fail(function(xhr){
        if(xhr && xhr.statusText === 'abort') return;
        $box.empty().hide();
      });
  }, 120);

  function intVal($el){
    var v = App.digits(($el && $el.val())||'');
    return v ? parseInt(v,10) : null;
  }

  // ========== 초기 바인딩 ==========
  $(function(){
    CTX = App.ctx();
    pickDom();

    $kw  = $('#searchKeyword');
    $box = $('#acList');

    // 뷰 전환
    $('#btnListView').on('click', function(){ switchTo('list'); });
    $('#btnThumbView').on('click', function(){ switchTo('thumb'); });

    // 검색/전체보기
    $('#btnSearch').on('click', function(){ resetAndSearch(); });
    $('#btnAll').on('click', function(){
      $('#searchCondition').val('0'); $('#searchKeyword').val('');
      $('#sort').val(''); $('#minPrice').val(''); $('#maxPrice').val('');
      _lastACSig=''; // AC 캐시도 리셋
      resetAndSearch();
    });

    // Enter 검색 실행(자동완성 열림+선택 있을 때는 chooseAC가 처리)
    $('#searchKeyword').on('keydown', function(e){
      if(e.keyCode === 13){
        if(!$box || !$box.length || !$box.is(':visible') || acSel < 0){
          resetAndSearch();
          e.preventDefault();
        }
      }
    });

    // 자동완성 + IME/키보드
    $kw.on('compositionstart', function(){
          composing = true;
          if(COMPOSE_FETCH) fetchAC();
        })
        .on('compositionupdate', function(){
          if(COMPOSE_FETCH) fetchAC();
        })
        .on('compositionend', function(){
          composing = false;
          fetchAC();
        })
        .on('input focus', fetchAC)
        .on('blur', function(){ setTimeout(function(){ $box.hide(); },150); })
        .on('keydown', function(e){
          var max = $box.children().length - 1;
          if (max < 0) return;
          if (e.key === 'ArrowDown'){
            acSel = Math.min(max, acSel + 1);
            $box.children().removeClass('active').eq(acSel).addClass('active');
            var el = $box.children().get(acSel);
            if (el && el.scrollIntoView) el.scrollIntoView({block:'nearest'});
            e.preventDefault();
          } else if (e.key === 'ArrowUp'){
            acSel = Math.max(0, acSel - 1);
            $box.children().removeClass('active').eq(acSel).addClass('active');
            var el2 = $box.children().get(acSel);
            if (el2 && el2.scrollIntoView) el2.scrollIntoView({block:'nearest'});
            e.preventDefault();
          } else if (e.key === 'Enter'){
            if (acSel >= 0){ chooseAC(acSel); e.preventDefault(); }
          } else if (e.key === 'Escape'){
            $box.hide();
          }
        });

    // 자동완성 항목 클릭 선택 & 바깥 클릭 닫기
    $(d).on('mousedown','.ac-item',function(){
      chooseAC(parseInt($(this).data('i'),10));
    });
    $(d).on('mousedown', function(e){
      ensureACTargets();
      var $t = $(e.target);
      if ($t.closest('.ac-wrap').length === 0) {
        if ($box && $box.length) $box.hide();
      }
    });

    // 조건 바뀌면 자동완성/목록 갱신
    $('#searchCondition').on('change', function(){
      _lastACSig = '';
      fetchAC();
      resetAndSearch();
    });

    // 가격필터
    function sanitizePrice($inp){
      var raw = $.trim($inp.val()||'');
      if(raw === '') return '';
      var v = App.digits(raw);
      $inp.val(v);
      return v;
    }
    $('#minPrice,#maxPrice')
      .on('blur', function(){
        sanitizePrice($(this));
        var min = parseInt($('#minPrice').val()||'0',10);
        var max = parseInt($('#maxPrice').val()||'0',10);
        if(min && max && min > max){
          $('#minPrice').val(max);
          $('#maxPrice').val(min);
        }
      })
      .on('keydown', function(e){
        if(e.keyCode===13){ resetAndSearch(); }
      });

    // 상세/구매 이동
    $(d).on('click','.prod-link',function(){ App.go('/product/getProduct',{prodNo:$(this).data('prodno')}); });
    $(d).on('click','.btn-buy',function(){ App.go('/purchase/add',{prodNo:$(this).data('prodno')}); });

    // 첫 검색 실행
    resetAndSearch();
  });

})(window, document, window.jQuery);

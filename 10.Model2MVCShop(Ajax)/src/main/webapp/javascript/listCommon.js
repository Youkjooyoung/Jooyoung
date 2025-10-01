// /javascript/listCommon.js
(function (w, d) {
  'use strict';
  var $ = w.jQuery || w.$;
  if (!$) return;
  if (w.__LIST_COMMON_INITED__) return; // 중복 초기화 방지
  w.__LIST_COMMON_INITED__ = true;

  var CTX = $('body').data('ctx') || '';
  var $doc = $(d);

  // ===== DOM 캐시 =====
  var $list, $grid, $load, $eol;
  function pickDom(){
    $list = $('#listBody');
    $grid = $('#gridBody');
    $load = $('#infiniteLoader');
    $eol  = $('#endOfList');
  }

  // ===== 상태 =====
  var state = {
    page:1, pageSize:10,
    loading:false, done:false,
    cond:'0', kw:'', sort:''
  };

  var io = null;

  function q(p){
    return (CTX||'') + '/api/products?' + $.param(p);
  }

  // ===== 행 추가 =====
  function appendRows(list, infoMap){
    if (!$list || !$list.length) pickDom();
    var html = $.map(list, function(p){
      return w.renderRow(p, w.latestInfoOf(infoMap, p.prodNo));
    }).join('');
    if (!html) return;

    var target = (typeof w.getViewMode==='function' && w.getViewMode()==='thumb')
                  ? $grid : $list;
    target.append(html);
  }

  // ===== 데이터 로딩 =====
  function loadNext(){
    if (state.loading || state.done) return;

    state.loading = true;
    $load.removeClass('hidden');
    $eol.hide();

    var params = {
      currentPage: state.page,
      pageSize: state.pageSize,
      searchCondition: state.cond,
      searchKeyword: state.kw,
      sort: state.sort,
      minPrice: $('#minPrice').val() || '',
      maxPrice: $('#maxPrice').val() || ''
    };

    $.getJSON(q(params))
      .done(function(res){
        var list = res.list || [];
        var info = res.latestInfoMap || {};

        if (!list.length){
          state.done = true;
          if (state.page === 1){
            $list.empty(); 
            $grid.empty(); 
            $eol.text('검색 결과가 없습니다.');
          }
          $eol.show();
          return;
        }

        appendRows(list, info);
        state.page++;

        if (list.length < state.pageSize){
          state.done = true;
          $eol.show();
        }

        ensureFill();
      })
      .fail(function(x){
        console.error('목록 로드 실패', x && x.status, x && x.responseText);
      })
      .always(function(){
        state.loading = false;
        $load.addClass('hidden');
      });
  }

  // ===== Observer 시작 =====
  function startObserver(){
    if (io){ try{ io.disconnect(); }catch(_){ } io = null; }
    var sentinel = d.getElementById('infiniteLoader');
    if (!sentinel) return;

    if (w.IntersectionObserver) {
      io = new IntersectionObserver(function(entries){
        if ($.map(entries, function(e){ return e.isIntersecting; }).indexOf(true) >= 0){
          loadNext();
        }
      }, {
        root: null,
        threshold: 0,
        rootMargin: '0px 0px 400px 0px'
      });

      io.observe(sentinel);
    } else {
      // fallback: scroll 이벤트
      $(w).on('scroll', function(){
        if (!state.loading && !state.done){
          var scrollPos = $(w).scrollTop() + $(w).height();
          if (scrollPos + 400 >= $(d).height()){
            loadNext();
          }
        }
      });
    }

    // 첫 페이지 강제 로드
    loadNext();
  }

  // ===== 화면 보정 =====
  function ensureFill(){
    setTimeout(function(){
      var docH = Math.max(d.body.scrollHeight, d.documentElement.scrollHeight);
      var vpH  = w.innerHeight || d.documentElement.clientHeight;
      if (docH <= vpH + 1 && !state.loading && !state.done){
        loadNext();
      }
    }, 0);
  }

  // ===== 초기화 & 검색 =====
  function resetAndSearch(){
    pickDom();

    state.page=1;
    state.loading=false;
    state.done=false;
    state.cond=$('#searchCondition').val()||'0';
    state.kw=$.trim($('#searchKeyword').val()||'');
    state.sort=$('#sort').val()||'';

    $list.empty(); 
    $grid.empty();
    startObserver();
  }
  w.listResetAndSearch = resetAndSearch;

  // ===== 초기 실행 =====
  $(function(){
    pickDom();
    if ($load && $load.length){ 
      $load.css({minHeight:'48px', margin:'16px 0'}); 
    }
    resetAndSearch();
  });

  // ===== 이벤트 바인딩 =====
  $doc.on('click', '#btnSearch', function(e){
    e.preventDefault();
    resetAndSearch();
  });
  $doc.on('click', '#btnAll', function(e){
    e.preventDefault();
    $('#searchCondition').val('0'); 
    $('#searchKeyword').val(''); 
    $('#sort').val('');
    $('#minPrice').val(''); 
    $('#maxPrice').val('');
    resetAndSearch();
  });

})(window, document);

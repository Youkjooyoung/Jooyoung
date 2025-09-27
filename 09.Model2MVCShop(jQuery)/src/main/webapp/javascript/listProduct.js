/* listProduct.js - 상품 검색/목록(사용자/관리 공용) */
(function($, w, d) {
  'use strict';

  // === 공통 내비게이션 유틸 ===
  w.AppNav = w.AppNav || (function() {
    function ctx() { return $('body').data('ctx') || ''; }
    function qs(params) { return $.param(params || {}); }
    function go(path, params) {
      var url = ctx() + path + (params && Object.keys(params).length ? ('?' + qs(params)) : '');
      location.href = url;
    }
    return { ctx: ctx, go: go, qs: qs };
  })();

  // === 파라미터 수집 ===
  function collectParams(reset) {
    if (reset) {
      return {
        currentPage   : 1,
        searchCondition: '0',
        searchKeyword : '',
        pageSize      : $('#pageSize').val() || 10,
        sort          : ''
      };
    }
    return {
      currentPage   : 1,
      searchCondition: $('#searchCondition').val() || '0',
      searchKeyword : $.trim($('#searchKeyword').val() || ''),
      pageSize      : $('#pageSize').val() || 10,
      sort          : $('#sort').val() || ''
    };
  }

  function movePage(page, reset) {
    var p = collectParams(reset);
    p.currentPage = page || 1;
    AppNav.go('/product/listProduct', p);
  }

  // === 이벤트 바인딩(위임) ===
  $(d)
    // 1) 검색 버튼
    .on('click', '#btnSearch', function(e){
      e.preventDefault();
      var cond = $('#searchCondition').val();
      var kw   = $.trim($('#searchKeyword').val() || '');
      if (cond !== '0' && !kw) { alert('검색어를 입력하세요.'); return; }
      movePage(1, false);
    })

    // 2) 엔터로 검색
    .on('keydown', '#searchKeyword', function(e){
      if (e.which === 13) { e.preventDefault(); $('#btnSearch').click(); }
    })

    // 3) 전체보기
    .on('click', '#btnAll', function(e){
      e.preventDefault();
      movePage(1, true);
    })

    // 4) 페이지크기 변경
    .on('change', '#pageSize', function(){
      movePage(1, false);
    })

    // 5) 정렬(가격)
    .on('click', '.sort-btn', function(){
      $('#sort').val($(this).data('sort'));
      movePage(1, false);
    })

    // 6) 상품 상세 열기
    .on('click', '.prod-link', function(){
      var prodNo = $(this).data('prodno');
      if (prodNo) AppNav.go('/product/getProduct', { prodNo: prodNo });
    })

    // 7) 구매하기
    .on('click', '.btn-buy', function(){
      var prodNo = $(this).data('prodno');
      if (prodNo) AppNav.go('/purchase/add', { prodNo: prodNo });
    })

    // 8) Hover 썸네일
	.on('mouseenter', '.prod-link', function(e){
	  var fileName = $(this).data('filename');
	  if (!fileName) return;

	  var filePath = AppNav.ctx() + '/upload/uploadFiles/' + encodeURIComponent(fileName);

	  $('#hoverThumb')
	    .html("<img src=\"" + filePath + "\" width=\"150\" height=\"150\" alt=\"thumbnail\"/>")
	    .css({ top: e.pageY + 15, left: e.pageX + 15, display: 'block' });
	})
	.on('mousemove', '.prod-link', function(e){
	  $('#hoverThumb').css({ top: e.pageY + 15, left: e.pageX + 15 });
	})
	.on('mouseleave', '.prod-link', function(){
	  $('#hoverThumb').hide().empty();
	})

    // 9) 페이징(span[data-page]) 클릭
    .on('click', '.page-link', function(){
      if ($(this).hasClass('disabled')) return;
      var page = parseInt($(this).data('page'), 10);
      if (page) movePage(page, false);
    });

  // 10) pageNavigator.jsp에서 호출하던 함수
  w.fncGetUserList = function(page) {
    movePage(page || 1, false);
  };

})(jQuery, window, document);

/* listManageProduct.js - 관리자 판매상품 관리 (jQuery 2.1.4)
 * 요구조건
 *  - HTML에 a태그/폼 method,action 선언 금지 → JS 동적 form submit 사용
 *  - 이벤트는 전부 JS에서 처리
 *  - jQuery 2.1.4 사용, AJAX 미사용
 *  - View/JS 100% 디커플링 (컨텍스트 등은 data-* 속성으로 전달)
 */
(function(w) {
	'use strict';

	// --- jQuery 존재 보장 ------------------------------------------------------
	var jQuery = w.jQuery;
	if (!jQuery) { console.error('[listManageProduct] jQuery not loaded'); return; }
	var $ = jQuery;

	// --- AppNav : 단일 전역 유틸 (중복 설치 방지) -------------------------------
	// - ctx() : <body data-ctx="/컨텍스트"> 읽기
	// - go()  : GET 이동 (쿼리스트링 구성)
	// - post(): POST 이동 (동적 form 생성/제출)  *AJAX 미사용*
	w.AppNav = w.AppNav || (function() {
		function ctx() { return $('body').data('ctx') || ''; }
		function qs(params) { return $.param(params || {}); }
		function go(path, params) {
			var url = ctx() + path + (params && Object.keys(params).length ? ('?' + qs(params)) : '');
			w.location.href = url;
		}
		function post(path, params) {
			var $f = $('<form>').attr({ method: 'post', action: ctx() + path }).css('display', 'none');
			$.each(params || {}, function(k, v) {
				$f.append($('<input>', { type: 'hidden', name: k, value: v }));
			});
			$('body').append($f); $f.submit();
		}
		return { ctx: ctx, go: go, post: post, qs: qs };
	})();

	// --- 페이지 공통 파라미터 ---------------------------------------------------
	var ctx = AppNav.ctx();
	var uploadBase = $('body').data('upload-base') || (ctx + '/upload/');             // C:/upload → /upload/**
	var legacyBase = $('body').data('legacy-base') || (ctx + '/images/uploadFiles/'); // 기존 샘플 경로 폴백

	// hover 컨테이너 보장
	var $hover = $('#hoverThumb');
	if ($hover.length === 0) {
		$hover = $('<div id="hoverThumb" style="display:none;position:absolute;border:1px solid #ccc;background:#fff;padding:5px;z-index:999;"></div>');
		$('body').append($hover);
	}

	// --- 내비게이션/상태전환 ----------------------------------------------------
	// 상품 상세 이동
	$(document).on('click', '.prod-link', function() {
		var prodNo = $(this).data('prodno');
		if (prodNo) AppNav.go('/product/getProduct', { prodNo: prodNo });
	});

	// 배송 처리 (주문완료(001) → 배송중(002) 등)
	$(document).on('click', '.btn-ship', function() {
		var prodNo = $(this).data('prodno');
		var tranCode = $(this).data('trancode');
		if (!prodNo || !tranCode) return;
		AppNav.post('/purchase/product/' + prodNo + '/status', { tranCode: tranCode });
	});

	// 페이징 (pageNavigator.jsp에서 호출)
	w.fncGetUserList = function(page) {
		var menu = $('#menu').val() || 'manage';
		var sort = $('#sort').val() || '';
		AppNav.go('/product/listProduct', {
			currentPage: page || 1,
			menu: menu,
			sort: sort
		});
	};

	// --- Hover 썸네일 ----------------------------------------------------------
	$(document).on('mouseenter', '.prod-link', function(e) {
	  var fileName = $(this).data('filename');
	  if (!fileName) return;

	  var filePath = AppNav.ctx() + '/upload/' + encodeURIComponent(fileName);
	  $('#hoverThumb')
	    .html("<img src='" + filePath + "' width='150' height='150' alt='thumbnail'/>")
	    .css({ top: e.pageY + 15, left: e.pageX + 15, display: 'block' });
	}).on('mousemove', '.prod-link', function(e) {
	  $('#hoverThumb').css({ top: e.pageY + 15, left: e.pageX + 15 });
	}).on('mouseleave', '.prod-link', function() {
	  $('#hoverThumb').hide().empty();
	});

})(window);

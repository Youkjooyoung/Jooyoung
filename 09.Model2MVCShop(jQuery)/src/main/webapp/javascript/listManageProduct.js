(function(w) {
	'use strict';

	var jQuery = w.jQuery;
	if (!jQuery) { console.error('[listManageProduct] jQuery not loaded'); return; }
	var $ = jQuery;
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
	var uploadBase = $('body').data('upload-base') || (ctx + '/upload/');
	var legacyBase = $('body').data('legacy-base') || (ctx + '/images/uploadFiles/'); 

	// hover 컨테이너 보장
	var $hover = $('#hoverThumb');
	if ($hover.length === 0) {
		$hover = $('<div id="hoverThumb" style="display:none;position:absolute;border:1px solid #ccc;background:#fff;padding:5px;z-index:999;"></div>');
		$('body').append($hover);
	}

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
	
	// 취소확인(004 → 005)
	$(document).on('click', '.btn-ack-cancel', function() {
		var prodNo = $(this).data('prodno');
		if (!prodNo) return;
		if (!confirm('이 주문의 취소를 확인 처리하시겠습니까?')) return;
		AppNav.post('/purchase/product/' + prodNo + '/status', { tranCode: '005' });
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

	  var filePath = AppNav.ctx() + '/upload/uploadFiles/' + encodeURIComponent(fileName);
	  $('#hoverThumb')
	    .html("<img src='" + filePath + "' width='150' height='150' alt='thumbnail'/>")
	    .css({ top: e.pageY + 15, left: e.pageX + 15, display: 'block' });
	}).on('mousemove', '.prod-link', function(e) {
	  $('#hoverThumb').css({ top: e.pageY + 15, left: e.pageX + 15 });
	}).on('mouseleave', '.prod-link', function() {
	  $('#hoverThumb').hide().empty();
	});

})(window);

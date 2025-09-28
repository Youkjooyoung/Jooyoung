// /javascript/listManageProduct.js
(function(w, $) {
	'use strict'; if (!$) return;

	// 상품 상세
	$(document).on('click', '.prod-link', function(e) {
		e.preventDefault(); e.stopPropagation();
		var no = $(this).data('prodno'); if (no) App.go('/product/getProduct', { prodNo: no });
	});

	// 배송 상태 변경
	$(document).on('click', '.btn-ship', function(e) {
		e.preventDefault(); e.stopPropagation();
		var no = $(this).data('prodno'), code = $(this).data('trancode'); if (!no || !code) return;
		App.ajaxPost('/purchase/product/' + no + '/status', { tranCode: code })
			.done(function() { location.reload(); })
			.fail(function(x) { alert('상태 변경 실패: ' + x.status); });
	});

	// 취소확인(004→005)
	$(document).on('click', '.btn-ack-cancel', function(e) {
		e.preventDefault(); e.stopPropagation();
		var no = $(this).data('prodno'); if (!no) return;
		if (!confirm('이 주문의 취소를 확인 처리하시겠습니까?')) return;
		App.ajaxPost('/purchase/product/' + no + '/status', { tranCode: '005' })
			.done(function() { location.reload(); })
			.fail(function(x) { alert('취소확인 실패: ' + x.status); });
	});

	// 주문내역 팝업 (차단 시 폴백)
	$(document).on('click', '.btn-order-history', function(e) {
		e.preventDefault(); e.stopPropagation();
		var no = $(this).data('prodno'); if (!no) return;
		App.popup('/purchase/product/' + no + '/history', 'orderHistory_' + no);
	});

	// Hover 썸네일
	var $hover = $('#hoverThumb');
	if (!$hover.length) {
		$hover = $('<div id="hoverThumb" style="display:none;position:absolute;border:1px solid #ccc;background:#fff;padding:5px;z-index:999;"></div>');
		$('body').append($hover);
	}
	$(document).on('mouseenter', '.prod-link', function(e) {
		var name = $(this).data('filename'); if (!name) return;
		var src = App.ctx() + '/upload/uploadFiles/' + encodeURIComponent(name);
		$hover.html("<img src='" + src + "' width='150' height='150' alt='thumbnail'/>")
			.css({ top: e.pageY + 15, left: e.pageX + 15, display: 'block' });
	}).on('mousemove', '.prod-link', function(e) {
		$hover.css({ top: e.pageY + 15, left: e.pageX + 15 });
	}).on('mouseleave', '.prod-link', function() { $hover.hide().empty(); });

	// 페이징 (pageNavigator.jsp에서 호출)
	w.fncGetUserList = function(page) {
		App.go('/product/listProduct', {
			currentPage: page || 1,
			menu: $('#menu').val() || 'manage',
			sort: $('#sort').val() || ''
		});
	};
})(window, window.jQuery);

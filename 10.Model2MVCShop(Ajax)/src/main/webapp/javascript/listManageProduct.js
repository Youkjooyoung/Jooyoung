(function(w, d, $) {
	'use strict';
	if (!$) return;

	var ctx = $('body').data('ctx') || '';

	// ===== 검색 =====
	$('#btnSearch').on('click', function() {
		var cond = $('#searchCondition').val() || '0';
		var kw = $('#searchKeyword').val() || '';
		location.href =
			ctx + '/product/listProduct?menu=manage' +
			'&searchCondition=' + encodeURIComponent(cond) +
			'&searchKeyword=' + encodeURIComponent(kw);
	});

	// 엔터로 검색
	$('#searchKeyword').on('keyup', function(e) {
		if (e.keyCode === 13) {
			$('#btnSearch').click();
			return;
		}
		// ===== 자동완성 =====
		var cond = $('#searchCondition').val();
		var kw = $(this).val();
		var $list = $('#acList');

		if (kw.length < 2) {
			$list.empty().hide();
			return;
		}

		$.getJSON(ctx + '/api/products/suggest', { type: cond, keyword: kw })
			.done(function(res) {
				$list.empty();
				if (res && res.items && res.items.length) {
					$.each(res.items, function(i, txt) {
						$('<div/>').addClass('ac-item').text(txt).appendTo($list);
					});
					$list.show();
				} else {
					$list.hide();
				}
			});
	});

	// 자동완성 선택 → 입력 + 검색
	$('#acList').on('click', '.ac-item', function() {
		$('#searchKeyword').val($(this).text());
		$('#acList').empty().hide();
		$('#btnSearch').click();
	});

	// ===== 정렬 =====
	$('.sort-btn').on('click', function() {
		var sort = $(this).data('sort') || '';
		var cond = $('#searchCondition').val() || '0';
		var kw = $('#searchKeyword').val() || '';
		location.href =
			ctx + '/product/listProduct?menu=manage' +
			'&searchCondition=' + encodeURIComponent(cond) +
			'&searchKeyword=' + encodeURIComponent(kw) +
			'&sort=' + encodeURIComponent(sort);
	});

	// ===== 상세보기 =====
	$(d).on('click', '.btn-detail', function() {
		var no = $(this).data('prodno');
		if (no) {
			location.href = ctx + '/product/getProduct?prodNo=' + encodeURIComponent(no);
		}
	});

	// ===== 배송 상태 변경 =====
	$(d).on('click', '.btn-ship', function() {
		var no = $(this).data('prodno');
		var code = $(this).data('trancode');
		$.post(ctx + '/purchase/product/' + encodeURIComponent(no) + '/status', { tranCode: code })
			.done(function() { location.reload(); })
			.fail(function(x) { alert('상태 변경 실패 : ' + x.status); });
	});

	// ===== 주문내역 모달 =====
	$(d).on('click', '.btn-order-history', function() {
		var no = $(this).data('prodno');
		$('#historyModal iframe').attr('src', ctx + '/purchase/product/' + encodeURIComponent(no) + '/history');
		$('#historyModal').show();
	});
	$('.dlg-close').on('click', function() {
		$('#historyModal').hide().find('iframe').attr('src', 'about:blank');
	});

	// ===== 취소사유(버튼의 data-reason 표시, API 호출 X) =====
	$(d).on('click', '.btn-cancel-reason', function() {
		var reason = $(this).data('reason');
		alert('취소 사유: ' + (reason && String(reason).trim() ? reason : '사유 없음'));
	});

	// ===== 취소확인 버튼 =====
	$(document).on('click', '.btn-ack-cancel', function() {
		var no = $(this).data('prodno');
		if (no && confirm('해당 주문을 취소확인 처리하시겠습니까?')) {
			$.post(ctx + '/purchase/product/' + encodeURIComponent(no) + '/ack-cancel')
				.done(function() { location.reload(); })
				.fail(function(x) { alert('취소확인 처리 실패 : ' + x.status); });
		}
	});

	// ===== 페이지 이동(네비게이터에서 호출) =====
	w.fncGetUserList = function(pageNo) {
		var cond = $('#searchCondition').val() || '0';
		var kw = $('#searchKeyword').val() || '';
		var sort = (new URL(location.href)).searchParams.get('sort') || '';
		location.href =
			ctx + '/product/listProduct?menu=manage' +
			'&currentPage=' + encodeURIComponent(pageNo) +
			'&searchCondition=' + encodeURIComponent(cond) +
			'&searchKeyword=' + encodeURIComponent(kw) +
			'&sort=' + encodeURIComponent(sort);
	};



})(window, document, window.jQuery);

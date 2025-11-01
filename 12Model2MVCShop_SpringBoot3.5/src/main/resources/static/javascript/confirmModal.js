// /javascript/addPurchaseConfirm.js
(($, w, d) => {
	'use strict';
	if (!$) return;

	$(() => {
		const ctx = App.ctx();

		// 주문 버튼 클릭 → 모달 띄우기
		$('#btnSubmit').on('click', (e) => {
			e.preventDefault();
			$('#confirmModal').show();
		});

		// 모달 내 확인 버튼 → 주문 전송
		$('#btnConfirm').on('click', (e) => {
			e.preventDefault();
			const form = d.purchaseForm;
			form.action = `${ctx}/purchase/add`;
			form.method = 'post';
			form.submit();
		});

		// 모달 내 취소 버튼 → 닫기
		$('#btnClose').on('click', (e) => {
			e.preventDefault();
			$('#confirmModal').hide();
		});

		// 기존 취소 버튼 (상품목록으로 이동)
		$('#btnCancel').on('click', (e) => {
			e.preventDefault();
			App.go('/product/listProduct');
		});
	});
})(jQuery, window, document);

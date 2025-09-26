$(function() {
	// 컨텍스트 경로 가져오기
	const ctx = $("body").data("ctx") || $("base").attr("href") || "";

	// 주문 등록 버튼
	$("#btnSubmit").on("click", function() {
		const form = document.purchaseForm;

		// action과 method를 JS에서 설정
		form.action = ctx + "/purchase/add";
		form.method = "post";
		form.submit();
	});

	// 취소 버튼
	$("#btnCancel").on("click", function() {
		window.location.href = ctx + "/product/listProduct";
	});
});

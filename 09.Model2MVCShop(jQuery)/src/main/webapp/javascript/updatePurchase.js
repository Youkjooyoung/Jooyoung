$(function() {
	const ctx = $("body").data("ctx");

	// 수정완료
	$("#btnUpdate").on("click", function() {
		const tranNo = $(this).data("tranno");
		const form = $("form[name='updatePurchaseForm']");
		form.attr({
			method: "post",
			action: ctx + "/purchase/update"
		});
		form.submit();
	});

	// 취소
	$("#btnCancel").on("click", function() {
		const tranNo = $(this).data("tranno");
		location.href = ctx + "/purchase/" + tranNo;
	});
});

$(function() {
	const ctx = $("body").data("ctx");

	// 수정
	$("#btnEdit").on("click", function() {
		const tranNo = $(this).data("tranno");
		location.href = ctx + "/purchase/" + tranNo + "/edit";
	});

	// 구매 취소
	$("#btnCancel").on("click", function() {
		const tranNo = $(this).data("tranno");
		if (confirm("정말로 구매를 취소하시겠습니까?")) {
			const form = $("<form>", { method: "post", action: ctx + "/purchase/" + tranNo + "/cancel" });
			form.appendTo("body").submit();
		}
	});

	// 물품 수령 확인
	$("#btnConfirm").on("click", function() {
		const tranNo = $(this).data("tranno");
		const prodNo = $(this).data("prodno");
		const form = $("<form>", { method: "post", action: ctx + "/purchase/" + tranNo + "/confirm" });
		form.append($("<input>", { type: "hidden", name: "prodNo", value: prodNo }));
		form.appendTo("body").submit();
	});
});

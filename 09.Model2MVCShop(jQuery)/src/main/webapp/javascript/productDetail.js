document.addEventListener("DOMContentLoaded", () => {
	// 상품 삭제 confirm 처리
	document.querySelectorAll(".delete-form").forEach(form => {
		form.addEventListener("submit", (e) => {
			if (!confirm("정말 이 상품을 삭제하시겠습니까?")) {
				e.preventDefault();
			}
		});
	});
});

$(function() {
	// 검색 버튼
	$("#btnSearch").on("click", function(e) {
		e.preventDefault();
		if (!$("#searchKeyword").val().trim()) {
			alert("검색어를 입력하세요.");
			return;
		}
		movePage(1, false);
	});

	// 전체보기 버튼
	$("#btnAll").on("click", function(e) {
		e.preventDefault();
		movePage(1, true);
	});

	// 정렬 버튼
	$(document).on("click", ".sort-btn", function() {
		$("#sort").val($(this).data("sort"));
		movePage(1, false);
	});

	// 상품 상세
	$(document).on("click", ".prod-link", function() {
		const prodNo = $(this).data("prodno");
		if (prodNo) {
			location.href = ctx + "/product/getProduct?prodNo=" + prodNo;
		}
	});

	// 구매하기
	$(document).on("click", ".btn-buy", function() {
		const prodNo = $(this).data("prodno");
		if (prodNo) {
			location.href = ctx + "/purchase/add?prodNo=" + prodNo;
		}
	});

	// ===============================
	// 상품명 hover 시 마우스 따라다니는 썸네일
	// ===============================
	$(document).on("mouseenter", ".prod-link", function(e) {
		const fileName = $(this).data("filename");
		if (!fileName) return;

		const filePath = ctx + "/upload/" + fileName;
		$("#hoverThumb").html("<img src='" + filePath + "' width='150' height='150' alt='thumbnail'/>")
			.css({ top: e.pageY + 15, left: e.pageX + 15 })
			.fadeIn(150);
	});

	$(document).on("mousemove", ".prod-link", function(e) {
		$("#hoverThumb").css({ top: e.pageY + 15, left: e.pageX + 15 });
	});

	$(document).on("mouseleave", ".prod-link", function() {
		$("#hoverThumb").fadeOut(100);
	});

	// ===============================
	// 공통 페이지 이동
	// ===============================


	// 공통 페이지 이동 함수
	function movePage(page, reset) {
		const form = $("<form>", { method: "get", action: ctx + "/product/listProduct" });

		if (!reset) {
			form.append($("<input>", { type: "hidden", name: "searchCondition", value: $("#searchCondition").val() }));
			form.append($("<input>", { type: "hidden", name: "searchKeyword", value: $("#searchKeyword").val() }));
			form.append($("<input>", { type: "hidden", name: "pageSize", value: $("#pageSize").val() }));
			form.append($("<input>", { type: "hidden", name: "sort", value: $("#sort").val() }));
		} else {
			form.append($("<input>", { type: "hidden", name: "searchCondition", value: "0" }));
			form.append($("<input>", { type: "hidden", name: "searchKeyword", value: "" }));
			form.append($("<input>", { type: "hidden", name: "pageSize", value: $("#pageSize").val() }));
			form.append($("<input>", { type: "hidden", name: "sort", value: "" }));
		}

		form.append($("<input>", { type: "hidden", name: "currentPage", value: page }));

		$("body").append(form);
		form.submit();
	}

	// 전역에 노출 (pageNavigator.jsp에서 호출 가능하게)
	window.fncGetUserList = function(page) {
		movePage(page, false);
	};
});

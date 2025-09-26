$(function() {
    // 등록 버튼
    $("#btnAdd").on("click", function(e) {
        e.preventDefault();
        const form = document.detailForm;

        // 1. 상품명 필수 체크
        const prodName = $("input[name='prodName']").val().trim();
        if (prodName === "") {
            alert("상품명을 입력하세요.");
            $("input[name='prodName']").focus();
            return false;
        }

        // 2. 가격 입력 여부만 확인 (숫자 여부는 도메인에서 처리)
        const price = $("input[name='price']").val().trim();
        if (price === "") {
            alert("가격을 입력하세요.");
            $("input[name='price']").focus();
            return false;
        }

        // 3. 제조일자 입력 여부만 확인 (형식은 도메인에서 처리)
        const manuDate = $("input[name='manuDate']").val().trim();
        if (manuDate === "") {
            alert("제조일자를 입력하세요.");
            $("input[name='manuDate']").focus();
            return false;
        }

        form.submit();
    });

    // 취소 버튼
    $("#btnCancel").on("click", function(e) {
        e.preventDefault();
        if (confirm("입력한 내용을 모두 지우시겠습니까?")) {
            document.detailForm.reset();
            if (typeof selectedFiles !== "undefined") {
                selectedFiles = [];
                updatePreview(document.getElementById("uploadFiles"));
            }
        }
    });

    // 가격 입력 시 자동 콤마 처리 (보기 편하게)
    $("input[name='price']").on("keyup", function() {
        let val = $(this).val().replace(/,/g, "");
        if (val !== "" && !isNaN(val)) {
            $(this).val(parseInt(val, 10).toLocaleString());
        }
    });
});

// 상품 상세 이동
$(document).on("click", ".prod-link", function() {
    const prodNo = $(this).data("prodno");
    if (prodNo) {
        location.href = ctx + "/product/getProduct?prodNo=" + prodNo;
    }
});

// 배송 처리
$(document).on("click", ".btn-ship", function() {
    const prodNo = $(this).data("prodno");
    const tranCode = $(this).data("trancode");

    const form = $("<form>", {
        method: "post",
        action: ctx + "/purchase/product/" + prodNo + "/status"
    }).append(
        $("<input>", { type: "hidden", name: "tranCode", value: tranCode })
    );

    $("body").append(form);
    form.submit();
});

// 페이지 이동
function fncGetUserList(page) {
    const form = $("<form>", {
        method: "get",
        action: ctx + "/product/listProduct"
    });
    form.append($("<input>", { type: "hidden", name: "currentPage", value: page }));
    form.append($("<input>", { type: "hidden", name: "menu", value: $("#menu").val() }));
    form.append($("<input>", { type: "hidden", name: "sort", value: $("#sort").val() }));
    $("body").append(form);
    form.submit();
}

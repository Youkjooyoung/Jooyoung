$(function() {
  const ctx = $("body").data("ctx");  // JSP에서 data-ctx로 받은 contextPath

  // 구매내역 상세 이동
  $(document).on("click", ".purchase-link", function() {
    const tranNo = $(this).data("tranno");
    if (tranNo) {
      location.href = ctx + "/purchase/" + tranNo;  // RESTful 방식
    }
  });

  // 물품 수령 확인
  $(document).on("click", ".btn-confirm", function() {
    const tranNo = $(this).data("tranno");
    const prodNo = $(this).data("prodno");

    if (tranNo && prodNo) {
      if (confirm("물품을 수령하셨습니까?")) {
        $.post(ctx + "/purchase/" + tranNo + "/confirm", { prodNo: prodNo })
          .done(() => location.reload())
          .fail(() => alert("처리 중 오류가 발생했습니다."));
      }
    }
  });
});

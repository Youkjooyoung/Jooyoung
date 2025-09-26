$(function () {
  var ctx = $("body").data("ctx") || "";

  $("#btnAdd").on("click", function (e) {
    e.preventDefault();

    var $name = $("input[name='prodName']");
    var $price = $("input[name='price']");
    var $manu = $("input[name='manuDate']");

    // 간단한 검증
    if (!$.trim($name.val())) { alert("상품명을 입력하세요."); $name.focus(); return; }
    if (!$.trim($price.val())) { alert("가격을 입력하세요."); $price.focus(); return; }
    if (!$.trim($manu.val())) { alert("제조일자를 입력하세요."); $manu.focus(); return; }

    var form = document.forms["detailForm"];
    var fd = new FormData(form);

    // 가격 콤마 제거
    fd.set("price", $.trim($price.val()).replace(/,/g, ""));

    // 제조일자 하이픈 제거 → YYYYMMDD(8자리)
    var manuDate = $.trim($manu.val());
    if (manuDate) fd.set("manuDate", manuDate.replace(/[^0-9]/g, ""));

    $.ajax({
      url: ctx + "/api/products",
      type: "POST",
      data: fd,
      processData: false,
      contentType: false,
      dataType: "json",
      success: function (res) {
        alert("상품이 등록되었습니다. 상품번호: " + res.prodNo);
        location.href = ctx + "/product/getProduct?prodNo=" + res.prodNo;
      },
      error: function (xhr) {
        console.log("상태코드:", xhr.status);
        console.log("응답본문:", xhr.responseText);
        alert("상품 등록에 실패했습니다.");
      }
    });
  });

  // 가격 입력 시 콤마 포맷(보기용)
  $("input[name='price']").on("keyup", function () {
    var v = $(this).val().replace(/,/g, "");
    if (v !== "" && !isNaN(v)) $(this).val(parseInt(v, 10).toLocaleString());
  });
});

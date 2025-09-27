// /javascript/recentProduct.js
$(function () {
  var ctx  = $("body").data("ctx") || "";
  var $box = $("#preview-box");
  var $img = $("#preview-img");

  // CSS 없어도 보이게 최소 스타일(원하면 CSS 파일로 빼도 OK)
  $box.css({
    position: "fixed",
    display: "none",
    padding: "6px",
    background: "#fff",
    border: "1px solid #ccc",
    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
    zIndex: 9999
  });
  $img.css({ maxWidth: "220px", maxHeight: "220px", display: "block" });

  function place(e){ $box.css({ top: e.clientY + 15, left: e.clientX + 15 }); }
  function show(src, e){
    if(!src){ $box.hide(); return; }
    $img.off("error").attr("src","");
    $img.one("error", function(){ $box.hide(); });
    $img.attr("src", src);
    place(e);
    $box.fadeIn(120);
  }

  $(document)
    .on("mouseenter", ".recent-list a", function (e) {
      var $a = $(this);
      var fileName = $a.data("filename");
      var prodNo   = $a.data("prodno");

      // 1) fileName 이미 있으면 바로 표시
      if (fileName) {
        var src = ctx + "/upload/uploadFiles/" + encodeURIComponent(fileName);
        return show(src, e);
      }

      // 2) 없으면 한번만 REST로 조회 → 첫 이미지를 캐싱
      if (!$a.data("loading")) {
        $a.data("loading", true);
        $.getJSON(ctx + "/api/products/" + encodeURIComponent(prodNo) + "/images")
          .done(function (arr) {
            if (arr && arr.length) {
              fileName = arr[0].fileName;
              $a.data("filename", fileName);      // ★ 캐싱
              var src = ctx + "/upload/uploadFiles/" + encodeURIComponent(fileName);
              show(src, e);
            } else {
              $box.hide();
            }
          })
          .always(function(){ $a.data("loading", false); });
      }
    })
    .on("mousemove", ".recent-list a", function (e) { place(e); })
    .on("mouseleave", ".recent-list a", function () { $box.fadeOut(80); });
});

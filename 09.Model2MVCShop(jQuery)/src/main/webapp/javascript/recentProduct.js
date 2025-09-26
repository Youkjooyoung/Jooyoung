$(function() {
    // hover 시 이미지 미리보기
    $(document).on("mouseenter", ".recent-list a", function(e) {
        const fileName = $(this).data("filename");
        if (!fileName) return;

        const filePath = ctx + "/upload/" + fileName;

        $("#preview-img").attr("src", filePath);
        $("#preview-box")
            .css({ top: e.pageY + 15, left: e.pageX + 15 })
            .fadeIn(150);
    });

    $(document).on("mousemove", ".recent-list a", function(e) {
        $("#preview-box").css({ top: e.pageY + 15, left: e.pageX + 15 });
    });

    $(document).on("mouseleave", ".recent-list a", function() {
        $("#preview-box").fadeOut(100);
    });
});

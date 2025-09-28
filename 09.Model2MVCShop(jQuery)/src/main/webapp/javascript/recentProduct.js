// /javascript/recentProduct.js
(function(w, d, $) {
	'use strict'; if (!$) return;

	var $box = $('#preview-box');    // 미리보기 컨테이너(페이지에 존재)
	var $img = $('#preview-img');    // 미리보기 <img>(페이지에 존재)
	var loadingFlag = {};            // prodNo별 1회 조회 락

	function place(e) {
		if (!$box.length) return;
		$box.css({ top: (e.clientY + 15), left: (e.clientX + 15) });
	}

	function show(src, e) {
		if (!$box.length || !$img.length) return;
		if (!src) return $box.hide();
		$img.off('error').attr('src', '');
		$img.one('error', function() { $box.hide(); });
		$img.attr('src', src);
		place(e);
		$box.show();
	}

	function fileUrl(fileName) {
		return App.ctx() + '/upload/uploadFiles/' + encodeURIComponent(fileName);
	}

	// 최근목록 항목: a 또는 .recent-item(span 등) 모두 지원
	$(d)
		.on('mouseenter', '.recent-list a, .recent-list .recent-item', function(e) {
			var $el = $(this);
			var fileName = $el.data('filename');
			var prodNo = $el.data('prodno');

			// 1) fileName 이미 있으면 바로 표시
			if (fileName) return show(fileUrl(fileName), e);

			// 2) 최초 1회만 REST 조회 후 캐시
			if (prodNo && !loadingFlag[prodNo]) {
				loadingFlag[prodNo] = true;
				$.getJSON(App.ctx() + '/api/products/' + encodeURIComponent(prodNo) + '/images')
					.done(function(arr) {
						if (arr && arr.length) {
							fileName = arr[0].fileName;
							$el.data('filename', fileName);     // 캐시
							show(fileUrl(fileName), e);
						} else {
							$box.hide();
						}
					})
					.always(function() { loadingFlag[prodNo] = false; });
			}
		})
		.on('mousemove', '.recent-list a, .recent-list .recent-item', function(e) { place(e); })
		.on('mouseleave', '.recent-list a, .recent-list .recent-item', function() { $box.hide(); });
})(window, document, window.jQuery);

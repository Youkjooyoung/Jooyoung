(function(w, d, $) {
	'use strict';
	if (!$) return;

	function ctx() { return (w.App && w.App.ctx ? w.App.ctx() : $('body').data('ctx') || ''); }
	function go(path, params) {
		if (w.App && w.App.go) { w.App.go(path, params); return; }
		var qs = params ? ('?' + $.param(params)) : '';
		w.location.href = ctx() + path + qs;
	}

	var $box = $('#preview-box');
	var $img = $('#preview-img');
	var loadingFlag = {};

	function place(e) {
		if (!$box.length) return;
		$box.css({ top: (e.clientY + 15), left: (e.clientX + 15) });
	}

	function candidateUrls(fileName) {
		var enc = encodeURIComponent(fileName || '');
		var c = ctx();
		return [
			c + '/upload/' + enc,
			c + '/upload/uploadFiles/' + enc,
			c + '/uploadFiles/' + enc
		];
	}

	function loadWithFallback(urls, e) {
		if (!urls.length) { $box.hide(); return; }
		var url = urls[0];
		console.debug('[recent] try image:', url);

		$img.off('error load').attr('src', '');
		$img.one('load', function() { place(e); $box.show(); });
		$img.one('error', function() {
			console.debug('[recent] image error -> fallback');
			loadWithFallback(urls.slice(1), e);
		});
		$img.attr('src', url);
	}

	function showByFileName(fileName, e) {
		if (!$box.length || !$img.length) return;
		if (!fileName) { $box.hide(); return; }
		loadWithFallback(candidateUrls(fileName), e);
	}

	// === Hover 미리보기 ===
	$(d)
		.on('mouseenter', '.recent-item', function(e) {
			var $el = $(this);
			var fileName = $el.data('filename');
			var prodNo = $el.data('prodno');

			if (fileName) { showByFileName(fileName, e); return; }

			if (prodNo && !loadingFlag[prodNo]) {
				loadingFlag[prodNo] = true;
				$.getJSON(ctx() + '/api/products/' + encodeURIComponent(prodNo) + '/images')
					.done(function(arr) {
						console.debug('[recent] images resp:', arr);
						if (arr && arr.length) {
							var item = arr[0] || {};
							fileName = item.fileName || item.imageFile || item.storedName || item.saveName || item.filename;
							console.debug('[recent] pick fileName:', fileName);
							if (fileName) {
								$el.data('filename', fileName);
								showByFileName(fileName, e);
							} else {
								$box.hide();
							}
						} else {
							$box.hide();
						}
					})
					.always(function() { loadingFlag[prodNo] = false; });
			}
		})
		.on('mousemove', '.recent-item', function(e) { place(e); })
		.on('mouseleave', '.recent-item', function() { $box.hide(); });

	// === 키보드/클릭 네비게이션 ===
	$(d)
		.on('click', '.recent-item', function() {
			var prodNo = $(this).data('prodno');
			if (prodNo) go('/product/getProduct', { prodNo: prodNo });
		})
		.on('keydown', '.recent-item', function(e) {
			if (e.key === 'Enter' || e.keyCode === 13) {
				var prodNo = $(this).data('prodno');
				if (prodNo) go('/product/getProduct', { prodNo: prodNo });
			}
		});

	$box.hide();

})(window, document, window.jQuery);

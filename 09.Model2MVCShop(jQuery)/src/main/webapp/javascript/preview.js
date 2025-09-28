// /javascript/preview.js
(function(w, d, $) {
	'use strict'; if (!$) return;

	var selected = [];

	function keyOf(f) { return [f.name, f.size, f.lastModified].join('|'); }
	function merge(files) {
		var seen = {};
		for (var i = 0; i < selected.length; i++) seen[keyOf(selected[i])] = true;
		for (var j = 0; j < files.length; j++) {
			var f = files[j], k = keyOf(f);
			if (!seen[k]) { selected.push(f); seen[k] = true; }
		}
	}
	function render() {
		var $wrap = $('#preview-container'); if (!$wrap.length) return;
		$wrap.empty();
		for (var i = 0; i < selected.length; i++) {
			(function(idx, file) {
				var $box = $('<div class="img-box new">');
				var $img = $('<img class="img-preview" alt="preview">');
				var $del = $('<button type="button" class="btn-delete-preview" title="미리보기 제거">✖</button>').attr('data-idx', idx);
				var r = new FileReader();
				r.onload = function(e) { $img.attr('src', e.target.result); };
				r.readAsDataURL(file);
				$box.append($img, $del); $wrap.append($box);
			})(i, selected[i]);
		}
	}

	$(function() {
		var $file = $('#uploadFiles'); if (!$file.length) return;

		$file.on('change', function(e) {
			var files = e.target.files || [];
			merge(files); render(); this.value = '';
		});

		$(d).on('click', '.btn-delete-preview', function() {
			var idx = +$(this).attr('data-idx');
			if (idx >= 0 && idx < selected.length) { selected.splice(idx, 1); render(); }
		});

		// 달력 아이콘
		$(d).on('click', '.icon-btn', function() {
			if (typeof w.show_calendar === 'function') {
				w.show_calendar('document.detailForm.manuDate', $('input[name="manuDate"]').val());
			}
		});
	});

	w.AppPreview = { getFiles: function() { return selected.slice(); } };
})(window, document, window.jQuery);

// /javascript/preview.js
(($, w, d) => {
	'use strict';
	if (!$) return;

	let selected = [];

	// ==== 유틸 ====
	const keyOf = (f) => `${f.name}|${f.size}|${f.lastModified}`;

	const merge = (files) => {
		const seen = {};
		selected.forEach((f) => (seen[keyOf(f)] = true));

		Array.from(files).forEach((f) => {
			const k = keyOf(f);
			if (!seen[k]) {
				selected.push(f);
				seen[k] = true;
			}
		});
	};

	const render = () => {
		const $wrap = $('#preview-container');
		if (!$wrap.length) return;

		$wrap.empty();

		selected.forEach((file, idx) => {
			const $item = $('<div/>', { class: 'preview-item' });
			const $img = $('<img/>', {
				class: 'preview-img',
				alt: `${file.name} 미리보기`,
				'aria-label': file.name,
			});
			const $btn = $('<button/>', {
				type: 'button',
				class: 'preview-remove',
				title: '삭제',
				'aria-label': '이 파일 삭제',
				'data-idx': idx,
			}).text('✖');

			const reader = new FileReader();
			reader.onload = (e) => $img.attr('src', e.target.result);
			reader.readAsDataURL(file);

			$item.append($img, $btn);
			$wrap.append($item);
		});
	};

	// ==== 초기화 ====
	$(() => {
		const $file = $('#uploadFiles');
		if (!$file.length) return;

		$file.on('change', (e) => {
			const files = e.target.files || [];
			merge(files);
			render();
			e.target.value = ''; // 동일 파일 다시 선택 가능
		});

		$(d).on('click', '.preview-remove', (e) => {
			const idx = Number($(e.currentTarget).data('idx'));
			if (idx >= 0 && idx < selected.length) {
				selected.splice(idx, 1);
				render();
			}
		});
	});

	// ==== 네임스페이스화 (App.preview) ====
	w.App = w.App || {};
	w.App.preview = {
		getFiles: () => [...selected], // 복제본 반환
		clear: () => {
			selected = [];
			$('#preview-container').empty();
		},
	};
})(jQuery, window, document);

// /javascript/updateProduct.js
(() => {
	'use strict';

	// jQuery 로딩 대기 유틸
	const waitForjQuery = (cb, tries = 0) => {
		if (window.jQuery) return cb(window.jQuery);
		if (tries > 200) return;             // 200 * 25ms = ~5s 안전장치
		setTimeout(() => waitForjQuery(cb, tries + 1), 25);
	};

	waitForjQuery(($) => {
		const boot = (scope) => {
			const $root = scope?.length ? scope : $('#mainArea [data-page="product-update"], [data-page="product-update"]');
			if (!$root.length) return;
			if (!window.toastui || !window.toastui.Editor) {
			   console.warn('[product-update] Toast UI Editor not loaded yet.');
			   return;
			 }

			// --- Toast UI Editor ---
			const src = ($root.find('#detailSource').val() || '').trim();
			const editor = new toastui.Editor({
				el: $root.find('#editor').get(0),
				height: '340px',
				initialEditType: 'wysiwyg',
				previewStyle: 'vertical',
				placeholder: '상품 상세내용을 입력하세요.'
			});
			if (src) editor.setHTML(src);
			
			const onlyNum   = (s='') => String(s).replace(/[^\d]/g, '');
			const withComma = (s='') => s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

			// 커서 보정: 포맷 전 커서 기준 '왼쪽의 숫자 개수'를 유지
			const restoreCaret = (el, digitsLeft) => {
			  const v = el.value;
			  let cnt = 0, pos = v.length;
			  for (let i=0; i<v.length; i++) {
			    if (/\d/.test(v[i])) cnt++;
			    if (cnt >= digitsLeft) { pos = i+1; break; }
			  }
			  el.setSelectionRange(pos, pos);
			};

			// 초기 값 정리(혹시 서버 포맷이 없거나 깨졌을 경우)
			const $price = $root.find('#price');
			$price.val(withComma(onlyNum($price.val() || '')));

			// 입력 중 실시간 포맷
			$root.on('input', '#price', function () {
			  const el = this;
			  const sel = el.selectionStart || 0;
			  const digitsLeft = (el.value.slice(0, sel).match(/\d/g) || []).length;
			  const raw = onlyNum(el.value);
			  el.value = withComma(raw);
			  restoreCaret(el, digitsLeft);
			});

			// 붙여넣기 대응(다음 틱에 input 트리거)
			$root.on('paste', '#price', function(){ const el=this; setTimeout(() => $(el).trigger('input'), 0); });

			// 포커스 아웃 시 한 번 더 정리
			$root.on('blur', '#price', function () {
			  this.value = withComma(onlyNum(this.value));
			});

			// 저장
			$root.on('click', '#btnSave', (e) => {
				e.preventDefault();
				$root.find('#prodDetail').val(editor.getHTML());

				const $price = $root.find('#price');
				$price.val(($price.val() || '').replace(/[^\d]/g, ''));

				// 삭제 예정 이미지 ID 수집 -> hidden 동기화
				const delIds = [];
				$root.find('#existGrid .img-box.removing').each(function() {
					const id = $(this).data('imgid');
					if (id != null && id !== '') delIds.push(String(id));
				});
				$root.find('#deleteImageIds').val(delIds.join(','));

				// form 전송
				$root.find('#updateProductForm')
					.attr({ method: 'post', enctype: 'multipart/form-data' })[0].submit();
			});

			// 취소/목록 (필요시 라우터 연동)
			$root.on('click', '#btnCancel', () => history.back());
			$root.on('click', '#btnList', () => {
				const ctx = $('body').data('ctx') || '';
				if (window.__layout?.loadMain) {
					window.__layout.loadMain(ctx + '/product/listProduct?menu=manage');
				} else {
					location.href = ctx + '/product/listProduct?menu=manage';
				}
			});

			// --- Flatpickr ---
			if (window.flatpickr) {
				window.flatpickr('#manuDate', { dateFormat: 'Y-m-d', allowInput: true, locale: 'ko' });
			}

			// --- 기존 이미지 : 삭제 토글 ---
			const $exist = $root.find('#existGrid');
			$exist.on('click', '.thumb-del', function() {
				const $box = $(this).closest('.img-box');
				$box.toggleClass('removing'); // CSS 오버레이 "삭제 예정"
			});

			// --- 새 이미지 미리보기 ---
			const $input = $root.find('#uploadFiles');
			const $prev = $root.find('#previewGrid');

			// ObjectURL 우선(성능·CSP에 유리), 실패 시 FileReader 폴백
			const buildThumb = (file, i) => {
				const $box = $(`
	      <div class="img-box" data-idx="${i}">
	        <img alt="preview">
	        <button type="button" class="thumb-del" title="제외">✖</button>
	      </div>
	    `);
				const $img = $box.find('img');

				// blob: 우선
				try {
					if (window.URL && URL.createObjectURL) {
						const url = URL.createObjectURL(file);
						$img.on('load', () => { try { URL.revokeObjectURL(url); } catch (_) { } });
						$img.attr('src', url);
						return $box;
					}
				} catch (_) { /* fallthrough */ }

				// data: 폴백
				const fr = new FileReader();
				fr.onload = (e) => $img.attr('src', e.target.result);
				fr.readAsDataURL(file);
				return $box;
			};

			$input.on('change', function() {
				$prev.empty();
				const files = Array.from(this.files || []);
				files.forEach((file, i) => {
					if (!/^image\//.test(file.type)) return;
					$prev.append(buildThumb(file, i));
				});
			});

			// 미리보기에서 제외
			$prev.on('click', '.thumb-del', function() {
				const idx = +$(this).closest('.img-box').data('idx');
				const dt = new DataTransfer();
				Array.from($input[0].files).forEach((f, i) => { if (i !== idx) dt.items.add(f); });
				$input[0].files = dt.files;
				$(this).closest('.img-box').remove();

				// data-idx 재정렬(다음 삭제 정확도 보장)
				$prev.children('.img-box').each((n, el) => el.setAttribute('data-idx', String(n)));
			});
		};

		// 최초/부분 로드 모두 대응
		$(() => boot());
		$(document).on('view:afterload', (_e, payload) => {
			if (payload?.page === 'product-update') boot(payload.$main);
		});
	});
})();

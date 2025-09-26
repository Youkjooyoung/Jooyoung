/* updateProduct.js – 상품 수정(AJAX, multipart PUT) */
(function($, w, d) {
	'use strict';
	if (!w.jQuery) return;

	var $form, ctx = $('body').data('ctx') || '';
	var selectedFiles = [];
	var REQUIRE_AT_LEAST_ONE = true;

	// ------- utils -------
	function formatPrice($i) {
		var raw = ($i.val() || '').replace(/,/g, '').replace(/[^\d]/g, '');
		$i.val(raw ? Number(raw).toLocaleString('ko-KR') : '');
	}
	function cleanDigits(s) { return (s || '').replace(/\D/g, ''); }

	function mergeFiles(list) {
		var map = new Map();
		selectedFiles.forEach(function(f) { map.set(f.name + '|' + f.size + '|' + f.lastModified, f); });
		Array.prototype.forEach.call(list, function(f) {
			var k = f.name + '|' + f.size + '|' + f.lastModified;
			if (!map.has(k)) map.set(k, f);
		});
		selectedFiles = Array.from(map.values());
	}
	function syncInput($input) {
		var dt = new DataTransfer();
		selectedFiles.forEach(function(f) { dt.items.add(f); });
		$input[0].files = dt.files;
	}
	function renderPreview() {
		var $wrap = $('#preview-container').empty();
		selectedFiles.forEach(function(f, idx) {
			if (!/^image\//.test(f.type)) return;
			var r = new FileReader();
			r.onload = function(e) {
				var $box = $('<div style="position:relative;display:inline-block;margin-right:6px;"></div>');
				var $img = $('<img>', {
					src: e.target.result,
					css: { width: 80, height: 80, objectFit: 'cover', border: '1px solid #ccc', borderRadius: 4 }
				});
				var $x = $('<span class="pv-del">✖</span>').data('idx', idx).css({
					position: 'absolute', top: 2, right: 2, cursor: 'pointer',
					background: 'rgba(0,0,0,.6)', color: '#fff', fontSize: 12,
					width: 18, height: 18, textAlign: 'center', lineHeight: '18px', borderRadius: '50%'
				});
				$box.append($img, $x).appendTo($wrap);
			};
			r.readAsDataURL(f);
		});
	}

	// 남을 기존 이미지 수(삭제표시 안 된 것만)
	function remainingExistingCount() {
		var totalExisting = $('.delete-existing').length;
		var toDelete = $('input[name="deleteImageIds"]').length;
		return Math.max(0, totalExisting - toDelete);
	}

	// ------- bindings -------
	$(function() {
		$form = $('form[action$="/product/updateProduct"]');

		$('#price').on('input', function() { formatPrice($(this)); });

		// 기존 이미지 X 토글
		$(d).on('click', '.delete-existing', function() {
			var $box = $(this).closest('div');
			var imgId = $(this).data('imgid'); if (!imgId) return;
			var sel = 'input[name="deleteImageIds"][value="' + imgId + '"]';
			var $hid = $form.find(sel);

			if ($hid.length) {
				$hid.remove();
				$box.css({ opacity: 1, outline: 'none' }).removeClass('marked-delete');
				$(this).attr('title', '이미지 삭제');
			} else {
				$('<input>', { type: 'hidden', name: 'deleteImageIds', value: String(imgId) }).appendTo($form);
				$box.css({ opacity: .5, outline: '2px solid #e74c3c' }).addClass('marked-delete');
				$(this).attr('title', '삭제 취소');
			}
		});

		// 새 이미지 선택/미리보기
		var $file = $('#uploadFiles');
		if ($file.length) {
			$file.on('change', function() {
				mergeFiles(this.files);
				syncInput($file);
				renderPreview();
				this.value = ''; // 같은 파일 재선택 허용
			});
			$(d).on('click', '.pv-del', function() {
				var idx = $(this).data('idx');
				if (typeof idx === 'number') {
					selectedFiles.splice(idx, 1);
					syncInput($file);
					renderPreview();
				}
			});
		}

		// 취소
		$(d).on('click', '#btnCancel', function() {
			var no = $(this).data('prodno');
			if (no) w.location.href = ctx + '/product/getProduct?prodNo=' + no;
		});

		// 제출 → AJAX PUT
		$form.on('submit', function(e) {
			e.preventDefault();

			var name = $.trim($form.find('input[name="prodName"]').val());
			var priceStr = $.trim($('#price').val());
			if (!name) { alert('상품명을 입력하세요.'); return; }
			if (!priceStr) { alert('가격을 입력하세요.'); return; }

			// 최소 1장 검사 (남는 기존 + 새 파일)
			var newCnt = ($('#uploadFiles')[0] && $('#uploadFiles')[0].files)
				? $('#uploadFiles')[0].files.length : 0;
			if (REQUIRE_AT_LEAST_ONE && (remainingExistingCount() + newCnt) < 1) {
				alert('상품 이미지를 최소 1장 이상 업로드하세요.');
				return;
			}

			// 값 정리
			$form.find('input[name="price"]').val(priceStr.replace(/,/g, ''));
			var $manu = $form.find('input[name="manuDate"]');
			$manu.val(cleanDigits($manu.val()));

			var prodNo = $form.find('input[name="prodNo"]').val();
			var fd = new FormData($form[0]);   // hidden deleteImageIds, files 포함

			$.ajax({
				url: ctx + '/api/products/' + encodeURIComponent(prodNo),
				type: 'PUT',                      // 서버가 허용한다면 그대로 사용
				data: fd,
				processData: false,
				contentType: false,
				// 만약 서버/필터가 PUT 멀티파트를 막으면 아래 두 줄 중 하나를 켜세요.
				//headers: { 'X-HTTP-Method-Override': 'PUT' },
				//url: ctx + '/api/products/' + encodeURIComponent(prodNo) + '?_method=PUT', type: 'POST',
				success: function(res) {
					alert('수정이 완료되었습니다.');
					w.location.href = ctx + '/product/getProduct?prodNo=' + prodNo;
				},
				error: function(xhr) {
					console.log('업데이트 실패:', xhr.status, xhr.responseText);
					alert('상품 수정에 실패했습니다.');
				}
			});
		});
	});
})(jQuery, window, document);

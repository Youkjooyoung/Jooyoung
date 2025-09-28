// /javascript/addProduct.js
(function(w, d, $) {
	'use strict'; if (!$) return;

	$(function() {
		// 등록
		$(d).on('click', '#btnAdd', function(e) {
			e.preventDefault();

			var $f = $('form[name="detailForm"]');
			var $name = $f.find('[name="prodName"]');
			var $detail = $f.find('[name="prodDetail"]');
			var $manu = $f.find('[name="manuDate"]');
			var $price = $f.find('[name="price"]');

			if (!$.trim($name.val())) { alert('상품명을 입력하세요.'); $name.focus(); return; }
			if (!$.trim($detail.val())) { alert('상품상세를 입력하세요.'); $detail.focus(); return; }
			if (!$.trim($price.val())) { alert('가격을 입력하세요.'); $price.focus(); return; }

			var fd = new FormData();
			fd.append('prodName', $.trim($name.val()));
			fd.append('prodDetail', $.trim($detail.val()));
			if ($.trim($manu.val())) fd.append('manuDate', App.digits($manu.val()));
			fd.append('price', App.digits($price.val()));

			// 파일(미리보기 선택된 것 우선)
			var files = [];
			if (w.AppPreview && typeof w.AppPreview.getFiles === 'function') {
				files = w.AppPreview.getFiles() || [];
			} else {
				var $uf = $('#uploadFiles');
				if ($uf.length && $uf[0] && $uf[0].files) {
					files = $uf[0].files;
				}
			}
			for (var i = 0; i < files.length; i++) {
				fd.append('uploadFiles', files[i]);
			}

			$.ajax({
				url: App.ctx() + '/api/products',
				type: 'POST',
				data: fd, processData: false, contentType: false, dataType: 'json'
			}).done(function(res) {
				alert('상품이 등록되었습니다. 번호: ' + res.prodNo);
				App.go('/product/getProduct', { prodNo: res.prodNo });
			}).fail(function(xhr) {
				console.log('등록 실패:', xhr.status, xhr.responseText);
				alert('상품 등록에 실패했습니다.');
			});
		});

		// 취소
		$(d).on('click', '#btnCancel', function(e) { e.preventDefault(); history.back(); });

		// 가격 콤마(보기용)
		$(d).on('keyup', 'input[name="price"]', function() {
			var v = App.digits($(this).val());
			$(this).val(v ? Number(v).toLocaleString('ko-KR') : '');
		});
	});
})(window, document, window.jQuery);

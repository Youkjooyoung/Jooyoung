// /javascript/updateProduct.js
(function(w, d, $) {
	'use strict'; if (!$) return;

	$(function() {
		// 저장
		$(d).on('click', '#btnUpdate', function(e) {
			e.preventDefault();

			var $f = $('form[name="detailForm"]');
			var prodNo = $.trim($f.find('[name="prodNo"]').val());
			var name = $.trim($f.find('[name="prodName"]').val());
			var detail = $.trim($f.find('[name="prodDetail"]').val());
			var manu = $.trim($f.find('[name="manuDate"]').val());
			var price = $.trim($f.find('[name="price"]').val());

			if (!prodNo) { alert('제품 번호가 없습니다.'); return; }
			if (!name) { alert('상품명을 입력하세요.'); $f.find('[name="prodName"]').focus(); return; }
			if (!detail) { alert('상품상세를 입력하세요.'); $f.find('[name="prodDetail"]').focus(); return; }
			if (!price) { alert('가격을 입력하세요.'); $f.find('[name="price"]').focus(); return; }

			// 규칙: form에는 method/action 없음 ⇒ JS에서만 지정
			var form = $f[0];
			form.action = App.ctx() + '/product/updateProduct';
			form.method = 'post';

			// 숫자 정규화
			$f.find('[name="price"]').val(App.digits(price));
			if (manu) $f.find('[name="manuDate"]').val(App.digits(manu));

			// 파일: AppPreview 있으면 우선 사용
			if (w.AppPreview && typeof w.AppPreview.getFiles === 'function') {
				// 업로드를 REST로 처리하는 게 아니라면, 폼 제출로 넘겨도 됨(서버에서 multipart 처리)
				// 이 구현은 서버 기존 흐름을 유지: 단순 submit
			}

			form.submit();
		});

		// 취소
		$(d).on('click', '#btnCancel', function(e) {
			e.preventDefault();
			var prodNo = $('form[name="detailForm"]').find('[name="prodNo"]').val();
			if (prodNo) App.go('/product/getProduct', { prodNo: prodNo });
			else history.back();
		});

		// 가격 콤마(보기용)
		$(d).on('keyup', 'input[name="price"]', function() {
			var v = App.digits($(this).val());
			$(this).val(v ? Number(v).toLocaleString('ko-KR') : '');
		});
	});
})(window, document, window.jQuery);

/* addProduct.js */
(function(w, d, $) {
  'use strict'; if (!$) return;

  let editor;

  $(function() {
    var $f = $('form[name="detailForm"]');

    // ============================
    // Toast UI Editor 초기화
    // ============================
    editor = new toastui.Editor({
      el: document.querySelector('#editor'),
      height: '300px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      placeholder: '상품 상세내용을 입력하세요.'
    });

    // ============================
    // 등록 버튼 (form submit)
    // ============================
    $(d).on('click', '#btnAdd', function(e) {
      e.preventDefault();

		var $name = $f.find('[name="prodName"]');
		var $manu = $f.find('[name="manuDate"]');
		var $price = $f.find('[name="price"]');
		var detailHtml = editor.getHTML();
		var uiDate = $('#manuDate').val();
		
      // ---- 유효성 검사 ----
		if (!$.trim($name.val())) { alert('상품명을 입력하세요.'); $name.focus(); return; }
		if (!detailHtml || detailHtml.trim() === '') { alert('상품상세를 입력하세요.'); editor.focus(); return; }
		if (!uiDate) { alert('제조일자를 선택하세요.'); $('#manuDate').focus(); return; }
		if (!$.trim($price.val())) { alert('가격을 입력하세요.'); $price.focus(); return; }
		if (parseInt($price.val().replace(/,/g, ''), 10) <= 0) { alert('가격은 0보다 커야 합니다.'); $price.focus(); return; }

      // ---- 등록 확인 ----
      if (!confirm('상품을 등록하시겠습니까?')) {
        return;
      }
	  
      $('#prodDetail').val(detailHtml);
	  $('#manuDateHidden').val(uiDate.replace(/-/g, ''));

		$f.attr({
			method: 'post',
			enctype: 'multipart/form-data',
			action: window.App ? App.ctx() + '/product/addProduct' : '/product/addProduct'
		});

		$f[0].submit();
    });

    // ============================
    // 취소 버튼
    // ============================
    $(d).on('click', '#btnCancel', function(e) {
      e.preventDefault();
      history.back();
    });

    // ============================
    // 가격 입력 → 콤마 처리
    // ============================
    $(d).on('keyup', 'input[name="price"]', function() {
      var raw = $(this).val().replace(/,/g, '').replace(/[^\d]/g, '');
      $(this).val(raw ? Number(raw).toLocaleString('ko-KR') : '');
    });
  });
})(window, document, window.jQuery);

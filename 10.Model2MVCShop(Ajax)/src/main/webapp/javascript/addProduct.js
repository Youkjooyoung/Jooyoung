(function(w, d, $) {
  'use strict'; if (!$) return;

  let editor;

  $(function() {
    var $f = $('form[name="detailForm"]');

    // ============================
    // Toast UI Editor 초기화
    // ============================
    editor = new toastui.Editor({
      el: document.querySelector('#prodDetail'),
      height: '300px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      placeholder: '상품 상세내용을 입력하세요.'
    });

    // ============================
    // 등록 버튼
    // ============================
    $(d).on('click', '#btnAdd', function(e) {
      e.preventDefault();

      var $name = $f.find('[name="prodName"]');
      var $manu = $f.find('[name="manuDate"]');
      var $price = $f.find('[name="price"]');
      var detailHtml = editor.getHTML();

      // ---- 유효성 검사 ----
      if (!$.trim($name.val())) { 
        alert('상품명을 입력하세요.'); 
        $name.focus(); 
        return; 
      }
      if (!detailHtml || detailHtml === '<p><br></p>') { 
        alert('상품상세를 입력하세요.'); 
        editor.focus(); 
        return; 
      }
      if (!$.trim($price.val())) { 
        alert('가격을 입력하세요.'); 
        $price.focus(); 
        return; 
      }
      if (parseInt(App.digits($price.val()), 10) <= 0) {
        alert('가격은 0보다 커야 합니다.');
        $price.focus();
        return;
      }

      // ---- FormData 구성 ----
      var fd = new FormData();
      fd.append('prodName', $.trim($name.val()));
      fd.append('prodDetail', detailHtml);
      if ($.trim($manu.val())) fd.append('manuDate', App.digits($manu.val()));
      fd.append('price', App.digits($price.val()));

      // ---- 파일 (Preview.js 연계) ----
      var files = (w.AppPreview && w.AppPreview.getFiles) 
        ? w.AppPreview.getFiles() 
        : ($('#uploadFiles')[0] ? $('#uploadFiles')[0].files : []);
      
      for (var i = 0; i < files.length; i++) {
        fd.append('uploadFiles', files[i]);
      }

      // ---- AJAX 요청 ----
      $.ajax({
        url: App.ctx() + '/api/products',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        dataType: 'json'
      }).done(function(res) {
        alert('상품이 등록되었습니다. 번호: ' + res.prodNo);
        App.go('/product/getProduct', { prodNo: res.prodNo });
      }).fail(function(xhr) {
        console.log('등록 실패:', xhr.status, xhr.responseText);
        alert('상품 등록에 실패했습니다.');
      });
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
      var v = App.digits($(this).val());
      $(this).val(v ? Number(v).toLocaleString('ko-KR') : '');
    });

    // ============================
    // 달력 버튼 → date input 열기
    // ============================
    $(d).on('click', '#calendarBtn', function(e) {
      e.preventDefault();
      let input = $('#manuDate')[0];
      if (input && input.showPicker) { 
        input.showPicker(); // 크롬 최신 지원
      } else if (input) { 
        input.focus();      // fallback
      }
    });
  });
})(window, document, window.jQuery);

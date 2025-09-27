(function(w, d, $){
  'use strict';
  if (!$) return;

  function ctx(){ return $('body').data('ctx') || ''; }
  function digits(s){ return (s||'').replace(/\D/g,''); }

  $(function(){
    // 등록
    $(d).on('click', '#btnAdd', function(e){
      e.preventDefault();

      var $form   = $('form[name="detailForm"]');
      var $name   = $form.find('input[name="prodName"]');
      var $detail = $form.find('input[name="prodDetail"]');
      var $manu   = $form.find('input[name="manuDate"]');
      var $price  = $form.find('input[name="price"]');

      if (!$.trim($name.val()))   { alert('상품명을 입력하세요.'); $name.focus(); return; }
      if (!$.trim($detail.val())) { alert('상품상세정보를 입력하세요.'); $detail.focus(); return; }
      if (!$.trim($price.val()))  { alert('가격을 입력하세요.'); $price.focus();  return; }

      var fd = new FormData();
      fd.append('prodName',   $.trim($name.val()));
      fd.append('prodDetail', $.trim($detail.val()));
      if ($.trim($manu.val())) fd.append('manuDate', digits($manu.val()));
      fd.append('price', digits($price.val()));

      var files = (w.AppPreview && typeof w.AppPreview.getFiles==='function')
                    ? w.AppPreview.getFiles()
                    : ($('#uploadFiles')[0] && $('#uploadFiles')[0].files) ? $('#uploadFiles')[0].files : [];
      for (var i=0;i<files.length;i++){ fd.append('uploadFiles', files[i]); }

      $.ajax({
        url: ctx() + '/api/products',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(res){
          alert('상품이 등록되었습니다. 상품번호: ' + res.prodNo);
          w.location.href = ctx() + '/product/getProduct?prodNo=' + encodeURIComponent(res.prodNo);
        },
        error: function(xhr){
          console.log('상태코드:', xhr.status);
          console.log('응답본문:', xhr.responseText);
          alert('상품 등록에 실패했습니다.');
        }
      });
    });

    // 취소
    $(d).on('click', '#btnCancel', function(e){
      e.preventDefault();
      w.history.back();
    });

    // 가격 콤마 포맷(보기용)
    $(d).on('keyup', 'input[name="price"]', function(){
      var v = digits($(this).val());
      $(this).val(v ? Number(v).toLocaleString('ko-KR') : '');
    });
  });
})(window, document, window.jQuery);

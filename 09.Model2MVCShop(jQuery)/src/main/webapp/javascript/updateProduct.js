/* /javascript/updateProduct.js — POST multipart, preview.js 재사용 (ES5) */
(function($, w, d){
  'use strict';
  if (!w.jQuery) return;

  var ctx = $('body').data('ctx') || '';
  var deleteImageIds = [];

  function digits(s){ return (s||'').replace(/\D/g,''); }
  function fmtPrice($i){
    var r = digits($i.val());
    $i.val(r ? Number(r).toLocaleString('ko-KR') : '');
  }

  $(function(){
    // 가격 포맷
    $('#price').on('input blur', function(){ fmtPrice($(this)); });

    // 기존 이미지 onerror fallback (조회 경로 통일)
    $('#existingImages').on('error', 'img.img-existing', function(){
      var f = $(this).data('filename') || '';
      $(this).off('error').attr('src', ctx + '/upload/uploadFiles/' + f);
    });

    // 기존 이미지 삭제 표시 수집
    $(d).on('click', '.btn-delete-existing', function(){
      var id = $(this).data('imgid');
      if (!id) return;
      if ($.inArray(String(id), deleteImageIds) < 0) deleteImageIds.push(String(id));
      $(this).closest('.img-box').addClass('to-delete');
    });

    // 수정완료
    $(d).on('click', '#btnSave', function(){
      var prodNo = $('#prodNo').val();
      var name   = $.trim($('#prodName').val());
      var detail = $.trim($('#prodDetail').val());
      var manu   = $.trim($('#manuDate').val());
      var priceS = $('#price').val(); // "12,345"도 허용 → 도메인 setPrice(String)

      if (!name){ alert('상품명을 입력하세요.'); $('#prodName').focus(); return; }
      if (!digits(priceS)){ alert('가격을 입력하세요.'); $('#price').focus(); return; }

      // 새 이미지: preview.js 확정 목록
      var files = [];
      if (w.AppPreview && typeof w.AppPreview.getFiles === 'function') {
        files = w.AppPreview.getFiles() || [];
      } else {
        var $uf = $('#uploadFiles');
        if ($uf.length && $uf[0] && $uf[0].files) files = $uf[0].files;
      }

      var fd = new FormData();
      fd.append('prodName',   name);
      fd.append('prodDetail', detail);
      fd.append('manuDate',   manu);
      fd.append('price',      priceS);

      for (var i=0;i<deleteImageIds.length;i++) fd.append('deleteImageIds', deleteImageIds[i]);
      for (var j=0;j<files.length;j++)         fd.append('uploadFiles', files[j]);

      $.ajax({
        url: ctx + '/api/products/' + encodeURIComponent(prodNo),
        type: 'POST',            // 파일 포함 업데이트는 POST
        data: fd,
        processData: false,
        contentType: false,
        success: function(){
          w.location.href = ctx + '/product/getProduct?prodNo=' + encodeURIComponent(prodNo);
        },
        error: function(xhr){
          console.log('상태코드:', xhr.status);
          console.log('응답본문:', xhr.responseText);
          alert('상품 수정에 실패했습니다.');
        }
      });
    });

    // 수정취소
    $(d).on('click', '#btnCancel', function(){
      var prodNo = $(this).data('prodno');
      w.location.href = ctx + '/product/getProduct?prodNo=' + encodeURIComponent(prodNo);
    });
  });
})(jQuery, window, document);

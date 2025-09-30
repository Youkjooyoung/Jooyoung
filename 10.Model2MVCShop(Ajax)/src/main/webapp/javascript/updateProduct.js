(function (w, d) {
  'use strict';
  var $ = w.jQuery; if (!$) return;

  function C(){ return (w.App && App.ctx ? App.ctx() : (d.body && d.body.getAttribute('data-ctx')) || ''); }
  function digits(s){ return (w.App && App.digits ? App.digits(s) : String(s||'').replace(/\D/g,'')); }
  function val($f, name){ return $.trim($f.find('[name="'+name+'"]').val() || ''); }
  
  function ensureDel($f){
    var $h = $f.find('input[name="deleteImageIds"]');
    if (!$h.length) $h = $('<input type="hidden" name="deleteImageIds">').appendTo($f);
    return $h;
  }

  $(function(){
    var $form = $('form[name="detailForm"]').length ? $('form[name="detailForm"]') : $('#updateProductForm');
    if (!$form.length) return;

    $(d).on('click', '.btn-delete-existing', function(){
      var $btn = $(this), id = $btn.data('imgid'); if (!id) return;
      var $box = $btn.closest('.img-box');
      var on = !$box.hasClass('removing');
      $box.toggleClass('removing', on).css({ opacity: on ? .4 : 1 });

      var $h = ensureDel($form);
      var arr = ($h.val()? $h.val().split(',') : []).filter(Boolean);
      if (on && arr.indexOf(String(id)) < 0) arr.push(String(id));
      if (!on) arr = arr.filter(function(x){ return x !== String(id); });
      $h.val(arr.join(','));
    });

    $(d).on('click', '#btnSave, #btnUpdate', function(e){
      e.preventDefault();

      var prodNo = val($form, 'prodNo');
      var name   = val($form, 'prodName');
      var detail = val($form, 'prodDetail');
      var manu   = val($form, 'manuDate');
      var price  = val($form, 'price');

      if (!prodNo) return alert('제품 번호가 없습니다.');
      if (!name){   alert('상품명을 입력하세요.');  $form.find('[name="prodName"]').focus();  return; }
      if (!detail){ alert('상품상세를 입력하세요.');$form.find('[name="prodDetail"]').focus();return; }
      if (!price){  alert('가격을 입력하세요.');    $form.find('[name="price"]').focus();    return; }

      var fd = new FormData();
      fd.append('prodName',  name);
      if (detail) fd.append('prodDetail', detail);
      if (manu)   fd.append('manuDate',   digits(manu));
      fd.append('price',     digits(price));

      var del = $form.find('input[name="deleteImageIds"]').val() || '';
      if (del) fd.append('deleteImageIds', del);

      if (w.AppPreview && typeof w.AppPreview.getFiles === 'function') {
        w.AppPreview.getFiles().forEach(function(f){ fd.append('uploadFiles', f); });
      } else {
        var fi = d.getElementById('uploadFiles');
        if (fi && fi.files) Array.prototype.forEach.call(fi.files, function(f){ fd.append('uploadFiles', f); });
      }

      $.ajax({
        url: C() + '/api/products/' + encodeURIComponent(prodNo),
        type: 'POST', data: fd, processData:false, contentType:false, dataType:'json'
      })
      .done(function(){
        alert('수정 완료');
        var v = Date.now();
        if (w.App && App.go) App.go('/product/getProduct', { prodNo: prodNo, v: v });
        else w.location.href = C() + '/product/getProduct?' + $.param({ prodNo: prodNo, v: v });
      })
      .fail(function(xhr){
        console.error(xhr.responseText || xhr); alert('수정 실패');
      });
    });

    // 취소
    $(d).on('click', '#btnCancel, #btnClose', function(e){
      e.preventDefault();
      var prodNo = val($form, 'prodNo');
      if (w.App && App.go) return App.go('/product/getProduct', { prodNo: prodNo });
      w.location.href = C() + '/product/getProduct?' + $.param({ prodNo: prodNo });
    });

    // 가격 보기용 포맷
    $(d).on('keyup', 'input[name="price"]', function(){
      var v = digits($(this).val());
      $(this).val(v ? Number(v).toLocaleString('ko-KR') : '');
    });
  });
})(window, document);

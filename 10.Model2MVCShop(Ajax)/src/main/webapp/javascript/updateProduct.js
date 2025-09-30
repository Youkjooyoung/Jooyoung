// /javascript/updateProduct.js
(function (w, d) {
  'use strict';
  var $ = w.jQuery; if (!$) return;

  function Ctx() { return (w.APP_CTX) || (d.body && d.body.getAttribute('data-ctx')) || ''; }
  function digits(s){ return String(s||'').replace(/\D/g,''); }
  function normalizeYmd(s){
    if(!s) return '';
    var t=String(s).trim();
    if(/^\d{4}-\d{2}-\d{2}$/.test(t)) return t.replace(/-/g,'');
    if(/^\d{8}$/.test(t)) return t;
    return '';
  }

  var editor;

  $(function () {
    var $form = $('#updateProductForm'); if (!$form.length) return;

    // 1) Toast UI Editor 초기화 + 초기값 반영
    editor = new toastui.Editor({
      el: d.querySelector('#editor'),
      height: '300px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      placeholder: '상품 상세내용을 입력하세요.'
    });
    var initHtml = $('#detailInit').val();
    if (initHtml) editor.setHTML(initHtml);

    // 2) 기존 이미지 삭제 토글
    $(d).on('click', '.btn-delete-existing', function(){
      var $btn=$(this), id=String($btn.data('imgid')||'');
      if(!id) return;
      var $box=$btn.closest('.img-box');
      var removing=!$box.hasClass('removing');
      $box.toggleClass('removing', removing).css('opacity', removing?0.4:1);

      var $hid=$('#deleteImageIds');
      var list=($hid.val()? $hid.val().split(','):[]).filter(Boolean);
      if(removing){ if(list.indexOf(id)<0) list.push(id); }
      else { list=list.filter(function(x){return x!==id;}); }
      $hid.val(list.join(','));
    });

    // 3) 저장
    $(d).on('click', '#btnSave', function(e){
      e.preventDefault();

      var name   = $.trim($form.find('[name="prodName"]').val());
      var priceV = $.trim($form.find('[name="price"]').val());
      var manu   = $.trim($form.find('[name="manuDate"]').val());
      var detail = editor.getHTML();

      if(!name){ alert('상품명을 입력하세요.'); return; }
      if(!detail || detail === '<p><br></p>'){ alert('상품상세를 입력하세요.'); return; }
      if(!priceV){ alert('가격을 입력하세요.'); return; }

      // 서버 전송용 값 세팅
      $('#prodDetail').val(detail);
      if(manu){ $('#manuDate').val( normalizeYmd(manu) ); }
      $('#price').val( digits(priceV) );

      if(!confirm('수정하시겠습니까?')) return;

      $form.attr({
        method: 'post',
        enctype: 'multipart/form-data',
        action: Ctx() + '/product/updateProduct'
      });

      // 표준 폼 제출
      $form[0].submit();
    });

    // 4) 취소
    $(d).on('click', '#btnCancel', function(e){
      e.preventDefault();
      var prodNo = $('#prodNo').val();
      if(w.App && App.go) App.go('/product/getProduct', { prodNo: prodNo });
      else location.href = Ctx() + '/product/getProduct?prodNo=' + encodeURIComponent(prodNo);
    });

    // 5) 가격 보기용 포맷
    $(d).on('keyup', 'input[name="price"]', function(){
      var v = digits($(this).val());
      $(this).val( v ? Number(v).toLocaleString('ko-KR') : '' );
    });
  });
})(window, document);

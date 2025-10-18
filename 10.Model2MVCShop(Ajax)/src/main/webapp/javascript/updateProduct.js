// /javascript/updateProduct.js  (ES5 호환)
(function (w, d, $) {
  'use strict';
  if (!$) return;

  $(function () {
    var CTX = $('body').data('ctx') || '';
    var editor = null;

    // ========== 네이버 스타일 Alert/Confirm (ES5) ==========
    function buildModal(opts) {
      opts = opts || {};
      var title = opts.title || '알림';
      var message = (typeof opts.message === 'string') ? opts.message : '';
      var okText = opts.okText || '확인';
      var cancelText = (typeof opts.cancelText === 'string') ? opts.cancelText : null;

      var $mask = $('<div class="dlg-mask" style="display:flex;"></div>');
      var $dlg  = $('<div class="dlg dlg-sm"></div>');
      var $hd   = $('<div class="dlg-hd"></div>').html(title);
      var $bd   = $('<div class="dlg-bd"></div>').html(message);
      var $ft   = $('<div class="dlg-ft"></div>');
      var $ok   = $('<button type="button" class="btn-green"></button>').text(okText);

      $ft.append($ok);
      if (cancelText !== null) {
        var $cancel = $('<button type="button" class="btn-gray"></button>').text(cancelText);
        $ft.append($cancel);
      }

      $dlg.append($hd).append($bd).append($ft);
      $mask.append($dlg);
      return { $mask: $mask, $ok: $ok, $cancel: $ft.find('.btn-gray') };
    }

    function nvAlert(message, title, okText) {
      title   = title   || '알림';
      okText  = okText  || '확인';
      return new Promise(function (resolve) {
        var parts = buildModal({ title: title, message: message, okText: okText });
        $('body').append(parts.$mask.hide()).find('.dlg-mask:last').fadeIn(120);

        function close() { parts.$mask.fadeOut(100, function(){ parts.$mask.remove(); }); }
        parts.$ok.on('click', function(){ close(); resolve(); });
        parts.$mask.on('click', function(e){ if (e.target === parts.$mask[0]) { close(); resolve(); } });
        $(d).on('keydown.nvDlg', function(e){
          if (e.key === 'Escape') { $(d).off('keydown.nvDlg'); close(); resolve(); }
        });
      });
    }

    function nvConfirm(message, title, okText, cancelText) {
      title      = title      || '확인';
      okText     = okText     || '확인';
      cancelText = cancelText || '취소';
      return new Promise(function (resolve) {
        var parts = buildModal({ title: title, message: message, okText: okText, cancelText: cancelText });
        $('body').append(parts.$mask.hide()).find('.dlg-mask:last').fadeIn(120);

        function close(val) { parts.$mask.fadeOut(100, function(){ parts.$mask.remove(); }); resolve(val); }
        parts.$ok.on('click', function(){ close(true);  });
        parts.$cancel.on('click', function(){ close(false); });
        parts.$mask.on('click', function(e){ if (e.target === parts.$mask[0]) close(false); });
        $(d).on('keydown.nvDlg', function(e){
          if (e.key === 'Escape') { $(d).off('keydown.nvDlg'); close(false); }
          if (e.key === 'Enter')  { $(d).off('keydown.nvDlg'); close(true);  }
        });
      });
    }
    // =======================================================

    // --- ToastUI 에디터 초기화 ---
    if (w.toastui && $('#editor').length) {
      var initHtml = $('#editor').data('initHtml') || '';
      editor = new toastui.Editor({
        el: d.querySelector('#editor'),
        height: '300px',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        placeholder: '상품 상세내용을 입력하세요.'
      });
      if (initHtml) editor.setHTML(initHtml);
    }

    // --- 가격 포맷 ---
    $(d).on('keyup', '#price', function () {
      var raw = this.value.replace(/[^\d]/g, '');
      this.value = raw ? Number(raw).toLocaleString('ko-KR') : '';
    });

    // --- 기존 이미지 삭제 토글 ---
    $(d).on('click', '.thumb-del', function () {
      var id = String($(this).data('imgid') || '');
      if (!id) return;
      var $box = $(this).closest('.img-box').toggleClass('removing');
      var $hid = $('#deleteImageIds');
      var arr = ($hid.val() ? $hid.val().split(',') : []);
      // filter(Boolean) 대체
      var arr2 = [];
      for (var i=0;i<arr.length;i++){ if(arr[i]) arr2.push(arr[i]); }
      arr = arr2;

      if ($box.hasClass('removing')) {
        if ($.inArray(id, arr) < 0) arr.push(id);
      } else {
        arr = $.grep(arr, function(x){ return x !== id; });
      }
      $hid.val(arr.join(','));
    });

    // --- 새 이미지 미리보기 ---
    $(d).on('change', '#uploadFiles', function () {
      var $prev = $('#preview-container').empty();
      var files = this.files || [];
      for (var i=0;i<files.length;i++){
        var f = files[i];
        if (!/^image\//.test(f.type)) continue;
        (function(file){
          var r = new FileReader();
          r.onload = function (e) {
            var $t = $(
              '<div class="img-box">' +
                '<img src="' + e.target.result + '" alt="preview"/>' +
                '<button type="button" class="thumb-del-new" aria-label="삭제">✖</button>' +
              '</div>'
            );
            $t.find('.thumb-del-new').on('click', function(){ $t.remove(); });
            $prev.append($t);
          };
          r.readAsDataURL(file);
        })(f);
      }
    });

    // --- 저장(수정완료) ---
    $(d).off('click.btnSave').on('click.btnSave', '#btnSave', function (e) {
      e.preventDefault();
      nvConfirm('수정 내용을 저장하시겠습니까?', '수정 확인', '저장', '취소').then(function (ok) {
        if (!ok) return;

        var html = (editor && editor.getHTML) ? editor.getHTML() : $('#prodDetail').val();
        $('#prodDetail').val(html);

        $('#price').val(String($('#price').val()).replace(/[^\d]/g, ''));

        $('#updateProductForm').attr({
          method: 'post',
          enctype: 'multipart/form-data',
          action: CTX + '/product/updateProduct'
        })[0].submit();
      });
    });

    // --- 취소 ---
    $(d).off('click.btnCancel').on('click.btnCancel', '#btnCancel', function (e) {
      e.preventDefault();
      nvConfirm('수정을 취소하시겠습니까?<br>변경 사항이 저장되지 않습니다.', '취소 확인', '예', '아니오')
        .then(function (ok) {
          if (!ok) return;
          var no = $('#prodNo').val();
          location.href = CTX + '/product/getProduct?prodNo=' + encodeURIComponent(no);
        });
    });

    // --- 목록 ---
    $(d).off('click.btnList').on('click.btnList', '#btnList', function (e) {
      e.preventDefault();
      nvConfirm('목록으로 이동할까요?<br>변경 사항이 저장되지 않습니다.', '이동 확인', '이동', '머물기')
        .then(function (ok) {
          if (!ok) return;
          location.href = CTX + '/product/listProduct';
        });
    });
  });
})(window, document, window.jQuery);

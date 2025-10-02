// /javascript/updatePurchase.js
(function (w, d, $) {
  'use strict'; if (!$) return;

  function val(sel){ return $.trim($(sel).val() || ''); }

  // === 에러 메시지 표시 ===
  function showError($input, msg) {
    var $err = $input.siblings('.error-msg');
    if (!$err.length) {
      $err = $('<span class="error-msg"></span>');
      $input.after($err);
    }
    $err.text(msg).show();
    $input.addClass("is-invalid").removeClass("is-valid");
  }
  function clearError($input) {
    $input.siblings('.error-msg').hide();
    $input.removeClass("is-invalid").addClass("is-valid");
  }

  // === 전화번호 정규화 ===
  function normalizePhone(s){
    var digits = (s || '').replace(/[^\d]/g, '');
    if (digits.length === 11)
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (digits.length === 10)
      return digits.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    return digits;
  }

  // === 오늘 이후 날짜 확인 ===
  function isFutureOrToday(yyyy_mm_dd){
    if (!yyyy_mm_dd) return true;
    var today = new Date(); today.setHours(0,0,0,0);
    var p = yyyy_mm_dd.split('-');
    if (p.length !== 3) return false;
    var dt = new Date(parseInt(p[0],10), parseInt(p[1],10)-1, parseInt(p[2],10));
    return !isNaN(dt.getTime()) && dt >= today;
  }

  // === 검증 함수 ===
  function validateForm() {
    var valid = true;

    var $name  = $('[name=receiverName]');
    var $phone = $('[name=receiverPhone]');
    var $zip   = $('[name=zipcode]');
    var $addr  = $('[name=divyAddr]');
    var $detail= $('[name=addrDetail]');
    var $divy  = $('[name=divyDate]');
    var $req   = $('[name=divyRequest]');

    var name  = val('[name=receiverName]');
    var phone = normalizePhone(val('[name=receiverPhone]'));
    var zip   = val('[name=zipcode]');
    var addr  = val('[name=divyAddr]');
    var detail= val('[name=addrDetail]');
    var divy  = val('[name=divyDate]');
    var req   = val('[name=divyRequest]');

    // === 수령인 ===
    if (!name) { showError($name, '수령인을 입력하세요.'); valid = false; }
    else clearError($name);

    // === 연락처 ===
    if (!phone) { showError($phone, '연락처를 입력하세요.'); valid = false; }
    else if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)) {
      showError($phone, '연락처 형식이 올바르지 않습니다. 예) 010-1234-5678');
      valid = false;
    } else {
      clearError($phone);
      $phone.val(phone);
    }

    // === 우편번호 ===
    if (!zip) { showError($zip, '우편번호를 선택하세요.'); valid = false; }
    else clearError($zip);

    // === 기본 주소 ===
    if (!addr) { showError($addr, '기본 주소를 선택하세요.'); valid = false; }
    else clearError($addr);

    // === 상세 주소 ===
    if (!detail) { showError($detail, '상세주소를 입력하세요.'); valid = false; }
    else clearError($detail);

    // === 요청사항 ===
    if (req.length > 200) { showError($req, '요청사항은 200자 이내로 입력하세요.'); valid = false; }
    else clearError($req);

    // === 배송일 ===
    if (!isFutureOrToday(divy)) {
      showError($divy, '배송희망일은 오늘 이후여야 합니다.');
      valid = false;
    } else clearError($divy);

    return valid;
  }

  $(function () {
    var ctx = (w.App && typeof w.App.ctx === 'function') ? w.App.ctx() : ($('body').data('ctx') || '');

    // === 실시간 검증 이벤트 ===
    $(d).on('blur input change', 'input, textarea', function(){
      validateForm();
    });

    // === 수정완료 버튼 ===
    $(d).on('click', '#btnUpdate', function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      // 전화번호 하이픈 제거 후 DB저장
      var $phone = $('[name=receiverPhone]');
      $phone.val($phone.val().replace(/-/g,''));

      var form = $('form[name=purchaseForm]')[0];
      form.action = ctx + '/purchase/update';
      form.method = 'post';
      form.submit();
    });

    // === 취소 버튼 ===
    $(d).on('click', '#btnCancel', function (e) {
      e.preventDefault();
      var tranNo = val('[name=tranNo]');
      if (tranNo) {
        if (w.App && typeof w.App.go === 'function') w.App.go('/purchase/' + encodeURIComponent(tranNo));
        else w.location.href = ctx + '/purchase/' + encodeURIComponent(tranNo);
      } else {
        history.back();
      }
    });

    // === 입력 중 전화번호 자동 정리 ===
    $(d).on('input', '[name=receiverPhone]', function(){
      var norm = normalizePhone($(this).val());
      $(this).val(norm);
    });

    // === 주소검색 버튼 ===
    $(d).on('click', '#btnAddr', function(){
      new daum.Postcode({
        oncomplete: function(data) {
          var addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
          var extra = '';
          if(data.bname && /[동|로|가]$/g.test(data.bname)){
            extra += data.bname;
          }
          if(data.buildingName && data.apartment === 'Y'){
            extra += (extra ? ', ' + data.buildingName : data.buildingName);
          }
          if(extra) addr += ' ('+extra+')';

          $('#zipcode').val(data.zonecode);
          $('#divyAddr').val(addr);
          $('#addrDetail').val('').focus();
          validateForm();
        }
      }).open();
    });
  });
})(window, document, window.jQuery);

/* addPurchase.js – 구매 등록 + 모달 확인 + 실시간 validation (보강) */
(function($, w, d) {
  'use strict'; 
  if (!$) return;

  $(function() {
    var ctx = App.ctx(),
        $form = $('form[name=purchaseForm]'),
        $modal = $('#confirmModal'),
        $btnSubmit = $('#btnSubmit'),
        $btnConfirm = $('#btnConfirm'),
        $btnClose = $('#btnClose');

    // ===== 오늘 이전 날짜 선택 불가(min 세팅) =====
    (function lockPastDate(){
      var $date = $form.find('[name=divyDate]');
      if ($date.length) {
        var today = new Date(); today.setHours(0,0,0,0);
        var yyyy = today.getFullYear();
        var mm = ('0' + (today.getMonth() + 1)).slice(-2);
        var dd = ('0' + today.getDate()).slice(-2);
        $date.attr('min', yyyy + '-' + mm + '-' + dd);
      }
    })();

    // ===== 에러 메시지 헬퍼 =====
    function showError($input, msg) {
      var $err = $input.siblings('.error-msg');
      if (!$err.length) {
        $err = $('<span class="error-msg"></span>');
        $input.after($err);
      }
      $err.text(msg).show();
    }
    function clearError($input) {
      $input.siblings('.error-msg').hide();
    }

    // ===== validation =====
    function validateForm() {
      var valid = true, firstInvalid = null;

      var $payment = $form.find('[name=paymentOption]');
      if (!$payment.val()) {
        showError($payment, '결제수단을 선택해주세요.');
        valid = false; if (!firstInvalid) firstInvalid = $payment;
      } else clearError($payment);

      var $receiver = $form.find('[name=receiverName]');
      if (!$receiver.val().trim()) {
        showError($receiver, '수령인을 입력해주세요.');
        valid = false; if (!firstInvalid) firstInvalid = $receiver;
      } else clearError($receiver);

      var $phone = $form.find('[name=receiverPhone]');
      var phone = ($phone.val() || '').trim();
      if (!phone) {
        showError($phone, '연락처를 입력해주세요.');
        valid = false; if (!firstInvalid) firstInvalid = $phone;
      } else if (!/^(01[016789])[0-9]{3,4}[0-9]{4}$/.test(phone)) {
        showError($phone, '연락처 형식이 올바르지 않습니다. 예: 01012345678');
        valid = false; if (!firstInvalid) firstInvalid = $phone;
      } else clearError($phone);

      var $date = $form.find('[name=divyDate]');
      var date = $date.val();
      if (!date) {
        showError($date, '희망배송일을 선택해주세요.');
        valid = false; if (!firstInvalid) firstInvalid = $date;
      } else {
        var today = new Date(); today.setHours(0,0,0,0);
        var selected = new Date(date);
        if (selected < today) {
          showError($date, '희망배송일은 오늘 이후 날짜여야 합니다.');
          valid = false; if (!firstInvalid) firstInvalid = $date;
        } else clearError($date);
      }

      var $addr = $form.find('[name=divyAddr]');
      var addr = ($addr.val() || '').trim();
      if (!addr) {
        showError($addr, '배송주소를 입력해주세요.');
        valid = false; if (!firstInvalid) firstInvalid = $addr;
      } else if (addr.length < 5) {
        showError($addr, '배송주소가 너무 짧습니다.');
        valid = false; if (!firstInvalid) firstInvalid = $addr;
      } else clearError($addr);

      return { valid: valid, firstInvalid: firstInvalid };
    }

    // ===== 실시간 검증 + 숫자필터(연락처) =====
    $form.find('input, select, textarea').on('blur input change', function() {
      validateForm();
    });
    $form.find('[name=receiverPhone]').on('input', function(){
      this.value = App.digits(this.value);
    });

    // ===== 폼 밖 클릭 시 전체 검증 =====
    $(d).on('click', function(e) {
      if (!$(e.target).closest('form[name=purchaseForm]').length) {
        validateForm();
      }
    });

    // ===== 주문 등록 버튼 → 검증 후 모달 열기 =====
    $btnSubmit.on('click', function(e) {
      e.preventDefault();
      var result = validateForm();
      if (result.valid) {
        $modal.fadeIn(120);
      } else if (result.firstInvalid && result.firstInvalid.length) {
        result.firstInvalid.focus();
        result.firstInvalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // ===== 모달: 확인 → 재검증 + 중복제출 방지 + submit =====
    $btnConfirm.on('click', function(e) {
      e.preventDefault();
      App.lock($btnConfirm, function() {
        var result = validateForm();
        if (!result.valid) {
          alert('입력값을 다시 확인해주세요.');
          if (result.firstInvalid && result.firstInvalid.length) {
            result.firstInvalid.focus();
            result.firstInvalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
        var form = d.purchaseForm;
        form.action = ctx + '/purchase/add';
        form.method = 'post';
        form.submit();
      });
    });

    // ===== 모달: 취소/백드롭 닫기 =====
    $btnClose.on('click', function(e) {
      e.preventDefault();
      $modal.fadeOut(120);
    });
    // 모달 바깥(백드롭) 클릭 시 닫힘
    $modal.on('click', function(e){
      if (e.target === this) { $modal.fadeOut(120); }
    });
    // 모달 콘텐츠 클릭 시 버블링 차단(옵션)
    $modal.find('.modal-content').on('click', function(e){ e.stopPropagation(); });

    // ===== 화면의 취소 버튼 → 목록 이동 =====
    $('#btnCancel').on('click', function(e) {
      e.preventDefault();
      App.go('/product/listProduct');
    });
  });
})(jQuery, window, document);

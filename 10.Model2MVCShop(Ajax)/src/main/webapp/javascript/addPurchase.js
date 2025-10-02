/* addPurchase.js – 구매 등록 + 모달 확인 + 실시간 validation + 주소검색 */
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

    // ===== 메시지 헬퍼 =====
    function ensureErrorSpan($input){
      var $err = $input.siblings('.error-msg');
      if (!$err.length) {
        $err = $('<span class="error-msg" role="alert" aria-live="polite"></span>');
        $input.after($err);
      }
      return $err;
    }
    function showError($input, msg){
      ensureErrorSpan($input).text(msg).show();
      $input.addClass('is-invalid').removeClass('is-valid');
    }
    function clearError($input){
      ensureErrorSpan($input).text('').hide();
      $input.removeClass('is-invalid').addClass('is-valid');
    }

    // ===== 단일 필드 검증 =====
    function validateField($input){
      var name = $input.attr('name');
      var v = ($input.val() || '').trim();

      if (name === 'paymentOption'){
        if (!v){ showError($input, '결제수단을 선택해주세요.'); return false; }
        clearError($input); return true;
      }

      if (name === 'receiverName'){
        if (!v){ showError($input, '수령인을 입력해주세요.'); return false; }
        if (v.length < 2){ showError($input, '수령인은 2자 이상이어야 합니다.'); return false; }
        clearError($input); return true;
      }

      if (name === 'receiverPhone'){
        var digits = App.digits(v);
        var formatted = digits;
        if (digits.length >= 11) {
          formatted = digits.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
        } else if (digits.length === 10) {
          formatted = digits.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
        } else if (digits.length > 3 && digits.length <= 7) {
          formatted = digits.replace(/^(\d{3})(\d{1,4})$/, '$1-$2');
        }
        $input.val(formatted);
        v = digits;

        if (!v){ showError($input, '연락처를 입력해주세요.'); return false; }
        var ok = /^01[016789]\d{3,4}\d{4}$/.test(v);
        if (!ok){
          showError($input, '연락처 형식이 올바르지 않습니다. 예: 01012345678');
          return false;
        }
        clearError($input); return true;
      }

      if (name === 'divyDate'){
        if (!v){ showError($input, '희망배송일을 선택해주세요.'); return false; }
        var today = new Date(); today.setHours(0,0,0,0);
        var selected = new Date(v);
        if (selected < today){ showError($input, '희망배송일은 오늘 이후 날짜여야 합니다.'); return false; }
        clearError($input); return true;
      }

      if (name === 'divyAddr'){
        if (!v){ showError($input, '기본 주소를 검색 후 선택해주세요.'); return false; }
        clearError($input); return true;
      }

      if (name === 'addrDetail'){
        if (!v){ showError($input, '상세주소를 입력해주세요.'); return false; }
        if (v.length < 2){ showError($input, '상세주소가 너무 짧습니다.'); return false; }
        clearError($input); return true;
      }

      if (name === 'zipcode'){
        if (!v){ showError($input, '우편번호를 선택해주세요.'); return false; }
        clearError($input); return true;
      }

      return true;
    }

    // ===== 전체 검증 =====
    function validateForm(){
      var valid = true, firstInvalid = null;

      $form.find('[name=paymentOption],[name=receiverName],[name=receiverPhone],[name=divyDate],[name=zipcode],[name=divyAddr],[name=addrDetail]').each(function(){
        var ok = validateField($(this));
        if (!ok && !firstInvalid){ firstInvalid = $(this); valid = false; }
      });

      $btnSubmit.prop('disabled', !valid);
      $btnConfirm.prop('disabled', !valid);

      return { valid: valid, firstInvalid: firstInvalid };
    }

    // ===== 실시간 검증 바인딩 =====
    $form.on('input blur change', 'input, select, textarea', function(){
      validateField($(this));
      validateForm();
    });

    // ===== 주문 등록 버튼 → 모달 열기 =====
    $btnSubmit.on('click', function(e){
      e.preventDefault();
      var result = validateForm();
      if (result.valid){
        $modal.fadeIn(120);
      } else if (result.firstInvalid){
        result.firstInvalid.focus();
        result.firstInvalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // ===== 모달: 확인 → submit =====
    $btnConfirm.on('click', function(e){
      e.preventDefault();
      App.lock($btnConfirm, function(){
        var result = validateForm();
        if (!result.valid) return;

        var $phone = $form.find('[name=receiverPhone]');
        $phone.val(App.digits($phone.val())); // DB에는 하이픈 제거

        var form = d.purchaseForm;
        form.action = ctx + '/purchase/add';
        form.method = 'post';
        form.submit();
      });
    });

    // ===== 모달 닫기 =====
    $btnClose.on('click', function(e){ e.preventDefault(); $modal.fadeOut(120); });
    $modal.on('click', function(e){ if (e.target === this){ $modal.fadeOut(120); } });

    // ===== 취소 → 목록 이동 =====
    $('#btnCancel').on('click', function(e){
      e.preventDefault();
      App.go('/product/listProduct');
    });

    // ===== 주소검색 팝업 연동 =====
	$('#btnAddr').on('click', function(){
	  new daum.Postcode({
	    oncomplete: function(data) {
	      var addr = '';

	      // 기본 주소: 도로명 → 지번 순으로 보장
	      if (data.roadAddress) {
	        addr = data.roadAddress;
	      } else if (data.jibunAddress) {
	        addr = data.jibunAddress;
	      }

	      // 참고항목(법정동/건물명 등)
	      var extra = '';
	      if (data.bname && /[동|로|가]$/g.test(data.bname)) {
	        extra += data.bname;
	      }
	      if (data.buildingName && data.apartment === 'Y') {
	        extra += (extra ? ', ' + data.buildingName : data.buildingName);
	      }
	      if (extra) {
	        addr += ' ('+extra+')';
	      }

	      // 필드에 채워넣기
	      $('#zipcode').val(data.zonecode);
	      $('#addr').val(addr);        // 기본주소
	      $('#divyAddr').val(addr);    // 서버전송용 (폼 name=divyAddr)
	      $('#addrDetail').val('').focus(); // 상세주소 초기화 후 포커스
	      validateForm();
	    }
	  }).open();
	});

    // 초기 상태 검사
    validateForm();
  });
})(jQuery, window, document);

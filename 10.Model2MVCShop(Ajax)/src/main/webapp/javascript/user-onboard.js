(function(w, d, $){
  'use strict'; if(!$) return;

  // ========= 기존 유틸 =========
  function isPhone(s){ return /^\d{2,3}-\d{3,4}-\d{4}$/.test(s); }
  function autoHyphenPhone(val){
    val = val.replace(/[^0-9]/g, '');
    if(val.length < 4) return val;
    if(val.length < 7) return val.replace(/(\d{3})(\d+)/, '$1-$2');
    if(val.length < 11) return val.replace(/(\d{3})(\d{3,4})(\d+)/, '$1-$2-$3');
    return val.replace(/(\d{3})(\d{4})(\d{4}).*/, '$1-$2-$3');
  }

  // ========= 아이콘 유틸 =========
  function ensureMark($input){
    var $cell = $input.closest('td');
    if(!$cell.hasClass('vfield')) $cell.addClass('vfield');
    if(!$input.siblings('.vmark').length){
      $('<span class="vmark" aria-hidden="true"/>').insertAfter($input);
    }
  }
  function setMark($input, ok){
    ensureMark($input);
    var $m = $input.siblings('.vmark');
    if(ok){ $m.removeClass('err').addClass('ok').show(); }
    else  { $m.removeClass('ok').addClass('err').show(); }
  }

  // ========= 규칙 =========
  function isKorName(s){ return /^[가-힣]{2,6}$/.test(s); }           // 한글 2~6
  function isEngName(s){ return /^[A-Za-z]{5,20}$/.test(s); }        // 영문 5~20
  function isEmailIdEngOnly(s){ return /^[A-Za-z]{3,30}$/.test(s); } // 아이디 영문만
  function isDomainValid(s){ return /^[A-Za-z]+(\.[A-Za-z]{2,10}){1,2}$/.test(s); } // 영문+점

  // ========= 디바운스 & 중복 캐시 =========
  function debounce(fn, wait){ let t; return function(){ clearTimeout(t); t=setTimeout(()=>fn.apply(this, arguments), wait); }; }
  var emailDupOK = false, phoneDupOK = false;

  $(function(){
    var CTX = $('body').data('ctx') || '';

    var $name = $('#userName'),
        $email = $('#email'),                 // hidden 최종값
        $emailId = $('#emailId'),
        $emailDomain = $('#emailDomain'),
        $emailCustom = $('#emailCustom'),
        $phone = $('#phone'),
        $zipcode = $('#zipcode'),
        $addr = $('#addr'),
        $addrDetail = $('#addrDetail'),
        $btnSave = $('#btnSave');

    // 아이콘 자리
    ensureMark($name); ensureMark($emailId); ensureMark($emailCustom);
    ensureMark($phone); ensureMark($addr);

    // Enter 이동
    $('input').on('keydown', function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        var $inputs = $('input:visible');
        var idx = $inputs.index(this);
        if(idx >= 0 && idx < $inputs.length - 1){ $inputs.eq(idx + 1).focus(); }
        else{ $btnSave.focus(); }
      }
    });

    // 전화번호 자동 하이픈 + 검증
    $phone.on('input', function(){
      this.value = autoHyphenPhone(this.value);
      validatePhone();
    });

    // 이메일 입력 필터(한글/특수문자 제거)
    $emailId.on('input', function(){
      var v = $(this).val().replace(/[^A-Za-z]/g,'');
      if(v !== $(this).val()) $(this).val(v);
      syncEmail(); validateEmail();
    });
    $emailCustom.on('input', function(){
      var v = $(this).val().replace(/[^A-Za-z.]/g,'');
      if(v !== $(this).val()) $(this).val(v);
      syncEmail(); validateEmail();
    });

    // 이메일 조합
    function syncEmail(){
      var id = ($emailId.val() || '').trim();
      var domain = $emailDomain.val();
      var d = (domain === '직접입력') ? ($emailCustom.val() || '').trim() : domain;
      $email.val(id && d ? (id + '@' + d) : '');
    }

    $emailDomain.on('change', function(){
      if($(this).val() === '직접입력'){
        $emailCustom.addClass('show').removeClass('hidden').focus();
      }else{
        $emailCustom.removeClass('show').addClass('hidden').val('');
      }
      syncEmail(); validateEmail();
    });

    // 메시지
    function showError($el, msg){
      var $msg = $el.closest('td').find('.error-msg');
      if(!$msg.length){ $msg = $('<span class="error-msg"/>').appendTo($el.closest('td')); }
      $msg.text(msg).removeClass('hidden');
      $el.addClass('input-error');
    }
    function hideError($el){
      var $msg = $el.closest('td').find('.error-msg');
      $msg.addClass('hidden');
      $el.removeClass('input-error');
    }

    // ===== 서버 중복검사 =====
    function checkEmailDup(email){
      return $.ajax({
        url: CTX + '/user/json/existsEmail',
        method: 'GET',
        dataType: 'json',
        data: { email: email }
      }).then(function(res){
        emailDupOK = !res.exists;
        return emailDupOK;
      }, function(){ emailDupOK = false; return false; });
    }
    function checkPhoneDup(phone){
      return $.ajax({
        url: CTX + '/user/json/existsPhone',
        method: 'GET',
        dataType: 'json',
        data: { phone: phone }
      }).then(function(res){
        phoneDupOK = !res.exists;
        return phoneDupOK;
      }, function(){ phoneDupOK = false; return false; });
    }
    var debouncedEmailDup = debounce(function(full){
      checkEmailDup(full).then(function(ok){
        if(ok){ hideError($emailId); hideError($emailCustom); setMark($emailId, true); }
        else { showError($emailId, '이미 사용 중인 이메일입니다.'); setMark($emailId, false); }
      });
    }, 250);
    var debouncedPhoneDup = debounce(function(v){
      checkPhoneDup(v).then(function(ok){
        if(ok){ hideError($phone); setMark($phone, true); }
        else { showError($phone, '이미 사용 중인 번호입니다.'); setMark($phone, false); }
      });
    }, 250);

    // ===== 검증기 =====
    function validateName(){
      var v = ($name.val() || '').trim();
      var ok = isKorName(v) || isEngName(v);
      if(!ok) showError($name, '이름: 한글 2~6자 또는 영문 5~20자');
      else    hideError($name);
      setMark($name, ok);
      return ok;
    }

    function validateEmail(){
      var id = ($emailId.val() || '').trim();
      var domainSel = $emailDomain.val();
      var domainStr = (domainSel === '직접입력') ? ($emailCustom.val() || '').trim() : domainSel;

      var idOk = isEmailIdEngOnly(id);
      var domainOk = isDomainValid(domainStr);
      var ok = idOk && domainOk;

      var $target = (domainSel === '직접입력') ? $emailCustom : $emailId;

      if(!idOk) showError($emailId, '아이디는 영문 3~30자만 허용'); else hideError($emailId);
      if(domainSel === '직접입력'){
        if(!domainOk) showError($emailCustom, '도메인은 영문과 점(.)만, 예) example.com');
        else          hideError($emailCustom);
      }

      setMark($target, ok);
      $email.val(ok ? (id + '@' + domainStr) : '');

      // 형식 OK면 원격 중복검사
      if(ok){ debouncedEmailDup(id + '@' + domainStr); }
      else  { emailDupOK = false; }
      return ok;
    }

    function validatePhone(){
      var v = ($phone.val() || '').trim();
      var ok = !!v && isPhone(v);
      ok ? hideError($phone) : showError($phone, '예: 010-1234-5678');
      setMark($phone, ok);
      if(ok){ debouncedPhoneDup(v); } else { phoneDupOK = false; }
      return ok;
    }

    // 상세주소는 선택입력 → 기본주소/우편번호만 필수
    function validateAddr(){
      var ok = !!$zipcode.val().trim() && !!$addr.val().trim();
      if(!ok) showError($addr, '우편번호/기본주소를 입력하세요.');
      else    hideError($addr);
      setMark($addr, ok);
      return ok;
    }

    // 주소검색
    $('#btnAddr').on('click', function(){
      new daum.Postcode({
        oncomplete: function(data){
          var addr = data.roadAddress || data.jibunAddress || '';
          var extra = '';
          if(data.bname && /[동|로|가]$/.test(data.bname)) extra += data.bname;
          if(data.buildingName && data.apartment === 'Y') extra += (extra ? ', ' : '') + data.buildingName;
          if(extra) addr += ' (' + extra + ')';
          $zipcode.val(data.zonecode);
          $addr.val(addr);
          validateAddr();
          $addrDetail.val('').focus();
        }
      }).open();
    });

    // 실시간 바인딩
    $name.on('input blur', validateName);
    $addr.on('input blur', validateAddr);
    $phone.on('blur', validatePhone);
    $emailId.on('blur', validateEmail);
    $emailCustom.on('blur', validateEmail);
    $emailDomain.on('blur', validateEmail);

    // 저장
    $('#btnSave').on('click', function(){
      var okLocal = validateName() & validateEmail() & validatePhone() & validateAddr();
      if(!okLocal){ alert('입력값을 다시 확인하세요.'); return; }
      if(!emailDupOK || !phoneDupOK){
        alert('이메일/전화번호 중복을 확인해주세요.');
        return;
      }
	  
	  //  취소 버튼
	  $('#btnCancel').on('click', function(){
	    var CTX = $('body').data('ctx') || '';
	    window.location.href = CTX + '/index.jsp';
	  });

      var data = {
        userName   : $name.val().trim(),
        email      : $email.val().trim(),
        phone      : $phone.val().trim(),
        zipcode    : $zipcode.val().trim(),
        addr       : $addr.val().trim(),
        addrDetail : $addrDetail.val().trim()
      };

      var $btn = $(this).prop('disabled', true);
      $.ajax({
        url: CTX + '/user/json/completeProfile',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data)
      }).done(function(res){
        if(res && res.success){
          alert('저장되었습니다. 메인으로 이동합니다.');
          w.top.location.href = CTX + '/index.jsp';
        }else{
          alert(res && res.message ? res.message : '저장에 실패했습니다.');
        }
      }).fail(function(xhr){
        if(xhr.status === 401){
          alert('세션이 만료되었습니다. 다시 로그인하세요.');
          w.location.href = CTX + '/user/loginView.jsp';
          return;
        }
        alert('통신 오류가 발생했습니다. (' + xhr.status + ')');
      }).always(function(){ $btn.prop('disabled', false); });
    });

    // 초기
    (function init(){
      // 도메인이 selected이면 숨김 유지
      if($emailDomain.val() !== '직접입력'){
        $emailCustom.addClass('hidden').removeClass('show');
      }
      syncEmail();
      validateName(); validateEmail(); validatePhone(); validateAddr();
    })();
  });
})(window, document, jQuery);

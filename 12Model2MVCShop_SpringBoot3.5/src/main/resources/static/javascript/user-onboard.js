(($, w, d) => {
  'use strict';
  if (!$) return;

  // 기본 confirm/alert 대체
  if (typeof w.nvConfirm === 'undefined') {
    w.nvConfirm = (msg, title, ok, cancel) => {
      return new Promise((r) => {
        const prefix = title ? `[${title}]\n` : '';
        confirm(prefix + msg.replace(/<br\s*\/?>/g, '\n')) ? r(true) : r(false);
      });
    };
  }
  if (typeof w.nvAlert === 'undefined') {
    w.nvAlert = (msg, title) => {
      return new Promise((r) => {
        const prefix = title ? `[${title}]\n` : '';
        alert(prefix + msg.replace(/<br\s*\/?>/g, '\n'));
        r(true);
      });
    };
  }

  $(() => {
    const CTX = $('body').data('ctx') || '';

    const $name = $('#userName');
    const $email = $('#email');
    const $emailId = $('#emailId');
    const $emailDomain = $('#emailDomain');
    const $emailCustom = $('#emailCustom');
    const $phone = $('#phone');
    const $zipcode = $('#zipcode');
    const $addr = $('#addr');
    const $addrDetail = $('#addrDetail');
    const $btnSave = $('#btnSave');
    const $btnCancel = $('#btnCancel');

    // 전화번호 하이픈 자동삽입
    $phone.on('input', (e) => {
      let v = e.target.value.replace(/[^0-9]/g, '');
      let f = '';
      if (v.length < 4) f = v;
      else if (v.length < 7) f = v.replace(/(\d{3})(\d+)/, '$1-$2');
      else f = v.replace(/(\d{3})(\d{3,4})(\d{4}).*/, '$1-$2-$3');
      e.target.value = f;
    });

    // 이메일
    const buildEmail = () => {
      const id = $emailId.val().trim();
      const domain = $emailDomain.val() === '직접입력' ? $emailCustom.val().trim() : $emailDomain.val();
      const full = id && domain ? `${id}@${domain}` : '';
      $email.val(full);
    };

    $emailDomain.on('change', () => {
      if ($emailDomain.val() === '직접입력') $emailCustom.show().focus();
      else $emailCustom.hide().val('');
      buildEmail();
    });
    $emailId.on('blur', buildEmail);
    $emailCustom.on('blur', buildEmail);

    // 주소검색
	$('#btnAddr').on('click', () => {
	  const LOAD_URL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

	  const openPostcode = () => {
	    new window.daum.Postcode({
	      oncomplete: (data) => {
	        let addr = data.roadAddress || data.jibunAddress || '';
	        let extra = '';
	        if (data.bname && /[동|로|가]$/.test(data.bname)) extra += data.bname;
	        if (data.buildingName && data.apartment === 'Y') extra += (extra ? ', ' : '') + data.buildingName;
	        if (extra) addr += ` (${extra})`;
	        $zipcode.val(data.zonecode);
	        $addr.val(addr);
	        $addrDetail.val('').focus();
	      }
	    }).open();
	  };

	  // 이미 로드돼 있으면 바로 실행
	  if (window.daum && window.daum.Postcode) return openPostcode();

	  // 💡 jQuery로 스크립트 로드할 때 cache:true를 반드시 지정!
	  $.ajax({
	    url: LOAD_URL,
	    dataType: 'script',
	    cache: true // <<< 이게 핵심 (쿼리스트링 방지)
	  }).done(openPostcode)
	    .fail(() => nvAlert('우편번호 스크립트 로드 실패'));
	});

    // 저장
    $btnSave.on('click', () => {
      const data = {
        userName: $name.val().trim(),
        email: $email.val().trim(),
        phone: $phone.val().trim(),
        zipcode: $zipcode.val().trim(),
        addr: $addr.val().trim(),
        addrDetail: $addrDetail.val().trim()
      };

      nvConfirm('저장하시겠습니까?', '저장 확인', '예', '아니오').then((ok) => {
        if (!ok) return;
        $.ajax({
          url: `${CTX}/user/json/completeProfile`,
          method: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=UTF-8',
          data: JSON.stringify(data)
        })
          .done((res) => {
            if (res?.success) {
              nvAlert('저장되었습니다. 메인으로 이동합니다.').then(() => (w.location.href = `${CTX}/index.jsp`));
            } else nvAlert(res?.message || '저장 실패');
          })
          .fail((xhr) => nvAlert(`통신 오류 (${xhr.status})`));
      });
    });

    // 취소
    $btnCancel.on('click', () => {
      nvConfirm('입력 내용을 취소하고 메인으로 이동할까요?', '이동 확인', '예', '아니오')
        .then((ok) => ok && (w.location.href = `${CTX}/index.jsp`));
    });
  });
})(jQuery, window, document);

(($, w, d) => {
  'use strict';
  if (!$) return;

  const ctx = () => ($('body').data('ctx') || '');
  const val = (sel) => $.trim($(sel).val() || '');
  const showErr = ($i, msg) => { let $e = $i.siblings('.error-msg'); if (!$e.length) $e = $('<span class="error-msg text-sm text-red-600"/>').insertAfter($i); $e.text(msg).removeClass('hidden').show(); $i.addClass('ring-2 ring-red-400'); };
  const clearErr = ($i) => { $i.siblings('.error-msg').addClass('hidden').hide(); $i.removeClass('ring-2 ring-red-400'); };
  const normPhone = (s) => { const d = (s || '').replace(/[^\d]/g, ''); if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); if (d.length === 10) return d.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3'); return d; };
  const futureOrToday = (ymd) => { if (!ymd) return true; const today = new Date(); today.setHours(0,0,0,0); const p = ymd.split('-'); if (p.length !== 3) return false; const dt = new Date(+p[0], +p[1]-1, +p[2]); return !isNaN(dt.getTime()) && dt >= today; };

  const validate = () => {
    let ok = true;
    const $name = $('[name=receiverName]');
    const $phone = $('[name=receiverPhone]');
    const $zip = $('[name=zipcode]');
    const $addr = $('[name=divyAddr]');
    const $detail = $('[name=addrDetail]');
    const $divy = $('[name=divyDate]');
    const $req = $('[name=divyRequest]');

    const name = val('[name=receiverName]');
    const phone = normPhone(val('[name=receiverPhone]'));
    const zip = val('[name=zipcode]');
    const addr = val('[name=divyAddr]');
    const detail = val('[name=addrDetail]');
    const divy = val('[name=divyDate]');
    const req = val('[name=divyRequest]');

    if (!name) { showErr($name, '수령인을 입력하세요.'); ok = false; } else { clearErr($name); }
    if (!phone) { showErr($phone, '연락처를 입력하세요.'); ok = false; } else if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)) { showErr($phone, '예) 010-1234-5678'); ok = false; } else { clearErr($phone); $phone.val(phone); }
    if (!zip) { showErr($zip, '우편번호를 선택하세요.'); ok = false; } else { clearErr($zip); }
    if (!addr) { showErr($addr, '기본 주소를 선택하세요.'); ok = false; } else { clearErr($addr); }
    if (!detail) { showErr($detail, '상세주소를 입력하세요.'); ok = false; } else { clearErr($detail); }
    if (req.length > 200) { showErr($req, '요청사항은 200자 이내'); ok = false; } else { clearErr($req); }
    if (!futureOrToday(divy)) { showErr($divy, '배송희망일은 오늘 이후'); ok = false; } else { clearErr($divy); }

    return ok;
  };

  const openPostcode = () => {
    const ensure = () => {
      new w.daum.Postcode({
        oncomplete: (data) => {
          let addr = (data.userSelectedType === 'R') ? data.roadAddress : data.jibunAddress;
          let extra = '';
          if (data.bname && /[동|로|가]$/g.test(data.bname)) extra += data.bname;
          if (data.buildingName && data.apartment === 'Y') extra += (extra ? `, ${data.buildingName}` : data.buildingName);
          if (extra) addr += ` (${extra})`;
          $('#zipcode').val(data.zonecode);
          $('#divyAddr').val(addr);
          $('#addrDetail').val('').focus();
          validate();
        }
      }).open();
    };
    if (w.daum && w.daum.Postcode) { ensure(); return; }
    $.getScript('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js', ensure);
  };

  $(() => {
    $(d).on('blur input change', 'input, textarea', () => validate());
    $(d).on('input', '[name=receiverPhone]', (e) => { $(e.currentTarget).val(normPhone($(e.currentTarget).val())); });
    $(d).on('click', '#btnAddr', () => openPostcode());

    $(d).on('click', '#btnUpdate', (e) => {
      e.preventDefault();
      if (!validate()) return;
      const $phone = $('[name=receiverPhone]');
      $phone.val($phone.val().replace(/-/g, ''));
      const f = $('form[name=purchaseForm]')[0];
      f.action = `${ctx()}/purchase/update`;
      f.method = 'post';
      f.submit();
    });

    $(d).on('click', '#btnCancel', (e) => {
      e.preventDefault();
      const no = val('[name=tranNo]');
      if (no) location.href = `${ctx()}/purchase/${encodeURIComponent(no)}`;
      else history.back();
    });
  });
})(jQuery, window, document);

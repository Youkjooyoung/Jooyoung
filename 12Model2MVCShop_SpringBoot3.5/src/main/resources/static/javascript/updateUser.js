((w, d, $) => {
  'use strict';
  if (!$) return;

  const ctx = () => $('body').data('ctx') || '';

  const $root = () => $('[data-page="user-update"]').first();
  const $form = () => $root().find('#updateUserForm');

  const ensurePostcode = () => {
    return new Promise((resolve, reject) => {
      if (w.daum && w.daum.Postcode) {
        resolve();
        return;
      }
      const s = d.createElement('script');
      s.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      s.onload = () => resolve();
      s.onerror = () => reject();
      d.head.appendChild(s);
    });
  };

  const openPostcode = async () => {
    try {
      await ensurePostcode();
      const pc = new w.daum.Postcode({
        oncomplete: (data) => {
          const zone = data.zonecode || '';
          const addr = data.address || '';
          $form().find('[name=zipCode]').val(zone);
          $form().find('[name=addr1]').val(addr);
          $form().find('[name=addr2]').focus();
        }
      });
      pc.open();
    } catch (e) {}
  };

  const buildDto = () => {
    const f = $form();
    const p1 = f.find('[name=phone1]').val() || '';
    const p2 = f.find('[name=phone2]').val() || '';
    const p3 = f.find('[name=phone3]').val() || '';
    const phone = (p1 && p2 && p3) ? `${p1}-${p2}-${p3}` : '';

    const baseAddr = (f.find('[name=addr1]').val() || '').trim();
    const detailAddr = (f.find('[name=addr2]').val() || '').trim();
    const addr = detailAddr ? `${baseAddr} ${detailAddr}`.trim() : baseAddr;

    return {
      userId: f.find('[name=userId]').val(),
      userName: f.find('[name=userName]').val(),
      addr: addr,
      email: f.find('[name=email]').val(),
      phone: phone
    };
  };

  const validate = (m) => {
    if (!m.userName) return '이름 누락';
    if (m.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$/.test(m.email)) return '이메일 형식 오류';
    if (m.phone && !/^\d{2,3}-\d{3,4}-\d{4}$/.test(m.phone)) return '전화번호 형식 오류';
    if (!m.addr) return '주소 누락';
    return '';
  };

  const goMyInfo = () => {
    const pretty = `${ctx()}/user/myInfo`;
    const partial = `${pretty}?embed=1 [data-page=user-detail]:first`;
    if (w.__layout && typeof w.__layout.loadMain === 'function') {
      w.__layout.loadMain(partial);
      if (w.history && w.history.pushState) {
        w.history.pushState({ pretty, partial }, '', pretty);
      }
    } else {
      w.location.href = pretty;
    }
  };

  const save = () => {
    const m = buildDto();
    const v = validate(m);
    if (v) {
      return;
    }
    $.ajax({
      url: `${ctx()}/user/json/updateUser`,
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(m)
    }).done(() => {
      goMyInfo();
    });
  };

  const cancel = () => {
    if (w.history && w.history.length > 1) {
      w.history.back();
      return;
    }
    goMyInfo();
  };

  $(d).on('click', '[data-page="user-update"] [data-role="addr-search"]', (e) => {
    e.preventDefault();
    openPostcode();
  });

  $(d).on('click', '[data-page="user-update"] [data-role="save"]', (e) => {
    e.preventDefault();
    save();
  });

  $(d).on('click', '[data-page="user-update"] [data-role="cancel"]', (e) => {
    e.preventDefault();
    cancel();
  });

})(window, document, window.jQuery);

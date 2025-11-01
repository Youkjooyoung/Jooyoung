(($, w, d) => {
  'use strict';
  if (!$ || !w || !d) return;

  const CTX = $('body').data('ctx') || '';

  const nvToast = (msg, type = 'info') => {
    const color =
      type === 'success'
        ? 'bg-[#03c75a] text-white'
        : type === 'error'
        ? 'bg-red-500 text-white'
        : 'bg-gray-800 text-white';

    const $toast = $('<div>')
      .addClass(
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] ' +
          'px-5 py-2 rounded-full shadow-[0_16px_40px_rgba(3,199,90,0.45)] ' +
          'text-sm font-semibold opacity-0 translate-y-2 transition-all duration-300 ' +
          color
      )
      .text(msg)
      .appendTo('body');

    setTimeout(() => {
      $toast.removeClass('opacity-0 translate-y-2').addClass('opacity-100 translate-y-0');
    }, 30);

    setTimeout(() => {
      $toast.addClass('opacity-0 translate-y-2');
      setTimeout(() => {
        $toast.remove();
      }, 300);
    }, 2000);
  };

  const $form = $('#addUserForm');
  const $btnAdd = $('#btnAddUser');
  const $btnCancel = $('#btnCancel');

  const $userId = $form.find('[name="userId"]');
  const $password = $form.find('[name="password"]');
  const $password2 = $form.find('[name="password2"]');
  const $userName = $form.find('[name="userName"]');

  const $zipcode = $form.find('[name="zipcode"]');
  const $addr = $form.find('[name="addr"]');
  const $addrDetail = $form.find('[name="addrDetail"]');

  const $phone1 = $form.find('[name="phone1"]');
  const $phone2 = $form.find('[name="phone2"]');
  const $phone3 = $form.find('[name="phone3"]');

  const $emailLocal = $form.find('[name="emailLocal"]');
  const $emailDomainSelect = $form.find('[name="emailDomainSelect"]');
  const $emailDomainCustom = $form.find('[name="emailDomainCustom"]');
  const $fullEmail = $form.find('[name="fullEmail"]');

  let debounceTimerUserId = null;
  let debounceTimerEmail = null;

  const state = {
    userIdValid: false,
    userIdDupFree: false,
    passwordValid: false,
    password2Valid: false,
    userNameValid: false,
    addrValid: false,
    phoneValid: false,
    emailValid: false,
    emailDupFree: false
  };

  const patterns = {
    userId: /^[a-zA-Z0-9]{5,10}$/,
    password: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
    email: /^[0-9a-zA-Z._%+-]+@[0-9a-zA-Z.-]+\.[A-Za-z]{2,}$/,
    phoneMid: /^\d{3,4}$/,
    phoneEnd: /^\d{4}$/
  };

  const setFeedback = (field, ok, msg) => {
    const $fb = $form.find(`[data-feedback-for="${field}"]`);
    if (!$fb.length) return;
    $fb
      .removeClass('text-red-500 text-[#03c75a]')
      .addClass(ok ? 'text-[#03c75a]' : 'text-red-500')
      .text(msg || '');
  };

  const buildEmail = () => {
    const local = $emailLocal.val().trim();
    const selDomain = $emailDomainSelect.val().trim();
    const customDomain = $emailDomainCustom.val().trim();

    let domain = selDomain || customDomain;
    if (domain.startsWith('@')) {
      domain = domain.substring(1);
    }

    if (!local || !domain) {
      $fullEmail.val('');
      return '';
    }

    const full = `${local}@${domain}`;
    $fullEmail.val(full);
    return full;
  };

  const validateUserId = () => {
    const v = $userId.val().trim();
    const formatOk = patterns.userId.test(v);
    state.userIdValid = formatOk;
    if (!formatOk) {
      state.userIdDupFree = false;
      setFeedback('userId', false, '형식오류');
      return;
    }
    if (debounceTimerUserId) clearTimeout(debounceTimerUserId);
    debounceTimerUserId = setTimeout(() => {
      $.ajax({
        url: `${CTX}/user/json/checkDuplication/${encodeURIComponent(v)}`,
        method: 'GET',
        dataType: 'json',
        success: (dup) => {
          if (dup === true) {
            state.userIdDupFree = false;
            setFeedback('userId', false, '이미 사용중');
          } else {
            state.userIdDupFree = true;
            setFeedback('userId', true, '사용 가능');
          }
          updateSubmitState();
        },
        error: () => {
          state.userIdDupFree = false;
          setFeedback('userId', false, '확인 실패');
          updateSubmitState();
        }
      });
    }, 300);
  };

  const validatePassword = () => {
    const pw = $password.val().trim();
    const ok = patterns.password.test(pw);
    state.passwordValid = ok;
    setFeedback('password', ok, ok ? '안전함' : '형식오류');
  };

  const validatePassword2 = () => {
    const pw = $password.val().trim();
    const pw2 = $password2.val().trim();
    const ok = pw && pw2 && pw === pw2;
    state.password2Valid = ok;
    setFeedback('password2', ok, ok ? '일치' : '불일치');
  };

  const validateUserName = () => {
    const v = $userName.val().trim();
    const ok = v.length > 0;
    state.userNameValid = ok;
    setFeedback('userName', ok, ok ? '' : '이름 입력');
  };

  const validateAddr = () => {
    const zip = $zipcode.val().trim();
    const a1 = $addr.val().trim();
    const a2 = $addrDetail.val().trim();
    const ok = zip && a1 && a2;
    state.addrValid = ok;
    setFeedback('addrAll', ok, ok ? '' : '주소 미완료');
  };

  const validatePhone = () => {
    const mid = $phone2.val().trim();
    const end = $phone3.val().trim();
    const ok = patterns.phoneMid.test(mid) && patterns.phoneEnd.test(end);
    state.phoneValid = ok;
    setFeedback('phone', ok, ok ? '' : '번호 확인');
  };

  const validateEmail = () => {
    const full = buildEmail();
    const formatOk = patterns.email.test(full);
    state.emailValid = formatOk;
    if (!formatOk) {
      state.emailDupFree = false;
      setFeedback('email', false, '형식오류');
      updateSubmitState();
      return;
    }

    if (debounceTimerEmail) clearTimeout(debounceTimerEmail);
    debounceTimerEmail = setTimeout(() => {
      $.ajax({
        url: `${CTX}/user/json/existsEmail`,
        method: 'GET',
        data: { email: full },
        dataType: 'json',
        success: (res) => {
          const exists = res && res.exists === true;
          if (exists) {
            state.emailDupFree = false;
            setFeedback('email', false, '이미 사용중');
          } else {
            state.emailDupFree = true;
            setFeedback('email', true, '사용 가능');
          }
          updateSubmitState();
        },
        error: () => {
          state.emailDupFree = false;
          setFeedback('email', false, '확인 실패');
          updateSubmitState();
        }
      });
    }, 300);
  };

  const updateSubmitState = () => {
    const allOk =
      state.userIdValid &&
      state.userIdDupFree &&
      state.passwordValid &&
      state.password2Valid &&
      state.userNameValid &&
      state.addrValid &&
      state.phoneValid &&
      state.emailValid &&
      state.emailDupFree;

    if (allOk) {
      $btnAdd.prop('disabled', false);
    } else {
      $btnAdd.prop('disabled', true);
    }
  };

  const openPostcode = () => {
    new w.daum.Postcode({
      oncomplete: (data) => {
        const zone = data.zonecode || '';
        const address = data.address || '';
        $zipcode.val(zone);
        $addr.val(address);
        $addrDetail.focus();
        validateAddr();
        updateSubmitState();
      }
    }).open();
  };

  const collectDataForSubmit = () => {
    const userId = $userId.val().trim();
    const password = $password.val().trim();
    const userName = $userName.val().trim();
    const zipcode = $zipcode.val().trim();
    const baseAddr = $addr.val().trim();
    const detailAddr = $addrDetail.val().trim();
    const phone = `${$phone1.val()}-${$phone2.val().trim()}-${$phone3.val().trim()}`;
    const email = $fullEmail.val().trim();

    return {
      userId,
      password,
      userName,
      addr: `${zipcode} ${baseAddr} ${detailAddr}`.trim(),
      phone,
      email
    };
  };

  const submitSignup = () => {
    if ($btnAdd.prop('disabled')) return;

    const payload = collectDataForSubmit();

    if (!state.password2Valid) {
      nvToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    $.ajax({
      url: `${CTX}/user/json/addUser`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: (res) => {
        if (res === true || (res && res.success === true)) {
          nvToast('회원가입 완료!', 'success');
          setTimeout(() => {
            w.location.href = `${CTX}/user/loginView.jsp`;
          }, 1200);
        } else {
          nvToast('회원가입 중 오류가 발생했습니다.', 'error');
        }
      },
      error: () => {
        nvToast('서버 통신 오류입니다.', 'error');
      }
    });
  };

  const wireEvents = () => {
    $userId.on('input blur', () => { validateUserId(); updateSubmitState(); });

    $password.on('input blur', () => { validatePassword(); validatePassword2(); updateSubmitState(); });
    $password2.on('input blur', () => { validatePassword2(); updateSubmitState(); });

    $userName.on('input blur', () => { validateUserName(); updateSubmitState(); });

    $zipcode.on('input', () => { validateAddr(); updateSubmitState(); });
    $addr.on('input', () => { validateAddr(); updateSubmitState(); });
    $addrDetail.on('input blur', () => { validateAddr(); updateSubmitState(); });

    $phone1.on('change', () => { validatePhone(); updateSubmitState(); });
    $phone2.on('input blur', () => { validatePhone(); updateSubmitState(); });
    $phone3.on('input blur', () => { validatePhone(); updateSubmitState(); });

    $emailLocal.on('input blur', () => { validateEmail(); });
    $emailDomainSelect.on('change', () => {
      if ($emailDomainSelect.val()) {
        $emailDomainCustom.val('');
      }
      validateEmail();
    });
    $emailDomainCustom.on('input blur', () => {
      if ($emailDomainCustom.val().trim().length > 0) {
        $emailDomainSelect.val('');
      }
      validateEmail();
    });

    $form.find('[data-role="addr-search"]').on('click', (e) => {
      e.preventDefault();
      openPostcode();
    });

    $btnAdd.on('click', (e) => {
      e.preventDefault();
      submitSignup();
    });

    $btnCancel.on('click', (e) => {
      e.preventDefault();
      nvToast('회원가입이 취소되었습니다.', 'info');
      setTimeout(() => {
        w.location.href = `${CTX}/user/loginView.jsp`;
      }, 800);
    });
  };

  const init = () => {
    wireEvents();
  };

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(jQuery, window, document);

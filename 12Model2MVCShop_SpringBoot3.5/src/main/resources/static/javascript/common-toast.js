// /javascript/common-toast.js
(($, w, d) => {
  'use strict';
  if (!$) return;

  /**
   * ✅ 네이버 스타일 Toast 공통 함수
   * @param {string} msg - 표시할 메시지
   * @param {object|string} opt - 옵션 또는 타입
   *   opt.type: success | error | info
   *   opt.stay: 표시 유지시간(ms)
   *   opt.onClose: 닫힐 때 콜백
   */
  w.nvToast = (msg, opt = {}) => {
    const type = typeof opt === 'object' ? (opt.type || 'info') : opt;
    const stay = typeof opt === 'object' ? (opt.stay || 1500) : 1500;
    const onClose = typeof opt === 'object' ? opt.onClose : null;

    // ✅ 1) 스코프 대상 (로그인 카드)
    let $card = $('.auth-card');
    if (!$card.length) $card = $(d).find('.auth-card');
    const scoped = $card.length > 0;

    // ✅ 2) 호스트 생성
	let $host = $('#nvToastHost');

	// 혹시 중복 생성되었으면 하나만 남기기
	if ($host.length > 1) {
	  $host.slice(1).remove();
	  $host = $('#nvToastHost').first();
	}
	if (!$host.length) {
	  $host = $('<div id="nvToastHost" aria-live="polite"/>');
	}

	// ✅ 인라인 스타일 완전 리셋(예전에 fixed로 만든 흔적 제거)
	$host.removeAttr('style').css({ left: '', right: '', bottom: '', transform: '' });

	if (scoped) {
	  if ($card.css('position') === 'static') $card.css('position', 'relative');
	  $host.addClass('scoped').appendTo($card);
	} else {
	  $host.removeClass('scoped').appendTo('body');
	}

    // ✅ 3) 토스트 요소 생성
    const color = { success: '#03c75a', error: '#f44336', info: '#333' }[type] || '#333';
    const $toast = $('<div/>', {
      class: `nv-toast nv-toast--${type}`,
      text: msg
    }).css({
      background: color,
      color: '#fff',
      fontWeight: 700,
      borderRadius: '999px',
      padding: '12px 26px',
      textAlign: 'center',
      boxShadow: '0 6px 20px rgba(0,0,0,.16)',
      opacity: 0,
      transform: 'translateY(10px)',
      transition: 'opacity .25s ease, transform .25s ease',
      whiteSpace: 'nowrap',
      pointerEvents: 'auto',
      minWidth: '200px'
    });

    // ✅ 4) 표시 애니메이션
    $host.append($toast);
    requestAnimationFrame(() => {
      $toast.css({ opacity: 1, transform: 'translateY(0)' });
    });

    // ✅ 5) 자동 닫힘
    setTimeout(() => {
      $toast.css({ opacity: 0, transform: 'translateY(10px)' });
      setTimeout(() => {
        $toast.remove();
        if (typeof onClose === 'function') onClose();
      }, 200);
    }, stay);
  };

  // ✅ 로그인 성공 시 자동 토스트 표시 (DOM 준비 이후)
  $(d).ready(() => {
    const page = $('body').hasClass('auth-page');
    const successMsg = w.sessionStorage.getItem('loginSuccessMsg');
    if (page && successMsg) {
      setTimeout(() => nvToast(successMsg, { type: 'success' }), 100);
      w.sessionStorage.removeItem('loginSuccessMsg');
    }
  });

})(jQuery, window, document);

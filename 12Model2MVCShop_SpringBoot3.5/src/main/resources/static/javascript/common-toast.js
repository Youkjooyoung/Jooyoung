// /javascript/common-toast.js
(($, w, d) => {
  'use strict';
  if (!$) return;

  /**
   * ✅ 네이버 스타일 Toast 전역 함수
   * @param {string} msg - 표시할 메시지
   * @param {object|string} opt - 옵션 또는 타입
   *   opt.type: success | error | info
   *   opt.stay: 표시 유지시간(ms)
   *   opt.onClose: 닫힐 때 콜백
   */
  w.nvToast = (msg, opt = {}) => {
    const type = typeof opt === 'object' ? (opt.type || 'info') : opt;
    const stay = typeof opt === 'object' ? (opt.stay || 1200) : 1200;
    const onClose = typeof opt === 'object' ? opt.onClose : null;

    // 호스트 영역 생성
    let $host = $('#nvToastHost');
    if (!$host.length) {
      $host = $('<div id="nvToastHost" aria-live="polite"/>').css({
        position: 'fixed',
        left: '50%',
        bottom: '24px',
        transform: 'translateX(-50%)',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none'
      }).appendTo('body');
    }

    // 토스트 요소
    const bg = {
      success: '#03c75a',
      error: '#f44336',
      info: '#333'
    }[type] || '#333';

    const $item = $('<div/>', {
      class: `nv-toast nv-toast--${type}`,
      text: msg
    }).css({
      background: bg,
      color: '#fff',
      fontWeight: 700,
      borderRadius: '12px',
      padding: '10px 18px',
      minWidth: '220px',
      textAlign: 'center',
      boxShadow: '0 6px 20px rgba(0,0,0,.16)',
      opacity: 0,
      transform: 'translateY(8px)',
      transition: 'opacity .25s ease, transform .25s ease',
      pointerEvents: 'auto'
    });

    // 추가 후 애니메이션
    $host.append($item);
    requestAnimationFrame(() => {
      $item.css({ opacity: 1, transform: 'translateY(0)' });
    });

    // 자동 닫힘
    setTimeout(() => {
      $item.css({ opacity: 0, transform: 'translateY(8px)' });
      setTimeout(() => {
        $item.remove();
        if (typeof onClose === 'function') onClose();
      }, 200);
    }, stay);
  };

})(jQuery, window, document);

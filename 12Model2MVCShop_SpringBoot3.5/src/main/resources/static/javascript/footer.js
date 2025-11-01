(function(w, d, $) {
  'use strict';
  if (!$) return;

  const ctx = () => $('body').data('ctx') || '';

  $(d).on('click', '[data-footer-nav]', function(e) {
    e.preventDefault();
    const code = this.getAttribute('data-footer-nav');
    if (!code) return;
    if (w.__layout && typeof w.__layout.navigate === 'function') {
      w.__layout.navigate(code);
    } else {
      const fallback = {
        faq: ctx() + '/support/faq.jsp',
        notice: ctx() + '/support/notice.jsp',
        policy: ctx() + '/support/policy.jsp',
        privacy: ctx() + '/support/privacy.jsp'
      }[code];
      if (fallback) w.location.href = fallback;
    }
  });

  $(d).on('keydown', '[data-footer-nav]', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) $(this).trigger('click');
  });

  $(() => { $('.js-year').text(new Date().getFullYear()); });
})(window, document, window.jQuery);

(($, w, d) => {
  'use strict';
  if (!$) return;

  const ctx = () => $('body').data('ctx') || '';

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

  const fillUserInfo = (user) => {
    const $wrap = $('[data-page="user-detail"]');
    if (!$wrap.length) return;

    Object.keys(user).forEach((key) => {
      const $target = $wrap.find(`[data-field="${key}"]`);
      if ($target.length) {
        let val = user[key] || '';
        if (key === 'regDate' && val) {
          try {
            val = new Date(val).toLocaleDateString('ko-KR');
          } catch (e) {}
        }
        $target.text(val);
      }
    });

    const greetName = user.userName || user.userId || '';
    $('[data-header-greeting]').text(greetName ? `${greetName}님 환영합니다` : '');
  };

  const loadUser = () => {
    $.ajax({
      url: `${ctx()}/user/json/getUser`,
      method: 'GET',
      dataType: 'json',
      success: (user) => {
        if (!user) {
          nvToast('로그인이 필요합니다.', 'error');
          setTimeout(() => {
            w.location.href = `${ctx()}/user/loginView.jsp`;
          }, 1000);
          return;
        }
        fillUserInfo(user);
      },
      error: () => {
        nvToast('회원정보를 불러오지 못했습니다.', 'error');
      }
    });
  };

  const wireButtons = () => {
    const $editBtn = $('[data-role="edit"]');
    const $backBtn = $('[data-role="back"]');
    const $logoutBtn = $('[data-role="logout"]');

    if ($editBtn.length) {
      $editBtn.on('click', () => {
        const userId = $('[data-field="userId"]').text().trim();
        if (!userId) return;
        const target = `${ctx()}/user/updateUser?userId=${encodeURIComponent(userId)}`;
        w.location.href = target;
      });
    }

    if ($backBtn.length) {
      $backBtn.on('click', () => {
        const ref = d.referrer;
        const mainPage = `${ctx()}/index.jsp`;
        const loginPage = `${ctx()}/user/loginView.jsp`;

        if (ref && ref.includes(w.location.origin)) {
          w.location.href = ref;
        } else {
          $.ajax({
            url: `${ctx()}/user/json/getUser`,
            method: 'GET',
            dataType: 'json',
            success: (user) => {
              if (user) {
                w.location.href = mainPage;
              } else {
                w.location.href = loginPage;
              }
            },
            error: () => {
              w.location.href = loginPage;
            }
          });
        }
      });
    }

    if ($logoutBtn.length) {
      $logoutBtn.on('click', () => {
        $.ajax({
          url: `${ctx()}/user/json/logout`,
          type: 'POST',
          contentType: 'application/json',
          success: () => {
            nvToast('로그아웃 되었습니다.', 'info');
            setTimeout(() => {
              w.location.href = `${ctx()}/user/loginView.jsp`;
            }, 800);
          },
          error: () => {
            w.location.href = `${ctx()}/user/loginView.jsp`;
          }
        });
      });
    }
  };

  const init = () => {
    loadUser();
    wireButtons();
  };

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window.jQuery, window, document);

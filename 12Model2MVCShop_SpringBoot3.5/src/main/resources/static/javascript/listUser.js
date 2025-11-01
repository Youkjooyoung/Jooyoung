(($, w, d) => {
  'use strict';
  if (!$) return;

  const ctx = () => $('body').data('ctx') || '';

  const $list = $('#userList');
  const $pagination = $('#pagination');

  const nvToast = (msg, type = 'info') => {
    const color =
      type === 'success' ? 'bg-[#03c75a] text-white'
      : type === 'error' ? 'bg-red-500 text-white'
      : 'bg-gray-800 text-white';

    const $toast = $('<div>')
      .addClass(
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] ' +
        'px-4 py-2 rounded-full shadow-[0_16px_40px_rgba(3,199,90,0.45)] ' +
        'text-[0.8rem] font-semibold opacity-0 translate-y-2 transition-all duration-300 ' +
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

  const loadUsers = (page = 1) => {
    const condition = $('#searchCondition').val();
    const keyword = $('#searchKeyword').val().trim();

    $.ajax({
      url: `${ctx()}/user/json/listUser`,
      type: 'GET',
      data: {
        currentPage: page,
        searchCondition: condition,
        searchKeyword: keyword
      },
      dataType: 'json',
      success: (data) => {
        renderTable(data.list);
        renderPagination(data.page);
      },
      error: () => {
        $list.html(
          '<tr><td colspan="4" class="text-center py-6 text-red-500 font-semibold">회원 목록을 불러오지 못했습니다.</td></tr>'
        );
        nvToast('목록 조회 실패', 'error');
      }
    });
  };

  const renderTable = (users) => {
    if (!users || !users.length) {
      $list.html(
        '<tr><td colspan="4" class="text-center py-6 text-gray-400 text-[0.9rem]">조회된 회원이 없습니다.</td></tr>'
      );
      return;
    }

    $list.empty();

    users.forEach((user, idx) => {
      const safeId = user.userId || '';
      const safeName = user.userName || '';
      const safeEmail = user.email || '';

      const $row = $(`
        <tr class="cursor-pointer hover:bg-naver-gray-50 transition"
            data-id="${safeId}">
          <td class="py-3 px-4 text-center text-gray-500">${idx + 1}</td>
          <td class="py-3 px-4 font-extrabold text-[#03c75a]">${safeId}</td>
          <td class="py-3 px-4 text-gray-900">${safeName}</td>
          <td class="py-3 px-4 text-gray-700 break-all">${safeEmail}</td>
        </tr>
      `);

      $row.on('click', () => {
        // 여기서 상세조회 뷰 URL로 이동시킨다 (a 태그 사용 금지)
        // 네 프로젝트 컨벤션에 맞게 수정 가능:
        w.location.href = `${ctx()}/user/getUser?userId=${encodeURIComponent(safeId)}`;
      });

      $list.append($row);
    });
  };

  const renderPagination = (page) => {
    if (!page) return;

    const currentPage = page.currentPage || 1;
    const maxPage = page.maxPage || 1;

    $pagination.empty();

    const makeBtn = (label, p, disabled, highlight) => {
      const baseClass =
        'min-w-[2.2rem] h-9 px-3 rounded-[8px] border text-[0.8rem] font-semibold transition ' +
        (highlight
          ? 'bg-[#03c75a] border-[#03c75a] text-white shadow-[0_16px_40px_rgba(3,199,90,0.45)]'
          : disabled
          ? 'text-gray-300 border-naver-gray-200 bg-white'
          : 'text-[#03c75a] border-[#03c75a] bg-white hover:bg-[#03c75a] hover:text-white');

      const $b = $(`<button class="${baseClass}">${label}</button>`);
      if (!disabled) {
        $b.on('click', () => loadUsers(p));
      } else {
        $b.prop('disabled', true);
      }
      return $b;
    };

    // 맨앞 / 이전
    $pagination.append(makeBtn('<<', 1, currentPage === 1, false));
    $pagination.append(makeBtn('<', currentPage - 1, currentPage === 1, false));

    // 현재 주변 페이지
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(maxPage, currentPage + 2); i++) {
      const highlight = i === currentPage;
      $pagination.append(makeBtn(String(i), i, false, highlight));
    }

    // 다음 / 맨끝
    $pagination.append(makeBtn('>', currentPage + 1, currentPage === maxPage, false));
    $pagination.append(makeBtn('>>', maxPage, currentPage === maxPage, false));
  };

  $(() => {
    $('#btnSearch').on('click', () => loadUsers(1));
    $('#searchKeyword').on('keypress', (e) => {
      if (e.key === 'Enter') {
        loadUsers(1);
      }
    });

    loadUsers(1);
  });
})(jQuery, window, document);

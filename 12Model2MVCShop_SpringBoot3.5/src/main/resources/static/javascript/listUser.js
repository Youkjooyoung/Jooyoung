// /javascript/listUser.js
(($, w, d) => {
	'use strict';
	if (!$) return;

	const ctx = () => $('body').data('ctx') || '';
	const $list = $('#userList');
	const $pagination = $('#pagination');

	const loadUsers = (page = 1) => {
		const condition = $('#searchCondition').val();
		const keyword = $('#searchKeyword').val().trim();

		$.ajax({
			url: `${ctx()}/user/json/listUser`,
			type: 'GET',
			data: { currentPage: page, searchCondition: condition, searchKeyword: keyword },
			dataType: 'json',
			success: (data) => {
				renderTable(data.list);
				renderPagination(data.page);
			},
			error: () => {
				$list.html('<tr><td colspan="4" class="text-center p-4 text-red-500">회원 목록을 불러오지 못했습니다.</td></tr>');
			}
		});
	};

	const renderTable = (users) => {
		if (!users || !users.length) {
			$list.html('<tr><td colspan="4" class="text-center p-4 text-gray-400">조회된 회원이 없습니다.</td></tr>');
			return;
		}

		$list.empty();
		users.forEach((user, idx) => {
			const row = $(`
        <tr class="hover:bg-gray-50 transition cursor-pointer" data-id="${user.userId}">
          <td class="p-3 text-center">${idx + 1}</td>
          <td class="p-3 font-bold text-naver">${user.userId}</td>
          <td class="p-3">${user.userName || ''}</td>
          <td class="p-3">${user.email || ''}</td>
        </tr>
      `);
			row.on('click', () => location.href = `${ctx()}/user/getUserView.jsp?userId=${user.userId}`);
			$list.append(row);
		});
	};

	const renderPagination = (page) => {
		if (!page) return;
		const { currentPage, maxPage } = page;
		$pagination.empty();

		const makeBtn = (label, p, disabled) => {
			return $(`<button class="px-3 py-1 border rounded ${disabled ? 'text-gray-300 border-gray-200' : 'text-naver border-naver hover:bg-naver hover:text-white'}">${label}</button>`)
				.prop('disabled', disabled)
				.on('click', () => !disabled && loadUsers(p));
		};

		$pagination.append(makeBtn('<<', 1, currentPage === 1));
		$pagination.append(makeBtn('<', currentPage - 1, currentPage === 1));

		for (let i = Math.max(1, currentPage - 2); i <= Math.min(maxPage, currentPage + 2); i++) {
			const btn = makeBtn(i, i, false);
			if (i === currentPage) btn.addClass('bg-naver text-white');
			$pagination.append(btn);
		}

		$pagination.append(makeBtn('>', currentPage + 1, currentPage === maxPage));
		$pagination.append(makeBtn('>>', maxPage, currentPage === maxPage));
	};

	$(() => {
		$('#btnSearch').on('click', () => loadUsers(1));
		$('#searchKeyword').on('keypress', (e) => {
			if (e.key === 'Enter') loadUsers(1);
		});
		loadUsers(1);
	});
})(jQuery, window, document);

(($, w, d) => {
	'use strict';
	if (!w || !d || !w.jQuery) return;

	const CTX = d.body?.dataset?.ctx || '';

	const renderAuth = () => {
		$.ajax({ url: `${CTX}/user/json/me?_=${Date.now()}`, method: 'GET', dataType: 'json' })
			.done((user) => {
				const $auth = $('.nv-auth'); $auth.empty();
				if (user?.userId) {
					const name = user.userName || user.userId;
					$auth.html(`<span class="welcome-text" style="color:#03c75a;font-weight:bold;margin-right:10px;">${name}</span><button id="btnLogout" type="button" class="btn-gray btn-sm">로그아웃</button>`);
				} else {
					$auth.html(`<button id="btnLogin" type="button" class="px-4 py-2 text-white bg-naver-green hover:bg-naver-dark rounded-lg font-bold transition">로그인</button><button id="btnJoin" type="button" class="px-4 py-2 text-gray-700 bg-naver-gray-100 hover:bg-naver-gray-200 rounded-lg font-bold transition">회원가입</button>`);
				}
			})
			.fail(() => {
				$('.nv-auth').html(`<button id="btnLogin" type="button" class="px-4 py-2 text-white bg-naver-green hover:bg-naver-dark rounded-lg font-bold transition">로그인</button><button id="btnJoin" type="button" class="px-4 py-2 text-gray-700 bg-naver-gray-100 hover:bg-naver-gray-200 rounded-lg font-bold transition">회원가입</button>`);
			});
	};

	const doLogout = () => {
		$.ajax({ url: `${CTX}/user/json/logout`, method: 'POST', dataType: 'json' })
			.done((res) => {
				if (res?.success) { w.top.location.href = `${CTX}/index.jsp`; }
			});
	};

	$(() => {
		renderAuth();
		$(d).on('click', '#btnHome', () => {
			if (w.__layout?.go) { w.__layout.go('home'); return; }
			location.href = `${CTX}/`;
		});
		$(d).on('click', '#btnLogin', () => { location.href = `${CTX}/user/loginView.jsp`; });
		$(d).on('click', '#btnJoin', () => { location.href = `${CTX}/user/addUserView.jsp`; });
		$(d).on('click', '#btnLogout', () => doLogout());
	});
})(jQuery, window, document);

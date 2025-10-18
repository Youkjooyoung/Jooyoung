// /javascript/top.js
(($, w, d) => {
	'use strict';
	if (!w || !d || !w.jQuery) return;

	const CTX = d.body?.dataset?.ctx || '';

	// ===== Ajax 로드 (우측 영역 or fallback 전체 이동) =====
	const loadMain = (url) => {
		if (w.__layout?.loadMain) {
			w.__layout.loadMain(url);
			return true;
		}
		w.location.href = url;
		return false;
	};

	// ===== 로그인 상태 렌더링 =====
	const renderAuth = () => {
		$.ajax({
			url: `${CTX}/user/json/me?_=${Date.now()}`,
			method: 'GET',
			dataType: 'json'
		})
			.done((user) => {
				const $auth = $('.nv-auth');
				$auth.empty();

				if (user?.userId) {
					const name = user.userName || user.userId;
					const html = `
            <span class="welcome-text" style="color:#03c75a;font-weight:bold;margin-right:10px;">
              ${name}님 환영합니다
            </span>
            <button id="btnLogout" type="button" class="btn-gray btn-sm">로그아웃</button>
          `;
					$auth.html(html);
				} else {
					$auth.html(`
            <button id="btnLogin" type="button" class="btn-green btn-sm">로그인</button>
            <button id="btnJoin" type="button" class="btn-gray btn-sm">회원가입</button>
          `);
				}
			})
			.fail(() => {
				$('.nv-auth').html('<span class="btn-gray btn-sm">오류</span>');
			});
	};

	// ===== 로그아웃 =====
	const doLogout = () => {
		nvToast('로그아웃 중...', 'info', 800);

		$.ajax({
			url: `${CTX}/user/json/logout`,
			method: 'POST',
			dataType: 'json'
		})
			.done((res) => {
				if (res?.success) {
					const type = res.loginType || '';
					const KID = $('body').data('kakao-client');
					const RLOGOUT = $('body').data('kakao-logout') || `${CTX}/index.jsp`;

					if (type === 'kakao' && KID && RLOGOUT) {
						const url = `https://kauth.kakao.com/oauth/logout?client_id=${encodeURIComponent(
							KID
						)}&logout_redirect_uri=${encodeURIComponent(RLOGOUT)}`;
						w.top.location.href = url;
						return;
					}

					if (type === 'google') {
						w.top.location.href = 'https://accounts.google.com/Logout';
						setTimeout(() => (w.top.location.href = `${CTX}/index.jsp`), 800);
						return;
					}

					nvToast('로그아웃 되었습니다.', 'success', 900);
					setTimeout(() => (w.top.location.href = `${CTX}/index.jsp`), 700);
				} else {
					nvToast('로그아웃 실패', 'error');
				}
			})
			.fail(() => {
				nvToast('로그아웃 요청 중 오류 발생', 'error');
			});
	};

	// ===== 초기화 =====
	$(() => {
		renderAuth();

		// 홈 버튼
		$(d).on('click', '#btnHome', () => {
			loadMain(`${CTX}/layout/home.fragment.jsp`);
		});

		// 로그인 / 회원가입
		$(d).on('click', '#btnLogin', () => {
			w.App?.go ? w.App.go('/user/loginView.jsp') : (location.href = `${CTX}/user/loginView.jsp`);
		});
		$(d).on('click', '#btnJoin', () => {
			w.App?.go ? w.App.go('/user/addUserView.jsp') : (location.href = `${CTX}/user/addUserView.jsp`);
		});

		// 로그아웃
		$(d).on('click', '#btnLogout', () => doLogout());
	});
})(jQuery, window, document);

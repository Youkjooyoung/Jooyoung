// /javascript/login.js
(($, w, d) => {
	'use strict';
	if (!w || !d || !$) return;

	// ====== 1. nvToast (Tailwind 스타일) ======
	if (typeof nvToast !== 'function') {
		window.nvToast = (msg, opt = {}) => {
			const type = opt.type || 'info';
			const stay = opt.stay || 1500;
			const onClose = opt.onClose || (() => { });
			const bgMap = {
				success: 'bg-naver text-white',
				error: 'bg-red-500 text-white',
				info: 'bg-gray-800 text-white',
			};

			// 호스트 없으면 새로 만들기
			let host = d.querySelector('#nvToastHost');
			if (!host) {
				host = d.createElement('div');
				host.id = 'nvToastHost';
				host.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2';
				d.body.appendChild(host);
			}

			// 토스트 생성
			const toast = d.createElement('div');
			toast.className = `px-5 py-2 rounded-full shadow-md font-semibold text-sm opacity-0 translate-y-2 transition-all duration-300 ${bgMap[type] || bgMap.info}`;
			toast.textContent = msg;

			host.appendChild(toast);
			setTimeout(() => {
				toast.classList.remove('opacity-0', 'translate-y-2');
				toast.classList.add('opacity-100', 'translate-y-0');
			}, 30);

			// 일정 시간 후 제거
			setTimeout(() => {
				toast.classList.add('opacity-0', 'translate-y-2');
				setTimeout(() => {
					toast.remove();
					onClose();
				}, 300);
			}, stay);
		};
	}

	// ====== 2. 공통 유틸 ======
	const meta = (name) => {
		const m = d.querySelector(`meta[name="${name}"]`);
		return m ? (m.content || '') : '';
	};
	const _ = (sel, root = d) => root.querySelector(sel);
	const BODY = d.body;
	const CTX = BODY?.getAttribute('data-ctx') || '';

	// ====== 3. 공용 redirect URL builder ======
	const buildRedirect = (provider) => `http://localhost:8080${CTX}/user/${provider}/callback`;

	// ====== 4. 기본 로그인 ======
	const wireBasicLogin = () => {
		const btnLogin = _('#btnLoginSubmit');
		const btnJoin = _('#btnGoJoin');
		const $id = _('[name="userId"]');
		const $pw = _('[name="password"]');

		if (!btnLogin) return;

		btnLogin.addEventListener('click', () => {
			const userId = $id.value.trim();
			const password = $pw.value.trim();

			if (!userId || !password) {
				nvToast('아이디와 비밀번호를 입력해주세요.', { type: 'error' });
				return;
			}

			$.ajax({
				url: `${CTX}/user/json/login`,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({ userId, password }),
				success: (res) => {
					if (res.success) {
						nvToast('로그인 성공!', {
							type: 'success',
							stay: 1000,
							onClose: () => {
								w.location.href = `${CTX}/index.jsp`;
							},
						});
					} else {
						nvToast(res.message || '아이디 또는 비밀번호가 올바르지 않습니다.', { type: 'error' });
					}
				},
				error: (xhr, _status, err) => {
					console.error('[login error]', err);
					nvToast('로그인 요청 중 오류가 발생했습니다.', { type: 'error' });
				},
			});
		});

		if (btnJoin) {
			btnJoin.addEventListener('click', () => {
				location.href = `${CTX}/user/addUserView.jsp`;
			});
		}

		$pw.addEventListener('keyup', (e) => {
			if (e.key === 'Enter') btnLogin.click();
		});
	};

	// ====== 5. Kakao 로그인 ======
	const wireKakaoLogin = () => {
		const btn = _('#btnKakao');
		if (!btn) return;

		const clientId =
			meta('kakao-client-id') || BODY?.getAttribute('data-kakao-client') || '';
		if (!clientId) {
			console.warn('[Kakao] clientId 미설정');
			return;
		}

		btn.addEventListener('click', () => {
			const redirect = buildRedirect('kakao');
			const url =
				`https://kauth.kakao.com/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
				`&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&prompt=login`;
			w.location.href = url;
		});
	};

	// ====== 6. Google 로그인 ======
	const wireGoogleLogin = () => {
		const btn = _('#btnGoogle');
		if (!btn) return;

		const cid =
			meta('google-client-id') || BODY?.getAttribute('data-google-client') || '';
		if (!cid) {
			console.warn('[Google] clientId 미설정');
			return;
		}

		btn.addEventListener('click', (e) => {
			e.preventDefault();
			const redirect = buildRedirect('google');
			const scopes = 'openid email profile';
			const authUrl =
				`https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(cid)}` +
				`&redirect_uri=${encodeURIComponent(redirect)}&response_type=code` +
				`&scope=${encodeURIComponent(scopes)}&include_granted_scopes=true&prompt=select_account`;
			w.location.href = authUrl;
		});
	};

	// ====== 7. 초기화 ======
	const init = () => {
		wireBasicLogin();
		wireKakaoLogin();
		wireGoogleLogin();
	};

	d.readyState === 'loading'
		? d.addEventListener('DOMContentLoaded', init)
		: init();
})(jQuery, window, document);

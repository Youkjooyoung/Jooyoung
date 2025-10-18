// /javascript/login.js
(($, w, d) => {
	'use strict';
	if (!w || !d || !$) return;
	if (typeof nvToast !== 'function') {
	  window.nvToast = (msg, opt = {}) => {
	    const type = typeof opt === 'object' ? (opt.type || 'info') : opt;
	    alert(`[${type.toUpperCase()}] ${msg}`);
	  };
	}

	// ====== 공통 유틸 ======
	const meta = (name) => {
		const m = d.querySelector(`meta[name="${name}"]`);
		return m ? (m.content || '') : '';
	};
	const _ = (sel, root = d) => root.querySelector(sel); // jQuery 충돌 방지
	const BODY = d.body;
	const CTX = BODY?.getAttribute('data-ctx') || '';

	// ====== 공용 redirect URL builder ======
	const buildRedirect = (provider) =>
		`http://localhost:8080${CTX}/user/${provider}/callback`;

	// ====== Kakao ======
	const wireKakaoLogin = () => {
		const btn = _('#btnKakaoLogin');
		if (!btn) return;

		const jsKey =
			meta('kakao-js-key') || BODY?.getAttribute('data-kakao-jskey') || '';
		const clientId =
			meta('kakao-client-id') || BODY?.getAttribute('data-kakao-client') || '';

		if (w.Kakao) {
			try {
				if (!Kakao.isInitialized() && jsKey) Kakao.init(jsKey);
				console.log('[Kakao] Initialized:', Kakao.isInitialized());
			} catch (e) {
				console.error('[Kakao] init failed:', e);
			}
		} else {
			console.warn('[Kakao] SDK not loaded');
		}

		btn.addEventListener('click', () => {
			if (!clientId) {
				nvToast('카카오 설정 오류: clientId가 없습니다.', { type: 'error' });
				return;
			}
			const redirect = buildRedirect('kakao');
			const url =
				`https://kauth.kakao.com/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
				`&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&prompt=login`;
			w.top.location.href = url;
		});
	};

	// ====== Google ======
	const wireGoogleLogin = () => {
		const btn = _('#btnGoogleLogin');
		if (!btn) return;

		const cid = meta('google-client-id') || BODY?.getAttribute('data-google-client') || '';
		if (!cid) return;

		btn.addEventListener('click', (e) => {
			e.preventDefault();
			const redirect = buildRedirect('google');
			const scopes = 'openid email profile';
			const authUrl =
				`https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(cid)}` +
				`&redirect_uri=${encodeURIComponent(redirect)}&response_type=code` +
				`&scope=${encodeURIComponent(scopes)}&include_granted_scopes=true&prompt=select_account`;
			(w.top !== w.self ? w.top : w).location.href = authUrl;
		});
	};

	// ====== 기본 로그인 ======
	const wireBasicLogin = () => {
		const btnLogin = _('#btnLoginSubmit');
		const btnJoin = _('#btnGoJoin');
		const $id = _('#userId');
		const $pw = _('#password');

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
							stay: 900,
							onClose: () => {
								w.App?.go
									? w.App.go('/index.jsp')
									: (location.href = `${CTX}/index.jsp`);
							},
						});
					} else {
						nvToast(res.message || '아이디 또는 비밀번호가 올바르지 않습니다.', {
							type: 'error',
						});
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
				w.App?.go
					? w.App.go('/user/addUserView.jsp')
					: (location.href = `${CTX}/user/addUserView.jsp`);
			});
		}

		$pw.addEventListener('keyup', (e) => {
			if (e.key === 'Enter') btnLogin.click();
		});
	};

	// ====== 초기화 ======
	const init = () => {
		wireBasicLogin();
		wireKakaoLogin();
		wireGoogleLogin();
	};

	d.readyState === 'loading'
		? d.addEventListener('DOMContentLoaded', init)
		: init();
})(jQuery, window, document);

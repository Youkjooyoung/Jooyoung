(($, w, d) => {
	'use strict';
	if (!w || !d || !$) return;

	if (typeof nvToast !== 'function') {
		w.nvToast = (msg, opt = {}) => {
			const type = opt.type || 'info';
			const stay = opt.stay || 1500;
			const onClose = opt.onClose || (() => {});
			const bgMap = {
				success: 'bg-[#03c75a] text-white',
				error: 'bg-red-500 text-white',
				info: 'bg-gray-900 text-white'
			};
			let host = d.querySelector('#nvToastHost');
			if (!host) {
				host = d.createElement('div');
				host.id = 'nvToastHost';
				host.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2';
				d.body.appendChild(host);
			}
			const toast = d.createElement('div');
			toast.className = [
				'px-5 py-2 rounded-full shadow-[0_16px_40px_rgba(3,199,90,0.45)] font-semibold text-sm',
				'opacity-0 translate-y-2 transition-all duration-300',
				bgMap[type] || bgMap.info
			].join(' ');
			toast.textContent = msg;
			host.appendChild(toast);
			setTimeout(() => {
				toast.classList.remove('opacity-0', 'translate-y-2');
				toast.classList.add('opacity-100', 'translate-y-0');
			}, 30);
			setTimeout(() => {
				toast.classList.add('opacity-0', 'translate-y-2');
				setTimeout(() => {
					toast.remove();
					onClose();
				}, 300);
			}, stay);
		};
	}

	const meta = (name) => {
		const m = d.querySelector(`meta[name="${name}"]`);
		return m ? (m.content || '') : '';
	};
	const $sel = (sel, root = d) => root.querySelector(sel);
	const BODY = d.body;
	const CTX = BODY ? BODY.getAttribute('data-ctx') || '' : '';

	const buildRedirect = (provider) => {
		return `http://localhost:8080${CTX}/user/${provider}/callback`;
	};

	const wireBasicLogin = () => {
		const btnLogin = $sel('#btnLoginSubmit');
		const btnJoin = $sel('#btnGoJoin');
		const $id = $sel('[name="userId"]');
		const $pw = $sel('[name="password"]');
		const rememberCb = $sel('#rememberId');

		if (!btnLogin || !$id || !$pw) return;

		btnLogin.addEventListener('click', () => {
			const userId = $id.value.trim();
			const password = $pw.value.trim();

			if (!userId || !password) {
				nvToast('아이디와 비밀번호를 입력해주세요.', { type: 'error' });
				return;
			}

			if (rememberCb && rememberCb.checked) {
				try {
					w.localStorage.setItem('rememberUserId', userId);
				} catch (e) {}
			} else {
				try {
					w.localStorage.removeItem('rememberUserId');
				} catch (e) {}
			}

			$.ajax({
				url: `${CTX}/user/json/login`,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({ userId, password }),
				success: (res) => {
				  if (res && res.success === true) {
				    nvToast('로그인 성공!', {
				      type: 'success',
				      stay: 1000,
				      onClose: () => {
				        sessionStorage.setItem('forceShowLoader','1');
				        window.location.href = `${CTX}/index.jsp`;
				      }
				    });
				  } else {
				    const msg = (res && res.message) ? res.message : '아이디 또는 비밀번호가 올바르지 않습니다.';
				    nvToast(msg, { type: 'error' });
				  }
				},
				error: () => {
					nvToast('로그인 요청 중 오류가 발생했습니다.', { type: 'error' });
				}
			});
		});

		if (btnJoin) {
			btnJoin.addEventListener('click', () => {
				w.location.href = `${CTX}/user/addUserView.jsp`;
			});
		}

		if ($pw) {
			$pw.addEventListener('keyup', (e) => {
				if (e.key === 'Enter') {
					btnLogin.click();
				}
			});
		}

		try {
			const savedId = w.localStorage.getItem('rememberUserId');
			if (savedId && $id) {
				$id.value = savedId;
				if (rememberCb) {
					rememberCb.checked = true;
				}
			}
		} catch (e) {}
	};

	const wireKakaoLogin = () => {
		const btn = $sel('#btnKakao');
		if (!btn) return;

		const clientId = meta('kakao-client-id') || BODY.getAttribute('data-kakao-client') || '';
		if (!clientId) {
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

	const wireGoogleLogin = () => {
		const btn = $sel('#btnGoogle');
		if (!btn) return;

		const cid = meta('google-client-id') || BODY.getAttribute('data-google-client') || '';
		if (!cid) {
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

	const init = () => {
		wireBasicLogin();
		wireKakaoLogin();
		wireGoogleLogin();
	};

	if (d.readyState === 'loading') {
		d.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})(jQuery, window, document);

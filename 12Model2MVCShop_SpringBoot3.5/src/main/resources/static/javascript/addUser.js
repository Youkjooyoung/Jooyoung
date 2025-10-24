// /javascript/addUser.js
(($, w, d) => {
	'use strict';
	if (!w || !d || !$) return;

	// ✅ nvToast (간단 알림)
	const nvToast = (msg, type = 'info') => {
		const color =
			type === 'success' ? 'bg-naver text-white' :
				type === 'error' ? 'bg-red-500 text-white' :
					'bg-gray-800 text-white';
		const div = $('<div>')
			.addClass(`fixed bottom-10 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-md font-semibold text-sm ${color} opacity-0 transition-all duration-300`)
			.text(msg)
			.appendTo('body');
		setTimeout(() => div.addClass('opacity-100 translate-y-0'), 10);
		setTimeout(() => div.removeClass('opacity-100').addClass('opacity-0'), 2000);
		setTimeout(() => div.remove(), 2300);
	};

	// ✅ 유효성 규칙
	const patterns = {
		userId: /^[a-zA-Z0-9]{5,10}$/,
		password: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/,
		email: /^[0-9a-zA-Z._-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,}$/,
		phone2: /^\d{3,4}$/,
		phone3: /^\d{4}$/
	};

	// ✅ 상태 메시지 출력
	const showMsg = ($input, msg = '', type = 'error') => {
		let $msg = $input.siblings('.nv-msg');
		if (!$msg.length) {
			$msg = $('<div class="nv-msg text-xs mt-1 leading-tight"></div>').insertAfter($input);
		}

		// 색상 및 스타일 초기화
		$input.removeClass('border-naver border-red-500 ring-naver/30 ring-red-200');
		$msg.removeClass('text-naver text-red-500');

		if (type === 'success') {
			$input.addClass('border-naver ring-1 ring-naver/30');
			$msg.addClass('text-naver').text(`✔️ ${msg || '정상 입력입니다.'}`);
		} else {
			$input.addClass('border-red-500 ring-1 ring-red-200');
			$msg.addClass('text-red-500').text(`⚠️ ${msg || '입력 형식이 올바르지 않습니다.'}`);
		}
	};

	const clearMsg = ($input) => {
		$input.removeClass('border-red-500 ring-red-200 border-naver ring-naver/30');
		$input.siblings('.nv-msg').remove();
	};

	// ✅ 실시간 유효성 검사
	const wireLiveValidation = () => {
		$('#addUserForm').on('input change', 'input, select', function() {
			const $input = $(this);
			const name = $input.attr('name');
			const val = $input.val().trim();

			if (!val) {
				clearMsg($input);
				return;
			}

			switch (name) {
				case 'userId':
					patterns.userId.test(val)
						? showMsg($input, '사용 가능한 아이디 형식입니다.', 'success')
						: showMsg($input, '영문+숫자 5~10자로 입력하세요.', 'error');
					break;

				case 'password':
					patterns.password.test(val)
						? showMsg($input, '안전한 비밀번호 형식입니다.', 'success')
						: showMsg($input, '영문/숫자/특수문자 조합 8~20자.', 'error');
					break;

				case 'password2':
					val === $('[name="password"]').val().trim()
						? showMsg($input, '비밀번호가 일치합니다.', 'success')
						: showMsg($input, '비밀번호가 일치하지 않습니다.', 'error');
					break;

				case 'email':
					patterns.email.test(val)
						? showMsg($input, '올바른 이메일 형식입니다.', 'success')
						: showMsg($input, '이메일 형식이 잘못되었습니다.', 'error');
					break;

				case 'phone2':
				case 'phone3':
					patterns[name].test(val)
						? showMsg($input, '정상 입력입니다.', 'success')
						: showMsg($input, '숫자만 입력하세요.', 'error');
					break;

				default:
					clearMsg($input);
			}
		});
	};

	// ✅ 회원가입 버튼
	const wireAddUser = () => {
		const CTX = $('body').data('ctx') || $('body').attr('data-ctx') || '';
		const $form = $('#addUserForm');
		const $btnAdd = $('#btnAddUser');
		const $btnCancel = $('button[type="reset"]');
		if (!$btnAdd.length) return;

		wireLiveValidation();

		$btnAdd.on('click', () => {
			let invalidField = null;
			const required = [
				'userId', 'password', 'password2', 'userName',
				'addr', 'phone2', 'phone3', 'email'
			];

			required.forEach(name => {
				const $f = $(`[name="${name}"]`);
				const val = $f.val().trim();
				if (!val) {
					showMsg($f, '필수 입력 항목입니다.', 'error');
					if (!invalidField) invalidField = $f;
				}
			});

			if (invalidField) {
				invalidField.focus();
				nvToast('입력 항목을 다시 확인해주세요.', 'error');
				return;
			}

			const formData = {
				userId: $('[name="userId"]').val().trim(),
				password: $('[name="password"]').val().trim(),
				userName: $('[name="userName"]').val().trim(),
				addr: $('[name="addr"]').val().trim() + ' ' + ($('[name="addrDetail"]').val()?.trim() || ''),
				phone: `${$('[name="phone1"]').val()}-${$('[name="phone2"]').val()}-${$('[name="phone3"]').val()}`,
				email: $('[name="email"]').val().trim()
			};

			$.ajax({
				url: `${CTX}/user/json/addUser`,
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(formData),
				success: (res) => {
					if (res?.success) {
						nvToast('회원가입이 완료되었습니다!', 'success');
						setTimeout(() => {
							location.href = `${CTX}/user/loginView.jsp`;
						}, 1200);
					} else {
						nvToast(res?.message || '회원가입 중 오류 발생.', 'error');
					}
				},
				error: () => nvToast('서버 통신 오류입니다.', 'error')
			});
		});

		// 취소 버튼
		$btnCancel.on('click', () => {
			nvToast('회원가입이 취소되었습니다.', 'info');
			setTimeout(() => location.href = `${CTX}/user/loginView.jsp`, 800);
		});
	};

	$(() => wireAddUser());

})(jQuery, window, document);

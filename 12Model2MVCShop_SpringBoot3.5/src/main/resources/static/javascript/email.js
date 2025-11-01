// /javascript/email-handler.js
((w, d, $) => {
	'use strict';
	if (!$) return;

	$(() => {
		const $id = $('#emailId');
		const $domain = $('#emailDomain');
		const $custom = $('#emailCustom');
		const $hidden = $('#email');

		// ===== 이메일 업데이트 =====
		const updateEmail = () => {
			const id = $id.val().trim();
			let dom = $domain.val();

			if (dom === '직접입력' || dom === '') {
				dom = $custom.val().trim();
			}

			const email = id && dom ? `${id}@${dom}` : '';
			$hidden.val(email);
		};

		// ===== 도메인 변경 시 동작 =====
		$domain.on('change', (e) => {
			const val = $(e.currentTarget).val();
			if (val === '직접입력') {
				$custom.addClass('show').val('').focus();
			} else {
				$custom.removeClass('show').val('');
			}
			updateEmail();
		});

		// ===== 입력 이벤트 =====
		$id.on('input', updateEmail);
		$custom.on('input', updateEmail);

		// ===== 페이지 로드 시 기존 이메일 복원 =====
		const initEmail = $hidden.val();
		if (initEmail && initEmail.includes('@')) {
			const parts = initEmail.split('@');
			$id.val(parts[0]);
			const domain = parts[1];
			let found = false;

			$domain.find('option').each(function() {
				if ($(this).val() === domain) {
					$domain.val(domain);
					found = true;
				}
			});

			if (!found) {
				$domain.val('직접입력');
				$custom.addClass('show').val(domain);
			}
		}

		if ($domain.val() === '직접입력') {
			$custom.addClass('show').focus();
		}

		updateEmail();
	});
})(window, document, jQuery);

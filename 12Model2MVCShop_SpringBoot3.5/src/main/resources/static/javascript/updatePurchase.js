// /javascript/updatePurchase.js
(($, w, d) => {
	'use strict';
	if (!$) return;

	const val = (sel) => $.trim($(sel).val() || '');
	const showErr = ($i, msg) => {
		let $e = $i.siblings('.error-msg');
		if (!$e.length) $e = $('<span class="error-msg"/>').insertAfter($i);
		$e.text(msg).show();
		$i.addClass('is-invalid').removeClass('is-valid');
	};
	const clearErr = ($i) => {
		$i.siblings('.error-msg').hide();
		$i.removeClass('is-invalid').addClass('is-valid');
	};
	const normPhone = (s) => {
		const d = (s || '').replace(/[^\d]/g, '');
		if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
		if (d.length === 10) return d.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
		return d;
	};
	const futureOrToday = (ymd) => {
		if (!ymd) return true;
		const today = new Date(); today.setHours(0, 0, 0, 0);
		const parts = ymd.split('-');
		if (parts.length !== 3) return false;
		const dt = new Date(+parts[0], +parts[1] - 1, +parts[2]);
		return !isNaN(dt.getTime()) && dt >= today;
	};

	const validate = () => {
		let ok = true;
		const $name = $('[name=receiverName]');
		const $phone = $('[name=receiverPhone]');
		const $zip = $('[name=zipcode]');
		const $addr = $('[name=divyAddr]');
		const $detail = $('[name=addrDetail]');
		const $divy = $('[name=divyDate]');
		const $req = $('[name=divyRequest]');

		const name = val('[name=receiverName]');
		const phone = normPhone(val('[name=receiverPhone]'));
		const zip = val('[name=zipcode]');
		const addr = val('[name=divyAddr]');
		const detail = val('[name=addrDetail]');
		const divy = val('[name=divyDate]');
		const req = val('[name=divyRequest]');

		if (!name) { showErr($name, '수령인을 입력하세요.'); ok = false; } else clearErr($name);

		if (!phone) {
			showErr($phone, '연락처를 입력하세요.');
			ok = false;
		} else if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)) {
			showErr($phone, '예) 010-1234-5678');
			ok = false;
		} else { clearErr($phone); $phone.val(phone); }

		if (!zip) { showErr($zip, '우편번호를 선택하세요.'); ok = false; } else clearErr($zip);
		if (!addr) { showErr($addr, '기본 주소를 선택하세요.'); ok = false; } else clearErr($addr);
		if (!detail) { showErr($detail, '상세주소를 입력하세요.'); ok = false; } else clearErr($detail);
		if (req.length > 200) { showErr($req, '요청사항은 200자 이내'); ok = false; } else clearErr($req);
		if (!futureOrToday(divy)) { showErr($divy, '배송희망일은 오늘 이후'); ok = false; } else clearErr($divy);

		return ok;
	};

	$(() => {
		const CTX = (w.App && App.ctx) ? App.ctx() : ($('body').data('ctx') || '');

		// ===== 입력 시 실시간 검증 =====
		$(d).on('blur input change', 'input, textarea', () => validate());

		// ===== 수정 완료 =====
		$(d).on('click', '#btnUpdate', (e) => {
			e.preventDefault();
			if (!validate()) return;

			const $phone = $('[name=receiverPhone]');
			$phone.val($phone.val().replace(/-/g, ''));

			const form = $('form[name=purchaseForm]')[0];
			form.action = `${CTX}/purchase/update`;
			form.method = 'post';
			form.submit();
		});

		// ===== 취소 =====
		$(d).on('click', '#btnCancel', (e) => {
			e.preventDefault();
			const no = val('[name=tranNo]');
			if (no) {
				if (w.App?.go) w.App.go(`/purchase/${encodeURIComponent(no)}`);
				else location.href = `${CTX}/purchase/${encodeURIComponent(no)}`;
			} else {
				history.back();
			}
		});

		// ===== 실시간 전화번호 포맷 =====
		$(d).on('input', '[name=receiverPhone]', (e) => {
			$(e.currentTarget).val(normPhone($(e.currentTarget).val()));
		});

		// ===== 주소 검색 =====
		$(d).on('click', '#btnAddr', () => {
			$.getScript('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js', () => {
				new w.daum.Postcode({
					oncomplete: (data) => {
						let addr = (data.userSelectedType === 'R') ? data.roadAddress : data.jibunAddress;
						let extra = '';
						if (data.bname && /[동|로|가]$/g.test(data.bname)) extra += data.bname;
						if (data.buildingName && data.apartment === 'Y')
							extra += (extra ? `, ${data.buildingName}` : data.buildingName);
						if (extra) addr += ` (${extra})`;

						$('#zipcode').val(data.zonecode);
						$('#divyAddr').val(addr);
						$('#addrDetail').val('').focus();
						validate();
					}
				}).open();
			});
		});
	});
})(jQuery, window, document);

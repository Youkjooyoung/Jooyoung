/* /javascript/addPurchase.js */
(($, w, d) => {
	'use strict';
	if (!$) return;

	// -------------------- 공통 유틸 --------------------
	const ensureMark = ($input) => {
		if (!$input.siblings('.vmark').length)
			$('<span class="vmark" aria-hidden="true"/>').insertAfter($input);
	};

	const setMark = ($input, ok) => {
		ensureMark($input);
		const $m = $input.siblings('.vmark');
		if (ok) $m.removeClass('err').addClass('ok').show();
		else $m.removeClass('ok').addClass('err').show();
	};

	const showErr = ($el, msg) => {
		let $msg = $el.closest('td').find('.error-msg');
		if (!$msg.length) $msg = $('<span class="error-msg"/>').appendTo($el.closest('td'));
		$msg.text(msg).removeClass('hidden');
		$el.addClass('input-error');
	};

	const hideErr = ($el) => {
		const $msg = $el.closest('td').find('.error-msg');
		$msg.addClass('hidden');
		$el.removeClass('input-error');
	};

	const isPhone = (v) => /^01[016789]-\d{3,4}-\d{4}$/.test(v);

	const autoHyphenPhone = (val) => {
		val = val.replace(/[^0-9]/g, '');
		if (val.length < 4) return val;
		if (val.length < 8) return val.replace(/(\d{3})(\d+)/, '$1-$2');
		return val.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
	};

	$(() => {
		const ctx = $('body').data('ctx') || '';
		const $form = $('form[name=purchaseForm]');
		const $modal = $('#confirmModal');
		let isPostcodeLoaded = false;

		// -------------------- 총 가격 계산 --------------------
		(() => {
			const unit = Number(String($form.data('unit-price') || '0').replace(/[^\d]/g, '')) || 0;
			const $qty = $('#qty');
			const $total = $('#totalPrice');

			const fmt = (n) => Number(n).toLocaleString('ko-KR');
			const update = () => {
				let q = parseInt($qty.val() || '1', 10);
				if (isNaN(q) || q < 1) q = 1;
				$total.text(`${fmt(unit * q)} 원`);
			};

			update();
			$qty.on('input change', update);
		})();

		// -------------------- 날짜 제한(오늘 이전 불가) --------------------
		const $date = $form.find('[name=divyDate]');
		if ($date.length) {
			const t = new Date();
			t.setHours(0, 0, 0, 0);
			const y = t.getFullYear();
			const m = (`0${t.getMonth() + 1}`).slice(-2);
			const dd = (`0${t.getDate()}`).slice(-2);
			$date.attr('min', `${y}-${m}-${dd}`);
		}

		// -------------------- 내정보 자동입력 --------------------
		$(d).on('click', '#btnSameInfo', () => {
			$.getJSON(`${ctx}/user/json/me`, (res) => {
				if (res && res.loggedIn) {
					$('[name=receiverName]').val(res.userName || '');
					$('[name=receiverPhone]').val(res.phone || '');
					$('#zipcode').val(res.zipcode || '');
					$('#divyAddr').val(res.addr || '');
					$('#addrDetail').val(res.addrDetail || '');
				} else alert('로그인 정보가 없습니다.');
			}).fail(() => alert('사용자 정보를 불러오지 못했습니다.'));
		});

		// -------------------- 다음 주소검색 --------------------
		$(d).on('click', '#btnAddr', () => {
			const openPostcode = () => {
				try {
					new w.daum.Postcode({
						oncomplete: (data) => {
							$('#zipcode').val(data.zonecode);
							$('#divyAddr').val(data.roadAddress || data.jibunAddress);
							$('#addrDetail').val('').focus();
							validateAddr();
						},
					}).open();
				} catch (e) {
					w.open(
						'https://postcode.map.daum.net/search',
						'postcode',
						'width=500,height=600,scrollbars=yes,resizable=yes'
					);
				}
			};

			if (isPostcodeLoaded || (w.daum && w.daum.Postcode)) return openPostcode();
			const s = d.createElement('script');
			s.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'; // ❌ 파라미터 금지
			s.async = true;
			s.onload = () => { isPostcodeLoaded = true; openPostcode(); };
			s.onerror = () => alert('우편번호 API 로드 실패: 네트워크/CSP 설정 확인');
			d.head.appendChild(s);
		});

		// -------------------- 폰 자동하이픈 + 검증 --------------------
		$(d).on('input', '[name=receiverPhone]', function() {
			this.value = autoHyphenPhone(this.value);
			validatePhone();
		});

		// -------------------- 필드별 검증 --------------------
		const validateName = () => {
			const $el = $('[name=receiverName]');
			const v = ($el.val() || '').trim();
			const ok = v.length >= 2;
			if (!ok) showErr($el, '수령인을 입력하세요.');
			else hideErr($el);
			setMark($el, ok);
			return ok;
		};

		const validatePhone = () => {
			const $el = $('[name=receiverPhone]');
			const v = ($el.val() || '').trim();
			const ok = isPhone(v);
			if (!ok) showErr($el, '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
			else hideErr($el);
			setMark($el, ok);
			return ok;
		};

		const validateAddr = () => {
			const $zip = $('#zipcode');
			const $addr = $('#divyAddr');
			const ok = !!$zip.val().trim() && !!$addr.val().trim();
			if (!ok) showErr($addr, '우편번호와 기본주소를 입력하세요.');
			else hideErr($addr);
			setMark($addr, ok);
			return ok;
		};

		const validateDate = () => {
			const $el = $('[name=divyDate]');
			const ok = !!$el.val();
			if (!ok) showErr($el, '배송일자를 선택하세요.');
			else hideErr($el);
			setMark($el, ok);
			return ok;
		};

		const validateForm = () =>
			!!(validateName() & validatePhone() & validateAddr() & validateDate());

		$(d).on('blur input change', 'input, textarea, select', function() {
			const n = $(this).attr('name');
			switch (n) {
				case 'receiverName':
					validateName();
					break;
				case 'receiverPhone':
					validatePhone();
					break;
				case 'zipcode':
				case 'divyAddr':
				case 'addrDetail':
					validateAddr();
					break;
				case 'divyDate':
					validateDate();
					break;
			}
		});

		// -------------------- 주문등록 → 확인 모달 --------------------
		$(d).on('click', '[data-role=submit]', (e) => {
			e.preventDefault();
			if (!validateForm()) return alert('입력값을 확인해주세요.');
			$modal.css('display', 'flex').hide().fadeIn(120);
		});

		$(d).on('click', '[data-role=close]', () => $modal.fadeOut(100));
		$modal.on('click', (e) => {
			if (e.target === e.currentTarget) $modal.fadeOut(100);
		});

		// -------------------- 확인 → 실제 제출 --------------------
		$(d).on('click', '[data-role=confirm]', (e) => {
			e.preventDefault();
			$(e.currentTarget).prop('disabled', true);
			d.purchaseForm.action = `${ctx}/purchase/addPurchase`;
			d.purchaseForm.method = 'post';
			d.purchaseForm.submit();
		});

		// -------------------- 카카오페이 결제 --------------------
		$(d).on('click', '#btnKakaoPay', (e) => {
			e.preventDefault();
			if (!validateForm()) return alert('입력값을 확인해주세요.');

			const prodNo = $('[name="purchaseProd\\.prodNo"]').val();
			const itemName = `${prodNo}번 상품`;
			const quantity = parseInt($('#qty').val() || '1', 10);
			const unitPrice =
				Number(String($form.data('unit-price')).replace(/[^\d]/g, '')) || 0;
			const totalAmount = unitPrice * quantity;

			const payload = {
				itemName,
				quantity,
				totalAmount,
				prodNo,
				receiverName: $('[name=receiverName]').val().trim(),
				receiverPhone: ($('[name=receiverPhone]').val() || '').replace(/[^0-9]/g, ''),
				zipcode: $('#zipcode').val().trim(),
				divyAddr: $('#divyAddr').val().trim(),
				addrDetail: $('#addrDetail').val().trim(),
				divyDate: $('[name=divyDate]').val(),
				divyRequest: $('[name=divyRequest]').val(),
			};

			$.ajax({
				url: `${ctx}/purchase/kakao/ready`,
				type: 'POST',
				dataType: 'json',
				data: payload,
				success: (data) => {
					document.cookie = `kp_tid=${encodeURIComponent(data.tid)}; path=/`;
					if (data.next_redirect_pc_url) {
						sessionStorage.setItem('prodNo', prodNo);
						sessionStorage.setItem('qty', quantity);
						w.location.href = data.next_redirect_pc_url;
					} else alert('카카오페이 결제 URL이 없습니다.');
				},
				error: (xhr, status, err) => {
					console.error('카카오페이 준비 실패:', status, err);
					alert('카카오페이 결제 요청 중 오류가 발생했습니다.');
				},
			});
		});

		// -------------------- 취소 → 상품 상세로 --------------------
		$(d).on('click', '[data-role=cancel]', (e) => {
			e.preventDefault();
			const prodNo = $('[name="purchaseProd\\.prodNo"]').val();
			w.location.href = `${ctx}/product/getProduct?prodNo=${encodeURIComponent(prodNo)}`;
		});

		// -------------------- 이미지: 더보기/접기 + 라이트박스 --------------------
		(() => {
			const $grid = $('#imgGrid');
			const $btnMore = $('#btnImgMore');
			const $items = $grid.find('.img-box img');
			if (!$items.length) return;

			const recheckMore = () => {
				const needed = $grid[0].scrollHeight > $grid.outerHeight() + 4;
				$btnMore.toggle(needed);
			};

			recheckMore();
			$(w).on('resize', () => setTimeout(recheckMore, 50));

			$btnMore.on('click', () => {
				const exp = $grid.toggleClass('is-expanded').hasClass('is-expanded');
				$btnMore.text(exp ? '접기' : '이미지 더보기');
			});

			const $lb = $('#imgLightbox');
			const $lbImg = $('#lbImg');
			let cur = 0;

			const openLB = (i) => {
				cur = i;
				$lbImg.attr('src', $($items[cur]).attr('src'));
				$lb.css('display', 'flex').hide().fadeIn(120);
			};
			const closeLB = () => $lb.fadeOut(100);
			const move = (n) => {
				if (!$items.length) return;
				cur = (cur + n + $items.length) % $items.length;
				$lbImg.attr('src', $($items[cur]).attr('src'));
			};

			$(d).on('click', '.img-box img', function() {
				openLB($items.index(this));
			});
			$(d).on('click', '[data-role=lb-close]', closeLB);
			$(d).on('click', '[data-role=lb-prev]', () => move(-1));
			$(d).on('click', '[data-role=lb-next]', () => move(1));
			$lb.on('click', (e) => {
				if (e.target === e.currentTarget) closeLB();
			});
		})();
	});
})(jQuery, window, document);

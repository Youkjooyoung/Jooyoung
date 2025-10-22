(($, w, d) => {
	'use strict';
	if (!$) return;
	const ctx = () => $('body').data('ctx') || '';
	const $root = () => $('.nv-panel[data-page="user-update"]').first();

	const ensurePostcode = () => new Promise((resolve, reject) => {
		if (w.daum && w.daum.Postcode) { resolve(); return; }
		const s = d.createElement('script');
		s.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
		s.onload = () => resolve();
		s.onerror = () => reject();
		d.head.appendChild(s);
	});

	const openPostcode = async () => {
		try {
			await ensurePostcode();
			const pc = new w.daum.Postcode({
				oncomplete: (data) => {
					const addr = data.address || '';
					const zone = data.zonecode || '';
					const $f = $root().find('#userEditForm');
					$f.find('[name=addr]').val(addr);
					$f.find('[name=zipcode]').val(zone);
					$f.find('[name=addrDetail]').focus();
				}
			});
			pc.open();
		} catch (e) { }
	};

	const dto = () => {
		const $f = $root().find('#userEditForm');
		const p1 = $f.find('[name=phone1]').val() || '';
		const p2 = $f.find('[name=phone2]').val() || '';
		const p3 = $f.find('[name=phone3]').val() || '';
		const phone = (p1 && p2 && p3) ? `${p1}-${p2}-${p3}` : '';
		const base = ($f.find('[name=addr]').val() || '').trim();
		const detail = ($f.find('[name=addrDetail]').val() || '').trim();
		const addr = detail ? `${base} ${detail}` : base;
		return {
			userId: $f.find('[name=userId]').val(),
			userName: $f.find('[name=userName]').val(),
			addr,
			email: $f.find('[name=email]').val(),
			phone
		};
	};

	const valid = (m) => {
		if (!m.userName) return '이름 누락';
		if (m.email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$/.test(m.email)) return '이메일 형식 오류';
		if (m.phone && !/^\d{2,3}-\d{3,4}-\d{4}$/.test(m.phone)) return '전화번호 형식 오류';
		if (!m.addr) return '주소 누락';
		return '';
	};

	const goMyInfo = () => {
		const pretty = `${ctx()}/user/myInfo`;
		const partial = `${pretty}?embed=1 [data-page=user-detail]:first`;
		if (w.__layout?.loadMain) {
			w.__layout.loadMain(partial);
			if (history?.pushState) history.pushState({ pretty, partial }, '', pretty);
		} else {
			w.location.href = pretty;
		}
	};

	const save = () => {
		const m = dto();
		const v = valid(m);
		if (v) return;
		$.ajax({
			url: `${ctx()}/user/json/updateUser`,
			method: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(m)
		}).done(() => { goMyInfo(); });
	};

	const cancel = () => {
		if (history.length > 1) { history.back(); return; }
		goMyInfo();
	};

	$(() => {
		$(d).on('click', '[data-page="user-update"] [data-role="addr-search"]', (e) => { e.preventDefault(); openPostcode(); });
		$(d).on('click', '[data-page="user-update"] [data-role="save"]', (e) => { e.preventDefault(); save(); });
		$(d).on('click', '[data-page="user-update"] [data-role="cancel"]', (e) => { e.preventDefault(); cancel(); });
	});
})(window.jQuery, window, document);
